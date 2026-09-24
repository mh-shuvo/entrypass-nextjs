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
            prev.map((item) =>
                item.name === name ? { ...item, should_checked: checked } : item
            )
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
    <div className="w-full rounded-2xl border border-slate-300 bg-neutral-secondary-low p-5 mt-3">
      <p className="text-md font-semibold pb-2">Access Control</p>

      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold">Manage Permission</p>
          <p className="text-sm text-muted">Manage ABAC across the application</p>
        </div>
      </div>

      <div className="mt-4 space-x-3 flex ">
        {permissionFormData.map((item) => (
          <div className="flex items-center flex-wrap" key={item.name}>
            <input
              id={`permission-${item.name}`}
              name={item.name}
              type="checkbox"
              checked={item.should_checked}
              value={item.should_checked ? 1 : 0}
              className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
              onChange={handlePermissionCheckboxChanges}
            />
            <label htmlFor={`permission-${item.name}`} className="select-none ms-2 text-sm font-medium text-heading">
              {item.name.replaceAll("_"," ").toUpperCase()}
            </label>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-end">
        <button
            type="button"
            onClick={handleUpdatePermissions}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-2 py-1 bg-teal-600 hover:bg-teal-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <span className="inline-flex text-white items-center text-[12px]">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 size-2" aria-hidden="true" />
            {isSubmitting ? "Updating..." : "Update Permission"}
            </span>
        </button>
        </div>

    </div>
  );
}