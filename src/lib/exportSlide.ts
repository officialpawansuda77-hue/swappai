import { Slide, TextProperties, ShapeProperties, ImageProperties } from '../types';
import { ensureFontsLoaded } from './googleFonts';

// ─── CSS GRADIENT → CANVAS HELPERS ───────────────────────────────────────────

/** Split a string by commas that are not inside parentheses. */
function splitTopLevel(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of input) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

const SIDE_ANGLES: Record<string, number> = {
  'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270,
  'to top right': 45, 'to right top': 45,
  'to bottom right': 135, 'to right bottom': 135,
  'to bottom left': 225, 'to left bottom': 225,
  'to top left': 315, 'to left top': 315,
};

function addStops(grad: CanvasGradient, stops: string[]) {
  const parsed = stops.map(s => {
    const m = s.match(/^(.*?)(?:\s+(-?[\d.]+)%)?$/);
    return { color: (m?.[1] || s).trim(), pos: m?.[2] !== undefined ? parseFloat(m[2]) / 100 : undefined };
  });
  parsed.forEach((p, i) => {
    const pos = p.pos !== undefined ? p.pos : parsed.length === 1 ? 0 : i / (parsed.length - 1);
    try {
      grad.addColorStop(Math.min(1, Math.max(0, pos)), p.color);
    } catch {
      /* ignore invalid color stop */
    }
  });
}

