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
    <>
      <div className="w-full flex space-2 p-3">
        <div className="w-2/3">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name, email, phone"
            className="border rounded h-10 w-full p-2"
            value={search}
            onChange={handleChange}
          />
          {search && (
            <div>
              <p className="text-red-600 p-1 underline cursor-pointer" onClick={clearSearch}>
                Clear search
              </p>
            </div>
          )}
        </div>
      </div>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <a
                  href={`/dashboard/users/${user.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="border px-4 py-2 text-center">
              <Pagination totalPages={totalPages} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}