"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AuthNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return (
      <Link
        className="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        href="/login"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        className="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        Sign out
      </button>
    </div>
  );
}
