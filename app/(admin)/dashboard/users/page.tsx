import type { Metadata } from "next";
import { pageTitle } from "@/lib/metadata";
import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repository/user.repository";
import CreateNewUserButton from "@/components/User/CreateNewUserButton";
import UserRecords from "./userRecords";

const userService = new UserService(new UserRepository());

export const metadata: Metadata = pageTitle("User List");

export default async function UserListPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const currentPage = Number(params.page ?? 1);
  const normalizedPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const search = params.q ?? "";

  const users = await userService.getAllUsers(normalizedPage, search);
  const totalUsers = await userService.countUsers(search);
  const totalPages = Math.max(1, Math.ceil(totalUsers / 10));
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
              User management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Users</h1>
          </div>

          <CreateNewUserButton />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-violet-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-700">
              Total users
            </p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{totalUsers}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-emerald-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
              Active
            </p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{activeUsers}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-700">
              Page
            </p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{normalizedPage}</p>
          </div>
        </div>
      </div>

      <UserRecords users={users} totalPages={totalPages} />
    </div>
  );
}