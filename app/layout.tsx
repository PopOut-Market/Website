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
};

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
