export type QueryEntry<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export function emptyQueryEntry<T>(): QueryEntry<T> {
  return { data: null, loading: false, error: null };
}

export function loadingQueryEntry<T>(previous: QueryEntry<T> | undefined): QueryEntry<T> {
  return { data: previous?.data ?? null, loading: true, error: null };
}

export function successQueryEntry<T>(data: T): QueryEntry<T> {
  return { data, loading: false, error: null };
}

export function errorQueryEntry<T>(
  error: Error,
  previous: QueryEntry<T> | undefined,
): QueryEntry<T> {
  return { data: previous?.data ?? null, loading: false, error };
}
