import React from 'react';
import { Layers, ArrowRight, Bookmark, Sparkles, Star, CheckCircle, Quote } from 'lucide-react';
import { CanvasElement, TextProperties, ShapeProperties } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ElementsPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
}

export default function ElementsPanel({ onAddElement, onToast }: ElementsPanelProps) {
  const addSwipePill = (text = 'SWIPE RIGHT →') => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x: 360,
      y: 1220,
      width: 360,
      height: 60,
      rotation: 0,
      opacity: 1,
      zIndex: 25,
      locked: false,
      visible: true,
      properties: {
        text,
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 700,
        color: '#FFFFFF',
        alignment: 'center',
        letterSpacing: 1,
        lineHeight: 1.2,
        textCase: 'uppercase',
      } as TextProperties,
    };
    onAddElement(el);
    onToast(`Added "${text}" badge`);
  };

  const addTextElement = (text: string, fontSize = 24, color = '#111111', fontWeight = 700, y = 500, width = 400) => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x: (1080 - width) / 2,
      y,
      width,
      height: 70,
      rotation: 0,
      opacity: 1,
      zIndex: 25,
      locked: false,
      visible: true,
      properties: {
        text,
        fontFamily: 'Inter',
        fontSize,
        fontWeight,
        color,
        alignment: 'center',
        lineHeight: 1.2,
      } as TextProperties,
    };
    onAddElement(el);
    onToast(`Added element`);
  };

  const elementsList = [
    {
      category: 'Swipe & Engagement',
      items: [
        {
          label: 'SWIPE RIGHT →',
          desc: 'Bottom carousel indicator',
          action: () => addSwipePill('SWIPE RIGHT →'),
          badge: 'Swipe',
        },
        {
          label: 'NEXT SLIDE 👉',
          desc: 'Engaging forward cue',
          action: () => addSwipePill('NEXT SLIDE 👉'),
          badge: 'Next',
        },
        {
          label: 'SAVE THIS POST 🔖',
          desc: 'Boost bookmark algorithm',
          action: () => addSwipePill('SAVE THIS POST 🔖'),
          badge: 'Save',
        },
        {
          label: 'SHARE WITH A FRIEND ↗',
          desc: 'Viral share prompt',
          action: () => addSwipePill('SHARE WITH A FRIEND ↗'),
          badge: 'Share',
        },
      ],
    },
    {
      category: 'Badges & Counters',
      items: [
        {
          label: '01 / 07 Slide Counter',
          desc: 'Position index for audience',
          action: () => addTextElement('01 / 07', 20, '#FF5A00', 800, 80, 200),
          badge: 'Counter',
        },
        {
          label: 'PRO TIP 💡',
          desc: 'Actionable insight badge',
          action: () => addTextElement('💡 PRO TIP', 22, '#FF5A00', 800, 160, 240),
          badge: 'Tip',
        },
        {
          label: 'KEY TAKEAWAY ⚡️',
          desc: 'High-value summary banner',
          action: () => addTextElement('⚡️ KEY TAKEAWAY', 22, '#111111', 800, 160, 300),
          badge: 'Takeaway',
        },
        {
          label: 'STEP 01 Pill',
          desc: 'Process & workflow tag',
          action: () => addTextElement('STEP 01', 20, '#FF5A00', 900, 140, 180),
          badge: 'Step',
        },
      ],
    },
    {
      category: 'Social Proof & Decorative',
      items: [
        {
          label: '★★★★★ 5-Star Rating',
          desc: 'Customer testimonial trust badge',
          action: () => addTextElement('★★★★★', 32, '#F59E0B', 700, 300, 280),
          badge: 'Rating',
        },
        {
          label: '✓ Verified Framework',
          desc: 'Authority checkmark badge',
          action: () => addTextElement('✓ Verified Framework', 20, '#10B981', 700, 220, 280),
          badge: 'Trust',
        },
        {
          label: '“ ” Big Quote Marks',
          desc: 'Editorial aesthetic quotation marks',
          action: () => addTextElement('“', 96, '#FF5A00', 900, 320, 120),
          badge: 'Quote',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Layers size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Elements</h3>
      </div>

      <p className="text-[11px] text-[rgba(247,245,240,0.5)] mb-3 leading-relaxed">
        Swipe cues, counter badges, and trust elements designed specifically for viral carousels.
      </p>

      <div className="flex flex-col gap-4">
        {elementsList.map(cat => (
          <div key={cat.category}>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)] mb-2 block">
              {cat.category}
            </span>
            <div className="flex flex-col gap-1.5">
              {cat.items.map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] hover:border-[#FF5A00] transition-all text-left"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-[rgba(247,245,240,0.9)] group-hover:text-white">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[rgba(247,245,240,0.4)]">
                      {item.desc}
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.08)] group-hover:bg-[#FF5A00] group-hover:text-white text-[rgba(247,245,240,0.5)] font-mono transition-colors">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
