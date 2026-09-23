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

  return (
    <div>
      <div className="flex justify-between">
        <span>
          <h1 className="text-3xl">User List</h1>
        </span>
        <span>
          <CreateNewUserButton />
        </span>
      </div>
      <hr />
      <UserRecords users={users} totalPages={totalPages} />
    </div>
  );
}