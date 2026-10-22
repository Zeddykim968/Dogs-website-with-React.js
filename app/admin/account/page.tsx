import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import InviteCard from "@/components/admin/InviteCard";
import PasswordForm from "@/components/admin/PasswordForm";
import ProfileForm from "@/components/admin/ProfileForm";
import { requireAdmin, toPublicUser } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSetupStatus } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Account settings",
  robots: { index: false },
};

export default async function AdminAccountPage() {
  const user = await requireAdmin();
  const { fullName, email } = toPublicUser(user);
  const setup = getSetupStatus();

  const supabase = await createSupabaseServerClient();
  const profileResult = supabase
    ? await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle()
    : null;
  const profile = profileResult?.data;

  const initialName = profile?.full_name ?? fullName;
  const initialPhone = profile?.phone ?? "";

  const memberSince = new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AdminShell userName={initialName || email}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1f2937]">
          Account settings
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Your admin profile, password and registration invite code.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Account summary */}
        <aside className="w-full rounded-3xl border border-[#e8e2da] bg-white p-6 lg:w-72 lg:shrink-0">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#4d3827] text-xl font-bold text-white">
            {(initialName || email).charAt(0).toUpperCase()}
          </div>

          <p className="mt-4 font-bold text-[#1f2937]">
            {initialName || "Admin"}
          </p>
          <p className="break-all text-sm text-[#6b7280]">{email}</p>

          <dl className="mt-4 space-y-2 border-t border-[#eee9e2] pt-4 text-xs text-[#9ca3af]">
            <div className="flex justify-between gap-2">
              <dt>Member since</dt>
              <dd className="font-medium text-[#4b5563]">{memberSince}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Database</dt>
              <dd className="font-medium text-[#4b5563]">
                {setup.supabase ? "Connected" : "Not connected"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Reset emails</dt>
              <dd className="font-medium text-[#4b5563]">
                {setup.brevo ? "Brevo" : setup.supabase ? "Dev link only" : "—"}
              </dd>
            </div>
          </dl>
        </aside>

        {/* Settings */}
        <div className="flex flex-1 flex-col gap-6">
          <ProfileForm initialName={initialName} initialPhone={initialPhone} />

          <PasswordForm />

          <InviteCard />
        </div>
      </div>
    </AdminShell>
  );
}
