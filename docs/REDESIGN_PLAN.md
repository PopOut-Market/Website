# PopOut Website Redesign Plan (v2 — "app-exact")

> Status: **awaiting approval**. This is the single canonical plan. It supersedes the
> independent specialist drafts and resolves every contradiction the design critic found
> (radius scale, shadow values, ramp hexes, two a11y blockers). Where this document and a
> draft disagree, **this document wins.**

The website is a read-only **"online poster"** for the PopOut Market mobile app. Two jobs:
(1) explain what the app does, (2) showcase live listings — to drive **app downloads**. It
mirrors the app's design language and applies senior landing-page craft. No auth, no chat on
the web.

---

## 0. Locked decisions

| Decision | Choice |
|---|---|
| Neutral identity | **Pure grey** (chroma 0), app-exact. Reverses the v1 warm-taupe ramp. |
| Surface depth | **Flat-first + a small, rule-bound web-earned affordance allow-list** (below). |
| Delivery | Full plan first (this doc) → approval → build. |

### Web-earned affordance allow-list (the only deviations from app-flat)
- **Hover:** border-color shift to brand `#FF8C00`. A **1–2px `translateY` lift is allowed on cards only** (listing/feature/hub cards), **never** on inline chrome micro-controls — those shift border color only. **Never** a shadow swap.
- **Resting shadows:** soft, neutral-black, low opacity on cards.
- **Section rhythm:** alternate section backgrounds within the grey ladder — **zero gradients**.
- **Motion:** restrained scroll-in (fade + ≤8px translate), gated by `prefers-reduced-motion`.

### Kill-list (remove everywhere)
4-stop orange text-gradient (→ flat `#FF8C00`) · `shadow-pop` orange glow · **all `blur-[…]`** (hero suburb, carousel coverflow, 5 demos) · pastel/brand `bg-gradient` washes · hover shadow-escalation · `font-extrabold`/`font-black` (cap 700) · floating rounded-pill header (→ flat full-width `#EEEEEE` bar) · `rounded-full` **buttons** · `backdrop-blur` · the global `Inter` + `Avenir Next`/`Nunito` font declarations.

---

## 1. Design principles (app DNA → web)

1. **Orange is a spotlight, not wallpaper.** `#FF8C00` is reserved for the download CTA and ~one accent per viewport. Grey carries 90% of every screen.
2. **Pure-grey surface ladder (iOS grouped-list):** cards sit one tonal step lighter than their section. Separation comes from **tone**, not heavy borders/shadows.
3. **Flat.** No glass, no blur, no gradients; uniform low neutral shadows.
4. **System fonts**, weights ≤ 700, a deliberate dramatic jump to display size, max ~3 type sizes per viewport.
5. **4px grid** spacing; generous **M3 radii** (12 / 16 / 24).
6. **Sky-blue `#00A6F4`** is the cool counter-note — informational only, ~1:5 vs orange.
7. **Tone:** friendly "village noticeboard" (Karrot lineage). Trust shown as warmth/community, never corporate "bank-grade security" chrome.
8. **Honest poster:** no control implies an action the web can't do; everything routes to the app.

---

## 2. Canonical token layer — SINGLE SOURCE OF TRUTH

All other sections reference these values; none restate them.

### 2.1 `app/globals.css` — replace the `@theme` block + `body`

