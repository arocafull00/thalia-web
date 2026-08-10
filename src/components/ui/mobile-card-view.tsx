"use client";

import type { ReactNode } from "react";

import MobileCardViewItem from "@/components/ui/mobile-card-view-item";

export type MobileCardColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  priority: "primary" | "secondary";
};

export type MobileCardAction<T> = {
  icon: ReactNode;
  label: string;
  onClick: (row: T) => void;
};

type MobileCardViewProps<T> = {
  data: T[];
  columns: MobileCardColumn<T>[];
  actions?: MobileCardAction<T>[];
  renderActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string;
};

export default function MobileCardView<T>({
  data,
  columns,
  actions,
  renderActions,
  onRowClick,
  emptyMessage = "No hay resultados.",
  getRowKey,
}: MobileCardViewProps<T>) {
  if (data.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-ink-secondary">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="divide-y divide-border-subtle">
      {data.map((row, index) => (
        <MobileCardViewItem
          key={getRowKey(row, index)}
          row={row}
          columns={columns}
          actions={actions}
          renderActions={renderActions}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
