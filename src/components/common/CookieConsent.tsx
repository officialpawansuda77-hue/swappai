import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'swapp_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Show after 1 second delay
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-[420px] z-50 bg-[#141311] border border-[rgba(255,255,255,0.12)] text-[#F7F5F0] p-4 sm:p-5 rounded-2xl shadow-2xl shadow-black/60 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[rgba(255,90,0,0.15)] flex items-center justify-center flex-shrink-0 text-[#FF5A00]">
          <Cookie size={16} />
        </div>
        <div className="flex-1">
          <h4 className="text-[13px] font-bold text-white mb-1">Cookie Preferences</h4>
          <p className="text-[12px] text-[rgba(247,245,240,0.65)] leading-relaxed mb-3">
            We use essential cookies and storage to preserve your canvas edits and improve platform performance. Read our{' '}
            <Link to="/privacy" className="text-[#FF5A00] underline hover:text-[#ff782e]">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="py-1.5 px-3.5 rounded-lg bg-[#FF5A00] hover:bg-[#e04f00] text-white text-[12px] font-semibold transition-all shadow-md shadow-[#FF5A00]/20"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="py-1.5 px-3 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-[rgba(247,245,240,0.7)] hover:text-white text-[12px] font-medium transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Close cookie banner"
          className="text-[rgba(247,245,240,0.4)] hover:text-white transition-colors p-1"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
