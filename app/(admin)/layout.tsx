import "@/app/globals.css";
import { baseMetadata } from "@/lib/root-metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Root layout for the (non-localized, noindex) admin tree. Owns its own <html>.
export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
};

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
