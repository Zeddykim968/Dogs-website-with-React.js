import type { Metadata } from "next";
import SiteChrome from "@/components/layout/SiteChrome";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Find Your Perfect Companion`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Discover healthy and happy puppies looking for their new homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}