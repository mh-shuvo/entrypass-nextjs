"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { loginSchema, type LoginFormState } from "@/lib/validation/auth";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormState>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleQuickFill = (email: string) => {
    setFormData({
      email,
      password: "123456789",
    });
    setFieldErrors({});
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const parsedResult = loginSchema.safeParse(formData);

    try {
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
          setFormError("Invalid organizer credentials. Please check your email and password.");
        }
        return;
      }

      toast.success("Successfully signed in!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      toast.error("An unexpected error occurred. Please try again.", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-zinc-200/90 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 lg:grid lg:grid-cols-12">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: SHOWCASE & FEATURE TELEMETRY */}
        {/* ========================================================================= */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-10 text-white lg:col-span-5 lg:flex">
          
          {/* Subtle background glow circle */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-2xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-2xl" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/30">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <circle cx="7" cy="15" r="1" fill="currentColor" />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                  <circle cx="17" cy="15" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">Entry<span className="text-violet-400">Pass</span></span>
                <span className="ml-2 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 border border-violet-500/30">
                  Organizer Console
                </span>
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-bold tracking-tight text-white leading-snug">
              Unified Command Center for Live Gatherings
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Super Admins and Executives control gate check-ins, bulk invite attendees, and view live telemetry in real-time.
            </p>
          </div>

          {/* Middle Feature Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-zinc-900/80 p-3.5 border border-zinc-800 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div className="text-xs">
                <div className="font-bold text-zinc-200">Sub-Second Scanner Validation</div>
                <div className="text-zinc-400">Instant cryptographic QR verification at venue entrance doors.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-zinc-900/80 p-3.5 border border-zinc-800 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="text-xs">
                <div className="font-bold text-zinc-200">Role-Based Permission Security</div>
                <div className="text-zinc-400">Granular rights for Super Admins and Executive managers.</div>
              </div>
            </div>
          </div>

          {/* Bottom Security / Rate Limit Pill */}
          <div className="relative z-10 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Upstash Rate-Limit Active
            </span>
            <span>Bcrypt Encrypted</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: ORGANIZER AUTHENTICATION FORM */}
        {/* ========================================================================= */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-7">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  Organizer Sign In
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Enter your registered credentials to access the management portal.
                </p>
              </div>
              <Link
                href="/"
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition"
                title="Return to Homepage"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-6 rounded-2xl bg-zinc-50 p-4 border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Quick Demo Accounts (1-Click Fill)
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-normal">
                  Pass: 123456789
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin@example.com")}
                  className="rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300"
                >
                  Super Admin (admin@example.com)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("john.doe@example.com")}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  Executive (john.doe@example.com)
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {formError && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 animate-fade-in">
                <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div className="font-medium">{formError}</div>
              </div>
            )}

            {/* Main Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300" htmlFor="email">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="organizer@entrypass.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                      fieldErrors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                        : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20 dark:border-zinc-700"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                      fieldErrors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                        : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20 dark:border-zinc-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-500/35 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Authenticating Organizer...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Footer Back Link */}
          <div className="mt-8 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
            <span>Looking for public events? </span>
            <Link href="/events" className="font-semibold text-violet-600 hover:underline dark:text-violet-400">
              Browse Event Passes →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}