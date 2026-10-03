import { randomUUID } from "node:crypto";
import path from "node:path";
import { EVENT_MEDIA_KIND } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

import { requirePermission } from "@/lib/authz";
import {
  EVENT_BANNER_MAX_BYTES,
  EVENT_BANNER_MIME_TYPES,
  EVENT_SUPPORTING_FILE_MAX_BYTES,
  EVENT_SUPPORTING_FILE_MAX_COUNT,
  EVENT_SUPPORTING_FILES_MAX_BYTES,
  EVENT_SUPPORTING_MIME_TYPES,
} from "@/lib/event-media";
import { removeEventMedia, storeEventMedia } from "@/lib/event-media-storage";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };
type UploadFile = {
  file: File;
  kind: EVENT_MEDIA_KIND;
};

const jsonError = (error: string, status: number) =>
  NextResponse.json({ success: false, error }, { status });

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function cleanOriginalName(name: string): string {
  return path.basename(name.replaceAll("\\", "/")).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || "file";
}

function validateUpload(file: File, kind: EVENT_MEDIA_KIND): string | null {
  if (file.size <= 0) return "Empty files cannot be uploaded.";

  if (kind === EVENT_MEDIA_KIND.BANNER) {
    if (!EVENT_BANNER_MIME_TYPES.has(file.type)) {
      return "The event banner must be a JPEG, PNG, or WebP image.";
    }
    if (file.size > EVENT_BANNER_MAX_BYTES) return "The event banner must be 10 MB or smaller.";
    return null;
  }

  if (!EVENT_SUPPORTING_MIME_TYPES.has(file.type)) {
    return "This file type is not supported.";
  }
  if (file.size > EVENT_SUPPORTING_FILE_MAX_BYTES) {
    return "Each supporting file must be 20 MB or smaller.";
  }
  return null;
}

async function validateBannerContents(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (file.type === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  return file.type === "image/webp"
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!hasSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permission = await requirePermission("manage_events");
  if (!permission.success) return jsonError(permission.error, 403);

  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { event_slug: slug, deletedAt: null },
    select: { id: true },
  });
  if (!event) return jsonError("Event not found.", 404);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid upload form.", 400);
  }

  const bannerEntry = formData.get("banner");
  const banner = bannerEntry instanceof File && bannerEntry.size > 0 ? bannerEntry : null;
  const supportingFiles = formData
    .getAll("supportingFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const uploads: UploadFile[] = [
    ...(banner ? [{ file: banner, kind: EVENT_MEDIA_KIND.BANNER }] : []),
    ...supportingFiles.map((file) => ({ file, kind: EVENT_MEDIA_KIND.SUPPORTING })),
  ];

  if (uploads.length === 0) return jsonError("Choose at least one file to upload.", 400);
  if (supportingFiles.length > EVENT_SUPPORTING_FILE_MAX_COUNT) {
    return jsonError(`You can upload up to ${EVENT_SUPPORTING_FILE_MAX_COUNT} supporting files at a time.`, 400);
  }
  if (supportingFiles.length > 0) {
    const existingSupportingFiles = await prisma.eventMedia.aggregate({
      where: { eventId: event.id, kind: EVENT_MEDIA_KIND.SUPPORTING },
      _count: { _all: true },
      _sum: { sizeBytes: true },
    });
    if (existingSupportingFiles._count._all + supportingFiles.length > EVENT_SUPPORTING_FILE_MAX_COUNT) {
      return jsonError(`An event can have up to ${EVENT_SUPPORTING_FILE_MAX_COUNT} supporting files.`, 400);
    }
    const newFileBytes = supportingFiles.reduce((total, file) => total + file.size, 0);
    if ((existingSupportingFiles._sum.sizeBytes ?? 0) + newFileBytes > EVENT_SUPPORTING_FILES_MAX_BYTES) {
      return jsonError("An event's supporting files must total 60 MB or less.", 400);
    }
  }

  for (const upload of uploads) {
    const validationError = validateUpload(upload.file, upload.kind);
    if (validationError) return jsonError(validationError, 400);
    if (
      upload.kind === EVENT_MEDIA_KIND.BANNER
      && !await validateBannerContents(upload.file)
    ) {
      return jsonError("The selected banner is not a valid JPEG, PNG, or WebP image.", 400);
    }
  }

  const previousBanner = banner
    ? await prisma.eventMedia.findUnique({ where: { bannerForEventId: event.id } })
    : null;
  const stored: Array<{ key: string; upload: UploadFile }> = [];

  try {
    for (const upload of uploads) {
      const extension = path.extname(cleanOriginalName(upload.file.name)).toLowerCase().slice(0, 12);
      const key = `${event.id}/${randomUUID()}${extension}`;
      await storeEventMedia(key, new Uint8Array(await upload.file.arrayBuffer()), upload.file.type);
      stored.push({ key, upload });
    }

    const media = await prisma.$transaction(async (transaction) => {
      if (previousBanner) {
        await transaction.eventMedia.delete({ where: { id: previousBanner.id } });
      }

      return Promise.all(stored.map(({ key, upload }) =>
        transaction.eventMedia.create({
          data: {
            eventId: event.id,
            kind: upload.kind,
            bannerForEventId: upload.kind === EVENT_MEDIA_KIND.BANNER ? event.id : null,
            storageKey: key,
            originalName: cleanOriginalName(upload.file.name),
            mimeType: upload.file.type,
            sizeBytes: upload.file.size,
          },
          select: {
            id: true,
            kind: true,
            originalName: true,
            mimeType: true,
            sizeBytes: true,
            createdAt: true,
          },
        })
      ));
    });

    if (previousBanner) {
      try {
        await removeEventMedia(previousBanner.storageKey);
      } catch (error) {
        console.error("Replacing event banner left an old media object", error);
      }
    }

    return NextResponse.json({
      success: true,
      media: media.map((item) => ({
        id: item.id,
        kind: item.kind,
        name: item.originalName,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    const cleanupResults = await Promise.allSettled(stored.map(({ key }) => removeEventMedia(key)));
    cleanupResults.forEach((result) => {
      if (result.status === "rejected") console.error("Failed to clean up an incomplete media upload", result.reason);
    });
    console.error("Event media upload failed", error);
    return jsonError("Unable to upload event media.", 500);
  }
}
