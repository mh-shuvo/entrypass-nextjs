"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface NewUserModalProps {
    isOpen:boolean,
    onClose: () => void,
    modalTitle:string

}

type PasswordField = "password" | "confirmPassword";

export default function UserModal({ isOpen, onClose,modalTitle}: NewUserModalProps) {

    const [visiblePasswords, setVisiblePasswords] = useState<Record<PasswordField, boolean>>({
        password: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field: PasswordField) => {
        setVisiblePasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    if(!isOpen){
        return null;
    }
    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">
                &times;
                </button>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {modalTitle}
                </h3>
                <div className="mb-6">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            autoComplete="name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                                id="password"
                                name="password"
                                type={visiblePasswords.password ? "text" : "password"}
                                placeholder="secure-password"
                                autoComplete="password"
                            />
                            <button type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            aria-label="Toggle password visibility" className="absolute inset-y-0 inset-e-0 flex items-center z-20 px-3 cursor-pointer text-muted-foreground rounded-e-md focus:outline-hidden focus:text-primary-focus">
                              <FontAwesomeIcon icon={visiblePasswords.password ? faEyeSlash : faEye} className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                                id="confirm-password"
                                name="confirm-password"
                                type={visiblePasswords.confirmPassword ? "text" : "password"}
                                placeholder="secure-password"
                                autoComplete="confirm-password"
                            />
                            <button type="button"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                            aria-label="Toggle confirm password visibility" className="absolute inset-y-0 inset-e-0 flex items-center z-20 px-3 cursor-pointer text-muted-foreground rounded-e-md focus:outline-hidden focus:text-primary-focus">
                              <FontAwesomeIcon icon={visiblePasswords.confirmPassword ? faEyeSlash : faEye} className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Confirm
                    </button>
                </div>

            </div>
            </div>

        </>
    )
}
