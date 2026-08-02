import imageCompression from "browser-image-compression";

export async function compressAvatarImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.75,
      maxWidthOrHeight: 768,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.92,
    });
  } catch (error) {
    console.error("Avatar compression failed, using original file:", error);
    return file;
  }
}

export async function compressTreatmentImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 1.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.92,
    });
  } catch (error) {
    console.error(
      "Treatment image compression failed, using original file:",
      error,
    );
    return file;
  }
}

/**
 * WhatsApp rechaza imágenes de más de 5 MB, así que en lugar de impedir subir
 * las grandes se comprimen a un tamaño que el envío acepte. El margen hasta el
 * límite real es amplio a propósito: WebP a 1600 px basta de sobra para lo que
 * se ve en un móvil.
 */
export async function compressCampaignImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.9,
    });
  } catch (error) {
    console.error(
      "Campaign image compression failed, using original file:",
      error,
    );
    return file;
  }
}

export async function getImageDimensions(file: File | Blob) {
  const bitmap = await createImageBitmap(file);

  try {
    return { width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close();
  }
}
