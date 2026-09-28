"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function SidebarUserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const displayName = session?.user?.name ?? session?.user?.email ?? "Account";

  return (
    <div ref={menuRef} className="relative">
      {open ? (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg">
          <Link
            href="/dashboard/profile"
            className="block px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            Edit profile
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm shadow-sm transition hover:bg-slate-100"
      >
        <span className="flex items-center gap-3 truncate">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
          <span className="truncate font-medium text-slate-700">{displayName}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M10 5a.75.75 0 01.53.22l4.25 4.25a.75.75 0 01-1.06 1.06L10 6.81l-3.72 3.72a.75.75 0 01-1.06-1.06l4.25-4.25A.75.75 0 0110 5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
