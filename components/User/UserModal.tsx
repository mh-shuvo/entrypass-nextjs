"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import type {UserCreateState} from "@/lib/validation/user";
import { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import {createUserAction} from "@/app/actions/userActions"
import { useRouter } from "next/navigation";
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
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false)
    const [formData, setFormData] = useState<UserCreateState>({ name:"", email:"",password:"",confirmPassword:"" })
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UserCreateState, string>>>({});
    const router = useRouter();

    const closeModal = ()=>{
        setIsSubmitting(false)
        setFormData({ name:"", email:"",password:"",confirmPassword:"" })
        setFieldErrors({})
        setFormError("")
        setVisiblePasswords({ password: false, confirmPassword: false })
        onClose()
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;

        setFormData((currentValue) => ({
            ...currentValue,
            [name]: value,
        }));


        setFieldErrors((currentValue) => ({
            ...currentValue,
            [name]: undefined,
        }));

        setFormError("");
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setIsSubmitting(true)

        try{           
            const result = await createUserAction(formData)
            if(!result.success){
                if(result.fieldErrors){
                    setFieldErrors(result.fieldErrors)
                } else {
                    setFormError(result.error)
                }
                return;
            }

            toast.success("User created successfully!");
            router.refresh();
            closeModal();
        }
        
        catch (error) {
            const description = error instanceof Error ? error.message : undefined;
            toast.error("An unexpected error occurred. Please try again.", { description });
        }
        finally {
            setIsSubmitting(false);
        }
    }

    if(!isOpen){
        return null;
    }
    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">
                &times;
                </button>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {modalTitle}
                </h3>
                <form onSubmit={handleSubmit}>
                    {formError ? <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p> : null}
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
                                // autoComplete="name"
                                value={formData.name}
                                onChange={(e)=>{handleChange(e)}}
                            />
                             {fieldErrors.name ? <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p> : null}
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
                                // autoComplete="email"
                                value={formData.email}
                                onChange={(e)=>{handleChange(e)}}
                            />
                            {fieldErrors.email ? <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p> : null}
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
                                    // autoComplete="password"
                                    value={formData.password}
                                    onChange={(e)=>{handleChange(e)}}
                                />
                                <button type="button"
                                onClick={() => togglePasswordVisibility("password")}
                                aria-label="Toggle password visibility" className="absolute inset-y-0 inset-e-0 flex items-center z-20 px-3 cursor-pointer text-muted-foreground rounded-e-md focus:outline-hidden focus:text-primary-focus">
                                  <FontAwesomeIcon icon={visiblePasswords.password ? faEyeSlash : faEye} className="size-4" />
                                </button>
                            </div>
                             {fieldErrors.password ? <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p> : null}
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type={visiblePasswords.confirmPassword ? "text" : "password"}
                                    placeholder="secure-password"
                                    autoComplete="confirm-password"    
                                    value={formData.confirmPassword}
                                    onChange={(e)=>{handleChange(e)}}
                                />
                                <button type="button"
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                aria-label="Toggle confirm password visibility" className="absolute inset-y-0 inset-e-0 flex items-center z-20 px-3 cursor-pointer text-muted-foreground rounded-e-md focus:outline-hidden focus:text-primary-focus">
                                  <FontAwesomeIcon icon={visiblePasswords.confirmPassword ? faEyeSlash : faEye} className="size-4" />
                                </button>
                            </div>
                             {fieldErrors.confirmPassword ? <p className="mt-2 text-sm text-red-600">{fieldErrors.confirmPassword}</p> : null}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                        <button onClick={closeModal} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Saving...":"Save"}
                        </button>
                    </div>
                </form>

            </div>
            </div>

        </>
    )
}
