import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Lock, ShieldCheck, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import { getPendingPlan, PLANS, PlanDetails, createDodoCheckoutSession, PlanId } from '../lib/subscription';
import { useAuth } from '../contexts/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();

  const planFromQuery = searchParams.get('plan') as PlanId | null;
  const pending = getPendingPlan();
  const planId: PlanId = (planFromQuery && PLANS[planFromQuery] ? planFromQuery : (pending?.planId || 'creator'));

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const plan: PlanDetails = PLANS[planId] || PLANS.creator;

  // If user selected starter, redirect to pricing
  useEffect(() => {
    if (planId === 'starter') {
      navigate('/pricing', { replace: true });
    }
  }, [planId, navigate]);

  const handleProceedToDodo = async () => {
    if (!user && !profile) {
      // Must be authenticated to link subscription to Supabase user_id
      navigate(`/sign-in?plan=${plan.id}`, { replace: true });
      return;
    }

    setErrorMsg(null);
    setLoadingCheckout(true);

    try {
      const returnUrl = `${window.location.origin}/dashboard?checkout=success`;
      const { checkoutUrl } = await createDodoCheckoutSession(plan.id, returnUrl);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL received from Dodo Payments.');
      }
    } catch (err: any) {
      console.error('Dodo checkout creation error:', err);
      setErrorMsg(err.message || 'Unable to open Dodo checkout session. Please check API keys.');
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[rgba(17,17,17,0.06)] bg-white">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <img
            src="/logo.png"
            alt="SWAPP.AI"
            className="w-8 h-8 rounded-lg object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex items-center">
            <span className="text-[20px] font-black tracking-[-0.04em] text-[#111111]">swapp</span>
            <span className="text-[20px] font-black tracking-[-0.04em] text-[#FF5A00]">.ai</span>
            <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
          </div>
        </Link>
        <Link
          to="/pricing"
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B67] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={14} /> Back to plans
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Plan Summary */}
          <div className="lg:col-span-5">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF5A00] mb-3">
              DODO PAYMENTS CHECKOUT
            </span>
            <h1 className="text-[34px] md:text-[38px] font-black tracking-[-0.03em] text-[#111111] leading-tight mb-4">
              Complete your subscription.
            </h1>
            <p className="text-[15px] text-[#6B6B67] mb-8 leading-relaxed">
              Unlock the full carousel studio with {plan.name} features ({plan.monthlyGenerations} generations per month).
            </p>

            {/* Selected Plan Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-[rgba(17,17,17,0.08)] shadow-sm mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF5A00]/10 flex items-center justify-center text-[#FF5A00]">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111111]">{plan.name} Plan</h3>
                </div>
                <div className="text-right">
                  <span className="text-[22px] font-black text-[#111111]">{plan.priceFormatted}</span>
                  <span className="text-[13px] text-[#6B6B67]"> /mo</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(17,17,17,0.06)] space-y-2.5 mt-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#FF5A00] flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-[13px] font-medium text-[#111111]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#6B6B67]">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
              <span>Payments securely processed by Dodo Payments. Cancel anytime.</span>
            </div>
          </div>

          {/* Right Column: Checkout Action */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-[rgba(17,17,17,0.08)] shadow-lg">
            {/* Account Linking Status */}
            {!authLoading && (!user && !profile) && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Account Required Before Payment</p>
                  <p className="text-[12.5px] text-amber-800 mb-2">
                    Please sign in or create an account so your subscription and <strong>{plan.monthlyGenerations} monthly generations</strong> can be linked to your user profile.
                  </p>
                  <Link
                    to={`/sign-in?plan=${plan.id}`}
                    className="inline-block font-bold text-[#FF5A00] hover:underline"
                  >
                    Sign in / Sign up now →
                  </Link>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="mb-7 pb-6 border-b border-[rgba(17,17,17,0.08)]">
              <h2 className="text-[16px] font-bold text-[#111111] mb-3">Order summary</h2>
              <div className="flex justify-between text-[14px] text-[#6B6B67] mb-2">
                <span>{plan.name} Subscription (Billed Monthly)</span>
                <span className="text-[#111111] font-semibold">{plan.priceFormatted}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#6B6B67] mb-2">
                <span>Monthly allowance</span>
                <span className="text-[#111111] font-semibold">{plan.monthlyGenerations} carousels</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#6B6B67] mb-2">
                <span>Payment processor</span>
                <span className="text-[#111111] font-semibold">Dodo Payments</span>
              </div>
              <div className="flex justify-between text-[16px] font-bold text-[#111111] pt-3 border-t border-[rgba(17,17,17,0.06)] mt-3">
                <span>Total due today</span>
                <span className="text-[#FF5A00] text-[22px] font-black">{plan.priceFormatted}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-[13px] leading-relaxed flex items-start gap-2.5">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Checkout Error</p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Dodo Checkout Action */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleProceedToDodo}
                disabled={loadingCheckout}
                className="w-full py-4 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[15px] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5A00]/25 hover:shadow-xl hover:shadow-[#FF5A00]/30 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loadingCheckout ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Dodo Payments...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Dodo Payments ({plan.priceFormatted})</span>
                    <ExternalLink size={16} />
                  </>
                )}
              </button>

              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[rgba(17,17,17,0.06)] space-y-2 text-[12.5px] text-[#6B6B67]">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-[#111111]" />
                  <span className="font-semibold text-[#111111]">Server-Verified Subscription</span>
                </div>
                <p>
                  You will be securely redirected to Dodo Payments hosted checkout to complete your transaction. Your subscription will be activated automatically via server webhook upon confirmation.
                </p>
              </div>
            </div>

            <p className="text-[12px] text-center text-[#6B6B67] mt-6">
              By confirming, you agree to SWAPP's Terms of Service and Privacy Policy. Cancel anytime from your account.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-[12px] text-[#6B6B67] border-t border-[rgba(17,17,17,0.06)] bg-white">
        SWAPP.AI — Powered by Dodo Payments
      </footer>
    </div>
  );
}
