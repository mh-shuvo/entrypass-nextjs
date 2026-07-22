"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { loginSchema, type LoginFormState } from "@/lib/validation/auth";
import {toast} from "sonner";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormState>({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((currentValue) => ({
            ...currentValue,
            [name]: value,
        }));

        setFieldErrors((currentValue) => ({
            ...currentValue,
            [name]: undefined,
        }));

        setFormError("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFormError("");

        const parsedResult = loginSchema.safeParse(formData);

        try{
            if (!parsedResult.success) {
            const nextFieldErrors: Partial<Record<keyof LoginFormState, string>> = {};

            for (const issue of parsedResult.error.issues) {
                const fieldName = issue.path[0];

                if (fieldName === "email" || fieldName === "password") {
                    nextFieldErrors[fieldName] = issue.message;
                }
            }

            setFieldErrors(nextFieldErrors);
            setIsSubmitting(false);
            return;
        }

        const result = await signIn("admin", {
            email: parsedResult.data.email,
            password: parsedResult.data.password,
            redirect: false,
        });

        if (result?.error) {
            if (result.error === "RateLimited") {
                setFormError("Too many login attempts. Please wait a moment and try again.");
            } else {
                setFormError("Invalid organizer credentials");
            }
            return;
        }
        toast.success("Successfully signed in!");
        router.push("/dashboard");
        router.refresh();

        }
        catch (error) {
            const description = error instanceof Error ? error.message : undefined;
            toast.error("An unexpected error occurred. Please try again.", { description });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-2 dark:bg-gray-900">
            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">Organizer Login</h1>
            <form onSubmit={handleSubmit} className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
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
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    {fieldErrors.email ? <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p> : null}
                </div>
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="mb-3 w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    {fieldErrors.password ? <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p> : null}
                </div>
                {formError ? <p className="mb-4 text-sm text-red-600">{formError}</p> : null}
                <div className="flex items-center justify-between">
                    <button
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                </div>
            </form>
        </div>
    );
}