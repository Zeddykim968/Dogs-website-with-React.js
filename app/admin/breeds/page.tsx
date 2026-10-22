import Link from "next/link";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import BreedRowActions from "@/components/admin/BreedRowActions";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getBreeds, getPuppies } from "@/lib/data/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Manage breeds",
  robots: { index: false },
};

export default async function AdminBreedsPage() {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const [breeds, puppies] = await Promise.all([getBreeds(), getPuppies()]);

  return (
    <AdminShell userName={fullName || user.email}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1f2937]">
            Breeds
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {breeds.length} {breeds.length === 1 ? "breed" : "breeds"} in the
            catalogue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/breeds/new"
            className="rounded-full bg-[#6b4f35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d3827] hover:shadow-lg"
          >
            + Add breed
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <div className="mt-6 rounded-3xl border border-[#e5d3b8] bg-[#fdf8ef] p-5 text-sm leading-6 text-[#6b7280]">
          Showing the bundled sample data — changes are saved once Supabase
          credentials are added to{" "}
          <code className="font-mono text-[#4d3827]">.env.local</code>.
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-3xl border border-[#e8e2da] bg-white">
        <ul className="divide-y divide-[#f0ebe3]">
          {breeds.map((breed) => {
            const count = puppies.filter(
              (puppy) => puppy.breedSlug === breed.slug,
            ).length;

            return (
              <li
                key={breed.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={breed.image}
                  alt={breed.name}
                  className="h-14 w-14 rounded-2xl bg-[#f3efe8] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1f2937]">
                    {breed.name}
                    <span className="ml-2 font-mono text-xs font-normal text-[#9ca3af]">
                      /{breed.slug}
                    </span>
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-[#6b7280]">
                    {breed.description}
                  </p>
                </div>

                <span className="rounded-full bg-[#f3efe8] px-3 py-1 text-xs font-semibold text-[#6b4f35]">
                  {count} {count === 1 ? "puppy" : "puppies"}
                </span>

                <BreedRowActions id={breed.id} name={breed.name} />
              </li>
            );
          })}

          {breeds.length === 0 && (
            <li className="px-6 py-12 text-center text-sm text-[#6b7280]">
              No breeds yet — add the first one.
            </li>
          )}
        </ul>
      </div>
    </AdminShell>
  );
}
