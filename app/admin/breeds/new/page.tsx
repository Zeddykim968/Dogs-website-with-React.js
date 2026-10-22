import Link from "next/link";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import BreedForm from "@/components/admin/BreedForm";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Add breed",
  robots: { index: false },
};

export default async function NewBreedPage() {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  return (
    <AdminShell userName={fullName || user.email}>
      <div className="mb-8">
        <Link
          href="/admin/breeds"
          className="text-sm font-semibold text-[#6b4f35] hover:underline"
        >
          ← Back to breeds
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937]">
          Add a breed
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          New breeds appear in the marketplace filters and breed pages
          immediately.
        </p>
      </div>

      <BreedForm />
    </AdminShell>
  );
}
