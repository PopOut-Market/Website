import DownloadPageContent from "@/components/download-page-content";
import { downloadMetadata, downloadPaths, downloadView } from "@/lib/download-metadata";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ view?: string[] }> };
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => downloadPaths;

export async function generateMetadata({ params }: Props) {
  const view = downloadView((await params).view);
  if (!view) notFound();
  return downloadMetadata(view.locale, view.channel);
}

export default async function DownloadPage({ params }: Props) {
  const view = downloadView((await params).view);
  if (!view) notFound();
  return <DownloadPageContent locale={view.locale} channel={view.channel} />;
}