```css
@import "tailwindcss";

/*
 * PopOut pure-grey theme (Tailwind v4 @theme). App-mirror:
 * chroma-0 neutral ladder, single flat orange anchor #FF8C00,
 * sky-blue #00A6F4 informational only. Flat surfaces, neutral low-opacity shadows.
 */
@theme {
  /* Brand orange — 500 anchor; 600 hover (true darken); 700 pressed = app brandPressed #CC3200. */
  --color-brand-50:  #fff4e5;
  --color-brand-100: #ffe3bf;
  --color-brand-200: #ffce8a;
  --color-brand-300: #ffb85c;
  --color-brand-400: #ffa12e;
  --color-brand-500: #ff8c00; /* ANCHOR */
  --color-brand-600: #e57500; /* hover */
  --color-brand-700: #cc3200; /* pressed/active — intentional (app brandPressed/brand.dark) */
  --color-brand-800: #a32800;
  --color-brand-900: #7a1e00;

  /* Pure-grey neutral ramp (chroma 0). Replaces the warm taupe ramp. */
  --color-gray-50:  #f9f9f9; /* card / base surface (lightest) */
  --color-gray-100: #f3f3f3; /* raised surface */
  --color-gray-200: #eeeeee; /* chrome (flat header/footer bar) */
  --color-gray-300: #e8e8e8; /* page background */
  --color-gray-400: #c6c6c6; /* borderStrong / hairlines */
  --color-gray-500: #8e8e8e;
  --color-gray-600: #6b6b6b;
  --color-gray-700: #4a4a4a;
  --color-gray-800: #2e2e2e;
  --color-gray-900: #1a1a1a; /* near-black headings */
  --color-gray-950: #0d0d0d; /* body text darkest */

  /* Semantic surface aliases (optional spellings for the same ladder steps). */
  --color-surface-base:       #f9f9f9;
  --color-surface-raised:     #f3f3f3;
  --color-surface-chrome:     #eeeeee;
  --color-surface-background: #e8e8e8;

  /* Brand tint (soft orange fill behind dark/white text only). */
  --color-brand-tint: rgb(255 140 0 / 0.12);

  /* Secondary / semantic (used sparingly; never as small text on light). */
  --color-info:    #00a6f4;  --color-info-tint: rgb(0 166 244 / 0.12);
  --color-success: #22c55e;
  --color-error:   #ef4444;
  --color-warning: #f59e0b;

  /* Neutral, low-opacity, flat shadows. Stock tiers overridden to neutral too. */
  --shadow-2xs: 0 1px 1px 0 rgb(0 0 0 / 0.04);
  --shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.06);
  --shadow:     0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-md:  0 4px 12px -2px rgb(0 0 0 / 0.10);
  --shadow-lg:  0 8px 24px -6px rgb(0 0 0 / 0.12);
  --shadow-xl:  0 16px 40px -12px rgb(0 0 0 / 0.12);

  /* App-named set {small, card, medium, large}. */
  --shadow-small:  0 1px 2px 0 rgb(0 0 0 / 0.06);
  --shadow-card:   0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 1px -1px rgb(0 0 0 / 0.04);
  --shadow-medium: 0 4px 12px -2px rgb(0 0 0 / 0.10);
  --shadow-large:  0 8px 24px -6px rgb(0 0 0 / 0.12);

  /* Compat alias: the ~51 existing `shadow-soft` usages stay valid, now neutral+flat. */
  --shadow-soft:   0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 1px -1px rgb(0 0 0 / 0.04);
  /* --shadow-pop intentionally REMOVED (orange glow killed). */

  /* NOTE: radius tokens are NOT overridden — see §2.5. */
}

:root { color-scheme: light; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
}
```

**Why this is safe:** Tailwind v4 re-maps `bg-gray-*`, `text-gray-*`, `border-gray-*`, `bg-white`, and the stock `shadow-*` from their warm values to pure-grey/neutral **centrally** — so the bulk of the site recolors with **zero per-component edits**. Only the kill-list classes need find/replace.

### 2.2 Fonts
- **Delete** the global `Inter` declaration (now done in `body` above) and the `.font-latin-rounded` body of `"Avenir Next"/"Nunito"`.
- **Keep the class name** `.font-latin-rounded`; swap its contents to the system stack (so `lib/site-fonts.ts` and all `LOCALE_FONT_CLASS` consumers need **no change**):

```css
.font-latin-rounded {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
}
```
- **Keep unchanged:** `.font-zh-hans`, `.font-zh-hant`, `.font-korean-rounded`, `.font-japanese-rounded`.

### 2.3 Type scale (system font, weight ≤ 700, ≤ 3 sizes per viewport)

