import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { profile, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Templates', to: '/templates' },
    { label: 'How it works', to: '/#how-it-works' },
    { label: 'Features', to: '/#features' },
    { label: 'Pricing', to: '/pricing' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[rgba(17,17,17,0.10)]'
            : 'bg-[#F7F5F0] border-b border-[rgba(17,17,17,0.08)]'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 no-underline group">
              <span
                className="text-[20px] font-black tracking-[-0.04em] text-[#111111] font-display"
                style={{ fontFamily: 'Manrope, Inter, sans-serif' }}
              >
                swapp
              </span>
              <span
                className="text-[20px] font-black tracking-[-0.04em] text-[#FF5A00] font-display"
                style={{ fontFamily: 'Manrope, Inter, sans-serif' }}
              >
                .ai
              </span>
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[#FF5A00] opacity-80 group-hover:scale-125 transition-transform" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {profile ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="text-[13px] font-semibold text-[#FF5A00] hover:underline px-2">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" className="nav-link font-medium">
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link to="/login" className="nav-link font-medium">
                  Log in
                </Link>
              )}
              <Link to={profile ? "/dashboard" : "/pricing"} className="btn-primary btn-sm flex items-center gap-1.5">
                Create carousel
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Mobile burger */}
            <div className="flex md:hidden items-center gap-3">
              <Link to={profile ? "/dashboard" : "/pricing"} className="btn-accent btn-sm flex items-center gap-1.5">
                Create
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-[rgba(17,17,17,0.06)] transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F7F5F0] pt-[64px] md:hidden">
          <div className="container-wide py-8 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="py-4 text-[18px] font-medium text-[#111111] border-b border-[rgba(17,17,17,0.08)] no-underline hover:text-[#FF5A00] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              {profile ? (
                <Link to="/dashboard" className="btn-ghost w-full text-center justify-center">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-ghost w-full text-center justify-center">
                  Log in
                </Link>
              )}
              <Link to={profile ? "/dashboard" : "/pricing"} className="btn-primary w-full text-center justify-center">
                Create carousel →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
