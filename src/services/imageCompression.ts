/**
 * Image processing and compression utility for NEXUS quest photo proof.
 * Resizes images to manageable dimensions and compresses to JPEG to preserve localStorage quotas.
 */
export async function compressImage(fileOrBlob: File | Blob, maxWidth = 900, maxHeight = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileOrBlob);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(img.src);
          return;
        }

        // Draw clean image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64 JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Capture frame from an HTML5 video stream element into a compressed base64 string
 */
export function captureVideoFrame(videoElement: HTMLVideoElement, maxWidth = 900, maxHeight = 900, quality = 0.8): string | null {
  if (!videoElement || videoElement.videoWidth === 0) return null;

  let width = videoElement.videoWidth;
  let height = videoElement.videoHeight;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Handle potential horizontal mirroring if front camera
  ctx.drawImage(videoElement, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}
