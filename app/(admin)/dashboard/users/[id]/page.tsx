import { cache, type ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageTitle } from "@/lib/metadata";
import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repository/user.repository";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import DeleteUserButton from "@/components/User/DeleteUserButton";
const userService = new UserService(new UserRepository());
const getUser = cache((id: number) => userService.getUserById(id));
function parseUserId(rawId: string): number | null {
    if (!/^\d+$/.test(rawId)) {
        return null;
    }

    const id = Number(rawId);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-semibold break-words">{children}</p>
        </div>
    );
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
        <div className="w-full rounded-2xl border border-slate-300 bg-neutral-secondary-low pb-5">
            <div className="flex items-start p-5">
                <div className="h-24 w-24 shrink-0">
                    <Image
                        src="/usericon.png"
                        alt="User"
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-full object-cover"
                    />
                </div>
                <div className="ml-4 min-w-0">
                    <h1 className="pt-4 text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-2 pt-3">
                        <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                            {user.UserType}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-xs ${user.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            {user.status}
                        </span>
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-gray-200">
                        <span className="inline-flex items-center text-[15px]">
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-2 size-4" aria-hidden="true" />
                            Edit
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 px-3 pt-3 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Full Name">{user.name}</Field>
                <Field label="Email Address">{user.email}</Field>
                <Field label="Phone Number">+1 123-456-7890</Field>
                <Field label="Bio">{user.UserType}</Field>
                <Field label="Social Links">
                    <span className="flex items-center gap-3">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[#1DA1F2] hover:underline">
                            <FontAwesomeIcon icon={faTwitter} className="size-4" aria-hidden="true" />
                            Twitter
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-900 hover:underline">
                            <FontAwesomeIcon icon={faGithub} className="size-4" aria-hidden="true" />
                            GitHub
                        </a>
                    </span>
                </Field>
            </div>
        </div>

        <div className="w-full rounded-2xl border border-slate-300 bg-neutral-secondary-low p-5 mt-3">
            <p className="text-md font-semibold pb-2">Security</p>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-semibold">Change Password</p>
                    <p className="text-sm text-muted">Receive real-time notifications and team alerts.</p>
                </div>
                <div>
                    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <span className="inline-flex items-center text-[15px]">
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-2 size-4" aria-hidden="true" />
                            Change Password
                        </span>
                    </button>
                </div>
            </div>
        </div>

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