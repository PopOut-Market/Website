import { ContactPageContent } from "@/components/contact-page-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PopOut Market",
  description:
    "Contact PopOut Market with your enquiry or partnership request. Send a message directly from the website.",
  alternates: {
    canonical: "/contact",
    languages: localizedAlternates("/contact"),
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
