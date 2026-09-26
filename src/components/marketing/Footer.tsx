import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#11100E] text-[#F7F5F0]">
      <div className="container-wide py-20">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-[rgba(255,255,255,0.08)]">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-1 no-underline mb-4">
              <span className="text-[22px] font-black tracking-[-0.04em] text-[#F7F5F0]" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>swapp</span>
              <span className="text-[22px] font-black tracking-[-0.04em] text-[#FF5A00]" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>.ai</span>
            </Link>
            <p className="text-[15px] text-[rgba(247,245,240,0.5)] leading-relaxed max-w-[260px]">
              Make something worth swiping.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-[rgba(255,255,255,0.3)] hover:text-[#FF5A00] transition-all text-[rgba(247,245,240,0.5)]">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-[rgba(255,255,255,0.3)] hover:text-[#FF5A00] transition-all text-[rgba(247,245,240,0.5)]">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-[rgba(255,255,255,0.3)] hover:text-[#FF5A00] transition-all text-[rgba(247,245,240,0.5)]">
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[rgba(247,245,240,0.4)] mb-5">Product</p>
            <ul className="flex flex-col gap-3">
              {['Templates', 'Canvas', 'AI Remix', 'Pricing'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-[14px] text-[rgba(247,245,240,0.55)] hover:text-[#F7F5F0] transition-colors no-underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[rgba(247,245,240,0.4)] mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {['About', 'Contact', 'FAQ'].map(item => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-[rgba(247,245,240,0.55)] hover:text-[#F7F5F0] transition-colors no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[rgba(247,245,240,0.4)] mb-5">Legal</p>
            <ul className="flex flex-col gap-3">
              {['Privacy', 'Terms'].map(item => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-[rgba(247,245,240,0.55)] hover:text-[#F7F5F0] transition-colors no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-[rgba(247,245,240,0.3)]">
            © 2025 SWAPP.AI. All rights reserved.
          </p>
          <p className="text-[13px] text-[rgba(247,245,240,0.2)]">
            The carousel design workspace.
          </p>
        </div>
      </div>
    </footer>
  );
}
