"use client";

import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

import type {
  MobileCardAction,
  MobileCardColumn,
} from "@/components/ui/mobile-card-view";

type MobileCardViewItemProps<T> = {
  row: T;
  columns: MobileCardColumn<T>[];
  actions?: MobileCardAction<T>[];
  onRowClick?: (row: T) => void;
};

function renderColumnValue<T>(row: T, column: MobileCardColumn<T>) {
  if (column.render) {
    return column.render(row);
  }

  return String((row as Record<string, unknown>)[column.key] ?? "-");
}

export default function MobileCardViewItem<T>({
  row,
  columns,
  actions,
  onRowClick,
}: MobileCardViewItemProps<T>) {
  const primaryColumns = columns.filter(
    (column) => column.priority === "primary",
  );
  const secondaryColumns = columns.filter(
    (column) => column.priority === "secondary",
  );
  const clickable = Boolean(onRowClick);

  return (
    <div
      className={`px-4 py-3 ${clickable ? "cursor-pointer hover:bg-canvas" : ""}`}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      onKeyDown={
        onRowClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onRowClick(row);
              }
            }
          : undefined
      }
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <dl className="space-y-1">
            {primaryColumns.map((column) => (
              <div key={column.key}>
                <dt className="sr-only">{column.label}</dt>
                <dd className="text-sm text-ink">
                  {renderColumnValue(row, column)}
                </dd>
              </div>
            ))}
          </dl>
          {secondaryColumns.length > 0 ? (
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs text-ink-muted">
              {secondaryColumns.map((column, index) => (
                <Fragment key={column.key}>
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <span>{renderColumnValue(row, column)}</span>
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions && actions.length > 0
            ? actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  aria-label={action.label}
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick(row);
                  }}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
                >
                  {action.icon}
                </button>
              ))
            : null}
          {clickable ? (
            <ChevronRight
              size={16}
              className="text-ink-muted"
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
