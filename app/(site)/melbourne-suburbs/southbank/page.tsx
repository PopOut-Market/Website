import { MelbourneSouthbankSuburbContent } from "@/components/melbourne-southbank-suburb-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Southbank Melbourne Second-Hand Market: Furniture, Art Supplies & Studio Essentials",
  description:
    "Discover second-hand furniture, art supplies & studio essentials in Southbank, Melbourne. Perfect for UniLodge students & compact apartments. Buy, sell, save!",
  alternates: {
    canonical: "/melbourne-suburbs/southbank",
  },
};

export default function SouthbankSuburbPage() {
  return <MelbourneSouthbankSuburbContent />;
}
