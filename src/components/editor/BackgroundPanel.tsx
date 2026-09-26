import React, { useRef, useState } from 'react';
import { Palette, Copy, Check, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SlideBackground } from '../../types';

interface BackgroundPanelProps {
  currentBackground: SlideBackground;
  onSetBackground: (bg: SlideBackground) => void;
  onApplyToAllSlides: (bg: SlideBackground) => void;
  onToast: (msg: string) => void;
}

const SOLID_PALETTES = [
  { label: 'Dark Charcoal', color: '#11100E', darkText: false },
  { label: 'Warm Cream', color: '#F7F5F0', darkText: true },
  { label: 'Pure White', color: '#FFFFFF', darkText: true },
  { label: 'Jet Black', color: '#000000', darkText: false },
  { label: 'Editorial Sand', color: '#EAE6DF', darkText: true },
  { label: 'SWAPP Orange', color: '#FF5A00', darkText: false },
  { label: 'Deep Navy', color: '#0F172A', darkText: false },
  { label: 'Forest Green', color: '#064E3B', darkText: false },
  { label: 'Slate Gray', color: '#1E293B', darkText: false },
  { label: 'Soft Lavender', color: '#F3E8FF', darkText: true },
];

const GRADIENTS = [
  {
    label: 'Dark Obsidian',
    value: 'linear-gradient(180deg, #1F1F1E 0%, #11100E 100%)',
  },
  {
    label: 'Sunset Orange',
    value: 'linear-gradient(135deg, #FF5A00 0%, #FF8A00 100%)',
  },
  {
    label: 'Warm Editorial',
    value: 'linear-gradient(180deg, #FFFFFF 0%, #EFECE6 100%)',
  },
  {
    label: 'Midnight Glow',
    value: 'linear-gradient(135deg, #0B1329 0%, #1E293B 100%)',
  },
];

export default function BackgroundPanel({
  currentBackground,
  onSetBackground,
  onApplyToAllSlides,
  onToast,
}: BackgroundPanelProps) {
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [customColor, setCustomColor] = useState(
    currentBackground.type === 'solid' && !currentBackground.value.includes('gradient')
      ? currentBackground.value
      : '#11100E'
  );

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onSetBackground({ type: 'solid', value: color });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (url) {
        onSetBackground({ type: 'image', value: url });
        onToast('Slide background updated to image');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isCurrent = (val: string) => currentBackground.value.toLowerCase() === val.toLowerCase();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Palette size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Background</h3>
      </div>

      {/* Hidden file input for custom background image */}
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Solid Colors */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Solid Colors
        </span>
        <div className="grid grid-cols-5 gap-2">
          {SOLID_PALETTES.map(p => (
            <button
              key={p.color}
              onClick={() => onSetBackground({ type: 'solid', value: p.color })}
              className={`aspect-square rounded-xl border transition-all relative flex items-center justify-center ${
                isCurrent(p.color)
                  ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/50 scale-105'
                  : 'border-[rgba(255,255,255,0.1)] hover:border-white/40'
              }`}
              style={{ backgroundColor: p.color }}
              title={p.label}
            >
              {isCurrent(p.color) && (
                <Check size={14} className={p.darkText ? 'text-black' : 'text-white'} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="mb-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Custom Color
        </span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={e => handleCustomColorChange(e.target.value)}
            className="w-10 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={customColor}
            onChange={e => handleCustomColorChange(e.target.value)}
            className="flex-1 bg-[rgba(255,255,255,0.06)] text-[12px] font-mono text-[rgba(247,245,240,0.8)] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none focus:border-[#FF5A00]"
            placeholder="#11100E"
          />
        </div>
      </div>

      {/* Gradients */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Editorial Gradients
        </span>
        <div className="grid grid-cols-2 gap-2">
          {GRADIENTS.map(g => (
            <button
              key={g.label}
              onClick={() => onSetBackground({ type: 'solid', value: g.value })}
              className={`h-14 rounded-xl border p-2 text-left transition-all flex flex-col justify-end ${
                isCurrent(g.value)
                  ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/50'
                  : 'border-[rgba(255,255,255,0.1)] hover:border-white/40'
              }`}
              style={{ background: g.value }}
            >
              <span className="text-[10px] font-semibold text-white drop-shadow-md">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Custom BG Image */}
      <div className="mb-4">
        <button
          onClick={() => bgFileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[12px] font-semibold text-[rgba(247,245,240,0.85)] flex items-center justify-center gap-2 transition-all"
        >
          <Upload size={14} />
          Upload Background Image
        </button>
      </div>

      {/* Bulk Action: Apply to All Slides */}
      <div className="mt-auto pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => {
            onApplyToAllSlides(currentBackground);
            onToast('Background applied to all slides');
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-[rgba(255,90,0,0.15)] hover:bg-[rgba(255,90,0,0.25)] border border-[rgba(255,90,0,0.4)] text-[#FF5A00] hover:text-[#ff782e] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all"
        >
          <Sparkles size={14} />
          Apply to All Slides
        </button>
      </div>
    </div>
  );
}
