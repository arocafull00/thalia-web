import { format, isToday } from "date-fns";

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
      <button
        type="button"
        onClick={() => onSelect(day)}
        className={`relative flex size-10 flex-col items-center justify-center rounded-full text-sm font-medium motion-reduce:transition-none ${
          isSelected
            ? "bg-primary text-on-primary"
            : isTodayDay
              ? "bg-primary-subtle text-ink"
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
      </button>
    </div>
  );
}
