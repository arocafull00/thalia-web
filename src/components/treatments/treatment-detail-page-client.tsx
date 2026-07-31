"use client";

import { Pencil } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";

import TreatmentDeleteConfirmDialog from "@/components/treatments/components/treatment-delete-confirm-dialog";
import TreatmentDetailHeader from "@/components/treatments/components/treatment-detail-header";
import TreatmentDetailInfoSection from "@/components/treatments/components/treatment-detail-info-section";
import TreatmentDetailInventorySection from "@/components/treatments/components/treatment-detail-inventory-section";
import TreatmentDialog from "@/components/treatments/components/treatment-dialog";
import { getTreatmentDetailActions } from "@/components/treatments/treatment-detail-actions";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import { useTreatmentDetail } from "@/lib/hooks/use-treatment-detail";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentDetailPageClientProps = {
  treatment?: TreatmentWithInventory;
};

export default function TreatmentDetailPageClient({
  treatment: serverTreatment,
}: TreatmentDetailPageClientProps) {
  const router = useRouter();
  const { id: routeTreatmentId } = useParams<{ id: string }>();
  const {
    treatment,
    isLoading,
    error,
    editDialogOpen,
    deleteDialogOpen,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    refetch,
  } = useTreatmentDetail(serverTreatment ?? routeTreatmentId);

  useTopbarBreadcrumb(
    treatment
      ? {
          rootLabel: TREATMENT_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/treatments",
          currentLabel: treatment.name,
        }
      : null,
  );

  useTopbarActions(
    treatment
      ? {
          buttons: [
            {
              title: TREATMENT_DETAIL_COPY.actions.edit,
              icon: Pencil,
              onClick: openEditDialog,
            },
          ],
          menu: {
            actions: getTreatmentDetailActions({
              onEdit: openEditDialog,
              onDelete: openDeleteDialog,
            }),
            ariaLabel: TREATMENT_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto p-8">
        <BackButton
          fallbackHref="/treatments"
          label={TREATMENT_DETAIL_COPY.back}
        />
        <Notice tone="danger" message={TREATMENT_DETAIL_COPY.errors.load} />
      </div>
    );
  }

  if (!treatment) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <TreatmentDetailHeader treatment={treatment} />

      <div className="flex flex-col gap-8 px-4 pb-8 lg:px-8">
        <TreatmentDetailInfoSection treatment={treatment} />
        <TreatmentDetailInventorySection treatment={treatment} />
      </div>

      <TreatmentDialog
        open={editDialogOpen}
        treatmentId={treatment.id}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
            refetch();
          }
        }}
      />

      <TreatmentDeleteConfirmDialog
        treatment={treatment}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
        onSuccess={() => {
          router.push("/treatments");
        }}
      />
    </div>
  );
}
