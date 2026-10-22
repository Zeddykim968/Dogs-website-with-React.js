"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Wraps the public storefront with Navbar + Footer, but omits them on
 * admin routes so /admin can render its own shell.
 */
export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
}
