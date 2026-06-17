import Link from "next/link";
import { cookies } from "next/headers";
import { COPY, LOCALES, type Locale } from "@/lib/site-i18n";

function resolveLocale(value: string | undefined): Locale {
  return value && LOCALES.some((l) => l.code === value) ? (value as Locale) : "en";
}

export default async function NotFoundPage() {
  // Renders inside the [locale] root layout (which provides <html lang> and
  // SiteChrome's <main>), so this is a <div>, not a <main>. Locale comes from
  // the cookie the middleware sets.
  const cookieStore = await cookies();
  const t = COPY[resolveLocale(cookieStore.get("popout_locale")?.value)];

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-300 px-4 py-16 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border border-black/5 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
          {t.notFoundTitle}
        </h1>
        <p className="mt-3 text-gray-600">{t.notFoundDescription}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {t.footerBackHome}
          </Link>
        </div>
      </section>
    </div>
  );
}
