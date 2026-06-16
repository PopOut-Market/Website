import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "PopOut Market",
    template: "%s | PopOut Market",
  },
  description:
    "PopOut Market helps Melbourne communities buy and sell second-hand items with suburb-first discovery, multilingual communication, and safer meetup workflows.",
  // og:image / twitter:image are supplied automatically by app/opengraph-image.tsx
  // and app/twitter-image.tsx. These set the card type and shared defaults.
  openGraph: {
    type: "website",
    siteName: "PopOut Market",
    title: "PopOut Market",
    description:
      "Melbourne's second-hand marketplace — buy and sell locally with suburb-first discovery and multilingual chat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopOut Market",
    description:
      "Melbourne's second-hand marketplace — buy and sell locally with suburb-first discovery and multilingual chat.",
  },
  icons: {
    icon: [{ url: "/favicon-48.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-touch-icon-180.png", sizes: "180x180" }],
  },
};

// Static root shared by the localized site and the (non-localized) admin tree.
// The per-locale lang is refined client-side from the [locale] layout (HtmlLang);
// keeping this static lets the site pages be statically generated.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
