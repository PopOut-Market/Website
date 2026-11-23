import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.DOWNLOAD_TEST_BASE_URL || "http://localhost:3000";
const meta = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const wechat = "Mozilla/5.0 (iPhone) MicroMessenger/8.0";
const apple = "Mozilla/5.0 (Macintosh) Safari/605.1.15 (facebookexternalhit/1.1; Twitterbot/1.0)";
const cases = [
  ["/download", meta, "instagram"],
  ["/download", wechat, "wechat"],
  ["/download", "", "wechat"],
  ["/download", "Mozilla/5.0 (Linux; Android 14)", "wechat"],
  ["/download", apple, "wechat"],
  ["/download", "com.apple.WebKit.Networking CFNetwork/1 Darwin/1", "wechat"],
  ["/download", "Instagram/355 CFNetwork/1", "instagram"],
  ["/download", meta, "instagram"],
  ["/download/wechat", meta, "wechat"],
  ["/download/instagram", wechat, "instagram"],
  ["/download/ko/wechat", meta, "wechat"],
  ["/download/ko/instagram", "", "instagram"],
];

// Alternate fetchers on the very same URL to catch shared-cache contamination.
test("the app download URL serves one correctly sized image and a stable card URL", async () => {
  for (const [path, agent, channel] of cases) {
    const url = new URL(path, base);
    url.searchParams.set("lang", "ko");
    const response = await fetch(url, {
      headers: { "User-Agent": agent },
      signal: AbortSignal.timeout(20000),
    });
    const label = path + " (" + agent + ")";
    assert.equal(response.status, 200, label);
    const html = await response.text();
    const tags = [
      ...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)"\s*\/?\s*>/g),
    ];
    const fields = Object.fromEntries(tags.map(([, name, value]) => [name, value]));
    const wide = channel === "instagram";
    const image = wide ? "popout-dm-map-tag-v5.jpg" : "popout-app-icon.png";
    assert.equal(tags.filter(([, name]) => name === "og:image").length, 1, label);
    assert.equal(new URL(fields["og:image"]).pathname, "/images/download/" + image, label);
    assert.equal(fields["og:image:width"], wide ? "1200" : "1024", label);
    assert.equal(fields["og:image:height"], wide ? "630" : "1024", label);
    assert.equal(fields["twitter:image"], fields["og:image"], label);
    assert.equal(fields["og:locale"], "ko_KR", label);
    const id = new URL(fields["og:url"]);
    assert.equal(id.pathname, "/download/" + channel, label);
    assert.equal(id.searchParams.get("lang"), "ko", label);
  }
});
