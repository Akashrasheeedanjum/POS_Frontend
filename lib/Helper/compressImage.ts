
export async function compressImageTo500KB(
  file: File,
  maxSizeKB: number = 500,
  maxWidth?: number,
  maxHeight?: number
): Promise<Blob> {
  // Helper to read file to Image
  function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Helper: Draw Image to Canvas
  function drawToCanvas(
    img: HTMLImageElement,
    maxWidth?: number,
    maxHeight?: number
  ): HTMLCanvasElement {
    let { width, height } = img;
    if (maxWidth && width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (maxHeight && height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    return canvas;
  }

  // Main compression loop
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, maxWidth, maxHeight);

  let quality = 0.85; // Start high, decrease if needed
  const minQuality = 0.4;
  let compressedBlob: Blob | null = null;

  while (quality >= minQuality) {
    compressedBlob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality)
    );
    if (compressedBlob && compressedBlob.size / 1024 <= maxSizeKB) {
      break;
    }
    quality -= 0.05; // decrease quality by 5%
  }

  if (!compressedBlob) {
    throw new Error('Compression failed: could not get image blob');
  }
  if (compressedBlob.size / 1024 > maxSizeKB) {
    console.warn(
      `Could not compress image below ${maxSizeKB}KB. Final size: ${(
        compressedBlob.size / 1024
      ).toFixed(1)}KB`
    );
  }

  return compressedBlob;
}