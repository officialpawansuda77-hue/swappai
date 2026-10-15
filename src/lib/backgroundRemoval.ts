// Background removal, two modes:
//  - 'fast' (default): free in-browser MODNet (~2 s, best for photos of people, see
//    browserBgRemoval.ts). Falls back to the server if the browser path fails.
//  - 'hd': self-hosted rembg server (better for products / objects / non-human subjects).
// Configure the server via VITE_BG_REMOVAL_API_URL (+ optional VITE_BG_REMOVAL_API_KEY).

import { canUseBrowserBgRemoval, removeBackgroundInBrowser } from './browserBgRemoval';

const API_URL = (
  import.meta.env.VITE_BG_REMOVAL_API_URL as string | undefined
)?.replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_BG_REMOVAL_API_KEY as string | undefined;

export type BgRemovalMode = 'fast' | 'hd';

export function isBgRemovalConfigured(): boolean {
  return !!API_URL;
}

/** True if the server (HD mode) is configured. */
export function isHdBgRemovalAvailable(): boolean {
  return !!API_URL;
}

let warmedUp = false;
/**
 * Fire-and-forget request that wakes the (free, sleep-on-idle) server early — e.g. when
 * the editor opens — so a later HD request doesn't wait for a cold start. Runs once per page.
 */
export function warmUpBgServer(): void {
  if (warmedUp || !API_URL) return;
  warmedUp = true;
  fetch(`${API_URL}/health`, { method: 'GET', mode: 'no-cors', cache: 'no-store' }).catch(() => {});
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
  mode: BgRemovalMode = 'fast',
): Promise<string> {
  if (mode === 'hd') return removeOnServer(src, onStatus);

  // Fast path: in-browser model (free, no server, no cold start).
  if (canUseBrowserBgRemoval()) {
    try {
      return await removeBackgroundInBrowser(src, onStatus);
    } catch (err) {
      console.warn('In-browser background removal failed, falling back to server:', err);
      if (!API_URL) {
        throw new BgRemovalError('Background removal failed. Please try again.');
      }
    }
  }

  // Fallback: self-hosted rembg server.
  return removeOnServer(src, onStatus);
}

async function removeOnServer(
  src: string,
  onStatus?: (msg: string) => void,
): Promise<string> {
  if (!API_URL) {
    throw new BgRemovalError(
      'HD background removal is not set up yet. Add VITE_BG_REMOVAL_API_URL in Vercel environment variables.',
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
