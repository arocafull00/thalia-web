import imageCompression from "browser-image-compression";

export async function compressAvatarImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.9,
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

export async function getImageDimensions(file: File | Blob) {
  const bitmap = await createImageBitmap(file);

  try {
    return { width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close();
  }
}
