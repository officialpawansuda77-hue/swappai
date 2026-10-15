// Fast, free, in-browser background removal with MODNet (Apache-2.0) via Transformers.js.
//
// - Model: Xenova/modnet, uint8-quantized (~7 MB, downloaded once, then cached by the browser).
// - Runs on the CPU (WebAssembly), so it works in every modern browser — no WebGPU needed.
//   Measured ~2 s per image on a MacBook (after the one-time model load).
// - MODNet is a *portrait* matting model: excellent for people, unreliable for products /
//   objects. For those, callers should use the server "HD" mode (see backgroundRemoval.ts).
// - @huggingface/transformers is dynamically imported so it stays out of the main bundle.
//
// Note: BiRefNet (general objects) was evaluated and rejected — on WebGPU it needs more
// storage buffers per shader (11–17) than many Macs/laptops expose (10), and it's 115 MB.

const MODEL_ID = 'Xenova/modnet';
const MAX_SIDE = 4096;

type StatusFn = (msg: string) => void;
type Segmenter = (input: unknown) => Promise<any>;

let segmenterPromise: Promise<Segmenter> | null = null;

/** True if this browser can run the in-browser model. */
export function canUseBrowserBgRemoval(): boolean {
  return typeof WebAssembly === 'object' && typeof document !== 'undefined';
}

function loadSegmenter(onStatus?: StatusFn): Promise<Segmenter> {
  if (segmenterPromise) return segmenterPromise;

  segmenterPromise = (async () => {
    onStatus?.('Loading background-removal model…');
    const tf = await import('@huggingface/transformers');
    tf.env.allowLocalModels = false;

    // Report download progress (one-time) in 20% steps.
    let lastStep = -1;
    const progress_callback = (p: any) => {
      if (p?.status !== 'progress' || !p.total || p.total < 1_000_000) return;
      const step = Math.floor((p.loaded / p.total) * 5) * 20;
      if (step > lastStep) {
        lastStep = step;
        onStatus?.(`Downloading AI model (one-time)… ${step}%`);
      }
    };

    const pipe = await tf.pipeline('background-removal', MODEL_ID, {
      device: 'wasm',
      dtype: 'uint8',
      progress_callback,
    });
    return pipe as unknown as Segmenter;
  })();

  // If loading fails, allow a retry next time instead of caching the failure.
  segmenterPromise.catch(() => { segmenterPromise = null; });
  return segmenterPromise;
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the image.'));
    img.src = src;
  });
}

async function canvasToDataUrl(canvas: HTMLCanvasElement | OffscreenCanvas): Promise<string> {
  if ('toDataURL' in canvas) return canvas.toDataURL('image/png');
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the result.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Remove the background in the browser. `src` may be a data URL or a CORS-enabled URL.
 * Returns a transparent PNG data URL. Throws on any failure (caller decides on fallback).
 */
export async function removeBackgroundInBrowser(src: string, onStatus?: StatusFn): Promise<string> {
  const segment = await loadSegmenter(onStatus);
  onStatus?.('Removing background…');

  // Draw onto a (size-capped) canvas first so huge uploads can't exhaust memory.
  const img = await loadHtmlImage(src);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const result = await segment(canvas.toDataURL('image/png'));
  const output = Array.isArray(result) ? result[0] : result;
  return canvasToDataUrl(output.toCanvas());
}
