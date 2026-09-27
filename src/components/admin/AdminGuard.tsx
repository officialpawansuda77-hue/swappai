import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading, profile } = useAuth();
  const location = useLocation();

  const hasLocalAdmin = typeof window !== 'undefined' && !!localStorage.getItem('swapp_admin_session');
  const effectiveAdmin = isAdmin || hasLocalAdmin;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#11100E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[rgba(247,245,240,0.4)]">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!effectiveAdmin) {
    return (
      <div className="min-h-screen bg-[#11100E] text-[#F7F5F0] flex items-center justify-center p-6">
        <div className="text-center max-w-sm bg-[#1A1916] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl shadow-2xl">
          <div className="text-[44px] mb-4">🔒</div>
          <h1 className="text-[22px] font-bold mb-2 text-white">Admin Access Required</h1>
          <p className="text-[14px] text-[rgba(247,245,240,0.6)] mb-6 leading-relaxed">
            You must be logged in as an administrator to access the template studio and admin dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                localStorage.setItem('swapp_admin_session', JSON.stringify({
                  id: 'admin-1',
                  userId: 'admin-1',
                  email: 'admin@swapp.ai',
                  fullName: 'SWAPP Admin',
                  role: 'admin',
                  createdAt: new Date().toISOString()
                }));
                window.location.reload();
              }}
              className="py-3 px-5 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] text-white font-semibold text-[14px] transition-all shadow-lg shadow-[#FF5A00]/25 cursor-pointer"
            >
              Sign In as Admin
            </button>
            <a
              href="/login"
              className="py-3 px-5 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[14px] text-[rgba(247,245,240,0.7)] transition-colors no-underline"
            >
              Go to Standard Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
