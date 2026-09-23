import { useEffect, useRef } from "react";

import { getQueryEpoch } from "@/stores/query-epoch";

const requests = new Map<string, Promise<unknown>>();

export function useRevalidateOnEntry(
  key: string | null,
  fetch: () => Promise<unknown>,
) {
  const fetchRef = useRef(fetch);

  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  useEffect(() => {
    if (!key) return;

    const requestKey = `${getQueryEpoch()}:${key}`;
    if (requests.has(requestKey)) return;

    const request = Promise.resolve()
      .then(() => fetchRef.current())
      .finally(() => requests.delete(requestKey));
    requests.set(requestKey, request);
    void request.catch(() => undefined);
  }, [key]);
}
