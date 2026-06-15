"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";

function ChildSafetySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-700 sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}

export function ChildSafetyPageContent() {
  const { t, localizePath } = useSiteShell();

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-6 sm:py-8`}>
      <div className={`${INNER_MAX} space-y-6`}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft sm:p-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Child Safety Standards
          </h1>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>Last updated: 27 May 2026</p>
          </div>

          <p className="mt-3 text-xs italic text-gray-500">
            {t.legalEnglishAuthoritative}
          </p>

          <div className="mt-6 space-y-6">
            <div className="space-y-3 text-sm leading-relaxed text-gray-700 sm:text-[0.95rem]">
              <p>
                PopOut Market has zero tolerance for child sexual abuse and exploitation (CSAE)
                and child sexual abuse material (CSAM). This page outlines our standards and
                procedures to keep our platform safe.
              </p>
            </div>

            <ChildSafetySection title="Our Commitment">
              <p>We prohibit any content, communication, or behaviour that:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Sexualises minors in any way;</li>
                <li>Facilitates child grooming or exploitation;</li>
                <li>Shares, promotes, or solicits CSAM; or</li>
                <li>Endangers the safety or wellbeing of children.</li>
              </ul>
            </ChildSafetySection>

            <ChildSafetySection title="How We Prevent CSAE">
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Age requirement</strong>: PopOut Market is intended for users aged 18
                  and over.
                </li>
                <li>
                  <strong>Account verification</strong>: All users must verify their identity
                  through a valid Australian phone number.
                </li>
                <li>
                  <strong>Content moderation</strong>: We use automated and manual review to
                  detect prohibited content.
                </li>
                <li>
                  <strong>Restricted features</strong>: We do not allow content that targets
                  minors.
                </li>
              </ul>
            </ChildSafetySection>

            <ChildSafetySection title="In-App Reporting">
              <p>Users can report child safety concerns directly in the app:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Tap the report icon on any listing, chat, or profile;</li>
                <li>Select &quot;Child safety concern&quot; as the reason; and</li>
                <li>All reports are reviewed within 24 hours.</li>
              </ul>
            </ChildSafetySection>

            <ChildSafetySection title="Our Response">
              <p>Upon receiving a report involving CSAE or CSAM:</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>We immediately remove the content and suspend the involved account;</li>
                <li>We preserve relevant evidence in compliance with Australian law;</li>
                <li>
                  We report to the Australian Centre to Counter Child Exploitation (ACCCE) and
                  other relevant authorities as required; and
                </li>
                <li>We cooperate fully with law enforcement investigations.</li>
              </ol>
            </ChildSafetySection>

            <ChildSafetySection title="Legal Compliance">
              <p>PopOut Market complies with:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The Australian Online Safety Act 2021;</li>
                <li>Mandatory reporting obligations under Australian law; and</li>
                <li>International standards for CSAE prevention.</li>
              </ul>
            </ChildSafetySection>

            <ChildSafetySection title="Contact">
              <p>For child safety concerns or questions about these standards:</p>
              <p>
                Email: sooyoung.j@popoutmarket.com.au
                <br />
                Response time: Within 48 hours
              </p>
              <p>
                For urgent reports involving immediate harm to a child, please contact:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>ACCCE: report.cybercrime.gov.au</li>
                <li>Australian Federal Police: 131 444 (emergency: 000)</li>
              </ul>
            </ChildSafetySection>
          </div>
        </div>
      </div>
    </section>
  );
}
