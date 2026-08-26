import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        onSuccess(result.user.email || 'Google User');
        onClose();
      }
    } catch (err: any) {
      console.error('Google Sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide an email and password');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const user = await registerWithEmail(email, password, name);
        if (user) {
          onSuccess(user.email || email);
          onClose();
        }
      } else {
        const user = await loginWithEmail(email, password);
        if (user) {
          onSuccess(user.email || email);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. You can also sign in directly with Google.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please switch to Log In.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in duration-200 text-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-blue-600">
            <Lock size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Candidate Access' : 'Create ATS Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Sign in to access saved audits & cloud resumes'
              : 'Join 50,000+ candidates optimizing career paths'}
          </p>
        </div>

        {/* Google One-Click Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-xs hover:border-blue-400 disabled:opacity-50"
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
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-[10px] text-slate-400 font-semibold uppercase">Or with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 pb-2 font-bold text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 pb-2 font-bold text-center border-b-2 transition-all ${
              mode === 'signup'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:border-blue-600 shadow-xs"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:border-blue-600 shadow-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:border-blue-600 shadow-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full app-btn-primary text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Encrypted storage with Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
