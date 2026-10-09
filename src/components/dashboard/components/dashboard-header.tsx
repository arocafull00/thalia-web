import { Calendar } from "lucide-react";

import DashboardDayProgress from "@/components/dashboard/components/dashboard-day-progress";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { formatFullDayLabel } from "@/lib/calendar-grid";
import type { DaySegment } from "@/lib/dashboard-day";

type DashboardHeaderProps = {
  firstName: string;
  segments: DaySegment[];
  totalCount: number;
};

export default function DashboardHeader({
  firstName,
  segments,
  totalCount,
}: DashboardHeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-end gap-4">
      <div className="min-w-0 flex-1 basis-64">
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

      {/* Sin citas no hay jornada que medir, y una barra vacía se lee como
          retraso en lugar de como día libre. */}
      {totalCount === 0 ? null : (
        <DashboardDayProgress segments={segments} totalCount={totalCount} />
      )}
    </header>
  );
}
