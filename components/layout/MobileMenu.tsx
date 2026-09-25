"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#faf9f6] md:hidden">
      <div className="flex h-20 items-center justify-between border-b border-[#e5e1da] px-6">
        <span className="text-xl font-bold text-[#4d3827]">
          {SITE_CONFIG.name}
        </span>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-2 text-[#4d3827]"
        >
          <X size={26} />
        </button>
      </div>

      <nav className="flex flex-col gap-6 px-6 py-10">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="text-2xl font-semibold text-[#4d3827]"
          >
            {link.label}
          </Link>
        ))}

        <a
          href={`https://wa.me/${SITE_CONFIG.whatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-full bg-[#6b4f35] px-6 py-4 text-center font-semibold text-white"
        >
          Chat With Us
        </a>
      </nav>
    </div>
  );
}