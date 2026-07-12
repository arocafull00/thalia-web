import { supabase } from "@/lib/supabase";

export const PATIENT_IMAGES_BUCKET = "patient-images";

const SIGNED_URL_CACHE_TTL_MS = 50 * 60 * 1000;

type CachedSignedUrl = {
  expiresAt: number;
  url: string;
};

const signedUrlCache = new Map<string, CachedSignedUrl>();
const signedUrlInflight = new Map<string, Promise<string>>();

export function buildPatientImageKey(
  clinicId: string,
  patientId: string,
  imageId: string,
  ext: string,
) {
  return `${clinicId}/${patientId}/${imageId}.${ext}`;
}

export function peekCachedPatientImageUrl(key: string | null) {
  if (!key) {
    return null;
  }

  const cached = signedUrlCache.get(key);

  if (!cached || cached.expiresAt <= Date.now()) {
    return null;
  }

  return cached.url;
}

export async function getSignedPatientImageUrl(
  key: string,
  expiresInSeconds = 3600,
) {
  const cached = peekCachedPatientImageUrl(key);

  if (cached) {
    return cached;
  }

  const pending = signedUrlInflight.get(key);

  if (pending) {
    return pending;
  }

  const request = supabase.storage
    .from(PATIENT_IMAGES_BUCKET)
    .createSignedUrl(key, expiresInSeconds)
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error("No se recibió URL firmada");
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

export async function uploadPatientImageObject(
  key: string,
  blob: Blob,
  contentType: string,
  onProgress?: (progress: number) => void,
) {
  const { data, error } = await supabase.storage
    .from(PATIENT_IMAGES_BUCKET)
    .createSignedUploadUrl(key);

  if (error) {
    throw error;
  }

  if (!data?.signedUrl) {
    throw new Error("No se recibió URL de subida");
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(new Error("Upload failed"));
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("PUT", data.signedUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(blob);
  });

  signedUrlCache.delete(key);

  return key;
}

export async function removePatientImageObject(key: string) {
  const { error } = await supabase.storage
    .from(PATIENT_IMAGES_BUCKET)
    .remove([key]);

  if (error) {
    throw error;
  }

  signedUrlCache.delete(key);
}
