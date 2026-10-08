/**
 * Icon library for the swappai editor.
 *
 * Free Iconify API — 200,000+ icons from 150+ sets (Material, Lucide,
 * Font Awesome, emojis…), no API key required.
 *   https://api.iconify.design
 *
 * Reliability notes (v2):
 * - Fetches go through a concurrency-limited queue (max 8 in flight) so a
 *   60-icon grid doesn't trip Iconify rate limits.
 * - Each fetch has a 12s timeout (AbortController) and up to 2 retries with
 *   exponential backoff.
 * - ONLY successful thumbnails are cached. Failures are never cached, so a
 *   transient network blip doesn't permanently blank an icon.
 */

const API_BASE = 'https://api.iconify.design';
const FETCH_TIMEOUT_MS = 12000;
const MAX_RETRIES = 2;
const MAX_CONCURRENT = 8;

/** Simple concurrency limiter for outbound icon fetches. */
class FetchQueue {
  private active = 0;
  private waiting: Array<() => void> = [];

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= MAX_CONCURRENT) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this.active++;
    try {
      return await fn();
    } finally {
      this.active--;
      const next = this.waiting.shift();
      if (next) next();
    }
  }
}

const fetchQueue = new FetchQueue();

async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetchQueue.run(() =>
      fetch(url, { signal: controller.signal })
    );
    if (!res.ok) {
      // Retry on rate-limit / server errors, not on 404s.
      if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
        await new Promise((r) =>
          window.setTimeout(r, 600 * Math.pow(2, attempt))
        );
        return fetchWithRetry(url, attempt + 1);
      }
      throw new Error(`Icon request failed (${res.status})`);
    }
    return res;
  } catch (err) {
    if (attempt < MAX_RETRIES && (err instanceof DOMException
      ? err.name === 'AbortError'
      : err instanceof TypeError)) {
      // Network error or timeout — retry with backoff.
      await new Promise((r) =>
        window.setTimeout(r, 600 * Math.pow(2, attempt))
      );
      return fetchWithRetry(url, attempt + 1);
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Colorful / 3D icon collections on Iconify (verified via /collections). */
export const COLORFUL_SETS: string[] = [
  'noto', // Noto Emoji — 3.7k colorful emoji
  'twemoji', // Twitter Emoji — 4k colorful emoji
  'openmoji', // OpenMoji — 4.5k colorful emoji
  'fluent-emoji', // Fluent Emoji 3D — 3.1k
  'fluent-emoji-flat', // Fluent Emoji Flat — 3.1k
  'fluent-emoji-high-contrast',
  'streamline-emojis', // Streamline Emojis — 787
  'flat-color-icons', // Flat Color Icons — 329
  'icon-park', // IconPark — 2.6k (has colorful variants)
  'emojione',
];

export function isColorfulIcon(iconId: string): boolean {
  const prefix = iconId.split(':')[0];
  return COLORFUL_SETS.includes(prefix);
}

/**
 * Search icons by keyword. Returns icon ids like "mdi:home".
 * Pass `prefixes` to scope the search (e.g. colorful sets only).
 */
export async function searchIcons(
  query: string,
  limit = 60,
  prefixes?: string[]
): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];
  let url = `${API_BASE}/search?query=${encodeURIComponent(q)}&limit=${limit}`;
  if (prefixes && prefixes.length > 0) {
    url += `&prefixes=${prefixes.map(encodeURIComponent).join(',')}`;
  }
  let res: Response;
  try {
    res = await fetchWithRetry(url);
  } catch {
    throw new Error('Could not reach the icon library. Check your connection.');
  }
  const data = await res.json();
  return (data.icons || []) as string[];
}

/**
 * Direct SVG URL for an icon.
 * For colorful/3D icons the color is NOT forced — original colors are kept.
 */
export function iconSvgUrl(iconId: string, color?: string): string {
  if (!color || isColorfulIcon(iconId)) {
    return `${API_BASE}/${iconId}.svg`;
  }
  return `${API_BASE}/${iconId}.svg?color=${encodeURIComponent(color)}`;
}

