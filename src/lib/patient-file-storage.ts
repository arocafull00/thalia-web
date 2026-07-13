import { supabase } from "@/lib/supabase";

export const PATIENT_FILES_BUCKET = "patient-files";

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".docx",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXTENSION_MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const FILENAME_MAX_LENGTH = 200;
const INVALID_FILENAME_CHARS = /[/\\?%*:|"<>]/g;

const SIGNED_URL_CACHE_TTL_MS = 50 * 60 * 1000;

type CachedSignedUrl = {
  expiresAt: number;
  url: string;
};

const signedUrlCache = new Map<string, CachedSignedUrl>();
const signedUrlInflight = new Map<string, Promise<string>>();

export type ValidatedPatientFile = {
  extension: string;
  mimeType: string;
  sanitizedFilename: string;
};

export function getFileExtension(filename: string) {
  const lastDot = filename.lastIndexOf(".");

  if (lastDot <= 0) {
    return "";
  }

  return filename.slice(lastDot).toLowerCase();
}

export function sanitizePatientFilename(filename: string) {
  const trimmed = filename.trim().replace(INVALID_FILENAME_CHARS, "_");

  if (!trimmed) {
    throw new Error("El nombre del archivo no es válido.");
  }

  if (trimmed.length > FILENAME_MAX_LENGTH) {
    const extension = getFileExtension(trimmed);
    const baseMax = FILENAME_MAX_LENGTH - extension.length;
    const base = trimmed.slice(0, Math.max(1, baseMax));

    return `${base}${extension}`;
  }

  return trimmed;
}

export function resolvePatientFileMimeType(
  filename: string,
  reportedMime: string,
) {
  const extension = getFileExtension(filename);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Tipo de archivo no permitido.");
  }

  const extensionMime = EXTENSION_MIME_MAP[extension];

  if (!extensionMime) {
    throw new Error("Tipo de archivo no permitido.");
  }

  if (
    reportedMime &&
    ALLOWED_MIME_TYPES.has(reportedMime) &&
    reportedMime !== extensionMime
  ) {
    throw new Error("El tipo MIME no coincide con la extensión del archivo.");
  }

  return extensionMime;
}

export function validatePatientFile(file: File): ValidatedPatientFile {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("El archivo supera el tamaño máximo de 20 MB.");
  }

  const sanitizedFilename = sanitizePatientFilename(file.name);
  const mimeType = resolvePatientFileMimeType(sanitizedFilename, file.type);
  const extension = getFileExtension(sanitizedFilename);

  return {
    extension,
    mimeType,
    sanitizedFilename,
  };
}

export function buildPatientFileKey(
  clinicId: string,
  patientId: string,
  fileId: string,
  filename: string,
) {
  return `${clinicId}/${patientId}/${fileId}/${filename}`;
}

export function isPatientFilePdf(mimeType: string) {
  return mimeType === "application/pdf";
}

export function isPatientFileImage(mimeType: string) {
  return mimeType === "image/jpeg" || mimeType === "image/png";
}

export function isPatientFileViewable(mimeType: string) {
  return isPatientFilePdf(mimeType) || isPatientFileImage(mimeType);
}

export function peekCachedPatientFileUrl(key: string | null) {
  if (!key) {
    return null;
  }

  const cached = signedUrlCache.get(key);

  if (!cached || cached.expiresAt <= Date.now()) {
    return null;
  }

  return cached.url;
}

export async function getSignedPatientFileUrl(
  key: string,
  expiresInSeconds = 3600,
) {
  const cached = peekCachedPatientFileUrl(key);

  if (cached) {
    return cached;
  }

  const pending = signedUrlInflight.get(key);

  if (pending) {
    return pending;
  }

  const request = supabase.storage
    .from(PATIENT_FILES_BUCKET)
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

export async function uploadPatientFileObject(
  key: string,
  blob: Blob,
  contentType: string,
  onProgress?: (progress: number) => void,
) {
  const { data, error } = await supabase.storage
    .from(PATIENT_FILES_BUCKET)
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

export async function removePatientFileObject(key: string) {
  const { error } = await supabase.storage
    .from(PATIENT_FILES_BUCKET)
    .remove([key]);

  if (error) {
    throw error;
  }

  signedUrlCache.delete(key);
}