| Role | Size / line-height | Weight | Tailwind |
|---|---|---|---|
| caption / chip | 12 / 16 | 400–600 | `text-xs leading-4` |
| meta / label | 14 / 20 | 400–600 | `text-sm leading-5` |
| body | 16 / 24 | 400 | `text-base leading-6` |
| lead | 18 / 28 | 400–600 | `text-lg leading-7` |
| subtitle | 20 / 28 | 600 | `text-xl leading-7 font-semibold` |
| section H2 | 24 / 32 | 700 | `text-2xl leading-8 font-bold` |
| sub-display | 32 / 40 | 700 | `text-[2rem] leading-10 font-bold` |
| display (app jump) | 44 / 48 | 700 | `text-[2.75rem] leading-[3rem] font-bold` |
| **hero (web clamp)** | clamp 40→60 | 700 | `text-[clamp(2.5rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight` |

Hierarchy via **size + weight + space**, never color or decoration. **No `font-extrabold`/`font-black`.**

### 2.4 Spacing — 4px grid + off-grid mapping (ONE canonical table)

Default 4px steps: `{0,4,8,12,16,24,32,48,64,96}` → Tailwind `{0,1,2,3,4,6,8,12,16,24}`.

| Off-grid found | px | → Tailwind | Rule |
|---|---|---|---|
| `px-[1.05rem]` | 16.8 | `px-4` | — |
| `px-[0.525rem]` | 8.4 | `px-2` | — |
| `md:px-5` | 20 | `md:px-6` | — |
| `gap-3.5` | 14 | `gap-4` | — |
| `p-3.5` | 14 | `p-4` | — |
| `py-2.5` | 10 | **`py-3`** if interactive (≥44px tap target), else `py-2` | tap-target is the tie-breaker |
| `space-y-1.5` | 6 | `space-y-2` | — |
| `mt-7` / `space-y-7` | 28 | `mt-6` (`24`) default; `mt-8` (`32`) at section breaks | — |
| `space-y-5` | 20 | `space-y-6` | — |
| `h-4.5 w-4.5` | 18 | `h-5 w-5` | icon |
| `h-3.5 w-3.5` | 14 | `h-4 w-4` | icon |

### 2.5 Radius — canonical = **Tailwind v4 defaults** (do NOT override `--radius-*`)

This deliberately rejects the draft idea of redefining `--radius-2xl` to 48 (which would silently resize all 109 existing card usages). Tailwind defaults already match the app's M3 intent:

| Use | Class | px | App token |
|---|---|---|---|
| **Buttons** | `rounded-xl` | 12 | md |
| **Cards** | `rounded-2xl` | 16 | lg | ← 109 existing usages **stay as-is** |
| **Large feature cards / sheets** | `rounded-3xl` | 24 | xl |
| **Chips / tags / avatars / status dots** | `rounded-full` | — | full |
| small inner clips | `rounded-lg` | 8 | sm |

Only change needed for radius: **`rounded-full` buttons → `rounded-xl`**, and replace stray arbitrary `rounded-[20px]`/`rounded-[24px]` with `rounded-3xl`. Avoid `rounded-[Npx]` going forward — use the named classes.

### 2.6 `lib/site-config.ts` changes

```ts
// RADIUS — documentation only (referenced ~twice). Align to M3, drop `sheet`.
export const RADIUS = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const;

// Containers — snap onto the grid. Outer page padding 24 → up.
export const SHELL_X   = "px-6 sm:px-8";                          // 24 → 32
export const INNER_MAX = "mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8"; // 16 → 24 → 32

// Card — flat; bg chosen per the tonal-layering rule (§3 Card). Default sits on a non-white section.
export const CARD_CLASS =
  "rounded-2xl border border-black/5 bg-gray-50 shadow-card";

// Primary CTA — soft rounded-rect, flat, pressed = brand-700 (#CC3200), with AA focus ring.
export const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl bg-brand-500 font-semibold text-white " +
  "shadow-small transition-colors hover:bg-brand-600 active:bg-brand-700 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

// Secondary — flat; hover shifts border to brand only.
export const SECONDARY_PILL_CLASS = // (name kept; no longer a pill)
  "inline-flex items-center justify-center rounded-xl border border-gray-400 bg-gray-50 " +
  "font-semibold text-gray-900 transition-colors hover:border-brand-500 active:bg-gray-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

// Brand wordmark/accent text — FLAT anchor (gradient killed). Keep export name to avoid touching call sites,
// BUT remove the sibling `bg-clip-text text-transparent` utilities wherever it's used.
export const POPOUT_BRAND_GRADIENT_TEXT_CLASS = "text-brand-500";
```

