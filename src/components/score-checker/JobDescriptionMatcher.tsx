import React, { useState } from 'react';
import { ATSAnalysisResult } from '../../types';
import {
  Sparkles,
  Target,
  Plus,
  CheckCircle2,
  RefreshCw,
  FileText,
  Briefcase,
  Check
} from 'lucide-react';

interface JobDescriptionMatcherProps {
  analysis: ATSAnalysisResult;
  onUpdateRole: (role: string, jobDescription?: string) => Promise<void>;
  onAddKeywordToResume: (keyword: string) => void;
  isReanalyzing: boolean;
}

export const JobDescriptionMatcher: React.FC<JobDescriptionMatcherProps> = ({
  analysis,
  onUpdateRole,
  onAddKeywordToResume,
  isReanalyzing,
}) => {
  const [roleInput, setRoleInput] = useState(analysis.targetRole);
  const [jdInput, setJdInput] = useState(analysis.jobDescription || '');
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'keywords' | 'hard-skills' | 'soft-skills'>('keywords');

  const rolePresets = [
    'Senior AI Product Manager',
    'Staff Software Engineer',
    'Senior Product Designer',
    'Lead Data Scientist',
    'Full Stack Cloud Architect',
  ];

  const sampleJDPresets: Record<string, string> = {
    'Senior AI Product Manager': `We are seeking a Senior AI Product Manager to lead machine learning product roadmaps.
Key Requirements:
- 5+ years product management experience in AI/ML, NLP, or LLM-powered applications.
- Experience with Agile Scrum, A/B Testing, Predictive Analytics, and Roadmap Planning.
- Proficiency collaborating with engineering on Python, SQL, and Cloud Infrastructure (AWS/GCP).
- Proven track record of shipping models to production with measurable business revenue outcomes.`,
    'Staff Software Engineer': `Staff Software Engineer (Distributed Systems & Full Stack).
Key Requirements:
- 8+ years hands-on experience in TypeScript, React, Node.js, Go, or Python.
- Deep expertise in Microservices, Kubernetes, PostgreSQL, Distributed Caching (Redis), and GraphQL.
- Strong architectural leadership, system design, CI/CD automation, and high-scale reliability engineering.`,
    'Senior Product Designer': `Senior Product Designer (Design Systems & AI Workflows).
Key Requirements:
- 5+ years designing enterprise SaaS, design systems, interactive prototypes, and UX workflows.
- Mastery in Figma Auto-layout, Design Tokens, User Research, Information Architecture, and WCAG Accessibility.
- Experience pairing closely with product managers and engineers on rapid iteration.`,
  };

  const handleApplyPreset = (presetRole: string) => {
    setRoleInput(presetRole);
    if (sampleJDPresets[presetRole]) {
      setJdInput(sampleJDPresets[presetRole]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    await onUpdateRole(roleInput, jdInput);
  };

  const handleAddKeyword = (kw: string) => {
    onAddKeywordToResume(kw);
    setAddedKeywords((prev) => [...prev, kw]);
  };

  return (
    <div className="app-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Target size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Job Description Keyword Alignment Matcher
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare ATS keyword requirements and competency alignment directly against a target job posting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="app-badge-blue px-3 py-1 rounded text-xs font-semibold">
            Real-time Keyword Gap Index
          </span>
        </div>
      </div>

      {/* Target Role & Preset Selector Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
            Target Job Title
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="e.g. Senior AI Product Manager, Staff Full Stack Engineer"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-600 shadow-xs"
              required
            />
            <button
              type="submit"
              disabled={isReanalyzing}
              className="app-btn-primary px-5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all flex-shrink-0 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isReanalyzing ? 'animate-spin' : ''} />
              <span>{isReanalyzing ? 'Recalculating...' : 'Recalibrate Match'}</span>
            </button>
          </div>
        </div>

        {/* Quick Role Preset Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          {rolePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Optional Full Job Description Textarea */}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 flex items-center justify-between">
            <span>Job Description Text (Optional for Deep Keyword Extraction)</span>
            <span className="text-[11px] text-slate-400 lowercase font-normal">paste full posting</span>
          </label>
          <textarea
            rows={4}
            value={jdInput}
            onChange={(e) => setJdInput(e.target.value)}
            placeholder="Paste target job responsibilities, qualifications, and requirements here..."
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-3 text-xs leading-relaxed focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>
      </form>

      {/* Keywords Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        {/* Left: Matched Keywords */}
        <div className="app-subcard p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                Matched Keywords ({analysis.matchedKeywords.length})
              </h4>
            </div>
            <span className="app-badge-success px-2 py-0.5 rounded text-[10px] font-semibold">
              Found in Document
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.matchedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-xs"
              >
                <Check size={12} className="text-emerald-600" />
                {kw.keyword}
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {kw.frequency}x
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Missing Keywords */}
        <div className="app-subcard p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-amber-600" />
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                Missing High-Value Keywords ({analysis.missingKeywords.length})
              </h4>
            </div>
            <span className="app-badge-warning px-2 py-0.5 rounded text-[10px] font-semibold">
              Action Required
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {analysis.missingKeywords.map((kw, idx) => {
              const isAdded = addedKeywords.includes(kw.keyword);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{kw.keyword}</span>
                    <span className="text-[11px] text-slate-500 block">
                      Importance: <strong className="text-amber-800 font-medium">{kw.importance}</strong> • Recommended: {kw.recommendedContext}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddKeyword(kw.keyword)}
                    disabled={isAdded}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'app-btn-secondary'
                    }`}
                  >
                    {isAdded ? 'Added' : '+ Add Skill'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
