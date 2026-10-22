import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import PuppyForm from "@/components/admin/PuppyForm";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getBreeds, getPuppyById } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Edit puppy",
  robots: { index: false },
};

interface EditPuppyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPuppyPage({ params }: EditPuppyPageProps) {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const { id } = await params;
  const [puppy, breeds] = await Promise.all([getPuppyById(id), getBreeds()]);

  if (!puppy) {
    notFound();
  }

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
          Edit {puppy.name}
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Changes appear on the site as soon as you save.
        </p>
      </div>

      <PuppyForm breeds={breeds} puppy={puppy} />
    </AdminShell>
  );
}
