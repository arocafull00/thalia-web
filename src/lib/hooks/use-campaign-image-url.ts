import { useEffect, useState } from "react";

import { getCampaignImageUrl } from "@/lib/campaign-image-storage";

/**
 * Resuelve la URL firmada de una imagen de campaña. El bucket es privado, así
 * que no vale con guardar la clave: hay que pedir una URL temporal cada vez.
 */
export function useCampaignImageUrl(storageKey: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    let cancelled = false;

    getCampaignImageUrl(storageKey)
      .then((signed) => {
        if (cancelled) {
          return;
        }

        setUrl(signed);
        setHasError(signed == null);
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(null);
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  return {
    url: storageKey ? url : null,
    isLoading: Boolean(storageKey) && url == null && !hasError,
    hasError,
  };
}
