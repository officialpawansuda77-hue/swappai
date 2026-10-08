import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Shapes } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, ImageProperties } from '../../types';
import {
  searchIcons, iconThumbUrl, iconToDataUrl, prettyName,
  DEFAULT_ICONS, ICON_COLORS,
} from '../../lib/iconLibrary';

interface IconsPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
}

/**
 * Grid thumbnail. Loads the SVG via fetch (same path as search — more
 * reliable than hotlinking <img> on some mobile networks), shows a spinner
 * while loading and a neutral glyph if it fails. Never a broken image.
 */
function IconThumb({ iconId, color }: { iconId: string; color: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    iconThumbUrl(iconId, color).then((url) => {
      if (!alive) return;
      if (url) setSrc(url);
      else setFailed(true);
    });
    return () => {
      alive = false;
    };
  }, [iconId, color]);

  if (failed) {
    return <Shapes size={18} className="text-[rgba(247,245,240,0.25)]" />;
  }
  if (!src) {
    return <Loader2 size={18} className="animate-spin text-[#FF5A00]" />;
  }
  return (
    <img
      src={src}
      alt={prettyName(iconId)}
      className="w-full h-full"
      draggable={false}
    />
  );
}

export default function IconsPanel({ onAddElement, onToast }: IconsPanelProps) {
  const [query, setQuery] = useState('');
  const [icons, setIcons] = useState<string[]>(DEFAULT_ICONS);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [color, setColor] = useState('#FFFFFF');
  const debounceRef = useRef<number | null>(null);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setIcons(DEFAULT_ICONS);
      return;
    }
    setSearching(true);
    try {
      const results = await searchIcons(q, 60);
      setIcons(results);
      if (results.length === 0) onToast('No icons found — try another word');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Icon search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => doSearch(v), 500);
  };

  const handleAddIcon = async (iconId: string) => {
    if (addingId) return;
    setAddingId(iconId);
    try {
      const dataUrl = await iconToDataUrl(iconId, color);
      const el: CanvasElement = {
        id: uuidv4(),
        type: 'image',
        x: 380,
        y: 500,
        width: 120,
        height: 120,
        rotation: 0,
        opacity: 1,
        zIndex: 20,
        locked: false,
        visible: true,
        properties: {
          src: dataUrl,
          objectFit: 'contain',
          borderRadius: 0,
        } as ImageProperties,
      };
      onAddElement(el);
      onToast('Icon added to slide');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Could not add icon');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Shapes size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Icons</h3>
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgba(247,245,240,0.4)]" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search 200,000+ icons…"
          className="w-full rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] pl-8 pr-8 py-2 text-[12px] text-[#F7F5F0] placeholder-[rgba(247,245,240,0.35)] focus:outline-none focus:border-[#FF5A00]"
        />
        {searching && (
          <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-[#FF5A00]" />
        )}
      </div>

      {/* Color picker */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-[rgba(247,245,240,0.4)] font-semibold mr-1">Color</span>
        {ICON_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title={c}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              color.toLowerCase() === c.toLowerCase()
                ? 'border-[#FF5A00] scale-110'
                : 'border-[rgba(255,255,255,0.2)] hover:scale-105'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Custom color"
          className="w-6 h-6 rounded-full cursor-pointer bg-transparent border border-[rgba(255,255,255,0.2)] p-0"
        />
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-4 gap-2">
        {icons.map((iconId) => (
          <button
            key={iconId}
            onClick={() => handleAddIcon(iconId)}
            title={prettyName(iconId)}
            className="aspect-square rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] hover:border-[#FF5A00] hover:bg-[rgba(255,90,0,0.08)] flex items-center justify-center p-2.5 transition-all active:scale-95"
          >
            {addingId === iconId ? (
              <Loader2 size={18} className="animate-spin text-[#FF5A00]" />
            ) : (
              <IconThumb iconId={iconId} color={color} />
            )}
          </button>
        ))}
      </div>

      {icons.length === 0 && !searching && (
        <p className="text-center text-[12px] text-[rgba(247,245,240,0.4)] mt-6">
          No icons found — try another search
        </p>
      )}
    </div>
  );
}
