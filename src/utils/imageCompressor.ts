export async function compressImage(file: File, maxFileSizeMB: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Failed to get 2D context');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        while (base64.length / 1024 / 1024 > maxFileSizeMB && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        if (base64.length / 1024 / 1024 > maxFileSizeMB) {
          reject('Unable to compress image below 1MB');
        } else {
          resolve(base64);
        }
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
