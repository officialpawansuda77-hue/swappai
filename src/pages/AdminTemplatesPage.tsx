import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Eye, Edit3, Archive, Trash2, Copy, Send,
  RotateCcw, ChevronDown, CheckSquare, Square, Filter,
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { StatusBadge, ConfirmDialog, ToastContainer, PageHeader } from '../components/admin/AdminUI';
import type { Toast } from '../components/admin/AdminUI';
import {
  fetchTemplatesAdmin, archiveTemplate, restoreTemplate,
  deleteTemplate, duplicateTemplate, publishTemplate, unpublishTemplate,
  bulkPublish, bulkArchive, bulkDelete,
} from '../lib/adminApi';
import { getAllTemplates } from '../lib/templates';
import { Template } from '../types';
import { formatDate } from '../lib/adminUtils';
import { v4 as uuidv4 } from 'uuid';

type TabFilter = 'all' | 'published' | 'draft' | 'archived';
type SortBy = 'created_at' | 'updated_at' | 'use_count' | 'name';

const CATEGORIES = ['All', 'AI', 'Business', 'Marketing', 'Education', 'Personal Brand', 'Creator', 'SaaS', 'Finance', 'Productivity', 'Motivation', 'Product', 'Quotes'];

export default function AdminTemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortBy>('created_at');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  const addToast = (type: Toast['type'], message: string) => {
    const id = uuidv4();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  const loadTemplates = async () => {
    setLoading(true);
    const data = await fetchTemplatesAdmin({
      status: tab === 'all' ? 'all' : tab,
      category: category !== 'All' ? category : undefined,
      search: search || undefined,
      orderBy: sortBy,
      order: sortBy === 'name' ? 'asc' : 'desc',
    });

    if (data.length === 0) {
      // Demo fallback
      const local = getAllTemplates();
      let filtered = tab === 'all' ? local : local.filter(t => t.status === tab);
      if (category !== 'All') {
        filtered = filtered.filter(t => t.category === category);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
        );
      }
      setTemplates(filtered);
    } else {
      setTemplates(data);
    }
    setLoading(false);
  };

  useEffect(() => { loadTemplates(); }, [tab, category, sortBy]);
  useEffect(() => {
    const t = setTimeout(loadTemplates, 350);
    return () => clearTimeout(t);
  }, [search]);

  const tabCounts = {
    all: templates.length,
    published: templates.filter(t => t.status === 'published').length,
    draft: templates.filter(t => t.status === 'draft').length,
    archived: templates.filter(t => t.status === 'archived').length,
  };

  // Row actions
  const handlePublish = async (id: string) => {
    await publishTemplate(id);
    addToast('success', 'Template published successfully.');
    loadTemplates();
  };

  const handleUnpublish = async (id: string) => {
    await unpublishTemplate(id);
    addToast('success', 'Template unpublished.');
    loadTemplates();
  };

  const handleArchive = async (id: string) => {
    setConfirm({
      open: true,
      title: 'Archive Template',
      message: 'This will hide the template from the public library. Users who already used it are unaffected.',
      onConfirm: async () => {
        await archiveTemplate(id);
        addToast('success', 'Template archived.');
        setConfirm(null);
        loadTemplates();
      },
    });
  };

  const handleRestore = async (id: string) => {
    await restoreTemplate(id);
    addToast('success', 'Template restored to draft.');
    loadTemplates();
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateTemplate(id);
    if (result) {
      addToast('success', 'Template duplicated as draft.');
      loadTemplates();
    } else {
      addToast('error', 'Could not duplicate template.');
    }
  };

  const handleDelete = (id: string) => {
    setConfirm({
      open: true,
      title: 'Delete Template Permanently',
      message: 'This action cannot be undone. Existing user projects based on this template are not affected.',
      onConfirm: async () => {
        await deleteTemplate(id);
        addToast('success', 'Template deleted.');
        setConfirm(null);
        loadTemplates();
      },
    });
  };

  // Selection
  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(templates.map(t => t.id)));
  const clearSelect = () => setSelected(new Set());

  // Bulk
  const handleBulkPublish = () => {
    setConfirm({
      open: true,
      title: `Publish ${selected.size} templates?`,
      message: 'All selected templates will be made publicly available.',
      onConfirm: async () => {
        await bulkPublish(Array.from(selected));
        addToast('success', `${selected.size} templates published.`);
        clearSelect(); setConfirm(null); loadTemplates();
      },
    });
  };

  const handleBulkArchive = () => {
    setConfirm({
      open: true,
      title: `Archive ${selected.size} templates?`,
      message: 'All selected templates will be hidden from the public library.',
      onConfirm: async () => {
        await bulkArchive(Array.from(selected));
        addToast('success', `${selected.size} templates archived.`);
        clearSelect(); setConfirm(null); loadTemplates();
      },
    });
  };

  const handleBulkDelete = () => {
    setConfirm({
      open: true,
      title: `Delete ${selected.size} templates permanently?`,
      message: 'This cannot be undone. Existing user projects are not affected.',
      onConfirm: async () => {
        await bulkDelete(Array.from(selected));
        addToast('success', `${selected.size} templates deleted.`);
        clearSelect(); setConfirm(null); loadTemplates();
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <PageHeader
          title="Carousel Templates"
          subtitle="Manage the carousel templates available to SWAPP.AI users."
          actions={
            <Link
              to="/admin/templates/new"
              className="flex items-center gap-2 bg-[#FF5A00] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#e05000] transition-colors"
            >
              <Plus size={15} /> Add Template
            </Link>
          }
        />

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#1a1917] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-[rgba(247,245,240,0.3)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 bg-transparent text-[13px] text-[rgba(247,245,240,0.75)] outline-none placeholder:text-[rgba(247,245,240,0.2)]"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-[#1a1917] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] text-[rgba(247,245,240,0.6)] outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="bg-[#1a1917] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] text-[rgba(247,245,240,0.6)] outline-none"
          >
            <option value="created_at">Newest</option>
            <option value="use_count">Most Used</option>
            <option value="updated_at">Recently Updated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-[rgba(255,255,255,0.06)] mb-5">
          {(['all', 'published', 'draft', 'archived'] as TabFilter[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); clearSelect(); }}
              className={`px-4 py-2.5 text-[12px] font-medium capitalize transition-all border-b-2 ${
                tab === t
                  ? 'border-[#FF5A00] text-[#FF5A00]'
                  : 'border-transparent text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)]'
              }`}
            >
              {t} ({tabCounts[t] ?? 0})
            </button>
          ))}
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-[rgba(255,90,0,0.08)] border border-[rgba(255,90,0,0.2)] rounded-xl px-4 py-3 mb-4">
            <span className="text-[13px] font-medium text-[#FF5A00]">{selected.size} selected</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={handleBulkPublish} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[rgba(34,197,94,0.12)] text-green-400 hover:bg-[rgba(34,197,94,0.2)] transition-colors">Publish</button>
              <button onClick={handleBulkArchive} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.5)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">Archive</button>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[rgba(239,68,68,0.12)] text-red-400 hover:bg-[rgba(239,68,68,0.2)] transition-colors">Delete</button>
              <button onClick={clearSelect} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)] transition-colors">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="px-4 py-3.5">
                  <button onClick={selected.size === templates.length ? clearSelect : selectAll} className="text-[rgba(247,245,240,0.3)] hover:text-[rgba(247,245,240,0.6)] transition-colors">
                    {selected.size === templates.length && templates.length > 0 ? <CheckSquare size={14} /> : <Square size={14} />}
                  </button>
                </th>
                {['Template', 'Category', 'Slides', 'Status', 'Uses', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-[rgba(255,255,255,0.04)]">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <div className="h-3 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" style={{ width: `${30 + j * 8}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : templates.length === 0
                ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-[rgba(247,245,240,0.3)] text-[14px]">
                        No templates found.{' '}
                        <Link to="/admin/templates/new" className="text-[#FF5A00] hover:underline">Add your first template →</Link>
                      </td>
                    </tr>
                  )
                : templates.map(t => (
                    <tr key={t.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleSelect(t.id)} className="text-[rgba(247,245,240,0.3)] hover:text-[rgba(247,245,240,0.6)] transition-colors">
                          {selected.has(t.id) ? <CheckSquare size={14} className="text-[#FF5A00]" /> : <Square size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-11 rounded-lg flex-shrink-0 bg-[rgba(255,255,255,0.06)] overflow-hidden"
                            style={{
                              backgroundImage: t.thumbnailUrl ? `url(${t.thumbnailUrl})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <div>
                            <p className="text-[12px] font-medium text-[rgba(247,245,240,0.85)] leading-tight max-w-[160px] line-clamp-2">{t.name}</p>
                            {t.isTrending && <span className="text-[10px] text-[#FF5A00] font-medium">Trending</span>}
                            {t.isNew && <span className="text-[10px] text-[rgba(247,245,240,0.4)] font-medium ml-1">New</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.category}</td>
                      <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.slideCount}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.useCount || 0}</td>
                      <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.3)] whitespace-nowrap">{formatDate(t.updatedAt)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Link to={`/templates/${t.id}`} title="Preview" className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                            <Eye size={12} />
                          </Link>
                          <Link to={`/admin/templates/${t.id}`} title="Edit" className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                            <Edit3 size={12} />
                          </Link>
                          <button title="Duplicate" onClick={() => handleDuplicate(t.id)} className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                            <Copy size={12} />
                          </button>
                          {t.status === 'draft' && (
                            <button title="Publish" onClick={() => handlePublish(t.id)} className="p-1.5 rounded-lg text-green-400/50 hover:text-green-400 hover:bg-[rgba(34,197,94,0.08)] transition-all">
                              <Send size={12} />
                            </button>
                          )}
                          {t.status === 'published' && (
                            <button title="Unpublish" onClick={() => handleUnpublish(t.id)} className="p-1.5 rounded-lg text-amber-400/50 hover:text-amber-400 hover:bg-[rgba(245,158,11,0.08)] transition-all">
                              <RotateCcw size={12} />
                            </button>
                          )}
                          {t.status === 'archived' ? (
                            <button title="Restore" onClick={() => handleRestore(t.id)} className="p-1.5 rounded-lg text-blue-400/50 hover:text-blue-400 hover:bg-[rgba(59,130,246,0.08)] transition-all">
                              <RotateCcw size={12} />
                            </button>
                          ) : (
                            <button title="Archive" onClick={() => handleArchive(t.id)} className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                              <Archive size={12} />
                            </button>
                          )}
                          <button title="Delete" onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm?.open}
        title={confirm?.title || ''}
        message={confirm?.message || ''}
        confirmLabel="Confirm"
        danger
        onConfirm={confirm?.onConfirm || (() => {})}
        onCancel={() => setConfirm(null)}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
