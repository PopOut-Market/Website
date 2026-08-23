/**
 * The homepage's motion vocabulary.
 *
 * Three easings, three durations, two stagger deltas. Nothing in the scroll-
 * revealed sections may use a number that is not on this list — that constraint
 * is the whole point. Before this file the page had two bespoke animated demos
 * and four dead blocks of text, with the timing constants copy-pasted as magic
 * numbers inside each demo.
 *
 * The values are not new. 600ms and `cubic-bezier(0.2,0.8,0.2,1)` are already
 * what `translation-demo.tsx` and `ai-post-demo.tsx` use, so naming them here is
 * how the newer sections end up coherent with the two that were already good.
 */

/** The page's single arrival curve. */
export const EASE_OUT = "cubic-bezier(0.2,0.8,0.2,1)";
/** One gentle overshoot, for the shop-wall pin drop ONLY. Do not spread this around. */
export const EASE_POP = "cubic-bezier(0.34,1.56,0.64,1)";
/** Long confident draw, for the trust-chain connector ONLY. */
export const EASE_DRAW = "cubic-bezier(0.22,1,0.36,1)";

/** The arrival transition. */
export const REVEAL_MS = 600;
/** The trust-chain connector bar. */
export const DRAW_MS = 700;
/** The suburb count-up. */
export const COUNT_MS = 1100;

/** Delay added per sibling in a staggered group. */
export const STAGGER_MS = 70;
/**
 * Index at which the stagger stops growing. 5 x 70 = a 350ms tail, so a group
 * finishes at 950ms — under the point where a stagger stops reading as one
 * gesture and starts reading as a queue.
 */
export const STAGGER_CAP = 5;

/**
 * THE ONE EXCEPTION, for the suburb chip field only.
 *
 * That field is ~32 small chips on several wrapped lines. At 70ms they arrive as
 * six visibly separate blocks; at 28ms the whole field reads as a single wave.
 * Nothing else may use these two values.
 */
export const STAGGER_DENSE_MS = 28;
export const STAGGER_DENSE_CAP = 15;

/**
 * The single trigger contract for every scroll reveal.
 *
 * One threshold, not the five-entry array `use-section-visible.ts` builds — that
 * hook exists to start and stop a running loop, and these reveals only ever fire
 * once. The -8% bottom inset stops an element still being mid-fade by the time
 * it reaches comfortable reading position.
 */
export const REVEAL_THRESHOLD = 0.16;
export const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";
