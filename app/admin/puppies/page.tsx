import Link from "next/link";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import PuppyRowActions from "@/components/admin/PuppyRowActions";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getPuppies } from "@/lib/data/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Manage puppies",
  robots: { index: false },
};

export default async function AdminPuppiesPage() {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const puppies = await getPuppies();

  return (
    <AdminShell userName={fullName || user.email}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1f2937]">
            Puppies
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {puppies.length} {puppies.length === 1 ? "listing" : "listings"} on
            the site.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/puppies/new"
            className="rounded-full bg-[#6b4f35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d3827] hover:shadow-lg"
          >
            + Add puppy
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

      <div className="mt-8 overflow-x-auto rounded-3xl border border-[#e8e2da] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#eee9e2] text-xs uppercase tracking-wider text-[#9ca3af]">
              <th className="px-5 py-3.5 font-semibold">Puppy</th>
              <th className="px-3 py-3.5 font-semibold">Breed</th>
              <th className="px-3 py-3.5 font-semibold">Price</th>
              <th className="px-3 py-3.5 font-semibold">Location</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3]">
            {puppies.map((puppy) => (
              <tr key={puppy.id} className="align-middle">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={puppy.image}
                      alt={puppy.name}
                      className="h-12 w-12 rounded-xl bg-[#f3efe8] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1f2937]">
                        {puppy.name}
                      </p>
                      <p className="text-xs text-[#9ca3af]">
                        {puppy.gender} · {puppy.age}
                        {puppy.featured ? " · ★ featured" : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-[#4b5563]">{puppy.breed}</td>
                <td className="px-3 py-3.5 font-semibold text-[#4d3827]">
                  KSh {puppy.price.toLocaleString()}
                </td>
                <td className="px-3 py-3.5 text-[#4b5563]">
                  {puppy.location}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
                    <PuppyRowActions
                      id={puppy.id}
                      name={puppy.name}
                      status={puppy.status}
                      featured={puppy.featured}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {puppies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#6b7280]">
                  No puppies yet — add the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
