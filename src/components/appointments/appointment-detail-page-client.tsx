"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  getAppointmentDetailMenuSections,
  getAppointmentDetailPrimaryAction,
} from "@/components/appointments/appointment-detail-actions";
import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDeleteDialog from "@/components/appointments/components/appointment-delete-dialog";
import AppointmentDetailSidebar from "@/components/appointments/components/appointment-detail-sidebar";
import AppointmentHeader from "@/components/appointments/components/appointment-header";
import AppointmentMaterialsSection from "@/components/appointments/components/appointment-materials-section";
import AppointmentTreatmentsSection from "@/components/appointments/components/appointment-treatments-section";
import ExternalAppointmentResponseDialogs from "@/components/appointments/components/external-appointment-response-dialogs";
import { useExternalAppointmentResponse } from "@/components/appointments/hooks/use-external-appointment-response";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import PageSurface from "@/components/ui/page-surface";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useIsExternalProfessional } from "@/lib/hooks/use-active-clinic";
import { useAppointmentDetail } from "@/lib/hooks/use-appointment-detail";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentDetailPageClientProps = {
  appointment?: AppointmentWithRelations;
};

function resolveTotalDurationMinutes(
  treatments: {
    treatment: { duration_minutes: number | null } | null;
  }[],
  startsAt: string,
  endsAt: string,
) {
  const fromTreatments = treatments.reduce(
    (sum, entry) => sum + (entry.treatment?.duration_minutes ?? 0),
    0,
  );

  if (fromTreatments > 0) {
    return fromTreatments;
  }

  return Math.max(
    1,
    Math.round(
      (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000,
    ),
  );
}

export default function AppointmentDetailPageClient({
  appointment: serverAppointment,
}: AppointmentDetailPageClientProps) {
  const router = useRouter();
  const externalResponse = useExternalAppointmentResponse();
  const isExternalProfessional = useIsExternalProfessional();
  const { id: routeAppointmentId } = useParams<{ id: string }>();
  const {
    appointment,
    isLoading,
    error,
    dialogOpen,
    cancelConfirmOpen,
    cancelError,
    deleteConfirmOpen,
    deleteError,
    restoreStock,
    deleted,
    deleting,
    updatingStatus,
    canChangeStatus,
    openEditDialog,
    closeDialog,
    openCancelConfirm,
    closeCancelConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    setRestoreStock,
    handleStatusChange,
    confirmCancel,
    confirmDelete,
  } = useAppointmentDetail(serverAppointment ?? routeAppointmentId);

  useEffect(() => {
    if (deleted) {
      router.push("/appointments");
    }
  }, [deleted, router]);

  const breadcrumbLabel =
    appointment?.patients?.full_name ?? APPOINTMENT_DETAIL_COPY.patient;
  const canRespondToExternal = Boolean(
    isExternalProfessional && appointment?.status === "pending_external",
  );

  useTopbarBreadcrumb(
    appointment
      ? {
          rootLabel: APPOINTMENT_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/appointments",
          currentLabel: breadcrumbLabel,
        }
      : null,
  );

  useTopbarActions(
    appointment
      ? {
          buttons: [
            getAppointmentDetailPrimaryAction({
              status: appointment.status,
              canChangeStatus,
              updatingStatus,
              canRespondToExternal,
              respondingExternal: externalResponse.isPending,
              handlers: {
                onEdit: openEditDialog,
                onConfirm: () => {
                  void handleStatusChange("confirmed");
                },
                onMarkCompleted: () => {
                  void handleStatusChange("completed");
                },
                onCancel: openCancelConfirm,
                onDelete: openDeleteConfirm,
                onAcceptExternal: () => {
                  if (appointment) void externalResponse.accept(appointment);
                },
                onRejectExternal: () => {
                  if (appointment) externalResponse.requestReject(appointment);
                },
              },
            }),
          ],
          menu: {
            sections: getAppointmentDetailMenuSections({
              status: appointment.status,
              canChangeStatus,
              updatingStatus,
              canRespondToExternal,
              respondingExternal: externalResponse.isPending,
              handlers: {
                onEdit: openEditDialog,
                onConfirm: () => {
                  void handleStatusChange("confirmed");
                },
                onMarkCompleted: () => {
                  void handleStatusChange("completed");
                },
                onCancel: openCancelConfirm,
                onDelete: openDeleteConfirm,
                onAcceptExternal: () => {
                  if (appointment) void externalResponse.accept(appointment);
                },
                onRejectExternal: () => {
                  if (appointment) externalResponse.requestReject(appointment);
                },
              },
            }),
            ariaLabel: APPOINTMENT_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (isLoading) {
    return (
      <PageSurface busy>
        <SkeletonList count={4} />
      </PageSurface>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto space-y-6 p-8">
        <BackButton
          fallbackHref="/appointments"
          label={APPOINTMENT_DETAIL_COPY.back}
        />
        <Notice
          tone="danger"
          message={
            error
              ? APPOINTMENT_DETAIL_COPY.loadError
              : APPOINTMENT_DETAIL_COPY.notFound
          }
        />
      </div>
    );
  }

  const treatments = appointment.appointment_treatments;
  const totalDurationMinutes = resolveTotalDurationMinutes(
    treatments,
    appointment.starts_at,
    appointment.ends_at,
  );

  return (
    <div
      data-testid="appointment-detail-page"
      className="surface-card no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-dialog"
    >
      <AppointmentHeader appointment={appointment} />

      <div className="flex flex-col gap-6 px-4 py-8 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col divide-y divide-border-subtle">
            <AppointmentTreatmentsSection
              treatments={treatments}
              totalDurationMinutes={totalDurationMinutes}
            />
            <div className="pt-6">
              <AppointmentMaterialsSection appointment={appointment} />
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-col xl:gap-6">
            <AppointmentDetailSidebar appointment={appointment} />
          </div>
        </div>
      </div>

      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        appointment={appointment}
      />

      <AppConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCancelConfirm();
          }
        }}
        title={APPOINTMENT_DETAIL_COPY.confirmCancelTitle}
        description={APPOINTMENT_DETAIL_COPY.confirmCancelDescription}
        confirmLabel={APPOINTMENT_DETAIL_COPY.confirmCancel}
        cancelLabel={APPOINTMENT_DETAIL_COPY.cancelDialogCancel}
        pendingLabel={APPOINTMENT_DETAIL_COPY.cancelPending}
        isPending={updatingStatus}
        onConfirm={() => {
          void confirmCancel();
        }}
        confirmTone="danger"
        errorMessage={cancelError ?? undefined}
      />

      <AppointmentDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteConfirm();
          }
        }}
        canRestoreStock={appointment.status === "completed"}
        restoreStock={restoreStock}
        onRestoreStockChange={setRestoreStock}
        isPending={deleting}
        onConfirm={() => {
          void confirmDelete();
        }}
        errorMessage={deleteError ?? undefined}
      />
      <ExternalAppointmentResponseDialogs
        rejectionOpen={Boolean(externalResponse.rejectionAppointment)}
        overlapOpen={Boolean(externalResponse.overlap)}
        overlapDescription={externalResponse.overlapDescription}
        isPending={externalResponse.isPending}
        errorMessage={externalResponse.errorMessage}
        onRejectionOpenChange={(open) => {
          if (!open) externalResponse.closeReject();
        }}
        onOverlapOpenChange={(open) => {
          if (!open) externalResponse.closeOverlap();
        }}
        onConfirmRejection={() => {
          void externalResponse.confirmReject();
        }}
        onConfirmOverlap={() => {
          void externalResponse.confirmOverlap();
        }}
      />
    </div>
  );
}
