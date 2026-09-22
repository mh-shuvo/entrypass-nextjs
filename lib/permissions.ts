"use client";

import { useSession } from "next-auth/react";

export function useHasPermission(permission: string): boolean {
  const { data: session } = useSession();
  const userPermissions = session?.user?.permissions ?? [];

  return userPermissions.includes(permission);
}