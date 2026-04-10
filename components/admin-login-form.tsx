"use client";

import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type AdminLoginFormProps = {
  title: string;
  description: string;
  successRedirectTo?: string;
  showSignInButton?: boolean;
};

export function AdminLoginForm({
  title,
  description,
  successRedirectTo = "/admin-super/dashboard",
  showSignInButton = true,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const configured = useMemo(() => isAdminAuthConfigured(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setSubmitting(true);
    setErrorText(null);

    try {
      const supabase = getAdminAuthBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorText(error.message);
        return;
      }

      router.replace(successRedirectTo);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-slate-50 px-[1.05rem] py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{description}</p>

      {!configured ? (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Missing Supabase browser env keys. Set
          <code className="mx-1 rounded bg-amber-100 px-1 py-0.5">EXPO_PUBLIC_SUPABASE_URL</code>
          and
          <code className="ml-1 rounded bg-amber-100 px-1 py-0.5">EXPO_PUBLIC_SUPABASE_ANON_KEY</code>.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-800">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="admin@company.com"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-800">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="********"
            required
          />
        </label>

        {errorText ? (
          <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorText}
          </p>
        ) : null}

        {showSignInButton ? (
          <button
            type="submit"
            disabled={!configured || submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Sign in is currently disabled for this account type.
          </p>
        )}
      </form>

      <div className="mt-5 text-sm text-slate-600">
        <Link
          href="/admin-super"
          className="font-medium text-slate-900 underline underline-offset-4"
        >
          Back to admin-super
        </Link>
      </div>
      </div>
    </section>
  );
}
