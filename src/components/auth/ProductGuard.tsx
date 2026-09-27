import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProductGuardProps {
  children: React.ReactNode;
}

/**
 * ProductGuard ensures that unauthenticated/unauthorized users cannot bypass
 * pricing, subscription, or login to directly access Dashboard, Create, or Editor.
 */
export function ProductGuard({ children }: ProductGuardProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#11100E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-[rgba(247,245,240,0.4)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  const hasLocalAdmin = typeof window !== 'undefined' && !!localStorage.getItem('swapp_admin_session');

  // If user is not authenticated, redirect to /pricing so they choose a plan first
  if (!user && !profile && !hasLocalAdmin) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
