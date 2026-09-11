"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div className="space-y-4">
      <AppointmentsTable
        appointments={appointments}
        onRowClick={(id) => router.push(`/appointments/${id}`)}
        onStatusChange={onStatusChange}
        readOnly={readOnly}
      />
    </div>
  );
}
