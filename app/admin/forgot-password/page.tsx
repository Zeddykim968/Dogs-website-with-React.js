import type { Metadata } from "next";

import AuthCard from "@/components/admin/AuthCard";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your admin email and we will send you a link to set a new one."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
