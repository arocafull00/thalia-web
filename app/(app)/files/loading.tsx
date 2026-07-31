import { SkeletonList } from "@/components/ui/primitives/skeleton-list";

export default function FilesLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-5 lg:px-8 lg:py-7">
      <SkeletonList />
    </div>
  );
}
