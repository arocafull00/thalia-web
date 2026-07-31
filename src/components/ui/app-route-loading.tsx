import { Skeleton } from "@/components/ui/skeleton";

export default function AppRouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Cargando pantalla</span>
      <div className="shrink-0 border-b border-border-subtle pb-5">
        <Skeleton className="h-7 w-44 bg-primary-subtle/60" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full bg-primary-subtle/40" />
      </div>
      <div className="grid min-h-0 flex-1 gap-6 pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div className="flex min-h-0 flex-col gap-3">
          <Skeleton className="h-10 w-full bg-primary-subtle/40" />
          <Skeleton className="h-16 w-full bg-primary-subtle/40" />
          <Skeleton className="h-16 w-full bg-primary-subtle/40" />
          <Skeleton className="h-16 w-full bg-primary-subtle/40" />
          <Skeleton className="h-16 w-full bg-primary-subtle/40" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full bg-primary-subtle/40" />
          <Skeleton className="h-24 w-full bg-primary-subtle/40" />
        </div>
      </div>
    </div>
  );
}
