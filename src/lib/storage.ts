import { supabase } from "@/lib/supabase";

const AVATARS_BUCKET = "avatars";

/*
 * El bucket es privado (#125): las fotos de pacientes no pueden servirse por URL
 * pública. Se firman, con el mismo patrón que `patient-image-storage.ts`.
 *
 * La caché evita pedir la misma URL una vez por avatar al pintar un listado, y
 * el mapa de peticiones en vuelo evita que dos componentes que montan a la vez
 * pidan lo mismo por duplicado.
 *
 * El TTL va por debajo de la caducidad real de la firma, para no entregar una
 * URL a punto de expirar.
 */
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;
const SIGNED_URL_CACHE_TTL_MS = 50 * 60 * 1000;

type CachedSignedUrl = {
  expiresAt: number;
  url: string;
};

const signedUrlCache = new Map<string, CachedSignedUrl>();
const signedUrlInflight = new Map<string, Promise<string>>();

function resolveExternalFileUrl(key: string) {
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("file://")
  ) {
    return key;
  }

  return null;
}

export function withFileUrlCacheBust(
  url: string | null,
  version: string | null,
) {
  if (!url || !version) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

export function resolveAvatarDisplayUri(
  resolvedUrl: string | null,
  version: string | null | undefined,
  localPreviewUri?: string | null,
) {
  if (localPreviewUri) {
    return localPreviewUri;
  }

  return withFileUrlCacheBust(resolvedUrl, version ?? null);
}

/**
 * URL ya disponible, sin pedir nada. Devuelve null si no hay nada en caché: es
 * lo que permite a `useFileUrl` pintar el hueco y resolver después.
 */
export function peekCachedFileUrl(key: string | null) {
  if (!key) {
    return null;
  }

  const externalUrl = resolveExternalFileUrl(key);

  if (externalUrl) {
    return externalUrl;
  }

  const cached = signedUrlCache.get(key);

  if (!cached || cached.expiresAt <= Date.now()) {
    return null;
  }

  return cached.url;
}

export async function uploadFile(
  key: string,
  file: File | Blob,
  contentType: string,
) {
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(key, file, { contentType, upsert: true });

  if (error) {
    throw error;
  }

  // Al reemplazar un avatar, la URL firmada anterior apunta al contenido viejo.
  signedUrlCache.delete(key);

  return key;
}

export async function getFileUrl(key: string) {
  const externalUrl = resolveExternalFileUrl(key);

  if (externalUrl) {
    return externalUrl;
  }

  const cached = peekCachedFileUrl(key);

  if (cached) {
    return cached;
  }

  const pending = signedUrlInflight.get(key);

  if (pending) {
    return pending;
  }

  const request = supabase.storage
    .from(AVATARS_BUCKET)
    .createSignedUrl(key, SIGNED_URL_EXPIRES_IN_SECONDS)
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error("No se pudo resolver la URL del archivo");
      }

      signedUrlCache.set(key, {
        expiresAt: Date.now() + SIGNED_URL_CACHE_TTL_MS,
        url: data.signedUrl,
      });

      return data.signedUrl;
    })
    .finally(() => {
      signedUrlInflight.delete(key);
    });

  signedUrlInflight.set(key, request);

  return request;
}
