"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { BackNavLink } from "@/components/back-nav-link";

export function FooterLegalStubPage({ title }: { title: string }) {
  const { t, localizePath } = useSiteShell();
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-8`}>
      <div className={INNER_MAX}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{t.footerLegalStub}</p>
      </div>
    </section>
  );
}
