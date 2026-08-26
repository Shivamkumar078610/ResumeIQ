import React, { useState } from 'react';
import { TabType } from '../types';
import { ShieldCheck, X } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openModal = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <footer className="bg-white text-slate-900 w-full border-t border-slate-200 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Brand & Copyright */}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4C5 2.89543 5.89543 2 7 2H14L19 7V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="15" cy="15" r="2" fill="#2563EB" />
                </svg>
              </div>
              <span className="text-base font-bold text-slate-900">
                Resume<span className="text-blue-600 font-extrabold">IQ</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              © {new Date().getFullYear()} ResumeIQ. ATS diagnostic parsing, STAR bullet optimization, and verified scoring intelligence.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ResumeIQ Neural Parsing Engine v4.2 Active
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="col-span-1 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Platform
          </span>
          <button
            onClick={() => setActiveTab('score-checker')}
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            ATS Score Checker
          </button>
          <button
            onClick={() => setActiveTab('resume-builder')}
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            ATS Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            Verified Templates
          </button>
        </div>

        {/* Links Column 2 */}
        <div className="col-span-1 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Security & Trust
          </span>
          <button
            onClick={() =>
              openModal(
                'Security Measures & Data Protection',
                'ResumeIQ enforces strict data privacy controls. All parsing payloads are processed in memory and encrypted in transit via TLS 1.3. Cloud documents are isolated with per-user Firebase Authentication credentials. No user resume data is ever sold or utilized for third-party foundation model pre-training.'
              )
            }
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            Security Measures
          </button>
          <button
            onClick={() =>
              openModal(
                'Privacy Policy',
                'Your candidate profile, employment histories, and contact info are confidential and strictly scoped to your authenticated account session. You retain full ownership to edit or delete any stored resume from the platform at any time.'
              )
            }
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() =>
              openModal(
                'Security Desk & Responsible Disclosure',
                'For security inquiries, audit inquiries, or responsible disclosure reports, please reach out to our engineering security response team at security@resumeiq.ai.'
              )
            }
            className="text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            Security Desk
          </button>
        </div>
      </div>

      {/* Clean Modal for Policy / Security View */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{modalContent.title}</h3>
              </div>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {modalContent.body}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="app-btn-secondary px-4 py-1.5 text-xs rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
