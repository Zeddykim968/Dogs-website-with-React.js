import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import PuppyGallery from "@/components/puppies/PuppyGallery";
import PuppyInfo from "@/components/puppies/PuppyInfo";
import PuppyContact from "@/components/puppies/PuppyContact";

import { puppies } from "@/lib/data/puppies";

interface PuppyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PuppyDetailsPage({
  params,
}: PuppyDetailsPageProps) {
  const { id } = await params;

  const puppy = puppies.find((item) => item.id === id);

  if (!puppy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        {/* Back */}
        <Link
          href="/puppies"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#6b4f35] transition hover:gap-3"
        >
          <ArrowLeft size={17} />
          Back to puppies
        </Link>

        {/* Main content */}
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PuppyGallery puppy={puppy} />

          <div>
            <PuppyInfo puppy={puppy} />

            <PuppyContact puppy={puppy} />
          </div>
        </div>
      </section>
    </main>
  );
}