import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Clock, Layers, Sparkles, ArrowRight, ShieldCheck, AlertCircle, X } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import SlidePreview from '../components/templates/SlidePreview';
import TemplateCard from '../components/templates/TemplateCard';
import { getPublishedTemplates } from '../lib/templates';
import { useAuth } from '../contexts/AuthContext';
import { getUserSubscription, UserSubscription, PLANS } from '../lib/subscription';
import { getUserProjects } from '../lib/projects';
import { Project } from '../types';

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffH / 24);
  if (diffD > 0) return `${diffD}d ago`;
  if (diffH > 0) return `${diffH}h ago`;
  return 'Just now';
}

export default function DashboardPage() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const templates = getPublishedTemplates();
  const trending = templates.filter(t => t.isTrending).slice(0, 4);

  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
      return;
    }
    const uid = user?.id || profile?.userId;
    if (uid) {
      getUserSubscription(uid).then(setSub);
      getUserProjects(uid).then(setProjects);
    }
  }, [user, profile, loading, navigate]);

  const currentPlan = sub ? PLANS[sub.planId] || PLANS.starter : PLANS.starter;
  const usagePercent = sub ? Math.min(100, Math.round((sub.generationsUsed / sub.monthlyGenerations) * 100)) : 0;
  const hasGenerationsLeft = sub ? sub.generationsUsed < sub.monthlyGenerations : true;

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!hasGenerationsLeft) {
      e.preventDefault();
      setShowLimitModal(true);
    } else {
      navigate('/create');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5A00] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#111111]">
      <Navbar />

      <div className="pt-[80px]">
        <div className="container-wide py-12">
          {/* Header & Plan Status Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF5A00] mb-2 block">
                CREATOR WORKSPACE
              </span>
              <h1 className="text-[34px] md:text-[40px] font-black tracking-[-0.03em] mb-1">
                Welcome back{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}.
              </h1>
              <p className="text-[16px] text-[#6B6B67]">What are you publishing today?</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCreateClick}
                className="btn-accent flex items-center gap-2 !py-3.5 !px-6 cursor-pointer"
              >
                <Plus size={16} />
                Create Carousel
              </button>
            </div>
          </div>

          {/* Subscription & Usage Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[rgba(17,17,17,0.08)] shadow-sm mb-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Plan info */}
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[rgba(17,17,17,0.08)] pb-5 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-bold text-[#6B6B67] uppercase tracking-wider">
                    Current Plan
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5A00]/10 text-[#FF5A00]">
                    Active
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[26px] font-black text-[#111111]">{currentPlan.name}</h3>
                  <span className="text-[15px] font-bold text-[#6B6B67]">
                    {currentPlan.priceFormatted}
                    <span className="text-[12px] font-normal">{currentPlan.period}</span>
                  </span>
                </div>
                <p className="text-[13px] text-[#6B6B67] mt-1">{currentPlan.description}</p>
              </div>

              {/* Monthly Allowance & Progress */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[rgba(17,17,17,0.08)] pb-5 md:pb-0 md:pr-6">
                <div className="flex items-center justify-between text-[13px] mb-2">
                  <span className="font-bold text-[#111111]">Monthly Carousel Allowance</span>
                  <span className="font-bold text-[#FF5A00]">
                    {sub ? sub.generationsUsed : 0} / {sub ? sub.monthlyGenerations : currentPlan.monthlyGenerations} used
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-[rgba(17,17,17,0.06)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      usagePercent >= 100 ? 'bg-red-500' : 'bg-[#FF5A00]'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11.5px] text-[#6B6B67] mt-2">
                  <span>
                    {sub
                      ? Math.max(0, sub.monthlyGenerations - sub.generationsUsed)
                      : currentPlan.monthlyGenerations}{' '}
                    generations remaining
                  </span>
                  <span>Resets on 1st of month</span>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="md:col-span-3 flex flex-col justify-center items-start md:items-end">
                {currentPlan.id !== 'studio' ? (
                  <Link
                    to="/pricing"
                    className="w-full md:w-auto py-3 px-5 rounded-full bg-[rgba(17,17,17,0.05)] hover:bg-[#FF5A00] text-[#111111] hover:text-white font-bold text-[13.5px] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Upgrade plan</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[13px]">
                    <ShieldCheck size={16} />
                    <span>Top Tier Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent projects */}
          <section className="mb-14">
            <h2 className="text-[20px] font-bold tracking-[-0.015em] mb-6">Recent Projects</h2>
            {projects.length === 0 ? (
              <div className="border border-dashed border-[rgba(17,17,17,0.15)] rounded-2xl p-16 text-center bg-white">
                <Layers size={32} className="mx-auto text-[#6B6B67] mb-4" />
                <p className="text-[17px] font-medium mb-2">No projects yet</p>
                <p className="text-[15px] text-[#6B6B67] mb-6">Start by browsing templates or creating from scratch.</p>
                <button onClick={handleCreateClick} className="btn-primary">
                  Create your first carousel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {projects.map(project => {
                  const tpl = templates.find(t => t.id === project.templateId);
                  const slide = project.slides?.[0] || tpl?.slides[0];
                  return (
                    <Link
                      key={project.id}
                      to={`/editor/${project.id}`}
                      className="template-card no-underline block group bg-white rounded-2xl overflow-hidden border border-[rgba(17,17,17,0.08)] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                        {slide ? (
                          <SlidePreview slide={slide} scale={220 / 1080} />
                        ) : (
                          <div className="w-full h-full bg-[rgba(17,17,17,0.05)] flex items-center justify-center">
                            <Layers size={24} className="text-[#6B6B67]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[rgba(17,17,17,0.0)] group-hover:bg-[rgba(17,17,17,0.08)] transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="btn-primary btn-sm">Open →</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[14px] font-semibold text-[#111111] mb-1 truncate">{project.name}</p>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6B6B67]">
                          <Clock size={11} />
                          <span>{timeAgo(project.updatedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick template shortcuts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold tracking-[-0.015em]">Trending Templates</h2>
              <Link to="/templates" className="text-[14px] font-semibold text-[#FF5A00] flex items-center gap-1 hover:underline">
                View all templates
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trending.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Generation Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-[440px] w-full text-center relative shadow-2xl border border-[rgba(0,0,0,0.08)] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.05)]"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-[22px] font-bold mb-2">Monthly Limit Reached</h3>
            <p className="text-[14px] text-[#6B6B67] mb-6 leading-relaxed">
              You've used all {sub?.monthlyGenerations} carousel generations included in your {currentPlan.name} plan for this month. Upgrade your plan to continue creating!
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/pricing"
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[14px] transition-all text-center shadow-lg shadow-[#FF5A00]/25"
              >
                Upgrade Plan
              </Link>
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 px-6 rounded-full border border-[rgba(17,17,17,0.15)] text-[#111111] font-semibold text-[14px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
