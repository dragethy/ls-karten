import { getKarteBySlug } from "@/lib/karten-queries";
import { KarteEditForm } from "@/components/admin/karten/karte-edit-form";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function KarteEditPage({ params }: Props) {
  const { slug } = await params;
  const karte = await getKarteBySlug(slug);

  if (!karte) redirect("/admin/karten");

  return <KarteEditForm karte={karte} />;
}
