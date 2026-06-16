"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// Locale-aware error boundary for the public site. Catches runtime/render errors
// in (site) pages and shows a branded recovery screen instead of an unstyled
// fallback. The "Back to home" link keeps the active locale.
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  const params = useParams();
  const seg = typeof params?.locale === "string" ? params.locale : "en";
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border border-black/5 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          Something went wrong
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          We hit a snag loading this page
        </h1>
        <p className="mt-3 text-gray-600">
          Please try again. If it keeps happening, head back to the home page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Try again
          </button>
          <Link
            href={`/${seg}`}
            className="inline-flex rounded-xl border border-gray-400 px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
