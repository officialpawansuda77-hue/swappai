/**
 * AI image generation for the swappai editor.
 *
 * Uses the free Pollinations.ai API (no key required):
 *   https://image.pollinations.ai/prompt/{prompt}?width=&height=&seed=&model=&nologo=true
 *
 * The generated image is returned as a data URL so it can be stored in the
 * uploads library (localStorage) exactly like an uploaded file.
 */

export interface AiImageOptions {
  width?: number;
  height?: number;
  model?: string;
  seed?: number;
}

/** Style presets appended to the user's prompt. */
export const STYLE_PRESETS: Record<string, string> = {
  Photorealistic: ', photorealistic, ultra detailed, professional photography, sharp focus, 8k',
  'Digital Art': ', digital art, vibrant colors, highly detailed illustration',
  '3D Render': ', 3d render, octane render, soft studio lighting, high quality',
  Minimalist: ', minimalist design, clean composition, simple, elegant',
  Anime: ', anime style, detailed, beautiful lighting',
  'None (raw prompt)': '',
};

/** Aspect ratio -> [width, height]. */
export const ASPECT_RATIOS: Record<string, [number, number]> = {
  '1:1': [1024, 1024],
  '4:5': [1024, 1280],
  '16:9': [1280, 720],
  '9:16': [720, 1280],
};

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read generated image'));
    reader.readAsDataURL(blob);
  });
}

export async function generateAiImage(
  prompt: string,
  opts: AiImageOptions = {},
): Promise<string> {
  const clean = prompt.trim();
  if (!clean) throw new Error('Please describe the image you want first');

  const {
    width = 1024,
    height = 1024,
    model = 'flux',
    seed = Math.floor(Math.random() * 1_000_000_000),
  } = opts;

  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}` +
    `?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Could not reach the image generator. Check your connection and try again.');
  }
  if (!res.ok) {
    throw new Error('Image generation failed — please try again in a moment');
  }
  const blob = await res.blob();
  if (!blob.type.startsWith('image/')) {
    throw new Error('Image generation failed — please try again in a moment');
  }
  return blobToDataURL(blob);
}
