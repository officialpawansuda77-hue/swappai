import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getPendingPlan, activateSubscription, PLANS, PlanDetails } from '../lib/subscription';

export default function LoginPage() {
  const { signIn, signUp, signInAsDemo, isConfigured, profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [fullName, setFullName] = useState('Ava Mitchell');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pendingPlan = getPendingPlan();
  const activePlanDetails: PlanDetails = pendingPlan
    ? PLANS[pendingPlan.planId] || PLANS.starter
    : PLANS.starter;

  // Plan tagline
  const planTag = pendingPlan
    ? `${activePlanDetails.name.toUpperCase()} PLAN · ${activePlanDetails.priceFormatted} / MO`
    : 'GET STARTED FREE · $0 / MO';

  const handleAuthSuccess = async (targetUserId: string) => {
    const planToActivate = pendingPlan?.planId || 'starter';
    const paymentStatus = pendingPlan?.paymentStatus || 'free';

    // Activate subscription in database / local persistence
    await activateSubscription(targetUserId, planToActivate, paymentStatus);

    setSuccessMsg(
      `Welcome! ${PLANS[planToActivate].name} plan activated with ${PLANS[planToActivate].monthlyGenerations} generations this month.`
    );

    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        // Immediately try signing in or prompt
        const signInRes = await signIn(email, password);
        if (signInRes.error) {
          setSuccessMsg('Account created! Please enter your password to log in.');
          setMode('signin');
          setLoading(false);
          return;
        }
        // Authenticated
        await handleAuthSuccess(signInRes.error ? 'new-user' : (user?.id || 'user-' + Date.now()));
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        await handleAuthSuccess(user?.id || 'user-' + Date.now());
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleDemoContinue = async (role: 'admin' | 'user') => {
    signInAsDemo(role);
    const demoId = role === 'admin' ? 'demo-admin-id' : 'demo-user-id';
    const planToActivate = role === 'admin' ? 'studio' : (pendingPlan?.planId || 'creator');
    await activateSubscription(demoId, planToActivate, 'paid_demo');
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between selection:bg-[#FF5A00] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 pt-28">
        <div className="w-full max-w-[440px] mx-auto text-left">
          {/* Plan Eyebrow Tag */}
          <div className="mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF5A00]">
              {planTag}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[40px] md:text-[44px] font-black tracking-[-0.04em] text-[#111111] leading-[1.08] mb-3">
            {mode === 'signup' ? 'Create your account.' : 'Welcome back.'}
          </h1>

          <p className="text-[15px] text-[#6B6B67] leading-relaxed mb-8">
            {pendingPlan?.paymentStatus === 'paid_demo'
              ? 'Sign in or create your account to unlock the editor and activate your plan.'
              : 'Sign in or create an account to activate your plan and start creating.'}
          </p>

          {/* Toggle pill: Sign up / Log in */}
          <div className="bg-white border border-[rgba(17,17,17,0.12)] rounded-full p-1 flex mb-8 max-w-[340px]">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 px-5 rounded-full text-[13.5px] font-bold transition-all text-center ${
                mode === 'signup'
                  ? 'bg-[#FF5A00] text-white shadow-sm'
                  : 'text-[#111111] hover:text-[#FF5A00]'
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 px-5 rounded-full text-[13.5px] font-bold transition-all text-center ${
                mode === 'signin'
                  ? 'bg-[#FF5A00] text-white shadow-sm'
                  : 'text-[#111111] hover:text-[#FF5A00]'
              }`}
            >
              Log in
            </button>
          </div>

          {/* Notification Alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ava Mitchell"
                  className="w-full bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl px-4 py-3.5 text-[14px] text-[#111111] placeholder:text-[#6B6B67]/50 focus:outline-none focus:border-[#FF5A00] shadow-sm transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl px-4 py-3.5 text-[14px] text-[#111111] placeholder:text-[#6B6B67]/50 focus:outline-none focus:border-[#FF5A00] shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[rgba(17,17,17,0.15)] rounded-2xl px-4 py-3.5 text-[14px] text-[#111111] placeholder:text-[#6B6B67]/50 focus:outline-none focus:border-[#FF5A00] shadow-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 hover:shadow-xl hover:shadow-[#FF5A00]/30 active:scale-[0.99] disabled:opacity-50 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {pendingPlan?.paymentStatus === 'paid_demo'
                      ? 'Confirm & Continue →'
                      : 'Continue to Dashboard →'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Bottom link: Want a different plan? */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-[13px] text-[#6B6B67]">
              Want a different plan?{' '}
              <Link to="/pricing" className="text-[#FF5A00] font-bold hover:underline">
                See all plans
              </Link>
            </p>

            <p className="text-[11.5px] text-[#6B6B67]/70 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-[#FF5A00]" />
              <span>Demo accounts and subscriptions sync with Supabase and browser persistence.</span>
            </p>
          </div>

          {/* Quick Demo Login Option for instant testing */}
          <div className="mt-8 pt-6 border-t border-[rgba(17,17,17,0.08)]">
            <p className="text-[11px] font-semibold text-[#6B6B67] uppercase tracking-wider text-center mb-3">
              Fast Demo Testing
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoContinue('user')}
                className="py-2.5 px-3 rounded-xl bg-white border border-[rgba(17,17,17,0.12)] text-[#111111] text-[12px] font-semibold hover:border-[#FF5A00] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Demo Creator</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoContinue('admin')}
                className="py-2.5 px-3 rounded-xl bg-white border border-[rgba(17,17,17,0.12)] text-[#111111] text-[12px] font-semibold hover:border-[#FF5A00] transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={14} className="text-[#FF5A00]" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-[12px] text-[#6B6B67] border-t border-[rgba(17,17,17,0.06)] bg-white">
        SWAPP.AI — Simple, Transparent Creator Platform
      </footer>
    </div>
  );
}
