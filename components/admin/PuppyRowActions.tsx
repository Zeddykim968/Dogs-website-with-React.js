"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiSend } from "@/lib/admin/client";
import type { PuppyStatus } from "@/lib/data/puppies";

const STATUSES: PuppyStatus[] = ["Available", "Reserved", "Sold"];

interface PuppyRowActionsProps {
  id: string;
  name: string;
  status: PuppyStatus;
  featured: boolean;
}

/** Status select, featured toggle, edit and delete for one puppy row. */
export default function PuppyRowActions({
  id,
  name,
  status,
  featured,
}: PuppyRowActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patchBody(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);

    const result = await apiSend(`/api/admin/puppies/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.data.error ?? "Update failed.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${name}? This removes the listing from the site.`,
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);

    const result = await apiSend(`/api/admin/puppies/${encodeURIComponent(id)}`, {
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
        <select
          value={status}
          disabled={busy}
          onChange={(event) =>
            patchBody({ status: event.target.value as PuppyStatus })
          }
          aria-label={`Status for ${name}`}
          className="rounded-xl border border-[#e5dfd7] bg-white px-2 py-1.5 text-xs text-[#4b5563] outline-none focus:border-[#8b6f47] disabled:opacity-60"
        >
          {STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={busy}
          onClick={() => patchBody({ featured: !featured })}
          title={featured ? "Remove from featured" : "Mark as featured"}
          className={`rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
            featured
              ? "border-[#6b4f35] bg-[#6b4f35] text-white"
              : "border-[#e5dfd7] bg-white text-[#6b7280] hover:border-[#6b4f35] hover:text-[#6b4f35]"
          }`}
        >
          {featured ? "Featured" : "Feature"}
        </button>

        <a
          href={`/admin/puppies/${encodeURIComponent(id)}`}
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

      {error && <p className="text-xs text-[#b42318]">{error}</p>}
    </div>
  );
}
