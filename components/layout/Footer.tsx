
import Link from "next/link";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e1da] bg-[#f3efe8]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-[#4d3827]">
              {SITE_CONFIG.name}
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b7280]">
              Helping families find loving, healthy and happy puppies to
              welcome into their homes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#4d3827]">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6b7280] transition-colors hover:text-[#6b4f35]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#4d3827]">
              Follow Us
            </h3>

            <a
              href={SITE_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#6b7280] transition-colors hover:text-[#6b4f35]"
            >
              {/* Facebook icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="5"
                  ry="5"
                />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>

              Instagram
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-[#ddd5ca] pt-6 text-center text-sm text-[#6b7280]">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
