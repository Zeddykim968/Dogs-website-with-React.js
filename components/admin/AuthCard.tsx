import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Centered card used by the public admin auth pages. */
export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#4d3827]"
          >
            Puppy Paradise
          </Link>

          <span className="rounded-full bg-[#4d3827] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Admin
          </span>
        </div>

        <div className="rounded-3xl border border-[#e8e2da] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1f2937]">{title}</h1>

          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-[#6b7280]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
