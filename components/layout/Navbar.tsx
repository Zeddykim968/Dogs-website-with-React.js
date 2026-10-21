"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e5e1da] bg-[#faf9f6]/95 backdrop-blur">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#4d3827]"
          >
            {SITE_CONFIG.name}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#6b4f35]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#6b4f35] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg"
            >
              Chat With Us
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-[#4d3827] transition hover:bg-[#e9e2d9] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}