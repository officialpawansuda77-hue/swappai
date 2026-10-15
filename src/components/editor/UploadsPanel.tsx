import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, Wallpaper, Scissors, Loader2, Sparkles } from 'lucide-react';
import { CanvasElement, ImageProperties, SlideBackground } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { removeImageBackground, isHdBgRemovalAvailable, BgRemovalMode } from '../../lib/backgroundRemoval';
import { generateAiImage, STYLE_PRESETS, ASPECT_RATIOS } from '../../lib/aiImageGeneration';

interface UploadsPanelProps {
  onAddElement: (element: CanvasElement) => void;
  onSetBackground: (bg: SlideBackground) => void;
  onToast: (msg: string) => void;
}

const STORAGE_KEY = 'swapp_editor_uploads';

const DEFAULT_STARTER_IMAGES = [
  {
    id: 'starter_1',
    name: 'Minimal Gradient',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'starter_2',
    name: 'Creator Workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'starter_3',
    name: 'Abstract Dark Texture',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'starter_4',
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
];

export default function UploadsPanel({ onAddElement, onSetBackground, onToast }: UploadsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Array<{ id: string; name: string; url: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_STARTER_IMAGES;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Photorealistic');
  const [aiRatio, setAiRatio] = useState('1:1');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
    } catch {}
  }, [uploads]);

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        onToast('Please upload an image file (PNG, JPG, WebP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (!url) return;
        const newItem = {
          id: uuidv4(),
          name: file.name,
          url,
        };
        setUploads(prev => [newItem, ...prev]);
        onToast(`Uploaded ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const addImageToCanvas = (url: string) => {
    const el: CanvasElement = {
      id: uuidv4(),
      type: 'image',
      x: 180,
      y: 350,
      width: 720,
      height: 600,
      rotation: 0,
      opacity: 1,
      zIndex: 15,
      locked: false,
      visible: true,
      properties: {
        src: url,
        objectFit: 'cover',
        borderRadius: 16,
      } as ImageProperties,
    };
    onAddElement(el);
    onToast('Image added to slide');
  };

  const handleDeleteImage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setUploads(prev => prev.filter(u => u.id !== id));
    onToast('Image removed from library');
  };

  const handleRemoveBg = async (
    e: React.MouseEvent,
    item: { id: string; name: string; url: string },
    mode: BgRemovalMode = 'fast',
  ) => {
    e.stopPropagation();
    if (removingId) return;
    setRemovingId(item.id);
    onToast(mode === 'hd' ? 'Removing background (HD)…' : 'Removing background…');
    try {
      const cutout = await removeImageBackground(item.url, onToast, mode);
      const newItem = { id: uuidv4(), name: `${item.name} (no bg)`, url: cutout };
      setUploads(prev => [newItem, ...prev]);
      onToast('Background removed — saved as a new image');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Background removal failed');
    } finally {
      setRemovingId(null);
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (!aiPrompt.trim()) {
      onToast('Describe the image you want first');
      return;
    }
    setGenerating(true);
    onToast('Generating image… (takes ~20-40 seconds)');
    try {
      const fullPrompt = aiPrompt.trim() + (STYLE_PRESETS[aiStyle] || '');
      const [w, h] = ASPECT_RATIOS[aiRatio] || ASPECT_RATIOS['1:1'];
      const dataUrl = await generateAiImage(fullPrompt, { width: w, height: h });
      const newItem = { id: uuidv4(), name: `AI: ${aiPrompt.trim().slice(0, 40)}`, url: dataUrl };
      setUploads(prev => [newItem, ...prev]);
      onToast('Image generated — added to your media');
      setAiPrompt('');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleSetBg = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    onSetBackground({ type: 'image', value: url });
    onToast('Slide background set to image');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 text-[#F7F5F0]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <ImageIcon size={16} className="text-[#FF5A00]" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">Uploads</h3>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Primary Upload CTA Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2.5 px-3 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/20 transition-all mb-3 active:scale-[0.98]"
      >
        <Upload size={15} />
        Upload from Computer
      </button>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-xl border border-dashed text-center cursor-pointer transition-all mb-4 ${
          isDragging
            ? 'border-[#FF5A00] bg-[rgba(255,90,0,0.1)]'
            : 'border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.02)]'
        }`}
      >
        <Upload size={18} className="mx-auto text-[rgba(247,245,240,0.4)] mb-1.5" />
        <p className="text-[11px] font-medium text-[rgba(247,245,240,0.7)]">Drag & drop images here</p>
        <p className="text-[10px] text-[rgba(247,245,240,0.4)] mt-0.5">PNG, JPG, WebP up to 10MB</p>
      </div>

      {/* AI Image Generator */}
      <div className="rounded-xl border border-[rgba(168,85,247,0.25)] bg-[rgba(168,85,247,0.06)] p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-[#A855F7]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[rgba(247,245,240,0.9)]">AI Generate</span>
        </div>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Describe your image… e.g. a cozy coffee shop interior, warm light"
          rows={2}
          className="w-full rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] px-2.5 py-2 text-[12px] text-[#F7F5F0] placeholder-[rgba(247,245,240,0.35)] focus:outline-none focus:border-[#A855F7] resize-none mb-2"
        />
        <div className="flex gap-2 mb-2">
          <select
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            className="flex-1 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] px-2 py-1.5 text-[11px] text-[#F7F5F0] focus:outline-none focus:border-[#A855F7]"
          >
            {Object.keys(STYLE_PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select
            value={aiRatio}
            onChange={(e) => setAiRatio(e.target.value)}
            className="rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.12)] px-2 py-1.5 text-[11px] text-[#F7F5F0] focus:outline-none focus:border-[#A855F7]"
          >
            {Object.keys(ASPECT_RATIOS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2 px-3 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-60 text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {generating ? 'Generating…' : 'Generate Image'}
        </button>
      </div>

      {/* Uploaded Gallery */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[rgba(247,245,240,0.4)]">
          Your Media ({uploads.length})
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {uploads.map(item => (
          <div
            key={item.id}
            onClick={() => addImageToCanvas(item.url)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] cursor-pointer hover:border-[#FF5A00] transition-all"
            title="Click to add to slide"
          >
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
              <div className="flex justify-end gap-1">
                <button
                  onClick={(e) => handleSetBg(e, item.url)}
                  className="p-1 rounded bg-black/60 hover:bg-[#FF5A00] text-white transition-colors"
                  title="Set as Slide Background"
                >
                  <Wallpaper size={12} />
                </button>
                <button
                  onClick={(e) => handleRemoveBg(e, item)}
                  disabled={removingId !== null}
                  className="p-1 rounded bg-black/60 hover:bg-[#FF5A00] text-white transition-colors disabled:opacity-50"
                  title="Remove background (fast, best for people)"
                >
                  {removingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <Scissors size={12} />}
                </button>
                {isHdBgRemovalAvailable() && (
                  <button
                    onClick={(e) => handleRemoveBg(e, item, 'hd')}
                    disabled={removingId !== null}
                    className="px-1 rounded bg-black/60 hover:bg-[#FF5A00] text-white text-[9px] font-bold leading-none transition-colors disabled:opacity-50"
                    title="Remove background (HD — products & objects)"
                  >
                    HD
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteImage(e, item.id)}
                  className="p-1 rounded bg-black/60 hover:bg-red-500 text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-white bg-[#FF5A00] py-1 rounded">
                <Plus size={10} /> Add
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
