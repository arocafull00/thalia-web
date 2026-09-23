export type QueryEntry<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchedAt?: number;
  requestedAt?: number;
};

export const CLINICAL_QUERY_STALE_TIME = 2 * 60 * 1000;
export const REFERENCE_QUERY_STALE_TIME = 5 * 60 * 1000;
export const ACTIVITY_QUERY_STALE_TIME = 30 * 1000;

export function isQueryFresh<T>(
  entry: QueryEntry<T> | undefined | null,
  staleTime = CLINICAL_QUERY_STALE_TIME,
): boolean {
  return (
    entry?.data != null &&
    entry.fetchedAt != null &&
    Date.now() - entry.fetchedAt < staleTime
  );
}

export function shouldFetchQuery<T>(
  entry: QueryEntry<T> | undefined | null,
  staleTime = CLINICAL_QUERY_STALE_TIME,
): boolean {
  if (entry?.loading || isQueryFresh(entry, staleTime)) {
    return false;
  }

  return !entry?.requestedAt || Date.now() - entry.requestedAt >= 5000;
}

export function emptyQueryEntry<T>(): QueryEntry<T> {
  return { data: null, loading: false, error: null };
}

export function loadingQueryEntry<T>(
  previous: QueryEntry<T> | undefined,
): QueryEntry<T> {
  return {
    data: previous?.data ?? null,
    loading: true,
    error: null,
    fetchedAt: previous?.fetchedAt,
    requestedAt: Date.now(),
  };
}

export function shareEqualData<T>(previous: T, next: T): T {
  if (Object.is(previous, next)) return previous;
  if (Array.isArray(previous) && Array.isArray(next)) {
    if (previous.length !== next.length) return next;
    const shared = next.map((item, index) => shareEqualData(previous[index], item));
    return shared.every((item, index) => item === previous[index])
      ? previous
      : (shared as T);
  }
  if (
    previous !== null &&
    next !== null &&
    typeof previous === "object" &&
    typeof next === "object" &&
    !Array.isArray(previous) &&
    !Array.isArray(next)
  ) {
    const oldRecord = previous as Record<string, unknown>;
    const newRecord = next as Record<string, unknown>;
    const keys = Object.keys(newRecord);
    if (keys.length !== Object.keys(oldRecord).length) return next;
    const shared: Record<string, unknown> = {};
    for (const key of keys) {
      if (!(key in oldRecord)) return next;
      shared[key] = shareEqualData(oldRecord[key], newRecord[key]);
    }
    return keys.every((key) => shared[key] === oldRecord[key])
      ? previous
      : (shared as T);
  }
  return next;
}

export function successQueryEntry<T>(
  data: T,
  previous?: QueryEntry<T>,
): QueryEntry<T> {
  const shared = previous?.data == null ? data : shareEqualData(previous.data, data);
  if (previous && previous.data === shared && !previous.loading && !previous.error) {
    return previous;
  }
  return { data: shared, loading: false, error: null, fetchedAt: Date.now() };
}

export function errorQueryEntry<T>(
  error: Error,
  previous: QueryEntry<T> | undefined,
): QueryEntry<T> {
  const denied = isAccessDenied(error);
  return {
    data: denied ? null : (previous?.data ?? null),
    loading: false,
    error,
    fetchedAt: denied ? undefined : previous?.fetchedAt,
    requestedAt: previous?.requestedAt,
  };
}

export function isAccessDenied(error: Error): boolean {
  const accessError = error as Error & { code?: string; status?: number };
  return accessError.status === 401 || accessError.status === 403 || accessError.code === "42501" || accessError.code === "PGRST116" || accessError.code === "PGRST301";
}

export function isInitialLoading<T>(
  entry: QueryEntry<T> | undefined | null,
): boolean {
  return entry == null || (entry.loading && entry.data == null);
}
