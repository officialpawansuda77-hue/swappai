import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, Loader2, Shapes, Sparkles, Smile, LayoutGrid, RotateCcw, AlertTriangle, Bot, Share2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, ImageProperties } from '../../types';
import {
  searchIcons, iconThumbUrl, iconToDataUrl, prettyName, isColorfulIcon,
  DEFAULT_ICONS, COLORFUL_DEFAULT_ICONS, COLORFUL_SETS, ICON_COLORS,
  clearIconThumbCache,
} from '../../lib/iconLibrary';
import { ICONS_3D, Icon3DItem } from '../../lib/icons3d';

interface IconsPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
}

type Category = '3d' | 'all' | 'colorful' | 'emoji';
type SubFilter3D = 'all' | 'ai' | 'social';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: '3d', label: '3D Apps', icon: <Sparkles size={12} className="text-[#FF5A00]" />, badge: '19' },
  { id: 'all', label: 'All', icon: <LayoutGrid size={12} /> },
  { id: 'colorful', label: '3D & Color', icon: <Sparkles size={12} /> },
  { id: 'emoji', label: 'Emoji', icon: <Smile size={12} /> },
];

const EMOJI_SETS = ['noto', 'twemoji', 'openmoji', 'fluent-emoji', 'fluent-emoji-flat'];

/**
 * Grid thumbnail for Iconify SVGs. Loads via fetch, shows shimmer skeleton while loading.
 */
