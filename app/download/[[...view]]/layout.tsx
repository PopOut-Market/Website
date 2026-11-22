import "./download.css";
import { Analytics } from "@/components/analytics";
import { baseMetadata } from "@/lib/root-metadata";
import { APP_ICON, downloadView } from "@/lib/download-metadata";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = {
  ...baseMetadata,
  icons: {
    icon: { url: APP_ICON, type: "image/png", sizes: "1024x1024" },
    apple: { url: APP_ICON },
  },
};

export default async function DownloadLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ view?: string[] }>;
}) {
  const view = downloadView((await params).view);
  if (!view) notFound();
  return (
    <html lang={view.locale}>
      <body>
        {children}
        <script src="/download-language-menu.js" defer />
        <Analytics />
      </body>
    </html>
  );
}
