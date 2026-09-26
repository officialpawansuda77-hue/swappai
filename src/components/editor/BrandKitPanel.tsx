import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, AtSign, Type, Check, RefreshCw } from 'lucide-react';
import { CanvasElement, SlideBackground, TextProperties } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface BrandKitPanelProps {
  onSetBackground: (bg: SlideBackground) => void;
  onApplyToAllSlides: (bg: SlideBackground) => void;
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
}

const STORAGE_KEY = 'swapp_brand_kit';

interface BrandKitData {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headingFont: string;
  handle: string;
  brandName: string;
}

const DEFAULT_BRAND_KIT: BrandKitData = {
  primaryColor: '#111111',
  accentColor: '#FF5A00',
  backgroundColor: '#F7F5F0',
  headingFont: 'Inter',
  handle: '@swapp.ai',
  brandName: 'SWAPP',
};

export default function BrandKitPanel({
  onSetBackground,
  onApplyToAllSlides,
  onAddElement,
  onToast,
}: BrandKitPanelProps) {
  const [kit, setKit] = useState<BrandKitData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_BRAND_KIT, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_BRAND_KIT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
    } catch {}
  }, [kit]);

  const updateKit = (updates: Partial<BrandKitData>) => {
    setKit(prev => ({ ...prev, ...updates }));
  };

  const handleApplyToSlide = () => {
    onSetBackground({ type: 'solid', value: kit.backgroundColor });
    onToast('Brand background applied to current slide');
  };

  const handleApplyToAllSlides = () => {
    onApplyToAllSlides({ type: 'solid', value: kit.backgroundColor });
    onToast('Brand palette applied across all slides');
  };

  const handleAddBrandHandle = () => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x: 80,
      y: 1240,
      width: 920,
      height: 50,
      rotation: 0,
      opacity: 0.8,
      zIndex: 30,
      locked: false,
      visible: true,
      properties: {
        text: `${kit.handle} · Follow for more insights`,
        fontFamily: kit.headingFont,
        fontSize: 18,
        fontWeight: 600,
        color: kit.primaryColor,
        alignment: 'center',
        lineHeight: 1.2,
      } as TextProperties,
    };
    onAddElement(el);
    onToast(`Added brand handle ${kit.handle} to slide`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Sparkles size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Brand Kit</h3>
      </div>

      <p className="text-[11px] text-[rgba(247,245,240,0.5)] mb-3 leading-relaxed">
        Save your personal brand colors, fonts, and handle to re-theme carousels in one click.
      </p>

      {/* Brand Identity / Handle */}
      <div className="mb-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Creator Identity
        </span>
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-[10px] text-[rgba(247,245,240,0.4)] block mb-1">Handle / Username</label>
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.06)] rounded-lg px-2.5 py-1.5 border border-[rgba(255,255,255,0.08)]">
              <AtSign size={12} className="text-[#FF5A00]" />
              <input
                type="text"
                value={kit.handle}
                onChange={e => updateKit({ handle: e.target.value })}
                className="bg-transparent text-[12px] text-white w-full outline-none"
                placeholder="@username"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[rgba(247,245,240,0.4)] block mb-1">Brand Name</label>
            <input
              type="text"
              value={kit.brandName}
              onChange={e => updateKit({ brandName: e.target.value })}
              className="w-full bg-[rgba(255,255,255,0.06)] text-[12px] text-white px-2.5 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none"
              placeholder="Your Brand"
            />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mb-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Brand Colors
        </span>
        <div className="flex flex-col gap-2.5">
          {[
            { key: 'accentColor', label: 'Accent Color', val: kit.accentColor },
            { key: 'primaryColor', label: 'Primary Text', val: kit.primaryColor },
            { key: 'backgroundColor', label: 'Slide Background', val: kit.backgroundColor },
          ].map(({ key, label, val }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[11px] text-[rgba(247,245,240,0.7)]">{label}</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={val}
                  onChange={e => updateKit({ [key]: e.target.value })}
                  className="w-7 h-7 rounded-md cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={val}
                  onChange={e => updateKit({ [key]: e.target.value })}
                  className="w-20 bg-[rgba(255,255,255,0.06)] text-[11px] font-mono text-center text-white py-1 rounded border border-[rgba(255,255,255,0.08)] outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Typography */}
      <div className="mb-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
          Typography
        </span>
        <select
          value={kit.headingFont}
          onChange={e => updateKit({ headingFont: e.target.value })}
          className="w-full bg-[rgba(255,255,255,0.06)] text-[12px] text-white p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none"
        >
          {['Inter', 'Manrope', 'Georgia', 'Helvetica', 'Times New Roman'].map(font => (
            <option key={font} value={font} className="bg-[#1F1E1B]">
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={handleAddBrandHandle}
          className="w-full py-2.5 px-3 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
        >
          <AtSign size={13} className="text-[#FF5A00]" />
          Add Handle to Slide
        </button>

        <button
          onClick={handleApplyToSlide}
          className="w-full py-2.5 px-3 rounded-xl bg-[rgba(255,90,0,0.15)] hover:bg-[rgba(255,90,0,0.25)] border border-[rgba(255,90,0,0.4)] text-[#FF5A00] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all"
        >
          <Palette size={13} />
          Apply to Current Slide
        </button>

        <button
          onClick={handleApplyToAllSlides}
          className="w-full py-2.5 px-3 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5A00]/20 transition-all"
        >
          <Sparkles size={13} />
          Apply to All Slides
        </button>
      </div>
    </div>
  );
}
