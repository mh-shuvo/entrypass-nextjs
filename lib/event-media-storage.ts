import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type StoredMedia = {
  body: Uint8Array;
  contentType: string;
  sizeBytes: number;
};

const requiredS3Environment = ["S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const;

function getS3Configuration() {
  const values = requiredS3Environment.map((name) => process.env[name]?.trim() ?? "");
  const anyConfigured = values.some(Boolean) || Boolean(process.env.S3_ENDPOINT?.trim());
  if (!anyConfigured) return null;

  const missing = requiredS3Environment.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Incomplete S3 configuration. Missing: ${missing.join(", ")}`);
  }

  return {
    bucket: process.env.S3_BUCKET!.trim(),
    region: process.env.S3_REGION?.trim() || "us-east-1",
    endpoint: process.env.S3_ENDPOINT?.trim() || undefined,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!.trim(),
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!.trim(),
  };
}

let s3Client: S3Client | undefined;

function getS3Client(configuration: NonNullable<ReturnType<typeof getS3Configuration>>) {
  s3Client ??= new S3Client({
    region: configuration.region,
    endpoint: configuration.endpoint,
    forcePathStyle: Boolean(configuration.endpoint),
    credentials: {
      accessKeyId: configuration.accessKeyId,
      secretAccessKey: configuration.secretAccessKey,
    },
  });
  return s3Client;
}

function getLocalPath(storageKey: string): string {
  const root = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_DIR || path.join(process.cwd(), "uploads", "event-media"));
  const target = path.resolve(root, storageKey);
  if (!target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid media storage key.");
  }
  return target;
}

export async function storeEventMedia(
  storageKey: string,
  body: Uint8Array,
  contentType: string
): Promise<void> {
  const configuration = getS3Configuration();
  if (configuration) {
    await getS3Client(configuration).send(new PutObjectCommand({
      Bucket: configuration.bucket,
      Key: storageKey,
      Body: body,
      ContentType: contentType,
    }));
    return;
  }

  const target = getLocalPath(storageKey);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  await writeFile(target, body, { flag: "wx", mode: 0o600 });
}

export async function readEventMedia(storageKey: string, contentType: string): Promise<StoredMedia> {
  const configuration = getS3Configuration();
  if (configuration) {
    const response = await getS3Client(configuration).send(new GetObjectCommand({
      Bucket: configuration.bucket,
      Key: storageKey,
    }));
    if (!response.Body) {
      throw new Error("Stored media has no content.");
    }
    const body = await response.Body.transformToByteArray();
    return {
      body,
      contentType: response.ContentType || contentType,
      sizeBytes: response.ContentLength ?? body.byteLength,
    };
  }

  const body = await readFile(/*turbopackIgnore: true*/ getLocalPath(storageKey));
  return { body, contentType, sizeBytes: body.byteLength };
}

export async function removeEventMedia(storageKey: string): Promise<void> {
  const configuration = getS3Configuration();
  if (configuration) {
    await getS3Client(configuration).send(new DeleteObjectCommand({
      Bucket: configuration.bucket,
      Key: storageKey,
    }));
    return;
  }

  await rm(getLocalPath(storageKey), { force: true });
}
