"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EVENT_BANNER_MIME_TYPES,
  EVENT_SUPPORTING_FILE_MAX_COUNT,
  mediaUrl,
  type EventMediaDto,
} from "@/lib/event-media";
import { deleteSupportingFile, uploadEventMedia } from "@/lib/event-media-client";

type EventMediaManagerProps = {
  slug: string;
  banner: EventMediaDto | null;
  supportingFiles: EventMediaDto[];
};

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024 * 1024) return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EventMediaManager({
  slug,
  banner,
  supportingFiles,
}: EventMediaManagerProps) {
  const bannerInput = useRef<HTMLInputElement>(null);
  const supportingInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const replaceBanner = async (file: File | null) => {
    if (!file) return;
    if (!EVENT_BANNER_MIME_TYPES.has(file.type)) {
      toast.error("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    setIsUploadingBanner(true);
    try {
      await uploadEventMedia(slug, file, []);
      toast.success("Event banner updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the event banner.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInput.current) bannerInput.current.value = "";
    }
  };

  const addSupportingFiles = async (files: File[]) => {
    if (files.length === 0) return;
    if (supportingFiles.length + files.length > EVENT_SUPPORTING_FILE_MAX_COUNT) {
      toast.error(`An event can have up to ${EVENT_SUPPORTING_FILE_MAX_COUNT} supporting files.`);
      if (supportingInput.current) supportingInput.current.value = "";
      return;
    }

    setIsUploadingFiles(true);
    try {
      await uploadEventMedia(slug, null, files);
      toast.success("Supporting files added.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add supporting files.");
    } finally {
      setIsUploadingFiles(false);
      if (supportingInput.current) supportingInput.current.value = "";
    }
  };

  const removeSupportingFile = async (media: EventMediaDto) => {
    if (!window.confirm(`Delete "${media.name}"? This cannot be undone.`)) return;
    setDeletingId(media.id);
    try {
      await deleteSupportingFile(slug, media.id);
      toast.success("Supporting file deleted.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete this file.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-8 border-t border-zinc-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Event media</h3>
          <p className="mt-1 text-sm text-zinc-500">Banner image and supporting documents</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={bannerInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void replaceBanner(event.target.files?.[0] ?? null)}
          />
          {banner && (
            <button
              type="button"
              onClick={() => bannerInput.current?.click()}
              disabled={isUploadingBanner}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
            >
              {isUploadingBanner ? "Updating..." : "Update banner"}
            </button>
          )}
          <input
            ref={supportingInput}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/csv,text/plain"
            className="hidden"
            onChange={(event) => void addSupportingFiles(Array.from(event.target.files ?? []))}
          />
          <button
            type="button"
            onClick={() => supportingInput.current?.click()}
            disabled={isUploadingFiles || supportingFiles.length >= EVENT_SUPPORTING_FILE_MAX_COUNT}
            className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {isUploadingFiles ? "Uploading..." : "Add supporting files"}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {banner ? (
          <div className="relative aspect-[2.4/1] overflow-hidden rounded-xl bg-zinc-100">
            <Image
              src={mediaUrl(slug, banner.id)}
              alt={`${banner.name} event banner`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              loading="eager"
            />
          </div>
        ) : (
          <div className="flex aspect-[2.4/1] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
            No event banner uploaded
            <button
              type="button"
              onClick={() => bannerInput.current?.click()}
              disabled={isUploadingBanner}
              className="ml-2 font-semibold text-violet-700 hover:text-violet-800"
            >
              {isUploadingBanner ? "Uploading..." : "Add banner"}
            </button>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-zinc-800">Supporting files</h4>
          {supportingFiles.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No supporting files uploaded.</p>
          ) : (
            <ul className="mt-2 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
              {supportingFiles.map((media) => (
                <li key={media.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
                  <div className="min-w-0">
                    <a
                      href={mediaUrl(slug, media.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm font-medium text-violet-700 hover:underline"
                    >
                      {media.name}
                    </a>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {formatFileSize(media.sizeBytes)} · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(media.createdAt))}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeSupportingFile(media)}
                    disabled={deletingId === media.id}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === media.id ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
