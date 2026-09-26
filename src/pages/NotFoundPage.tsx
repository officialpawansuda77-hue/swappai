import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Layout, Sparkles } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="container-narrow py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,90,0,0.1)] text-[#FF5A00] text-[12px] font-bold tracking-wider uppercase mb-6">
          <Compass size={14} /> 404 Error
        </div>

        <h1 className="text-[56px] md:text-[72px] font-black tracking-tight leading-none mb-4">
          404
        </h1>
        <h2 className="text-[24px] md:text-[32px] font-bold text-[#111111] mb-6">
          This page doesn't exist.
        </h2>

        <p className="text-[17px] md:text-[20px] text-[#6B6B67] max-w-[540px] mx-auto leading-relaxed mb-10">
          The slide or page you are looking for has been moved or was never created. Let's get you back to crafting carousels.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/"
            className="btn-accent flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold"
          >
            <ArrowLeft size={16} /> Back to SWAPP
          </Link>
          <Link
            to="/templates"
            className="btn-secondary flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold"
          >
            <Layout size={16} /> Browse Templates
          </Link>
          <Link
            to="/editor/new"
            className="btn-secondary flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold"
          >
            <Sparkles size={16} /> Open Canvas Editor
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[rgba(17,17,17,0.08)] max-w-[480px] mx-auto text-left shadow-sm">
          <p className="text-[13px] font-bold text-[#111111] mb-2">Popular destinations:</p>
          <div className="flex flex-col gap-2 text-[13px] text-[#6B6B67]">
            <Link to="/templates" className="hover:text-[#FF5A00] transition-colors">• Proven Carousel Templates</Link>
            <Link to="/pricing" className="hover:text-[#FF5A00] transition-colors">• Creator & Studio Pricing Plans</Link>
            <Link to="/faq" className="hover:text-[#FF5A00] transition-colors">• Frequently Asked Questions</Link>
            <Link to="/login" className="hover:text-[#FF5A00] transition-colors">• Sign In to Dashboard</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
