import { getAlleKarten } from "@/lib/karten-queries";
import { KartenListeClient } from "@/components/pages/karten-liste-client";

export default async function KartenPage() {
  const karten = await getAlleKarten();
  return <KartenListeClient karten={karten} />;
}
