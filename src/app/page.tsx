import { getTopKarten } from "@/lib/karten-queries";
import { HomeClient } from "@/components/pages/home-client";

export default async function HomePage() {
  const karten = await getTopKarten(3);
  return <HomeClient karten={karten} />;
}
