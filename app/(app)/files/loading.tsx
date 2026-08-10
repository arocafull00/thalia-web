import PageSurface from "@/components/ui/page-surface";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";

export default function FilesLoading() {
  return (
    <PageSurface busy>
      <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
    </PageSurface>
  );
}
