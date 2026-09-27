import { Slide, TextProperties, ShapeProperties, ImageProperties } from '../types';

export async function renderSlideToCanvas(slide: Slide): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = slide.width && slide.width > 50 ? slide.width : 1080;
  const height = slide.height && slide.height > 50 ? slide.height : 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Draw Background
  if (slide.background.type === 'solid') {
    const bgVal = slide.background.value || '#FFFFFF';
    if (bgVal.includes('gradient')) {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1A6099');
      grad.addColorStop(1, '#A2C8EC');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bgVal;
    }
    ctx.fillRect(0, 0, width, height);
  } else if (slide.background.type === 'image' && slide.background.value) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
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
      ctx.fillStyle = p.fill || '#111111';
      if (p.shapeType === 'circle') {
        ctx.beginPath();
        ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (p.stroke && p.strokeWidth) {
          ctx.strokeStyle = p.stroke;
          ctx.lineWidth = p.strokeWidth;
          ctx.stroke();
        }
      } else {
        const r = p.borderRadius || 0;
        ctx.beginPath();
        if (r > 0 && typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(el.x, el.y, el.width, el.height, r);
        } else {
          ctx.rect(el.x, el.y, el.width, el.height);
        }
        ctx.fill();
        if (p.stroke && p.strokeWidth) {
          ctx.strokeStyle = p.stroke;
          ctx.lineWidth = p.strokeWidth;
          ctx.stroke();
        }
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
            if (r > 0 && typeof (ctx as any).roundRect === 'function') {
              ctx.beginPath();
              (ctx as any).roundRect(el.x, el.y, el.width, el.height, r);
              ctx.clip();
            }
            ctx.drawImage(img, el.x, el.y, el.width, el.height);
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
      const fontWeight = p.fontWeight || 700;
      const fontFamily = p.fontFamily || 'Inter';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, -apple-system, sans-serif`;
      ctx.fillStyle = p.color || '#111111';
      ctx.textBaseline = 'top';

      const lines = (p.text || '').split('\n');
      const lineHeight = fontSize * (p.lineHeight || 1.25);
      let curY = el.y;

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
        ctx.fillText(line, curX, curY);
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
