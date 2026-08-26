import React, { useState } from 'react';
import { ATSAnalysisResult, ResumeAnnotation } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowRight,
  Check
} from 'lucide-react';

interface ResumeInspectorProps {
  analysis: ATSAnalysisResult;
  onApplyFixToBuilder: (text: string, category: string) => void;
  onNavigateToBuilder: () => void;
}

export const ResumeInspector: React.FC<ResumeInspectorProps> = ({
  analysis,
  onApplyFixToBuilder,
  onNavigateToBuilder,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'strength' | 'warning' | 'critical'>('all');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>('ann-2');
  const [appliedAnnotations, setAppliedAnnotations] = useState<string[]>([]);

  const annotations: ResumeAnnotation[] = [
    {
      id: 'ann-1',
      section: 'summary',
      type: 'strength',
      title: 'Strong Executive Hook & Core Keywords',
      originalText: 'Results-driven AI Product Manager with over 8 years of experience leading cross-functional teams to deliver scalable machine learning solutions.',
      explanation: 'Clear title calibration ("AI Product Manager") and concise value proposition. High ATS parse confidence.',
      scoreImpact: +8,
    },
    {
      id: 'ann-2',
      section: 'experience',
      type: 'critical',
      title: 'Missing Quantifiable Metric (STAR Formula)',
      originalText: 'Led cross-functional team of engineers and data scientists through product launch cycles.',
      suggestedText: 'Spearheaded 4 enterprise ML product launches across 15 engineers and data scientists, generating $3.2M in annual recurring revenue.',
      explanation: 'Vague responsibility description without specific volume, timeframe, or measurable business impact metrics.',
      scoreImpact: -12,
    },
    {
      id: 'ann-3',
      section: 'experience',
      type: 'strength',
      title: 'High-Impact Quantified Achievement',
      originalText: 'Spearheaded the development of a predictive maintenance model, reducing system downtime by 45%.',
      explanation: 'Exemplary Google XYZ format: high-power action verb ("Spearheaded") paired with exact percentage impact ("45%").',
      scoreImpact: +10,
    },
    {
      id: 'ann-4',
      section: 'skills',
      type: 'warning',
      title: 'Missing Crucial Keyword from Target Role',
      originalText: 'Agile/Scrum, Roadmap Planning, A/B Testing, User Research, Python',
      suggestedText: 'Agile/Scrum, Roadmap Planning, A/B Testing, User Research, Design Systems, Figma, Python, SQL',
      explanation: `Missing key role requirements detected in ${analysis.targetRole} benchmark: "Design Systems" and "Figma Auto-layout".`,
      scoreImpact: -8,
    },
    {
      id: 'ann-5',
      section: 'experience',
      type: 'warning',
      title: 'Passive Phrasing / Low Specificity',
      originalText: 'Conducted A/B testing on pricing models that led to an increase in quarterly revenue.',
      suggestedText: 'Orchestrated multi-variant A/B tests across 4 pricing tiers, driving a 12% ($450K) surge in Q3 ARR.',
      explanation: 'Replace generic "conducted" with high-impact power verb ("Orchestrated") and specify dollar magnitude.',
      scoreImpact: -6,
    }
  ];

  const filteredAnnotations = annotations.filter((ann) => {
    if (activeFilter === 'all') return true;
    return ann.type === activeFilter;
  });

  const selectedAnnotation = annotations.find((a) => a.id === selectedAnnotationId) || annotations[0];

  const handleApplySingleFix = (ann: ResumeAnnotation) => {
    if (ann.suggestedText) {
      onApplyFixToBuilder(ann.suggestedText, ann.section);
      setAppliedAnnotations((prev) => [...prev, ann.id]);
    }
  };

  return (
    <div className="app-card p-6 sm:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Eye size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Resume Visual Inspector
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review highlighted sections with color-coded strengths (+), warnings (⚠), and critical flaws (✖).
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Highlights ({annotations.length})
          </button>
          <button
            onClick={() => setActiveFilter('strength')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              activeFilter === 'strength'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Strengths (2)
          </button>
          <button
            onClick={() => setActiveFilter('warning')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              activeFilter === 'warning'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Warnings (2)
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              activeFilter === 'critical'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Critical (1)
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Annotated Document Preview (span 7) */}
        <div className="lg:col-span-7 app-subcard p-6 rounded-xl border border-slate-200 space-y-6 font-sans">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">SARAH CONNOR</h2>
            <p className="text-xs font-medium text-slate-600">
              San Francisco, CA • (555) 234-5678 • sarah.connor@ai.studio
            </p>
          </div>

          {/* Section: Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
              Professional Summary
            </h4>
            <div
              onClick={() => setSelectedAnnotationId('ann-1')}
              className={`p-3 rounded-lg text-xs leading-relaxed cursor-pointer transition-all border ${
                selectedAnnotationId === 'ann-1'
                  ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs'
                  : 'bg-emerald-50/40 border-emerald-200 text-slate-800 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase mb-1">
                <CheckCircle2 size={12} />
                <span>Strength (+8 ATS Points)</span>
              </div>
              <p>{annotations[0].originalText}</p>
            </div>
          </div>

          {/* Section: Experience */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
              Work Experience
            </h4>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Lead AI Product Manager — Cyberdyne Systems</span>
                <span className="text-slate-500 font-normal">03/2020 – Present</span>
              </div>

              <div className="mt-2 space-y-2 text-xs">
                {/* Bullet 1 - Critical */}
                <div
                  onClick={() => setSelectedAnnotationId('ann-2')}
                  className={`p-3 rounded-lg leading-relaxed cursor-pointer transition-all border ${
                    selectedAnnotationId === 'ann-2'
                      ? 'bg-rose-50 border-rose-400 text-slate-900 shadow-xs'
                      : 'bg-rose-50/40 border-rose-200 text-slate-800 hover:bg-rose-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-800 uppercase mb-1">
                    <XCircle size={12} />
                    <span>Critical Flaw: Missing Quantifiable Metrics (-12 Pts)</span>
                  </div>
                  <p>• {annotations[1].originalText}</p>
                </div>

                {/* Bullet 2 - Strength */}
                <div
                  onClick={() => setSelectedAnnotationId('ann-3')}
                  className={`p-3 rounded-lg leading-relaxed cursor-pointer transition-all border ${
                    selectedAnnotationId === 'ann-3'
                      ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs'
                      : 'bg-emerald-50/40 border-emerald-200 text-slate-800 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase mb-1">
                    <CheckCircle2 size={12} />
                    <span>Strength: High-Impact STAR Metric (+10 Pts)</span>
                  </div>
                  <p>• {annotations[2].originalText}</p>
                </div>

                {/* Bullet 3 - Warning */}
                <div
                  onClick={() => setSelectedAnnotationId('ann-5')}
                  className={`p-3 rounded-lg leading-relaxed cursor-pointer transition-all border ${
                    selectedAnnotationId === 'ann-5'
                      ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-xs'
                      : 'bg-amber-50/40 border-amber-200 text-slate-800 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase mb-1">
                    <AlertTriangle size={12} />
                    <span>Warning: Low Specificity Phrasing (-6 Pts)</span>
                  </div>
                  <p>• {annotations[4].originalText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
              Skills & Core Competencies
            </h4>
            <div
              onClick={() => setSelectedAnnotationId('ann-4')}
              className={`p-3 rounded-lg text-xs leading-relaxed cursor-pointer transition-all border ${
                selectedAnnotationId === 'ann-4'
                  ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-xs'
                  : 'bg-amber-50/40 border-amber-200 text-slate-800 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase mb-1">
                <AlertTriangle size={12} />
                <span>Warning: Missing Keyword Gaps (-8 Pts)</span>
              </div>
              <p>{annotations[3].originalText}</p>
            </div>
          </div>
        </div>

        {/* Right: Focused Inspector Panel (span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="app-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Annotation Details
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedAnnotation.type === 'strength'
                  ? 'app-badge-success'
                  : selectedAnnotation.type === 'warning'
                  ? 'app-badge-warning'
                  : 'app-badge-danger'
              }`}>
                {selectedAnnotation.type}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900">
              {selectedAnnotation.title}
            </h4>

            {/* Explanation */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                ATS Engine Diagnosis
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAnnotation.explanation}
              </p>
            </div>

            {/* Original Text vs Suggestion */}
            {selectedAnnotation.suggestedText ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                  <span className="text-[10px] font-semibold text-rose-800 uppercase block mb-0.5">
                    Current Version:
                  </span>
                  <p className="text-slate-800">{selectedAnnotation.originalText}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase block mb-0.5 flex items-center gap-1">
                    <Sparkles size={11} />
                    Suggested AI XYZ Version:
                  </span>
                  <p className="text-slate-900 font-medium">{selectedAnnotation.suggestedText}</p>
                </div>

                <button
                  onClick={() => handleApplySingleFix(selectedAnnotation)}
                  disabled={appliedAnnotations.includes(selectedAnnotation.id)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    appliedAnnotations.includes(selectedAnnotation.id)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'app-btn-primary'
                  }`}
                >
                  {appliedAnnotations.includes(selectedAnnotation.id) ? (
                    <>
                      <Check size={14} />
                      <span>Applied to Resume Builder</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Apply Fix to Resume Builder</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-slate-800">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase block mb-0.5">
                  Optimal Structure
                </span>
                <p>This section is properly formatted and will parse accurately across all standard applicant tracking systems.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
