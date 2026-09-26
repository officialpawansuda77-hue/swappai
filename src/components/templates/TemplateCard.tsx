import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Layers } from 'lucide-react';
import { Template } from '../../types';
import SlidePreview from './SlidePreview';

interface TemplateCardProps {
  template: Template;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export default function TemplateCard({ template, onSave, isSaved = false }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const firstSlide = template.slides[0];
  const scale = 220 / 1080; // card width / slide width

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(template.id);
  };

  return (
    <div
      className="template-card group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Slide preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: template.aspectRatio === '4:5' ? '4/5' : '1/1' }}>
        {firstSlide ? (
          <SlidePreview
            slide={firstSlide}
            scale={scale}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full bg-[rgba(17,17,17,0.06)] flex items-center justify-center">
            <Layers size={24} className="text-[#6B6B67]" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'rgba(17,17,17,0.75)' }}
        >
          <Link
            to={`/templates/${template.id}`}
            className="btn-ghost btn-sm !text-[#F7F5F0] !border-[rgba(255,255,255,0.3)] hover:!border-white hover:!bg-transparent"
            style={{ minWidth: 140 }}
          >
            Preview
          </Link>
          <Link
            to={`/editor/new?template=${template.id}`}
            className="btn-accent btn-sm flex items-center gap-1.5"
            style={{ minWidth: 140, justifyContent: 'center' }}
          >
            Open in Canvas
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {template.isTrending && (
            <span className="tag tag-accent">Trending</span>
          )}
          {template.isNew && (
            <span className="tag" style={{ background: 'rgba(17,17,17,0.08)', color: '#6B6B67' }}>New</span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            saved
              ? 'bg-[#FF5A00] text-white'
              : 'bg-white text-[#6B6B67] hover:text-[#FF5A00]'
          } shadow-sm`}
          aria-label={saved ? 'Unsave template' : 'Save template'}
        >
          <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3 className="text-[14px] font-semibold text-[#111111] leading-tight mb-1 line-clamp-2">
          {template.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="tag tag-dark">{template.category}</span>
          </div>
          <span className="text-[12px] text-[#6B6B67]">
            {template.slideCount} slides
          </span>
        </div>
      </div>
    </div>
  );
}
