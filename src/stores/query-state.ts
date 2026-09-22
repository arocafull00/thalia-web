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

export function successQueryEntry<T>(data: T): QueryEntry<T> {
  return { data, loading: false, error: null, fetchedAt: Date.now() };
}

export function errorQueryEntry<T>(
  error: Error,
  previous: QueryEntry<T> | undefined,
): QueryEntry<T> {
  return {
    data: previous?.data ?? null,
    loading: false,
    error,
    fetchedAt: previous?.fetchedAt,
    requestedAt: previous?.requestedAt,
  };
}

export function isInitialLoading<T>(
  entry: QueryEntry<T> | undefined | null,
): boolean {
  return entry == null || (entry.loading && entry.data == null);
}
