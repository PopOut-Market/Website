import { MelbourneCbdSuburbContent } from "@/components/melbourne-cbd-suburb-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Melbourne CBD Second-Hand Market: City Living Furniture & Essentials",
  description:
    "Set up city life in Melbourne CBD with affordable second-hand furniture, kitchen gear, and apartment essentials. Great for students, WHV workers, and short-term renters.",
  alternates: {
    canonical: "/melbourne-suburbs/melbourne-cbd",
  },
};

export default function MelbourneCbdSuburbPage() {
  return <MelbourneCbdSuburbContent />;
}
