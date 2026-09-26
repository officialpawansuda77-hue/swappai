import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="container-narrow py-16">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B67] hover:text-[#111111] transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,90,0,0.1)] text-[#FF5A00] text-[11px] font-bold tracking-wider uppercase mb-3">
            <FileText size={12} /> Terms of Service
          </div>
          <h1 className="text-[38px] md:text-[48px] font-black tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="text-[14px] text-[#6B6B67] mt-2">
            Last Updated: September 2026 · Effective for all users
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(17,17,17,0.08)] p-8 md:p-12 shadow-sm space-y-8 text-[15px] text-[#333333] leading-relaxed">
          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the SWAPP.AI website, application, or services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">2. Service Description & Subscriptions</h2>
            <p className="mb-3">
              SWAPP.AI provides creator tools for designing, customizing, and generating carousels. We offer different tiers including Starter (Free), Creator ($29/mo), and Studio ($79/mo) plans.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Monthly Limits:</strong> Each plan includes a specific quota of carousel generations and projects per billing cycle. Unused monthly quotas do not roll over to subsequent months.</li>
              <li><strong>Billing & Renewals:</strong> Paid subscriptions are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time via your account dashboard.</li>
              <li><strong>Refund Policy:</strong> If you are unsatisfied with your paid subscription, contact us within 14 days of your initial purchase for a full refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">3. Commercial Use & Content Ownership</h2>
            <p>
              You own all intellectual property rights in the carousel slides, text, images, and content you create with SWAPP.AI. You have full commercial rights to publish, distribute, monetize, or use your exported carousels on LinkedIn, Instagram, X (Twitter), blogs, or client projects without attribution.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">4. Acceptable Use Policy</h2>
            <p className="mb-2">You agree not to use the service to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Generate deceptive, defamatory, unlawful, or infringing content.</li>
              <li>Attempt to reverse engineer, scrape, or compromise platform infrastructure or APIs.</li>
              <li>Share single-user accounts across multiple automated bots or unauthorized parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">5. Disclaimer & Limitation of Liability</h2>
            <p>
              SWAPP.AI is provided on an "as is" and "as available" basis without warranties of any kind. In no event shall SWAPP.AI or its directors be liable for indirect, incidental, or consequential damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">6. Contact Information</h2>
            <p>
              Questions regarding these Terms should be sent to <a href="mailto:legal@swapp.ai" className="text-[#FF5A00] font-semibold underline">legal@swapp.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
