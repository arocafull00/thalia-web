import { compressCampaignImage } from "@/lib/image-compression";
import { supabase } from "@/lib/supabase";

export const CAMPAIGN_IMAGES_BUCKET = "campaign-images";

/**
 * La primera carpeta debe ser el clinic_id: es lo que comprueba la política de
 * storage. El resto de la ruta es libre, así que basta un uuid por imagen.
 */
export function buildCampaignImageKey(clinicId: string, ext: string) {
  return `${clinicId}/${crypto.randomUUID()}.${ext}`;
}

export function extensionFromMimeType(mimeType: string): string {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export async function uploadCampaignImage(
  clinicId: string,
  file: File,
): Promise<string> {
  // Se comprime antes de subir: sin esto una imagen grande se guardaría bien y
  // el envío fallaría después en Twilio, que rechaza imágenes de más de 5 MB.
  const compressed = await compressCampaignImage(file);
  const key = buildCampaignImageKey(
    clinicId,
    extensionFromMimeType(compressed.type),
  );

  const { error } = await supabase.storage
    .from(CAMPAIGN_IMAGES_BUCKET)
    .upload(key, compressed, {
      contentType: compressed.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return key;
}

/**
 * Copia el objeto en lugar de reutilizar la clave: si dos campañas apuntaran a
 * la misma imagen, borrar una dejaría a la otra sin adjunto.
 */
export async function copyCampaignImage(
  sourceKey: string,
  clinicId: string,
): Promise<string | null> {
  const extension = sourceKey.split(".").pop() ?? "jpg";
  const targetKey = buildCampaignImageKey(clinicId, extension);

  const { error } = await supabase.storage
    .from(CAMPAIGN_IMAGES_BUCKET)
    .copy(sourceKey, targetKey);

  if (error) {
    return null;
  }

  return targetKey;
}

export async function removeCampaignImage(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(CAMPAIGN_IMAGES_BUCKET)
    .remove([key]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCampaignImageUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(CAMPAIGN_IMAGES_BUCKET)
    .createSignedUrl(key, expiresInSeconds);

  if (error) {
    return null;
  }

  return data?.signedUrl ?? null;
}