function IconThumb({ iconId, color }: { iconId: string; color?: string }) {
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
    return <div className="w-6 h-6 rounded-md shimmer" />;
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
  const [category, setCategory] = useState<Category>('3d');
  const [subFilter3D, setSubFilter3D] = useState<SubFilter3D>('all');
  const [icons, setIcons] = useState<string[]>(DEFAULT_ICONS);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [color, setColor] = useState('#FFFFFF');
  const debounceRef = useRef<number | null>(null);
  const queryRef = useRef('');
  const categoryRef = useRef<Category>('3d');
  queryRef.current = query;
  categoryRef.current = category;

  const isColorfulMode = category === 'colorful' || category === 'emoji';
  const activeColor = isColorfulMode ? undefined : color;

  // Filter 3D icons based on query and subfilter
  const filtered3DIcons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ICONS_3D.filter((item) => {
      if (subFilter3D !== 'all' && item.category !== subFilter3D) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
      );
    });
  }, [query, subFilter3D]);

  // Matching 3D icons for global searches in other tabs
  const matching3DForSearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || category === '3d') return [];
    return ICONS_3D.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.tags.some((t) => t.includes(q))
    );
  }, [query, category]);

  const doSearch = useCallback(async (q: string, cat: Category) => {
    if (cat === '3d') return;
    const trimmed = q.trim();
    if (!trimmed) {
      setIcons(cat === 'all' ? DEFAULT_ICONS : COLORFUL_DEFAULT_ICONS);
      setSearchError(null);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const prefixes =
        cat === 'colorful' ? COLORFUL_SETS :
        cat === 'emoji' ? EMOJI_SETS : undefined;
      const results = await searchIcons(trimmed, 60, prefixes);
      setIcons(results);
      if (results.length === 0 && matching3DForSearch.length === 0) {
        onToast('No icons found — try another word');
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Icon search failed');
    } finally {
      setSearching(false);
    }
  }, [onToast, matching3DForSearch.length]);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (categoryRef.current === '3d') return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => doSearch(v, categoryRef.current), 500);
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    if (cat !== '3d') {
      doSearch(queryRef.current, cat);
    }
  };

  const handleRetryAll = () => {
    clearIconThumbCache();
    setIcons((prev) => [...prev]);
    onToast('Retrying icon thumbnails…');
  };

  // Add 3D icon element
  const handleAdd3DIcon = (item: Icon3DItem) => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'image',
      x: 440,
      y: 480,
      width: 200,
      height: 200,
      rotation: 0,
      opacity: 1,
      zIndex: 25,
      locked: false,
      visible: true,
      properties: {
        src: item.src,
        alt: item.name,
        objectFit: 'contain',
        borderRadius: 0,
      } as ImageProperties,
    };
    onAddElement(el);
    onToast(`Added 3D ${item.name} icon`);
  };

  // Add Iconify SVG icon element
  const handleAddIcon = async (iconId: string) => {
    if (addingId) return;
    setAddingId(iconId);
    try {
      const useColor = isColorfulIcon(iconId) ? undefined : color;
      const dataUrl = await iconToDataUrl(iconId, useColor);
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
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Shapes size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Icons</h3>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCategoryChange(c.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
              category === c.id
                ? 'bg-[#FF5A00] text-white shadow-sm'
                : 'bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.6)] hover:bg-[rgba(255,255,255,0.12)]'
            }`}
          >
            {c.icon}
            {c.label}
            {c.badge && (
              <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                category === c.id ? 'bg-black/30 text-white' : 'bg-[#FF5A00]/20 text-[#FF5A00]'
              }`}>
                {c.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgba(247,245,240,0.4)]" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={
            category === '3d'
              ? 'Search ChatGPT, Claude, Gemini, Insta…'
              : isColorfulMode
              ? 'Search 3D & colorful icons…'
              : 'Search 200,000+ icons…'
          }
          className="w-full rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] pl-8 pr-8 py-2 text-[12px] text-[#F7F5F0] placeholder-[rgba(247,245,240,0.35)] focus:outline-none focus:border-[#FF5A00]"
        />
        {searching && (
          <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-[#FF5A00]" />
        )}
      </div>

      {/* ── 3D ICONS VIEW ── */}
      {category === '3d' && (
        <div className="flex flex-col gap-2">
          {/* Subfilter pills: All / AI / Social */}
          <div className="flex items-center gap-1.5 mb-1">
            <button
              onClick={() => setSubFilter3D('all')}
              className={`text-[10px] px-2 py-1 rounded-lg font-medium transition-all ${
                subFilter3D === 'all'
                  ? 'bg-[rgba(255,255,255,0.15)] text-white'
                  : 'text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              All ({ICONS_3D.length})
            </button>
            <button
              onClick={() => setSubFilter3D('ai')}
              className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium transition-all ${
                subFilter3D === 'ai'
                  ? 'bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30'
                  : 'text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              <Bot size={11} /> AI Tools ({ICONS_3D.filter((i) => i.category === 'ai').length})
            </button>
            <button
              onClick={() => setSubFilter3D('social')}
              className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium transition-all ${
                subFilter3D === 'social'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              <Share2 size={11} /> Social ({ICONS_3D.filter((i) => i.category === 'social').length})
            </button>
          </div>

          {/* 3D Icons Grid */}
          <div className="grid grid-cols-3 gap-2">
            {filtered3DIcons.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAdd3DIcon(item)}
                title={`Click to add 3D ${item.name}`}
                className="group flex flex-col items-center justify-center p-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:border-[#FF5A00] hover:bg-[rgba(255,90,0,0.08)] transition-all active:scale-95"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-1.5 transition-transform duration-200 group-hover:scale-110">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[rgba(247,245,240,0.9)] group-hover:text-white truncate max-w-full text-center">
                  {item.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[rgba(247,245,240,0.35)] group-hover:text-[#FF5A00] transition-colors">
                  {item.category === 'ai' ? 'AI Tool' : 'Social'}
                </span>
              </button>
            ))}
          </div>

          {filtered3DIcons.length === 0 && (
            <p className="text-center text-[12px] text-[rgba(247,245,240,0.4)] py-8">
              No 3D icons match "{query}"
            </p>
          )}
        </div>
      )}

      {/* ── STANDARD ICONIFY VIEW ── */}
      {category !== '3d' && (
        <>
          {/* Prominent matching 3D icons shelf if search query matches any 3D icons */}
          {matching3DForSearch.length > 0 && (
            <div className="mb-3 p-2 rounded-xl bg-[rgba(255,90,0,0.08)] border border-[rgba(255,90,0,0.2)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A00] mb-1.5 flex items-center gap-1">
                <Sparkles size={11} /> 3D App Match
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {matching3DForSearch.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAdd3DIcon(item)}
                    className="flex flex-col items-center p-1.5 rounded-lg bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(255,90,0,0.2)] border border-[rgba(255,255,255,0.08)] transition-all"
                  >
                    <img src={item.src} alt={item.name} className="w-10 h-10 object-contain mb-1" />
                    <span className="text-[10px] font-medium text-white truncate max-w-full">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search error with retry */}
          {searchError && (
            <div className="flex items-center gap-2 mb-2 p-2 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
              <AlertTriangle size={14} className="text-[#EF4444] shrink-0" />
              <p className="flex-1 text-[11px] text-[rgba(247,245,240,0.7)]">{searchError}</p>
              <button
                onClick={() => doSearch(queryRef.current, categoryRef.current)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.08)] text-[11px] font-semibold hover:bg-[rgba(255,255,255,0.15)]"
              >
                <RotateCcw size={11} /> Retry
              </button>
            </div>
          )}

          {/* Color picker — hidden in colorful mode (original colors kept) */}
          {!isColorfulMode ? (
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
          ) : (
            <p className="text-[10px] text-[rgba(247,245,240,0.4)] mb-3 flex items-center gap-1">
              <Sparkles size={11} className="text-[#FF5A00]" />
              Original 3D colors kept — no recolor in this mode
            </p>
          )}

          {/* Retry thumbnails link */}
          <div className="flex justify-end mb-1">
            <button
              onClick={handleRetryAll}
              className="flex items-center gap-1 text-[10px] text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.7)]"
              title="Reload all icon thumbnails"
            >
              <RotateCcw size={10} /> Reload icons
            </button>
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
                  <IconThumb iconId={iconId} color={activeColor} />
                )}
              </button>
            ))}
          </div>

          {icons.length === 0 && !searching && !searchError && (
            <p className="text-center text-[12px] text-[rgba(247,245,240,0.4)] mt-6">
              No icons found — try another search
            </p>
          )}
        </>
      )}
    </div>
  );
}


