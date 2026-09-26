import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Layers, PlusCircle, Tag, HardDrive,
  Users, Settings, ChevronLeft, ChevronRight, ArrowLeft, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Carousel Management',
    items: [
      { to: '/admin/templates', label: 'All Templates', icon: Layers },
      { to: '/admin/templates/new', label: 'Add Template', icon: PlusCircle },
      { to: '/admin/categories', label: 'Categories', icon: Tag },
      { to: '/admin/assets', label: 'Assets', icon: HardDrive },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { profile, signOut } = useAuth();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(to + '/');
  };

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? 60 : 220,
        background: '#0F0E0C',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand + collapse */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', minHeight: 56 }}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-0.5 no-underline">
            <span className="text-[17px] font-black tracking-[-0.04em] text-[#F7F5F0]" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>swapp</span>
            <span className="text-[17px] font-black tracking-[-0.04em] text-[#FF5A00]" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>.ai</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.7)] hover:bg-[rgba(255,255,255,0.05)] transition-all ml-auto"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-5">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[rgba(247,245,240,0.22)] px-2 mb-1.5">
                {section.label}
              </p>
            )}
            {section.items.map(item => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] font-medium mb-0.5 no-underline transition-all group ${
                    active
                      ? 'bg-[rgba(255,90,0,0.14)] text-[#FF5A00]'
                      : 'text-[rgba(247,245,240,0.45)] hover:text-[rgba(247,245,240,0.8)] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <item.icon size={15} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + back to app */}
      <div className="border-t px-2 py-3 flex flex-col gap-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {!collapsed && profile && (
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#FF5A00] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {(profile.fullName || profile.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[rgba(247,245,240,0.7)] truncate">{profile.fullName || profile.email}</p>
              <p className="text-[10px] text-[rgba(247,245,240,0.3)]">Admin</p>
            </div>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] text-[rgba(247,245,240,0.3)] hover:text-[rgba(247,245,240,0.6)] transition-colors no-underline"
          title={collapsed ? 'Back to SWAPP.AI' : undefined}
        >
          <ArrowLeft size={14} className="flex-shrink-0" />
          {!collapsed && 'Back to SWAPP.AI'}
        </Link>
      </div>
    </aside>
  );
}
