"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { useSiteShell } from "@/components/site-chrome-context";
import type { SiteCopy } from "@/lib/site-i18n";

const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

function useInViewOnce(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

function StaggerBlock({
  show,
  delayMs,
  children,
}: {
  show: boolean;
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="transition-all duration-[400ms]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(1.25rem)",
        transitionDelay: show ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: ease,
      }}
    >
      {children}
    </div>
  );
}

export function AboutPageContent({ t }: { t: SiteCopy }) {
  const { localizePath } = useSiteShell();
  const { ref: shellRef, inView: shellInView } = useInViewOnce("0px 0px -8% 0px");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!shellInView) return;
    const id = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(id);
  }, [shellInView]);

  return (
    <div className={`${SHELL_X} flex min-h-0 flex-1 flex-col pb-16 pt-8 sm:pb-24 sm:pt-12`}>
      <div className={INNER_MAX}>
        <Link
          href={localizePath("/")}
          className="inline-block text-sm font-medium text-black underline decoration-gray-400 underline-offset-4 hover:text-black hover:decoration-gray-400"
        >
          {t.footerBackHome}
        </Link>

        <article
          ref={shellRef as React.RefObject<HTMLElement>}
          className="mt-8 overflow-hidden rounded-[28px] border border-gray-200/90 bg-white/90 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-opacity duration-[400ms] sm:mt-10"
          style={{
            opacity: shellInView ? 1 : 0,
            transitionTimingFunction: ease,
          }}
        >
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <StaggerBlock show={animate} delayMs={0}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {t.aboutPageTitle}
              </p>
              <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl md:text-[2rem] md:leading-snug">
                {t.aboutMainHeading}
              </h1>
            </StaggerBlock>

            <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-12">
              <StaggerBlock show={animate} delayMs={100}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutOurStoryTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutOurStoryP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutOurStoryP2}
                  </p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={150}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutWhyTitle}
                  </h2>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {t.aboutWhyNeighbourhoodTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhyNeighbourhoodBody}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{t.aboutWhySafetyTitle}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhySafetyBody}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {t.aboutWhyCommunicationTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhyCommunicationBody}
                      </p>
                    </div>
                  </div>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={200}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutPrivacyTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutPrivacyLead}
                  </p>
                  <ul className="mt-6 space-y-5">
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyMinimalTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyMinimalBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyStorageTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyStorageBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyNoTracesTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyNoTracesBody}
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8 flex justify-center sm:justify-start">
                    <Link
                      href={localizePath("/privacy")}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-white"
                    >
                      <span className="text-balance text-center">{t.aboutPrivacyLinkMore}</span>
                      <span aria-hidden className="text-gray-400">
                        →
                      </span>
                    </Link>
                  </div>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={250}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutVisionTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP2}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP3}
                  </p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={300}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutFeedbackTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutFeedbackLead}
                  </p>
                    <div className="mt-5">
                      <a
                        href={`mailto:${t.aboutSupportEmail}`}
                        className="inline-flex text-[15px] font-medium text-black underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500"
                      >
                        {t.aboutSupportEmail}
                      </a>
                    </div>
                </section>
              </StaggerBlock>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
