// src/lib/deconstructSlide.ts
// Client service that calls the backend /deconstruct-slide endpoint
// and parses the AI vision response into genuine editable SWAPP.AI Slide and CanvasElements.

import { Slide, CanvasElement, TextProperties, ShapeProperties, ImageProperties } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface DeconstructResult {
  slide: Slide;
  detectedTextCount: number;
  detectedShapeCount: number;
  backgroundColor: string;
  summary: string;
}

/**
 * Verify Gemini API key connectivity through backend endpoint
 */
export async function verifyGeminiConnection(): Promise<{ ok: boolean; model?: string; reply?: string; error?: string }> {
  try {
    const res = await fetch('/api/test-gemini');
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network request failed' };
  }
}

/**
 * Converts a File or Blob into base64 data string
 */
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Deconstructs an uploaded slide image into a genuinely editable Slide object
 */
export async function deconstructSlideImage(
  fileOrBase64: File | string,
  slideIndex: number,
  fallbackPreviewUrl?: string
): Promise<DeconstructResult> {
  let base64String = '';
  let mimeType = 'image/png';

  if (typeof fileOrBase64 === 'string') {
    base64String = fileOrBase64;
    if (base64String.startsWith('data:image/jpeg')) mimeType = 'image/jpeg';
    if (base64String.startsWith('data:image/webp')) mimeType = 'image/webp';
  } else {
    base64String = await fileToBase64(fileOrBase64);
    mimeType = fileOrBase64.type || 'image/png';
  }

  // Call the backend endpoint
  const response = await fetch('/api/deconstruct-slide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: base64String,
      mimeType,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Deconstruction request failed with status ${response.status}`);
  }

  const result = await response.json();
  const slideId = `slide_${uuidv4().slice(0, 8)}`;

  // Parse background
  const bgType = result.background?.type === 'image' ? 'image' : 'solid';
  const bgValue = result.background?.value || '#11100E';

  // Parse elements into CanvasElement[]
  const rawElements: any[] = Array.isArray(result.elements) ? result.elements : [];
  const canvasElements: CanvasElement[] = [];

  let textCount = 0;
  let shapeCount = 0;

  rawElements.forEach((raw, i) => {
    const elId = `el_${uuidv4().slice(0, 8)}`;
    const x = typeof raw.x === 'number' ? Math.max(0, Math.min(1080, raw.x)) : 60;
    const y = typeof raw.y === 'number' ? Math.max(0, Math.min(1350, raw.y)) : 100 * (i + 1);
    const width = typeof raw.width === 'number' ? Math.max(20, Math.min(1080, raw.width)) : 960;
    const height = typeof raw.height === 'number' ? Math.max(10, Math.min(1350, raw.height)) : 100;
    const zIndex = typeof raw.zIndex === 'number' ? raw.zIndex : i + 1;

    if (raw.type === 'shape') {
      shapeCount++;
      const sp = raw.properties || {};
      const shapeElement: CanvasElement = {
        id: elId,
        type: 'shape',
        x,
        y,
        width,
        height,
        rotation: 0,
        opacity: 1,
        zIndex,
        locked: false,
        visible: true,
        properties: {
          shapeType: (sp.shapeType as any) || 'rectangle',
          fill: sp.fill || '#FF5A00',
          stroke: sp.stroke || undefined,
          strokeWidth: sp.strokeWidth || undefined,
          borderRadius: sp.borderRadius || 0,
        } as ShapeProperties,
      };
      canvasElements.push(shapeElement);
    } else if (raw.type === 'image') {
      const ip = raw.properties || {};
      const imgElement: CanvasElement = {
        id: elId,
        type: 'image',
        x,
        y,
        width,
        height,
        rotation: 0,
        opacity: 1,
        zIndex,
        locked: false,
        visible: true,
        properties: {
          src: ip.src || fallbackPreviewUrl || '',
          alt: ip.alt || '',
          objectFit: ip.objectFit || 'cover',
          borderRadius: ip.borderRadius || 0,
        } as ImageProperties,
      };
      canvasElements.push(imgElement);
    } else {
      // Default to text
      textCount++;
      const tp = raw.properties || {};
      const textElement: CanvasElement = {
        id: elId,
        type: 'text',
        x,
        y,
        width,
        height,
        rotation: 0,
        opacity: 1,
        zIndex,
        locked: false,
        visible: true,
        properties: {
          text: tp.text || raw.text || 'Editable Text',
          fontFamily: tp.fontFamily || 'Inter',
          fontSize: typeof tp.fontSize === 'number' ? tp.fontSize : 48,
          fontWeight: typeof tp.fontWeight === 'number' ? tp.fontWeight : 700,
          color: tp.color || '#F7F5F0',
          alignment: tp.alignment || 'left',
          letterSpacing: tp.letterSpacing || 0,
          lineHeight: tp.lineHeight || 1.2,
          textCase: tp.textCase || 'none',
        } as TextProperties,
      };
      canvasElements.push(textElement);
    }
  });

  const constructedSlide: Slide = {
    id: slideId,
    order: slideIndex,
    width: 1080,
    height: 1350,
    background: {
      type: bgType,
      value: bgValue,
    },
    elements: canvasElements,
    previewUrl: fallbackPreviewUrl || (typeof fileOrBase64 === 'string' ? fileOrBase64 : undefined),
  };

  return {
    slide: constructedSlide,
    detectedTextCount: textCount,
    detectedShapeCount: shapeCount,
    backgroundColor: bgValue,
    summary: `Reconstructed ${textCount} text layers & ${shapeCount} shapes on ${bgValue} background`,
  };
}
