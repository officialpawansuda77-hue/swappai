import React from 'react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import FAQSection from '../components/marketing/FAQSection';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
