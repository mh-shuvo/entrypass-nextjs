"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EventStatus } from "@/lib/event.types";
import {
  archiveEventAction,
  deleteEventAction,
  updateEventStatusAction,
} from "@/app/actions/eventActions";

const eventStatuses: EventStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "COMPLETED",
  "CANCELLED",
];

type EventDetailsActionsProps = {
  slug: string;
  status: EventStatus;
  onEdit: () => void;
};

export default function EventDetailsActions({
  slug,
  status,
  onEdit,
}: EventDetailsActionsProps) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  const changeStatus = () => {
    startTransition(async () => {
      try {
        const result = await updateEventStatusAction(slug, nextStatus);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("Event status updated.");
        router.refresh();
      } catch (error) {
        console.error("Updating event status failed", error);
        toast.error("Unable to update the event status.");
      }
    });
  };

  const archive = () => {
    if (!window.confirm("Archive this event? Archived events cannot be restored.")) return;

    startTransition(async () => {
      try {
        const result = await archiveEventAction(slug);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("Event archived.");
        router.push("/dashboard/events");
      } catch (error) {
        console.error("Archiving event failed", error);
        toast.error("Unable to archive the event.");
      }
    });
  };

  const remove = () => {
    if (!window.confirm("Permanently delete this event? This cannot be undone.")) return;

    startTransition(async () => {
      try {
        const result = await deleteEventAction(slug);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("Event permanently deleted.");
        router.push("/dashboard/events");
      } catch (error) {
        console.error("Deleting event failed", error);
        toast.error("Unable to delete the event.");
      }
    });
  };

  return (
    <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Event actions</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="event-status" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Status
          </label>
          <select
            id="event-status"
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value as EventStatus)}
            disabled={isPending}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:opacity-60"
          >
            {eventStatuses.map((eventStatus) => (
              <option key={eventStatus} value={eventStatus}>
                {eventStatus.charAt(0) + eventStatus.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={changeStatus}
            disabled={isPending || nextStatus === status}
            className="mt-2 w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Update status"}
          </button>
        </div>

        <button
          type="button"
          onClick={onEdit}
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          Edit event
        </button>

        <div className="space-y-2 border-t border-zinc-200 pt-4">
          <button
            type="button"
            onClick={archive}
            disabled={isPending}
            className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
          >
            Archive event
          </button>
          <p className="text-xs leading-5 text-zinc-500">
            Archiving removes the event from the active list and cannot be reversed.
          </p>
        </div>

        <div className="space-y-2 border-t border-red-100 pt-4">
          <button
            type="button"
            onClick={remove}
            disabled={isPending}
            className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
          >
            Delete permanently
          </button>
          <p className="text-xs leading-5 text-zinc-500">
            Permanently deletes this event and cannot be undone.
          </p>
        </div>
      </div>
    </aside>
  );
}
