import React from 'react';
import { Lock, Sparkles, ShieldCheck, ArrowRight, Zap, Cloud, FileText } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface AuthGateProps {
  featureName: string;
  featureDescription?: string;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onBackToOverview: () => void;
  onAuthSuccess?: (email: string) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  featureName,
  featureDescription,
  onOpenAuthModal,
  onBackToOverview,
  onAuthSuccess,
}) => {
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

  const handleQuickGoogle = async () => {
    setIsLoadingGoogle(true);
    try {
      const res = await signInWithGoogle();
      if (res?.user && onAuthSuccess) {
        onAuthSuccess(res.user.email || 'Google User');
      }
    } catch (err) {
      console.error('Google sign in error:', err);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 md:px-8 text-slate-900 animate-in fade-in duration-200">
      <div className="app-card p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Lock Icon */}
        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
          <Lock className="w-6 h-6" />
        </div>

        {/* Header Text */}
        <div className="max-w-lg mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 app-badge-blue px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <ShieldCheck size={13} className="text-blue-600" />
            Authentication Required
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to access {featureName}
          </h2>

          <p className="text-slate-500 text-sm leading-relaxed">
            {featureDescription ||
              'ResumeIQ requires a free authenticated candidate account to analyze ATS compliance, run AI bullet rewrites, and persist your resumes securely.'}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
          <div className="app-subcard p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">ATS Diagnostic Scoring</div>
              <div className="text-[11px] text-slate-500">Full 24-point compliance report</div>
            </div>
          </div>

          <div className="app-subcard p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">STAR Metric Rewriter</div>
              <div className="text-[11px] text-slate-500">Quantified bullet enhancements</div>
            </div>
          </div>

          <div className="app-subcard p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Cloud size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Cloud Autosave & Sync</div>
              <div className="text-[11px] text-slate-500">Encrypted persistent storage</div>
            </div>
          </div>

          <div className="app-subcard p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <FileText size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">ATS Template Exports</div>
              <div className="text-[11px] text-slate-500">100% parse-ready layouts</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-sm mx-auto space-y-3">
          <button
            onClick={handleQuickGoogle}
            disabled={isLoadingGoogle}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoadingGoogle ? 'Signing In...' : 'Continue with Google'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="flex-1 app-btn-secondary text-xs py-2 rounded-lg"
            >
              Sign In with Email
            </button>
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="flex-1 app-btn-primary text-xs py-2 rounded-lg"
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onBackToOverview}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors pt-2 block mx-auto"
          >
            ← Back to Overview
          </button>
        </div>
      </div>
    </div>
  );
};
