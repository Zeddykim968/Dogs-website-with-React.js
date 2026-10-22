"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Puppies", href: "/admin/puppies" },
  { label: "Breeds", href: "/admin/breeds" },
  { label: "Account", href: "/admin/account" },
];

interface AdminShellProps {
  children: React.ReactNode;
  userName?: string;
}

/** Top navigation chrome for authenticated admin pages. */
export default function AdminShell({ children, userName }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <header className="sticky top-0 z-40 border-b border-[#e5e1da] bg-[#faf9f6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#4d3827]">
              Puppy Paradise
            </span>
            <span className="rounded-full bg-[#4d3827] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Admin
            </span>
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-[#6b4f35] underline decoration-[#6b4f35] decoration-2 underline-offset-8"
                      : "text-[#4b5563] hover:text-[#6b4f35]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {userName && (
              <span className="hidden text-xs text-[#9ca3af] sm:inline">
                {userName}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-[#d9d0c5] px-4 py-1.5 text-xs font-semibold text-[#6b4f35] transition hover:border-[#6b4f35] hover:bg-[#6b4f35] hover:text-white disabled:opacity-60"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">{children}</main>
    </div>
  );
}
