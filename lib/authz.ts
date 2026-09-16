import { getServerSession } from "next-auth/next";
import type { Permission, UserType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type Actor = { id: number; UserType: UserType };

export type AuthorizeResult =
  | { authorized: true; actor: Actor }
  | { authorized: false; error: string };

// A server action is a public POST endpoint, so the acting user is always
// re-read from the database: the session only proves which email signed in, not
// what that account is still allowed to do.
export async function authorize(permission: Permission): Promise<AuthorizeResult> {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
        return { authorized: false, error: "You must be signed in to do that." };
    }

    const actor = await prisma.user.findFirst({
        where: { email, status: "ACTIVE", deletedAt: null },
        select: {
            id: true,
            UserType: true,
            permissions: {
                where: { permission, deletedAt: null },
                select: { id: true },
            },
        },
    });

    if (!actor) {
        return { authorized: false, error: "You must be signed in to do that." };
    }

    if (actor.UserType !== "SUPERADMIN" && actor.permissions.length === 0) {
        return { authorized: false, error: "You do not have permission to do that." };
    }

    return { authorized: true, actor: { id: actor.id, UserType: actor.UserType } };
}
