import { MelbourneSuburbsHubContent } from "@/components/melbourne-suburbs-hub-content";
import { localizedAlternates } from "@/lib/seo";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Metadata } from "next";

const PATH = "/melbourne-suburbs";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return {
    title: { absolute: "Melbourne Suburbs Second-Hand Guide | PopOut Market" },
    description:
      "Explore Melbourne suburb-focused second-hand pages for students, WHV newcomers, and local renters. Compare local areas and jump to suburb-specific marketplace guides.",
    keywords: [
      "Melbourne suburbs second hand",
      "Melbourne student marketplace",
      "WHV furniture Melbourne",
      "suburb second-hand guide Melbourne",
    ],
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function MelbourneSuburbsHubPage() {
  return <MelbourneSuburbsHubContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
