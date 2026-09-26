import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SlideUploadItem } from '../types';

export function useToast() {
  // Simple callback-based toast; lifted up to page level
}

// ---- IMAGE VALIDATION -------------------------------------------------------

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
  warning?: string;
}

export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (!ALLOWED.includes(file.type)) {
    return { valid: false, error: `Unsupported format: ${file.type}. Use PNG, JPG, or WEBP.` };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max 10MB.` };
  }

  // Get dimensions
  const dims = await getImageDimensions(file);
  const warning =
    dims.width !== 1080 || dims.height !== 1350
      ? `Slide is ${dims.width}×${dims.height}px. SWAPP recommends 1080×1350 (4:5) for Instagram.`
      : undefined;

  return { valid: true, width: dims.width, height: dims.height, warning };
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

// ---- READ FILE AS DATA URL --------------------------------------------------

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---- CREATE SLIDE UPLOAD ITEMS ---------------------------------------------

export async function createSlideUploadItems(
  files: File[],
  existingCount: number,
  maxSlides: number = 20
): Promise<{ items: SlideUploadItem[]; skipped: number; errors: string[] }> {
  const available = maxSlides - existingCount;
  const toProcess = files.slice(0, available);
  const skipped = Math.max(0, files.length - available);

  const items: SlideUploadItem[] = [];
  const errors: string[] = [];

  for (const file of toProcess) {
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
      continue;
    }

    const dataUrl = await readFileAsDataUrl(file);
    items.push({
      localId: uuidv4(),
      file,
      previewDataUrl: dataUrl,
      status: 'pending',
      width: validation.width,
      height: validation.height,
    });
  }

  return { items, skipped, errors };
}

// ---- TAG INPUT HELPER -------------------------------------------------------

export function parseTags(raw: string): string[] {
  return raw
    .split(/[,\n\s]+/)
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i);
}

// ---- STEP PROGRESS ----------------------------------------------------------

export const WIZARD_STEPS = [
  { id: 'source',  label: '01 Source' },
  { id: 'slides',  label: '02 Slides' },
  { id: 'details', label: '03 Details' },
  { id: 'review',  label: '04 Review' },
  { id: 'publish', label: '05 Publish' },
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number]['id'];

// ---- FORMAT HELPERS ---------------------------------------------------------

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
