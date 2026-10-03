"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/utils";
import type { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { uploadEventMedia } from "@/lib/event-media-client";
import {
  EVENT_BANNER_MAX_BYTES,
  EVENT_BANNER_MIME_TYPES,
  EVENT_SUPPORTING_FILE_MAX_BYTES,
  EVENT_SUPPORTING_FILE_MAX_COUNT,
  EVENT_SUPPORTING_FILES_MAX_BYTES,
  EVENT_SUPPORTING_MIME_TYPES,
} from "@/lib/event-media";

type EventStatus = "DRAFT" | "PUBLISHED";

type EventFormState = {
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  regStart: string;
  regEnd: string;
  description: string;
};

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  PUBLISHED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const defaultForm: EventFormState = {
  title: "Spring Product Launch",
  venue: "Sky Hall, New York",
  startDate: "2026-10-18T09:00",
  endDate: "2026-10-18T16:00",
  regStart: "2026-09-20T00:00",
  regEnd: "2026-10-10T23:59",
  description:
    "A showcase event for our latest platform updates, designed for customers, partners, and internal teams.",
};

type EventSubmitPayload = EventFormState & { status: EventStatus };

type EventCreateFormProps = {
  action: (payload: EventSubmitPayload) => Promise<ActionResult<Event>> | ActionResult<Event>;
};

export default function EventCreateForm({ action }: EventCreateFormProps) {
  const [form, setForm] = useState<EventFormState>(defaultForm);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>("DRAFT");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EventFormState | "status", string>>>({});
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const bannerPreviewUrlRef = useRef<string | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (bannerPreviewUrlRef.current) {
        URL.revokeObjectURL(bannerPreviewUrlRef.current);
      }
    };
  }, []);

  const selectBannerFile = (file: File | null) => {
    if (bannerPreviewUrlRef.current) {
      URL.revokeObjectURL(bannerPreviewUrlRef.current);
    }
    const previewUrl = file ? URL.createObjectURL(file) : null;
    bannerPreviewUrlRef.current = previewUrl;
    setBannerFile(file);
    setBannerPreviewUrl(previewUrl);
  };

  const previewDate = useMemo(() => {
    const start = form.startDate ? new Date(form.startDate) : null;
    const end = form.endDate ? new Date(form.endDate) : null;

    if (!start || !end) return "Select event dates";

    const sameDay = start.toDateString() === end.toDateString();

    const format = (value: Date) =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(value);

    return sameDay ? format(start) : `${format(start)} - ${format(end)}`;
  }, [form.startDate, form.endDate]);

  const updateField = (field: keyof EventFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitEventCreateForm = async (nextStatus: EventStatus) => {
    if (isSubmitting) return;
    if (bannerFile && (!EVENT_BANNER_MIME_TYPES.has(bannerFile.type) || bannerFile.size > EVENT_BANNER_MAX_BYTES)) {
      toast.error("Choose a JPEG, PNG, or WebP banner that is 10 MB or smaller.");
      return;
    }
    if (supportingFiles.length > EVENT_SUPPORTING_FILE_MAX_COUNT) {
      toast.error(`Choose no more than ${EVENT_SUPPORTING_FILE_MAX_COUNT} supporting files.`);
      return;
    }
    if (supportingFiles.some((file) =>
      !EVENT_SUPPORTING_MIME_TYPES.has(file.type) || file.size > EVENT_SUPPORTING_FILE_MAX_BYTES
    )) {
      toast.error("Supporting files must use a supported format and be 20 MB or smaller.");
      return;
    }
    if (supportingFiles.reduce((total, file) => total + file.size, 0) > EVENT_SUPPORTING_FILES_MAX_BYTES) {
      toast.error("Supporting files must total 60 MB or less.");
      return;
    }
    setIsSubmitting(true);
    setSelectedStatus(nextStatus);

    const payload: EventSubmitPayload = {
      ...form,
      status: nextStatus,
    };

    try {
      const result = await action(payload);
      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.error || "Unable to save the event.");
        return;
      }

      setFieldErrors({});
      let mediaError: string | null = null;
      if (bannerFile || supportingFiles.length > 0) {
        try {
          await uploadEventMedia(result.data.event_slug, bannerFile, supportingFiles);
        } catch (error) {
          mediaError = error instanceof Error ? error.message : "Unable to upload event media.";
        }
      }

      if (mediaError) {
        toast.error(`Event created, but media upload failed: ${mediaError}`);
      } else {
        toast.success(nextStatus === "DRAFT" ? "Draft saved successfully." : "Event published successfully.");
      }
      router.push(`/dashboard/events/${encodeURIComponent(result.data.event_slug)}`);
    } catch (error) {
      console.error("Creating event failed", error);
      toast.error(error instanceof Error ? error.message : "Unable to save the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Event management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Create event</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => submitEventCreateForm("DRAFT")}
            disabled={isSubmitting}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition cursor-pointer hover:bg-zinc-50"
          >
            {isSubmitting && selectedStatus === "DRAFT" ? "Saving..." : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => submitEventCreateForm("PUBLISHED")}
            disabled={isSubmitting}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition cursor-pointer hover:bg-violet-500"
          >
            {isSubmitting && selectedStatus === "PUBLISHED" ? "Publishing..." : "Publish event"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <form className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Basic details</h2>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                Required
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-zinc-700">Event title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  placeholder="Enter event title"
                />
                {fieldErrors.title && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.title}</span>
                )}
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-zinc-700">Venue</span>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(event) => updateField("venue", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  placeholder="Ex: Skyline Convention Center"
                />
                {fieldErrors.venue && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.venue}</span>
                )}
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-zinc-700">Description</span>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  placeholder="Write a brief summary of the event..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-zinc-900">Schedule & registration</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-medium text-zinc-700">Start date</span>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                {fieldErrors.startDate && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.startDate}</span>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-zinc-700">End date</span>
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                {fieldErrors.endDate && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.endDate}</span>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-zinc-700">Registration start</span>
                <input
                  type="datetime-local"
                  value={form.regStart}
                  onChange={(event) => updateField("regStart", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                {fieldErrors.regStart && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.regStart}</span>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-zinc-700">Registration end</span>
                <input
                  type="datetime-local"
                  value={form.regEnd}
                  onChange={(event) => updateField("regEnd", event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                {fieldErrors.regEnd && (
                  <span className="mt-1 block text-xs text-red-600">{fieldErrors.regEnd}</span>
                )}
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-zinc-900">Event media</h2>
            <div className="space-y-5">
              <label className="block text-sm font-medium text-zinc-700">
                Event banner
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    selectBannerFile(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                  className="mt-2 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                />
                <span className="mt-1 block text-xs font-normal text-zinc-500">
                  JPEG, PNG, or WebP; maximum 10 MB. One banner per event.
                </span>
                {bannerFile && (
                  <span className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs">
                    <span className="truncate">{bannerFile.name}</span>
                    <button type="button"                     onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      selectBannerFile(null);
                    }}
                    className="shrink-0 font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </span>
                )}
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Supporting files
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/csv,text/plain"
                  onChange={(event) => {
                    setSupportingFiles((current) => [...current, ...Array.from(event.target.files ?? [])]);
                    event.target.value = "";
                  }}
                  className="mt-2 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                />
                <span className="mt-1 block text-xs font-normal text-zinc-500">
                  Up to 8 files, 20 MB each and 60 MB total. PDF, Office documents, CSV, text, or images.
                </span>
                {supportingFiles.map((file, index) => (
                  <span key={`${file.name}-${index}`} className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setSupportingFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
                      }}
                      className="shrink-0 font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </span>
                ))}
              </label>
            </div>
          </section>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Preview</h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <div
                className={`h-28 ${bannerPreviewUrl ? "bg-cover bg-center" : "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500"}`}
                style={bannerPreviewUrl ? { backgroundImage: `url("${bannerPreviewUrl}")` } : undefined}
              />

              <div className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selectedStatus]}`}>
                    {selectedStatus}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                    event-preview
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-zinc-900">{form.title || "Event title"}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {form.description || "A concise event description will appear here."}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">📅</span>
                    {previewDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">📍</span>
                    {form.venue || "Venue location"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">🕒</span>
                    Registration {form.regStart ? form.regStart.replace("T", " ") : "—"} to {form.regEnd ? form.regEnd.replace("T", " ") : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900">Quick tips</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                Use a clear, searchable slug for easier URL management.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                Add the venue and registration windows before publishing.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                Save as draft while polishing event details.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
