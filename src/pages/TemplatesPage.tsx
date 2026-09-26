import { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import TemplateCard from '../components/templates/TemplateCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getTemplatesByCategory } from '../lib/templates';

const CATEGORIES = [
  'All', 'Trending', 'New', 'AI', 'Business', 'Marketing', 'Education',
  'Finance', 'Personal Brand', 'Creator', 'SaaS', 'Productivity', 'Motivation', 'Quotes',
];

const SORT_OPTIONS = ['Trending', 'Newest', 'Most Used'];

export default function TemplatesPage() {
  useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [search, setSearch] = useState('');

  let filtered = getTemplatesByCategory(activeCategory);

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
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <Navbar />

      <div className="pt-[64px]">
        {/* Header */}
        <div className="container-wide py-20">
          <div className="animate-on-scroll mb-3">
            <span className="text-eyebrow">Template Library</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
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

          {/* Filters + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex gap-2 flex-wrap">
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

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[18px] text-[#6B6B67]">No templates found.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-ghost btn-sm mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((t, i) => (
                <div key={t.id} className={`animate-on-scroll animate-on-scroll-delay-${Math.min(i % 5 + 1, 4)}`}>
                  <TemplateCard template={t} />
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
