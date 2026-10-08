import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import {
  GoogleFont, POPULAR_FONTS, SYSTEM_FONTS, fetchGoogleFonts, loadGoogleFont,
} from '../../lib/googleFonts';

interface FontPickerProps {
  value: string;
  onChange: (family: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  sans: 'Sans Serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  mono: 'Monospace',
  system: 'System',
};

/** A font row in the picker list — Google fonts plus the 'system' group. */
interface FontListItem {
  family: string;
  category: string;
}

/**
 * Searchable Google Fonts picker. Popular fonts first; the full catalog
 * (~1,500 families) loads in the background on first open. Each option is
 * rendered in its own typeface once the font file arrives.
 */
export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [fonts, setFonts] = useState<GoogleFont[]>(POPULAR_FONTS);
  const [loadingFull, setLoadingFull] = useState(false);
  const [previewReady, setPreviewReady] = useState<Set<string>>(new Set(['Inter', 'Manrope']));
  const wrapRef = useRef<HTMLDivElement>(null);
  const fullLoadedRef = useRef(false);

  // Load the currently selected font so the button label renders correctly.
  useEffect(() => {
    if (value) {
      loadGoogleFont(value).then(() => {
        setPreviewReady((prev) => new Set(prev).add(value));
      });
    }
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open ]);

  // Fetch the full catalog the first time the picker opens.
  useEffect(() => {
    if (!open || fullLoadedRef.current) return;
    fullLoadedRef.current = true;
    setLoadingFull(true);
    fetchGoogleFonts().then((all) => {
      setFonts(all);
      setLoadingFull(false);
    });
  }, [open ]);

  // Load preview typefaces for the visible popular list (staggered).
  useEffect(() => {
    if (!open) return;
    const popular = POPULAR_FONTS.slice(0, 24);
    popular.forEach((f, i) => {
      window.setTimeout(() => {
        loadGoogleFont(f.family).then(() => {
          setPreviewReady((prev) => new Set(prev).add(f.family));
        });
      }, i * 120);
    });
  }, [open ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const system = SYSTEM_FONTS.map((f) => ({ ...f, category: 'system' as const }));
    const all: FontListItem[] = [
      ...system,
      ...fonts,
    ];
    if (!q) return all;
    return all.filter((f) => f.family.toLowerCase().includes(q));
  }, [query, fonts]);

  const grouped = useMemo(() => {
    const order = ['system', 'sans', 'display', 'serif', 'handwriting', 'mono'];
    const map = new Map<string, FontListItem[]>();
    for (const f of filtered) {
      const arr = map.get(f.category) || [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return order
      .filter((c) => map.has(c))
      .map((c) => ({ category: c, items: map.get(c)! }));
  }, [filtered]);

  const handleSelect = (family: string) => {
    loadGoogleFont(family); // fire-and-forget; canvas + preview pick it up when ready
    onChange(family);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none flex items-center justify-between gap-2 hover:border-[rgba(255,255,255,0.2)]"
      >
        <span
          className="truncate"
          style={{
            fontFamily: previewReady.has(value) ? `"${value}", sans-serif` : undefined,
            fontSize: '14px',
          }}
        >
          {value || 'Select font…'}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-[rgba(247,245,240,0.4)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-[280px] overflow-y-auto rounded-xl bg-[#232220] border border-[rgba(255,255,255,0.12)] shadow-2xl">
          <div className="sticky top-0 bg-[#232220] p-2 border-b border-[rgba(255,255,255,0.08)]">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgba(247,245,240,0.4)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={loadingFull ? 'Loading all fonts…' : `Search ${fonts.length}+ fonts…`}
                className="w-full rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] pl-8 pr-7 py-1.5 text-[12px] text-[#F7F5F0] placeholder-[rgba(247,245,240,0.35)] focus:outline-none focus:border-[#FF5A00]"
              />
              {loadingFull && (
                <Loader2 size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-[#FF5A00]" />
              )}
            </div>
          </div>

          {grouped.length === 0 && (
            <p className="text-center text-[12px] text-[rgba(247,245,240,0.4)] py-6">
              No fonts match “{query}”
            </p>
          )}

          {grouped.map((g) => (
            <div key={g.category}>
              <p className="px-3 pt-2 pb-1 text-[9px] uppercase tracking-widest text-[rgba(247,245,240,0.35)] font-semibold">
                {CATEGORY_LABEL[g.category] || g.category}
              </p>
              {g.items.map((f) => {
                const selected = value.toLowerCase() === f.family.toLowerCase();
                const ready = previewReady.has(f.family);
                return (
                  <button
                    key={`${g.category}-${f.family}`}
                    type="button"
                    onClick={() => handleSelect(f.family)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-[rgba(255,90,0,0.12)] transition-colors ${
                      selected ? 'bg-[rgba(255,90,0,0.08)]' : ''
                    }`}
                  >
                    <span
                      className="truncate text-[rgba(247,245,240,0.9)]"
                      style={{
                        fontFamily: ready ? `"${f.family}", sans-serif` : undefined,
                        fontSize: '15px',
                      }}
                    >
                      {f.family}
                    </span>
                    {selected && <Check size={14} className="text-[#FF5A00] shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
}
