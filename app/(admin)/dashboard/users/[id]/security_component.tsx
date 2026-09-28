"use client";
import { SafeUser } from "@/repository/user.repository";
import UserPasswordChangeModal from "@/components/User/UserPasswordChangeModal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

type UserSecuritySectionProps = {
  user: SafeUser;
};

export default function UserSecuritySection({ user }: UserSecuritySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const showPasswordChangeModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="mt-3 w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Security</p>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-zinc-900">Change password</p>
          <p className="mt-1 text-sm text-zinc-600">Keep the account secure with a fresh password and updated credentials.</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          onClick={showPasswordChangeModal}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="mr-2 size-4" aria-hidden="true" />
          Change Password
        </button>
      </div>

      <UserPasswordChangeModal isOpen={isOpen} user={user} onClose={closeModal} />
    </div>
  );
}