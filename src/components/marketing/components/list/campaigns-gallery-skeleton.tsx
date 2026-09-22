export default function CampaignsGallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="aspect-[16/9] animate-pulse bg-primary-subtle motion-reduce:animate-none" />
          <div className="space-y-2 p-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-primary-subtle motion-reduce:animate-none" />
            <div className="h-4 w-full animate-pulse rounded bg-primary-subtle motion-reduce:animate-none" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-primary-subtle motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
