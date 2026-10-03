import { EVENT_MEDIA_KIND } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

import { requirePermission } from "@/lib/authz";
import { removeEventMedia, readEventMedia } from "@/lib/event-media-storage";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string; mediaId: string }> };

function contentDisposition(name: string, inline: boolean): string {
  const safeName = name.replace(/[\r\n"]/g, "_");
  return `${inline ? "inline" : "attachment"}; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const permission = await requirePermission("manage_events");
  if (!permission.success) return NextResponse.json({ error: permission.error }, { status: 403 });

  const { slug, mediaId: rawMediaId } = await params;
  const mediaId = Number(rawMediaId);
  if (!Number.isSafeInteger(mediaId) || mediaId < 1) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  const media = await prisma.eventMedia.findFirst({
    where: {
      id: mediaId,
      event: { event_slug: slug, deletedAt: null },
    },
  });
  if (!media) return NextResponse.json({ error: "Media not found." }, { status: 404 });

  try {
    const stored = await readEventMedia(media.storageKey, media.mimeType);
    const inline = media.kind === EVENT_MEDIA_KIND.BANNER;
    return new Response(new Uint8Array(stored.body), {
      headers: {
        "Content-Type": stored.contentType,
        "Content-Length": String(stored.sizeBytes),
        "Content-Disposition": contentDisposition(media.originalName, inline),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Reading event media failed", error);
    return NextResponse.json({ error: "Unable to retrieve this file." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
  }

  const permission = await requirePermission("manage_events");
  if (!permission.success) {
    return NextResponse.json({ success: false, error: permission.error }, { status: 403 });
  }

  const { slug, mediaId: rawMediaId } = await params;
  const mediaId = Number(rawMediaId);
  if (!Number.isSafeInteger(mediaId) || mediaId < 1) {
    return NextResponse.json({ success: false, error: "Media not found." }, { status: 404 });
  }

  const media = await prisma.eventMedia.findFirst({
    where: {
      id: mediaId,
      kind: EVENT_MEDIA_KIND.SUPPORTING,
      event: { event_slug: slug, deletedAt: null },
    },
  });
  if (!media) {
    return NextResponse.json({ success: false, error: "Supporting file not found." }, { status: 404 });
  }

  try {
    await prisma.eventMedia.delete({ where: { id: media.id } });
  } catch (error) {
    console.error("Deleting supporting file metadata failed", error);
    return NextResponse.json({ success: false, error: "Unable to delete this supporting file." }, { status: 500 });
  }

  try {
    await removeEventMedia(media.storageKey);
  } catch (error) {
    console.error("Deleted supporting file metadata but failed to remove stored file", error);
  }

  return NextResponse.json({ success: true });
}
