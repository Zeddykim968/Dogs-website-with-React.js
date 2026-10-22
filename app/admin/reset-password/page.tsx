import type { Metadata } from "next";

import AuthCard from "@/components/admin/AuthCard";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a new password for your admin account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
