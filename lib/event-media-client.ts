"use client";

export async function uploadEventMedia(
  slug: string,
  banner: File | null,
  supportingFiles: File[]
): Promise<void> {
  const formData = new FormData();
  if (banner) formData.set("banner", banner);
  supportingFiles.forEach((file) => formData.append("supportingFiles", file));

  const response = await fetch(`/api/events/${encodeURIComponent(slug)}/media`, {
    method: "POST",
    body: formData,
  });
  const result: { success?: boolean; error?: string } = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Unable to upload event media.");
  }
}

export async function deleteSupportingFile(slug: string, mediaId: number): Promise<void> {
  const response = await fetch(
    `/api/events/${encodeURIComponent(slug)}/media/${mediaId}`,
    { method: "DELETE" }
  );
  const result: { success?: boolean; error?: string } = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Unable to delete this supporting file.");
  }
}
