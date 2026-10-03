export const EVENT_BANNER_MAX_BYTES = 10 * 1024 * 1024;
export const EVENT_SUPPORTING_FILE_MAX_BYTES = 20 * 1024 * 1024;
export const EVENT_SUPPORTING_FILE_MAX_COUNT = 8;
export const EVENT_SUPPORTING_FILES_MAX_BYTES = 60 * 1024 * 1024;

export const EVENT_BANNER_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const EVENT_SUPPORTING_MIME_TYPES = new Set([
  ...EVENT_BANNER_MIME_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain",
]);

export type EventMediaDto = {
  id: number;
  kind: "BANNER" | "SUPPORTING";
  name: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
};

export function mediaUrl(slug: string, mediaId: number): string {
  return `/api/events/${encodeURIComponent(slug)}/media/${mediaId}`;
}
