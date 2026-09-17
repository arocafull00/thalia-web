"use client";

import AppointmentsTable from "@/components/appointments/components/appointments-table";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

type PatientAppointmentsTabProps = {
  appointments: AppointmentWithRelations[];
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>;
  readOnly?: boolean;
};

export default function PatientAppointmentsTab({
  appointments,
  onStatusChange,
  readOnly = false,
}: PatientAppointmentsTabProps) {
  return (
    <div className="space-y-4">
      <AppointmentsTable
        appointments={appointments}
        onStatusChange={onStatusChange}
        readOnly={readOnly}
      />
    </div>
  );
}
