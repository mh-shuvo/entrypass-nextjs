import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import prisma from "@/lib/prisma";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id?: string | null;
            permissions?: string[];
        };
    }

    interface User {
        permissions?: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        permissions?: string[];
    }
}

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
        updateAge: 30 * 60, // 30 minutes
    },
    jwt: {
        maxAge: 8 * 60 * 60, // 8 hours
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const typedUser = user as User & { permissions?: string[] };
                token.permissions = typedUser.permissions ?? [];
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub ?? session.user?.id ?? null,
                    permissions: Array.isArray(token.permissions) ? token.permissions : [],
                },
            };
        },
    },
    providers: [
        CredentialsProvider({
            id: "admin",
            name: "Admin",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsedCredentials = loginSchema.safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: parsedCredentials.data.email,
                        status: "ACTIVE",
                        deletedAt: null,
                    },
                    include: {
                        permissions: {
                            where: { deletedAt: null },
                            select: { permission: true },
                        },
                    },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(parsedCredentials.data.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    permissions: user.permissions.map((entry) => entry.permission),
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};