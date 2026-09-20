"use server";
import { Prisma } from "@prisma/client";
import { UserService } from "@/services/user.service";
import { UserRepository, type SafeUser } from "@/repository/user.repository";
import {type UserPasswordChangeState, type UserCreateState } from "@/lib/validation/user";
import {UserCreateSchema,UserPasswordChangeSchema} from "@/lib/validation/user";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/authz";

const userService = new UserService(new UserRepository)
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string>> };

export async function createUserAction(payload:UserCreateState): Promise<ActionResult<SafeUser>>{
    const authorization = await authorize("manage_user");
    if (!authorization.authorized) {
        return { success: false, error: authorization.error };
    }

    // 1. Validate shape/format — same schema your form already uses
    const parsed = await UserCreateSchema.safeParseAsync(payload);
    if(!parsed.success){
        const nextFieldErrors: Partial<Record<keyof UserCreateState, string>> = {};
        for (const issue of parsed.error.issues) {
            const fieldName = issue.path[0] as keyof UserCreateState;
            if (!nextFieldErrors[fieldName]) {
                nextFieldErrors[fieldName] = issue.message;
            }
        }
        return {
            success: false,
            error: "Validation failed",
            fieldErrors: nextFieldErrors
        }
    }
    try {
        const user = await userService.createUser(parsed.data);
        return { success: true, data: user };
    } catch (error) {
        // The schema's uniqueness check can pass and still lose a race to a
        // concurrent insert; the `@unique` index on `email` is what actually holds.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
                success: false,
                error: "Validation failed",
                fieldErrors: { email: "This email already taken. Please try with another email" }
            }
        }

        console.error("createUserAction failed", error);
        return { success: false, error: "Something went wrong. Please try again." }
    }
}

export async function changePasswordAction(payload:UserPasswordChangeState):Promise<ActionResult>{
    const parsed = await UserPasswordChangeSchema.safeParseAsync(payload)
    if(!parsed.success){
        const nextFieldErrors: Partial<Record<keyof UserPasswordChangeState, string>> = {};
        for (const issue of parsed.error.issues) {
            const fieldName = issue.path[0] as keyof UserPasswordChangeState;
            if (!nextFieldErrors[fieldName]) {
                nextFieldErrors[fieldName] = issue.message;
            }
        }
        return {
            success: false,
            error: "Validation failed",
            fieldErrors: nextFieldErrors
        }
    }

    try {
        await userService.changePassword(parsed.data);
        return { success: true, data: undefined };
    } catch (error) {
        console.error("changePasswordAction failed", error);
        return { success: false, error: "Something went wrong. Please try again." }
    }
}

export async function deleteUserAction(userId:number):Promise<ActionResult>{
    const authorization = await authorize("manage_user");
    if (!authorization.authorized) {
        return { success: false, error: authorization.error };
    }

    if (authorization.actor.id === userId) {
        return { success: false, error: "You cannot delete your own account." };
    }

    const hasUserExists = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!hasUserExists) {
        return {
            success: false,
            error: "User not found"
        }
    }

    // Otherwise `manage_user` would let an executive remove the accounts that
    // grant `manage_user` in the first place.
    if (hasUserExists.UserType === "SUPERADMIN" && authorization.actor.UserType !== "SUPERADMIN") {
        return { success: false, error: "You do not have permission to do that." };
    }

    try {
        await prisma.user.delete({ where: { id: userId } });
    } catch (error) {
        console.error("deleteUserAction failed", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }

    revalidatePath("/dashboard/users");
    return { success: true, data: undefined };
}

