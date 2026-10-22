"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiSend } from "@/lib/admin/client";

interface BreedRowActionsProps {
  id: string;
  name: string;
}

/** Edit and delete for one breed row. */
export default function BreedRowActions({ id, name }: BreedRowActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the ${name} breed? Puppies must be reassigned first.`,
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);

    const result = await apiSend(`/api/admin/breeds/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.data.error ?? "Delete failed.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <a
          href={`/admin/breeds/${encodeURIComponent(id)}`}
          className="rounded-xl border border-[#e5dfd7] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4b5563] transition hover:border-[#6b4f35] hover:text-[#6b4f35]"
        >
          Edit
        </a>

        <button
          type="button"
          disabled={busy}
          onClick={handleDelete}
          className="rounded-xl border border-[#f0c9c5] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#b42318] transition hover:bg-[#fdecec] disabled:opacity-60"
        >
          {busy ? "…" : "Delete"}
        </button>
      </div>

      {error && <p className="max-w-[220px] text-right text-xs text-[#b42318]">
        {error}
      </p>}
    </div>
  );
}
