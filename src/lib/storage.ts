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
  fileUri: string,
  contentType: string,
) {
  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(key, blob, { contentType, upsert: true });

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
