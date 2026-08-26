import React, { useState } from 'react';
import { BeforeAfterExample } from '../../types';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Check,
  CheckCircle2,
  XCircle,
  Columns
} from 'lucide-react';

interface BeforeAfterComparisonProps {
  onApplyAllToBuilder: () => void;
  onNavigateToBuilder: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  onApplyAllToBuilder,
  onNavigateToBuilder,
}) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'summary' | 'skills'>('experience');
  const [isApplied, setIsApplied] = useState(false);

  const examples: Record<'experience' | 'summary' | 'skills', BeforeAfterExample> = {
    experience: {
      id: 'exp-transform',
      category: 'Experience Bullet Point',
      before: {
        score: 52,
        text: 'Responsible for predictive maintenance project and managed a team of engineers to launch models on time.',
        flaws: [
          'Weak passive opening verb ("Responsible for")',
          'Zero quantified business metrics or percentage improvements',
          'Missing target technical keywords (NLP, Machine Learning, Python, CI/CD)',
        ],
      },
      after: {
        score: 96,
        text: 'Spearheaded end-to-end development of an enterprise predictive maintenance ML pipeline using Python and AWS, reducing unplanned downtime by 45% ($2.4M saved) across 15 engineers.',
        improvements: [
          'High-power action verb ("Spearheaded")',
          'Google XYZ metric formula (45% downtime reduction, $2.4M saved)',
          'High-density ATS keywords embedded naturally in context',
        ],
      },
    },
    summary: {
      id: 'summary-transform',
      category: 'Professional Summary',
      before: {
        score: 58,
        text: 'Motivated product manager looking for a challenging role in a high growth tech company where I can utilize my management skills.',
        flaws: [
          'Self-centered objective format rather than executive value proposition',
          'No industry domain keywords or quantifiable experience breadth',
          'Generic buzzwords ("motivated", "challenging role")',
        ],
      },
      after: {
        score: 95,
        text: 'Results-driven Senior AI Product Manager with 8+ years leading cross-functional teams to deliver scalable machine learning solutions, translating complex neural models into $10M+ ARR business outcomes.',
        improvements: [
          'Clear executive title branding ("Senior AI Product Manager")',
          'Quantifiable career breadth (8+ years, $10M+ ARR)',
          'High ATS semantic density matching target hiring criteria',
        ],
      },
    },
    skills: {
      id: 'skills-transform',
      category: 'Technical Skills Matrix',
      before: {
        score: 60,
        text: 'Product Management, AI, Coding, Teamwork, Communication, Problem Solving, Microsoft Office, Jira',
        flaws: [
          'Unstructured comma list lacking categorization',
          'Mix of low-value generic soft skills with basic tools',
          'Legacy ATS parsers drop unindexed single-line strings',
        ],
      },
      after: {
        score: 98,
        text: '• Product Strategy: Roadmap Architecture, A/B Testing, User Research, Agile/Scrum\n• AI/ML Competencies: NLP, Large Language Models, Predictive Analytics, Python\n• Infrastructure & Tooling: SQL, AWS Services, Tableau, Jira, Confluence',
        improvements: [
          'Hierarchical categorization (Product Strategy, AI/ML, Tooling)',
          'High-value technical keyword tokens indexed for ATS spiders',
          'Zero parsing ambiguity for Greenhouse, Workday, and Lever',
        ],
      },
    },
  };

  const currentExample = examples[activeTab];

  const handleApply = () => {
    setIsApplied(true);
    onApplyAllToBuilder();
  };

  return (
    <div className="app-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <TrendingUp size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Before & After Optimization Benchmark
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare unoptimized baseline text against AI-synthesized STAR & XYZ-formula formatting.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              activeTab === 'experience'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Experience Bullet
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              activeTab === 'summary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              activeTab === 'skills'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Skills Matrix
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Before Card */}
        <div className="app-subcard p-5 rounded-xl border border-rose-200 bg-rose-50/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
              <span className="app-badge-danger px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                <XCircle size={13} />
                Before: Baseline Draft
              </span>
              <span className="text-xs font-bold text-rose-700">
                Score: {currentExample.before.score}/100
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-rose-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line shadow-xs">
              {currentExample.before.text}
            </div>

            {/* Identified Flaws */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                ATS Spider Roadblocks
              </span>
              {currentExample.before.flaws.map((flaw, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{flaw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: After Card */}
        <div className="app-subcard p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="app-badge-success px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                After: AI XYZ Optimization
              </span>
              <span className="text-xs font-bold text-emerald-700">
                Score: {currentExample.after.score}/100
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-emerald-300 text-xs leading-relaxed text-slate-900 font-medium whitespace-pre-line shadow-xs">
              {currentExample.after.text}
            </div>

            {/* Improvements */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Quantified Enhancements
              </span>
              {currentExample.after.improvements.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900">
            Apply Full Diagnostic Enhancements
          </h4>
          <p className="text-[11px] text-slate-500">
            Transfer all high-impact keyword optimizations and STAR formulas into your Resume Builder.
          </p>
        </div>

        <button
          onClick={handleApply}
          disabled={isApplied}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            isApplied
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'app-btn-primary'
          }`}
        >
          {isApplied ? (
            <>
              <Check size={14} />
              <span>Optimizations Applied</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>Apply to Resume Builder</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
