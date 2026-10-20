import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#faf9f6] px-6 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3efe8] text-[#6b4f35]">
        <Search size={26} />
      </div>

      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
        Error 404
      </p>

      <h1 className="mt-4 text-5xl font-bold tracking-tight text-[#1f2937] md:text-6xl">
        Page not found
      </h1>

      <p className="mt-5 max-w-md text-lg leading-8 text-[#6b7280]">
        The page you are looking for does not exist or may have been moved.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-[#6b4f35] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-xl"
        >
          Back To Home
        </Link>

        <Link
          href="/puppies"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c2a6] px-6 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8]"
        >
          Browse Puppies
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}
