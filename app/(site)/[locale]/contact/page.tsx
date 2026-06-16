import { ContactPageContent } from "@/components/contact-page-content";
import { localizedAlternates } from "@/lib/seo";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Metadata } from "next";

const PATH = "/contact";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return {
    title: { absolute: "Contact PopOut Market" },
    description:
      "Contact PopOut Market with your enquiry or partnership request. Send a message directly from the website.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function ContactPage() {
  return <ContactPageContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
