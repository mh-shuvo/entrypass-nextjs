"use client"
import { useSession } from "next-auth/react"

export default function DashboardView() {

  const {data: session} = useSession();

  return (
    <div>
        <h1 className="text-3xl">Dashboard</h1>
        <hr />
        <p className="mt-4">Signed in as {session?.user?.email} <br /></p>
    </div>
  );
}
