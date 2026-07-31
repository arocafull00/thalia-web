import { notFound } from "next/navigation";

import TreatmentDetailPageClient from "@/components/treatments/treatment-detail-page-client";
import { getTreatment } from "@/dal/treatments.server.dal";
import { logger } from "@/lib/logger";

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let treatment: Awaited<ReturnType<typeof getTreatment>>;

  try {
    treatment = await getTreatment(id);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadTreatmentDetail",
      treatmentId: id,
    });
    return <TreatmentDetailPageClient />;
  }

  if (!treatment) {
    notFound();
  }

  return <TreatmentDetailPageClient treatment={treatment} />;
}
