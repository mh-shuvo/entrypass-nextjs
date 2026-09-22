"use client";

import Link from "next/link";
import { useHasPermission } from "@/lib/permissions";

export default function SidebarNav() {
  const canManageUsers = useHasPermission("manage_user");

  return (
    <>
      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/dashboard" className="rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Dashboard
        </Link>
      </nav>
      {canManageUsers && (
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/dashboard/users" className="rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Users
          </Link>
        </nav>
      )}
    </>
  );
}
