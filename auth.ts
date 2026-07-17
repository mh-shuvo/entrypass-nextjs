import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import prisma from "@/lib/prisma";

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
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
                });

                if (!user) {
                    return null;
                }

                console.log("User found:", user);

                const isPasswordValid = await compare(parsedCredentials.data.password, user.password);
                console.log("Password valid:", isPasswordValid);

                if (!isPasswordValid) {
                    console.log("Invalid password for user:", user.email);
                    return null;
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "entrypass-nextauth-secret",
};