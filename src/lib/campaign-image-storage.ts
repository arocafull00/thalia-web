import { supabase } from "@/lib/supabase";

export const CAMPAIGN_IMAGES_BUCKET = "campaign-images";

export const CAMPAIGN_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

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
  const key = buildCampaignImageKey(clinicId, extensionFromMimeType(file.type));

  const { error } = await supabase.storage
    .from(CAMPAIGN_IMAGES_BUCKET)
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(error.message);
  }

  return key;
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
