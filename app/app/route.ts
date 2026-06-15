// Device-detecting "smart link" served at the clean URL /app.
//
//   iOS (iPhone/iPad)  -> App Store
//   Android            -> Google Play
//   desktop / other    -> show both store buttons (no redirect, no dead end)
//   WeChat in-app view  -> never auto-redirect (WeChat blocks store jumps);
//                          show buttons + an "Open in Browser" hint.
//
// Detection runs client-side, so this route MUST serve the HTML verbatim and
// must never itself redirect to a store. `force-static` prerenders the response
// at build time so it ships as a static asset (verbatim, no cold start).
// `middleware.ts` early-returns for /app so it is not locale-prefixed.

export const dynamic = "force-static";

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PopOut Market</title>
  <script>
    (function () {
      var IOS = 'https://apps.apple.com/app/id6761421626';
      var ANDROID = 'https://play.google.com/store/apps/details?id=au.com.popoutmarket';
      var ua = navigator.userAgent || navigator.vendor || '';
      var isIOS = /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var isAndroid = /android/i.test(ua);
      var isWeChat = /MicroMessenger/i.test(ua);
      if (!isWeChat) {
        if (isIOS) { window.location.replace(IOS); return; }
        if (isAndroid) { window.location.replace(ANDROID); return; }
      }
    })();
  </script>
</head>
<body style="font-family:-apple-system,system-ui,sans-serif;text-align:center;padding:48px 24px;line-height:1.5;">
  <h1>PopOut Market</h1>
  <p>Download the app:</p>
  <p>
    <a href="https://apps.apple.com/app/id6761421626"
       style="display:inline-block;margin:8px;padding:12px 20px;border:1px solid #ddd;border-radius:10px;text-decoration:none;color:#111;">App Store (iPhone)</a>
    <a href="https://play.google.com/store/apps/details?id=au.com.popoutmarket"
       style="display:inline-block;margin:8px;padding:12px 20px;border:1px solid #ddd;border-radius:10px;text-decoration:none;color:#111;">Google Play (Android)</a>
  </p>
  <p style="color:#888;font-size:14px;margin-top:32px;">
    In WeChat? Tap the &ldquo;&hellip;&rdquo; in the top corner and choose &ldquo;Open in Browser&rdquo;, then pick your store.
  </p>
</body>
</html>
`;

export function GET(): Response {
  return new Response(HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