/** Build a canvas fill (color or gradient) for one CSS background layer. */
function layerToFill(
  ctx: CanvasRenderingContext2D,
  layer: string,
  x: number, y: number, w: number, h: number
): string | CanvasGradient {
  const m = layer.match(/^(repeating-)?(linear|radial)-gradient\(([\s\S]*)\)$/);
  if (!m) return layer;

  const kind = m[2];
  const parts = splitTopLevel(m[3]);

  if (kind === 'linear') {
    let angle = 180;
    const first = parts[0];
    if (/^-?[\d.]+deg$/.test(first)) {
      angle = parseFloat(first);
      parts.shift();
    } else if (first.startsWith('to ')) {
      angle = SIDE_ANGLES[first] ?? 180;
      parts.shift();
    }
    const rad = (angle * Math.PI) / 180;
    const len = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    const cx = x + w / 2;
    const cy = y + h / 2;
    const dx = (Math.sin(rad) * len) / 2;
    const dy = (-Math.cos(rad) * len) / 2;
    const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    addStops(grad, parts);
    return grad;
  }

  // radial
  let px = x + w / 2;
  let py = y + h / 2;
  const first = parts[0];
  if (/circle|ellipse|closest|farthest|^at\s/.test(first)) {
    const at = first.match(/at\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    if (at) {
      px = x + (parseFloat(at[1]) / 100) * w;
      py = y + (parseFloat(at[2]) / 100) * h;
    }
    parts.shift();
  }
  const r = Math.max(
    Math.hypot(px - x, py - y),
    Math.hypot(px - (x + w), py - y),
    Math.hypot(px - x, py - (y + h)),
    Math.hypot(px - (x + w), py - (y + h))
  );
  const grad = ctx.createRadialGradient(px, py, 0, px, py, r || 1);
  addStops(grad, parts);
  return grad;
}

/** Paint a CSS background value (solid, gradient, or layered gradients) into a path. */
function paintFill(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number, y: number, w: number, h: number,
  drawPath: () => void
) {
  const layers = value.includes('gradient') ? splitTopLevel(value) : [value];
  // CSS paints the first layer on top, so draw in reverse
  for (let i = layers.length - 1; i >= 0; i--) {
    ctx.fillStyle = layerToFill(ctx, layers[i], x, y, w, h);
    drawPath();
    ctx.fill();
  }
}

function quoteFont(family: string): string {
  return family
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
    .map(f => (/\s/.test(f) && !/^["']/.test(f) ? `"${f}"` : f))
    .join(', ');
}

/** Wrap text like the DOM does (pre-wrap + break-word) inside maxWidth. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    if (!para) { out.push(''); continue; }
    const words = para.split(/(\s+)/);
    let line = '';
    for (const word of words) {
      const test = line + word;
      if (ctx.measureText(test).width <= maxWidth || !line.trim()) {
        line = test;
        // break a single overly-long word
        while (ctx.measureText(line).width > maxWidth && line.length > 1) {
          let cut = line.length - 1;
          while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > maxWidth) cut--;
          out.push(line.slice(0, cut));
          line = line.slice(cut);
        }
      } else {
        out.push(line.trimEnd());
        line = word.trimStart();
      }
    }
    out.push(line.trimEnd());
  }
  return out;
}

/** Preload the exact weight/italic specs used on a slide so canvas never falls back. */
async function ensureCanvasFontSpecs(slide: Slide) {
  if (typeof document === 'undefined' || !(document as any).fonts) return;
  const specs = new Set<string>();
  for (const el of slide.elements) {
    if (el.type !== 'text') continue;
    const p = el.properties as TextProperties;
    specs.add(`${p.fontStyle === 'italic' ? 'italic ' : ''}${p.fontWeight || 400} 32px ${quoteFont(p.fontFamily || 'Inter')}`);
  }
  try {
    await Promise.all([...specs].map(s => (document as any).fonts.load(s)));
  } catch {
    /* fonts are best-effort */
  }
}

// ─── MAIN RENDERER ───────────────────────────────────────────────────────────

export async function renderSlideToCanvas(slide: Slide): Promise<HTMLCanvasElement> {
  // Make sure Google Fonts used by text elements are loaded before drawing,
  // otherwise canvas falls back to a system font in the export.
  const families = slide.elements
    .filter((el) => el.type === 'text')
    .map((el) => (el.properties as TextProperties).fontFamily || 'Inter');
  await ensureFontsLoaded(families);

  const canvas = document.createElement('canvas');
  const width = slide.width && slide.width > 50 ? slide.width : 1080;
  const height = slide.height && slide.height > 50 ? slide.height : 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  await ensureCanvasFontSpecs(slide);

  // 1. Draw Background
  if (slide.background.type === 'solid') {
    const bgVal = slide.background.value || '#FFFFFF';
    paintFill(ctx, bgVal, 0, 0, width, height, () => {
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
    });
  } else if (slide.background.type === 'image' && slide.background.value) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // emulate background-size: cover
        const s = Math.max(width / img.width, height / img.height);
        const dw = img.width * s;
        const dh = img.height * s;
        ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
        resolve();
      };
      img.onerror = () => {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);
        resolve();
      };
      img.src = slide.background.value;
    });
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Sorted Elements
  const sorted = [...slide.elements].filter(e => e.visible).sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sorted) {
    ctx.save();
    ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;

    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.translate(-cx, -cy);

    if (el.type === 'shape') {
      const p = el.properties as ShapeProperties;
      const r = p.shapeType === 'circle' || p.shapeType === 'line' ? 0 : p.borderRadius || 0;
      const drawPath = () => {
        ctx.beginPath();
        if (p.shapeType === 'circle') {
          ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
        } else if (r > 0 && typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(el.x, el.y, el.width, el.height, Math.min(r, el.width / 2, el.height / 2));
        } else {
          ctx.rect(el.x, el.y, el.width, el.height);
        }
      };
      paintFill(ctx, p.fill || '#111111', el.x, el.y, el.width, el.height, drawPath);
      if (p.stroke && p.strokeWidth) {
        // DOM borders sit inside the box (border-box), so inset the stroke
        const sw = p.strokeWidth;
        ctx.beginPath();
        if (p.shapeType === 'circle') {
          ctx.ellipse(cx, cy, Math.max(0, el.width / 2 - sw / 2), Math.max(0, el.height / 2 - sw / 2), 0, 0, Math.PI * 2);
        } else if (r > 0 && typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(el.x + sw / 2, el.y + sw / 2, el.width - sw, el.height - sw, Math.max(0, r - sw / 2));
        } else {
          ctx.rect(el.x + sw / 2, el.y + sw / 2, el.width - sw, el.height - sw);
        }
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = sw;
        ctx.stroke();
      }
    } else if (el.type === 'image') {
      const p = el.properties as ImageProperties;
      if (p.src) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            const r = p.borderRadius || 0;
            ctx.beginPath();
            if (r > 0 && typeof (ctx as any).roundRect === 'function') {
              (ctx as any).roundRect(el.x, el.y, el.width, el.height, r);
            } else {
              ctx.rect(el.x, el.y, el.width, el.height);
            }
            ctx.clip();
            const fit = p.objectFit || 'cover';
            if (fit === 'fill') {
              ctx.drawImage(img, el.x, el.y, el.width, el.height);
            } else {
              const s = fit === 'contain'
                ? Math.min(el.width / img.width, el.height / img.height)
                : Math.max(el.width / img.width, el.height / img.height);
              const dw = img.width * s;
              const dh = img.height * s;
              ctx.drawImage(img, el.x + (el.width - dw) / 2, el.y + (el.height - dh) / 2, dw, dh);
            }
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = p.src;
        });
      }
    } else if (el.type === 'text') {
      const p = el.properties as TextProperties;
      const fontSize = p.fontSize || 32;
      const fontWeight = p.fontWeight || 400;
      const fontFamily = quoteFont(p.fontFamily || 'Inter');
      const fontStyle = p.fontStyle === 'italic' ? 'italic ' : '';
      ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}, -apple-system, sans-serif`;
      ctx.fillStyle = p.color || '#111111';
      ctx.textBaseline = 'top';
      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${p.letterSpacing || 0}px`;
      }

      let text = p.text || '';
      if (p.textCase === 'uppercase') text = text.toUpperCase();
      if (p.textCase === 'lowercase') text = text.toLowerCase();

      // clip to the element box like the DOM's overflow: hidden
      ctx.beginPath();
      ctx.rect(el.x, el.y, el.width, el.height);
      ctx.clip();

      const lines = wrapLines(ctx, text, el.width);
      const lineHeight = fontSize * (p.lineHeight || 1.3);
      // DOM places half-leading above each line's glyphs
      let curY = el.y + (lineHeight - fontSize) / 2;

      for (const line of lines) {
        let curX = el.x;
        if (p.alignment === 'center') {
          ctx.textAlign = 'center';
          curX = el.x + el.width / 2;
        } else if (p.alignment === 'right') {
          ctx.textAlign = 'right';
          curX = el.x + el.width;
        } else {
          ctx.textAlign = 'left';
        }
        if (p.strokeColor && p.strokeWidth && p.strokeWidth > 0) {
          // matches DOM -webkit-text-stroke + paint-order: stroke fill
          ctx.lineJoin = 'round';
          ctx.strokeStyle = p.strokeColor;
          ctx.lineWidth = p.strokeWidth;
          ctx.strokeText(line, curX, curY);
        }
        ctx.fillText(line, curX, curY);
        if (p.textDecoration === 'underline') {
          const w = ctx.measureText(line).width;
          const startX = p.alignment === 'center' ? curX - w / 2 : p.alignment === 'right' ? curX - w : curX;
          ctx.fillRect(startX, curY + fontSize * 1.02, w, Math.max(1, fontSize / 16));
        }
        curY += lineHeight;
      }
    }

    ctx.restore();
  }

  return canvas;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportSlideToFile(
  slide: Slide,
  filename: string,
  format: 'png' | 'jpg' | 'pdf' = 'png'
): Promise<void> {
  const canvas = await renderSlideToCanvas(slide);
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);
  downloadDataUrl(dataUrl, filename);
}

