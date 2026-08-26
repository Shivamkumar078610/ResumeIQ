import React, { useState, useEffect } from 'react';
import { ATSAnalysisResult } from '../../types';
import {
  Sparkles,
  RefreshCw,
  Download,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ScoreGaugeHeroProps {
  analysis: ATSAnalysisResult;
  isReanalyzing: boolean;
  onReanalyze: () => void;
  onNavigateToBuilder: () => void;
  onOpenUploadModal: () => void;
  onTriggerScannerHUD: () => void;
}

export const ScoreGaugeHero: React.FC<ScoreGaugeHeroProps> = ({
  analysis,
  isReanalyzing,
  onReanalyze,
  onNavigateToBuilder,
  onOpenUploadModal,
  onTriggerScannerHUD,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const targetScore = analysis.overallScore;

  // Animate score count-up smoothly
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = targetScore / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Grade and Percentile computation
  const getGradeInfo = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Elite Match Tier', percentile: 'Top 3%', strokeColor: '#059669', badgeBg: 'app-badge-success' };
    if (score >= 80) return { grade: 'A-', label: 'High Viability', percentile: 'Top 12%', strokeColor: '#2563EB', badgeBg: 'app-badge-blue' };
    if (score >= 70) return { grade: 'B+', label: 'Moderate Viability', percentile: 'Top 35%', strokeColor: '#4F46E5', badgeBg: 'app-badge-blue' };
    if (score >= 60) return { grade: 'C+', label: 'Borderline Match', percentile: 'Top 60%', strokeColor: '#D97706', badgeBg: 'app-badge-warning' };
    return { grade: 'D', label: 'High ATS Filter Risk', percentile: 'Bottom 40%', strokeColor: '#E11D48', badgeBg: 'app-badge-danger' };
  };

  const gradeInfo = getGradeInfo(analysis.overallScore);

  return (
    <div className="app-card p-6 sm:p-8 relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Score Gauge & Visual Ring */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full lg:w-auto">
          {/* Gauge Ring */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                className="text-slate-100"
                cx="70"
                cy="70"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
              />
              {/* Animated Progress Ring */}
              <circle
                className="progress-ring__circle"
                cx="70"
                cy="70"
                fill="transparent"
                r={radius}
                stroke={gradeInfo.strokeColor}
                strokeWidth="10"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>

            {/* Score Content inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                {animatedScore}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                out of 100
              </span>
              <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Grade {gradeInfo.grade}
              </span>
            </div>
          </div>

          {/* Score Insights & Overview */}
          <div className="space-y-2.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${gradeInfo.badgeBg}`}>
                <ShieldCheck size={13} className="inline mr-1" />
                {gradeInfo.label}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <TrendingUp size={13} className="inline mr-1 text-slate-500" />
                {gradeInfo.percentile} Candidate Benchmark
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Target Role: <span className="text-blue-600 font-semibold">{analysis.targetRole}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              {analysis.summary}
            </p>

            {/* Quick Micro-stats */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <FileCheck size={13} className="text-emerald-600" />
                <span>{analysis.matchedKeywords.length} Matched Keywords</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <Zap size={13} className="text-amber-600" />
                <span>{analysis.missingKeywords.length} Missing Keywords</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <Layers size={13} className="text-blue-600" />
                <span>{analysis.issues.length} Structural Adjustments</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Hub */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-56 flex-shrink-0">
          <button
            onClick={onNavigateToBuilder}
            className="app-btn-primary px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 w-full"
          >
            <Sparkles size={15} />
            <span>Optimize in Builder</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onTriggerScannerHUD}
            className="app-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Zap size={14} className="text-blue-600" />
            <span>View Scanner Logs</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenUploadModal}
              className="app-btn-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
              title="Upload different resume file"
            >
              <RefreshCw size={13} className={isReanalyzing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
              <span>Re-Scan</span>
            </button>

            <button
              onClick={() => window.print()}
              className="app-btn-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Download size={13} className="text-slate-500" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
