"use client"

import { SafeUser } from "@/repository/user.repository";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import UserModal from "@/components/User/UserModal"
interface UserDetailsCard {
  user: SafeUser;
}

function Field({ label, children }: { label: string; children: ReactNode }): React.JSX.Element {
    return (
        <div className="min-w-0">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-semibold break-words">{children}</p>
        </div>
    );
}

export default function UserDetailsCard({ user }: UserDetailsCard) {
    const [isOpen,setIsOpen] = useState(false)

    const closeModal=():void=>{
        setIsOpen(false)        
    }
    const showUserEditModal = () =>{
        setIsOpen(true)
    }
    return (
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
                    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={showUserEditModal}
                    >
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
                <Field label="Phone Number">{user.phone ?? "-"}</Field>
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
            <UserModal isOpen={isOpen} onClose={closeModal} modalTitle={"Edit"+" "+user.name} user={user} />
        </div>
    )
 }