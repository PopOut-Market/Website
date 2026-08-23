import type { ReactNode } from "react";

/**
 * Renders a copy string whose emphasised span is marked with *asterisks*.
 *
 * The marker is per-locale on purpose: the phrase that carries the emphasis in
 * English is rarely the phrase that carries it in Korean or Chinese, so each
 * translation places its own pair rather than inheriting the English word order.
 *
 * ## The `slot` prop, and the bug it exists to avoid
 *
 * Some strings also carry a runtime token — `"Live in *{count} Melbourne
 * suburbs*"` — and the caller wants to swap a live React node in for it. The
 * obvious implementation is one regex alternating over both markers:
 *
 *     /(\*[^*]+\*|\{[a-z]+\})/     // WRONG
 *
 * That is broken, and quietly. In **every** locale the token sits *inside* the
 * asterisk pair (`"已覆盖*墨尔本 {count} 个城区*"`,
 * `"*メルボルンの{count}の地域*に広がっています"`, …), so the first alternative
 * matches the whole emphasised run and swallows `{count}` with it. The slot would
 * simply never render, in all eight languages at once.
 *
 * So: split on asterisks first, exactly as before, then substitute the token
 * inside whichever part contains it. The swapped-in node therefore inherits the
 * brand colour automatically, wherever that locale chose to put its asterisks.
 * `slot` is optional and every existing call site is unchanged.
 */
export function BrandEmphasis({
  text,
  slot,
}: {
  text: string;
  slot?: { token: string; node: ReactNode };
}): ReactNode {
  function withSlot(part: string, keyPrefix: string): ReactNode {
    if (!slot || !part.includes(slot.token)) return part;
    const pieces = part.split(slot.token);
    return pieces.map((piece, i) => (
      <span key={`${keyPrefix}-${i}`}>
        {piece}
        {i < pieces.length - 1 ? slot.node : null}
      </span>
    ));
  }

  return text.split(/(\*[^*]+\*)/).map((part, i) => {
    if (!part) return null;
    return part.startsWith("*") && part.endsWith("*") ? (
      // `text-brand-500`, matching TranslationDemo and AiPostDemo. NOT
      // `POPOUT_BRAND_GRADIENT_TEXT_CLASS` — despite the name, that constant is
      // `text-brand-700`, the darker pressed-state orange, and using it here put
      // two different highlight colours on the same page.
      <span key={i} className="text-brand-500">
        {withSlot(part.slice(1, -1), `e${i}`)}
      </span>
    ) : (
      <span key={i}>{withSlot(part, `p${i}`)}</span>
    );
  });
}
