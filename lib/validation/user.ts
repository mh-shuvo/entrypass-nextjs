import { z } from "zod";
import prisma from "@/lib/prisma";

const bangladeshPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

const UserCreateSchema = z.object({
    userId: z.preprocess(
        (value) => {
            if (value === undefined || value === null || value === "") {
                return undefined;
            }

            if (typeof value !== "string") {
                return value;
            }

            const normalized = value.trim().replace(/\s+/g, "").replace(/[()\-]/g, "");
            return normalized === "" ? undefined : Number(normalized);
        },
        z.number()
            .int("User ID must be a valid integer")
            .positive("User ID must be a positive number")
            .optional()
            .refine(
                async (userId) => {
                    if (userId === undefined) return true;

                    const user = await prisma.user.findUnique({ where: { id: userId } });
                    return !!user;
                },
                {
                    message: "Reference does not exist in the system.",
                }
            )
    ),
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    password: z.preprocess(
        (value) => (value === undefined || value === null || value === "" ? undefined : value),
        z.string().min(8, "Minimum character length 8").optional()
    ),
    confirmPassword: z.preprocess(
        (value) => (value === undefined || value === null || value === "" ? undefined : value),
        z.string().min(8, "Minimum character length 8").optional()
    ),
    phone: z.preprocess(
        (value) => {
            if (typeof value !== "string") {
                return value;
            }

            return value.trim().replace(/\s+/g, "").replace(/[()\-]/g, "");
        },
        z.string()
            .min(1, "Phone is required")
            .refine((phone) => bangladeshPhoneRegex.test(phone), {
                message: "Phone number must be a valid Bangladeshi mobile number.",
            })
    ),
}).superRefine(async (data, ctx) => {
    const userId = data.userId;

    if (data.userId === undefined) {
        if (!data.password) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "Password is required",
            });
        }

        if (!data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Confirm Password is required",
            });
        }
    }

    if (data.password !== undefined && data.confirmPassword !== undefined) {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Password do not match",
            });
        }
    }

    if (data.email) {
        const existingEmailUser = await prisma.user.findFirst({
            where: {
                email: data.email,
                NOT: userId !== undefined ? { id: userId } : undefined,
            },
        });

        if (existingEmailUser) {
            ctx.addIssue({
                code: "custom",
                path: ["email"],
                message: "This email already taken. Please try with another email",
            });
        }
    }

    if (data.phone) {
        const existingPhoneUser = await prisma.user.findFirst({
            where: {
                phone: data.phone,
                NOT: userId !== undefined ? { id: userId } : undefined,
            },
        });

        if (existingPhoneUser) {
            ctx.addIssue({
                code: "custom",
                path: ["phone"],
                message: "The entered phone is already used in another account.",
            });
        }
    }
});

type UserCreateState = z.infer<typeof UserCreateSchema>;

export { UserCreateSchema };
export type { UserCreateState };