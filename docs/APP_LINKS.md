# Listing share links (`/l/<token>`) and app association

## What ships where

| Piece                      | File                                            | Status                            |
| -------------------------- | ----------------------------------------------- | --------------------------------- |
| Share landing route        | `app/l/[token]/route.ts`                        | works now, independent of the app |
| Share data + formatting    | `lib/share-link/preview.ts`                     |                                   |
| User-Agent classification  | `lib/share-link/user-agent.ts`                  |                                   |
| Card + in-app-browser HTML | `lib/share-link/html.ts`                        |                                   |
| Server Supabase client     | `lib/supabase/share-preview-client.ts`          |                                   |
| iOS association            | `public/.well-known/apple-app-site-association` | filled in                         |
| Android association        | `public/.well-known/assetlinks.json`            | filled in                         |

The route and the association files are independent. The route fixes the 404 for
everyone immediately; the association files only start mattering once a mobile
binary that claims the domain is installed.

## The two identity values

1. **Apple Team ID** `YK76NYXM3M` — Apple Developer → Membership details. Goes in
   front of the bundle id: `YK76NYXM3M.au.com.popoutmarket`.
2. **Play App Signing SHA-256** — Play Console → the app → Setup → App integrity
   → _App signing key certificate_.

   This must be the **app signing** key, not the **upload** key. They are
   different certificates and a wrong fingerprint fails silently: Android just
   opens the browser, with no error surfaced anywhere. If App Links stop
   verifying, re-check this value first.

Verify with:

```bash
npm run check:applinks            # file contents
npm run check:applinks -- --live  # contents + live serving on www
```

## Host requirements (the part that is easy to get wrong)

Apple and Google **do not follow redirects** when fetching association files.
The host the app declares must return `200` with `Content-Type: application/json`
directly.

The app claims and shares **`www.popoutmarket.com.au`**, which is already this
site's primary domain — so www serves both files with no redirect and no special
Netlify rule. The apex still 301s to www, which is correct and harmless: the app
does not claim it, and an apex link just redirects into the `/l` route like any
other browser hit. If the apex is ever added back to the app's associated
domains, it needs a path-scoped `status = 200` **rewrite** in `netlify.toml` —
never a redirect, since a competing redirect is what caused this site's apex⇄www
loop before — and that rule must be verified against live Netlify, because it is
unconfirmed whether a custom rule can override the automatic primary-domain
redirect.

`middleware.ts` has to skip `/.well-known` and `/l/`. Without that, the locale
middleware 308s them to `/en/...`. `assetlinks.json` used to escape only by
accident (its `.json` extension matched the static-asset heuristic); the
extensionless `apple-app-site-association` did not.

### Links shared before the host switch

Universal Links match on the URL that was _tapped_, and iOS does not re-evaluate
after a redirect. Apex links already sitting in chat threads
(`https://popoutmarket.com.au/l/<token>`, shared by earlier app builds) will
therefore never deep-link into the app even once it is installed — they 301 to
www and land on the `/l` route, which sends the visitor to the store. That is a
graceful outcome, not a break, but it means only newly-shared www links open the
app directly.

## Route behaviour

One URL, three audiences, branched on `User-Agent`:

| Audience                   | Response                                                     |
| -------------------------- | ------------------------------------------------------------ |
| Pure link-preview fetchers | `200` HTML, Open Graph tags, **no redirect**                 |
| Messenger in-app browsers  | `200` HTML, Open Graph tags **plus** visible install buttons |
| Everyone else (humans)     | `302` → App Store / Google Play / `/download`                |

Pure fetchers are `facebookexternalhit`, `Twitterbot`, `WhatsApp`,
`TelegramBot`, `Slackbot`, `Discordbot`, `LinkedInBot`, `Applebot`,
`redditbot` — each of those apps opens real links in a normal browser with a
normal UA, so no human ever sees what they render.

The in-app-browser bucket is matched **two ways**, because either alone leaves a
hole.

**1. Structural (the general rule).** An embedded webview cannot follow a
redirect to `apps.apple.com` or `play.google.com` — the navigation hangs and the
user watches a spinner forever. That is a whole class of client, not a list of
apps, so it is detected by shape:

- Android: the `wv` product token (`...; wv) AppleWebKit...`) that Android
  WebView adds.
