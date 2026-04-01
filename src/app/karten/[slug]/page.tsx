import { getKarteBySlug } from "@/lib/karten-queries";
import { KartenDetailClient } from "@/components/pages/karten-detail-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function KartenDetailPage({ params }: Props) {
  const { slug } = await params;
  const karte = await getKarteBySlug(slug);

  if (!karte) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-green-900 mb-4">Karte nicht gefunden</h1>
        <Link href="/karten">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Button>
        </Link>
      </div>
    );
  }

  return <KartenDetailClient karte={karte} />;
}
