"use client";

import { Loader2, X } from "lucide-react";

import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";

type Props = {
  slots: Date[];
  loading: boolean;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

function formatSlot(date: Date): string {
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();

  const time = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (isToday) return `Hoy, ${time}`;
  if (isTomorrow) return `Mañana, ${time}`;

  const dayLabel = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(date);
  const capitalized = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);
  return `${capitalized}, ${time}`;
}

export default function AppointmentSlotPicker({
  slots,
  loading,
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
        <span className="text-xs font-medium text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.findSlots.resultsTitle}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-ink-muted hover:bg-surface-secondary"
          aria-label="Cerrar"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-muted">
          <Loader2 className="size-4 animate-spin" />
          {APPOINTMENT_CREATE_COPY.findSlots.loading}
        </div>
      ) : slots.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">
          {APPOINTMENT_CREATE_COPY.findSlots.noSlots}
        </p>
      ) : (
        <ul className="max-h-72 overflow-y-auto">
          {slots.map((slot, i) => (
            <li key={slot.toISOString()}>
              <button
                type="button"
                onClick={() => onSelect(slot)}
                className={`w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-surface-secondary ${
                  i < slots.length - 1 ? "border-b border-border-subtle" : ""
                }`}
              >
                {formatSlot(slot)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
