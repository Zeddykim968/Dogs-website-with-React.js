"use client";

import { useState, type FormEvent } from "react";

import { apiSend } from "@/lib/admin/client";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";
const labelClass = "mb-1.5 block text-sm font-medium text-[#4b5563]";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("The two new passwords do not match.");
      return;
    }

    setSaving(true);

    const result = await apiSend("/api/admin/account/password", {
      method: "POST",
      body: { currentPassword, newPassword },
    });

    setSaving(false);

    if (!result.ok) {
      setError(result.data.error ?? "Could not change the password.");
      return;
    }

    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#e8e2da] bg-white p-6"
    >
      <h2 className="font-bold text-[#1f2937]">Change password</h2>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="password-current">
            Current password
          </label>
          <input
            id="password-current"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password-new">
            New password
          </label>
          <input
            id="password-new"
            type="password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password-confirm">
            Confirm new
          </label>
          <input
            id="password-confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
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
          Password updated — use it the next time you sign in.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-full bg-[#6b4f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d3827] disabled:opacity-60"
      >
        {saving ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}
