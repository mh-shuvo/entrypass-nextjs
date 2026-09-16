"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteUserAction } from "@/app/actions/userActions";

export default function DeleteUserButton({ userId }: { userId: number }) {
    const [isDeleting, startDeleting] = useTransition();
    const router = useRouter();

    const handleDeleteClick = () => {
        if (!window.confirm("Delete this user? This cannot be undone.")) {
            return;
        }

        startDeleting(async () => {
            const result = await deleteUserAction(userId);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success("User successfully deleted");
            router.push("/dashboard/users");
        });
    };

    return (
        <button
            type="button"
            className="rounded-xl border border-red-500 px-4 py-2 hover:bg-red-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleDeleteClick}
            disabled={isDeleting}
        >
            <span className="inline-flex items-center text-[15px] text-red-500">
                <FontAwesomeIcon icon={faTrash} className="mr-2 size-4" aria-hidden="true" />
                {isDeleting ? "Deleting..." : "Delete"}
            </span>
        </button>
    );
}
