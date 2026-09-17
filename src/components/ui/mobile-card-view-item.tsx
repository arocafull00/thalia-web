"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
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
  getRowHref?: (row: T) => string | undefined;
  onRowActivate?: (row: T) => void;
};

const rowPrimaryControlClassName =
  "flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary";

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
  getRowHref,
  onRowActivate,
}: MobileCardViewItemProps<T>) {
  const primaryColumns = columns.filter(
    (column) => column.priority === "primary",
  );
  const secondaryColumns = columns.filter(
    (column) => column.priority === "secondary",
  );
  const href = getRowHref?.(row);
  const rowInteractive = Boolean(href ?? onRowActivate);

  const content = (
    <>
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
      {rowInteractive ? (
        <ChevronRight
          size={16}
          className="shrink-0 text-ink-muted"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-[var(--hover-overlay)]">
      {href ? (
        <Link href={href} className={rowPrimaryControlClassName}>
          {content}
        </Link>
      ) : null}
      {!href && onRowActivate ? (
        <button
          type="button"
          onClick={() => onRowActivate(row)}
          className={rowPrimaryControlClassName}
        >
          {content}
        </button>
      ) : null}
      {!rowInteractive ? (
        <div className={rowPrimaryControlClassName}>{content}</div>
      ) : null}
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
                onClick={() => action.onClick(row)}
                className="min-h-9 min-w-9 rounded-button motion-reduce:transition-none"
              >
                {action.icon}
              </Button>
            ))
          : null}
      </div>
    </div>
  );
}
