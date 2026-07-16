import Image from "next/image";
import Link from "next/link";
import {UserService} from "@/services/user.service";
import {UserRepository} from "@/repository/user.repository";
const userService = new UserService(new UserRepository());

export default async function Home() {
  const users = await userService.getAllUsers();
  return (
    <div className="font-sans p-10 dark:bg-black">
        <h1 className="text-3xl text-center">Welcome to EntryPass</h1>
        <hr />
        <div className="flex flex-wrap justify-center mt-10">
            {users.map((user) => (
                <div key={user.id} className="w-64 p-4 m-2 bg-white rounded shadow dark:bg-gray-800">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
            ))}
        </div>
    </div>
  );
}
