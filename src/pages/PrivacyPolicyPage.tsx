import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="container-narrow py-16">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B67] hover:text-[#111111] transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,90,0,0.1)] text-[#FF5A00] text-[11px] font-bold tracking-wider uppercase mb-3">
            <Shield size={12} /> Legal Compliance
          </div>
          <h1 className="text-[38px] md:text-[48px] font-black tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-[#6B6B67] mt-2">
            Last Updated: September 2026 · Effective Immediately
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(17,17,17,0.08)] p-8 md:p-12 shadow-sm space-y-8 text-[15px] text-[#333333] leading-relaxed">
          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">1. Introduction</h2>
            <p>
              Welcome to SWAPP.AI ("SWAPP", "we", "us", or "our"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and protect your information when you visit our website, use our carousel creation canvas, or subscribe to our services.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, and authentication tokens when you register or sign in.</li>
              <li><strong>Project Data:</strong> Carousel slide text, customized layouts, chosen colors, uploaded brand assets, and generated designs.</li>
              <li><strong>Payment & Billing:</strong> Subscription plan type, billing address, and transaction identifiers. (We do not store complete raw credit card numbers; payment data is securely handled by certified payment partners).</li>
              <li><strong>Usage Analytics:</strong> Browser type, operating system, pages visited, device information, and interaction timestamps.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide, maintain, and improve the SWAPP.AI platform and Canvas Editor.</li>
              <li>Process carousel generation requests and export downloads.</li>
              <li>Manage your user account, active subscription tiers, and monthly carousel limits.</li>
              <li>Send critical service updates, transactional receipts, and security alerts.</li>
              <li>Ensure platform safety, prevent fraudulent activity, and enforce our Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">4. Intellectual Property & Your Content</h2>
            <p>
              You retain 100% full ownership and copyright of the content, text, and images you upload or create using SWAPP.AI. We do not claim ownership of your carousel exports, and we will never sell your carousel designs or data to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">5. Cookies and Local Storage</h2>
            <p>
              We use necessary session cookies and browser LocalStorage to preserve your editor canvas state, brand kit settings, and authentication sessions so you don't lose work when switching tabs. You can control or clear cookies at any time via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">6. Your Data Rights</h2>
            <p>
              Under applicable data protection laws (including GDPR and CCPA), you have the right to request access to your data, request corrections, export your project archives, or request the permanent deletion of your account and associated assets.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#111111] mb-3">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or wish to exercise your data rights, please contact our privacy team at <a href="mailto:privacy@swapp.ai" className="text-[#FF5A00] font-semibold underline">privacy@swapp.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
