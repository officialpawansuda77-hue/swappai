// Client for the self-hosted rembg background-removal service.
// Configure via VITE_BG_REMOVAL_API_URL (+ optional VITE_BG_REMOVAL_API_KEY).
// If not configured, removeImageBackground throws a user-friendly error.

const API_URL = (
  import.meta.env.VITE_BG_REMOVAL_API_URL as string | undefined
)?.replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_BG_REMOVAL_API_KEY as string | undefined;

export function isBgRemovalConfigured(): boolean {
  return !!API_URL;
}

export class BgRemovalError extends Error {}

async function srcToBlob(src: string): Promise<Blob> {
  if (src.startsWith('data:')) {
    const res = await fetch(src);
    return await res.blob();
  }
  // Remote URL (e.g. starter images) — needs CORS; images.unsplash.com allows it.
  const res = await fetch(src, { mode: 'cors' });
  if (!res.ok) throw new BgRemovalError('Could not download the image.');
  return await res.blob();
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new BgRemovalError('Could not read the result.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Remove the background of an image. `src` may be a data URL or a remote URL.
 * Returns a PNG data URL with transparency. Throws BgRemovalError on failure.
 */
export async function removeImageBackground(
  src: string,
  onStatus?: (msg: string) => void,
): Promise<string> {
  if (!API_URL) {
    throw new BgRemovalError(
      'Background removal is not set up yet. Add VITE_BG_REMOVAL_API_URL in Vercel environment variables.',
    );
  }

  onStatus?.('Preparing image…');
  let input: Blob;
  try {
    input = await srcToBlob(src);
  } catch {
    throw new BgRemovalError('Could not load the image. Try uploading it again.');
  }
  if (input.size > 12 * 1024 * 1024) {
    throw new BgRemovalError('Image is larger than 12MB.');
  }

  const form = new FormData();
  form.append('file', input, 'image.png');

  onStatus?.('Removing background…');
  let res: Response;
  try {
    res = await fetch(`${API_URL}/remove-bg`, {
      method: 'POST',
      headers: API_KEY ? { 'x-api-key': API_KEY } : {},
      body: form,
    });
  } catch {
    throw new BgRemovalError(
      'Could not reach the background-removal server. It may be waking up — try again in 30 seconds.',
    );
  }

  if (res.status === 401) throw new BgRemovalError('Server rejected the API key.');
  if (res.status === 413) throw new BgRemovalError('Image is too large.');
  if (!res.ok) throw new BgRemovalError('Background removal failed. Please try again.');

  onStatus?.('Done!');
  return blobToDataUrl(await res.blob());
}
