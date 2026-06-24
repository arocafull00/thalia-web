import { useEffect, useState } from "react";

import { getFileUrl, peekCachedFileUrl } from "@/lib/storage";

export function useFileUrl(key: string | null) {
  const [url, setUrl] = useState(() => peekCachedFileUrl(key));

  useEffect(() => {
    const cachedUrl = peekCachedFileUrl(key);
    setUrl(cachedUrl);

    if (!key) {
      return;
    }

    if (cachedUrl) {
      return;
    }

    let cancelled = false;

    getFileUrl(key)
      .then((resolvedUrl) => {
        if (!cancelled) {
          setUrl(resolvedUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return url;
}
