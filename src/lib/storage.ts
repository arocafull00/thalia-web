import { supabase } from "@/lib/supabase";

const FILE_URL_CACHE_TTL_MS = 50 * 60 * 1000;

type CachedFileUrl = {
  expiresAt: number;
  url: string;
};

const fileUrlCache = new Map<string, CachedFileUrl>();
const fileUrlInflight = new Map<string, Promise<string>>();

function resolvePublicFileUrl(key: string) {
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("file://")) {
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

  const cached = fileUrlCache.get(key);

  if (!cached || cached.expiresAt <= Date.now()) {
    return null;
  }

  return cached.url;
}

export async function uploadFile(key: string, fileUri: string, contentType: string) {
  const { data, error } = await supabase.functions.invoke<{ url: string; key: string }>(
    "r2-presign",
    {
      body: { key, contentType, action: "upload" },
    },
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No se recibió URL de subida");
  }

  const fileResponse = await fetch(fileUri);
  const response = await fetch(data.url, {
    method: "PUT",
    body: await fileResponse.blob(),
    headers: { "Content-Type": contentType },
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  fileUrlCache.delete(key);

  return data.key;
}

export async function getFileUrl(key: string) {
  const publicUrl = resolvePublicFileUrl(key);

  if (publicUrl) {
    return publicUrl;
  }

  const cached = peekCachedFileUrl(key);

  if (cached) {
    return cached;
  }

  const pending = fileUrlInflight.get(key);

  if (pending) {
    return pending;
  }

  const request = supabase.functions
    .invoke<{ url: string }>("r2-presign", {
      body: { key, action: "download" },
    })
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No se recibió URL de descarga");
      }

      fileUrlCache.set(key, {
        expiresAt: Date.now() + FILE_URL_CACHE_TTL_MS,
        url: data.url,
      });

      return data.url;
    })
    .finally(() => {
      fileUrlInflight.delete(key);
    });

  fileUrlInflight.set(key, request);

  return request;
}
