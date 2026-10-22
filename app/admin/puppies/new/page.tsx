import Link from "next/link";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import PuppyForm from "@/components/admin/PuppyForm";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getBreeds } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Add puppy",
  robots: { index: false },
};

export default async function NewPuppyPage() {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const breeds = await getBreeds();

  return (
    <AdminShell userName={fullName || user.email}>
      <div className="mb-8">
        <Link
          href="/admin/puppies"
          className="text-sm font-semibold text-[#6b4f35] hover:underline"
        >
          ← Back to puppies
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937]">
          Add a puppy
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Upload photos, pick a breed and publish the listing to the site.
        </p>
      </div>

      <PuppyForm breeds={breeds} />
    </AdminShell>
  );
}
