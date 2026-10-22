"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

type ResetResponse = {
  error?: string;
  sent?: boolean;
  devResetLink?: string;
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => ({}))) as ResetResponse;

      if (!response.ok) {
        setError(data.error ?? "Could not request a reset. Try again.");
        return;
      }

      setSent(Boolean(data.sent));
      setDevLink(data.devResetLink ?? null);
      setDone(true);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-[#e8f1e7] px-4 py-4 text-sm leading-6 text-[#42613d]">
          {sent
            ? "If an admin account exists for that address, a reset email is on its way. Open the link inside to choose a new password."
            : devLink
              ? "A reset link was generated. In development it is shown below; with BREVO_API_KEY set it is emailed instead."
              : "If an admin account exists for that address, a reset link has been requested."}
        </div>

        {devLink && (
          <div className="rounded-2xl border border-[#e8e2da] bg-[#faf9f6] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b6f47]">
              Development reset link
            </p>
            <a
              href={devLink}
              className="mt-2 block break-all text-sm text-[#6b4f35] underline"
            >
              {devLink}
            </a>
            <p className="mt-3 text-xs leading-5 text-[#9ca3af]">
              Valid for one hour. In production this link is only delivered
              by email (Brevo).
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/admin/login"
            className="font-medium text-[#6b4f35] hover:underline"
          >
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setDevLink(null);
            }}
            className="text-[#6b7280] hover:text-[#6b4f35]"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="forgot-email"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>

      <p className="mt-2 text-center text-sm text-[#6b7280]">
        Remembered it?{" "}
        <Link
          href="/admin/login"
          className="font-medium text-[#6b4f35] hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