---

## 3. Component kit

Every page composes these primitives; no page reinvents a button/card.

- **Button** — base `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-50`. Variants: `primary` (`bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700`), `secondary` (`bg-gray-50 border border-black/10 text-gray-900 hover:border-brand-500`), `ghost` (`hover:bg-gray-100`), `info` (rare, `text-info border hover:border-info`). Sizes `sm h-9 px-4 text-sm` / `md h-11 px-6 text-base` / `lg h-14 px-8 text-lg`.
- **StoreBadge / StoreBadgeRow** — official assets only, never recolored/retyped; `h-12 w-auto`, min 40px, links to `APP_STORE_URL`/`GOOGLE_PLAY_URL`, descriptive `aria-label`. Place only on light tones (`#FFF`/`#F9F9F9`/`#EEEEEE`). Row: `flex flex-wrap items-center gap-4`.
- **Card** — `rounded-2xl border border-black/5 [surface] shadow-card`. **Tonal rule:** card is one step lighter than its section. **White-section exception:** on a `bg-white` section a card cannot be lighter — keep the card `bg-white` and separate it with the hairline border + resting shadow (never go *darker*). Interactive variant adds `transition-[border-color,transform] hover:border-brand-500 hover:-translate-y-px motion-reduce:transform-none focus-visible:…` (lift is **cards only**).
- **Badge / Chip / Tag** — `rounded-full`. Colored fills carry **near-black text** (`text-gray-900`) — never orange/blue as the small text. "New" badge `bg-brand-500 text-white text-xs`. Selected chip `bg-brand-tint text-gray-900 border border-brand-500`. Status: success/info tints with dark text.
- **Section / SectionHeading / Eyebrow** — `Section` takes a `tone` prop (`white|50|100|200|300`) → `bg-*` + `py-16 sm:py-24`. Eyebrow `text-sm font-semibold uppercase tracking-wide text-gray-600` (neutral; if orange wanted use `text-brand-700` which passes AA). Heading uses the type scale.
- **PhoneFrame** — device shell around a **real screenshot** (`alt` required), `rounded-[2.5rem] border border-black/10 bg-gray-900 p-2 shadow-medium`, inner screen `rounded-[2rem] overflow-hidden`, `Image fill object-cover`. No blur, no glow, ever. (Device corner radius is decorative geometry, exempt from the M3 scale.)
- **Stat / ProofItem** — big `text-2xl font-bold tabular-nums text-gray-900` over `text-sm text-gray-600`. Ratings reuse `stars.tsx` (`text-brand-500`/`text-gray-300`, recolored via the new tokens — no component change).
- **MotionReveal** — IntersectionObserver toggles `data-shown`; `opacity-0 translate-y-2 → data-[shown=true]:opacity-100 data-[shown=true]:translate-y-0`, `motion-reduce:*` resets to visible/no-transition. ≤8px, fade+translate only.

---

## 4. Global chrome

