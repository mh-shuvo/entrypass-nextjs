import type { Metadata } from "next";
import { pageTitle } from "@/lib/metadata";
import {UserService} from "@/services/user.service";
import {UserRepository} from "@/repository/user.repository";
import prisma from "@/lib/prisma";
import CreateNewUserButton  from "@/components/User/CreateNewUserButton";

const userService = new UserService(new UserRepository());
export const metadata: Metadata = pageTitle("User List");


export default async function UserListPage() {
  const users = await userService.getAllUsers();
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
            {users.map((user)=>(
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="border px-4 py-2 text-center">
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded text-sm"
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            
          </tbody>
      </table>
    </div>
  );
}