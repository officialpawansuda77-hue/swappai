/**
 * Google Fonts integration for the swappai editor.
 *
 * Google Fonts are SIL Open Font License (OFL) — free for commercial use,
 * safe to load and bundle. https://fonts.google.com
 *
 * - POPULAR_FONTS: curated, categorized starter list (instant, offline-safe).
 * - fetchGoogleFonts(): full searchable catalog via the google-webfonts-helper
 *   mirror (no API key needed). Falls back to POPULAR_FONTS on failure.
 * - loadGoogleFont(): injects the css2 <link> on demand, cached per family.
 * - ensureFontsLoaded(): call before canvas export so PNG/JPG renders use
 *   the real typeface instead of a fallback.
 */

export interface GoogleFont {
  family: string;
  category: 'sans' | 'serif' | 'display' | 'handwriting' | 'mono';
}

const CURATED: string[] = [
  // Sans — workhorses
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito',
  'Raleway', 'Ubuntu', 'Work Sans', 'DM Sans', 'Manrope', 'Plus Jakarta Sans',
  'Outfit', 'Lexend', 'Public Sans', 'Figtree', 'Sora', 'Space Grotesk',
  // Display — headlines
  'Bebas Neue', 'Oswald', 'Anton', 'Archivo Black', 'Bricolage Grotesque',
  'Clash Display', 'Unbounded', 'Syne', 'Zilla Slab',
  // Serif — editorial
  'Playfair Display', 'Merriweather', 'Lora', 'PT Serif', 'Cormorant Garamond',
  'DM Serif Display', 'Instrument Serif', 'Libre Baskerville',
  // Handwriting — accents
  'Caveat', 'Pacifico', 'Dancing Script', 'Satisfy', 'Shadows Into Light',
  // Mono
  'JetBrains Mono', 'Space Mono', 'IBM Plex Mono', 'Roboto Mono',
];

function guessCategory(family: string): GoogleFont['category'] {
  const f = family.toLowerCase();
  if (/(bebas|oswald|anton|archivo black|bricolage|unbounded|syne|zilla)/.test(f)) return 'display';
  if (/(playfair|merriweather|lora|pt serif|cormorant|dm serif|instrument serif|baskerville)/.test(f)) return 'serif';
  if (/(caveat|pacifico|dancing|satisfy|shadows)/.test(f)) return 'handwriting';
  if (/(mono)/.test(f)) return 'mono';
  return 'sans';
}

export const POPULAR_FONTS: GoogleFont[] = CURATED.map((family) => ({
  family,
  category: guessCategory(family),
}));

/** System fonts that were in the old picker — kept for compatibility. */
export const SYSTEM_FONTS: GoogleFont[] = [
  { family: 'Arial', category: 'sans' },
  { family: 'Helvetica', category: 'sans' },
  { family: 'Georgia', category: 'serif' },
  { family: 'Times New Roman', category: 'serif' },
];

const SYSTEM_SET = new Set(SYSTEM_FONTS.map((f) => f.family.toLowerCase()));

let fullListCache: GoogleFont[] | null = null;
let fullListPromise: Promise<GoogleFont[]> | null = null;

/**
 * Full Google Fonts catalog (~1,500 families), sorted by popularity.
 * Uses the google-webfonts-helper mirror — no API key required.
 */
export function fetchGoogleFonts(): Promise<GoogleFont[]> {
  if (fullListCache) return Promise.resolve(fullListCache);
  if (fullListPromise) return fullListPromise;
  fullListPromise = (async () => {
    try {
      const res = await fetch('https://gwfh.mranftl.com/api/fonts');
      if (!res.ok) throw new Error('font list failed');
      const data: Array<{ family: string; category: string }> = await res.json();
      const cat = (c: string): GoogleFont['category'] =>
        c === 'sans-serif' ? 'sans'
        : c === 'display' ? 'display'
        : c === 'handwriting' ? 'handwriting'
        : c === 'monospace' ? 'mono'
        : 'serif';
      // API returns popularity order already; drop system dupes.
      fullListCache = data
        .filter((f) => !SYSTEM_SET.has(f.family.toLowerCase()))
        .map((f) => ({ family: f.family, category: cat(f.category) }));
      return fullListCache;
    } catch {
      fullListCache = [...POPULAR_FONTS];
      return fullListCache;
    }
  })();
  return fullListPromise;
}

const loadedFonts = new Set<string>(['inter', 'manrope', 'instrument serif']);

/**
 * Load a Google Font on demand via the css2 API. Cached — loading the same
 * family twice is a no-op. Preloaded families (Inter, Manrope, Instrument
 * Serif from index.html) are skipped.
 */
export function loadGoogleFont(family: string, weights = '400;500;600;700;800'): Promise<void> {
  const key = family.toLowerCase();
  if (loadedFonts.has(key) || SYSTEM_SET.has(key)) return Promise.resolve();
  if (typeof document === 'undefined') return Promise.resolve();
  const id = `gf-${key.replace(/[^a-z0-9]+/g, '-')}`;
  if (document.getElementById(id)) {
    loadedFonts.add(key);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family.replace(/ /g, '+')
    )}:wght@${weights}&display=swap`;
    link.onload = () => {
      loadedFonts.add(key);
      resolve();
    };
    link.onerror = () => resolve(); // never block the UI on a font
    document.head.appendChild(link);
    // Safety: resolve anyway after 4s so a hung stylesheet can't stall.
    window.setTimeout(() => resolve(), 4000);
  });
}

/**
 * Ensure every family in the list is loaded AND ready for canvas use.
 * Call before renderSlideToCanvas so exports use the real typeface.
 */
export async function ensureFontsLoaded(families: string[]): Promise<void> {
  const unique = [...new Set(families.map((f) => (f || 'Inter').trim()))].filter(Boolean);
  await Promise.all(unique.map((f) => loadGoogleFont(f)));
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await Promise.all(
      unique.map((f) =>
        document.fonts
          .load(`700 32px "${f}"`)
          .catch(() => [])
      )
    );
  }
}

/** Preload the most-used families in the background (non-blocking). */
export function preloadPopularFonts(): void {
  const top = ['Poppins', 'Montserrat', 'Bebas Neue', 'Playfair Display', 'Oswald', 'Nunito'];
  // Stagger to avoid a burst of stylesheet requests.
  top.forEach((f, i) => {
    window.setTimeout(() => loadGoogleFont(f).catch(() => {}), 1500 + i * 800);
  });
}
