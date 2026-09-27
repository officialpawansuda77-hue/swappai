import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const hasLocalAdmin = typeof window !== 'undefined' && !!localStorage.getItem('swapp_admin_session');
  const isEffectiveAdmin = isAdmin || hasLocalAdmin;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location, closeMenu]);

  // ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => document.body.classList.remove('menu-open');
  }, []);

  const navLinks = [
    { label: 'Templates', to: '/templates' },
    { label: 'How it works', to: '/#how-it-works' },
    { label: 'Features', to: '/#features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'FAQ', to: '/faq' },
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
              {isEffectiveAdmin && (
                <Link
                  to="/admin"
                  className="text-[12.5px] font-bold text-[#FF5A00] bg-[rgba(255,90,0,0.1)] hover:bg-[rgba(255,90,0,0.18)] px-2.5 py-1 rounded-lg transition-colors border border-[rgba(255,90,0,0.2)] no-underline"
                >
                  Admin Panel
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/dashboard" className="nav-link font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-[13px] text-[#6B6B67] hover:text-[#111111] px-2 font-medium transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Log out
                  </button>
                  <Link to="/create" className="btn-primary btn-sm flex items-center gap-1.5">
                    Create carousel
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link font-medium">
                    Log in
                  </Link>
                  <Link to="/pricing" className="btn-primary btn-sm flex items-center gap-1.5">
                    Create carousel
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <div className="flex md:hidden items-center gap-3">
              <Link to={user ? "/create" : "/pricing"} className="btn-accent btn-sm flex items-center gap-1.5">
                Create
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-[rgba(17,17,17,0.06)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="mobile-menu-overlay fixed inset-0 z-40 bg-[#F7F5F0] md:hidden"
          style={{ top: 64, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="container-wide py-6 flex flex-col h-full">
            <nav className="flex flex-col gap-0">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-4 text-[18px] font-semibold text-[#111111] border-b border-[rgba(17,17,17,0.08)] no-underline active:text-[#FF5A00] transition-colors flex items-center"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              {isEffectiveAdmin && (
                <Link
                  to="/admin"
                  className="py-3 px-4 rounded-xl bg-[rgba(255,90,0,0.1)] text-[#FF5A00] font-bold text-[15px] flex items-center justify-between no-underline"
                  onClick={closeMenu}
                >
                  <span>Admin Panel</span>
                  <ArrowRight size={16} />
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn-ghost w-full text-center justify-center"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create"
                    className="btn-accent w-full text-center justify-center"
                    onClick={closeMenu}
                  >
                    Create carousel →
                  </Link>
                  <button
                    onClick={() => { signOut(); closeMenu(); }}
                    className="py-3 text-[14px] text-[#6B6B67] text-center bg-transparent border-none cursor-pointer min-h-[44px]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/pricing"
                    className="btn-accent w-full text-center justify-center"
                    onClick={closeMenu}
                  >
                    Create carousel →
                  </Link>
                  <Link
                    to="/login"
                    className="btn-ghost w-full text-center justify-center"
                    onClick={closeMenu}
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
