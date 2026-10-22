"use client";

import { useState } from "react";

import { apiSend } from "@/lib/admin/client";

export default function InviteCard() {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rotateInvite() {
    const confirmed = window.confirm(
      "Generate a new invite code? Any previously shared code stops working.",
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);

    const result = await apiSend<{ code?: string }>("/api/admin/invite", {
      method: "POST",
    });

    setBusy(false);

    if (!result.ok || !result.data.code) {
      setError(result.data.error ?? "Could not generate a code.");
      return;
    }

    setCode(result.data.code);
    setCopied(false);
  }

  return (
    <div className="rounded-3xl border border-[#e8e2da] bg-white p-6">
      <h2 className="font-bold text-[#1f2937]">Registration invite code</h2>
      <p className="mt-1 text-sm leading-6 text-[#6b7280]">
        New admin accounts need a valid invite code to register. Generate one
        and share it with the person you trust — it is shown once and cannot
        be recovered later.
      </p>

      {error && (
        <div className="mt-4 rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
          {error}
        </div>
      )}

      {code && (
        <div className="mt-4 rounded-2xl border border-[#d9c2a6] bg-[#fdf8ef] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8b6f47]">
            New invite code — shown once
          </p>
          <p className="mt-2 font-mono text-xl font-bold tracking-widest text-[#4d3827]">
            {code}
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                .writeText(code)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => {});
            }}
            className="mt-3 rounded-full border border-[#6b4f35] px-4 py-2 text-xs font-semibold text-[#6b4f35] transition hover:bg-[#6b4f35] hover:text-white"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={rotateInvite}
        disabled={busy}
        className="mt-5 rounded-full border border-[#d9d0c5] px-6 py-3 text-sm font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] hover:bg-[#6b4f35] hover:text-white disabled:opacity-60"
      >
        {busy ? "Generating…" : code ? "Generate another code" : "Generate invite code"}
      </button>
    </div>
  );
}
