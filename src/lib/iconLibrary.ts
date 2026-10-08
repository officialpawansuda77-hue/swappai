/**
 * Icon library for the swappai editor.
 *
 * Free Iconify API — 200,000+ icons from 150+ sets (Material, Lucide,
 * Font Awesome, emojis…), no API key required.
 *   https://api.iconify.design
 */

const API_BASE = 'https://api.iconify.design';

/** Search icons by keyword. Returns icon ids like "mdi:home". */
export async function searchIcons(query: string, limit = 60): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(q)}&limit=${limit}`);
  } catch {
    throw new Error('Could not reach the icon library. Check your connection.');
  }
  if (!res.ok) throw new Error('Icon search failed — try again in a moment');
  const data = await res.json();
  return (data.icons || []) as string[];
}

/** Direct SVG URL for an icon, in any hex color. */
export function iconSvgUrl(iconId: string, color = '#FFFFFF'): string {
  return `${API_BASE}/${iconId}.svg?color=${encodeURIComponent(color)}`;
}

/**
 * Fetch the SVG and return it as a data URL so the icon is embedded
 * in the project (works in exports and offline).
 */
export async function iconToDataUrl(iconId: string, color: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(iconSvgUrl(iconId, color));
  } catch {
    throw new Error('Could not load icon. Check your connection.');
  }
  if (!res.ok) throw new Error('Could not load icon');
  const svg = await res.text();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read icon'));
    reader.readAsDataURL(blob);
  });
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

/** Quick color presets for icons. */
export const ICON_COLORS = [
  '#FFFFFF', '#000000', '#FF5A00', '#A855F7', '#3B82F6',
  '#22C55E', '#EAB308', '#EF4444', '#EC4899', '#6B7280',
];
