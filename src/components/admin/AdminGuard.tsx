import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

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

  const hasLocalAdmin = typeof window !== 'undefined' && !!localStorage.getItem('swapp_admin_session');
  const effectiveAdmin = isAdmin || hasLocalAdmin;

  if (!effectiveAdmin) {
    return <Navigate to="/login" state={{ from: location, adminRequired: true }} replace />;
  }

  return <>{children}</>;
}
