import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import BreedForm from "@/components/admin/BreedForm";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getBreedBySlug } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Edit breed",
  robots: { index: false },
};

interface EditBreedPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBreedPage({ params }: EditBreedPageProps) {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const { id } = await params;
  const breed = await getBreedBySlug(id);

  if (!breed) {
    notFound();
  }

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
          Edit {breed.name}
        </h1>
      </div>

      <BreedForm breed={breed} />
    </AdminShell>
  );
}
