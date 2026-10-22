"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { apiSend } from "@/lib/admin/client";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";
const labelClass = "mb-1.5 block text-sm font-medium text-[#4b5563]";

interface ProfileFormProps {
  initialName: string;
  initialPhone: string;
}

export default function ProfileForm({
  initialName,
  initialPhone,
}: ProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const result = await apiSend("/api/admin/account", {
      method: "PATCH",
      body: { fullName, phone },
    });

    setSaving(false);

    if (!result.ok) {
      setError(result.data.error ?? "Could not save your profile.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#e8e2da] bg-white p-6"
    >
      <h2 className="font-bold text-[#1f2937]">Profile</h2>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="profile-name">
            Full name
          </label>
          <input
            id="profile-name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="profile-phone">
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+254 7xx xxx xxx"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
          {error}
        </div>
      )}
      {saved && !error && (
        <div className="mt-4 rounded-2xl bg-[#e8f1e7] px-4 py-3 text-sm font-medium text-[#42613d]">
          Profile saved.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-full bg-[#6b4f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d3827] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
