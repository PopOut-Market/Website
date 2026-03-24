import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you requested does not exist or is not publicly accessible.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
