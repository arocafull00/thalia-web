import { useEffect, useState } from "react";

import { getFileUrl, peekCachedFileUrl } from "@/lib/storage";

type AsyncFileUrl = {
  key: string;
  url: string | null;
};

export function useFileUrl(key: string | null) {
  const cachedUrl = peekCachedFileUrl(key);
  const [asyncUrl, setAsyncUrl] = useState<AsyncFileUrl | null>(null);

  useEffect(() => {
    if (!key) {
      return;
    }

    if (peekCachedFileUrl(key)) {
      return;
    }

    let cancelled = false;

    getFileUrl(key)
      .then((resolvedUrl) => {
        if (!cancelled) {
          setAsyncUrl({ key, url: resolvedUrl });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncUrl({ key, url: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  if (!key) {
    return null;
  }

  if (cachedUrl) {
    return cachedUrl;
  }

  if (asyncUrl?.key === key) {
    return asyncUrl.url;
  }

  return null;
}
