import type { NextConfig } from "next";

/** Expo and Next use different public env prefixes; map Expo vars so the browser bundle can read Supabase settings from `.env`. */
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to this app. A stray package-lock.json in a
  // parent/home directory makes Next 16 infer the wrong root and fail to resolve
  // `tailwindcss` from the CSS `@import`. This forces the correct project root.
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  // Allow phone/tablet access to Next dev resources over LAN.
  // Add your machine's current LAN IP when Next blocks /_next/* from that host (HMR, fonts).
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.0.2", "192.168.0.75"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Baseline security headers (defense-in-depth). These do not change how pages
  // render for visitors or how crawlers read content. A full Content-Security-
  // Policy is intentionally deferred (needs testing against inline JSON-LD,
  // Supabase, and Leaflet tile hosts).
  async headers() {
    return [
      // App-association files. Netlify sets these too (see netlify.toml, which
      // additionally exempts them from the apex -> www redirect); these entries
      // give `next dev` / `next start` the same Content-Type so the files can be
      // verified locally. `apple-app-site-association` has no extension, so
      // without this it is served as application/octet-stream and Apple rejects it.
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// Dedicated share-link previews use the mobile staging project.
if (
  process.env.CONTEXT === "deploy-preview" &&
  ["20", "21"].includes(process.env.REVIEW_ID ?? "")
) {
  const url = process.env.SHARE_SUPABASE_URL?.trim();
  const key = process.env.SHARE_SUPABASE_ANON_KEY?.trim();
  const site = process.env.DEPLOY_PRIME_URL;
  if (
    url !== "https://yywerlbmbhckfvfoyfif.supabase.co" ||
    !key ||
    site !==
      `https://deploy-preview-${process.env.REVIEW_ID}--glittery-queijadas-6dd48c.netlify.app`
  ) {
    throw new Error("Missing share preview staging configuration");
  }
  const claims = JSON.parse(Buffer.from(key.split(".")[1] || "", "base64url").toString());
  if (claims.role !== "anon" || claims.ref !== "yywerlbmbhckfvfoyfif") {
    throw new Error("Share preview requires the staging anonymous key");
  }
  nextConfig.env = {
    ...nextConfig.env,
    EXPO_PUBLIC_SUPABASE_URL: url,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: key,
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
    NEXT_PUBLIC_SITE_URL: site,
  };
}
