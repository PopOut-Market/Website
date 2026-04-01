import type { NextConfig } from "next";

/** Expo and Next use different public env prefixes; map Expo vars so the browser bundle can read Supabase settings from `.env`. */
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  // Allow phone/tablet access to Next dev resources over LAN.
  // Keep loopback plus the current LAN IP so mobile devices can load dev scripts.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.0.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
