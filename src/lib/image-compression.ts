const DEFAULT_MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

function getScaledDimensions(
  width: number,
  height: number,
  maxDimension: number,
) {
  const largestSide = Math.max(width, height);

  if (largestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / largestSide;

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export async function compressImageToBlob(
  file: File,
  maxDimension = DEFAULT_MAX_DIMENSION,
) {
  const bitmap = await createImageBitmap(file);
  const { width, height } = getScaledDimensions(
    bitmap.width,
    bitmap.height,
    maxDimension,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("No se pudo preparar la imagen");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("No se pudo comprimir la imagen"));
          return;
        }

        resolve(result);
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  return { blob, width, height };
}
