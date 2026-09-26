import { useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { PlanDetails } from '../../lib/subscription';

interface PlanModalProps {
  plan: PlanDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onContinue: (plan: PlanDetails) => void;
}

export default function PlanModal({ plan, isOpen, onClose, onContinue }: PlanModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !plan) return null;

  const isFree = plan.price === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-[28px] p-8 md:p-9 shadow-2xl relative text-[#111111] animate-in zoom-in-95 duration-200 border border-[rgba(0,0,0,0.06)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Top Orange Sparkle Icon */}
        <div className="w-11 h-11 rounded-full bg-[#FF5A00] flex items-center justify-center text-white mb-6 shadow-md shadow-[#FF5A00]/25">
          <Sparkles size={20} className="fill-white" />
        </div>

        {/* Plan Title */}
        <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#111111] mb-1.5">
          {plan.name} plan
        </h2>

        {/* Pricing Subtext */}
        <p className="text-[14px] text-[#6B6B67] mb-7 leading-relaxed">
          {plan.subDescription || `${plan.priceFormatted} / month, billed monthly. Cancel anytime.`}
        </p>

        {/* Features Checklist */}
        <div className="space-y-3.5 mb-9">
          {plan.features.map(feature => (
            <div key={feature} className="flex items-start gap-3">
              <Check size={16} className="text-[#FF5A00] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-[14px] font-medium text-[#111111] leading-snug">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-full border border-[rgba(17,17,17,0.18)] hover:border-[#111111] text-[#111111] font-semibold text-[14px] transition-all text-center bg-white hover:bg-[rgba(0,0,0,0.02)]"
          >
            Back to plans
          </button>

          <button
            type="button"
            onClick={() => onContinue(plan)}
            className="flex-1 py-3 px-5 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[14px] transition-all text-center shadow-lg shadow-[#FF5A00]/25 hover:shadow-xl hover:shadow-[#FF5A00]/30 active:scale-[0.98]"
          >
            {isFree ? 'Continue' : 'Continue to payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
