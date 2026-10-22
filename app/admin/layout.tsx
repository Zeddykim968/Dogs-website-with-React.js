import type { Metadata } from "next";

// Admin pages are authenticated and always freshly rendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-[#faf9f6]">{children}</div>;
}
