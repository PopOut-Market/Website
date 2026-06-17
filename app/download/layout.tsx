import "@/app/globals.css";
import { baseMetadata } from "@/lib/root-metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Root layout for the standalone, un-prefixed /download page. Owns its own <html>.
export const metadata: Metadata = {
  ...baseMetadata,
};

export default function DownloadRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
