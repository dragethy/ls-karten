import { getAlleBewertungenAdmin } from "@/lib/admin-queries";
import { BewertungenAdminTabelle } from "@/components/admin/bewertungen/bewertungen-admin-tabelle";

export default async function AdminBewertungenPage() {
  const bewertungen = await getAlleBewertungenAdmin();
  return <BewertungenAdminTabelle bewertungen={bewertungen} />;
}
