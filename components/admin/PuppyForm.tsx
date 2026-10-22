"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import type { Breed } from "@/lib/data/breeds";
import type { Puppy, PuppyGender, PuppyStatus } from "@/lib/data/puppies";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

const labelClass = "mb-1.5 block text-sm font-medium text-[#4b5563]";

const MAX_PHOTOS = 10;

interface PuppyFormProps {
  breeds: Breed[];
  /** Present in edit mode; omitted when creating. */
  puppy?: Puppy;
}

type UploadedPhoto = { url: string; path: string };

export default function PuppyForm({ breeds, puppy }: PuppyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const breedFileInputRef = useRef<HTMLInputElement>(null);

  const [breedList, setBreedList] = useState<Breed[]>(breeds);

  // Core fields
  const [name, setName] = useState(puppy?.name ?? "");
  const [breedSlug, setBreedSlug] = useState(
    puppy?.breedSlug ?? breeds[0]?.slug ?? "",
  );
  const [gender, setGender] = useState<PuppyGender>(puppy?.gender ?? "Male");
  const [age, setAge] = useState(puppy?.age ?? "");
  const [ageInMonths, setAgeInMonths] = useState(
    String(puppy?.ageInMonths ?? ""),
  );
  const [price, setPrice] = useState(puppy ? String(puppy.price) : "");
  const [location, setLocation] = useState(puppy?.location ?? "");
  const [status, setStatus] = useState<PuppyStatus>(puppy?.status ?? "Available");
  const [featured, setFeatured] = useState(puppy?.featured ?? false);
  const [vaccinated, setVaccinated] = useState(puppy?.vaccinated ?? true);
  const [dewormed, setDewormed] = useState(puppy?.dewormed ?? true);
  const [temperamentText, setTemperamentText] = useState(
    puppy?.temperament.join(", ") ?? "",
  );
  const [description, setDescription] = useState(puppy?.description ?? "");

  // Photos
  const [images, setImages] = useState<string[]>(() => {
    if (!puppy) {
      return [];
    }
    return Array.from(new Set([puppy.image, ...puppy.images].filter(Boolean)));
  });
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Inline breed creation
  const [showBreedPanel, setShowBreedPanel] = useState(false);
  const [breedName, setBreedName] = useState("");
  const [breedDescription, setBreedDescription] = useState("");
  const [breedImage, setBreedImage] = useState("");
  const [breedImageUploading, setBreedImageUploading] = useState(false);
  const [savingBreed, setSavingBreed] = useState(false);

  // Submit
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function uploadFiles(files: File[]): Promise<UploadedPhoto[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      uploads?: UploadedPhoto[];
    };

    if (!response.ok || !data.uploads) {
      throw new Error(data.error ?? "Upload failed.");
    }

    return data.uploads;
  }

  async function handlePhotosSelected(event: ChangeEvent<HTMLInputElement>) {
    setPhotoError(null);

    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }
    if (images.length + files.length > MAX_PHOTOS) {
      setPhotoError(`At most ${MAX_PHOTOS} photos per puppy.`);
      return;
    }

    setUploading(true);
    try {
      const uploads = await uploadFiles(files);
      setImages((current) => [...current, ...uploads.map((u) => u.url)]);
    } catch (cause) {
      setPhotoError(
        cause instanceof Error ? cause.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    const target = images[index];
    setImages((current) => current.filter((_, i) => i !== index));

    // Best-effort cleanup of uploaded files (external URLs are ignored).
    if (target && target.includes("/puppy-photos/")) {
      fetch(
        `/api/admin/uploads?url=${encodeURIComponent(target)}`,
        { method: "DELETE" },
      ).catch(() => {});
    }
  }

  function makeCover(index: number) {
    setImages((current) => {
      if (index === 0) {
        return current;
      }
      const next = [...current];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });
  }

  function addImageFromUrl() {
    const url = urlDraft.trim();
    if (!url) {
      return;
    }
    if (!url.startsWith("/") && !url.startsWith("https://")) {
      setPhotoError("Use an https:// URL or upload a file.");
      return;
    }
    setPhotoError(null);
    setImages((current) =>
      current.includes(url) ? current : [...current, url],
    );
    setUrlDraft("");
  }

  async function handleBreedImageSelected(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setBreedImageUploading(true);
    setPhotoError(null);

    try {
      const uploads = await uploadFiles(files);
      if (uploads[0]) {
        setBreedImage(uploads[0].url);
      }
    } catch (cause) {
      setPhotoError(
        cause instanceof Error ? cause.message : "Upload failed.",
      );
    } finally {
      setBreedImageUploading(false);
    }
  }

  async function handleCreateBreed() {
    setSavingBreed(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/breeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: breedName,
          description: breedDescription,
          image: breedImage,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        id?: string;
      };

      if (!response.ok || !data.id) {
        setError(data.error ?? "Could not create the breed.");
        return;
      }

      const created: Breed = {
        id: data.id,
        slug: data.id,
        name: breedName.trim(),
        description: breedDescription.trim(),
        image: breedImage,
      };

      setBreedList((current) => [...current, created]);
      setBreedSlug(created.slug);
      setShowBreedPanel(false);
      setBreedName("");
      setBreedDescription("");
      setBreedImage("");
    } catch {
      setError("Network error — try again.");
    } finally {
      setSavingBreed(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!breedSlug) {
      setError("Choose a breed (or add a new one).");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    const payload = {
      name,
      breedSlug,
      gender,
      age,
      ageInMonths: Number(ageInMonths) || 0,
      price: Number(price),
      status,
      featured,
      location,
      description,
      temperament: temperamentText
        .split(",")
        .map((trait) => trait.trim())
        .filter(Boolean),
      vaccinated,
      dewormed,
      images,
      image: images[0],
    };

    setSaving(true);

    try {
      const response = await fetch(
        puppy
          ? `/api/admin/puppies/${encodeURIComponent(puppy.id)}`
          : "/api/admin/puppies",
        {
          method: puppy ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not save the puppy.");
        return;
      }

      router.push("/admin/puppies");
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

      {/* Photos */}
      <section className="rounded-3xl border border-[#e8e2da] bg-white p-6">
        <h2 className="font-bold text-[#1f2937]">Photos</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          The first photo is the cover. Click a photo to make it the cover.
        </p>

        {photoError && (
          <div className="mt-3 rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
            {photoError}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`group relative overflow-hidden rounded-2xl border-2 ${
                  index === 0 ? "border-[#6b4f35]" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="aspect-square w-full bg-[#f3efe8] object-cover"
                />

                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-[#6b4f35] px-2 py-0.5 text-[10px] font-semibold text-white">
                    Cover
                  </span>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4d3827]"
                    >
                      Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#b42318]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= MAX_PHOTOS}
            className="rounded-full border border-[#d9d0c5] px-5 py-2.5 text-sm font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] hover:bg-[#6b4f35] hover:text-white disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "+ Upload photos"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            hidden
            onChange={handlePhotosSelected}
          />

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder="…or paste an image URL"
              className={`${inputClass} w-64`}
            />
            <button
              type="button"
              onClick={addImageFromUrl}
              className="rounded-full border border-[#d9d0c5] px-4 py-2.5 text-xs font-semibold text-[#6b4f35] transition hover:border-[#6b4f35]"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-3xl border border-[#e8e2da] bg-white p-6">
        <h2 className="font-bold text-[#1f2937]">Details</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="puppy-name">
              Name
            </label>
            <input
              id="puppy-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Bruno"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-breed">
              Breed
            </label>
            <select
              id="puppy-breed"
              value={breedSlug}
              onChange={(event) => {
                if (event.target.value === "__new__") {
                  setShowBreedPanel(true);
                } else {
                  setBreedSlug(event.target.value);
                }
              }}
              className={inputClass}
            >
              {breedList.length === 0 && <option value="">No breeds yet</option>}
              {breedList.map((breed) => (
                <option key={breed.slug} value={breed.slug}>
                  {breed.name}
                </option>
              ))}
              <option value="__new__">+ Add new breed…</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-gender">
              Gender
            </label>
            <select
              id="puppy-gender"
              value={gender}
              onChange={(event) => setGender(event.target.value as PuppyGender)}
              className={inputClass}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-status">
              Status
            </label>
            <select
              id="puppy-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PuppyStatus)
              }
              className={inputClass}
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-age">
              Age label
            </label>
            <input
              id="puppy-age"
              required
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="4 months"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-age-months">
              Age in months
            </label>
            <input
              id="puppy-age-months"
              type="number"
              min={0}
              max={60}
              value={ageInMonths}
              onChange={(event) => setAgeInMonths(event.target.value)}
              placeholder="4"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-price">
              Price (KSh)
            </label>
            <input
              id="puppy-price"
              type="number"
              required
              min={0}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="65000"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="puppy-location">
              Location
            </label>
            <input
              id="puppy-location"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Nairobi"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="puppy-temperament">
              Personality traits{" "}
              <span className="text-[#9ca3af]">(comma-separated)</span>
            </label>
            <input
              id="puppy-temperament"
              value={temperamentText}
              onChange={(event) => setTemperamentText(event.target.value)}
              placeholder="Playful, Loyal, Intelligent"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="puppy-description">
              Description
            </label>
            <textarea
              id="puppy-description"
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the puppy's personality and what makes them special…"
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-[#4b5563]">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="size-4 accent-[#6b4f35]"
            />
            Feature on the homepage
          </label>

          <label className="flex items-center gap-2 text-sm text-[#4b5563]">
            <input
              type="checkbox"
              checked={vaccinated}
              onChange={(event) => setVaccinated(event.target.checked)}
              className="size-4 accent-[#6b4f35]"
            />
            Vaccinated
          </label>

          <label className="flex items-center gap-2 text-sm text-[#4b5563]">
            <input
              type="checkbox"
              checked={dewormed}
              onChange={(event) => setDewormed(event.target.checked)}
              className="size-4 accent-[#6b4f35]"
            />
            Dewormed
          </label>
        </div>
      </section>

      {/* Inline new breed */}
      {showBreedPanel && (
        <section className="rounded-3xl border border-[#d9c2a6] bg-[#fdf8ef] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#4d3827]">Add a new breed</h2>
            <button
              type="button"
              onClick={() => setShowBreedPanel(false)}
              className="text-sm text-[#6b7280] hover:text-[#6b4f35]"
            >
              Cancel
            </button>
          </div>

          <div className="contents">
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="breed-name">
                Breed name
              </label>
              <input
                id="breed-name"
                required
                value={breedName}
                onChange={(event) => setBreedName(event.target.value)}
                placeholder="Beagle"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Cover photo</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => breedFileInputRef.current?.click()}
                  disabled={breedImageUploading}
                  className="rounded-full border border-[#d9d0c5] bg-white px-4 py-2.5 text-xs font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] disabled:opacity-60"
                >
                  {breedImageUploading ? "Uploading…" : "+ Upload"}
                </button>

                <input
                  ref={breedFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  hidden
                  onChange={handleBreedImageSelected}
                />

                {breedImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={breedImage}
                    alt="Breed cover"
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="breed-description">
                Description
              </label>
              <textarea
                id="breed-description"
                required
                rows={2}
                value={breedDescription}
                onChange={(event) => setBreedDescription(event.target.value)}
                placeholder="Curious, cheerful and energetic companions…"
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateBreed}
            disabled={savingBreed}
            className="mt-4 rounded-full bg-[#6b4f35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d3827] disabled:opacity-60"
          >
            {savingBreed ? "Creating…" : "Create & select breed"}
          </button>
          </div>
        </section>
      )}

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-[#6b4f35] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : puppy
              ? "Save changes"
              : "Add puppy"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/puppies")}
          className="text-sm font-medium text-[#6b7280] hover:text-[#6b4f35]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
