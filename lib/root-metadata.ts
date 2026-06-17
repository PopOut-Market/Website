import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Metadata shared by every root layout. There is no single app/layout.tsx —
 * each route group ((site)/[locale], (admin), download) is its own root so it
 * can render the correct <html lang> server-side. Spread this into each root's
 * `metadata` so metadataBase + icons stay consistent.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  icons: {
    icon: [{ url: "/favicon-48.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-touch-icon-180.png", sizes: "180x180" }],
  },
};
