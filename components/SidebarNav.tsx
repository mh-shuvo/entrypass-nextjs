"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useHasPermission } from "@/lib/permissions";
import { usePathname } from "next/navigation";

const icons: Record<string, ReactNode> = {
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10.5V19h14v-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" strokeLinecap="round" />
      <circle cx="10" cy="7" r="3" />
      <path d="M20 19v-1a4 4 0 0 0-3-3.87" strokeLinecap="round" />
      <path d="M16 4.13a4 4 0 0 1 0 7.74" strokeLinecap="round" />
    </svg>
  ),
  Events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
};

export default function SidebarNav() {
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", label: "Dashboard", visibility: true },
    { href: "/dashboard/users", label: "Users", visibility: useHasPermission("manage_user") },
    { href: "/dashboard/events", label: "Events", visibility: useHasPermission("manage_events") },
  ];

  const visibleItems = navItems.filter((item) => item.visibility);

  if (visibleItems.length === 0) return null;

  return (
    <nav className="flex flex-col gap-2 text-sm">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all ${
              isActive
                ? "bg-violet-50 font-medium text-violet-700 shadow-sm ring-1 ring-violet-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
              {icons[item.label]}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

