import { useEffect, useState } from 'react';
import { Plus, Edit3, Archive, Check, X as XIcon } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { PageHeader, ToastContainer, AdminInput } from '../components/admin/AdminUI';
import type { Toast } from '../components/admin/AdminUI';
import { fetchCategories, createCategory, updateCategory } from '../lib/adminApi';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'AI', slug: 'ai', sortOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Business', slug: 'business', sortOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Marketing', slug: 'marketing', sortOrder: 3, isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Education', slug: 'education', sortOrder: 4, isActive: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Personal Brand', slug: 'personal-brand', sortOrder: 5, isActive: true, createdAt: new Date().toISOString() },
  { id: '6', name: 'Creator', slug: 'creator', sortOrder: 6, isActive: true, createdAt: new Date().toISOString() },
  { id: '7', name: 'SaaS', slug: 'saas', sortOrder: 7, isActive: true, createdAt: new Date().toISOString() },
  { id: '8', name: 'Finance', slug: 'finance', sortOrder: 8, isActive: true, createdAt: new Date().toISOString() },
  { id: '9', name: 'Productivity', slug: 'productivity', sortOrder: 9, isActive: true, createdAt: new Date().toISOString() },
  { id: '10', name: 'Motivation', slug: 'motivation', sortOrder: 10, isActive: true, createdAt: new Date().toISOString() },
  { id: '11', name: 'Product', slug: 'product', sortOrder: 11, isActive: true, createdAt: new Date().toISOString() },
  { id: '12', name: 'Quotes', slug: 'quotes', sortOrder: 12, isActive: true, createdAt: new Date().toISOString() },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const addToast = (type: Toast['type'], msg: string) => {
    const id = uuidv4();
    setToasts(t => [...t, { id, type, message: msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  useEffect(() => {
    fetchCategories().then(data => {
      if (data.length > 0) {
        setCategories(data.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          name: c.name as string,
          slug: c.slug as string,
          sortOrder: (c.sort_order as number) || 0,
          isActive: (c.is_active as boolean) !== false,
          createdAt: (c.created_at as string) || new Date().toISOString(),
        })));
      }
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      await createCategory(newName.trim(), slug);
      addToast('success', `Category "${newName}" created.`);
    } catch {
      // Demo mode
    }
    setCategories(prev => [...prev, {
      id: uuidv4(), name: newName.trim(), slug, sortOrder: prev.length + 1, isActive: true, createdAt: new Date().toISOString(),
    }]);
    setNewName('');
    setAdding(false);
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateCategory(id, { name: editName });
      addToast('success', 'Category updated.');
    } catch { addToast('success', 'Category updated (demo mode).'); }
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName } : c));
    setEditingId(null);
  };

  const handleToggle = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    try {
      await updateCategory(id, { isActive: !cat.isActive });
    } catch {}
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    addToast('info', `Category ${cat.isActive ? 'archived' : 'restored'}.`);
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <PageHeader
          title="Categories"
          subtitle="Manage the carousel template categories shown to users."
          actions={
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 bg-[#FF5A00] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#e05000] transition-colors"
            >
              <Plus size={14} /> Add Category
            </button>
          }
        />

        {adding && (
          <div className="bg-[#1a1917] border border-[rgba(255,90,0,0.25)] rounded-2xl p-5 mb-5">
            <p className="text-[13px] font-semibold text-[#F7F5F0] mb-3">New Category</p>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
                placeholder="Category name..."
                className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] text-[rgba(247,245,240,0.8)] outline-none focus:border-[#FF5A00]"
              />
              <button onClick={handleAdd} className="bg-[#FF5A00] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#e05000] transition-colors">
                Add
              </button>
              <button onClick={() => setAdding(false)} className="px-3 py-2 text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)] transition-colors">
                <XIcon size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Category', 'Slug', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-5 py-3.5">
                    {editingId === cat.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleEdit(cat.id); if (e.key === 'Escape') setEditingId(null); }}
                          className="bg-[rgba(255,255,255,0.05)] border border-[#FF5A00] rounded-lg px-2 py-1 text-[12px] text-[rgba(247,245,240,0.8)] outline-none w-40"
                        />
                        <button onClick={() => handleEdit(cat.id)} className="text-green-400 hover:text-green-300 transition-colors"><Check size={13} /></button>
                        <button onClick={() => setEditingId(null)} className="text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)] transition-colors"><XIcon size={13} /></button>
                      </div>
                    ) : (
                      <span className={`text-[13px] font-medium ${cat.isActive ? 'text-[rgba(247,245,240,0.8)]' : 'text-[rgba(247,245,240,0.3)] line-through'}`}>{cat.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-[rgba(247,245,240,0.35)] font-mono">{cat.slug}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                      cat.isActive
                        ? 'text-green-400 bg-green-400/10 border-green-400/20'
                        : 'text-[rgba(247,245,240,0.25)] bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)]'
                    }`}>
                      {cat.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                        <Edit3 size={12} />
                      </button>
                      <button onClick={() => handleToggle(cat.id)} className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all" title={cat.isActive ? 'Archive' : 'Restore'}>
                        <Archive size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </AdminLayout>
  );
}
