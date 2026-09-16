import type { Metadata } from "next";
import { pageTitle } from "@/lib/metadata";
import {UserService} from "@/services/user.service";
import {UserRepository} from "@/repository/user.repository";
import prisma from "@/lib/prisma";
import CreateNewUserButton  from "@/components/User/CreateNewUserButton";
import Pagination from "./pagination";
const userService = new UserService(new UserRepository());
export const metadata: Metadata = pageTitle("User List");


export default async function UserListPage({searchParams}: {searchParams: {page?: number}}) {
  const {page} = await searchParams;
  const currentPage = page ?? 1;
  const users = await userService.getAllUsers(currentPage);
  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / 10);
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
            {users.map((user,index)=>(
              <tr key={user.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <a href={`/dashboard/users/${user.id}`} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
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
    </div>
  );
}