/**
 * Fetch the SVG and return it as a data URL so the icon is embedded
 * in the project (works in exports and offline).
 */
export async function iconToDataUrl(
  iconId: string,
  color?: string
): Promise<string> {
  let res: Response;
  try {
    res = await fetchWithRetry(iconSvgUrl(iconId, color));
  } catch {
    throw new Error('Could not load icon. Check your connection.');
  }
  const svg = await res.text();
  if (!svg.includes('<svg')) throw new Error('Invalid icon data');
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read icon'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Thumbnail loader for the icon grid. Loads via fetch — the same path as
 * search, which is more reliable than hotlinking <img> on some mobile
 * networks. Only successful results are cached; failures resolve to ''
 * (never cached) so the grid can retry on re-render instead of showing a
 * permanent blank.
 */
const thumbCache = new Map<string, Promise<string>>();

export function iconThumbUrl(iconId: string, color?: string): Promise<string> {
  const key = `${iconId}|${color || 'original'}`;
  const hit = thumbCache.get(key);
  if (hit) return hit;
  const p = iconToDataUrl(iconId, color)
    .then((url) => {
      // Cache the resolved value for instant reuse.
      thumbCache.set(key, Promise.resolve(url));
      return url;
    })
    .catch(() => {
      // Do NOT cache failures — allow retry on next render.
      thumbCache.delete(key);
      return '';
    });
  // Temporarily hold the in-flight promise so concurrent renders share it.
  thumbCache.set(key, p);
  if (thumbCache.size > 500) {
    const oldest = thumbCache.keys().next().value;
    if (oldest !== undefined) thumbCache.delete(oldest);
  }
  return p;
}

/** Clear cached thumbnails (e.g. after a network recovery). */
export function clearIconThumbCache(): void {
  thumbCache.clear();
}

/** "mdi:arrow-up-right" -> "arrow up right" */
export function prettyName(iconId: string): string {
  const name = iconId.split(':')[1] || iconId;
  return name.replace(/-/g, ' ');
}

/** Curated starter set shown before the first search. */
export const DEFAULT_ICONS: string[] = [
  'mdi:arrow-right', 'mdi:arrow-up-right', 'mdi:trending-up', 'mdi:rocket',
  'mdi:instagram', 'mdi:youtube', 'mdi:linkedin', 'mdi:facebook', 'mdi:whatsapp', 'mdi:twitter',
  'mdi:check', 'mdi:close', 'mdi:plus', 'mdi:star', 'mdi:heart', 'mdi:lightbulb',
  'mdi:briefcase', 'mdi:currency-inr', 'mdi:chart-line', 'mdi:target',
  'mdi:phone', 'mdi:email', 'mdi:map-marker', 'mdi:clock',
  'mdi:play', 'mdi:crown', 'mdi:fire', 'mdi:thumb-up',
  'mdi:account-group', 'mdi:gift', 'mdi:bell', 'mdi:quote-open',
];

/** Curated 3D & colorful starter set (original colors preserved). */
export const COLORFUL_DEFAULT_ICONS: string[] = [
  'noto:rocket', 'noto:fire', 'noto:star', 'noto:party-popper',
  'noto:light-bulb', 'noto:money-bag', 'noto:chart-increasing', 'noto:trophy',
  'twemoji:rocket', 'twemoji:fire', 'twemoji:star', 'twemoji:camera',
  'fluent-emoji-flat:rocket', 'fluent-emoji-flat:party-popper', 'fluent-emoji-flat:money-bag', 'fluent-emoji-flat:trophy',
  'flat-color-icons:like', 'flat-color-icons:idea', 'flat-color-icons:shop',
  'openmoji:rocket', 'openmoji:fire', 'openmoji:star',
  'streamline-emojis:rocket', 'streamline-emojis:money-bag',
];

/** Quick color presets for icons. */
export const ICON_COLORS = [
  '#FFFFFF', '#000000', '#FF5A00', '#A855F7', '#3B82F6',
  '#22C55E', '#EAB308', '#EF4444', '#EC4899', '#6B7280',
];
