import { randomUUID } from "crypto";

import { jsonError, jsonOk } from "@/lib/admin/api";
import { getCurrentUser } from "@/lib/admin/auth";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  PHOTO_BUCKET,
  UPLOAD_EXT_BY_TYPE,
  storagePathFromUrl,
} from "@/lib/admin/catalog";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Uploads photos to the public puppy-photos bucket.
 * Multipart form with one or more "files" entries.
 * Returns [{ url, path }] pairs — the path enables later deletion.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not authenticated.", 401);
  }
  if (!isServiceConfigured()) {
    return jsonError(
      "Supabase is not configured yet. Copy .env.local.example to .env.local and add your credentials.",
      503,
    );
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return jsonError("Supabase service-role key is missing.", 503);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart form data.", 400);
  }

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return jsonError("Choose at least one photo to upload.", 400);
  }
  if (files.length > MAX_UPLOAD_FILES) {
    return jsonError(`At most ${MAX_UPLOAD_FILES} photos per upload.`, 400);
  }

  const bucket = admin.storage.from(PHOTO_BUCKET);
  const uploaded: { url: string; path: string }[] = [];

  for (const file of files) {
    const extension = UPLOAD_EXT_BY_TYPE[file.type];
    if (!extension) {
      // Clean up anything already uploaded in this batch.
      if (uploaded.length > 0) {
        await bucket.remove(uploaded.map((item) => item.path));
      }
      return jsonError(
        `"${file.name}" is not a supported image type (use JPEG, PNG, WebP, GIF or AVIF).`,
        400,
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      if (uploaded.length > 0) {
        await bucket.remove(uploaded.map((item) => item.path));
      }
      return jsonError(
        `"${file.name}" is larger than 8 MB.`,
        400,
      );
    }

    const path = `${Date.now()}-${randomUUID()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await bucket.upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      if (uploaded.length > 0) {
        await bucket.remove(uploaded.map((item) => item.path));
      }
      return jsonError(`Upload failed: ${error.message}`, 500);
    }

    const { data } = bucket.getPublicUrl(path);
    uploaded.push({ url: data.publicUrl, path });
  }

  return jsonOk({ uploads: uploaded });
}

/** Deletes an uploaded photo by its public URL. */
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not authenticated.", 401);
  }
  if (!isServiceConfigured()) {
    return jsonError("Supabase is not configured yet.", 503);
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return jsonError("Supabase service-role key is missing.", 503);
  }

  const url = new URL(request.url).searchParams.get("url") ?? "";
  const path = storagePathFromUrl(url);

  if (!path) {
    return jsonError("That photo was not uploaded through this admin panel.", 400);
  }

  const { error } = await admin.storage.from(PHOTO_BUCKET).remove([path]);

  if (error) {
    return jsonError(`Could not delete the photo: ${error.message}`, 500);
  }

  return jsonOk();
}
