"use client";

import { Reveal } from "@/components/motion/reveal";
import { useSiteShell } from "@/components/site-chrome-context";
import { DRAW_MS, EASE_DRAW, EASE_OUT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useState } from "react";

/**
 * The three verification beats, as a connected ribbon.
 *
 * ## THE ICON BLACKLIST — this must survive code review
 *
 * The copy is load-bearing: *an Australian mobile number and a one-time location
 * check that confirms your suburb and is then discarded, re-checked every 30
 * days.* It is **not** an identity check, an ID check, a background check, an age
 * check, or student verification, and the picture must not say otherwise.
 *
 * **Banned icons:** shield, shield-with-tick, badge, rosette, ID card, passport,
 * driver's licence, fingerprint, face outline, padlock-on-person, blue "verified"
 * tick. A shield is exactly what a designer reaches for here, and it silently
 * claims a background check the product does not perform.
 *
 * **Banned words** anywhere in this section — copy, `alt`, `aria-label`, commit
 * message, translator brief: identity check, ID check, background check, age
 * check, student verification, Safety Zone, any scam or fraud statistic, any
 * percentage. Location is described only as confirming the suburb and then being
 * discarded — never stored, tracked or retained.
 *
 * **Allowed:** a mobile handset outline; a *plain* map pin (never a pin with a
 * slash, which reads as "location blocked"); a circular arrow.
 *
 * Exactly one number appears: `30`. It is real, and it is already published in
 * the paragraph directly above this component.
 *
 * ## Why the connector is a scaleX and not a stroke-dashoffset
 *
 * `stroke-dashoffset` is a paint-level property, so every frame re-rasterises the
 * path on the main thread. The identical visual as a `scaleX` on one
 * absolutely-positioned 2px element is zero layout, zero paint, one composited
 * layer for 700ms.
 */

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

function PhoneIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.8 18.6h2.4" />
    </svg>
  );
}

function CircularArrowIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.4 4.2v4.2h-4.2" />
    </svg>
  );
}

/**
 * Step 2's one-shot beat, and the most communicative 300ms on the page.
 *
 * A solid pin crossfades into an empty dashed outline once, a second after the
 * section arrives, and stays that way. It is a literal picture of "confirms your
 * suburb and is then discarded" — which is why, under reduced motion, the
 * DISCARDED state is what gets rendered. This state carries meaning rather than
 * decoration, so the meaningful end state is what everyone should see.
 */
function LocationCheckIcon({ discarded }: { discarded: boolean }) {
  const fade = `opacity 300ms ${EASE_OUT}`;
  return (
    <span className="relative block h-5 w-5">
      <svg
        {...ICON_PROPS}
        className="absolute inset-0 h-5 w-5"
        style={{ opacity: discarded ? 0 : 1, transition: fade }}
      >
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
      <svg
        {...ICON_PROPS}
        className="absolute inset-0 h-5 w-5 text-gray-400"
        style={{ opacity: discarded ? 1 : 0, transition: fade }}
      >
        <circle cx="12" cy="12" r="7.5" strokeDasharray="3 3" />
      </svg>
    </span>
  );
}

export function HomeTrustChain({ show }: { show: boolean }) {
  const { t } = useSiteShell();
  const reduced = useReducedMotion();
  const [discarded, setDiscarded] = useState(false);

  useEffect(() => {
    if (!show) return;
    if (reduced) {
      setDiscarded(true);
      return;
    }
    const id = window.setTimeout(() => setDiscarded(true), 1000);
    return () => window.clearTimeout(id);
  }, [show, reduced]);

  const steps = [
    { label: t.homeTrustStep1, icon: <PhoneIcon /> },
    { label: t.homeTrustStep2, icon: <LocationCheckIcon discarded={discarded} /> },
    { label: t.homeTrustStep3, icon: <CircularArrowIcon /> },
  ];

  return (
    <div className="relative mt-8">
      {/* The connector. Hidden below `sm`, where the stacked layout already
          implies sequence and one fewer moving part is the right trade. */}
      <div
        aria-hidden
        className="absolute left-[16%] right-[16%] top-[21px] hidden h-[2px] overflow-hidden bg-gray-200 sm:block"
      >
        <span
          className="block h-full w-full origin-left bg-brand-500"
          style={{
            transform: show ? "scaleX(1)" : "scaleX(0)",
            transition: `transform ${DRAW_MS}ms ${EASE_DRAW}`,
          }}
        />
      </div>

      {/* The 200ms deltas are tuned so each step lands as the bar's leading edge
          reaches it (~17% at 120ms, ~46% at 320ms, ~74% at 520ms). It reads as
          one motion rather than four. */}
      <ol className="relative grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.label}
            show={show}
            delayMs={120 + i * 200}
            distance="lg"
            className="flex flex-col items-start sm:items-center sm:text-center"
          >
            <span
              aria-hidden
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-brand-500 shadow-card"
            >
              {step.icon}
            </span>
            <p className="mt-3 text-sm font-semibold text-black sm:text-base">{step.label}</p>
          </Reveal>
        ))}
      </ol>

      {/* What happens when something does go wrong. The verification ribbon above
          says how an account is checked; this says what the product does after
          the fact — report, restrict, appeal. All three are shipped and
          documented. Deliberately NOT a promise: no review time, no outcome, no
          claim that anything is guaranteed safe. */}
      <div className="mt-10 border-t border-black/5 pt-8">
        <Reveal
          as="h3"
          show={show}
          delayMs={720}
          className="text-sm font-semibold uppercase tracking-wide text-black/45"
        >
          {t.safetyHeading}
        </Reveal>
        <ul className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[t.safetyReport, t.safetyRestrict, t.safetyAppeal].map((line, i) => (
            <Reveal
              as="li"
              key={line}
              show={show}
              delayMs={800 + i * 90}
              distance="sm"
              className="rounded-2xl border border-black/5 bg-white p-4 text-left text-[0.85rem] leading-relaxed text-gray-600 shadow-card sm:text-center"
            >
              {line}
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
