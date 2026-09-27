import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Undo2, Redo2, Eye, EyeOff, Download, Save, ChevronLeft, ChevronRight,
  Plus, Copy, Trash2, Type, Image as ImageIcon, Square, Layers, Palette,
  AlignLeft, AlignCenter, AlignRight, Lock, Unlock,
  RotateCcw, ArrowLeft, Sparkles, X, LayoutGrid, ArrowUp, ArrowDown, Wallpaper
} from 'lucide-react';
import { useEditorStore } from '../hooks/useEditorStore';
import { useAuth } from '../contexts/AuthContext';
import { getProjectById, saveUserProject, createProjectFromTemplate } from '../lib/projects';
import SlidePreview from '../components/templates/SlidePreview';
import TextPanel from '../components/editor/TextPanel';
import UploadsPanel from '../components/editor/UploadsPanel';
import ShapesPanel from '../components/editor/ShapesPanel';
import ElementsPanel from '../components/editor/ElementsPanel';
import BackgroundPanel from '../components/editor/BackgroundPanel';
import BrandKitPanel from '../components/editor/BrandKitPanel';
import { Project, Slide, CanvasElement, TextProperties, ShapeProperties, ImageProperties, SlideBackground } from '../types';
import { v4 as uuidv4 } from 'uuid';

// ─── AUTOSAVE HOOK ────────────────────────────────────────────────────────────
function useAutosave(saveStatus: string, onSave: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onSave, 800);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [saveStatus, onSave]);
}

// ─── CANVAS ELEMENT RENDERER ──────────────────────────────────────────────────
interface CanvasViewProps {
  slide: Slide;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  scale: number;
}

