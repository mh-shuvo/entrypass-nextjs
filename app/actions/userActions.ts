"use server";
import { refresh } from "next/cache";
import { Prisma } from "@prisma/client";
import { UserService } from "@/services/user.service";
import { UserRepository, type SafeUser } from "@/repository/user.repository";
import {type UserCreateState } from "@/lib/validation/user";
import {UserCreateSchema} from "@/lib/validation/user";

const userService = new UserService(new UserRepository)
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string>> };

export async function createUserAction(payload:UserCreateState): Promise<ActionResult<SafeUser>>{
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
        // The list page reads Prisma directly (no `use cache`), so there is no cache
        // entry to invalidate — the client router just needs to re-fetch the tree.
        refresh();
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
