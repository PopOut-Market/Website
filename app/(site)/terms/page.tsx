"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";

function TermsSection({
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

export default function TermsPage() {
  const { t, localizePath } = useSiteShell();

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-6 sm:py-8`}>
      <div className={`${INNER_MAX} space-y-6`}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>

        <div className="rounded-[24px] border border-white/45 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Mobile App Terms and Conditions of Use
          </h1>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>POPOUT MARKET PTY LTD</p>
            <p>ACN 696 464 945</p>
            <p>ABN 76 696 464 945</p>
            <p>Address: 1003/151 City Rd, Southbank VIC 3006, Australia</p>
          </div>

          <div className="mt-7 space-y-7">
            <TermsSection title="1. About the Application">
              <p>
                Welcome to Popout Market (Application). The Application is an online platform
                that enables parties providing services or goods (Provider) and parties receiving
                services or goods (Receiver) to discover listings, communicate with each other,
                and independently arrange the inspection, payment, collection, and delivery of
                goods or services.
              </p>
              <p>
                The Application is operated by POPOUT MARKET Pty Ltd. We provide the
                Application as an intermediary technology platform only. We are not a buyer,
                seller, reseller, agent, broker, auctioneer, carrier, or financial services provider
                in relation to any transaction between Members.
              </p>
              <p>
                Any contract for the sale or exchange of goods is formed solely between the
                Provider and the Receiver. POPOUT MARKET Pty Ltd is not a party to such
                contracts. Services may include AI-powered listing generation, real-time
                translation, and safety moderation tools.
              </p>
              <p>
                By using, browsing, or reading the Application, you signify that you have read,
                understood, and agree to be bound by these Terms. If you do not agree, you must
                stop using the Application and Services immediately.
              </p>
            </TermsSection>

            <TermsSection title="2. Acceptance of the Terms">
              <p>You accept the Terms by accessing, browsing, or using the Application.</p>
              <p>
                Where available, you may also accept the Terms by clicking to &quot;accept&quot; or
                &quot;agree&quot; in the user interface. By doing so, you warrant that you have legal
                capacity to enter into a binding contract with POPOUT MARKET Pty Ltd.
              </p>
            </TermsSection>

            <TermsSection title="3. The Services">
              <p>
                To access the Services, both Receivers and Providers must register for an account
                (Account).
              </p>
              <p>
                To provide a secure and local marketplace, registration and usage may require
                personal information, including:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Email address and preferred username;</li>
                <li>Telephone number (verified via SMS OTP);</li>
                <li>Current suburb (verified via GPS mapping every 30 days);</li>
                <li>Optional profile image and recovery email;</li>
                <li>Optional university email for identity verification;</li>
                <li>User-generated content, including images and descriptions processed by AI;</li>
                <li>Communication data and chat history, including AI-assisted translation/moderation; and</li>
                <li>Member activity data (ratings, reviews, transaction history).</li>
              </ul>
              <p>
                You warrant all provided information is accurate, complete, and up to date.
                POPOUT MARKET Pty Ltd may verify identity, conduct fraud screening, and request
                additional information. Failure to comply may lead to suspension or termination.
              </p>
              <p>
                You may not use the Services if you are under 18 years old or otherwise barred by
                applicable law.
              </p>
            </TermsSection>

            <TermsSection title="4. Your Obligations as a Member">
              <p>As a Member, you agree that you will:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>not share your profile with any other person;</li>
                <li>use the Services only as permitted by these Terms and applicable law;</li>
                <li>keep access credentials confidential and notify us of any security breach;</li>
                <li>not impersonate another Member or use another account;</li>
                <li>ensure all content you submit is accurate and up to date;</li>
                <li>not harass, stalk, threaten, or abuse other Members;</li>
                <li>not use the platform for unauthorised commercial solicitation or spam;</li>
                <li>act in good faith for in-person transaction meetings and avoid repeated no-shows;</li>
                <li>not use automated means to access or use the Application.</li>
              </ul>
              <p>
                Prohibited items include weapons, controlled substances, counterfeit goods, stolen
                goods, hazardous materials, and illegal content (including adult services or hate
                speech).
              </p>
            </TermsSection>

            <TermsSection title="5. Using the Application as the Receiver">
              <p>Receivers (Buyers) must:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>create an Account and complete mandatory verification;</li>
                <li>browse listings where AI translation may be shown for convenience;</li>
                <li>contact Providers directly through in-app messaging;</li>
                <li>agree pickup location and payment terms directly with Provider;</li>
                <li>inspect items and complete payment directly to Provider;</li>
                <li>arrange collection/delivery directly with Provider; and</li>
                <li>leave rating and review based on transaction experience.</li>
              </ul>
              <p>
                Popout Market does not facilitate, process, hold, escrow, remit, or settle
                payments between Members.
              </p>
            </TermsSection>

            <TermsSection title="6. Using the Application as the Provider">
              <p>Providers (Sellers) must:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>create an Account and complete mandatory verification;</li>
                <li>create accurate listings and review AI-generated draft content;</li>
                <li>remain responsible for listing legality and accuracy;</li>
                <li>respond to enquiries and coordinate transaction terms directly with Receiver;</li>
                <li>facilitate collection as described in listing; and</li>
                <li>leave rating and review for the Receiver.</li>
              </ul>
              <p>
                Providers are solely responsible for their listings and must avoid prohibited items
                and repeated no-shows.
              </p>
            </TermsSection>

            <TermsSection title="7. Refund Policy">
              <p>
                POPOUT MARKET Pty Ltd is an intermediary platform only and is not a party to
                transactions between Members. We do not process or control payments and do not
                provide refunds for transactions arranged through the Application.
              </p>
              <p>
                Refunds/returns are matters between Receiver and Provider, subject to Australian
                Consumer Law (ACL). If unresolved after 14 days, the Receiver may report through
                the Contact Us channel for platform-level review.
              </p>
            </TermsSection>

            <TermsSection title="8. Copyright and Intellectual Property">
              <p>
                The Application and Services are protected by intellectual property laws. All
                rights in platform materials are owned or controlled by POPOUT MARKET Pty Ltd
                or its contributors.
              </p>
              <p>
                You are granted a limited, non-exclusive, revocable licence to use the Application
                for personal, non-commercial purposes while you are a Member.
              </p>
              <p>
                By posting Your Content, you grant POPOUT MARKET Pty Ltd a non-exclusive,
                transferable, perpetual, royalty-free, irrevocable, worldwide licence to use,
                display, distribute, adapt and process that content, including for AI-assisted
                listing generation and translation.
              </p>
            </TermsSection>

            <TermsSection title="9. Privacy">
              <p>
                Information provided through the Application is handled in accordance with our
                Privacy Policy.
              </p>
            </TermsSection>

            <TermsSection title="10. General Disclaimer">
              <p>
                To the maximum extent permitted by law, the Application and Services are
                provided on an &quot;as is&quot; and &quot;as available&quot; basis.
              </p>
              <p>
                We do not warrant uninterrupted access, complete accuracy of user or AI-assisted
                content, or quality/legality of goods and services listed by Members.
              </p>
              <p>
                AI tools are provided for convenience only. Members remain solely responsible for
                reviewing and approving all content before relying on or publishing it.
              </p>
            </TermsSection>

            <TermsSection title="11. Competitors">
              <p>
                If you provide competing services for commercial gain, you are a competitor and
                are not permitted to access platform information/content for that purpose.
              </p>
            </TermsSection>

            <TermsSection title="12. Limitation of Liability">
              <p>
                Nothing in these Terms excludes rights that cannot lawfully be excluded under
                Australian law.
              </p>
              <p>
                Subject to applicable law, POPOUT MARKET Pty Ltd&apos;s aggregate liability is
                limited to resupply of Services and excludes indirect/consequential loss, loss of
                profits, revenue, data, goodwill, and similar losses.
              </p>
            </TermsSection>

            <TermsSection title="13. Termination of Contract">
              <p>
                You may terminate these Terms by giving 7 days&apos; notice via Contact Us.
                POPOUT MARKET Pty Ltd may suspend or terminate access where Terms or laws are
                breached, or where platform safety/integrity requires it.
              </p>
              <p>
                For specified suspensions, written grounds are provided and Members are given an
                opportunity to respond.
              </p>
            </TermsSection>

            <TermsSection title="14. Indemnity">
              <p>
                You indemnify POPOUT MARKET Pty Ltd and its personnel against losses arising
                from your content, your legal/terms breaches, your unlawful conduct, and disputes
                caused by your acts or omissions, subject to limits set by law.
              </p>
            </TermsSection>

            <TermsSection title="15. Dispute Resolution">
              <p>
                Parties must first attempt good-faith resolution before tribunal/court proceedings
                (except urgent interlocutory relief), including notice, negotiation, and mediation
                steps under these Terms.
              </p>
              <p>
                For Provider-Receiver transaction disputes, parties should first use in-app
                messaging; unresolved matters may be escalated for non-binding platform-level
                review and moderation support.
              </p>
            </TermsSection>

            <TermsSection title="16. Venue and Jurisdiction">
              <p>
                Exclusive venue for disputes is the courts of Victoria, Australia.
              </p>
            </TermsSection>

            <TermsSection title="17. Governing Law">
              <p>The Terms are governed by the laws of Victoria, Australia.</p>
            </TermsSection>

            <TermsSection title="18. Severance">
              <p>
                If any part of these Terms is unenforceable, that part is severed and the
                remainder continues in full force.
              </p>
            </TermsSection>

            <TermsSection title="19. Feedback">
              <p>
                By providing feedback, ideas or suggestions, you grant POPOUT MARKET Pty Ltd
                a perpetual, irrevocable, royalty-free licence to use them without compensation.
              </p>
            </TermsSection>

            <TermsSection title="20. Relationship of Parties">
              <p>
                Nothing in these Terms creates partnership, agency, employment, fiduciary or
                representative relationship between you and POPOUT MARKET Pty Ltd.
              </p>
            </TermsSection>

            <TermsSection title="21. Entire Agreement">
              <p>
                These Terms are the entire agreement between you and POPOUT MARKET Pty Ltd in
                relation to the Application and Services.
              </p>
            </TermsSection>
          </div>
        </div>
      </div>
    </section>
  );
}
