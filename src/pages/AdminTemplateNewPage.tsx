import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, X, Link as LinkIcon, AlertCircle, CheckCircle, GripVertical,
  ArrowRight, ArrowLeft, Save, Send, RefreshCw, Sparkles, Image as ImageIcon,
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { ToastContainer, PageHeader, AdminInput, AdminSelect, AdminTextarea } from '../components/admin/AdminUI';
import type { Toast } from '../components/admin/AdminUI';
import { SlideModal } from '../components/admin/AdminUI';
import { createTemplateDraft, publishTemplate, uploadSlideImage } from '../lib/adminApi';
import { createSlideUploadItems, WIZARD_STEPS, WizardStep, parseTags, formatFileSize } from '../lib/adminUtils';
import { SlideUploadItem, TemplateFormData, TemplateCategory, TemplateSourceType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES: TemplateCategory[] = [
  'AI', 'Business', 'Marketing', 'Education', 'Personal Brand',
  'Creator', 'SaaS', 'Finance', 'Productivity', 'Motivation', 'Product', 'Quotes', 'Other',
];

const STYLES = ['Minimal', 'Editorial', 'Bold', 'Dark', 'Typography', 'Educational', 'Luxury', 'Corporate', 'Playful', 'Modern', 'Data', 'Personal Brand'];
const AUDIENCES = ['Creators', 'Founders', 'Marketers', 'Agencies', 'Businesses', 'Coaches', 'Educators', 'Influencers', 'General'];

// ---- STEP PROGRESS BAR ------------------------------------------------------
function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {WIZARD_STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
              i < current ? 'bg-[#FF5A00] text-white' :
              i === current ? 'bg-[#FF5A00] text-white ring-4 ring-[rgba(255,90,0,0.2)]' :
              'bg-[rgba(255,255,255,0.08)] text-[rgba(247,245,240,0.3)]'
            }`}>
              {i < current ? <CheckCircle size={13} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium hidden md:block ${
              i === current ? 'text-[#FF5A00]' : 'text-[rgba(247,245,240,0.3)]'
            }`}>
              {step.label.split(' ')[1]}
            </span>
          </div>
          {i < WIZARD_STEPS.length - 1 && (
            <div className="flex-1 h-px max-w-[40px] mx-1" style={{
              background: i < current ? '#FF5A00' : 'rgba(255,255,255,0.08)',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ---- SLIDE UPLOAD CARD ------------------------------------------------------
function SlideCard({
  item, index, total, onRemove, onReplace, onPreview,
}: {
  item: SlideUploadItem;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onReplace: (id: string, file: File) => void;
  onPreview: (index: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const statusColors: Record<string, string> = {
    pending: 'text-[rgba(247,245,240,0.4)]',
    uploading: 'text-amber-400',
    processing: 'text-blue-400',
    done: 'text-green-400',
    error: 'text-red-400',
  };
  const statusLabels: Record<string, string> = {
    pending: 'Ready',
    uploading: 'Uploading...',
    processing: 'Processing...',
    done: '✓ Uploaded',
    error: '✗ Failed',
  };

  return (
    <div className="relative group bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
      {/* Image */}
      <img
        src={item.previewDataUrl}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onPreview(index)}
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => fileRef.current?.click()}
          className="bg-white/90 text-[#111] text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors"
        >
          Replace
        </button>
        <button
          onClick={() => onRemove(item.localId)}
          className="bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Slide number */}
      <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
        {index + 1}
      </div>

      {/* Status */}
      <div className={`absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-semibold text-center ${statusColors[item.status]}`}>
        {statusLabels[item.status]}
        {item.status === 'error' && (
          <span className="ml-1 underline cursor-pointer" onClick={() => onReplace(item.localId, item.file)}>Retry</span>
        )}
      </div>

      {/* Warning for wrong dimensions */}
      {item.width && item.height && (item.width !== 1080 || item.height !== 1350) && (
        <div className="absolute top-1.5 right-1.5">
          <div title={`${item.width}×${item.height}px — not 4:5`} className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
            <AlertCircle size={10} className="text-black" />
          </div>
        </div>
      )}

      {/* Drag handle */}
      <div className="absolute top-1/2 right-1.5 -translate-y-1/2 opacity-0 group-hover:opacity-60 cursor-grab">
        <GripVertical size={14} className="text-white" />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onReplace(item.localId, file);
        }}
      />
    </div>
  );
}

// ---- MAIN PAGE --------------------------------------------------------------
export default function AdminTemplateNewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1 — Source
  const [sourceMode, setSourceMode] = useState<'instagram' | 'upload'>('upload');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramSaved, setInstagramSaved] = useState(false);

  // Step 2 — Slides
  const [slides, setSlides] = useState<SlideUploadItem[]>([]);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [slideModalIndex, setSlideModalIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Step 3 — Details
  const [form, setForm] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'AI',
    tags: [],
    sourceType: 'original',
    attributionRequired: false,
    isTrending: false,
    isNew: true,
  });
  const [tagsInput, setTagsInput] = useState('');
  const [nameError, setNameError] = useState('');

  // Step 5 — Publishing
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const addToast = (type: Toast['type'], message: string) => {
    const id = uuidv4();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
  };
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  // ---- Slide management ----------------------------------------------------
  const addFiles = useCallback(async (files: File[]) => {
    const { items, skipped, errors } = await createSlideUploadItems(files, slides.length, 20);
    if (errors.length > 0) errors.forEach(e => addToast('error', e));
    if (skipped > 0) addToast('warning', `${skipped} file(s) skipped — max 20 slides.`);
    setSlides(prev => [...prev, ...items]);
  }, [slides.length]);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    await addFiles(files);
  };

  const removeSlide = (localId: string) => setSlides(prev => prev.filter(s => s.localId !== localId));

  const replaceSlide = async (localId: string, file: File) => {
    const { items } = await createSlideUploadItems([file], 0, 1);
    if (items.length === 0) return;
    setSlides(prev => prev.map(s => s.localId === localId ? { ...items[0], localId } : s));
  };

  // ---- Validation ----------------------------------------------------------
  const validateStep = (stepIdx: number): boolean => {
    if (stepIdx === 1 && slides.length === 0) {
      addToast('error', 'Add at least one slide to continue.');
      return false;
    }
    if (stepIdx === 2 && !form.name.trim()) {
      setNameError('Template name is required.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep(s => Math.min(WIZARD_STEPS.length - 1, s + 1));
    window.scrollTo(0, 0);
  };
  const goBack = () => setStep(s => Math.max(0, s - 1));

  // ---- Upload all slides ---------------------------------------------------
  const uploadAllSlides = async (templateId: string): Promise<Array<{ publicUrl: string; storagePath: string; width?: number; height?: number }>> => {
    const results: Array<{ publicUrl: string; storagePath: string; width?: number; height?: number }> = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      setSlides(prev => prev.map(s => s.localId === slide.localId ? { ...s, status: 'uploading' } : s));

      const result = await uploadSlideImage(templateId, i, slide.file);
      if (result) {
        setSlides(prev => prev.map(s => s.localId === slide.localId ? { ...s, status: 'done', publicUrl: result.publicUrl, storagePath: result.storagePath } : s));
        results.push({ ...result, width: slide.width, height: slide.height });
      } else {
        setSlides(prev => prev.map(s => s.localId === slide.localId ? { ...s, status: 'done', publicUrl: slide.previewDataUrl } : s));
        // Use local data URL as fallback
        results.push({ publicUrl: slide.previewDataUrl, storagePath: '', width: slide.width, height: slide.height });
      }
    }
    return results;
  };

  // ---- Save Draft ----------------------------------------------------------
  const handleSaveDraft = async () => {
    if (!form.name.trim()) { addToast('error', 'Template name is required.'); return; }
    if (slides.length === 0) { addToast('error', 'At least one slide is required.'); return; }
    setSaving(true);

    const tempId = uuidv4();
    const tags = parseTags(tagsInput);
    const formWithTags = { ...form, tags };

    const uploadedSlides = await uploadAllSlides(tempId);
    const result = await createTemplateDraft(formWithTags, uploadedSlides, uploadedSlides[0]?.publicUrl, user?.id);

    setCreatedId(result?.id || tempId);
    addToast('success', 'Template saved as draft.');
    setStep(4);
    setSaving(false);
  };

  // ---- Publish -------------------------------------------------------------
  const handlePublish = async () => {
    if (!form.name.trim()) { addToast('error', 'Template name is required.'); return; }
    if (slides.length === 0) { addToast('error', 'At least one slide is required.'); return; }
    setSaving(true);

    let targetId = createdId;
    if (!targetId) {
      const tempId = uuidv4();
      const tags = parseTags(tagsInput);
      const formWithTags = { ...form, tags };
      const uploadedSlides = await uploadAllSlides(tempId);
      const result = await createTemplateDraft(formWithTags, uploadedSlides, uploadedSlides[0]?.publicUrl, user?.id);
      targetId = result?.id || tempId;
      setCreatedId(targetId);
    }

    const ok = await publishTemplate(targetId, user?.id);
    setSaving(false);
    if (ok) {
      addToast('success', 'Template published successfully! It is now live on the templates page.');
      setTimeout(() => navigate('/templates'), 1000);
    } else {
      addToast('error', 'Failed to publish template.');
    }
  };

  // ---- Render steps --------------------------------------------------------
  const renderStep = () => {
    switch (step) {
      // STEP 0 — SOURCE
      case 0:
        return (
          <div>
            <h2 className="text-[20px] font-bold text-[#F7F5F0] mb-2">Choose a Source</h2>
            <p className="text-[13px] text-[rgba(247,245,240,0.45)] mb-8">Start by specifying where this carousel comes from, or upload slides directly.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: 'upload', label: 'Upload Slides', sub: 'Upload PNG/JPG/WEBP images directly', icon: Upload },
                { id: 'instagram', label: 'Instagram Reference', sub: 'Save an Instagram post URL as reference', icon: LinkIcon },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSourceMode(opt.id as 'instagram' | 'upload')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    sourceMode === opt.id
                      ? 'border-[#FF5A00] bg-[rgba(255,90,0,0.06)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[#1a1917] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <opt.icon size={22} className={sourceMode === opt.id ? 'text-[#FF5A00] mb-3' : 'text-[rgba(247,245,240,0.4)] mb-3'} />
                  <p className="text-[15px] font-semibold text-[rgba(247,245,240,0.9)] mb-1">{opt.label}</p>
                  <p className="text-[12px] text-[rgba(247,245,240,0.4)]">{opt.sub}</p>
                </button>
              ))}
            </div>

            {sourceMode === 'instagram' && (
              <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
                <div className="flex items-start gap-3 bg-[rgba(255,90,0,0.06)] border border-[rgba(255,90,0,0.15)] rounded-xl p-4 mb-5">
                  <AlertCircle size={15} className="text-[#FF5A00] mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-[rgba(247,245,240,0.55)] leading-relaxed">
                    Instagram media import is not connected. Save the URL as reference metadata, then upload the slides manually in the next step.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] font-medium mb-2">Instagram Post URL</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3">
                      <LinkIcon size={13} className="text-[rgba(247,245,240,0.3)] flex-shrink-0" />
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={e => setInstagramUrl(e.target.value)}
                        placeholder="https://www.instagram.com/p/XXXXXXXX/"
                        className="flex-1 bg-transparent text-[13px] text-[rgba(247,245,240,0.7)] py-2.5 outline-none placeholder:text-[rgba(247,245,240,0.2)]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (instagramUrl) {
                          setInstagramSaved(true);
                          setForm(f => ({ ...f, sourceUrl: instagramUrl, sourcePlatform: 'instagram', sourceType: 'reference_inspired' }));
                          addToast('success', 'Instagram reference URL saved.');
                        }
                      }}
                      className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] text-[rgba(247,245,240,0.7)] px-4 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap"
                    >
                      Save Reference
                    </button>
                  </div>
                  {instagramSaved && (
                    <p className="flex items-center gap-1.5 text-[11px] text-green-400 mt-2">
                      <CheckCircle size={11} /> Reference URL saved. Upload slides manually in the next step.
                    </p>
                  )}
                </div>
              </div>
            )}

            {sourceMode === 'upload' && (
              <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
                <p className="text-[13px] text-[rgba(247,245,240,0.5)] leading-relaxed">
                  You will upload the carousel slide images in the next step. Each slide becomes a page in the canvas editor.
                </p>
              </div>
            )}
          </div>
        );

      // STEP 1 — SLIDES
      case 1:
        return (
          <div>
            <h2 className="text-[20px] font-bold text-[#F7F5F0] mb-2">Upload Carousel Slides</h2>
            <p className="text-[13px] text-[rgba(247,245,240,0.45)] mb-6">{slides.length} / 20 slides added.</p>

            {/* Dropzone */}
            {slides.length < 20 && (
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
                  isDragOver
                    ? 'border-[#FF5A00] bg-[rgba(255,90,0,0.05)]'
                    : 'border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]'
                }`}
              >
                <Upload size={28} className="mx-auto mb-3 text-[rgba(247,245,240,0.3)]" />
                <p className="text-[15px] font-semibold text-[rgba(247,245,240,0.7)] mb-1">Drag carousel slides here</p>
                <p className="text-[13px] text-[rgba(247,245,240,0.35)] mb-1">or click to choose images</p>
                <p className="text-[11px] text-[rgba(247,245,240,0.2)]">PNG · JPG · WEBP · Up to 20 slides · 10MB each · Recommended 1080×1350 (4:5)</p>
              </div>
            )}

            {slides.length >= 20 && (
              <div className="flex items-center gap-2 bg-[rgba(255,90,0,0.08)] border border-[rgba(255,90,0,0.2)] rounded-xl px-4 py-3 mb-5">
                <AlertCircle size={14} className="text-[#FF5A00]" />
                <p className="text-[13px] text-[#FF5A00] font-medium">Maximum 20 slides reached.</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={e => addFiles(Array.from(e.target.files || []))}
            />

            {/* Slides grid */}
            {slides.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-medium text-[rgba(247,245,240,0.6)]">{slides.length} slide{slides.length !== 1 ? 's' : ''} ready</p>
                  {slides.length < 20 && (
                    <button onClick={() => fileInputRef.current?.click()} className="text-[12px] text-[#FF5A00] hover:text-[#e05000] transition-colors font-medium">
                      + Add more
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {slides.map((slide, i) => (
                    <SlideCard
                      key={slide.localId}
                      item={slide}
                      index={i}
                      total={slides.length}
                      onRemove={removeSlide}
                      onReplace={replaceSlide}
                      onPreview={() => { setSlideModalIndex(i); setSlideModalOpen(true); }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // STEP 2 — DETAILS
      case 2:
        return (
          <div>
            <h2 className="text-[20px] font-bold text-[#F7F5F0] mb-2">Template Details</h2>
            <p className="text-[13px] text-[rgba(247,245,240,0.45)] mb-8">Complete the template metadata so users can find and understand this carousel.</p>

            <div className="flex flex-col gap-6">
              {/* Name */}
              <AdminInput
                label="Template Name"
                required
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setNameError(''); }}
                placeholder='e.g. "7 AI Tools Every Creator Needs"'
                maxLength={120}
                charCount={{ current: form.name.length, max: 120 }}
                error={nameError}
              />

              {/* Description */}
              <AdminTextarea
                label="Description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe this template structure and use case..."
                rows={3}
                hint="Helps users understand when to use this template."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <AdminSelect
                  label="Category"
                  required
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as TemplateCategory }))}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </AdminSelect>

                {/* Style */}
                <AdminSelect
                  label="Style"
                  value={form.style || ''}
                  onChange={e => setForm(f => ({ ...f, style: e.target.value as typeof f.style }))}
                >
                  <option value="">— None —</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </AdminSelect>

                {/* Audience */}
                <AdminSelect
                  label="Audience"
                  value={form.audience || ''}
                  onChange={e => setForm(f => ({ ...f, audience: e.target.value as typeof f.audience }))}
                >
                  <option value="">— None —</option>
                  {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                </AdminSelect>

                {/* Source type */}
                <AdminSelect
                  label="Source Type"
                  value={form.sourceType}
                  onChange={e => setForm(f => ({ ...f, sourceType: e.target.value as TemplateSourceType }))}
                >
                  <option value="original">Original</option>
                  <option value="licensed">Licensed</option>
                  <option value="generated">AI Generated</option>
                  <option value="reference_inspired">Reference Inspired</option>
                </AdminSelect>
              </div>

              {/* Tags */}
              <AdminInput
                label="Tags"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="ai, creator, education, tools..."
                hint="Comma or space separated. Users can search by tag."
              />
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5 -mt-4">
                  {parseTags(tagsInput).map(tag => (
                    <span key={tag} className="text-[10px] bg-[rgba(255,90,0,0.1)] text-[#FF5A00] border border-[rgba(255,90,0,0.2)] px-2 py-0.5 rounded-full capitalize">{tag}</span>
                  ))}
                </div>
              )}

              {/* Source URL */}
              {(form.sourceType === 'reference_inspired' || instagramUrl) && (
                <AdminInput
                  label="Source / Reference URL"
                  value={form.sourceUrl || instagramUrl}
                  onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))}
                  placeholder="https://www.instagram.com/p/..."
                  hint="URL of the original post for reference."
                />
              )}

              {/* License notes */}
              <AdminTextarea
                label="License / Rights Notes"
                value={form.licenseNotes || ''}
                onChange={e => setForm(f => ({ ...f, licenseNotes: e.target.value }))}
                placeholder="Copyright or usage rights information..."
                rows={2}
              />

              {/* Flags */}
              <div className="flex gap-6">
                {(
                  [
                    { key: 'isTrending', label: 'Mark as Trending' },
                    { key: 'isNew', label: 'Mark as New' },
                    { key: 'attributionRequired', label: 'Attribution Required' },
                  ] as const
                ).map(flag => (
                  <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(form[flag.key])}
                      onChange={e => setForm(f => ({ ...f, [flag.key]: e.target.checked }))}
                      className="w-4 h-4 rounded accent-[#FF5A00]"
                    />
                    <span className="text-[13px] text-[rgba(247,245,240,0.65)]">{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      // STEP 3 — REVIEW
      case 3:
        return (
          <div>
            <h2 className="text-[20px] font-bold text-[#F7F5F0] mb-2">Review Template</h2>
            <p className="text-[13px] text-[rgba(247,245,240,0.45)] mb-8">Check everything before saving or publishing.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: thumbnail + info */}
              <div className="lg:col-span-1">
                {slides.length > 0 && (
                  <div className="rounded-2xl overflow-hidden mb-4 bg-[#1a1917] border border-[rgba(255,255,255,0.06)]" style={{ aspectRatio: '4/5' }}>
                    <img src={slides[0].previewDataUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex flex-col gap-2">
                  {[
                    { label: 'Category', value: form.category },
                    { label: 'Style', value: form.style || '—' },
                    { label: 'Audience', value: form.audience || '—' },
                    { label: 'Source', value: form.sourceType.replace('_', ' ') },
                    { label: 'Slides', value: slides.length },
                    { label: 'Dimensions', value: '1080 × 1350' },
                    { label: 'Trending', value: form.isTrending ? 'Yes' : 'No' },
                    { label: 'New', value: form.isNew ? 'Yes' : 'No' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center">
                      <span className="text-[11px] text-[rgba(247,245,240,0.35)]">{r.label}</span>
                      <span className="text-[12px] font-medium text-[rgba(247,245,240,0.7)] capitalize">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: details */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-4">
                  <p className="text-[18px] font-bold text-[#F7F5F0] mb-2">{form.name || <span className="text-[rgba(247,245,240,0.3)]">No name set</span>}</p>
                  {form.description && <p className="text-[13px] text-[rgba(247,245,240,0.5)] leading-relaxed">{form.description}</p>}
                  {parseTags(tagsInput).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {parseTags(tagsInput).map(tag => (
                        <span key={tag} className="text-[10px] bg-[rgba(255,90,0,0.1)] text-[#FF5A00] border border-[rgba(255,90,0,0.2)] px-2 py-0.5 rounded-full capitalize">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Slide strip */}
                <p className="text-[12px] font-semibold text-[rgba(247,245,240,0.5)] uppercase tracking-widest mb-3">{slides.length} Slides</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slides.map((slide, i) => (
                    <div
                      key={slide.localId}
                      className="rounded-xl overflow-hidden bg-[#1a1917] border border-[rgba(255,255,255,0.06)] cursor-pointer hover:border-[#FF5A00] transition-all"
                      style={{ aspectRatio: '4/5' }}
                      onClick={() => { setSlideModalIndex(i); setSlideModalOpen(true); }}
                    >
                      <img src={slide.previewDataUrl} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* AI Convert placeholder */}
                <div className="mt-5 flex items-center gap-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                  <Sparkles size={18} className="text-[rgba(247,245,240,0.2)]" />
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-[rgba(247,245,240,0.4)]">✨ Convert to Editable Template</p>
                    <p className="text-[11px] text-[rgba(247,245,240,0.25)]">AI analysis, OCR, layer detection — coming soon.</p>
                  </div>
                  <span className="text-[10px] bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.3)] px-2 py-1 rounded-lg">Soon</span>
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 4 — PUBLISH (final)
      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,90,0,0.12)] flex items-center justify-center mx-auto mb-5">
              {createdId ? <CheckCircle size={28} className="text-[#FF5A00]" /> : <Save size={28} className="text-[rgba(247,245,240,0.4)]" />}
            </div>
            <h2 className="text-[22px] font-bold text-[#F7F5F0] mb-3">
              {createdId ? 'Template Saved!' : 'Ready to Save'}
            </h2>
            <p className="text-[14px] text-[rgba(247,245,240,0.45)] mb-8 max-w-sm mx-auto leading-relaxed">
              {createdId
                ? 'Your template is saved as a draft. Publish it to make it available to all users on the templates page.'
                : 'Review your template and publish it when ready.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!createdId && (
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center gap-2 justify-center px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.12)] text-[14px] font-semibold text-[rgba(247,245,240,0.6)] hover:text-[rgba(247,245,240,0.9)] transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
              )}
              <button
                onClick={handlePublish}
                disabled={saving}
                className="flex items-center gap-2 justify-center px-6 py-3 rounded-xl bg-[#FF5A00] text-white text-[14px] font-semibold hover:bg-[#e05000] transition-all disabled:opacity-50"
              >
                <Send size={16} />
                {saving ? 'Publishing...' : 'Publish Template'}
              </button>
            </div>
            {createdId && (
              <div className="flex gap-3 justify-center mt-4">
                <a href={`/admin/templates/${createdId}`} className="text-[13px] text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.6)] transition-colors">
                  View template details &rarr;
                </a>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <PageHeader
          title="Create Carousel Template"
          subtitle="Add a carousel that users can customize inside SWAPP.AI."
          back={{ label: 'All Templates', to: '/admin/templates' }}
        />

        <StepProgress current={step} />

        <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 md:p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.10)] text-[13px] font-medium text-[rgba(247,245,240,0.5)] hover:text-[rgba(247,245,240,0.8)] transition-all disabled:opacity-30"
            >
              <ArrowLeft size={15} /> Back
            </button>

            {step === 3 ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.10)] text-[13px] font-semibold text-[rgba(247,245,240,0.6)] hover:text-[rgba(247,245,240,0.9)] transition-all disabled:opacity-50"
                >
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#FF5A00] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#e05000] transition-all disabled:opacity-50"
                >
                  <Send size={15} /> {saving ? 'Publishing...' : 'Publish Template'}
                </button>
              </div>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-2 bg-[#FF5A00] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#e05000] transition-all"
              >
                Continue <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <SlideModal
        open={slideModalOpen}
        slides={slides.map((s, i) => ({ src: s.previewDataUrl, label: `Slide ${i + 1}` }))}
        currentIndex={slideModalIndex}
        onNavigate={setSlideModalIndex}
        onClose={() => setSlideModalOpen(false)}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
