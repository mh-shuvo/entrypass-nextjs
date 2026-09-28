"use client";
import { SafeUser } from "@/repository/user.repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Permission as AllPermission } from "@prisma/client";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserPermissionsAction } from "@/app/actions/userActions";

type UserAccessControlProps = {
  user: SafeUser;
};

type PermissionFormData = {
  name: string;
  should_checked: boolean;
}[];

const buildPermissionFormData = (safeUser: SafeUser): PermissionFormData =>
  Object.values(AllPermission).map((permission) => ({
    name: permission,
    should_checked: new Set(safeUser?.permissions?.map((p) => p.permission)).has(permission),
  }));

export default function UserAccessControl({ user }: UserAccessControlProps) {
  const router = useRouter();
  const [permissionFormData, setPermissionFormData] = useState<PermissionFormData>(() => buildPermissionFormData(user));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePermissionCheckboxChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setPermissionFormData((prev) =>
      prev.map((item) => (item.name === name ? { ...item, should_checked: checked } : item))
    );
  };

  const handleUpdatePermissions = async () => {
    setIsSubmitting(true);

    try {
      const selectedPermissions = permissionFormData
        .filter((item) => item.should_checked)
        .map((item) => item.name as AllPermission);

      const result = await updateUserPermissionsAction(user.id, selectedPermissions);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Permissions updated successfully.");
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : undefined;
      toast.error("An unexpected error occurred. Please try again.", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Access control</p>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <p className="text-lg font-semibold text-zinc-900">Manage permissions</p>
          <p className="mt-1 text-sm text-zinc-600">Manage ABAC across the application.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {permissionFormData.map((item) => (
            <label
              key={item.name}
              htmlFor={`permission-${item.name}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
            >
              <input
                id={`permission-${item.name}`}
                name={item.name}
                type="checkbox"
                checked={item.should_checked}
                value={item.should_checked ? 1 : 0}
                className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                onChange={handlePermissionCheckboxChanges}
              />
              <span className="select-none text-sm font-medium text-zinc-700">
                {item.name.replaceAll("_", " ").toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleUpdatePermissions}
          disabled={isSubmitting}
          className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 size-3" aria-hidden="true" />
          {isSubmitting ? "Updating..." : "Update Permission"}
        </button>
      </div>
    </div>
  );
}