import type { ImageMetadata } from 'astro';

// The key will be the path, the value is a promise returning the module
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpeg,jpg,png,gif,webp}');

export async function resolveImage(imagePath: string | undefined) {
  if (!imagePath) {
    console.warn('No image path provided');
    return null;
  }

  // 2. Check if the path from JSON exists in our glob imports
  if (!images[imagePath]) {
    console.error(`Image "${imagePath}" not found in src/assets/images. Check filename matches exactly.`);
    // Optional: Return a placeholder image here if you have one
    return null;
  }

  // 3. Resolve the promise and return the default export (the ImageMetadata)
  const img = await images[imagePath]();
  return img.default;
}
