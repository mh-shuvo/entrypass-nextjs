"use client";

import { SafeUser } from "@/repository/user.repository";
import Pagination from "./pagination";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UserRecordsProps {
  users: SafeUser[];
  totalPages: number;
}

const initialsFromName = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function UserRecords({ users, totalPages }: UserRecordsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("q") ?? "");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    params.set("page", "1");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-400">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20L16.65 16.65" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name, email, or phone"
            className="w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
            value={search}
            onChange={handleChange}
          />
        </div>

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-sm font-medium text-violet-600 transition hover:text-violet-700"
          >
            Clear search
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-zinc-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                        {initialsFromName(user.name || "User")}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{user.name}</p>
                        <p className="text-xs text-zinc-500">#{user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-600">{user.email}</td>

                  <td className="px-4 py-4 text-sm text-zinc-600">{user.phone || "—"}</td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <a
                      href={`/dashboard/users/${user.id}`}
                      className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      View profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}