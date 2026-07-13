import { Calendar } from "lucide-react";

import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { Stat } from "@/components/ui/primitives/stat";
import { formatFullDayLabel } from "@/lib/calendar-grid";

type DashboardHeaderProps = {
  firstName: string;
  appointmentsCount: number;
  confirmedCount: number;
};

export default function DashboardHeader({
  firstName,
  appointmentsCount,
  confirmedCount,
}: DashboardHeaderProps) {
  return (
    <header className="space-y-6 lg:space-y-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row lg:items-end lg:gap-8">
          <div className="min-w-0">
            <h1 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl">
              {DASHBOARD_COPY.welcome(firstName)}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-secondary">
              <Calendar
                className="size-4 shrink-0 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {formatFullDayLabel(new Date())}
            </p>
          </div>
          <div className="hidden shrink-0 items-center divide-x divide-border-subtle lg:flex">
            <Stat
              value={String(appointmentsCount)}
              label={DASHBOARD_COPY.stats.todayAppointments}
            />
            <Stat
              value={String(confirmedCount)}
              label={DASHBOARD_COPY.stats.confirmed}
            />
          </div>
        </div>
      </div>
      <div className="border-b border-border-subtle lg:hidden" />
      <div className="grid grid-cols-2 divide-x divide-border-subtle lg:hidden">
        <Stat
          value={String(appointmentsCount)}
          label={DASHBOARD_COPY.stats.todayAppointments}
        />
        <Stat
          value={String(confirmedCount)}
          label={DASHBOARD_COPY.stats.confirmed}
        />
      </div>
    </header>
  );
}
