import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createJiti(import.meta.url, { alias: { "@": root } });
const { GET: landing } = load("../app/l/[token]/route.ts");
const { GET: photo } = load("../app/l/[token]/photo/route.ts");
const share = "h-00000000-0000-4000-8000-000000000001";
const rent = "h-00000000-0000-4000-8000-000000000002";
const item = "a".repeat(24);
const community = "b".repeat(24);

test("share handler HTML, native targets and anonymous photo access", async (t) => {
  process.env.EXPO_PUBLIC_SUPABASE_URL = "https://storage.example";
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "test-anon";
  const rows = new Map(
    [share, rent].map((token) => [
      token.slice(2),
      {
        id: token.slice(2),
        kind: token === share ? "rooms" : "entire",
        suburb_name: "Carlton",
        bedrooms: 2,
        bathrooms: 1,
        availability: "available",
        photos: [{ path: token + "/cover.jpg" }],
        lister: { nickname: "PRIVATE_SENTINEL" },
      },
    ]),
  );
  const calls = [];
  let enabled = true;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const path = new URL(input).pathname;
    calls.push(path);
    const args = JSON.parse(init.body || "{}");
    let data;
    if (path.endsWith("/housing_enabled")) data = enabled;
    else if (path.endsWith("/get_housing_detail_v13")) data = rows.get(args.p_id) ?? null;
    else if (path.includes("/storage/v1/object/sign/housing_upload_images/")) {
      data = { signedURL: path.replace("/storage/v1", "") + "?token=test" };
    } else if (path.endsWith("/resolve_share_link")) {
      data = [{ kind: args.p_share_token === item ? "listing" : "community_post" }];
    } else if (
      path.endsWith("/get_share_preview") ||
      path.endsWith("/get_community_share_preview")
    ) {
      data = [
        {
          title: "Legacy title",
          price_cents: 2500,
          suburb_name: "Carlton",
          photo_path: "cover.webp",
        },
      ];
    } else throw Error(path);
    return Response.json(data);
  });
  async function request(token, ua = "Twitterbot", handler = landing) {
    const result = await handler(
      new Request("https://example.test/l/" + token, {
        headers: { "user-agent": ua },
      }),
      { params: Promise.resolve({ token }) },
    );
    assert.match(result.headers.get("cache-control"), /no-store/);
    return result;
  }
  for (const token of [share, rent]) {
    for (const ua of [
      "Twitterbot",
      "KakaoTalk iPhone",
      "KakaoTalk Android",
      "MicroMessenger iPhone",
      "MicroMessenger Android",
    ]) {
      const response = await request(token, ua);
      assert.equal(response.status, 200);
      const html = await response.text();
      const title = token === share ? "Share in Carlton" : "Entire home for rent in Carlton";
      assert.ok(html.includes(`property="og:title" content="${title}"`));
      assert.match(html, /property="og:description" content="2 bedrooms · 1 bathroom"/);
      assert.ok(html.includes(`/l/${token}/photo"`));
      assert.ok(!html.includes("PRIVATE_SENTINEL"));
      if (ua.startsWith("MicroMessenger")) {
        assert.match(html, /WeChat menu/);
        assert.ok(!html.includes("intent://") && !html.includes("popout-market://"));
      } else if (ua.startsWith("KakaoTalk")) {
        assert.ok(
          html.includes(
            ua.endsWith("iPhone")
              ? `href="popout-market://l/${token}"`
              : `href="intent://l/${token}#Intent;`,
          ),
        );
        assert.match(html, /Download on the App Store/);
        assert.match(html, /Get it on Google Play/);
      }
    }
  }
  for (const [ua, scheme] of [
    ["iPhone Safari/605", "popout-market"],
    ["Android Chrome/132", "intent"],
  ]) {
    assert.ok((await (await request(share, ua)).text()).includes(`href="${scheme}://l/${share}`));
  }
  for (const token of [share, rent]) {
    const signed = await request(token, "Twitterbot", photo);
    assert.equal(signed.status, 302);
    assert.ok(
      signed.headers
        .get("location")
        .includes("/sign/housing_upload_images/" + token + "/cover.jpg"),
    );
  }
  rows.get(share.slice(2)).availability = "taken";
  assert.match(await (await request(share)).text(), /Taken · 2 bedrooms/);
  // Both a tombstone and a visibility denial yield SQL NULL in the public reader.
  enabled = false;
  assert.match(await (await request(share)).text(), /property="og:title" content="PopOut Market"/);
  assert.match(
    (await request(share, "Twitterbot", photo)).headers.get("location"),
    /\/opengraph-image$/,
  );
  enabled = true;
  rows.clear();
  for (const token of [share, rent]) {
    const html = await (await request(token)).text();
    assert.match(html, /property="og:title" content="PopOut Market"/);
    assert.ok(!html.includes("Carlton") && !html.includes("/cover.jpg"));
    const count = calls.length;
    assert.match(
      (await request(token, "Twitterbot", photo)).headers.get("location"),
      /\/opengraph-image$/,
    );
    assert.deepEqual(calls.slice(count), [
      "/rest/v1/rpc/housing_enabled",
      "/rest/v1/rpc/get_housing_detail_v13",
    ]);
  }
  const count = calls.length;
  assert.match(
    await (await request("h-invalid", "KakaoTalk iPhone")).text(),
    /property="og:title" content="PopOut Market"/,
  );
  assert.equal(calls.length, count);
  for (const [token, bucket, rpc] of [
    [item, "post_images", "get_share_preview"],
    [community, "community_post_images", "get_community_share_preview"],
  ]) {
    const html = await (await request(token, "KakaoTalk iPhone")).text();
    assert.match(html, /property="og:title" content="Legacy title"/);
    assert.ok(
      html.includes(`/public/${bucket}/cover.webp`) && html.includes(`popout-market://l/${token}`),
    );
    assert.deepEqual(calls.slice(-2), ["/rest/v1/rpc/resolve_share_link", "/rest/v1/rpc/" + rpc]);
  }
});
