import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading, profile } = useAuth();
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

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-[48px] mb-4">🔒</div>
          <h1 className="text-[24px] font-bold mb-2">Access Denied</h1>
          <p className="text-[15px] text-[#6B6B67] mb-6">
            You need admin permissions to access this area.
          </p>
          <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
