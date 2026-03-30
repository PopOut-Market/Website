"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import Link from "next/link";

export function FooterLegalStubPage({ title }: { title: string }) {
  const { t, localizePath } = useSiteShell();
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-8`}>
      <div className={INNER_MAX}>
        <Link
          href={localizePath("/")}
          className="text-sm font-medium text-black underline decoration-gray-400 underline-offset-4 hover:text-black hover:decoration-gray-400"
        >
          {t.footerBackHome}
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{t.footerLegalStub}</p>
      </div>
    </section>
  );
}
