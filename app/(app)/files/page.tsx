import FilesPageClient from "@/components/files/files-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function FilesPage() {
  await requireBusinessOwner();
  return <FilesPageClient />;
}
