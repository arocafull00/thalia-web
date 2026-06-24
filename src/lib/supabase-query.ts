export function unwrapSupabase<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }

  if (data === null) {
    throw new Error("No se recibieron datos de Supabase");
  }

  return data;
}

export function unwrapSupabaseList<T>(data: T[] | null, error: { message: string } | null): T[] {
  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
