"use client"
import { SafeUser } from "@/repository/user.repository";
import UserPasswordChangeModal from "@/components/User/UserPasswordChangeModal"
import {useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export default function UserSecuritySection(user:SafeUser){
    const [isOpen,setIsOpen] = useState(false)

    const closeModal=():void=>{
        setIsOpen(false)        
    }
    const showPasswordChangeModal = ()=>{
        setIsOpen(true)
    }
    return(
        <div className="w-full rounded-2xl border border-slate-300 bg-neutral-secondary-low p-5 mt-3">
            <p className="text-md font-semibold pb-2">Security</p>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-semibold">Change Password</p>
                    <p className="text-sm text-muted">Receive real-time notifications and team alerts.</p>
                </div>
                <div>
                    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={showPasswordChangeModal}
                    >
                        <span className="inline-flex items-center text-[15px]">
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-2 size-4" aria-hidden="true" />
                            Change Password
                        </span>
                    </button>
                </div>
            </div>
            <UserPasswordChangeModal isOpen={isOpen} user={user} onClose={closeModal} />
        </div>
    )

}