import type { Metadata } from "next";

import AuthCard from "@/components/admin/AuthCard";
import RegisterForm from "@/components/admin/RegisterForm";

export const metadata: Metadata = {
  title: "Register admin",
  robots: { index: false },
};

export default function AdminRegisterPage() {
  return (
    <AuthCard
      title="Create an admin account"
      subtitle="The first account becomes the site administrator; later accounts need an invite code."
    >
      <RegisterForm />
    </AuthCard>
  );
}
