import { Loader2, Search } from "lucide-react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import type { SlotSearchMode } from "@/lib/find-slots";

const SEARCH_MODE_OPTIONS: { value: SlotSearchMode; label: string }[] = [
  {
    value: "asap",
    label: APPOINTMENT_CREATE_COPY.findSlots.modes.asap,
  },
  {
    value: "next-week",
    label: APPOINTMENT_CREATE_COPY.findSlots.modes.nextWeek,
  },
  {
    value: "anytime",
    label: APPOINTMENT_CREATE_COPY.findSlots.modes.anytime,
  },
];

type AppointmentSlotSearchControlsProps = {
  mode: SlotSearchMode;
  disabled: boolean;
  loading: boolean;
  onModeChange: (mode: SlotSearchMode) => void;
  onSearch: () => void;
};

export default function AppointmentSlotSearchControls({
  mode,
  disabled,
  loading,
  onModeChange,
  onSearch,
}: AppointmentSlotSearchControlsProps) {
  const handleModeChange = (value: string | null) => {
    const option = SEARCH_MODE_OPTIONS.find((item) => item.value === value);

    if (option) {
      onModeChange(option.value);
    }
  };

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.findSlots.modeLabel}
        </span>
        <AppSearchableCombobox
          testId="appointment-slot-search-mode"
          value={mode}
          onValueChange={handleModeChange}
          options={SEARCH_MODE_OPTIONS}
          showSearch={false}
          disabled={loading}
          className="h-9"
        />
      </label>
      <button
        type="button"
        onClick={onSearch}
        disabled={disabled || loading}
        title={disabled ? APPOINTMENT_CREATE_COPY.findSlots.hint : undefined}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-button border border-border bg-surface px-3 text-sm font-medium text-primary hover:bg-primary-subtle hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Search className="size-4" />
        )}
        {loading
          ? APPOINTMENT_CREATE_COPY.findSlots.loading
          : APPOINTMENT_CREATE_COPY.findSlots.button}
      </button>
    </div>
  );
}
