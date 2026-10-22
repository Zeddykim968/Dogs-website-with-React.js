import type { Metadata } from "next";

import AuthCard from "@/components/admin/AuthCard";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <AuthCard
      title="Admin sign in"
      subtitle="Manage puppies, breeds and photos for Puppy Paradise."
    >
      <LoginForm />
    </AuthCard>
  );
}
