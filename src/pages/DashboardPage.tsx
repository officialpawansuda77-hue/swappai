import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Clock, Layers, Sparkles, ArrowRight, ShieldCheck, AlertCircle, X, Zap, CheckCircle2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import SlidePreview from '../components/templates/SlidePreview';
import TemplateCard from '../components/templates/TemplateCard';
import { getPublishedTemplates, fetchLivePublishedTemplates } from '../lib/templates';
import { useAuth } from '../contexts/AuthContext';
import { getUserSubscription, UserSubscription, PLANS, createDodoCheckoutSession } from '../lib/subscription';
import { getUserProjects } from '../lib/projects';
import { apiFetch } from '../lib/apiClient';
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

interface ProjectCardProps {
  project: Project;
  templates: ReturnType<typeof getPublishedTemplates>;
}

function ProjectCard({ project, templates }: ProjectCardProps) {
  const tpl = templates.find(t => t.id === project.templateId);
  const slide = project.slides?.[0] || tpl?.slides[0];
  const slideWidth = slide?.width || 1080;
  const slideHeight = slide?.height || 1350;
  const aspectRatio = `${slideWidth} / ${slideHeight}`;

  return (
    <Link
      to={`/editor/${project.id}`}
      className="template-card no-underline block group bg-white rounded-2xl overflow-hidden border border-[rgba(17,17,17,0.08)] shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative overflow-hidden w-full bg-[rgba(17,17,17,0.04)]" style={{ aspectRatio }}>
        {slide ? (
          <SlidePreview
            slide={slide}
            autoScale
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full bg-[rgba(17,17,17,0.05)] flex items-center justify-center">
            <Layers size={24} className="text-[#6B6B67]" />
          </div>
        )}
        <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto backdrop-blur-[1px]">
          <span className="btn-primary btn-sm shadow-md scale-95 group-hover:scale-100 transition-transform">
            Open Editor →
          </span>
        </div>
      </div>
      <div className="p-4 bg-white">
        <p className="text-[14px] font-semibold text-[#111111] mb-1 truncate">{project.name}</p>
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B6B67]">
          <Clock size={11} />
          <span>{timeAgo(project.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { profile, user, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setReload] = useState(0);
  const templates = getPublishedTemplates();
  const trending = templates.filter(t => t.isTrending).slice(0, 4);

  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showExtraGenModal, setShowExtraGenModal] = useState(false);
  const [purchasingExtra, setPurchasingExtra] = useState(false);
  const [extraGenError, setExtraGenError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentBanner, setPaymentBanner] = useState<string | null>(null);

  const isPaymentSuccess = searchParams.get('payment') === 'success' || searchParams.get('checkout') === 'success';

  useEffect(() => {
    fetchLivePublishedTemplates().then(() => setReload(r => r + 1));
    if (!loading && !user && !profile) {
      navigate('/pricing', { replace: true });
      return;
    }
    const uid = user?.id || profile?.userId;
    if (uid) {
      getUserSubscription(uid).then(setSub);
      getUserProjects(uid).then(setProjects);

      // If returning from Dodo Checkout, verify server-side
      if (isPaymentSuccess) {
        setVerifyingPayment(true);
        apiFetch<{ verified: boolean; plan: string }>('/api/dodo/verify-subscription', { timeoutMs: 20_000 })
          .then(data => {
            if (data.verified) {
              setPaymentBanner(`Payment confirmed! Your ${data.plan.toUpperCase()} subscription is active.`);
              getUserSubscription(uid).then(setSub);
              refreshProfile();
            } else {
              setPaymentBanner('Checkout completed. Your subscription will sync via webhook momentarily.');
              getUserSubscription(uid).then(setSub);
            }
          })
          .catch(() => {
            getUserSubscription(uid).then(setSub);
          })
          .finally(() => {
            setVerifyingPayment(false);
          });
      }
    } else {
      getUserProjects('anonymous').then(setProjects);
    }
  }, [user, profile, loading, navigate, isPaymentSuccess, refreshProfile]);

  const currentPlan = sub ? PLANS[sub.planId] || PLANS.starter : PLANS.starter;
  const totalLimit = (sub ? sub.monthlyGenerations : currentPlan.monthlyGenerations) + (sub?.extraGenerations || 0);
  const usedGenerations = sub ? sub.generationsUsed : 0;
  const remainingGenerations = Math.max(0, totalLimit - usedGenerations);
  const usagePercent = Math.min(100, Math.round((usedGenerations / totalLimit) * 100));
  const hasGenerationsLeft = remainingGenerations > 0;

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!hasGenerationsLeft) {
      e.preventDefault();
      setShowLimitModal(true);
    } else {
      navigate('/create');
    }
  };

  const handleBuyExtraGenerations = async () => {
    setExtraGenError(null);
    setPurchasingExtra(true);

    try {
      const returnUrl = `${window.location.origin}/dashboard?payment=success&extra=15`;
      const { checkoutUrl } = await createDodoCheckoutSession('extra_generations', returnUrl);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      setExtraGenError(
        err.message ||
          'Dodo Extra Generations product has not yet been configured. Please specify DODO_EXTRA_GENERATIONS_PRODUCT_ID in server environment.'
      );
      setPurchasingExtra(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5A00] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user && !profile) {
    return null;
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#111111]">
      <Navbar />

      <div className="pt-[80px]">
        <div className="container-wide py-12">
          {/* Payment Success Notification Banner */}
          {verifyingPayment && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[14px] flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span>Verifying your Dodo Payments subscription status server-side...</span>
            </div>
          )}

          {paymentBanner && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[14px] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{paymentBanner}</span>
              </div>
              <button
                onClick={() => setPaymentBanner(null)}
                className="text-emerald-700 hover:text-emerald-900 text-[13px] font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

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

            <div className="flex items-center gap-3 flex-wrap">
              {hasGenerationsLeft ? (
                <button
                  type="button"
                  onClick={handleCreateClick}
                  className="btn-accent flex items-center gap-2 !py-3.5 !px-6 cursor-pointer"
                >
                  <Plus size={16} />
                  Create Carousel
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled
                    title="Monthly carousel limit reached. Get more generations to continue creating."
                    className="py-3.5 px-6 rounded-full bg-[rgba(17,17,17,0.08)] text-[#6B6B67] font-bold text-[14px] cursor-not-allowed opacity-60 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Create Carousel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExtraGenModal(true)}
                    className="py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[14px] transition-all flex items-center gap-2 shadow-lg shadow-[#FF5A00]/25 cursor-pointer"
                  >
                    <Zap size={16} />
                    Get More Generations
                  </button>
                </div>
              )}
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
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    sub?.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {sub?.status === 'active' ? 'Active' : (sub?.status || 'Active')}
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

              {/* Monthly Allowance & Progress Meter */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[rgba(17,17,17,0.08)] pb-5 md:pb-0 md:pr-6">
                <div className="flex items-center justify-between text-[13px] mb-2">
                  <span className="font-bold text-[#111111] text-[14px]">Carousels</span>
                  <span className="font-extrabold text-[#FF5A00] text-[14px]">
                    {usedGenerations} / {totalLimit} used
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

                <div className="flex justify-between items-center text-[12px] mt-2.5">
                  <span className={`font-semibold ${remainingGenerations === 0 ? 'text-red-600' : 'text-[#111111]'}`}>
                    {remainingGenerations} remaining
                  </span>
                  <span className="text-[#6B6B67] text-[11px]">Resets on billing cycle</span>
                </div>

                {/* Limit reached warning alert in card */}
                {!hasGenerationsLeft && (
                  <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-red-600 text-[12px] font-bold">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span>Monthly carousel limit reached.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowExtraGenModal(true)}
                      className="text-[12px] font-extrabold text-[#FF5A00] hover:underline"
                    >
                      Get More Generations →
                    </button>
                  </div>
                )}
              </div>

              {/* Upgrade CTA / Extra Generations CTA */}
              <div className="md:col-span-3 flex flex-col justify-center items-start md:items-end gap-2.5">
                {!hasGenerationsLeft ? (
                  <button
                    type="button"
                    onClick={() => setShowExtraGenModal(true)}
                    className="w-full md:w-auto py-3 px-5 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[13.5px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5A00]/20 cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Get More Generations</span>
                  </button>
                ) : currentPlan.id !== 'studio' ? (
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
                    <span>Studio Plan Active</span>
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
                <button
                  onClick={handleCreateClick}
                  className={`btn-primary ${!hasGenerationsLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Create your first carousel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} templates={templates} />
                ))}
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

      {/* Monthly Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-8 max-w-[460px] w-full text-center relative shadow-2xl border border-[rgba(0,0,0,0.08)] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.05)]"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-[22px] font-bold mb-2">Monthly carousel limit reached.</h3>
            <p className="text-[14px] text-[#6B6B67] mb-6 leading-relaxed">
              You've used all <strong>{usedGenerations} of {totalLimit}</strong> carousel generations included in your {currentPlan.name} allowance for this billing month.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowLimitModal(false);
                  setShowExtraGenModal(true);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 cursor-pointer"
              >
                <Zap size={16} />
                Get More Generations
              </button>
              <Link
                to="/pricing"
                className="w-full py-3 px-6 rounded-full border border-[rgba(17,17,17,0.15)] text-[#111111] font-semibold text-[14px] text-center hover:bg-[rgba(0,0,0,0.02)]"
              >
                Upgrade Subscription Plan
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Extra Generations Purchase Modal */}
      {showExtraGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-8 max-w-[480px] w-full text-left relative shadow-2xl border border-[rgba(0,0,0,0.08)] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowExtraGenModal(false);
                setExtraGenError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.05)]"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5A00]/10 text-[#FF5A00] flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF5A00]">
                  ADDITIONAL USAGE
                </span>
                <h3 className="text-[20px] font-bold">Get More Generations</h3>
              </div>
            </div>

            <p className="text-[14px] text-[#6B6B67] mb-6 leading-relaxed">
              Add extra carousel generations to your account. Extra generations do not expire at the end of the billing month and are consumed after your monthly quota.
            </p>

            {extraGenError && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] leading-relaxed">
                <div className="flex items-center gap-2 font-bold mb-1 text-amber-800">
                  <AlertCircle size={15} />
                  <span>Dodo Product Configuration Needed</span>
                </div>
                <p className="text-[12.5px]">{extraGenError}</p>
                <div className="mt-3 pt-3 border-t border-amber-200/80 text-[12px] text-amber-800">
                  <p className="font-semibold mb-1">To enable extra generations in Dodo Payments:</p>
                  <p>1. Create a One-Time product in Dodo Payments (e.g. "15 Extra Carousel Generations" - $5.00)</p>
                  <p>2. Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">DODO_EXTRA_GENERATIONS_PRODUCT_ID=pdt_...</code> in your server environment variables.</p>
                </div>
              </div>
            )}

            {/* Extra generations option card */}
            <div className="p-5 rounded-2xl border-2 border-[#FF5A00] bg-orange-50/20 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[16px] text-[#111111]">15 Extra Carousel Generations</h4>
                <span className="text-[20px] font-black text-[#FF5A00]">$5.00</span>
              </div>
              <p className="text-[13px] text-[#6B6B67] mb-4">
                Instant top-up for 15 carousel generations. One-time payment via Dodo Payments.
              </p>
              <button
                type="button"
                onClick={handleBuyExtraGenerations}
                disabled={purchasingExtra}
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 disabled:opacity-50 cursor-pointer"
              >
                {purchasingExtra ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Opening Dodo Checkout...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Purchase Extra Generations</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/pricing"
                className="text-[13px] font-bold text-[#FF5A00] hover:underline"
              >
                Or upgrade your subscription plan →
              </Link>
              <button
                type="button"
                onClick={() => setShowExtraGenModal(false)}
                className="text-[13px] text-[#6B6B67] hover:text-[#111111]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
