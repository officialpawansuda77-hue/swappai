import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, PlusCircle, TrendingUp, Calendar, Eye, Edit3, CheckCircle } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { StatCard, StatusBadge, PageHeader } from '../components/admin/AdminUI';
import { fetchAdminStats, fetchTemplatesAdmin } from '../lib/adminApi';
import { AdminStats, Template } from '../types';
import { formatDate } from '../lib/adminUtils';
import { getAllTemplates } from '../lib/templates'; // local fallback

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({ total: 0, published: 0, drafts: 0, archived: 0, totalUses: 0, addedThisMonth: 0 });
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAdminStats(),
      fetchTemplatesAdmin({ orderBy: 'created_at', order: 'desc', perPage: 8 }),
    ]).then(([s, t]) => {
      if (s.total === 0 && t.length === 0) {
        // Demo mode: use local template data
        const local = getAllTemplates();
        setStats({
          total: local.length,
          published: local.filter(t => t.status === 'published').length,
          drafts: local.filter(t => t.status === 'draft').length,
          archived: local.filter(t => t.status === 'archived').length,
          totalUses: 0,
          addedThisMonth: local.length,
        });
        setRecentTemplates(local.slice(0, 8));
      } else {
        setStats(s);
        setRecentTemplates(t);
      }
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Total Templates',   value: stats.total,          icon: <Layers size={17} />,      color: '#FF5A00' },
    { label: 'Published',         value: stats.published,      icon: <CheckCircle size={17} />, color: '#22c55e' },
    { label: 'Drafts',            value: stats.drafts,         icon: <Edit3 size={17} />,       color: '#f59e0b' },
    { label: 'Total Uses',        value: stats.totalUses,      icon: <TrendingUp size={17} />,  color: '#a78bfa' },
    { label: 'Added This Month',  value: stats.addedThisMonth, icon: <Calendar size={17} />,    color: '#38bdf8' },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage carousel templates and platform content."
          actions={
            <Link to="/admin/templates/new" className="flex items-center gap-2 bg-[#FF5A00] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#e05000] transition-colors">
              <PlusCircle size={15} />
              Add Template
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map(s => (
            <StatCard key={s.label} {...s} loading={loading} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Templates */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#F7F5F0]">Recent Templates</h2>
              <Link to="/admin/templates" className="text-[12px] text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.7)] transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {['Template', 'Category', 'Slides', 'Status', 'Uses', 'Created'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] font-semibold">{h}</th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-[rgba(255,255,255,0.04)]">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <td key={j} className="px-4 py-3.5">
                              <div className="h-3 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" style={{ width: `${40 + j * 10}%` }} />
                            </td>
                          ))}
                        </tr>
                      ))
                    : recentTemplates.map(t => (
                        <tr key={t.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(255,255,255,0.06)]"
                                style={{
                                  backgroundImage: t.thumbnailUrl ? `url(${t.thumbnailUrl})` : undefined,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              />
                              <p className="text-[12px] font-medium text-[rgba(247,245,240,0.8)] leading-tight max-w-[140px] truncate">{t.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.category}</td>
                          <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.slideCount}</td>
                          <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                          <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.45)]">{t.useCount || 0}</td>
                          <td className="px-4 py-3.5 text-[11px] text-[rgba(247,245,240,0.3)]">{formatDate(t.createdAt)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link to={`/templates/${t.id}`} title="Preview" className="p-1.5 rounded-lg text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                                <Eye size={12} />
                              </Link>
                              <Link to={`/admin/templates/${t.id}`} title="Edit" className="p-1.5 rounded-lg text-[rgba(247,245,240,0.4)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.06)] transition-all">
                                <Edit3 size={12} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#F7F5F0] mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {[
                { to: '/admin/templates/new', label: 'Add New Template', sub: 'Upload carousel slides', icon: PlusCircle, color: '#FF5A00' },
                { to: '/admin/templates', label: 'Manage Templates', sub: 'Edit, publish or archive', icon: Layers, color: '#a78bfa' },
                { to: '/admin/categories', label: 'Edit Categories', sub: 'Add or rename categories', icon: TrendingUp, color: '#22c55e' },
                { to: '/admin/users', label: 'View Users', sub: 'Manage user accounts', icon: Calendar, color: '#38bdf8' },
              ].map(a => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="flex items-center gap-3.5 bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)] transition-all no-underline group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}18` }}>
                    <a.icon size={16} style={{ color: a.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[rgba(247,245,240,0.8)] group-hover:text-[#F7F5F0] transition-colors">{a.label}</p>
                    <p className="text-[11px] text-[rgba(247,245,240,0.35)]">{a.sub}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Drafts needing review */}
            <h2 className="text-[14px] font-semibold text-[#F7F5F0] mt-8 mb-3">Drafts Needing Review</h2>
            {recentTemplates.filter(t => t.status === 'draft').length === 0 ? (
              <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                <p className="text-[12px] text-[rgba(247,245,240,0.3)]">No drafts pending review.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentTemplates.filter(t => t.status === 'draft').slice(0, 4).map(t => (
                  <Link
                    key={t.id}
                    to={`/admin/templates/${t.id}`}
                    className="flex items-center gap-3 bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 hover:bg-[rgba(255,255,255,0.03)] transition-all no-underline group"
                  >
                    <div
                      className="w-7 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(255,255,255,0.06)]"
                      style={{
                        backgroundImage: t.thumbnailUrl ? `url(${t.thumbnailUrl})` : undefined,
                        backgroundSize: 'cover',
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[rgba(247,245,240,0.7)] truncate">{t.name}</p>
                      <p className="text-[10px] text-[rgba(247,245,240,0.3)]">{t.slideCount} slides · {t.category}</p>
                    </div>
                    <StatusBadge status="draft" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
