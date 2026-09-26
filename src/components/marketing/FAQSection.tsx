import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FAQItem {
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
  {
    q: 'What is SWAPP.AI and how does it work?',
    a: 'SWAPP.AI is a purpose-built carousel creation platform for LinkedIn and Instagram creators. You can discover proven viral structures, swap the text and imagery in our full Canvas Editor or generate drafts with AI, and export production-ready slides in seconds.',
  },
  {
    q: 'What format and resolution are the exported carousels?',
    a: 'Carousels export at crisp 1080 × 1350px (4:5 portrait ratio) — the optimal aspect ratio for maximum engagement on LinkedIn and Instagram. You can export as high-resolution PNG, JPG, or multi-page PDF documents.',
  },
  {
    q: 'Can I upload my own images and customize brand fonts?',
    a: 'Yes! The Canvas Editor includes an Uploads manager, custom color pickers, editorial gradients, and a dedicated Brand Kit where you can save your brand colors, typography, and social handle to re-theme slides in one click.',
  },
  {
    q: 'What are the limits on the Starter, Creator, and Studio plans?',
    a: 'The Starter plan is 100% free with 5 generations/month and 3 active projects. The Creator plan ($29/mo) offers 50 generations/month, 25 projects, and watermark removal. The Studio plan ($79/mo) provides unlimited generations and priority rendering.',
  },
  {
    q: 'Do I own the commercial rights to my exported carousels?',
    a: 'Absolutely. You retain 100% full intellectual property ownership of your exported designs, slides, and copy. You can freely use them for personal branding, client deliverables, or commercial social media.',
  },
  {
    q: 'Can I cancel or upgrade my subscription at any time?',
    a: 'Yes, there are no locked contracts. You can easily upgrade, downgrade, or cancel your subscription at any time directly from your dashboard settings.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="py-24 bg-[#F7F5F0] border-t border-[rgba(17,17,17,0.06)]">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,90,0,0.1)] text-[#FF5A00] text-[11px] font-bold tracking-wider uppercase mb-3">
            <HelpCircle size={13} /> Common Questions
          </div>
          <h2 className="text-[36px] md:text-[44px] font-black tracking-tight text-[#111111] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[16px] text-[#6B6B67] max-w-[500px] mx-auto">
            Everything you need to know about creating high-impact carousels with SWAPP.AI.
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-[720px] mx-auto">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[rgba(17,17,17,0.08)] overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[16px] text-[#111111] hover:text-[#FF5A00] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full bg-[rgba(17,17,17,0.04)] flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#FF5A00] text-white' : 'text-[#6B6B67]'}`}>
                    <ChevronDown size={15} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-[14px] text-[#555552] leading-relaxed border-t border-[rgba(17,17,17,0.04)] pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-[14px] text-[#6B6B67] mb-3">Still have questions?</p>
          <a
            href="mailto:support@swapp.ai"
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#FF5A00] hover:underline"
          >
            Chat with our creator support team <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
