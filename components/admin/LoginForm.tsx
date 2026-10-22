"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Sign-in failed. Try again.");
        return;
      }

      const next = nextParam.startsWith("/") ? nextParam : "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-2xl bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#b42318]">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <div className="mt-1 text-right">
        <Link
          href="/admin/forgot-password"
          className="text-sm font-medium text-[#6b4f35] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-2 text-center text-sm text-[#6b7280]">
        First admin?{" "}
        <Link
          href="/admin/register"
          className="font-medium text-[#6b4f35] hover:underline"
        >
          Register the first account
        </Link>
      </p>
    </form>
  );
}
