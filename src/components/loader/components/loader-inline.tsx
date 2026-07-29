import { LoaderSpinner } from "@/components/loader/components/loader-spinner";
import { LOADER_COPY } from "@/copy/loader-copy";

export function LoaderInline() {
  return (
    <div
      data-testid="loader-inline"
      role="status"
      aria-busy="true"
      aria-label={LOADER_COPY.loading.label}
      className="grid min-h-52 place-items-center"
    >
      <LoaderSpinner size="sm" />
    </div>
  );
}
