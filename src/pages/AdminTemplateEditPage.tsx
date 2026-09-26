import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Eye, Send, Archive, RotateCcw, Trash2, Copy, ArrowLeft,
  Save, Edit3, Sparkles, Upload, X, CheckCircle,
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { StatusBadge, ConfirmDialog, ToastContainer, PageHeader, AdminInput, AdminSelect, AdminTextarea } from '../components/admin/AdminUI';
import type { Toast } from '../components/admin/AdminUI';
import { SlideModal } from '../components/admin/AdminUI';
import {
  fetchTemplateAdmin, updateTemplate, publishTemplate, unpublishTemplate,
  archiveTemplate, restoreTemplate, deleteTemplate, duplicateTemplate,
} from '../lib/adminApi';
import { getTemplateById } from '../lib/templates'; // local fallback
import { Template, TemplateFormData, TemplateCategory, TemplateSourceType } from '../types';
import { formatDate, parseTags } from '../lib/adminUtils';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES: TemplateCategory[] = [
  'AI', 'Business', 'Marketing', 'Education', 'Personal Brand',
  'Creator', 'SaaS', 'Finance', 'Productivity', 'Motivation', 'Product', 'Quotes', 'Other',
];
const STYLES = ['Minimal', 'Editorial', 'Bold', 'Dark', 'Typography', 'Educational', 'Luxury', 'Corporate', 'Playful', 'Modern', 'Data', 'Personal Brand'];
const AUDIENCES = ['Creators', 'Founders', 'Marketers', 'Agencies', 'Businesses', 'Coaches', 'Educators', 'Influencers', 'General'];

