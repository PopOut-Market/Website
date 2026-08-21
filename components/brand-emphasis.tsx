import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import type { ReactNode } from "react";

/**
 * Renders a copy string whose emphasised span is marked with *asterisks*.
 *
 * The marker is per-locale on purpose: the phrase that carries the emphasis in
 * English is rarely the phrase that carries it in Korean or Chinese, so each
 * translation places its own pair rather than inheriting the English word order.
 *
 * `translation-demo.tsx` and `ai-post-demo.tsx` already did this inline; new
 * sections share this so the split regex only exists once.
 */
export function BrandEmphasis({ text }: { text: string }): ReactNode {
  return text.split(/(\*[^*]+\*)/).map((part, i) => {
    if (!part) return null;
    return part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}
