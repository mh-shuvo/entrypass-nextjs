"use client"
import { useSession } from "next-auth/react"

export default function DashboardView() {
  const { data: session } = useSession();
  const permissions = ((session?.user as { permissions?: string[] } | undefined)?.permissions ?? [])
  console.log(session)
  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>
      <hr />
      <p className="mt-4">Signed in as {session?.user?.email}</p>

      {permissions.length > 0 ? (
        <ul className="mt-4 list-disc pl-5">
          {permissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
