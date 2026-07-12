import { format, isToday } from "date-fns";

import { Button } from "@/components/ui/button";

type MonthMiniCalendarDayProps = {
  day: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasAppointments: boolean;
  onSelect: (day: Date) => void;
};

export default function MonthMiniCalendarDay({
  day,
  isCurrentMonth,
  isSelected,
  hasAppointments,
  onSelect,
}: MonthMiniCalendarDayProps) {
  const isTodayDay = isToday(day);

  return (
    <div className="flex items-center justify-center py-0.5">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onSelect(day)}
        className={`relative size-10 flex-col rounded-full p-0 text-sm font-medium motion-reduce:transition-none ${
          isSelected
            ? "bg-primary text-on-primary hover:bg-primary hover:text-on-primary"
            : isTodayDay
              ? "bg-primary-subtle text-ink hover:bg-primary-subtle"
              : isCurrentMonth
                ? "text-ink hover:bg-canvas"
                : "text-ink-muted"
        }`}
      >
        {format(day, "d")}
        {hasAppointments ? (
          <span
            className={`absolute bottom-1 h-1 w-1 rounded-full ${
              isSelected ? "bg-on-primary" : "bg-primary"
            }`}
            aria-hidden
          />
        ) : null}
      </Button>
    </div>
  );
}
