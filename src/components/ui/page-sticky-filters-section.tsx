import type { ReactNode } from "react";

type PageStickyFiltersSectionProps = {
  children: ReactNode;
};

export default function PageStickyFiltersSection({
  children,
}: PageStickyFiltersSectionProps) {
  return (
    <div className="sticky top-0 z-20 border-border-subtle bg-surface px-4 py-3 lg:px-8 lg:py-3">
      {children}
    </div>
  );
}
