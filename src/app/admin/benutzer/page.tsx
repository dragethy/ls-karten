import { getAlleBenutzer } from "@/lib/admin-queries";
import { BenutzerTabelle } from "@/components/admin/benutzer/benutzer-tabelle";

export default async function AdminBenutzerPage() {
  const benutzer = await getAlleBenutzer();
  return <BenutzerTabelle benutzer={benutzer} />;
}
