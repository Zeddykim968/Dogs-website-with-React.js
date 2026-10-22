import Link from "next/link";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { getPuppies, getBreeds } from "@/lib/data/queries";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isServiceConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false },
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#e8e2da] bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8b6f47]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-[#1f2937]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#9ca3af]">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const { fullName } = toPublicUser(user);

  const [puppies, breeds] = await Promise.all([getPuppies(), getBreeds()]);
  const available = puppies.filter((puppy) => puppy.status === "Available");
  const featured = puppies.filter((puppy) => puppy.featured);

  let adminCount: number | null = null;
  if (isServiceConfigured()) {
    const admin = createSupabaseAdmin();
    if (admin) {
      const { data } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });
      adminCount = data?.users.length ?? null;
    }
  }

  const recentPuppies = puppies.slice(0, 6);

  return (
    <AdminShell userName={fullName || user.email}>
      {!isSupabaseConfigured() && (
        <div className="mb-8 rounded-3xl border border-[#e5d3b8] bg-[#fdf8ef] p-6">
          <h2 className="font-bold text-[#4d3827]">
            Supabase is not connected yet
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            Copy <code className="font-mono text-[#4d3827]">.env.local.example</code>{" "}
            to{" "}
            <code className="font-mono text-[#4d3827]">.env.local</code>, add
            your project URL and keys, run{" "}
            <code className="font-mono text-[#4d3827]">supabase/schema.sql</code>{" "}
            in the Supabase SQL editor, and restart the server. The public
            site currently shows the bundled sample data.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1f2937]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Welcome back{fullName ? `, ${fullName}` : ""}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/puppies/new"
            className="rounded-full bg-[#6b4f35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d3827] hover:shadow-lg"
          >
            + Add puppy
          </Link>
          <Link
            href="/admin/breeds/new"
            className="rounded-full border border-[#d9d0c5] px-5 py-2.5 text-sm font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] hover:bg-white"
          >
            + Add breed
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Puppies"
          value={String(puppies.length)}
          hint="listed on the site"
        />
        <StatCard
          label="Available"
          value={String(available.length)}
          hint="ready for a home"
        />
        <StatCard
          label="Breeds"
          value={String(breeds.length)}
          hint="in the catalogue"
        />
        <StatCard
          label="Featured"
          value={String(featured.length)}
          hint="shown on the homepage"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#6b7280]">
        <span>
          Registered admins:{" "}
          <span className="font-semibold text-[#1f2937]">
            {adminCount ?? (isServiceConfigured() ? "—" : "not connected")}
          </span>
        </span>
        <span>
          Photo storage:{" "}
          <span className="font-semibold text-[#1f2937]">
            {isServiceConfigured() ? "Supabase Storage" : "not connected"}
          </span>
        </span>
      </div>

      {/* Recent puppies */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold text-[#1f2937]">
            Recent puppies
          </h2>
          <Link
            href="/admin/puppies"
            className="text-sm font-semibold text-[#6b4f35] hover:underline"
          >
            Manage all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-[#e8e2da] bg-white">
          {recentPuppies.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[#6b7280]">
              No puppies yet. Add the first one.
            </p>
          ) : (
            <ul className="divide-y divide-[#f0ebe3]">
              {recentPuppies.map((puppy) => (
                <li
                  key={puppy.id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={puppy.image}
                    alt={puppy.name}
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1f2937]">
                      {puppy.name}
                    </p>
                    <p className="truncate text-xs text-[#9ca3af]">
                      {puppy.breed}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      puppy.status === "Available"
                        ? "bg-[#e8f1e7] text-[#42613d]"
                        : puppy.status === "Reserved"
                          ? "bg-[#eee9e2] text-[#6b4f35]"
                          : "bg-[#e5e7eb] text-[#4b5563]"
                    }`}
                  >
                    {puppy.status}
                  </span>
                  <a
                    href={`/admin/puppies/${encodeURIComponent(puppy.id)}`}
                    className="text-xs font-semibold text-[#6b4f35] hover:underline"
                  >
                    Edit
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
