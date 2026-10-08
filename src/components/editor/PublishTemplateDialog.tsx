import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Share2, Globe, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Project, TemplateCategory, TemplateVisibility } from '../../types';
import { publishTemplateFromProject, PublishStage } from '../../lib/communityTemplates';
import SlidePreview from '../templates/SlidePreview';

const CATEGORIES: TemplateCategory[] = [
  'AI', 'Business', 'Marketing', 'Education', 'Personal Brand',
  'Creator', 'SaaS', 'Finance', 'Productivity', 'Motivation',
  'Product', 'Quotes', 'Other',
];

interface PublishTemplateDialogProps {
  project: Project;
  userId: string;
  creatorName?: string;
  onClose: () => void;
  onPublished: (templateId: string) => void;
}

const STAGE_LABEL: Record<PublishStage, string> = {
  thumbnail: 'Rendering thumbnail…',
  saving: 'Saving template…',
};

export default function PublishTemplateDialog({
  project,
  userId,
  creatorName,
  onClose,
  onPublished,
}: PublishTemplateDialogProps) {
  const [title, setTitle] = useState(project.name || 'Untitled Carousel');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('Creator');
  const [visibility, setVisibility] = useState<TemplateVisibility>('public');
  const [stage, setStage] = useState<PublishStage | 'idle' | 'done'>('idle');
  const [error, setError] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('');

  const busy = stage === 'thumbnail' || stage === 'saving';
  const firstSlide = project.slides[0];

  const handlePublish = async () => {
    if (busy || stage === 'done') return;
    setError('');
    try {
      const { id } = await publishTemplateFromProject(
        { project, title, description, category, visibility, userId, creatorName },
        s => setStage(s)
      );
      setNewTemplateId(id);
      setStage('done');
      onPublished(id);
    } catch (err: any) {
      console.error('Publish template failed:', err);
      setError(err?.message || 'Failed to publish template. Please try again.');
      setStage('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget && !busy) onClose(); }}
    >
      <div className="bg-[#1A1916] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 w-[420px] max-w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#F7F5F0]">
        {stage === 'done' ? (
          /* ── SUCCESS ── */
          <div className="text-center py-4">
            <CheckCircle2 size={48} className="mx-auto text-[#22C55E] mb-4" />
            <h2 className="text-[18px] font-bold mb-2">Template published 🎉</h2>
            <p className="text-[13px] text-[rgba(247,245,240,0.6)] mb-6">
              {visibility === 'public'
                ? 'Anyone can now find and use your template in the Community gallery.'
                : 'Your template is private — only you can see and use it.'}
            </p>
            <div className="flex gap-2">
              <Link
                to={`/templates/${newTemplateId}`}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[13px] flex items-center justify-center transition-all no-underline"
              >
                View in gallery
              </Link>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.14)] text-white font-semibold text-[13px] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ── FORM ── */
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-bold">Publish as Template</h2>
              <button
                onClick={onClose}
                disabled={busy}
                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* Thumbnail preview */}
            {firstSlide && (
              <div className="flex justify-center mb-5">
                <div
                  className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
                  style={{ width: 108, height: 135 }}
                >
                  <SlidePreview slide={firstSlide} scale={108 / 1080} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">Title</p>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={80}
                placeholder="Give your template a catchy title"
                disabled={busy}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[rgba(247,245,240,0.3)] outline-none focus:border-[#FF5A00] transition-colors disabled:opacity-50"
              />
            </div>

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">
                Description <span className="normal-case tracking-normal">(optional)</span>
              </p>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="What is this template great for?"
                disabled={busy}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-[rgba(247,245,240,0.3)] outline-none focus:border-[#FF5A00] transition-colors resize-none disabled:opacity-50"
              />
            </div>

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">Category</p>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TemplateCategory)}
                disabled={busy}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-[#FF5A00] transition-colors disabled:opacity-50 [&>option]:text-black"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] mb-2">Visibility</p>
              <div className="flex gap-2">
                {([
                  { v: 'public' as TemplateVisibility, icon: Globe, title: 'Public', desc: 'Anyone can use it' },
                  { v: 'private' as TemplateVisibility, icon: Lock, title: 'Private', desc: 'Only you can see it' },
                ]).map(({ v, icon: Icon, title: t, desc }) => (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    disabled={busy}
                    className={`flex-1 p-3 rounded-xl text-left transition-all border disabled:opacity-50 ${
                      visibility === v
                        ? 'bg-[rgba(255,90,0,0.12)] border-[#FF5A00]'
                        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={visibility === v ? 'text-[#FF5A00]' : 'text-[rgba(247,245,240,0.5)]'} />
                      <span className="text-[13px] font-bold">{t}</span>
                    </div>
                    <p className="text-[11px] text-[rgba(247,245,240,0.5)]">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-[12px] text-[#F87171] bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.25)] rounded-xl px-3.5 py-2.5 mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handlePublish}
              disabled={busy || !title.trim()}
              className="w-full py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {STAGE_LABEL[stage as PublishStage]}
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  Publish Template
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-[rgba(247,245,240,0.4)] mt-3">
              {project.slides.length} slide{project.slides.length === 1 ? '' : 's'}
              {firstSlide ? ` · ${firstSlide.width} × ${firstSlide.height}px` : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
