"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Phase = "checking" | "ready" | "invalid" | "missing" | "done";

export default function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>(() =>
    SUPABASE_URL && SUPABASE_ANON_KEY ? "checking" : "missing",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick up the recovery session from the emailed link (#access_token=…
  // &type=recovery hash, handled by supabase-js URL detection).
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return;
    }

    let active = true;
    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) {
          return;
        }
        if (data.session) {
          setPhase("ready");
          window.history.replaceState({}, "", window.location.pathname);
        } else {
          setPhase("invalid");
        }
      })
      .catch(() => {
        if (active) {
          setPhase("invalid");
        }
      });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (!active) {
          return;
        }
        if (event === "PASSWORD_RECOVERY") {
          setPhase((current) => (current === "done" ? current : "ready"));
        }
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        if (response.status === 401) {
          setPhase("invalid");
        }
        setError(data.error ?? "Could not update the password. Try again.");
        return;
      }

      setPhase("done");
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (phase === "missing") {
    return (
      <div className="rounded-2xl border border-[#e8e2da] bg-[#faf9f6] p-5 text-sm leading-6 text-[#6b7280]">
        <p className="font-semibold text-[#4d3827]">
          Supabase is not connected yet
        </p>
        <p className="mt-2">
          Copy <code className="font-mono text-[#4d3827]">.env.local.example</code>{" "}
          to <code className="font-mono text-[#4d3827]">.env.local</code> and
          add your project credentials to complete password resets.
        </p>
      </div>
    );
  }

  if (phase === "checking") {
    return (
      <div className="rounded-2xl bg-[#f3efe8] px-4 py-6 text-center text-sm text-[#6b7280]">
        Verifying your reset link…
      </div>
    );
  }

  if (phase === "invalid") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-[#fdecec] px-4 py-4 text-sm leading-6 text-[#b42318]">
          This reset link is invalid, expired or already used. Request a new
          one — links are valid for one hour.
        </div>
        <Link
          href="/admin/forgot-password"
          className="w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-[#4d3827]"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-[#e8f1e7] px-4 py-4 text-sm leading-6 text-[#42613d]">
          Your password has been updated. Sign in with the new password.
        </div>
        <Link
          href="/admin/login"
          className="w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-[#4d3827]"
        >
          Go to sign in
        </Link>
      </div>
    );
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
          htmlFor="reset-password"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="reset-confirm"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Confirm new password
        </label>
        <input
          id="reset-confirm"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Repeat the password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
      >
        {loading ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
