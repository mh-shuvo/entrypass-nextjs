import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageTitle } from "@/lib/metadata";
import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repository/user.repository";
import DeleteUserButton from "@/components/User/DeleteUserButton";
import UserDetailsCard from "./user_details";
import UserSecuritySection from "./security_component"
import UserAccessControl from "./access_controls"

const userService = new UserService(new UserRepository());
const getUser = cache((id: number) => userService.getUserById(id));
function parseUserId(rawId: string): number | null {
    if (!/^\d+$/.test(rawId)) {
        return null;
    }

    const id = Number(rawId);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

type ViewUserPageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ViewUserPageProps): Promise<Metadata> {
    const id = parseUserId((await params).id);

    if (id === null) {
        return pageTitle("User Not Found");
    }

    const user = await getUser(id);
    return pageTitle(user?.name ? `${user.name} - User` : "User Not Found");
}

export default async function ViewUserPage({ params }: ViewUserPageProps) {
    const id = parseUserId((await params).id);

    if (id === null) {
        notFound();
    }

    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-3">
            <UserDetailsCard user={user} />

            <UserSecuritySection user={user}/>

            <UserAccessControl user={user}/>

            <div className="mt-3 w-full rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Danger zone</p>
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-zinc-900">Delete account</p>
                        <p className="mt-1 text-sm text-zinc-600">This action cannot be undone and will remove the user and their related records.</p>
                    </div>
                    <DeleteUserButton userId={user.id} />
                </div>
            </div>
        </div>
    );
}