import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import PlanModal from '../components/pricing/PlanModal';
import { PLANS, PlanDetails, setPendingPlan } from '../lib/subscription';

export default function PricingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPlan = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleModalContinue = (plan: PlanDetails) => {
    setIsModalOpen(false);
    if (plan.price === 0) {
      // Free plan: Save pending starter, directly go to authentication
      setPendingPlan('starter', 'free');
      navigate('/sign-in');
    } else {
      // Paid plan: Save pending plan, proceed to checkout
      setPendingPlan(plan.id, 'pending');
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen text-[#111111] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white">
      <Navbar />

      <main className="pt-[100px] pb-24 flex-1">
        <div className="container-wide">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF5A00] mb-4">
              STRAIGHTFORWARD PRICING
            </span>
            <h1 className="text-[clamp(40px,5.8vw,68px)] font-black tracking-[-0.04em] text-[#111111] leading-[1.04] mb-6">
              Make more. Pay<br />less attention to<br />tools.
            </h1>
            <p className="text-[17px] md:text-[19px] text-[#6B6B67] leading-relaxed max-w-xl mx-auto">
              Start free. Upgrade when SWAPP becomes part of your publishing rhythm.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1120px] mx-auto items-stretch">
            {/* 1. STARTER */}
            <div className="bg-white rounded-[26px] p-8 md:p-9 border border-[rgba(17,17,17,0.08)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] font-bold text-[#111111] mb-2">{PLANS.starter.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[44px] md:text-[48px] font-black tracking-tight text-[#111111]">
                    {PLANS.starter.priceFormatted}
                  </span>
                  <span className="text-[15px] font-medium text-[#6B6B67]">{PLANS.starter.period}</span>
                </div>
                <p className="text-[14px] text-[#6B6B67] mb-8 min-h-[40px]">{PLANS.starter.description}</p>

                <button
                  type="button"
                  onClick={() => handleOpenPlan(PLANS.starter)}
                  className="w-full py-3.5 px-6 rounded-full border border-[rgba(17,17,17,0.18)] hover:border-[#111111] text-[#111111] font-semibold text-[14px] transition-all text-center bg-white hover:bg-[rgba(0,0,0,0.02)] active:scale-[0.99] mb-8"
                >
                  {PLANS.starter.ctaText}
                </button>

                <div className="pt-6 border-t border-[rgba(17,17,17,0.06)] space-y-3.5">
                  {PLANS.starter.features.map(feat => (
                    <div key={feat} className="flex items-start gap-3">
                      <Check size={16} className="text-[#FF5A00] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[13.5px] font-medium text-[#111111]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. CREATOR (MOST POPULAR) */}
            <div className="bg-white rounded-[26px] p-8 md:p-9 border-2 border-[#FF5A00] shadow-xl shadow-[#FF5A00]/5 flex flex-col justify-between relative transform lg:-translate-y-2">
              {/* Badge */}
              <div className="absolute -top-3.5 right-8 bg-[#FF5A00] text-white text-[11px] font-bold tracking-wide uppercase px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A00]/30">
                <Sparkles size={12} className="fill-white" />
                <span>Most popular</span>
              </div>

              <div>
                <h3 className="text-[20px] font-bold text-[#111111] mb-2">{PLANS.creator.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[44px] md:text-[48px] font-black tracking-tight text-[#111111]">
                    {PLANS.creator.priceFormatted}
                  </span>
                  <span className="text-[15px] font-medium text-[#6B6B67]">{PLANS.creator.period}</span>
                </div>
                <p className="text-[14px] text-[#6B6B67] mb-8 min-h-[40px]">{PLANS.creator.description}</p>

                <button
                  type="button"
                  onClick={() => handleOpenPlan(PLANS.creator)}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[14px] transition-all text-center shadow-lg shadow-[#FF5A00]/25 hover:shadow-xl hover:shadow-[#FF5A00]/30 active:scale-[0.99] mb-8"
                >
                  {PLANS.creator.ctaText}
                </button>

                <div className="pt-6 border-t border-[rgba(17,17,17,0.06)] space-y-3.5">
                  {PLANS.creator.features.map(feat => (
                    <div key={feat} className="flex items-start gap-3">
                      <Check size={16} className="text-[#FF5A00] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[13.5px] font-medium text-[#111111]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. STUDIO */}
            <div className="bg-white rounded-[26px] p-8 md:p-9 border border-[rgba(17,17,17,0.08)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] font-bold text-[#111111] mb-2">{PLANS.studio.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[44px] md:text-[48px] font-black tracking-tight text-[#111111]">
                    {PLANS.studio.priceFormatted}
                  </span>
                  <span className="text-[15px] font-medium text-[#6B6B67]">{PLANS.studio.period}</span>
                </div>
                <p className="text-[14px] text-[#6B6B67] mb-8 min-h-[40px]">{PLANS.studio.description}</p>

                <button
                  type="button"
                  onClick={() => handleOpenPlan(PLANS.studio)}
                  className="w-full py-3.5 px-6 rounded-full border border-[rgba(17,17,17,0.18)] hover:border-[#111111] text-[#111111] font-semibold text-[14px] transition-all text-center bg-white hover:bg-[rgba(0,0,0,0.02)] active:scale-[0.99] mb-8"
                >
                  {PLANS.studio.ctaText}
                </button>

                <div className="pt-6 border-t border-[rgba(17,17,17,0.06)] space-y-3.5">
                  {PLANS.studio.features.map(feat => (
                    <div key={feat} className="flex items-start gap-3">
                      <Check size={16} className="text-[#FF5A00] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[13.5px] font-medium text-[#111111]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="text-center mt-12 mb-4">
            <p className="text-[13px] text-[#6B6B67]">
              Prices shown for product demonstration. No real payment is collected in this MVP.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Plan Selection Confirmation Modal */}
      <PlanModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinue={handleModalContinue}
      />
    </div>
  );
}
