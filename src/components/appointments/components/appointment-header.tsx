"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar, CheckCircle, Clock, MoreVertical } from "lucide-react";
import { useState } from "react";

import AppointmentPersonAvatar from "@/components/appointments/components/appointment-person-avatar";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { BackButton } from "@/components/ui/primitives/back-button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  formatAppointmentDetailDay,
  formatAppointmentDuration,
  formatAppointmentTimeRange,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentHeaderProps = {
  appointment: AppointmentWithRelations;
  canChangeStatus: boolean;
  updatingStatus: boolean;
  onEdit: () => void;
  onMarkCompleted: () => void;
  onCancel: () => void;
};

export default function AppointmentHeader({
  appointment,
  canChangeStatus,
  updatingStatus,
  onEdit,
  onMarkCompleted,
  onCancel,
}: AppointmentHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const patientName = appointment.patients?.full_name ?? "Paciente";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-4">
        <BackButton
          fallbackHref="/appointments"
          label={APPOINTMENT_DETAIL_COPY.back}
        />
        <div className="flex flex-wrap items-start gap-4">
          <AppointmentPersonAvatar
            name={patientName}
            avatarUrl={appointment.patients?.avatar_url ?? null}
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl">
                {patientName}
              </h1>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {formatAppointmentDetailDay(appointment.starts_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {formatAppointmentTimeRange(
                  appointment.starts_at,
                  appointment.ends_at,
                )}
              </span>
              <span>{formatAppointmentDuration(appointment)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <ActionButton title={APPOINTMENT_DETAIL_COPY.edit} onClick={onEdit} />
        {canChangeStatus ? (
          <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Popover.Trigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={APPOINTMENT_DETAIL_COPY.moreActions}
                className="rounded-full border border-border"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                className="z-100 min-w-52 rounded-[14px] border border-border/60 bg-surface p-1.5 shadow-float"
              >
                <Button
                  type="button"
                  variant="ghost"
                  disabled={updatingStatus}
                  onClick={() => {
                    closeMenu();
                    onMarkCompleted();
                  }}
                  className="h-auto w-full justify-start rounded-xl px-3 py-2 text-sm"
                >
                  <CheckCircle
                    className="size-4 text-ink-muted"
                    aria-hidden="true"
                  />
                  {APPOINTMENT_DETAIL_COPY.markCompleted}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={updatingStatus}
                  onClick={() => {
                    closeMenu();
                    onCancel();
                  }}
                  className="h-auto w-full justify-start rounded-xl px-3 py-2 text-sm text-danger hover:bg-danger-subtle hover:text-danger"
                >
                  {APPOINTMENT_DETAIL_COPY.cancel}
                </Button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ) : null}
      </div>
    </div>
  );
}
