type SupabaseQueryError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

function toSupabaseQueryError(error: SupabaseQueryError): Error {
  return Object.assign(new Error(error.message), error);
}

export function unwrapSupabase<T>(
  data: T | null,
  error: SupabaseQueryError | null,
): T {
  if (error) {
    throw toSupabaseQueryError(error);
  }

  if (data === null) {
    throw new Error("No se recibieron datos de Supabase");
  }

  return data;
}

export function unwrapSupabaseNullable<T>(
  data: T | null,
  error: SupabaseQueryError | null,
): T | null {
  if (error) {
    throw toSupabaseQueryError(error);
  }

  return data;
}

export function unwrapSupabaseList<T>(
  data: T[] | null,
  error: SupabaseQueryError | null,
): T[] {
  if (error) {
    throw toSupabaseQueryError(error);
  }

  return data ?? [];
}
