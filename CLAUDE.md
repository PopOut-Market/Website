# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing + market-browsing website for **PopOut Market**, the neighbourhood app for Melbourne. Next.js (App Router) on React 19, TypeScript (strict), Tailwind CSS v4, Supabase. Deployed on Netlify. SEO/GEO-focused (category, suburb and comparison landing pages) and fully multilingual (8 locales).

**Positioning (matches the live App Store listing — keep them in sync).** Subtitle *"Your Neighbourhood Life Guide"*; four pillars: Local Deals & Tips, Secondhand Market, Neighbourhood Life, 100% Real Neighbours. Second-hand is one pillar, not the whole product — but it is the pillar the site actually ranks for, so it stays first and largest on the homepage and keeps the "second-hand / 二手 / 중고 / 中古" vocabulary in every URL and `<title>` that already carries it.

**Two rules that are not negotiable.**
1. **Never describe a feature the app does not ship.** Copy drifts out of sync with the product faster than anyone expects, and on this site a claim can end up inside JSON-LD or a competitor comparison, where it is much harder to spot. Verify every product claim against `app-v2/docs/features/` before you write it, and re-verify when you touch a page you did not write. Specifically: there is no auto-reply, no student verification, no "Safety Zone" concept, and no condition / negotiable / delivery field on a listing — the handover is always in person.
2. **Verification is phrased exactly one way:** "an Australian mobile number and a one-time location check", re-checked every 30 days, confirming the suburb only, GPS not stored. Never "identity check", "ID check", "background check", "age check", and never a scam statistic.

## Commands

```bash
npm run dev      # next dev — local dev server
npm run build    # next build — production build (run before claiming a build works)
npm run start    # next start — serve production build
npm run lint     # eslint .
```

There is no test suite. "Verifying a change" means `npm run build` succeeds and/or manual check in `npm run dev`. The `@/*` path alias maps to the repo root (e.g. `@/lib/...`, `@/components/...`).

## Environment variables

Supabase vars are read with **Expo prefix first, Next prefix as fallback** (the app shares config with an Expo mobile app):

- `EXPO_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `next.config.ts` re-exports the Expo-prefixed values into `NEXT_PUBLIC_*` so the browser bundle can read them. `netlify.toml` whitelists these in secret-scanning (they are public-by-design).
- Admin analytics APIs need a server-only `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`).
- Other overrides: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_MARKET_TABLE`, `NEXT_PUBLIC_MARKET_SUBURB_IDS`, `NEXT_PUBLIC_FOOTER_SOCIAL_*_URL`.

## Architecture

### Locale routing (the central mechanism)

The site supports 8 locales (`en`, `zh-Hans`, `zh-Hant`, `ko`, `ja`, `vi`, `fr`, `es`). Routes live under **`app/(site)/[locale]/…`** — the locale is a real dynamic segment, resolved with `localeFromParams()` from `lib/server-locale.ts`.

- `middleware.ts` runs on every non-API/non-admin/non-asset path. If the URL lacks a locale prefix (e.g. `/about`), it **308-redirects** to a locale-prefixed URL (e.g. `/en/about`), picking the locale from the `popout_locale` cookie → referer → `Accept-Language` → default `en`.
- Every path is therefore 8 URLs. **A thin page is never a one-page problem here — it is an eight-URL problem.** Weigh that before adding a route.
- `lib/site-locale-routing.ts` is the single source for segment↔code mapping (`localeFromSegment`, `localeSegment`, `stripLocalePrefix`, `toLocalePath`). `LEGACY_SUBURB_REDIRECTS` in the middleware maps old SEO slugs to new `/melbourne-suburbs/<x>` paths.
- When adding/removing a locale, update `lib/site-i18n.ts` (`Locale`, `LOCALES`, `LANGUAGE_LIBRARY`, `COPY`), `lib/site-locale-routing.ts` maps, and `lib/seo.ts` (`localizedAlternates`, `LOCALE_SEGMENTS`).

### i18n content

