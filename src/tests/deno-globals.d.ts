// Las edge functions de supabase/functions corren en Deno y están excluidas de
// tsconfig. Los tests que las importan sí las arrastran al programa de
// TypeScript, así que aquí se declara lo mínimo del runtime que usan.

declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

export {};
