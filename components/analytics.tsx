import Script from "next/script";

/**
 * Plausible Analytics: cookie-free visit counts (chosen 2026-10-24).
 *
 * Off until `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` holds this site's script URL from
 * Plausible (Site settings → Site installation), e.g.
 * `https://plausible.io/js/pa-XXXXXXXX.js`. Any other value renders nothing, so a
 * typo can never load a script from another host. The value is read at build
 * time, so a change needs a redeploy.
 *
 * Outbound-link clicks (the App Store and Google Play buttons) are an option on
 * the same Site installation screen, not something this file turns on.
 *
 * The privacy policy names Plausible in "Website, Contact Form and Cookies" and
 * in the overseas recipients list (components/privacy-page-content.tsx and
 * docs/PRIVACY_POLICY_WEBSITE_SOURCE.md). Change them together with this file.
 */
const PLAUSIBLE_SCRIPT = /^https:\/\/plausible\.io\/js\/pa-[\w-]+\.js$/;

/** Plausible's own snippet: queues calls made before the script has loaded. */
const INIT =
  "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()";

export function Analytics() {
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC;
  if (!src || !PLAUSIBLE_SCRIPT.test(src)) return null;
  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <Script id="plausible-init" strategy="afterInteractive">
        {INIT}
      </Script>
    </>
  );
}
