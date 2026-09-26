import React, { useState } from 'react';
import { Square, Circle, Minus, Columns, Palette } from 'lucide-react';
import { CanvasElement, ShapeProperties } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ShapesPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onToast: (msg: string) => void;
}

const PRESET_COLORS = [
  '#FF5A00', // Brand Orange
  '#111111', // Deep Black
  '#FFFFFF', // Pure White
  '#E5E7EB', // Card Light Gray
  '#3B82F6', // Vibrant Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Warm Amber
  '#8B5CF6', // Purple Accent
];

export default function ShapesPanel({ onAddElement, onToast }: ShapesPanelProps) {
  const [selectedColor, setSelectedColor] = useState('#FF5A00');

  const addShape = (type: 'rectangle' | 'rounded-card' | 'circle' | 'pill' | 'line' | 'bar') => {
    let width = 400;
    let height = 400;
    let shapeType: 'rectangle' | 'circle' | 'line' = 'rectangle';
    let borderRadius = 0;
    let x = 340;
    let y = 475;

    switch (type) {
      case 'rectangle':
        width = 400;
        height = 400;
        borderRadius = 0;
        break;
      case 'rounded-card':
        width = 920;
        height = 540;
        x = 80;
        y = 400;
        borderRadius = 28;
        break;
      case 'circle':
        width = 360;
        height = 360;
        shapeType = 'circle';
        x = 360;
        y = 495;
        break;
      case 'pill':
        width = 300;
        height = 70;
        borderRadius = 35;
        x = 390;
        y = 640;
        break;
      case 'line':
        width = 800;
        height = 6;
        shapeType = 'line';
        x = 140;
        y = 672;
        break;
      case 'bar':
        width = 10;
        height = 200;
        x = 80;
        y = 350;
        borderRadius = 5;
        break;
    }

    const el: CanvasElement = {
      id: uuidv4(),
      type: 'shape',
      x,
      y,
      width,
      height,
      rotation: 0,
      opacity: 1,
      zIndex: 10,
      locked: false,
      visible: true,
      properties: {
        shapeType,
        fill: selectedColor,
        borderRadius,
      } as ShapeProperties,
    };

    onAddElement(el);
    onToast('Shape added to slide');
  };

  const shapes = [
    {
      id: 'rounded-card',
      label: 'Rounded Card',
      desc: 'Modern carousel content card',
      icon: (
        <div className="w-9 h-7 rounded-lg border-2 border-current flex items-center justify-center">
          <div className="w-4 h-1 bg-current opacity-40 rounded" />
        </div>
      ),
    },
    {
      id: 'rectangle',
      label: 'Rectangle / Box',
      desc: 'Sharp background or container',
      icon: <div className="w-8 h-8 border-2 border-current" />,
    },
    {
      id: 'circle',
      label: 'Circle',
      desc: 'Badge or avatar background',
      icon: <div className="w-8 h-8 rounded-full border-2 border-current" />,
    },
    {
      id: 'pill',
      label: 'Pill / Button',
      desc: 'Call-to-action button shape',
      icon: <div className="w-10 h-5 rounded-full border-2 border-current" />,
    },
    {
      id: 'line',
      label: 'Divider Line',
      desc: 'Horizontal section separator',
      icon: <div className="w-10 h-0.5 bg-current" />,
    },
    {
      id: 'bar',
      label: 'Accent Bar',
      desc: 'Vertical title accent indicator',
      icon: <div className="w-1 h-8 bg-current rounded-full" />,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <Square size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Shapes</h3>
      </div>

      {/* Default Fill Color Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)]">
            Fill Color
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Custom color"
            />
            <span className="text-[10px] font-mono text-[rgba(247,245,240,0.6)] uppercase">
              {selectedColor}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`h-7 rounded-lg border transition-all flex items-center justify-center ${
                selectedColor.toLowerCase() === color.toLowerCase()
                  ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/40 scale-105'
                  : 'border-[rgba(255,255,255,0.1)] hover:border-white/40'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Shape Library */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)]">
          Shape Presets
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shapes.map(item => (
          <button
            key={item.id}
            onClick={() => addShape(item.id as any)}
            className="group flex flex-col items-center text-center p-3 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] hover:border-[#FF5A00] transition-all"
          >
            <div className="h-10 flex items-center justify-center text-[rgba(247,245,240,0.7)] group-hover:text-[#FF5A00] transition-colors mb-2">
              {item.icon}
            </div>
            <span className="text-[11px] font-semibold text-[rgba(247,245,240,0.9)] group-hover:text-white">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
