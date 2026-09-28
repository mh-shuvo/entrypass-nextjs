"use client";

import { SafeUser } from "@/repository/user.repository";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import UserModal from "@/components/User/UserModal";

interface UserDetailsCard {
  user: SafeUser;
}

function Field({ label, children }: { label: string; children: ReactNode }): React.JSX.Element {
  return (
    <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 font-semibold break-words text-zinc-900">{children}</p>
    </div>
  );
}

export default function UserDetailsCard({ user }: UserDetailsCard) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalSeed, setModalSeed] = useState(0);

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const showUserEditModal = () => {
    setModalSeed((value) => value + 1);
    setIsOpen(true);
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-violet-100">
            <Image
              src="/window.svg"
              alt="User"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{user.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                {user.UserType}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          onClick={showUserEditModal}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="mr-2 size-4" aria-hidden="true" />
          Edit profile
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Full Name">{user.name}</Field>
        <Field label="Email Address">{user.email}</Field>
        <Field label="Phone Number">{user.phone ?? "-"}</Field>
        <Field label="Role">{user.UserType}</Field>
        <Field label="Social Links">
          <span className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[#1DA1F2] hover:underline">
              <FontAwesomeIcon icon={faTwitter} className="size-4" aria-hidden="true" />
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-zinc-900 hover:underline">
              <FontAwesomeIcon icon={faGithub} className="size-4" aria-hidden="true" />
              GitHub
            </a>
          </span>
        </Field>
      </div>

      <UserModal
        key={`${user.id}-${user.phone ?? "empty"}-${modalSeed}`}
        isOpen={isOpen}
        onClose={closeModal}
        modalTitle={"Edit " + user.name}
        user={user}
      />
    </div>
  );
}