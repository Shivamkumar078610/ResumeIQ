import React, { useState } from 'react';
import { ATSAnalysisResult } from '../types';
import {
  Sparkles,
  BarChart3,
  Eye,
  Target,
  TrendingUp,
  UploadCloud,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { ScoreGaugeHero } from './score-checker/ScoreGaugeHero';
import { MetricsBreakdown } from './score-checker/MetricsBreakdown';
import { ResumeInspector } from './score-checker/ResumeInspector';
import { JobDescriptionMatcher } from './score-checker/JobDescriptionMatcher';
import { BeforeAfterComparison } from './score-checker/BeforeAfterComparison';
import { ResumeUploadModal } from './score-checker/ResumeUploadModal';
import { ScannerHUD } from './score-checker/ScannerHUD';
import { User as FirebaseUser } from 'firebase/auth';

interface ScoreCheckerProps {
  analysis: ATSAnalysisResult;
  onUpdateRole: (newRole: string, newJobDescription?: string) => Promise<void>;
  onNavigateToBuilder: () => void;
  onAddKeywordToResume: (keyword: string) => void;
  onFixIssueWithAI: (issueId: string) => void;
  isReanalyzing: boolean;
  onUploadNewResume?: (fileOrText?: File | string, targetRole?: string) => Promise<void>;
  onShowToast?: (msg: string) => void;
  currentUser?: FirebaseUser | null;
  onRequireAuth?: (action: () => void, message?: string) => void;
}

export const ScoreChecker: React.FC<ScoreCheckerProps> = ({
  analysis,
  onUpdateRole,
  onNavigateToBuilder,
  onAddKeywordToResume,
  onFixIssueWithAI,
  isReanalyzing,
  onUploadNewResume,
  onShowToast,
  currentUser,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inspector' | 'jd-matcher' | 'before-after'>('overview');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScannerHUDOpen, setIsScannerHUDOpen] = useState(false);
  const [showFixDetails, setShowFixDetails] = useState<string | null>(null);

  const executeWithAuth = (action: () => void, message?: string) => {
    if (onRequireAuth) {
      onRequireAuth(action, message);
    } else {
      action();
    }
  };

  const handleApplySingleFix = (text: string, category: string) => {
    executeWithAuth(() => {
      onShowToast?.(`Applied AI enhancement to ${category} section!`);
      onNavigateToBuilder();
    }, 'Please sign in to apply AI fixes to your resume.');
  };

  const handleApplyAllOptimizations = () => {
    executeWithAuth(() => {
      analysis.missingKeywords.forEach((kw) => {
        onAddKeywordToResume(kw.keyword);
      });
      onShowToast?.('All AI optimizations and STAR metrics synced to Resume Builder!');
      onNavigateToBuilder();
    }, 'Please sign in to sync AI optimizations to your resume.');
  };

  return (
    <main className="flex-grow w-full px-4 md:px-8 max-w-[1280px] mx-auto py-8 space-y-8 text-slate-900">
      {/* Top Header & Ribbon */}
      <header className="app-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <BarChart3 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                ATS Compatibility Diagnostic
              </h1>
              <span className="app-badge-neutral px-2 py-0.5 rounded text-[11px] font-semibold">
                AUDIT ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
              Target Role: <strong className="text-slate-800 font-semibold">{analysis.targetRole}</strong> • Document: <span className="font-mono text-slate-600">{analysis.documentDetails.fileName}</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 size={14} />
            <span>Score & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'inspector'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Eye size={14} />
            <span>Resume Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('jd-matcher')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'jd-matcher'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Target size={14} />
            <span>JD Keyword Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('before-after')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'before-after'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp size={14} />
            <span>Before & After</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="app-btn-secondary text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            title="Upload new resume file"
          >
            <UploadCloud size={14} className="text-slate-600" />
            <span>Upload New</span>
          </button>

          <button
            onClick={() => setIsScannerHUDOpen(true)}
            className="app-btn-secondary text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            title="View Diagnostic Log"
          >
            <Zap size={14} className="text-blue-600" />
            <span>Diagnostic Logs</span>
          </button>
        </div>
      </header>

      {/* Hero Animated ATS Score Gauge */}
      <ScoreGaugeHero
        analysis={analysis}
        isReanalyzing={isReanalyzing}
        onReanalyze={() => onUpdateRole(analysis.targetRole, analysis.jobDescription)}
        onNavigateToBuilder={onNavigateToBuilder}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onTriggerScannerHUD={() => setIsScannerHUDOpen(true)}
      />

      {/* Tab Content Routing */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 5-Dimensional Metrics Matrix */}
            <MetricsBreakdown
              analysis={analysis}
              onFixIssue={onFixIssueWithAI}
              onNavigateToBuilder={onNavigateToBuilder}
            />

            {/* Critical Fixes & Keyword Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Critical Fixes List (span 7) */}
              <div className="lg:col-span-7 app-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <AlertTriangle size={16} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Identified ATS Bottlenecks & Fixes
                    </h3>
                  </div>
                  <span className="app-badge-warning px-2.5 py-0.5 rounded text-xs font-semibold">
                    {analysis.issues.length} Issues Found
                  </span>
                </div>

                <div className="space-y-3">
                  {analysis.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="app-subcard p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{issue.title}</h4>
                          <span className="text-[11px] text-slate-500 uppercase font-medium mt-0.5 block">
                            {issue.category} • Severity: {issue.severity}
                          </span>
                        </div>
                        <span className="app-badge-neutral px-2 py-0.5 rounded text-[10px] font-semibold">
                          {issue.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <button
                          onClick={() => setShowFixDetails(showFixDetails === issue.id ? null : issue.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                          <Sparkles size={13} />
                          <span>{showFixDetails === issue.id ? 'Hide Solution' : 'View Recommended Solution'}</span>
                        </button>

                        <button
                          onClick={() => onFixIssueWithAI(issue.id)}
                          className="app-btn-secondary text-xs px-3 py-1 rounded-lg"
                        >
                          Apply Fix
                        </button>
                      </div>

                      {showFixDetails === issue.id && issue.recommendedFix && (
                        <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                          <div>
                            <strong className="text-blue-900 font-semibold">Recommended Fix: </strong>
                            {issue.recommendedFix}
                          </div>
                          <button
                            onClick={() => onFixIssueWithAI(issue.id)}
                            className="app-btn-primary px-3 py-1 rounded-lg text-xs whitespace-nowrap"
                          >
                            Auto-Fix in Builder
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Telemetry & Quick Keywords (span 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Document Telemetry Card */}
                <div className="app-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Document Telemetry
                    </h3>
                    <span className="app-badge-success px-2 py-0.5 rounded text-[11px] font-semibold">
                      Parsed Clean
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-500">File Name</span>
                      <span className="text-slate-900 font-medium truncate max-w-[180px]">
                        {analysis.documentDetails.fileName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Word Count</span>
                      <span className="text-slate-900 font-semibold">
                        {analysis.documentDetails.wordCount} words
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Readability Score</span>
                      <span className="text-emerald-700 font-semibold">
                        {analysis.documentDetails.readabilityScore} (Standard Executive)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">ATS Engine Benchmark</span>
                      <span className="text-blue-700 font-semibold">2026 Semantic Standard</span>
                    </div>
                  </div>
                </div>

                {/* Quick Keyword Matrix Card */}
                <div className="app-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Top Missing Keywords
                    </h3>
                    <button
                      onClick={() => setActiveTab('jd-matcher')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      View All Matrix →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {analysis.missingKeywords.slice(0, 4).map((kw, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between app-subcard px-3 py-2 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-slate-800 font-medium">{kw.keyword}</span>
                        </div>
                        <button
                          onClick={() => onAddKeywordToResume(kw.keyword)}
                          className="app-btn-secondary px-2.5 py-0.5 rounded text-[11px] font-semibold"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspector' && (
          <ResumeInspector
            analysis={analysis}
            onApplyFixToBuilder={handleApplySingleFix}
            onNavigateToBuilder={onNavigateToBuilder}
          />
        )}

        {activeTab === 'jd-matcher' && (
          <JobDescriptionMatcher
            analysis={analysis}
            onUpdateRole={onUpdateRole}
            onAddKeywordToResume={onAddKeywordToResume}
            isReanalyzing={isReanalyzing}
          />
        )}

        {activeTab === 'before-after' && (
          <BeforeAfterComparison
            onApplyAllToBuilder={handleApplyAllOptimizations}
            onNavigateToBuilder={onNavigateToBuilder}
          />
        )}
      </div>

      {/* Modal Dialogs */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={async (fileOrText, role) => {
          if (onUploadNewResume) {
            await onUploadNewResume(fileOrText, role);
          } else {
            await onUpdateRole(role || analysis.targetRole);
          }
          onShowToast?.(`Resume parsed and scanned successfully for ${role || analysis.targetRole}!`);
        }}
        currentTargetRole={analysis.targetRole}
      />

      {isScannerHUDOpen && (
        <ScannerHUD
          analysis={analysis}
          onClose={() => setIsScannerHUDOpen(false)}
          onNavigateToBuilder={onNavigateToBuilder}
        />
      )}
    </main>
  );
};
