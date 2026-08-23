"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The rotating suburb name in the homepage `<h1>`, typed one character at a time.
 *
 * ## The bug this must not reintroduce
 *
 * The original rotator sized its slot with an **invisible in-flow duplicate** of
 * the word — one `aria-hidden` copy to measure, one absolutely-positioned copy to
 * show. `aria-hidden` hides a node from assistive technology; it does not remove
 * it from the DOM, so every text extractor read both. The homepage's primary
 * heading was being ingested as `Find used furniturefurniture in PopOut Market`,
 * in all eight locales, on the one page this site is verified to rank with.
 *
 * ## How this one avoids it, and why it also fixes the jitter
 *
 * The word is split into one `<span>` per character and characters are revealed
 * with `visibility`, not by growing a string. Two consequences, both wanted:
 *
 * 1. **The text is never duplicated and never truncated in the DOM.** Adjacent
 *    spans concatenate when text is extracted, so a crawler reads
 *    `Melbourne CBD`, exactly once, whatever the animation is doing.
 * 2. **A hidden character still occupies its space**, so the slot is always the
 *    full width of the finished word. In a centred heading that matters: typing
 *    by appending to a string would re-centre the whole line on every keystroke,
 *    which reads as shaking rather than typing.
 *
 * The width therefore only changes when the *word* changes — and that happens at
 * the one moment every character is hidden, so the change is invisible. No width
 * transition is needed or wanted; a mechanical cut is the point.
 *
 * ## The cycle
 *
 *   type in, 55ms per character  ->  hold ~1.5s  ->  every character cuts out at
 *   once  ->  brief blank  ->  next word
 *
 * Under reduced motion nothing animates: the first suburb renders complete, with
 * no caret. It is decoration — every suburb here is also listed further down the
 * page, so nothing is lost.
 */

/** Per character. Fast enough to feel mechanical, slow enough to read. */
const TYPE_MS = 55;
/** How long the finished word stays up. */
const HOLD_MS = 1500;
/** Blank beat after the cut, before the next word starts typing. */
const BLANK_MS = 260;

export function HeroSuburbRotator({
  suburbs,
  active,
}: {
  suburbs: readonly string[];
  /**
   * Whether the hero is on screen. This is the page's only perpetual animation —
   * everything else fires once — so it must stop when nobody is looking.
   * `useSectionVisible` in the hero owns the flag and also handles tab
   * visibility, so a backgrounded tab is not running a timer chain forever.
   */
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const current = suburbs[index % suburbs.length] ?? suburbs[0] ?? "";
  const chars = [...current];

  // Server and first paint render the word complete, so the heading is correct
  // before hydration and for anything that never runs the animation.
  const [typed, setTyped] = useState(chars.length);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  useEffect(() => {
    if (reduced || !active || suburbs.length < 2) {
      clearTimers();
      setTyped(Number.POSITIVE_INFINITY); // show whatever word is up, complete
      return;
    }

    // The loop owns its own cursor in a local, seeded from wherever the display
    // currently is, and `index` is deliberately NOT a dependency. Putting it there looks natural and is a trap: `setIndex` would
    // re-run this effect, the cleanup would clear the in-flight typing chain, and
    // the new word would sit blank through a full hold before being skipped
    // entirely. One effect, one chain, one cursor.
    let cursor = index;
    let stopped = false;

    const at = (fn: () => void, ms: number) => {
      timers.current.push(
        window.setTimeout(() => {
          if (!stopped) fn();
        }, ms),
      );
    };

    const cycle = () => {
      // Every id from the previous pass has fired by now; drop them so the list
      // does not grow for as long as the page is open.
      timers.current = [];
      at(() => {
        setTyped(0); // the cut: every character hides in the same frame
        at(() => {
          cursor = (cursor + 1) % suburbs.length;
          setIndex(cursor); // the width changes while nothing is visible
          const total = [...(suburbs[cursor] ?? "")].length;
          at(() => {
            for (let k = 1; k <= total; k++) at(() => setTyped(k), k * TYPE_MS);
            at(cycle, total * TYPE_MS);
          }, 20);
        }, BLANK_MS);
      }, HOLD_MS);
    };

    cycle();

    return () => {
      stopped = true;
      clearTimers();
    };
  }, [reduced, active, suburbs, clearTimers]);

  const typing = typed < chars.length;

  return (
    // `mx` on top of whatever space the template already carries. Every locale's
    // template has its own separator — a trailing space in "Everything happening
    // in ", a half-width space before 的 in the Chinese ones, none at all before
    // Korean's 에서 particle — and at a 3.5rem heading a single space is visually
    // tight against a colour-shifted word that is also being typed. This adds the
    // same optical breathing room on both sides regardless of which side the slot
    // sits on, and being in `em` it scales with the clamp()-sized heading.
    <span className="relative mx-[0.1em] inline-block whitespace-nowrap align-baseline text-brand-500">
      {chars.map((char, i) => (
        <span
          key={`${index}-${i}`}
          // `visibility`, not `display` or a sliced string: the character keeps
          // its space, so the slot never resizes mid-word and the line never
          // re-centres while typing.
          // `pre` keeps a real U+0020 from collapsing at the end of a run of
          // hidden characters. The previous version substituted U+00A0 instead,
          // which held the space but made the heading extract as
          // "Melbourne\u00a0CBD" — a different string to anything searching for it.
          style={{ visibility: i < typed ? "visible" : "hidden", whiteSpace: "pre" }}
        >
          {char}
        </span>
      ))}
      {!reduced && active ? (
        <span
          aria-hidden
          className={`ml-[0.06em] inline-block w-[0.06em] self-stretch bg-brand-500 align-baseline ${
            typing ? "opacity-100" : "animate-caret-blink"
          }`}
          style={{ height: "0.78em", transform: "translateY(0.06em)" }}
        />
      ) : null}
    </span>
  );
}