All UI copy lives in `lib/site-i18n.ts` as `COPY: Record<Locale, SiteCopy>` (one large typed object — adding a copy key requires filling all 8 locales). Client components read it via `useSiteShell()` from `components/site-chrome-context.tsx`, which exposes `{ locale, t (the SiteCopy), openLanguageModal, localizePath }`. `SiteChrome` (header/footer/language modal) wraps all `(site)` pages via `app/(site)/layout.tsx` and provides this context.

### Route groups

- `app/(site)/` — public, indexable marketing + market pages, wrapped in `SiteChrome`. Each page is a thin `page.tsx` (exports `metadata` with canonical + `localizedAlternates`) that renders a `*-content.tsx` client component from `components/`. SEO landing pages: `melbourne-suburbs/<suburb>`, `comparison/<competitor>`, plus standalone slug pages.
- `app/(admin)/` — analytics dashboard under `/admin-super/...`, **noindex** (see `(admin)/layout.tsx`). NOT locale-prefixed (middleware skips `/admin` and `/admin-super`). Client-side auth gate via `components/admin/admin-auth-guard.tsx` using a Supabase auth client stored in `sessionStorage` (`lib/supabase/admin-auth-browser-client.ts`).
- `app/api/` — `contact/` sends mail via nodemailer; `admin/*` routes use the service-role key, query Supabase directly, and cache results in-memory (30 min TTL).

### Market data (Supabase)

`lib/supabase/` holds browser clients and fetchers. Key design point: fetchers support **two schemas** controlled by `NEXT_PUBLIC_SUPABASE_MARKET_TABLE`:

- default `"posts"` — the real app schema, filtered by numeric `suburb_id` (UI suburb → id map in `lib/market-suburb-ids.ts`), joins `profiles` for seller nickname, falls back to a no-join query if the FK embed fails.
- `"web_market_posts"` — a flat legacy/demo table keyed by text `suburb_slug` (see `supabase/migrations/`).

Only `status = "available"` posts are ever shown (`marketPostStatuses()`). Browser clients are singletons configured with `persistSession: false` and `storageKey` namespacing; only instantiate after `isSupabaseBrowserConfigured()`. Images come from the public `post_images` Supabase storage bucket via `lib/supabase/post-image-url.ts`.

### Styling

Tailwind v4 (`@import "tailwindcss"` in `app/globals.css`, PostCSS plugin). Shared design tokens/class strings live in `lib/site-config.ts` (`RADIUS`, `SHELL_X`, `INNER_MAX`, brand gradient, logo/badge src paths, footer contact/social config). Per-locale font classes in `lib/site-fonts.ts`. Reuse these constants rather than hardcoding.

## Conventions

- Page files stay thin (metadata + render a content component); put markup/logic in `components/*-content.tsx` marked `"use client"`.
- New indexable routes must be added to `app/sitemap.ts` (`INDEXABLE_PATHS`) and given `canonical` + `localizedAlternates(path)` in their `metadata`. Mark each entry `live` or `static` so its `lastModified` is honest — do not stamp build time on authored pages.
- **A page that renders data must render it on the server.** Every page body is `"use client"`, and no AI retrieval crawler executes JavaScript, so a `useEffect` fetch is invisible to them. Use `lib/supabase/server-feed.ts`, and read its header comment first: the RPC must be called over **GET** and the route needs **`export const dynamic = "force-static"`** alongside `revalidate`, or the page silently becomes on-demand SSR.
- **JSON-LD comes from `lib/jsonld.ts`.** One `Organization`/`WebSite`/`MobileApplication` node, referenced by `@id`. Do not declare a second one — a one-character difference in `legalName` splits the entity. Never emit `FAQPage` (rich result deprecated 2026-05-07), `LocalBusiness` (no visitable premises), `aggregateRating` on our own product, or `Event` for any promotion or discount.
- `eslint.config.mjs` disables several `react-hooks` rules (`exhaustive-deps`, `immutability`, `set-state-in-effect`) — don't rely on them firing.
- Legal copy source-of-truth is in `docs/` (`PRIVACY_POLICY_WEBSITE_SOURCE.md`, `TERMS_OF_USE_WEBSITE_SOURCE.md`).
