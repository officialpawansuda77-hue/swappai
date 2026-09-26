import React from 'react';
import { Type, Sparkles, Quote, ListOrdered, CheckCircle2 } from 'lucide-react';
import { CanvasElement, TextProperties } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface TextPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
  isDarkBackground?: boolean;
}

export default function TextPanel({ onAddElement, onToast, isDarkBackground = false }: TextPanelProps) {
  const defaultTextColor = isDarkBackground ? '#FFFFFF' : '#111111';
  const defaultSubColor = isDarkBackground ? '#E5E7EB' : '#333333';
  const defaultBodyColor = isDarkBackground ? '#D1D5DB' : '#4B5563';

  const addTextElement = (config: Partial<TextProperties> & { width?: number; height?: number; y?: number; x?: number }) => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x: config.x ?? 80,
      y: config.y ?? 420,
      width: config.width ?? 920,
      height: config.height ?? 120,
      rotation: 0,
      opacity: 1,
      zIndex: 20,
      locked: false,
      visible: true,
      properties: {
        text: config.text || 'Your text here',
        fontFamily: config.fontFamily || 'Inter',
        fontSize: config.fontSize || 40,
        fontWeight: config.fontWeight || 600,
        color: config.color || defaultTextColor,
        alignment: config.alignment || 'left',
        letterSpacing: config.letterSpacing ?? -0.5,
        lineHeight: config.lineHeight ?? 1.25,
        textCase: config.textCase ?? 'none',
      } as TextProperties,
    };
    onAddElement(el);
    onToast('Text added to slide');
  };

  const textTemplates = [
    {
      id: 'heading',
      label: 'Add a Heading',
      preview: 'Large Heading',
      desc: 'Bold headline for slide titles',
      props: {
        text: 'Add your main headline here',
        fontSize: 54,
        fontWeight: 800,
        color: defaultTextColor,
        height: 140,
        y: 280,
      },
      badge: 'H1',
    },
    {
      id: 'subheading',
      label: 'Add a Subheading',
      preview: 'Section Subheading',
      desc: 'Supporting takeaway or context',
      props: {
        text: 'Supporting headline or key takeaway for your audience',
        fontSize: 34,
        fontWeight: 600,
        color: defaultSubColor,
        height: 100,
        y: 440,
      },
      badge: 'H2',
    },
    {
      id: 'body',
      label: 'Add Body Text',
      preview: 'Body paragraph text',
      desc: 'Explaining details or tips',
      props: {
        text: 'Explain your point here with high value. Keep sentences punchy, direct, and actionable for maximum carousel engagement.',
        fontSize: 24,
        fontWeight: 400,
        color: defaultBodyColor,
        lineHeight: 1.45,
        height: 140,
        y: 560,
      },
      badge: 'Body',
    },
    {
      id: 'hook',
      label: 'Carousel Hook / Title',
      preview: 'STOP SCROLLING 🚨',
      desc: 'High-contrast viral hook',
      props: {
        text: 'THE #1 FRAMEWORK FOR 2026',
        fontSize: 42,
        fontWeight: 900,
        color: '#FF5A00',
        textCase: 'uppercase' as const,
        letterSpacing: 1.5,
        height: 110,
        y: 200,
      },
      badge: 'Hook',
    },
    {
      id: 'quote',
      label: 'Quote Block',
      preview: '“Simplicity is mastery”',
      desc: 'Editorial serif quote',
      props: {
        text: '“Simplicity is the ultimate sophistication.”',
        fontFamily: 'Georgia',
        fontSize: 34,
        fontWeight: 500,
        color: defaultTextColor,
        lineHeight: 1.35,
        height: 130,
        y: 450,
      },
      badge: 'Quote',
    },
    {
      id: 'bullet',
      label: 'Bullet Point / Step',
      preview: '✓ 01. Actionable step',
      desc: 'Action item or principle',
      props: {
        text: '✓ Step 01: Optimize your core distribution engine',
        fontSize: 26,
        fontWeight: 600,
        color: defaultTextColor,
        height: 80,
        y: 500,
      },
      badge: 'Step',
    },
    {
      id: 'step_num',
      label: 'Big Number Callout',
      preview: '01',
      desc: 'Slide number or stat',
      props: {
        text: '01',
        fontSize: 72,
        fontWeight: 900,
        color: '#FF5A00',
        letterSpacing: -2,
        height: 100,
        width: 220,
        y: 180,
      },
      badge: 'Stat',
    },
    {
      id: 'handle',
      label: 'Creator Handle Tag',
      preview: '@yourbrand · Follow',
      desc: 'Footer credit or username',
      props: {
        text: '@swapp.ai · Swipe to learn more →',
        fontSize: 18,
        fontWeight: 600,
        color: '#6B7280',
        height: 50,
        y: 1240,
      },
      badge: 'Footer',
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Type size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Add Text</h3>
      </div>

      <p className="text-[11px] text-[rgba(247,245,240,0.5)] mb-3 leading-relaxed">
        Click any preset to add to slide. Double-click on canvas or use right panel to edit text.
      </p>

      <div className="flex flex-col gap-2">
        {textTemplates.map(item => (
          <button
            key={item.id}
            onClick={() => addTextElement(item.props)}
            className="group flex flex-col p-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,90,0,0.4)] transition-all text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-[rgba(247,245,240,0.9)] group-hover:text-white">
                {item.label}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.08)] group-hover:bg-[#FF5A00] group-hover:text-white text-[rgba(247,245,240,0.5)] font-mono transition-colors">
                {item.badge}
              </span>
            </div>
            <div className="text-[11px] text-[rgba(247,245,240,0.4)] truncate">
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
