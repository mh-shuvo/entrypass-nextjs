"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EventStatus } from "@/lib/event.types";
import type { EventCreateState } from "@/lib/validation/event";
import { eventWriteActions } from "@/app/actions/eventActions";
import { formatDateRange, statusStyles } from "@/lib/event.utils";
import type { EventMediaDto } from "@/lib/event-media";
import EventDetailsActions from "@/components/Event/EventDetailsActions";
import EventMediaManager from "@/components/Event/EventMediaManager";
import PageHeader from "../PageHeader";

export type EventDetailsData = {
  event_slug: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  regStart: string | null;
  regEnd: string | null;
  status: EventStatus;
  venue: string;
  createdAt: string;
  updatedAt: string;
  banner: EventMediaDto | null;
  supportingFiles: EventMediaDto[];
};

type EventDetailsClientProps = {
  event: EventDetailsData;
  defaultEditing?: boolean;
};

type EditableFields = {
  title: string;
  venue: string;
  description: string;
  startDate: string;
  endDate: string;
  regStart: string;
  regEnd: string;
  status?: EventStatus;
};

function dateTimeInputValue(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function displayDate(value: string | null): string {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const fieldClassName =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

export default function EventDetailsClient({ event, defaultEditing }: EventDetailsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(defaultEditing ?? false);
  const [isSaving, startSaving] = useTransition();
  const [fields, setFields] = useState<EditableFields>({
    title: event.title,
    venue: event.venue,
    description: event.description ?? "",
    startDate: dateTimeInputValue(event.startDate),
    endDate: dateTimeInputValue(event.endDate),
    regStart: dateTimeInputValue(event.regStart),
    regEnd: dateTimeInputValue(event.regEnd),
    status: event.status,
  });

  const updateField = (key: keyof EditableFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const saveChanges = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const payload: EventCreateState = {
      ...fields,
      status: event.status,
    };

    startSaving(async () => {
      try {
        const result = await eventWriteActions(payload, event.event_slug);
        if (!result.success) {
          toast.error(Object.values(result.fieldErrors ?? {})[0] ?? result.error);
          return;
        }
        toast.success("Event details updated.");
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.error("Updating event details failed", error);
        toast.error("Unable to update the event.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader pageName="Event Details" feature="Event Management">
        <Link
          href="/dashboard/events"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Back to events
        </Link>
      </PageHeader>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          {isEditing ? (
            <form onSubmit={saveChanges} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">Edit event details</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>

              <label className="block text-sm font-medium text-zinc-700">
                Event name
                <input
                  required
                  maxLength={100}
                  value={fields.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={fieldClassName}
                />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Venue
                <input
                  required
                  maxLength={191}
                  value={fields.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                  className={fieldClassName}
                />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Description
                <textarea
                  maxLength={2000}
                  rows={5}
                  value={fields.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={fieldClassName}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  ["startDate", "Event starts"],
                  ["endDate", "Event ends"],
                  ["regStart", "Registration opens"],
                  ["regEnd", "Registration closes"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="block text-sm font-medium text-zinc-700">
                    {label}
                    <input
                      type="datetime-local"
                      value={fields[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className={fieldClassName}
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </form>
          ) : (
            <EventDetailsDisplay
              event={event}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </section>

        <EventDetailsActions
          key={event.status}
          slug={event.event_slug}
          status={event.status}
          onEdit={() => setIsEditing(true)}
        />
      </div>
    </div>
  );
}

function EventDetailsDisplay({
  event,
  onEdit,
}: {
  event: EventDetailsData;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[event.status]}`}>
          {event.status}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
          {event.event_slug}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{event.title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Edit details
        </button>
      </div>
      <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-600">
        {event.description || "No description provided."}
      </p>

      <dl className="mt-7 grid gap-x-8 gap-y-6 border-t border-zinc-200 pt-6 sm:grid-cols-2">
        <Detail label="Event dates">
          {formatDateRange(
            event.startDate ? new Date(event.startDate) : null,
            event.endDate ? new Date(event.endDate) : null
          )}
        </Detail>
        <Detail label="Venue">{event.venue || "Not set"}</Detail>
        <Detail label="Registration opens">{displayDate(event.regStart)}</Detail>
        <Detail label="Registration closes">{displayDate(event.regEnd)}</Detail>
        <Detail label="Created">{displayDate(event.createdAt)}</Detail>
        <Detail label="Last updated">{displayDate(event.updatedAt)}</Detail>
      </dl>
      <EventMediaManager
        slug={event.event_slug}
        banner={event.banner}
        supportingFiles={event.supportingFiles}
      />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium text-zinc-900">{children}</dd>
    </div>
  );
}
