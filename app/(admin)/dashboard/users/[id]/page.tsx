import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageTitle } from "@/lib/metadata";
import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repository/user.repository";
import DeleteUserButton from "@/components/User/DeleteUserButton";
import UserDetailsCard from "./user_details";
import UserSecuritySection from "./security_component"

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
        <>
        <UserDetailsCard user={user} />

        <UserSecuritySection user={user}/>

        <div className="w-full rounded-2xl border border-red-500 bg-neutral-secondary-low p-5 mt-3">
            <p className="text-md font-semibold pb-2 text-red-500">Danger Zone</p>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-semibold">Delete Account</p>
                    <p className="text-sm text-muted">You will not able to retrieve your account. All of associated data will be deleted.</p>
                </div>
                <div>
                    <DeleteUserButton userId={user.id} />
                </div>
            </div>
        </div>

        </>
    );
}