"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { useEffect, useRef, useState } from "react";

const LOCATION_ROTATION = [
  "Melbourne",
  "Melbourne CBD",
  "Carlton",
  "Parkville",
  "Southbank",
  "Docklands",
  "Fitzory",
  "North Melbourne",
  "South Wharf",
] as const;

export default function HomePage() {
  const { t, openLanguageModal } = useSiteShell();
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationVisible, setLocationVisible] = useState(true);
  const locationCycleTimerRef = useRef<number | null>(null);
  const locationTransitionTimerRef = useRef<number | null>(null);

  const rotatingLocation = LOCATION_ROTATION[locationIndex] ?? "Melbourne";

  useEffect(() => {
    const runCycle = () => {
      setLocationVisible(false);

      locationTransitionTimerRef.current = window.setTimeout(() => {
        setLocationIndex((prev) => (prev + 1) % LOCATION_ROTATION.length);
        setLocationVisible(true);
        locationCycleTimerRef.current = window.setTimeout(runCycle, 3000);
      }, 620);
    };

    locationCycleTimerRef.current = window.setTimeout(runCycle, 3000);

    return () => {
      if (locationCycleTimerRef.current !== null) {
        window.clearTimeout(locationCycleTimerRef.current);
      }
      if (locationTransitionTimerRef.current !== null) {
        window.clearTimeout(locationTransitionTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex max-w-4xl flex-col items-center text-center">
        <h1 className="text-balance text-[clamp(1.7rem,4vw,3rem)] font-semibold tracking-tight text-gray-800">
          <span className="bg-[linear-gradient(to_bottom,#FF0048_0%,#FF154A_24%,#FF314A_45%,#FF4B45_63%,#FF5A33_80%,#FF6600_100%)] bg-clip-text text-transparent">
            Popout Market
          </span>
          <span>, now in </span>
          <span
            aria-live="polite"
            className={`inline-block origin-left transform-gpu text-black transition-all duration-[620ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              locationVisible
                ? "translate-y-0 scale-100 opacity-100 blur-0"
                : "translate-y-1 scale-[0.97] opacity-0 blur-[0.8px]"
            }`}
          >
            {rotatingLocation}
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-balance text-base text-gray-700 sm:text-lg">
          {t.heroSecondaryPrefix}{" "}
          <button
            type="button"
            onClick={() => openLanguageModal()}
            className="rounded-md px-1 font-bold text-gray-900 underline decoration-gray-400 underline-offset-4 transition hover:decoration-gray-800"
          >
            {t.heroSecondaryLink}
          </button>
          .
        </p>
      </div>
    </section>
  );
}