export default function AdminTemplateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void } | null>(null);
  const [slideModal, setSlideModal] = useState({ open: false, index: 0 });

  // Edit form state
  const [form, setForm] = useState<TemplateFormData & { tagsInput: string }>({
    name: '', description: '', category: 'AI', tags: [], tagsInput: '',
    sourceType: 'original', attributionRequired: false, isTrending: false, isNew: false,
  });

  const addToast = (type: Toast['type'], message: string) => {
    const id2 = uuidv4();
    setToasts(t => [...t, { id: id2, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id2)), 5000);
  };
  const removeToast = (id2: string) => setToasts(t => t.filter(x => x.id !== id2));

  const loadTemplate = async () => {
    if (!id) return;
    setLoading(true);
    let tpl = await fetchTemplateAdmin(id);
    if (!tpl) tpl = getTemplateById(id) || null; // local fallback
    setTemplate(tpl);
    if (tpl) {
      setForm({
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        tags: tpl.tags,
        tagsInput: tpl.tags.join(', '),
        style: tpl.style,
        audience: tpl.audience,
        sourceType: tpl.sourceType,
        sourceUrl: tpl.sourceUrl,
        attributionRequired: tpl.attributionRequired,
        licenseNotes: tpl.licenseNotes,
        isTrending: tpl.isTrending,
        isNew: tpl.isNew,
      });
    }
    setLoading(false);
  };

  useEffect(() => { loadTemplate(); }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const tags = parseTags(form.tagsInput);
    await updateTemplate(id, { ...form, tags });
    addToast('success', 'Template updated successfully.');
    setSaving(false);
    setEditing(false);
    loadTemplate();
  };

  const handlePublish = async () => {
    if (!id) return;
    await publishTemplate(id, user?.id);
    addToast('success', 'Template published! It is now live on the templates page.');
    loadTemplate();
  };

  const handleUnpublish = async () => {
    if (!id) return;
    await unpublishTemplate(id);
    addToast('success', 'Template unpublished.');
    loadTemplate();
  };

  const handleArchive = () => {
    setConfirm({
      open: true,
      title: 'Archive Template',
      message: 'This will hide the template from public. Existing user projects are unaffected.',
      onConfirm: async () => {
        if (!id) return;
        await archiveTemplate(id);
        addToast('success', 'Template archived.');
        setConfirm(null);
        loadTemplate();
      },
    });
  };

  const handleRestore = async () => {
    if (!id) return;
    await restoreTemplate(id);
    addToast('success', 'Template restored to draft.');
    loadTemplate();
  };

  const handleDuplicate = async () => {
    if (!id) return;
    const result = await duplicateTemplate(id, user?.id);
    if (result) {
      addToast('success', 'Template duplicated as draft.');
      navigate(`/admin/templates/${result.id}`);
    } else {
      addToast('error', 'Could not duplicate template.');
    }
  };

  const handleDelete = () => {
    setConfirm({
      open: true,
      title: 'Delete Template Permanently',
      message: 'This action cannot be undone. Existing user projects based on this template are not affected.',
      onConfirm: async () => {
        if (!id) return;
        await deleteTemplate(id);
        setConfirm(null);
        addToast('success', 'Template deleted.');
        navigate('/admin/templates');
      },
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-[rgba(255,255,255,0.06)] rounded-xl" />
            <div className="h-64 bg-[rgba(255,255,255,0.04)] rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!template) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-[16px] text-[rgba(247,245,240,0.4)] mb-4">Template not found.</p>
            <Link to="/admin/templates" className="text-[#FF5A00] text-[14px] font-medium hover:underline">
              &larr; Back to templates
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <Link to="/admin/templates" className="mt-1 p-2 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.7)] hover:bg-[rgba(255,255,255,0.04)] transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#F7F5F0]">{template.name}</h1>
                <StatusBadge status={template.status} />
              </div>
              <p className="text-[13px] text-[rgba(247,245,240,0.35)]">
                {template.category} · {template.slideCount} slides · Created {formatDate(template.createdAt)}
                {template.publishedAt && ` · Published ${formatDate(template.publishedAt)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/templates/${template.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] text-[12px] font-medium text-[rgba(247,245,240,0.55)] hover:text-[rgba(247,245,240,0.8)] transition-all"
            >
              <Eye size={13} /> Preview as User
            </Link>
            <button onClick={handleDuplicate} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] text-[12px] font-medium text-[rgba(247,245,240,0.55)] hover:text-[rgba(247,245,240,0.8)] transition-all">
              <Copy size={13} /> Duplicate
            </button>
            {template.status === 'archived' ? (
              <button onClick={handleRestore} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] text-[12px] font-medium text-blue-400 hover:text-blue-300 transition-all">
                <RotateCcw size={13} /> Restore
              </button>
            ) : (
              <button onClick={handleArchive} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] text-[12px] font-medium text-[rgba(247,245,240,0.55)] hover:text-[rgba(247,245,240,0.8)] transition-all">
                <Archive size={13} /> Archive
              </button>
            )}
            {template.status === 'published' ? (
              <button onClick={handleUnpublish} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-400/30 text-[12px] font-medium text-amber-400 hover:text-amber-300 transition-all">
                <RotateCcw size={13} /> Unpublish
              </button>
            ) : template.status !== 'archived' ? (
              <button onClick={handlePublish} className="flex items-center gap-1.5 bg-[#FF5A00] text-white px-3.5 py-2 rounded-lg text-[12px] font-semibold hover:bg-[#e05000] transition-all">
                <Send size={13} /> Publish
              </button>
            ) : null}
            <button onClick={handleDelete} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-400/20 text-[12px] font-medium text-red-400/70 hover:text-red-400 hover:border-red-400/40 transition-all">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: slides + edit form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Slides */}
            <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-[#F7F5F0]">{template.slides.length || template.slideCount} Slides</h2>
              </div>
              {template.slides.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {template.slides.map((slide, i) => {
                    const imgSrc = slide.previewUrl || (slide.background.type === 'image' ? slide.background.value : undefined);
                    return (
                      <div
                        key={slide.id}
                        className="relative rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FF5A00] transition-all group"
                        style={{ aspectRatio: '4/5', background: slide.background.type === 'solid' ? slide.background.value : '#333' }}
                        onClick={() => setSlideModal({ open: true, index: i })}
                      >
                        {imgSrc && <img src={imgSrc} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />}
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{i + 1}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[13px] text-[rgba(247,245,240,0.3)]">No slides loaded. Connect Supabase to see slide data.</p>
                </div>
              )}

              {/* AI Convert placeholder */}
              <div className="mt-5 flex items-center gap-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3.5 cursor-not-allowed opacity-60">
                <Sparkles size={15} className="text-[rgba(247,245,240,0.3)]" />
                <div>
                  <p className="text-[11px] font-semibold text-[rgba(247,245,240,0.4)]">✨ Convert to Editable Template</p>
                  <p className="text-[10px] text-[rgba(247,245,240,0.25)]">AI analysis, OCR, layer detection — coming soon.</p>
                </div>
                <span className="ml-auto text-[10px] bg-[rgba(255,255,255,0.05)] text-[rgba(247,245,240,0.3)] px-2 py-0.5 rounded-full">Soon</span>
              </div>
            </div>

            {/* Edit form */}
            <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-[#F7F5F0]">Template Details</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-[12px] font-medium text-[#FF5A00] hover:text-[#e05000] transition-colors">
                    <Edit3 size={13} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="text-[12px] text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)] transition-colors">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#FF5A00] hover:text-[#e05000] transition-colors disabled:opacity-50">
                      <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="flex flex-col gap-4">
                  <AdminInput
                    label="Template Name"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    maxLength={120}
                    charCount={{ current: form.name.length, max: 120 }}
                  />
                  <AdminTextarea
                    label="Description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <AdminSelect label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TemplateCategory }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </AdminSelect>
                    <AdminSelect label="Style" value={form.style || ''} onChange={e => setForm(f => ({ ...f, style: e.target.value as typeof f.style }))}>
                      <option value="">— None —</option>
                      {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </AdminSelect>
                    <AdminSelect label="Audience" value={form.audience || ''} onChange={e => setForm(f => ({ ...f, audience: e.target.value as typeof f.audience }))}>
                      <option value="">— None —</option>
                      {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                    </AdminSelect>
                    <AdminSelect label="Source Type" value={form.sourceType} onChange={e => setForm(f => ({ ...f, sourceType: e.target.value as TemplateSourceType }))}>
                      <option value="original">Original</option>
                      <option value="licensed">Licensed</option>
                      <option value="generated">AI Generated</option>
                      <option value="reference_inspired">Reference Inspired</option>
                    </AdminSelect>
                  </div>
                  <AdminInput label="Tags" value={form.tagsInput} onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))} placeholder="ai, creator, marketing..." />
                  <AdminInput label="Source URL" value={form.sourceUrl || ''} onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))} placeholder="https://..." />
                  <AdminTextarea label="License Notes" value={form.licenseNotes || ''} onChange={e => setForm(f => ({ ...f, licenseNotes: e.target.value }))} rows={2} />
                  <div className="flex gap-5">
                    {(
                      [
                        { key: 'isTrending', label: 'Trending' },
                        { key: 'isNew', label: 'New' },
                        { key: 'attributionRequired', label: 'Attribution Required' },
                      ] as const
                    ).map(flag => (
                      <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(form[flag.key])}
                          onChange={e => setForm(f => ({ ...f, [flag.key]: e.target.checked }))}
                          className="accent-[#FF5A00]"
                        />
                        <span className="text-[12px] text-[rgba(247,245,240,0.6)]">{flag.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: template.category },
                    { label: 'Style', value: template.style || '—' },
                    { label: 'Audience', value: template.audience || '—' },
                    { label: 'Source Type', value: template.sourceType.replace('_', ' ') },
                    { label: 'Aspect Ratio', value: template.aspectRatio },
                    { label: 'Dimensions', value: `${template.width} × ${template.height}` },
                    { label: 'Trending', value: template.isTrending ? 'Yes' : 'No' },
                    { label: 'New', value: template.isNew ? 'Yes' : 'No' },
                    { label: 'Attribution', value: template.attributionRequired ? 'Required' : 'Not required' },
                    { label: 'Use Count', value: template.useCount || 0 },
                  ].map(r => (
                    <div key={r.label} className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3">
                      <p className="text-[9px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-1">{r.label}</p>
                      <p className="text-[12px] font-medium text-[rgba(247,245,240,0.65)] capitalize">{r.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags display */}
              {!editing && template.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-[rgba(255,90,0,0.1)] text-[#FF5A00] border border-[rgba(255,90,0,0.15)] px-2 py-0.5 rounded-full capitalize">{tag}</span>
                  ))}
                </div>
              )}

              {/* Description */}
              {!editing && template.description && (
                <div className="mt-4 bg-[rgba(255,255,255,0.02)] rounded-xl p-4">
                  <p className="text-[9px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-1">Description</p>
                  <p className="text-[13px] text-[rgba(247,245,240,0.55)] leading-relaxed">{template.description}</p>
                </div>
              )}

              {/* Source URL */}
              {!editing && template.sourceUrl && (
                <div className="mt-3 bg-[rgba(255,255,255,0.02)] rounded-xl p-3">
                  <p className="text-[9px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-1">Source URL</p>
                  <a href={template.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#FF5A00] hover:underline break-all">{template.sourceUrl}</a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: thumbnail + metadata */}
          <div className="flex flex-col gap-4">
            {/* Thumbnail */}
            <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              {template.thumbnailUrl ? (
                <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[12px] text-[rgba(247,245,240,0.2)]">No thumbnail</p>
                </div>
              )}
            </div>

            {/* Status info */}
            <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[rgba(247,245,240,0.4)]">Status</span>
                <StatusBadge status={template.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[rgba(247,245,240,0.4)]">Created</span>
                <span className="text-[11px] text-[rgba(247,245,240,0.6)]">{formatDate(template.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[rgba(247,245,240,0.4)]">Updated</span>
                <span className="text-[11px] text-[rgba(247,245,240,0.6)]">{formatDate(template.updatedAt)}</span>
              </div>
              {template.publishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[rgba(247,245,240,0.4)]">Published</span>
                  <span className="text-[11px] text-[rgba(247,245,240,0.6)]">{formatDate(template.publishedAt)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[rgba(247,245,240,0.4)]">Uses</span>
                <span className="text-[11px] font-semibold text-[rgba(247,245,240,0.6)]">{template.useCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideModal
        open={slideModal.open}
        slides={template.slides.map((s, i) => ({
          src: s.previewUrl || (s.background.type === 'image' ? s.background.value : ''),
          label: `Slide ${i + 1}`,
        }))}
        currentIndex={slideModal.index}
        onNavigate={i => setSlideModal(m => ({ ...m, index: i }))}
        onClose={() => setSlideModal(m => ({ ...m, open: false }))}
      />

      <ConfirmDialog
        open={!!confirm?.open}
        title={confirm?.title || ''}
        message={confirm?.message || ''}
        danger
        confirmLabel="Confirm"
        onConfirm={confirm?.onConfirm || (() => {})}
        onCancel={() => setConfirm(null)}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
