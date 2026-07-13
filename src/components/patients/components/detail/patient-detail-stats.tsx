import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  History,
} from "lucide-react";

import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { PatientDetailStats } from "@/lib/patient-detail-stats";

import PatientStatCard from "./patient-stat-card";

type PatientDetailStatsProps = {
  stats: PatientDetailStats;
};

export default function PatientDetailStatsRow({
  stats,
}: PatientDetailStatsProps) {
  const cards = [
    {
      icon: History,
      label: PATIENT_DETAIL_COPY.stats.lastAppointment,
      value: stats.lastAppointmentLabel,
    },
    {
      icon: ClipboardList,
      label: PATIENT_DETAIL_COPY.stats.currentTreatment,
      value: stats.currentTreatmentLabel,
    },
    {
      icon: CalendarClock,
      label: PATIENT_DETAIL_COPY.stats.nextAppointment,
      value: stats.nextAppointmentLabel,
    },
    {
      icon: CalendarCheck,
      label: PATIENT_DETAIL_COPY.stats.totalAppointments,
      value: stats.totalAppointmentsLabel,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <PatientStatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
        />
      ))}
    </div>
  );
}
