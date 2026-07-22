"use client"
import { useSession } from "next-auth/react"
export default function DashboardPage() {
  
  const {data: session, status} = useSession();

  if (status === "loading") {
    return (
      <div className="font-sans p-10 dark:bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans p-10 dark:bg-black">
      <h1 className="text-3xl">Dashboard</h1>
      <hr />
      <p className="mt-4">Signed in as {session?.user?.email} <br /></p>
    </div>
  );
}
