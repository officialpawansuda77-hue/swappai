import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { getPendingPlan, setPendingPlan, PLANS, PlanDetails } from '../lib/subscription';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(getPendingPlan());
  const [cardName, setCardName] = useState('Ava Mitchell');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12 / 28');
  const [cardCvc, setCardCvc] = useState('982');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If no pending plan or if plan is free starter, redirect to pricing
  useEffect(() => {
    const current = getPendingPlan();
    if (!current || current.planId === 'starter') {
      navigate('/pricing', { replace: true });
    } else {
      setPending(current);
    }
  }, [navigate]);

  if (!pending || pending.planId === 'starter') {
    return null;
  }

  const plan: PlanDetails = PLANS[pending.planId] || PLANS.creator;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setProcessing(true);

    setTimeout(() => {
      const txnId = 'demo_txn_' + Math.random().toString(36).substring(2, 10);
      // Mark as paid_demo
      setPendingPlan(plan.id, 'paid_demo', txnId);
      setProcessing(false);
      // Navigate to Sign up / Login to activate the subscription
      navigate('/sign-in');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[rgba(17,17,17,0.06)] bg-white">
        <Link to="/" className="flex items-center gap-1.5 no-underline">
          <span className="text-[20px] font-black tracking-[-0.04em] text-[#111111]">swapp</span>
          <span className="text-[20px] font-black tracking-[-0.04em] text-[#FF5A00]">.ai</span>
          <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
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
              CHECKOUT
            </span>
            <h1 className="text-[34px] md:text-[38px] font-black tracking-[-0.03em] text-[#111111] leading-tight mb-4">
              Complete your purchase.
            </h1>
            <p className="text-[15px] text-[#6B6B67] mb-8 leading-relaxed">
              Unlock the full carousel studio with {plan.name} features.
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
              <span>Encrypted demo payment. Cancel anytime from your account settings.</span>
            </div>
          </div>

          {/* Right Column: Payment Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-[rgba(17,17,17,0.08)] shadow-lg">
            {/* Demo Notice Banner */}
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[12.5px] flex items-center gap-2.5">
              <Lock size={15} className="text-amber-600 flex-shrink-0" />
              <span>
                <strong>Demo Checkout:</strong> No real money will be charged. This simulates payment for testing.
              </span>
            </div>

            {/* Order Summary */}
            <div className="mb-7 pb-6 border-b border-[rgba(17,17,17,0.08)]">
              <h2 className="text-[16px] font-bold text-[#111111] mb-3">Order summary</h2>
              <div className="flex justify-between text-[14px] text-[#6B6B67] mb-2">
                <span>{plan.name} plan (Monthly)</span>
                <span className="text-[#111111] font-semibold">{plan.priceFormatted}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#6B6B67] mb-2">
                <span>Taxes & fees</span>
                <span className="text-[#111111] font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between text-[16px] font-bold text-[#111111] pt-3 border-t border-[rgba(17,17,17,0.06)] mt-3">
                <span>Total due today</span>
                <span className="text-[#FF5A00] text-[20px] font-black">{plan.priceFormatted}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[13px]">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                  Cardholder name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[rgba(17,17,17,0.12)] rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                  Card details
                </label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B67]" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[rgba(17,17,17,0.12)] rounded-xl pl-11 pr-4 py-3 text-[14px] font-mono text-[#111111] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                    Expiry date
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full bg-[#F7F5F0] border border-[rgba(17,17,17,0.12)] rounded-xl px-4 py-3 text-[14px] font-mono text-[#111111] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full bg-[#F7F5F0] border border-[rgba(17,17,17,0.12)] rounded-xl px-4 py-3 text-[14px] font-mono text-[#111111] focus:outline-none focus:border-[#FF5A00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 hover:shadow-xl hover:shadow-[#FF5A00]/30 active:scale-[0.99] disabled:opacity-50 mt-6 cursor-pointer"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <span>Pay {plan.priceFormatted}</span>
                )}
              </button>
            </form>

            <p className="text-[12px] text-center text-[#6B6B67] mt-4">
              By confirming, you agree to SWAPP's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-[12px] text-[#6B6B67] border-t border-[rgba(17,17,17,0.06)] bg-white">
        SWAPP.AI — Secure Checkout Simulation
      </footer>
    </div>
  );
}
