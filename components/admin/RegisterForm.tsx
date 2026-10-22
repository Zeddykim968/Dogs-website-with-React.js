"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

type SetupStatus = {
  supabase?: boolean;
  service?: boolean;
  brevo?: boolean;
};

type RegisterStatusResponse = {
  setup?: SetupStatus;
  needsInvite?: boolean;
  error?: string;
};

type RegisterResponse = {
  error?: string;
  email?: string;
  inviteCode?: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [status, setStatus] = useState<RegisterStatusResponse | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<RegisterResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/register")
      .then((response) => response.json())
      .then((data: RegisterStatusResponse) => {
        if (active) {
          setStatus(data);
        }
      })
      .catch(() => {
        if (active) {
          setStatus({ setup: { supabase: false } });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          inviteCode: status?.needsInvite ? inviteCode : undefined,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as RegisterResponse;

      if (!response.ok) {
        setError(data.error ?? "Registration failed. Try again.");
        return;
      }

      setCreated(data);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-[#e8f1e7] px-4 py-4 text-sm leading-6 text-[#42613d]">
          Admin account created for{" "}
          <span className="font-semibold">{created.email}</span>. You can sign
          in now.
        </div>

        {created.inviteCode && (
          <div className="rounded-2xl border border-[#d9c2a6] bg-[#fdf8ef] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8b6f47]">
              Your invite code — shown once
            </p>
            <p className="mt-2 font-mono text-xl font-bold tracking-widest text-[#4d3827]">
              {created.inviteCode}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#6b7280]">
              Future admin accounts need this code to register. Copy it now —
              it cannot be shown again (you can rotate it later from Account
              settings).
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  .writeText(created.inviteCode ?? "")
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => {});
              }}
              className="mt-3 rounded-full border border-[#6b4f35] px-4 py-2 text-xs font-semibold text-[#6b4f35] transition hover:bg-[#6b4f35] hover:text-white"
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg"
        >
          Continue to sign in
        </button>
      </div>
    );
  }

  if (status && status.setup && !status.setup.supabase) {
    return (
      <div className="rounded-2xl border border-[#e8e2da] bg-[#faf9f6] p-5 text-sm leading-6 text-[#6b7280]">
        <p className="font-semibold text-[#4d3827]">
          Supabase is not connected yet
        </p>
        <p className="mt-2">
          Copy <code className="font-mono text-[#4d3827]">.env.local.example</code>{" "}
          to <code className="font-mono text-[#4d3827]">.env.local</code>, fill
          in your project URL and keys, run{" "}
          <code className="font-mono text-[#4d3827]">supabase/schema.sql</code>{" "}
          in the SQL editor, then restart the dev server.
        </p>
        <p className="mt-3">
          <Link
            href="/admin/login"
            className="font-medium text-[#6b4f35] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-2xl bg-[#f3efe8] px-4 py-6 text-center text-sm text-[#6b7280]">
        Loading…
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

      {!status.needsInvite && (
        <div className="rounded-2xl bg-[#e8f1e7] px-4 py-3 text-sm leading-6 text-[#42613d]">
          First account — no invite code needed. This becomes the site
          administrator.
        </div>
      )}

      <div>
        <label
          htmlFor="register-name"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Full name
        </label>
        <input
          id="register-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Wanjiku"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Email address
        </label>
        <input
          id="register-email"
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
          htmlFor="register-phone"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Phone <span className="text-[#9ca3af]">(optional)</span>
        </label>
        <input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+254 7xx xxx xxx"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-1.5 block text-sm font-medium text-[#4b5563]"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      {status.needsInvite && (
        <div>
          <label
            htmlFor="register-invite"
            className="mb-1.5 block text-sm font-medium text-[#4b5563]"
          >
            Invite code
          </label>
          <input
            id="register-invite"
            type="text"
            required
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
            placeholder="Provided by an existing admin"
            className={`${inputClass} font-mono tracking-wider`}
          />
          <p className="mt-1.5 text-xs text-[#9ca3af]">
            An existing admin must share an invite code — new accounts cannot
            self-register.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-[#6b4f35] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create admin account"}
      </button>

      <p className="mt-2 text-center text-sm text-[#6b7280]">
        Already registered?{" "}
        <Link
          href="/admin/login"
          className="font-medium text-[#6b4f35] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
