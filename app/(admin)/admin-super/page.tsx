"use client";

import Link from "next/link";

export default function AdminSuperEntryPage() {
  return (
    <section className="mx-auto min-h-screen w-full max-w-4xl space-y-6 bg-slate-50 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Access Center</h1>

      <article className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Admin Login</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your authorized admin mobile number — we&apos;ll send a one-time SMS
          code.
        </p>
        <Link
          href="/admin-super/admin-login"
          className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          Sign In
        </Link>
      </article>
    </section>
  );
}
