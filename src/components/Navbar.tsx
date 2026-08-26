import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { BarChart2, FileText, Layout, Menu, X, LogOut, User, Cloud, ShieldCheck } from 'lucide-react';
import { subscribeToAuth, signOutUser } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'score-checker', label: 'Score Checker', icon: BarChart2 },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layout },
  ];

  const handleNavClick = (tabId: TabType) => {
    if (tabId !== 'home' && !currentUser) {
      onOpenAuth('login');
      return;
    }
    setActiveTab(tabId);
  };

  const getInitials = (user: FirebaseUser) => {
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'US';
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserDropdownOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="flex justify-between items-center h-16 w-full px-4 md:px-8 max-w-[1280px] mx-auto">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4C5 2.89543 5.89543 2 7 2H14L19 7V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2V7H19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8.5 15H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="2" fill="#2563EB" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[18px] font-bold tracking-tight text-slate-900">
                Resume<span className="text-blue-600 font-extrabold">IQ</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                ATS STUDIO
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase mt-0.5 hidden sm:block">
              Precision Resume Engineering
            </span>
          </div>
        </button>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('home')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'home'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Overview
          </button>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <item.icon size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-[10px] font-bold flex items-center justify-center text-white">
                    {getInitials(currentUser)}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-700 hidden sm:inline max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg p-2 z-50 text-xs border border-slate-200 animate-in fade-in zoom-in-95">
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="font-semibold text-slate-900 truncate">
                      {currentUser.displayName || 'Candidate'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentUser.email}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('resume-builder');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 mt-1 transition-colors"
                  >
                    <Cloud size={14} className="text-blue-600" />
                    <span>My Cloud Resumes</span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 mt-1 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:block text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="app-btn-primary text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Get Started
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5 shadow-md">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-2.5 ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={15} />
            Overview
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-2.5 ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
            </button>
          ))}
          {!currentUser && (
            <div className="pt-2.5 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold app-btn-primary rounded-lg"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
