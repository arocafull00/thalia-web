import { supabase } from "@/lib/supabase";

const AVATARS_BUCKET = "avatars";

function resolvePublicFileUrl(key: string) {
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

export function peekCachedFileUrl(key: string | null) {
  if (!key) {
    return null;
  }

  const publicUrl = resolvePublicFileUrl(key);

  if (publicUrl) {
    return publicUrl;
  }

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(key);

  return data.publicUrl;
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

  return key;
}

export async function getFileUrl(key: string) {
  const publicUrl = peekCachedFileUrl(key);

  if (!publicUrl) {
    throw new Error("No se pudo resolver la URL del archivo");
  }

  return publicUrl;
}
