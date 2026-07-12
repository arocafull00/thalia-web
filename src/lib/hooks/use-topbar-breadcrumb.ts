import { useEffect } from "react";

import type { TopbarBreadcrumb } from "@/stores/topbar-action-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

export function useTopbarBreadcrumb(config: TopbarBreadcrumb | null) {
  const setBreadcrumb = useTopbarActionStore((state) => state.setBreadcrumb);
  const rootLabel = config?.rootLabel;
  const rootHref = config?.rootHref;
  const currentLabel = config?.currentLabel;

  useEffect(() => {
    if (!rootLabel || !rootHref || !currentLabel) {
      setBreadcrumb(null);
      return;
    }

    setBreadcrumb({ rootLabel, rootHref, currentLabel });

    return () => setBreadcrumb(null);
  }, [rootLabel, rootHref, currentLabel, setBreadcrumb]);
}
