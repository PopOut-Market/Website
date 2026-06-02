# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing + market-browsing website for **PopOut Market**, a Melbourne second-hand marketplace app. Next.js (App Router) on React 19, TypeScript (strict), Tailwind CSS v4, Supabase. Deployed on Netlify. The site is SEO-focused (many suburb / comparison landing pages) and fully multilingual (8 locales).

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

The app supports 8 locales (`en`, `zh-Hans`, `zh-Hant`, `ko`, `ja`, `vi`, `fr`, `es`) but **the App Router file tree has NO `[locale]` segment**. Instead:

- `middleware.ts` runs on every non-API/non-admin/non-asset path. If the URL lacks a locale prefix (e.g. `/about`), it **308-redirects** to a locale-prefixed URL (e.g. `/en/about`), picking the locale from the `popout_locale` cookie → referer → `Accept-Language` → default `en`. If the URL already has a locale prefix, it **rewrites** to the un-prefixed path so the route files match, and refreshes the cookie.
- So a request to `/en/about` is served by `app/(site)/about/page.tsx`. The browser keeps the locale in the URL; the route tree never sees it.
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
- New indexable routes must be added to `app/sitemap.ts` (`INDEXABLE_PATHS`) and given `canonical` + `localizedAlternates(path)` in their `metadata`.
- `eslint.config.mjs` disables several `react-hooks` rules (`exhaustive-deps`, `immutability`, `set-state-in-effect`) — don't rely on them firing.
- Legal copy source-of-truth is in `docs/` (`PRIVACY_POLICY_WEBSITE_SOURCE.md`, `TERMS_OF_USE_WEBSITE_SOURCE.md`).
