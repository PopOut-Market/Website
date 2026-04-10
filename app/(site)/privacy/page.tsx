"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";

function PrivacySection({
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

export default function PrivacyPage() {
  const { t, localizePath } = useSiteShell();

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-6 sm:py-8`}>
      <div className={`${INNER_MAX} space-y-6`}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>

        <div className="rounded-[24px] border border-white/45 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Application Privacy Policy
          </h1>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>POPOUT MARKET PTY LTD</p>
            <p>ACN 696 464 945</p>
            <p>Effective Date: 28 March 2026</p>
            <p>Version: 1.4</p>
          </div>

          <div className="mt-7 space-y-7">
            <PrivacySection title="Overview">
              <p>
                POPOUT MARKET PTY LTD (&quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;) is committed to protecting your privacy and handling personal
                information in accordance with the Privacy Act 1988 (Cth) and the Australian
                Privacy Principles (APPs).
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose and store your
                personal information when you use the Popout Market application and related
                services.
              </p>
            </PrivacySection>

            <PrivacySection title="Anonymity and Pseudonymity">
              <p>
                Where practicable, you may interact with us using a pseudonym, such as a
                nickname displayed on your public profile.
              </p>
              <p>
                However, because Popout Market is designed as a secure local marketplace, we
                require certain identifying information, including a verified phone number and
                verified suburb, to support user safety, fraud prevention and trusted
                transactions. For that reason, full anonymity is not available when creating and
                using an account.
              </p>
            </PrivacySection>

            <PrivacySection title="Children&apos;s Privacy">
              <p>
                Our application is intended for use in Australia. We do not knowingly collect
                personal information from children under 13 years of age.
              </p>
              <p>For users aged 13 to 17, we apply additional safeguards, including:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>limiting collection to information reasonably necessary for marketplace functionality;</li>
                <li>excluding those users from direct marketing and behavioural profiling; and</li>
                <li>restricting public profile visibility compared with adult accounts.</li>
              </ul>
              <p>
                If we become aware that we have collected personal information from a child under
                13, we will take reasonable steps to delete that information.
              </p>
            </PrivacySection>

            <PrivacySection title="What Personal Information We Collect">
              <p>We may collect the following categories of personal information:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Identity and contact information, such as your name, email address and phone number;</li>
                <li>Account and profile information, including your suburb verification status and profile nickname;</li>
                <li>Marketplace content, such as listing text, listing images, descriptions and chat messages;</li>
                <li>Location information, limited to temporary GPS coordinates used to verify your suburb;</li>
                <li>Technical information, such as IP address, device identifiers, crash logs and app usage diagnostics; and</li>
                <li>Communications and support information, including messages you send to us and records of complaints or support requests.</li>
              </ul>
            </PrivacySection>

            <PrivacySection title="How We Collect Personal Information">
              <p>We collect personal information from two main sources:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Directly from you, when you create an account, submit listings, upload photos, send messages, contact support or otherwise use the application; and</li>
                <li>Automatically from your device or application use, including technical data collected through our service providers and temporary GPS access used for suburb verification.</li>
              </ul>
            </PrivacySection>

            <PrivacySection title="Location Verification">
              <p>
                To support a local and trusted marketplace, we request GPS access approximately
                every 30 days for around 10 seconds to verify your suburb.
              </p>
              <p>
                The GPS coordinates collected for this purpose are used only for suburb
                verification and are deleted immediately after verification. We retain your
                verified suburb name, but we do not track or store your location history.
              </p>
            </PrivacySection>

            <PrivacySection title="Why We Collect, Hold and Use Personal Information">
              <p>We collect, hold and use personal information for purposes including to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>provide and operate the Popout Market application;</li>
                <li>create and manage user accounts;</li>
                <li>verify user identity and suburb location;</li>
                <li>facilitate local transactions between users;</li>
                <li>detect, prevent and investigate fraud, misuse and security issues;</li>
                <li>generate, translate and moderate marketplace content;</li>
                <li>communicate with you about your account, transactions or support requests;</li>
                <li>send marketing communications where you have given consent; and</li>
                <li>comply with legal, regulatory and record-keeping obligations.</li>
              </ul>
            </PrivacySection>

            <PrivacySection title="AI Features and Automated Decision-Making">
              <p>
                We use third-party AI service providers, including OpenAI and Anthropic, to
                support features such as listing generation, translation and content moderation.
              </p>
              <p>
                Where practicable, we take steps to minimise the personal information sent to
                those providers. For example, personal identifiers such as phone numbers are
                removed before content is processed where this is reasonably possible.
              </p>
              <p>
                We require these providers, under our contractual arrangements, not to use your
                content to train their general models.
              </p>
              <p>
                We also use automated systems to help detect fraud and moderate listings. In some
                cases, these systems may suspend or hide listings that are flagged as suspicious
                or non-compliant.
              </p>
              <p>
                If an automated decision significantly affects your account or access to our
                services, you may request an explanation and human review by contacting
                privacy@popoutmarket.com.au. We aim to respond within 5 business days.
              </p>
            </PrivacySection>

            <PrivacySection title="Marketing Communications">
              <p>
                We will only send you promotional communications where you have given your prior
                express consent, or where otherwise permitted by law.
              </p>
              <p>
                You may opt out of marketing communications at any time through the application
                settings or, where applicable, by replying STOP to an SMS message. We aim to
                process opt-out requests within 5 business days.
              </p>
            </PrivacySection>

            <PrivacySection title="Disclosure of Personal Information and Overseas Recipients">
              <p>
                We may disclose personal information to third-party service providers who help us
                operate the application and deliver our services.
              </p>
              <p>This may include the following overseas recipients:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Twilio (United States), for SMS one-time password verification using your phone number;</li>
                <li>OpenAI and Anthropic (United States), for processing listing content or chat content used in AI-supported generation, translation or moderation; and</li>
                <li>Supabase, for hosting, database and related infrastructure services. While primary data storage is intended to be located in Sydney, Australia, some support, administration or related service functions may involve overseas access or processing.</li>
              </ul>
              <p>
                We take reasonable steps to ensure overseas recipients handle personal information
                in a manner consistent with the APPs, including by implementing contractual
                protections and security safeguards such as encryption in transit and at rest.
              </p>
            </PrivacySection>

            <PrivacySection title="Data Security and Breach Response">
              <p>
                We take reasonable technical and organisational steps to protect personal
                information from misuse, interference, loss, unauthorised access, modification and
                disclosure.
              </p>
              <p>
                We maintain an incident response process to identify, contain, investigate and
                remediate security incidents.
              </p>
              <p>
                If we become aware of an eligible data breach that is likely to result in serious
                harm, we will notify affected individuals and the Office of the Australian
                Information Commissioner (OAIC) as required under the Notifiable Data Breaches
                scheme.
              </p>
            </PrivacySection>

            <PrivacySection title="12. Data Retention">
              <p>
                We retain personal information only for as long as reasonably necessary for our
                functions and legal obligations. Our current retention practices include:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Suburb verification logs: membership duration plus 1 year;</li>
                <li>Transaction and dispute records: 7 years;</li>
                <li>Fraud investigation records: 3 years after closure;</li>
                <li>Chat history: 1 year after exchange; and</li>
                <li>Technical logs (IP address and device identifiers): 90 days.</li>
              </ul>
              <p>
                When personal information is no longer required, we take reasonable steps to
                delete or de-identify it, unless we are required or authorised by law to retain
                it.
              </p>
            </PrivacySection>

            <PrivacySection title="Access and Correction">
              <p>
                You may request access to the personal information we hold about you and request
                correction of inaccurate, incomplete or out-of-date information by contacting
                privacy@popoutmarket.com.au.
              </p>
              <p>
                Before actioning certain requests, we may need to verify your identity to protect
                your privacy and the security of your account.
              </p>
            </PrivacySection>

            <PrivacySection title="Complaints">
              <p>
                If you have a privacy complaint, you can contact us at
                privacy@popoutmarket.com.au.
              </p>
              <p>
                We aim to acknowledge privacy complaints within 7 business days and provide a
                substantive response within 30 days.
              </p>
              <p>
                If you are not satisfied with our response, you may contact the Office of the
                Australian Information Commissioner (OAIC) through its website.
              </p>
            </PrivacySection>

            <PrivacySection title="Changes to This Privacy Policy">
              <p>We may update this Privacy Policy from time to time.</p>
              <p>
                If we make a material change, we will notify users through the application, by
                email, or by other appropriate means at least 30 days before the change takes
                effect, where practicable.
              </p>
            </PrivacySection>

            <PrivacySection title="Contact Us">
              <p>For privacy questions, requests or complaints, please contact:</p>
              <p>
                Privacy Officer
                <br />
                POPOUT MARKET PTY LTD
                <br />
                Email: privacy@popoutmarket.com.au
              </p>
            </PrivacySection>
          </div>
        </div>
      </div>
    </section>
  );
}
