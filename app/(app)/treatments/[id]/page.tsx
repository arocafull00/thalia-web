import TreatmentDetailPageClient from "@/components/treatments/treatment-detail-page-client";

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TreatmentDetailPageClient treatmentId={id} />;
}
