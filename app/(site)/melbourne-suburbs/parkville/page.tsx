import { MelbourneParkvilleSuburbContent } from "@/components/melbourne-parkville-suburb-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parkville Second-Hand: UniMelb Campus Essentials & Dorm Furniture",
  description:
    "UniMelb Parkville & UniLodge Lincoln House students: Find affordable second-hand study desks, bikes, kitchenware & dorm furniture. Get campus essentials for less!",
  alternates: {
    canonical: "/melbourne-suburbs/parkville",
  },
};

export default function ParkvilleSuburbPage() {
  return <MelbourneParkvilleSuburbContent />;
}
