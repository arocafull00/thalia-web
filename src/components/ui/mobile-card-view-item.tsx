"use client";

import { ChevronRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type {
  MobileCardAction,
  MobileCardColumn,
} from "@/components/ui/mobile-card-view";

type MobileCardViewItemProps<T> = {
  row: T;
  columns: MobileCardColumn<T>[];
  actions?: MobileCardAction<T>[];
  renderActions?: (row: T) => ReactNode;
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
  renderActions,
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
      className={`px-4 py-4 ${clickable ? "cursor-pointer hover:bg-[var(--hover-overlay)]" : ""}`}
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
          {renderActions ? renderActions(row) : null}
          {actions && actions.length > 0
            ? actions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={action.label}
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick(row);
                  }}
                  className="min-h-9 min-w-9 rounded-button motion-reduce:transition-none"
                >
                  {action.icon}
                </Button>
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
