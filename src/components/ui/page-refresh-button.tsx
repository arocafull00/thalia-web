"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageRefreshButtonProps = {
  isRefreshing: boolean;
  label: string;
  loadingLabel: string;
  onRefresh: () => void;
};

export default function PageRefreshButton({
  isRefreshing,
  label,
  loadingLabel,
  onRefresh,
}: PageRefreshButtonProps) {
  const accessibleLabel = isRefreshing ? loadingLabel : label;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      disabled={isRefreshing}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      onClick={onRefresh}
      className="mb-0.5 rounded-button motion-reduce:transition-none"
    >
      <RefreshCw
        className={
          isRefreshing ? "animate-spin motion-reduce:animate-none" : ""
        }
        aria-hidden="true"
      />
    </Button>
  );
}