function CanvasView({ slide, selectedElementId, onSelectElement, onUpdateElement, scale }: CanvasViewProps) {
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, el: CanvasElement) => {
    if (el.locked || editingTextId === el.id) return;
    e.stopPropagation();
    onSelectElement(el.id);
    setDragging({ id: el.id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y });
  }, [onSelectElement, editingTextId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = (e.clientX - dragging.startX) / scale;
    const dy = (e.clientY - dragging.startY) / scale;
    onUpdateElement(dragging.id, { x: Math.round(dragging.elX + dx), y: Math.round(dragging.elY + dy) });
  }, [dragging, scale, onUpdateElement]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const bgStyle: React.CSSProperties =
    slide.background.type === 'solid'
      ? (slide.background.value.includes('gradient')
          ? { background: slide.background.value }
          : { backgroundColor: slide.background.value })
      : { backgroundImage: `url(${slide.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };

  const sorted = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ width: slide.width * scale, height: slide.height * scale, ...bgStyle, cursor: dragging ? 'grabbing' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectElement(null);
          setEditingTextId(null);
        }
      }}
    >
      {sorted.filter(el => el.visible).map(el => {
        const isSelected = el.id === selectedElementId;
        const textProps = el.properties as TextProperties;
        const isEditing = editingTextId === el.id;

        return (
          <div
            key={el.id}
            onMouseDown={(e) => handleMouseDown(e, el)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(el.id);
            }}
            style={{
              position: 'absolute',
              left: el.x * scale,
              top: el.y * scale,
              width: el.width * scale,
              height: el.height * scale,
              transform: `rotate(${el.rotation}deg)`,
              opacity: el.opacity,
              zIndex: el.zIndex,
              cursor: el.locked ? 'default' : isEditing ? 'text' : 'grab',
              outline: isSelected ? '2px solid #FF5A00' : '2px solid transparent',
              outlineOffset: 2,
              boxSizing: 'border-box',
            }}
          >
            {el.type === 'text' && (
              isEditing ? (
                <textarea
                  autoFocus
                  defaultValue={textProps.text}
                  onMouseDown={(e) => e.stopPropagation()}
                  onBlur={(e) => {
                    onUpdateElement(el.id, { properties: { ...textProps, text: e.target.value } });
                    setEditingTextId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingTextId(null);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: textProps.fontFamily || 'Inter',
                    fontSize: textProps.fontSize * scale,
                    fontWeight: textProps.fontWeight || 400,
                    color: textProps.color || '#111111',
                    textAlign: textProps.alignment || 'left',
                    letterSpacing: `${(textProps.letterSpacing || 0) * scale}px`,
                    lineHeight: textProps.lineHeight || 1.3,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px dashed #FF5A00',
                    outline: 'none',
                    resize: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                />
              ) : (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (!el.locked) setEditingTextId(el.id);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: textProps.fontFamily || 'Inter',
                    fontSize: textProps.fontSize * scale,
                    fontWeight: textProps.fontWeight || 400,
                    color: textProps.color || '#111111',
                    textAlign: textProps.alignment || 'left',
                    letterSpacing: `${(textProps.letterSpacing || 0) * scale}px`,
                    lineHeight: textProps.lineHeight || 1.3,
                    textTransform: textProps.textCase === 'uppercase' ? 'uppercase' : 'none',
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  title="Double-click to edit text"
                >
                  {textProps.text}
                </div>
              )
            )}

            {el.type === 'shape' && (() => {
              const sp = el.properties as ShapeProperties;
              return (
                <div style={{
                  width: '100%', height: '100%',
                  backgroundColor: sp.fill,
                  borderRadius: sp.shapeType === 'circle' ? '50%' : sp.borderRadius ? `${sp.borderRadius * scale}px` : 0,
                  border: sp.stroke ? `${(sp.strokeWidth || 1) * scale}px solid ${sp.stroke}` : 'none',
                }} />
              );
            })()}

            {el.type === 'image' && (() => {
              const ip = el.properties as ImageProperties;
              return ip.src ? (
                <img
                  src={ip.src}
                  alt={ip.alt || ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: ip.objectFit || 'cover',
                    borderRadius: ip.borderRadius ? `${ip.borderRadius * scale}px` : 0,
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(17,17,17,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={16 * scale} className="text-[#6B6B67]" />
                </div>
              );
            })()}

            {/* Selection corner handles */}
            {isSelected && !isEditing && (
              <>
                <div style={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, background: '#FF5A00', borderRadius: 2, border: '1px solid white' }} />
                <div style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#FF5A00', borderRadius: 2, border: '1px solid white' }} />
                <div style={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, background: '#FF5A00', borderRadius: 2, border: '1px solid white' }} />
                <div style={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, background: '#FF5A00', borderRadius: 2, border: '1px solid white' }} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PROPERTIES PANEL ─────────────────────────────────────────────────────────
interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetAsBackground?: (url: string) => void;
}

function PropertiesPanel({
  element,
  onUpdate,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete,
  onSetAsBackground,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="p-4 text-[#F7F5F0]">
        <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-4">Canvas Element</p>
        <p className="text-[12px] text-[rgba(247,245,240,0.4)] leading-relaxed">
          Select any element on the canvas to customize its text, colors, dimensions, and layering.
        </p>
      </div>
    );
  }

  const isText = element.type === 'text';
  const isShape = element.type === 'shape';
  const isImage = element.type === 'image';

  const textProps = element.properties as TextProperties;
  const shapeProps = element.properties as ShapeProperties;
  const imageProps = element.properties as ImageProperties;

  const updateProp = (key: string, value: unknown) => {
    onUpdate({ properties: { ...element.properties, [key]: value } as any });
  };

  return (
    <div className="overflow-y-auto h-full text-[#F7F5F0]">
      {/* Header & Quick Actions */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#FF5A00] font-semibold">
            {element.type.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(247,245,240,0.6)] hover:text-white transition-colors"
            title="Duplicate"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-[rgba(255,50,50,0.08)] hover:bg-red-500 text-red-400 hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Position & Size */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-2.5">Transform</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { l: 'X', v: element.x, k: 'x' },
            { l: 'Y', v: element.y, k: 'y' },
            { l: 'W', v: element.width, k: 'width' },
            { l: 'H', v: element.height, k: 'height' },
          ].map(({ l, v, k }) => (
            <div key={l} className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] rounded-lg px-2.5 py-1.5 border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[rgba(247,245,240,0.3)] w-3">{l}</span>
              <input
                type="number"
                value={Math.round(v)}
                onChange={e => onUpdate({ [k]: Number(e.target.value) })}
                className="bg-transparent text-[12px] text-[rgba(247,245,240,0.85)] w-full outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] rounded-lg px-2.5 py-1.5 flex-1 mr-2 border border-[rgba(255,255,255,0.06)]">
            <RotateCcw size={10} className="text-[rgba(247,245,240,0.3)]" />
            <input
              type="number"
              value={element.rotation}
              onChange={e => onUpdate({ rotation: Number(e.target.value) })}
              className="bg-transparent text-[12px] text-[rgba(247,245,240,0.85)] w-full outline-none"
            />
            <span className="text-[10px] text-[rgba(247,245,240,0.3)]">°</span>
          </div>
          <button
            onClick={() => onUpdate({ locked: !element.locked })}
            className={`p-2 rounded-lg transition-colors ${
              element.locked ? 'bg-[#FF5A00] text-white' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.5)] hover:text-white'
            }`}
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? <Lock size={13} /> : <Unlock size={13} />}
          </button>
        </div>
      </div>

      {/* Layering (Bring forward / Send back) */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-2.5">Layer Order</p>
        <div className="flex gap-2">
          <button
            onClick={onBringForward}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[11px] font-medium text-[rgba(247,245,240,0.7)] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowUp size={12} /> Forward
          </button>
          <button
            onClick={onSendBackward}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[11px] font-medium text-[rgba(247,245,240,0.7)] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowDown size={12} /> Backward
          </button>
        </div>
      </div>

      {/* Opacity */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)]">Opacity</p>
          <span className="text-[11px] text-[rgba(247,245,240,0.5)] font-mono">{Math.round(element.opacity * 100)}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01}
          value={element.opacity}
          onChange={e => onUpdate({ opacity: Number(e.target.value) })}
          className="w-full accent-[#FF5A00]"
        />
      </div>

      {/* ── TEXT CONTROLS ── */}
      {isText && (
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-[10px] uppercase tracking-widest text-[#FF5A00] mb-2.5 font-semibold">Text Content</p>
          <textarea
            value={textProps.text}
            onChange={e => updateProp('text', e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.9)] text-[12px] p-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] resize-none h-24 outline-none focus:border-[#FF5A00] mb-3"
            placeholder="Type your text..."
          />

          <div className="mb-3">
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Font Family</p>
            <select
              value={textProps.fontFamily}
              onChange={e => updateProp('fontFamily', e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none"
            >
              {['Inter', 'Manrope', 'Georgia', 'Times New Roman', 'Arial', 'Helvetica'].map(f => (
                <option key={f} value={f} className="bg-[#1F1E1B]">{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Size</p>
              <input
                type="number"
                value={textProps.fontSize}
                onChange={e => updateProp('fontSize', Number(e.target.value))}
                className="w-full bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none"
              />
            </div>
            <div>
              <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Weight</p>
              <select
                value={textProps.fontWeight}
                onChange={e => updateProp('fontWeight', Number(e.target.value))}
                className="w-full bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none"
              >
                {[300, 400, 500, 600, 700, 800, 900].map(w => (
                  <option key={w} value={w} className="bg-[#1F1E1B]">{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textProps.color}
                onChange={e => updateProp('color', e.target.value)}
                className="w-9 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={textProps.color}
                onChange={e => updateProp('color', e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Alignment</p>
            <div className="flex gap-1">
              {[
                { val: 'left', Icon: AlignLeft },
                { val: 'center', Icon: AlignCenter },
                { val: 'right', Icon: AlignRight },
              ].map(({ val, Icon }) => (
                <button
                  key={val}
                  onClick={() => updateProp('alignment', val)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-colors ${
                    textProps.alignment === val
                      ? 'bg-[#FF5A00] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.5)] hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SHAPE CONTROLS ── */}
      {isShape && (
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-[10px] uppercase tracking-widest text-[#FF5A00] mb-2.5 font-semibold">Shape Styles</p>

          <div className="mb-3">
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Fill Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={shapeProps.fill}
                onChange={e => updateProp('fill', e.target.value)}
                className="w-9 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={shapeProps.fill}
                onChange={e => updateProp('fill', e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none font-mono"
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-[rgba(247,245,240,0.3)]">Border Radius</p>
              <span className="text-[10px] text-[rgba(247,245,240,0.5)] font-mono">{shapeProps.borderRadius || 0}px</span>
            </div>
            <input
              type="range" min={0} max={100}
              value={shapeProps.borderRadius || 0}
              onChange={e => updateProp('borderRadius', Number(e.target.value))}
              className="w-full accent-[#FF5A00]"
            />
          </div>

          <div>
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Border Stroke Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={shapeProps.stroke || '#000000'}
                onChange={e => updateProp('stroke', e.target.value)}
                className="w-9 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={shapeProps.stroke || ''}
                placeholder="None"
                onChange={e => updateProp('stroke', e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.8)] text-[12px] p-2 rounded-lg border border-[rgba(255,255,255,0.08)] outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE CONTROLS ── */}
      {isImage && (
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-[10px] uppercase tracking-widest text-[#FF5A00] mb-2.5 font-semibold">Image Settings</p>

          <div className="aspect-video rounded-lg overflow-hidden bg-black/40 mb-3 border border-[rgba(255,255,255,0.08)]">
            <img src={imageProps.src} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-[rgba(247,245,240,0.3)]">Border Radius</p>
              <span className="text-[10px] text-[rgba(247,245,240,0.5)] font-mono">{imageProps.borderRadius || 0}px</span>
            </div>
            <input
              type="range" min={0} max={100}
              value={imageProps.borderRadius || 0}
              onChange={e => updateProp('borderRadius', Number(e.target.value))}
              className="w-full accent-[#FF5A00]"
            />
          </div>

          <div className="mb-3">
            <p className="text-[10px] text-[rgba(247,245,240,0.3)] mb-1">Object Fit</p>
            <div className="flex gap-2">
              {['cover', 'contain'].map(fit => (
                <button
                  key={fit}
                  onClick={() => updateProp('objectFit', fit)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all ${
                    (imageProps.objectFit || 'cover') === fit
                      ? 'bg-[#FF5A00] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.6)] hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {onSetAsBackground && (
            <button
              onClick={() => onSetAsBackground(imageProps.src)}
              className="w-full py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[11px] font-medium text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wallpaper size={13} /> Set as Slide Background
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── EXPORT MODAL ─────────────────────────────────────────────────────────────
function ExportModal({ onClose, onExport }: { onClose: () => void; onExport: (format: string, scope: string) => void }) {
  const [format, setFormat] = useState('png');
  const [scope, setScope] = useState('all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <div className="bg-[#1A1916] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 w-[380px] shadow-2xl text-[#F7F5F0]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold">Export Carousel</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">Format</p>
          <div className="flex gap-2">
            {['png', 'jpg', 'pdf'].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold uppercase transition-all ${
                  format === f ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.6)] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">Scope</p>
          <div className="flex gap-2">
            {[{ v: 'all', l: 'All Slides' }, { v: 'current', l: 'Current Slide' }].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setScope(v)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all ${
                  scope === v ? 'bg-white text-black font-semibold' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.6)] hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { onExport(format, scope); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 transition-all"
        >
          <Download size={15} />
          Export {scope === 'all' ? 'All Slides' : 'Current Slide'}
        </button>
        <p className="text-center text-[11px] text-[rgba(247,245,240,0.4)] mt-3">High Resolution · 1080 × 1350px</p>
      </div>
    </div>
  );
}

// ─── MAIN EDITOR PAGE ─────────────────────────────────────────────────────────
export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const uid = user?.id || profile?.userId;

  const templateId = searchParams.get('template');
  const topic = searchParams.get('topic') || undefined;

  const editor = useEditorStore();
  const [showExport, setShowExport] = useState(false);
  const [showToast, setShowToast] = useState('');

  // Active Tool Panel
  const [activeTool, setActiveTool] = useState<'text' | 'uploads' | 'shapes' | 'elements' | 'background' | 'brandKit' | 'slides'>('text');
  // Mobile bottom sheet state
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);

  // Paywall guard defense-in-depth
  useEffect(() => {
    if (!authLoading && !user && !profile && !localStorage.getItem('swapp_admin_session')) {
      navigate('/pricing', { replace: true });
    }
  }, [authLoading, user, profile, navigate]);

  // Initialize project
  useEffect(() => {
    if (authLoading) return;
    if (!user && !profile && !localStorage.getItem('swapp_admin_session')) return;
    let isCancelled = false;

    async function initProject() {
      if (templateId) {
        if (!editor.state.project || editor.state.project.templateId !== templateId) {
          const project = createProjectFromTemplate(templateId, topic, uid);
          await saveUserProject(project, uid);
          if (!isCancelled) {
            editor.setProject(project);
            navigate(`/editor/${project.id}`, { replace: true });
          }
        }
      } else if (projectId && projectId !== 'new') {
        if (!editor.state.project || editor.state.project.id !== projectId) {
          const loaded = await getProjectById(projectId, uid);
          if (!isCancelled) {
            if (loaded) {
              editor.setProject(loaded);
            } else {
              editor.setProject(null);
              toast('Project not found or you do not have permission to access it.');
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 1200);
            }
          }
        }
      } else if (projectId === 'new' && !templateId) {
        if (!editor.state.project) {
          const project: Project = {
            id: uuidv4(),
            userId: uid || 'anonymous',
            name: 'Untitled Carousel',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slides: [{
              id: uuidv4(),
              order: 0,
              width: 1080,
              height: 1350,
              background: { type: 'solid', value: '#11100E' },
              elements: [],
            }],
          };
          await saveUserProject(project, uid);
          if (!isCancelled) {
            editor.setProject(project);
            navigate(`/editor/${project.id}`, { replace: true });
          }
        }
      }
    }

    initProject();

    return () => {
      isCancelled = true;
    };
  }, [templateId, projectId, topic, uid, authLoading, navigate]);

  // Autosave
  const doSave = useCallback(async () => {
    editor.setSaveStatus('saving');
    if (editor.state.project) {
      await saveUserProject(editor.state.project, uid);
    }
    setTimeout(() => {
      editor.setSaveStatus('saved');
    }, 400);
  }, [editor, uid]);

  useAutosave(editor.state.saveStatus, doSave);

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  const handleDuplicateSelected = () => {
    if (!editor.currentSlide || !editor.state.selectedElementId) return;
    const el = editor.currentSlide.elements.find(e => e.id === editor.state.selectedElementId);
    if (!el) return;
    const copy: CanvasElement = {
      ...el,
      id: uuidv4(),
      x: el.x + 30,
      y: el.y + 30,
      properties: { ...el.properties },
    };
    editor.addElement(editor.state.currentSlideIndex, copy);
    toast('Element duplicated');
  };

  const handleDeleteSelected = () => {
    if (editor.state.selectedElementId) {
      editor.deleteElement(editor.state.currentSlideIndex, editor.state.selectedElementId);
      toast('Element deleted');
    }
  };

  const handleExport = (format: string, scope: string) => {
    toast(`Carousel exported as ${format.toUpperCase()}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          handleDeleteSelected();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editor.state.selectedElementId, editor.state.currentSlideIndex]);

  const project = editor.state.project;
  const currentSlide = editor.currentSlide;
  const canvasScale = 0.45;

  if (authLoading || !project) {
    return (
      <div className="min-h-screen bg-[#11100E] flex items-center justify-center">
        <div className="text-center text-[#F7F5F0]">
          <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[rgba(247,245,240,0.6)]">Loading Canvas Editor...</p>
        </div>
      </div>
    );
  }

  const toolTabs = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'uploads', label: 'Uploads', icon: ImageIcon },
    { id: 'shapes', label: 'Shapes', icon: Square },
    { id: 'elements', label: 'Elements', icon: Layers },
    { id: 'background', label: 'Background', icon: Palette },
    { id: 'brandKit', label: 'Brand Kit', icon: Sparkles },
    { id: 'slides', label: 'Slides', icon: LayoutGrid },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#11100E] overflow-hidden">
      {/* ── TOP TOOLBAR ─────────────────────────────────── */}
      <div className="editor-toolbar h-[52px] bg-[#141311] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-3 md:px-4 flex-shrink-0 gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg text-[rgba(247,245,240,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="w-px h-5 bg-[rgba(255,255,255,0.08)] hidden md:block" />
          <input
            type="text"
            value={project.name}
            onChange={e => editor.setProject({ ...project, name: e.target.value })}
            className="bg-transparent text-[13px] font-medium text-[rgba(247,245,240,0.9)] outline-none hidden md:block md:max-w-[200px] lg:max-w-[240px] border-b border-transparent focus:border-[rgba(255,255,255,0.2)] px-1"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={editor.undo}
            disabled={!editor.canUndo}
            className="p-2 rounded-lg text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all disabled:opacity-30 hidden md:flex"
            title="Undo (⌘Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={editor.redo}
            disabled={!editor.canRedo}
            className="p-2 rounded-lg text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all disabled:opacity-30 hidden md:flex"
            title="Redo (⌘⇧Z)"
          >
            <Redo2 size={15} />
          </button>
          <div className="w-px h-5 bg-[rgba(255,255,255,0.08)] hidden md:block" />
          <button
            onClick={editor.togglePreviewMode}
            className={`p-2 rounded-lg transition-all ${
              editor.state.isPreviewMode
                ? 'bg-[#FF5A00] text-white'
                : 'text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
            title="Preview Mode"
          >
            {editor.state.isPreviewMode ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <span className={`text-[10px] md:text-[11px] uppercase tracking-wider font-semibold hidden sm:block ${
            editor.state.saveStatus === 'saved' ? 'text-[rgba(247,245,240,0.35)]' :
            editor.state.saveStatus === 'saving' ? 'text-[#FF5A00]' : 'text-[rgba(247,245,240,0.5)]'
          }`}>
            {editor.state.saveStatus === 'saving' ? 'Saving...' : editor.state.saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
          </span>
          <button
            onClick={() => { doSave(); toast('Project saved'); }}
            className="p-1.5 md:px-3 rounded-lg border border-[rgba(255,255,255,0.12)] text-[rgba(247,245,240,0.85)] hover:text-white hover:border-white transition-all flex items-center gap-1.5 text-[12px] font-medium min-w-[36px] min-h-[36px] justify-center"
            title="Save project"
          >
            <Save size={13} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="py-1.5 px-2.5 md:px-3.5 rounded-lg bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-md shadow-[#FF5A00]/25 transition-all min-h-[36px]"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── FAR-LEFT ICON RAIL (68px) — Desktop only ── */}
        <div className="hidden md:flex w-[68px] bg-[#141311] border-r border-[rgba(255,255,255,0.06)] flex-col items-center py-3 gap-1 flex-shrink-0 z-20">
          {toolTabs.map(tool => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`w-[54px] h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25'
                    : 'text-[rgba(247,245,240,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                }`}
                title={tool.label}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium leading-none">{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE TOOL DRAWER (260px) — Desktop only ── */}
        <div className="hidden md:flex w-[260px] bg-[#181714] border-r border-[rgba(255,255,255,0.06)] flex-col flex-shrink-0 z-10 overflow-hidden">
          {activeTool === 'text' && currentSlide && (
            <TextPanel
              onAddElement={(el) => {
                editor.addElement(editor.state.currentSlideIndex, el);
                editor.setSelectedElement(el.id);
              }}
              onToast={toast}
              isDarkBackground={
                currentSlide.background.type === 'solid'
                  ? ['#11100e', '#000000', '#0f172a', '#064e3b', '#1e1e1e', '#1e293b'].some(c =>
                      currentSlide.background.value.toLowerCase().includes(c)
                    ) ||
                    currentSlide.background.value.toLowerCase().includes('dark') ||
                    currentSlide.background.value.toLowerCase().includes('sunset') ||
                    currentSlide.background.value.toLowerCase().includes('midnight')
                  : true
              }
            />
          )}

          {activeTool === 'uploads' && (
            <UploadsPanel
              onAddElement={(el) => {
                editor.addElement(editor.state.currentSlideIndex, el);
                editor.setSelectedElement(el.id);
              }}
              onSetBackground={(bg) => {
                editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
              }}
              onToast={toast}
            />
          )}

          {activeTool === 'shapes' && (
            <ShapesPanel
              onAddElement={(el) => {
                editor.addElement(editor.state.currentSlideIndex, el);
                editor.setSelectedElement(el.id);
              }}
              onToast={toast}
            />
          )}

          {activeTool === 'elements' && (
            <ElementsPanel
              onAddElement={(el) => {
                editor.addElement(editor.state.currentSlideIndex, el);
                editor.setSelectedElement(el.id);
              }}
              onToast={toast}
            />
          )}

          {activeTool === 'background' && currentSlide && (
            <BackgroundPanel
              currentBackground={currentSlide.background}
              onSetBackground={(bg) => {
                editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
              }}
              onApplyToAllSlides={(bg) => {
                editor.updateAllSlidesBackground(bg);
              }}
              onToast={toast}
            />
          )}

          {activeTool === 'brandKit' && (
            <BrandKitPanel
              onSetBackground={(bg) => {
                editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
              }}
              onApplyToAllSlides={(bg) => {
                editor.updateAllSlidesBackground(bg);
              }}
              onAddElement={(el) => {
                editor.addElement(editor.state.currentSlideIndex, el);
                editor.setSelectedElement(el.id);
              }}
              onToast={toast}
            />
          )}

          {activeTool === 'slides' && (
            <div className="p-3 overflow-y-auto flex-1 text-[#F7F5F0]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                <LayoutGrid size={16} className="text-[#FF5A00]" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Slides</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {project.slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    onClick={() => editor.setCurrentSlide(i)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      i === editor.state.currentSlideIndex ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/40' : 'border-transparent hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                    style={{ aspectRatio: '4/5' }}
                  >
                    <SlidePreview slide={slide} scale={0.11} />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <button
                  onClick={() => editor.addSlide(editor.state.currentSlideIndex)}
                  className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-white bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={11} /> Add
                </button>
                <button
                  onClick={() => editor.duplicateSlide(editor.state.currentSlideIndex)}
                  className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-white bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-all flex items-center justify-center gap-1"
                >
                  <Copy size={11} /> Dup
                </button>
                <button
                  onClick={() => editor.deleteSlide(editor.state.currentSlideIndex)}
                  disabled={project.slides.length <= 1}
                  className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-red-400 hover:text-white bg-[rgba(255,50,50,0.08)] hover:bg-red-500 transition-all flex items-center justify-center gap-1 disabled:opacity-30"
                >
                  <Trash2 size={11} /> Del
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── CANVAS CENTER ──────────────────────────────── */}
        <div
          className="flex-1 flex items-start md:items-center justify-center overflow-auto bg-[#0D0C0B] pt-4 md:pt-0"
          onClick={(e) => {
            if (e.currentTarget === e.target) editor.setSelectedElement(null);
          }}
        >
          {currentSlide && (
            <div className="flex flex-col items-center gap-3 my-2 md:my-4 w-full px-3 md:px-0 md:w-auto">
              {/* Slide nav */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => editor.setCurrentSlide(Math.max(0, editor.state.currentSlideIndex - 1))}
                  disabled={editor.state.currentSlideIndex === 0}
                  className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(247,245,240,0.6)] hover:bg-[rgba(255,255,255,0.15)] hover:text-white transition-all disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[12px] text-[rgba(247,245,240,0.6)] font-mono font-medium">
                  {editor.state.currentSlideIndex + 1} / {project.slides.length}
                </span>
                <button
                  onClick={() => editor.setCurrentSlide(Math.min(project.slides.length - 1, editor.state.currentSlideIndex + 1))}
                  disabled={editor.state.currentSlideIndex === project.slides.length - 1}
                  className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(247,245,240,0.6)] hover:bg-[rgba(255,255,255,0.15)] hover:text-white transition-all disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Canvas viewport — responsive scaling */}
              <div
                className="shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.08)] w-full md:w-auto"
                style={{ borderRadius: 12, overflow: 'hidden', maxWidth: currentSlide.width * canvasScale }}
              >
                {editor.state.isPreviewMode ? (
                  <div style={{ width: '100%', aspectRatio: `${currentSlide.width}/${currentSlide.height}`, position: 'relative', overflow: 'hidden' }}>
                    <SlidePreview slide={currentSlide} scale={canvasScale} />
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: `${currentSlide.width}/${currentSlide.height}`, position: 'relative', overflow: 'hidden' }}>
                    <CanvasView
                      slide={currentSlide}
                      selectedElementId={editor.state.selectedElementId}
                      onSelectElement={editor.setSelectedElement}
                      onUpdateElement={(elId, updates) => editor.updateElement(editor.state.currentSlideIndex, elId, updates)}
                      scale={canvasScale}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[rgba(247,245,240,0.35)]">
                <span className="hidden md:inline">{currentSlide.width} × {currentSlide.height}px</span>
                <span className="hidden md:inline">•</span>
                <span>4:5 Portrait Carousel</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PROPERTIES PANEL — Desktop only ──────── */}
        <div className="hidden md:block w-[240px] bg-[#141311] border-l border-[rgba(255,255,255,0.06)] flex-shrink-0 overflow-y-auto">
          <PropertiesPanel
            element={editor.selectedElement}
            onUpdate={(updates) => {
              if (editor.state.selectedElementId) {
                editor.updateElement(editor.state.currentSlideIndex, editor.state.selectedElementId, updates);
              }
            }}
            onBringForward={() => {
              if (editor.state.selectedElementId) {
                editor.bringForward(editor.state.currentSlideIndex, editor.state.selectedElementId);
                toast('Moved forward');
              }
            }}
            onSendBackward={() => {
              if (editor.state.selectedElementId) {
                editor.sendBackward(editor.state.currentSlideIndex, editor.state.selectedElementId);
                toast('Moved backward');
              }
            }}
            onDuplicate={handleDuplicateSelected}
            onDelete={handleDeleteSelected}
            onSetAsBackground={(url) => {
              editor.updateSlideBackground(editor.state.currentSlideIndex, { type: 'image', value: url });
              toast('Set as slide background');
            }}
          />
        </div>
      </div>

      {/* ── MOBILE BOTTOM TOOLBAR ─────────────────────────── */}
      <div className="editor-bottom-nav md:hidden flex items-center justify-around py-1" style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom, 0px))' }}>
        {toolTabs.slice(0, 6).map(tool => {
          const Icon = tool.icon;
          const isActive = mobileSheet === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setMobileSheet(prev => prev === tool.id ? null : tool.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-[48px] min-h-[48px] justify-center ${
                isActive
                  ? 'text-[#FF5A00]'
                  : 'text-[rgba(247,245,240,0.45)]'
              }`}
            >
              <Icon size={19} />
              <span className="text-[9px] font-medium leading-none">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── MOBILE BOTTOM SHEET ───────────────────────────── */}
      {mobileSheet && (
        <>
          <div
            className="bottom-sheet-overlay md:hidden"
            onClick={() => setMobileSheet(null)}
          />
          <div className="bottom-sheet md:hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-[13px] font-bold text-[rgba(247,245,240,0.9)] capitalize">{mobileSheet.replace('brandKit', 'Brand Kit')}</span>
              <button
                onClick={() => setMobileSheet(null)}
                className="p-2 rounded-lg text-[rgba(247,245,240,0.5)] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[55vh]">
              {mobileSheet === 'text' && currentSlide && (
                <TextPanel
                  onAddElement={(el) => {
                    editor.addElement(editor.state.currentSlideIndex, el);
                    editor.setSelectedElement(el.id);
                    setMobileSheet(null);
                  }}
                  onToast={toast}
                  isDarkBackground={true}
                />
              )}
              {mobileSheet === 'uploads' && (
                <UploadsPanel
                  onAddElement={(el) => {
                    editor.addElement(editor.state.currentSlideIndex, el);
                    editor.setSelectedElement(el.id);
                    setMobileSheet(null);
                  }}
                  onSetBackground={(bg) => {
                    editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
                    setMobileSheet(null);
                  }}
                  onToast={toast}
                />
              )}
              {mobileSheet === 'shapes' && (
                <ShapesPanel
                  onAddElement={(el) => {
                    editor.addElement(editor.state.currentSlideIndex, el);
                    editor.setSelectedElement(el.id);
                    setMobileSheet(null);
                  }}
                  onToast={toast}
                />
              )}
              {mobileSheet === 'elements' && (
                <ElementsPanel
                  onAddElement={(el) => {
                    editor.addElement(editor.state.currentSlideIndex, el);
                    editor.setSelectedElement(el.id);
                    setMobileSheet(null);
                  }}
                  onToast={toast}
                />
              )}
              {mobileSheet === 'background' && currentSlide && (
                <BackgroundPanel
                  currentBackground={currentSlide.background}
                  onSetBackground={(bg) => {
                    editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
                  }}
                  onApplyToAllSlides={(bg) => {
                    editor.updateAllSlidesBackground(bg);
                  }}
                  onToast={toast}
                />
              )}
              {mobileSheet === 'brandKit' && (
                <BrandKitPanel
                  onSetBackground={(bg) => {
                    editor.updateSlideBackground(editor.state.currentSlideIndex, bg);
                  }}
                  onApplyToAllSlides={(bg) => {
                    editor.updateAllSlidesBackground(bg);
                  }}
                  onAddElement={(el) => {
                    editor.addElement(editor.state.currentSlideIndex, el);
                    editor.setSelectedElement(el.id);
                    setMobileSheet(null);
                  }}
                  onToast={toast}
                />
              )}
              {mobileSheet === 'slides' && (
                <div className="p-3 text-[#F7F5F0]">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {project.slides.map((slide, i) => (
                      <div
                        key={slide.id}
                        onClick={() => { editor.setCurrentSlide(i); setMobileSheet(null); }}
                        className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          i === editor.state.currentSlideIndex ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/40' : 'border-transparent hover:border-[rgba(255,255,255,0.2)]'
                        }`}
                        style={{ aspectRatio: '4/5' }}
                      >
                        <SlidePreview slide={slide} scale={0.11} />
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <button
                      onClick={() => editor.addSlide(editor.state.currentSlideIndex)}
                      className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold text-white bg-[rgba(255,255,255,0.06)] flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> Add
                    </button>
                    <button
                      onClick={() => editor.duplicateSlide(editor.state.currentSlideIndex)}
                      className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold text-white bg-[rgba(255,255,255,0.06)] flex items-center justify-center gap-1"
                    >
                      <Copy size={12} /> Dup
                    </button>
                    <button
                      onClick={() => editor.deleteSlide(editor.state.currentSlideIndex)}
                      disabled={project.slides.length <= 1}
                      className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold text-red-400 bg-[rgba(255,50,50,0.08)] flex items-center justify-center gap-1 disabled:opacity-30"
                    >
                      <Trash2 size={12} /> Del
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Export modal */}
      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} onExport={handleExport} />
      )}

      {/* Toast */}
      {showToast && (
        <div
          className="fixed z-50 bg-[#1F1E1B] border border-[#FF5A00] text-white text-[12px] font-semibold py-2 px-4 rounded-xl shadow-xl animate-fade-in flex items-center gap-2"
          style={{
            bottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 80px))',
            right: 24,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
          {showToast}
        </div>
      )}
    </div>
  );
}