- iOS: an iPhone/iPad UA with **no** `Safari/` token. Every real iOS browser —
  Safari, Chrome (`CriOS`), Firefox (`FxiOS`), Edge (`EdgiOS`), DuckDuckGo —
  carries one; WKWebView-hosted browsers usually do not.

This covers Snapchat, TikTok, Threads and anything else that ships an embedded
browser, without anyone having to maintain a list.

The failure modes are deliberately asymmetric: a false positive costs a real
browser user one extra tap on a page that already shows both store buttons, a
false negative is an infinite spinner. The rule errs toward the hybrid page.

**2. Named apps.** Still required for two reasons:

- Its scraper and its embedded browser send the same token, so a hit cannot be
  attributed to either — `MicroMessenger` (WeChat), `KakaoTalk`, `Line/`,
  `Pinterest`. One hybrid document satisfies both readers; treating them as pure
  crawlers would strand real people on a dead-end card, and redirecting them
  would kill every preview.
- It appends its token to a **complete** Safari UA, so it still carries
  `Safari/` and the structural check cannot see it. **LINE and KakaoTalk both do
  this** — which is exactly why the structural rule alone is not sufficient.
- Meta's surfaces: `FBAN`, `FBAV`, `FB_IAB`, `Messenger`, `Instagram`.

`Line` is matched as `\bLine\/` rather than a bare substring — a
case-insensitive `line/` also appears inside ordinary words ("Airline/"), and a
false positive there would strand a real visitor on the HTML page.

Order is: named in-app browsers → pure crawlers → structural webview → real
browsers. Crawlers are checked before the structural rule so a fetcher can never
be mistaken for a human.

Unknown token, removed listing, taken-down listing, banned seller, malformed
token and database error all produce the **same** generic card — no title, no
price, no reason. `get_share_preview` applies that visibility gate server-side
and simply returns zero rows.

Every response carries `Vary: User-Agent` and `Cache-Control: no-store`. The
`Vary` is load-bearing: without it the CDN may cache one variant and serve a
crawler's HTML to a human, or a store redirect to a crawler (killing every
preview).

## Data source

One RPC, `get_share_preview(p_share_token text)` — anon-callable, `STABLE
SECURITY DEFINER`, returns at most one row of `title`, `price_cents`,
`suburb_name`, `photo_path`. Nothing else is read; the underlying tables are
RLS-locked to anon. `suburb_name` is a `LEFT JOIN` and can be null, in which
case the card shows the price alone.

Share tokens landed in **production** on 2026-07-28, so this route reads the
same project as the rest of the site: `EXPO_PUBLIC_SUPABASE_*`, falling back to
`NEXT_PUBLIC_SUPABASE_*`. No per-route pointer, and no new variable to set.

While tokens lived only in v2 staging the route had its own `SHARE_SUPABASE_*`
override (and a bare `SUPABASE_*` tier). Both are gone. A staging
`SHARE_SUPABASE_URL` left behind in Netlify is exactly what made every
production share link render the generic card — a wrong project and a
nonexistent token look identical downstream, so the failure was silent. If those
two variables are still set in Netlify or in a local `.env`, they are now dead
config and can be deleted. Do not reintroduce an override tier; point the whole
site at another project if you need to test against one.

## og:image and WebP

Listing photos are stored as `.webp`. WhatsApp, KakaoTalk and Facebook render
WebP unreliably, which would mean a blank thumbnail on the channels this app is
actually shared through. `og:image` therefore points at Supabase Storage's
image-transform endpoint (`/storage/v1/render/image/public/...`). The add-on is
enabled on both the staging and production projects.

`format=origin` on that URL is load-bearing despite its name. Without it the
transform content-negotiates on the request's `Accept` header and returns WebP
to any fetcher that advertises it — re-creating the exact problem. With it the
response is deterministically JPEG or PNG regardless of `Accept` (verified
against both projects).

The markup deliberately emits **no** `og:image:width` / `og:image:height`. The
transform crops toward 1200×630 but never upscales, so real responses come back
at whatever the source photo could supply (810×630, 499×630, …). Declaring
dimensions we do not serve is worse than declaring none.

Set `SHARE_OG_IMAGE_MODE=object` to fall back to the plain public object URL if
the add-on is ever turned off — note that mode serves the original `.webp` bytes
and carries the WebP caveat above.

Listings with no photo fall back to the site's own `/opengraph-image` card.