- **Header → flat full-width bar.** Replace the `fixed` floating rounded-pill (`site-chrome.tsx:233-236`) with `sticky top-0 z-40 border-b border-black/10 bg-gray-200` (#EEEEEE), inner `INNER_MAX h-16 flex items-center justify-between gap-4`. **Delete** the 96px spacer (`:388-389`) and set `SITE_MAIN_SLOT_CLASS` min-height `calc(100dvh-6rem)` → **`calc(100dvh-4rem)`** (64px bar). Re-audit hero top padding + the `#download` scroll anchor after removing the spacer.
- **Logo** flat `#FF8C00` (confirm `LOGO_TEXT_SRC` isn't a baked gradient; if it is, swap to a flat-orange asset).
- **Controls** (Market toggle, Language trigger, Download): one type size (`text-sm font-semibold`). Active/CTA = flat brand fill (no shadow). Idle = `bg-gray-50 border-black/10`, hover = **border→brand only** (no lift on these inline controls). Download CTA `bg-brand-500 hover:bg-brand-600 active:bg-brand-700`, `rounded-xl`.
- **Sticky mobile download bar (new):** `fixed inset-x-0 bottom-0 z-40 sm:hidden border-t border-black/10 bg-gray-200`, `pb-[max(0.75rem,env(safe-area-inset-bottom))]`, StoreBadgeRow (`h-10`). Add `pb-[88px] sm:pb-0` to the footer so the last line isn't covered. No `backdrop-blur`.
- **Footer** on `bg-gray-200` + hairline top border; inner chips/cards `bg-gray-50` (one step lighter). Store badges single shared optical height `h-12 sm:h-14`, official, no overlap hacks. **SEO hub links + legal links: hrefs/labels unchanged**, chips → `rounded-xl` (not full), hover = border→brand. Stars flat `text-brand-500`.
- **Language modal/dropdown:** scrim `bg-black/40` (no blur), sheet `rounded-3xl border border-black/10 bg-white shadow-card` (kill `shadow-xl`). Selected language = `bg-brand-tint` + `border-brand-500` with dark text. Hover = border→brand (no tint-wash swap).

---

## 5. Homepage (section-by-section)

Background cadence (zero gradients): `#FFF → #F9F9F9 → #F3F3F3 → #FFF → #F9F9F9 → #F3F3F3 → close`.

1. **Hero** (`bg-white`) — two-column on `md+`: left = H1 (`clamp 40→60`, flat `#FF8C00` for the rotating suburb, **no blur/scale** — fade+translate only), one-line subhead, **StoreBadgeRow**, a one-line proof sliver. Right = **PhoneFrame** with a real home-feed screenshot. Language control stays as an `#00A6F4` **link** (informational). Remove the coverflow from the hero.
2. **Social-proof strip** (`#F9F9F9`) — 3–4 honest Stats (rating · listings live · suburbs · languages). No fabricated numbers.
3. **Live Listings Showcase** (`#F3F3F3`, cards `#FFF`) — **the differentiator.** Replaces the blurred coverflow with a clean responsive grid (`grid-cols-2 lg:grid-cols-4`) on `md+` and a **non-blurred peek snap-scroller** on mobile. Real photo (`aspect-[4/5] object-cover`, alt = title), title, **flat** `text-base font-bold text-gray-900` price, suburb chip. Whole card links to the read-only `/market/p/<id>`; muted "Open in the app to message" line (honest). **Delete** the emoji/pastel `SHOWCASE` array. Loading = neutral pulse skeletons (`animate-pulse bg-black/5`) — **no orange spinner**.
4. **How It Works — 3 steps** (`bg-white`) — phone-framed, scroll-revealed (find nearby → tap listing → meet & buy locally). Number badge `bg-brand-tint text-brand-700`. Ends with a StoreBadgeRow.
5. **Feature Highlights** (`#F9F9F9`) — 2–4 alternating zig-zag rows, each a **real screenshot** + a benefit-led line. The five `*-demo.tsx` become **static/clearly-labelled product shots** (see §6/Open decision) — no simulated interactivity, no blur, no brand-gradient avatars/bubbles.
6. **Trust & Safety** (`#F3F3F3`, cards `#FFF`) — warm/community framing (meet locally, student community, report-and-block in-app), small neutral line-icons in `info`-tint wells. No corporate security chrome.
7. **Final CTA / close** — restate value + large StoreBadgeRow + desktop-only QR. **Badge-on-background rule:** badges are black-only assets, so the close sits on `#EEEEEE`/`#FFF`. If a flat `#FF8C00` band is wanted, the badges go inside a white card on it (don't place black badges directly on orange). See Open decision.
8. **Sticky mobile download bar** (persistent, §4).

---

## 6. Page archetypes

**Shared:** flat `CARD_CLASS`, `shadow-card`, tonal layering, flat prices, `rounded-xl` buttons, on-grid spacing. Fix every **white-on-white nested card** via the grey ladder.

1. **Market feed** (`/market`) — page `#F3F3F3`; cards `#F9F9F9`/`#FFF`. Grid `gap-4`. Suburb selector keeps `rounded-full` (small control) but hover = border→brand; selected = `bg-brand-tint` + dark text. Photo well **flat** (kill `from-gray-100 to-gray-200`). Price **flat** `text-lg font-bold` (no gradient, no extrabold). Card hover = border→brand (+1px lift ok). Loading = neutral skeletons (no orange spinner — reconciled with homepage). "Not configured" notice → neutral surface + single `warning` accent (no amber wash).
2. **Post detail** (`/market/p/[postId]`) — page `#E8E8E8`; article `#FFF`/`#F9F9F9`; **nested seller block steps to `#F3F3F3`** (fixes white-on-white). Gallery well flat. Price **flat** `#FF8C00` (clamp, keep the jump). Status chips = tints with **dark** text. Add a single **"Open in app"** primary CTA near the price (the only action, the one orange moment). **No** message/save buttons.
3. **Suburb SEO landing** (`melbourne-suburbs/*` + standalone geo guides, ~20 pages) — **RESTYLE-ONLY** (frozen copy/headings/routes/metadata/JSON-LD/DOM order). Extract shared `SeoContentCard`/`SeoEyebrow`/`SuburbChip`/`SeoCtaButton` and refactor all ~20 to consume them (markup/heading order preserved). Tonal layering for stacked cards; chips `rounded-full` + border→brand hover; one `rounded-xl` orange CTA per page; `shadow-soft`→neutral; snap `mt-7`. **Note:** `mt-7` also appears in several `page.tsx` `<section>` wrappers (e.g. `melbourne-cbd-second-hand-marketplace/page.tsx`) — className-only, in scope.
4. **Comparison SEO landing** (`comparison/*`) — **RESTYLE-ONLY.** **Kill the `from-white via-brand-50 to-brand-100` washes** (gumtree + facebook-marketplace) and the `amber` disclaimer washes → flat grey-ladder surfaces; recommendation card may use a single `brand-tint` fill with dark text. Feature "table": outer card light, inner PopOut/Other rows step to `#F3F3F3`; the "PopOut" label dark-bold or large-enough orange (never small orange text). Hub cards: flat, border→brand hover, drop `hover:shadow-md`.
5. **Info** (`about`/`contact`/`faq`) — fuller latitude. **Contact form** is the one real action: kill the gradient + `font-black` H1 → flat `text-2xl font-bold text-brand-500`; inputs `rounded-xl h-11`, focus = `border-brand-500` + visible ring; submit `rounded-xl`; status messages use `success`/`error` tokens with `aria-live`. **Neutralize the faq `amber` disclaimer** like the comparison one.
6. **Legal** (`privacy`/`terms`/`child-safety`, inline) — constrain prose to a **~68ch reading column**; document card `#FFF` on `#E8E8E8`/`#F3F3F3`; `shadow-soft`→neutral; near-black body for legibility, muted meta; audit/replace any `font-black` headings with `font-bold`; snap `space-y-7`.
7. **Other surfaces** — `not-found.tsx` (apply tokens + flat button), the ~12 legacy standalone geo guides + `delete-account` (auto-recolor via tokens; add flat CTA where relevant). **Admin** (`/admin-super/*`) is **noindex / out of scope** — its `amber` states inherit the token recolor but are not part of this redesign.

---

## 7. Migration & verification (grep guards)

Run from repo root after the build. Each must return **zero** (except where noted):

| Check | Command | Expect |
|---|---|---|
| No blur anywhere | `grep -rn "blur-\[" app components` | 0 |
| No backdrop-blur | `grep -rn "backdrop-blur" app components` | 0 |
| No gradients/clip-text | `grep -rn "bg-clip-text\|bg-gradient\|linear-gradient\|conic-gradient" app components` | 0 (audit each before removal) |
| No orange glow | `grep -rn "shadow-pop" app components` | 0 |
| Weight cap | `grep -rn "font-extrabold\|font-black\|font-\[8\|9" app components` | 0 |
| Off-grid spacing | `grep -rn "\[1.05rem\]\|\[0.525rem\]\|-3.5\|-2.5\|-1.5\|mt-7\|space-y-7\|space-y-5\|-4.5 " app components` | 0 |
| Rounded-full audit | `grep -rn "rounded-full" app components` | only chips/tags/avatars/dots remain |

**Blur enumeration (all 7 sites):** hero suburb (`home-page-content.tsx:77`, also `scale-[0.97]`), hero-carousel coverflow `filter: blur`, and the 5 demos (`safety-zone-demo`, `ai-post-demo`, `schedule-demo`, `student-verify-demo`, `translation-demo`). **Brand-gradient UI (not just text):** `student-verify-demo:250` avatar, `translation-demo:78` chat bubble → flat `brand-500` fill.

**SEO freeze guard:** snapshot rendered **text content + heading order + JSON-LD** of every `INDEXABLE_PATH` before and after; fail on any text/structure diff. All SEO edits are className-only.

**Build/verify:** `npm run build` succeeds, then `npm run dev` spot-check hero, listings grid, a market card + detail, the flat header bar, one suburb page (content identical), and the contact form.

---

## 8. Accessibility checklist (WCAG 2.1 AA)
- `#FF8C00` & `#00A6F4` **never** as small text on light — only as fills behind white/dark text, or large (≥18.66px) bold accents. `#CC3200`/`brand-700` (≈ AA on white) allowed for eyebrows; default eyebrows to neutral grey.
- Chips/tags/eyebrows on tint fills carry **near-black text**.
- Focus-visible rings on all CTAs, inputs, links.
- Every screenshot/`Image` has descriptive `alt`. One `h1` per page; `h2` per section; no skips (SEO heading order frozen).
- All motion gated by `prefers-reduced-motion` — including the auto-cycling hero suburb timer and any demo animation.
- Store badges: official assets, min size, clear space, never recolored; black badges only on light backgrounds.

---

## 9. Assets & open decisions needed from you (before build)
1. **Real app screenshots** for the PhoneFrames (hero, how-it-works ×3, feature rows). The current demos are simulated UI.
2. **Real store URLs + app IDs** — `APP_STORE_URL`/`GOOGLE_PLAY_URL` are placeholders (`id0000000000` / `com.example.popout`).
3. **White-variant store-badge SVG** — only black exists; needed only if a `#FF8C00` band sits behind badges (otherwise we place badges on light surfaces and skip this).
4. **Demos treatment** — convert the 5 animated demos to **real static screenshots** (most honest, recommended) vs keep them as clearly-labelled motion product shots.

---

## 10. Proposed build sequence
1. **Token layer** — `app/globals.css` `@theme` + `lib/site-config.ts` (§2). Build green; the whole site recolors to pure grey automatically. ← biggest visual shift, lowest risk.
2. **Component kit** (§3) — Button, Card, StoreBadge, Chip, Section/Eyebrow, PhoneFrame, Stat, MotionReveal.
3. **Global chrome** (§4) — flat header, footer, sticky mobile bar, language modal.
4. **Homepage** (§5) — hero → live listings → how-it-works → features → trust → close (needs assets from §9).
5. **Market** (feed + detail) (§6.1–6.2).
6. **SEO landing pages** (§6.3–6.4) — restyle-only, with the freeze guard.
7. **Info + legal + other** (§6.5–6.7).
8. **Migration sweep + a11y + build/verify** (§7–8).
