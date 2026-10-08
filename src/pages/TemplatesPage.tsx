import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Globe, User } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import TemplateCard from '../components/templates/TemplateCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAuth } from '../contexts/AuthContext';
import { getPublishedTemplates, fetchLivePublishedTemplates } from '../lib/templates';
import {
  fetchCommunityTemplates,
  fetchMyTemplates,
  updateTemplateVisibility,
  deleteCommunityTemplate,
} from '../lib/communityTemplates';
import { Template } from '../types';

const CATEGORIES = [
  'All', 'Trending', 'New', 'AI', 'Marketing', 'Creator', 'Business', 'Education',
  'Finance', 'Personal Brand', 'SaaS', 'Productivity', 'Motivation', 'Quotes',
];

const SORT_OPTIONS = ['Trending', 'Newest', 'Most Used'];

type GalleryTab = 'all' | 'community' | 'mine';

const TABS: { id: GalleryTab; label: string; icon: typeof Globe }[] = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'community', label: 'Community', icon: Globe },
  { id: 'mine', label: 'My Templates', icon: User },
];

export default function TemplatesPage() {
  useScrollAnimation();
  const { user, profile } = useAuth();
  const uid = user?.id || profile?.userId;
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab: GalleryTab = tabParam === 'community' || tabParam === 'mine' ? tabParam : 'all';

  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>(() =>
    tab === 'all' ? getPublishedTemplates() : []
  );
  const [loading, setLoading] = useState(tab !== 'all');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setActionError('');

    const load = async () => {
      try {
        if (tab === 'community') {
          const live = await fetchCommunityTemplates();
          if (active) setTemplates(live);
        } else if (tab === 'mine') {
          if (!uid) {
            if (active) setTemplates([]);
          } else {
            const mine = await fetchMyTemplates(uid);
            if (active) setTemplates(mine);
          }
        } else {
          const live = await fetchLivePublishedTemplates();
          if (active && live && live.length > 0) setTemplates(live);
          else if (active) setTemplates(getPublishedTemplates());
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [tab, uid]);

  const setTab = (t: GalleryTab) => {
    setSearchParams(t === 'all' ? {} : { tab: t });
    setActiveCategory('All');
    setSearch('');
  };

  const handleToggleVisibility = async (t: Template) => {
    if (!uid) return;
    setActionError('');
    const next = t.visibility === 'private' ? 'public' : 'private';
    try {
      await updateTemplateVisibility(t.id, next, uid);
      setTemplates(prev => prev.map(p => (p.id === t.id ? { ...p, visibility: next } : p)));
    } catch (err: any) {
      setActionError(err?.message || 'Could not update visibility.');
    }
  };

  const handleDelete = async (t: Template) => {
    if (!uid) return;
    if (!window.confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteCommunityTemplate(t.id, uid);
      setTemplates(prev => prev.filter(p => p.id !== t.id));
    } catch (err: any) {
      setActionError(err?.message || 'Could not delete template.');
    }
  };

  let filtered = templates.filter(t => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Trending') return t.isTrending;
    if (activeCategory === 'New') return t.isNew;
    return t.category.toLowerCase() === activeCategory.toLowerCase();
  });

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'Newest') {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'Most Used') {
    filtered = [...filtered].sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <Navbar />

      <div className="pt-[64px]">
        {/* Header */}
        <div className="container-wide py-10 md:py-20">
          <div className="animate-on-scroll mb-3">
            <span className="text-eyebrow">Template Library</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <div>
              <h1 className="text-section animate-on-scroll">
                Carousel Templates
              </h1>
              <p className="text-body-lg mt-4 animate-on-scroll">
                Start with a structure. Make it yours.
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-72 animate-on-scroll">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B67]" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field !pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 animate-on-scroll">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  tab === id
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#6B6B67] border border-[rgba(17,17,17,0.08)] hover:text-[#111111]'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Filters + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 md:mb-10">
            <div className="flex gap-2 overflow-x-auto pb-1 horizontal-scroll -mx-5 px-5 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field !w-auto !py-2"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {actionError && (
            <p className="text-[13px] text-[#DC2626] bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.2)] rounded-xl px-4 py-3 mb-6">
              {actionError}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 md:py-24">
              <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tab === 'mine' && !uid ? (
            <div className="text-center py-16 md:py-24">
              <p className="text-[18px] text-[#6B6B67] mb-2">Sign in to see your templates</p>
              <p className="text-[14px] text-[#6B6B67] mb-6">Publish a design from the editor to build your collection.</p>
              <Link to="/pricing" className="btn-accent btn-sm">Get started</Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="text-[18px] text-[#6B6B67]">
                {tab === 'community'
                  ? 'No community templates yet — publish yours from the editor!'
                  : tab === 'mine'
                    ? "You haven't published any templates yet."
                    : 'No templates found.'}
              </p>
              {tab === 'all' ? (
                <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-ghost btn-sm mt-4">
                  Clear filters
                </button>
              ) : (
                <Link to="/dashboard" className="btn-accent btn-sm mt-4 inline-block">
                  Open the editor
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((t, i) => (
                <div key={t.id} className={`animate-on-scroll animate-on-scroll-delay-${Math.min(i % 5 + 1, 4)}`}>
                  <TemplateCard
                    template={t}
                    creatorName={t.creatorName}
                    isOwner={tab === 'mine' && !!uid && t.userId === uid}
                    onToggleVisibility={tab === 'mine' ? () => handleToggleVisibility(t) : undefined}
                    onDelete={tab === 'mine' ? () => handleDelete(t) : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
