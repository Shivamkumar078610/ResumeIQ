import React, { useState, useRef } from 'react';
import { TabType } from '../types';
import { socialProofAvatars } from '../data/mockData';
import { FileText, ArrowRight, ShieldCheck, Upload, Zap, CheckCircle2, TrendingUp, HelpCircle, Check, Search, Sparkles } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface LandingHeroProps {
  onAnalyzeResume: (fileOrText?: File | string, targetRole?: string) => void;
  setActiveTab: (tab: TabType) => void;
  isAnalyzing: boolean;
  currentUser?: FirebaseUser | null;
  onRequireAuth?: (action: () => void, message?: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onAnalyzeResume,
  setActiveTab,
  isAnalyzing,
  currentUser,
  onRequireAuth,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const executeWithAuth = (action: () => void, message?: string) => {
    if (onRequireAuth) {
      onRequireAuth(action, message);
    } else {
      action();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadFileName(file.name);
      executeWithAuth(
        () => onAnalyzeResume(file),
        'Please sign in to analyze and score your uploaded resume.'
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      executeWithAuth(
        () => onAnalyzeResume(file),
        'Please sign in to analyze and score your uploaded resume.'
      );
    }
  };

  return (
    <div className="w-full text-slate-900 py-8 md:py-14 px-4 md:px-8 max-w-[1280px] mx-auto space-y-10">
      {/* Main Hero Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Value Proposition & Call to Action (span 7) */}
        <div className="lg:col-span-7 app-card p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 app-badge-blue px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ATS Compatibility & Verification Studio
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Engineered for ATS Parsers.<br />
              <span className="text-blue-600">Built for Human Recruiters.</span>
            </h1>

            <p className="text-slate-600 text-[15px] sm:text-[16px] max-w-[540px] leading-relaxed">
              Scan your resume against verified parsing benchmarks for Workday, Taleo, Greenhouse, and Lever. Identify keyword gaps, eliminate formatting traps, and optimize bullet points with Google&apos;s XYZ formula.
            </p>

            <div className="pt-2 flex flex-wrap gap-3.5 items-center">
              <button
                onClick={() =>
                  executeWithAuth(
                    () => onAnalyzeResume(),
                    'Please sign in to run a live ATS diagnostic scan.'
                  )
                }
                disabled={isAnalyzing}
                className="app-btn-primary px-6 py-3.5 rounded-xl font-semibold text-sm tracking-normal flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Search size={16} className="text-blue-400" />
                    Run Live ATS Audit
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  executeWithAuth(
                    () => setActiveTab('resume-builder'),
                    'Please sign in to launch the Resume Builder.'
                  )
                }
                className="app-btn-secondary px-5 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                Create New Resume
                <ArrowRight size={15} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Social Proof & ATS Compliance Strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {socialProofAvatars.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-xs"
                  >
                    <img
                      src={src}
                      alt={`User ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-600">
                <strong className="text-slate-900 font-semibold">50,000+</strong> Candidates Screened
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Workday</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Taleo</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Greenhouse</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lever</span>
            </div>
          </div>
        </div>

        {/* Right: Ingestion Dropzone & Real-Time Stats (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {/* Dropzone Card */}
          <div className="app-card p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Document Ingestion
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to Parse
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Drag your current resume here for an instant 24-point compliance report.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            <div
              id="dropzone"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 my-4 flex flex-col items-center justify-center text-center transition-all ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs mb-3">
                <Upload size={20} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                {uploadFileName ? `Selected: ${uploadFileName}` : 'Drop PDF or DOCX file here'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard text & formatting will be parsed securely.
              </p>

              <div className="flex items-center gap-2.5 mt-4">
                <button
                  onClick={() =>
                    executeWithAuth(
                      () => fileInputRef.current?.click(),
                      'Please sign in to browse and upload your resume.'
                    )
                  }
                  disabled={isAnalyzing}
                  className="app-btn-secondary text-xs px-3.5 py-1.5 rounded-lg"
                >
                  Browse Files
                </button>
                <button
                  onClick={() =>
                    executeWithAuth(
                      () => onAnalyzeResume(),
                      'Please sign in to test the ATS scanner with sample data.'
                    )
                  }
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
                >
                  Try Sample Candidate
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span>Max file size: 10MB</span>
              <span>Encrypted & Private</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="app-card p-4">
              <div className="text-xs font-semibold text-slate-500">Average ATS Score Gain</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                +34.2% <span className="text-xs font-medium text-emerald-600 font-sans">post-audit</span>
              </div>
            </div>
            <div className="app-card p-4">
              <div className="text-xs font-semibold text-slate-500">Parsing Pass Rate</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                99.4% <span className="text-xs font-medium text-blue-600 font-sans">verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Systematic Process */}
      <section className="pt-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              Methodology
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              How ResumeIQ Audits & Optimizes
            </h2>
          </div>
          <span className="text-xs text-slate-500">3-Step Deterministic Process</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="app-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4 border border-blue-100">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Structural & Format Ingestion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deconstructs font hierarchies, column structures, date expressions, and section headers to ensure legacy ATS spiders won&apos;t drop your data.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              Catches multi-column parsing traps
            </div>
          </div>

          {/* Step 2 */}
          <div className="app-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-4 border border-purple-100">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Keyword & Semantic Alignment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares your experience and skills against real job descriptions to identify missing technical keywords and hard competency requirements.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              Role-specific keyword density index
            </div>
          </div>

          {/* Step 3 */}
          <div className="app-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-100">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Quantified Impact Rewriting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms passive duties into high-impact bullet points using Google&apos;s XYZ formula: &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              One-click AI bullet suggestions
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
