import FilesPageClient from "@/components/files/files-page-client";
import { getGlobalPatientFiles } from "@/dal/patient-files.server.dal";
import { buildFilesQueryFromSearchParams } from "@/lib/hooks/use-files-page";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function FilesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    from?: string;
    page?: string;
    q?: string;
    sort?: string;
    to?: string;
  }>;
}) {
  await requireBusinessOwner();
  const [params, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);
  const query = buildFilesQueryFromSearchParams(params);
  const initialPage = clinicId
    ? await getGlobalPatientFiles({ clinicId, ...query })
    : undefined;

  return (
    <FilesPageClient initialPage={initialPage} initialQuery={query} />
  );
}
