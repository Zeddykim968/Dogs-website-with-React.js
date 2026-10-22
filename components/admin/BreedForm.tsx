"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { slugify } from "@/lib/admin/catalog";
import type { Breed } from "@/lib/data/breeds";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";
const labelClass = "mb-1.5 block text-sm font-medium text-[#4b5563]";

interface BreedFormProps {
  /** Present in edit mode; omitted when creating. */
  breed?: Breed;
}

export default function BreedForm({ breed }: BreedFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(breed?.name ?? "");
  const [description, setDescription] = useState(breed?.description ?? "");
  const [image, setImage] = useState(breed?.image ?? "");
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const previewSlug = slugify(name);

  async function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        uploads?: { url: string }[];
      };

      if (!response.ok || !data.uploads?.[0]) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      setImage(data.uploads[0].url);
    } catch {
      setError("Network error — try again.");
    } finally {
      setUploading(false);
    }
  }

  function addImageFromUrl() {
    const url = urlDraft.trim();
    if (!url) {
      return;
    }
    if (!url.startsWith("/") && !url.startsWith("https://")) {
      setError("Use an https:// URL or upload a file.");
      return;
    }
    setError(null);
    setImage(url);
    setUrlDraft("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!image) {
      setError("Add a cover photo for the breed.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        breed
          ? `/api/admin/breeds/${encodeURIComponent(breed.id)}`
          : "/api/admin/breeds",
        {
          method: breed ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, image }),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not save the breed.");
        return;
      }

      router.push("/admin/breeds");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-[#e8e2da] bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="breed-form-name">
              Breed name
            </label>
            <input
              id="breed-form-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Golden Retriever"
              className={inputClass}
            />
            {!breed && (
              <p className="mt-1.5 text-xs text-[#9ca3af]">
                URL: /breeds/{previewSlug || "…"}
              </p>
            )}
            {breed && (
              <p className="mt-1.5 text-xs text-[#9ca3af]">
                URL stays /breeds/{breed.slug} — slugs cannot be renamed.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Cover photo</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full border border-[#d9d0c5] px-4 py-2.5 text-xs font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] hover:bg-[#6b4f35] hover:text-white disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "+ Upload photo"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                hidden
                onChange={handleImageSelected}
              />

              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Breed cover"
                  className="h-14 w-14 rounded-2xl bg-[#f3efe8] object-cover"
                />
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                placeholder="…or paste an image URL"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addImageFromUrl}
                className="rounded-full border border-[#d9d0c5] px-4 py-2.5 text-xs font-semibold text-[#6b4f35] transition hover:border-[#6b4f35]"
              >
                Use
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="breed-form-description">
              Description
            </label>
            <textarea
              id="breed-form-description"
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Friendly, affectionate and playful dogs known for their gentle nature."
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1.5 text-xs text-[#9ca3af]">
              10–600 characters — shown on the breed card and profile.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-[#6b4f35] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
        >
          {saving ? "Saving…" : breed ? "Save changes" : "Add breed"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/breeds")}
          className="text-sm font-medium text-[#6b7280] hover:text-[#6b4f35]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
