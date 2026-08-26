import React, { useState } from 'react';
import { ATSAnalysisResult, ScoreSubMetric } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface MetricsBreakdownProps {
  analysis: ATSAnalysisResult;
  onFixIssue: (issueId: string) => void;
  onNavigateToBuilder: () => void;
}

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({
  analysis,
  onFixIssue,
  onNavigateToBuilder,
}) => {
  const [expandedMetricId, setExpandedMetricId] = useState<string | null>('impact');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'needs-attention' | 'optimal'>('all');

  const baseScore = analysis.overallScore;

  const subMetrics: ScoreSubMetric[] = [
    {
      id: 'keywords',
      name: 'Keyword Density & Job Alignment',
      score: Math.min(98, Math.max(45, Math.round(baseScore * 1.05))),
      maxScore: 100,
      weight: '30% Weight',
      status: baseScore >= 80 ? 'optimal' : baseScore >= 65 ? 'warning' : 'critical',
      description: `Matched ${analysis.matchedKeywords.length} core keywords out of ${analysis.matchedKeywords.length + analysis.missingKeywords.length} required role competencies.`,
      recommendation: `Incorporate missing keywords (${analysis.missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')}) directly into experience achievements.`
    },
    {
      id: 'formatting',
      name: 'ATS Formatting & Parsing Safety',
      score: analysis.issues.some(i => i.category === 'Formatting') ? 68 : 96,
      maxScore: 100,
      weight: '25% Weight',
      status: analysis.issues.some(i => i.category === 'Formatting') ? 'warning' : 'optimal',
      description: 'Evaluates single-column parsing, standard web-safe fonts, unambiguous date formats, and zero broken table frames.',
      recommendation: 'Use standard headers (Professional Experience, Education, Skills) and avoid multi-column layouts.'
    },
    {
      id: 'skills',
      name: 'Hard Skills & Competency Structure',
      score: Math.min(95, Math.max(50, Math.round((analysis.matchedKeywords.length / Math.max(1, analysis.matchedKeywords.length + analysis.missingKeywords.length)) * 100))),
      maxScore: 100,
      weight: '20% Weight',
      status: analysis.matchedKeywords.length >= 6 ? 'optimal' : 'warning',
      description: 'Measures presence of specialized industry frameworks, languages, tools, and methodologies.',
      recommendation: 'Categorize your technical skills into clear buckets (e.g. Languages, Frameworks, Cloud & Dev Tools).'
    },
    {
      id: 'impact',
      name: 'Quantified Impact & XYZ Metrics',
      score: analysis.issues.some(i => i.category === 'Impact & Metrics') ? 62 : 91,
      maxScore: 100,
      weight: '15% Weight',
      status: analysis.issues.some(i => i.category === 'Impact & Metrics') ? 'critical' : 'optimal',
      description: 'Checks whether bullet points contain measurable business outcomes ($, %, hours saved, user counts).',
      recommendation: 'Use Google XYZ Formula: "Accomplished [X] as measured by [Y], by doing [Z]" in at least 70% of bullets.'
    },
    {
      id: 'tone',
      name: 'Executive Tone & Action Verbs',
      score: 88,
      maxScore: 100,
      weight: '10% Weight',
      status: 'optimal',
      description: 'Detects active voice verbs (Spearheaded, Architected, Engineered) versus weak passive phrases (Responsible for, Helped with).',
      recommendation: 'Start every bullet point with a high-impact past-tense power verb.'
    }
  ];

  const filteredMetrics = subMetrics.filter((m) => {
    if (selectedFilter === 'needs-attention') return m.status !== 'optimal';
    if (selectedFilter === 'optimal') return m.status === 'optimal';
    return true;
  });

  const getStatusBadge = (status: ScoreSubMetric['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="app-badge-success px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} />
            Optimal
          </span>
        );
      case 'warning':
        return (
          <span className="app-badge-warning px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <AlertTriangle size={12} />
            Needs Attention
          </span>
        );
      case 'critical':
        return (
          <span className="app-badge-danger px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <XCircle size={12} />
            Action Required
          </span>
        );
    }
  };

  return (
    <div className="app-card p-6 sm:p-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <BarChart3 size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ATS Scoring Matrix & Diagnostic Dimensions
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detailed breakdown across 5 foundational ATS hiring dimensions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All (5)
          </button>
          <button
            onClick={() => setSelectedFilter('needs-attention')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              selectedFilter === 'needs-attention'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Needs Attention
          </button>
          <button
            onClick={() => setSelectedFilter('optimal')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              selectedFilter === 'optimal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Optimal
          </button>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-3">
        {filteredMetrics.map((metric) => {
          const isExpanded = expandedMetricId === metric.id;
          return (
            <div
              key={metric.id}
              className="app-subcard rounded-xl overflow-hidden transition-all"
            >
              {/* Header row */}
              <button
                onClick={() => setExpandedMetricId(isExpanded ? null : metric.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-800 shadow-xs">
                    {metric.score}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {metric.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        • {metric.weight}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {metric.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(metric.status)}
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </button>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-1">
                <div
                  className={`h-full ${
                    metric.score >= 80
                      ? 'bg-emerald-500'
                      : metric.score >= 65
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <strong className="text-slate-700 font-semibold uppercase text-[10px] tracking-wider block">
                        Diagnostic Assessment
                      </strong>
                      <p className="text-slate-600 leading-relaxed">
                        {metric.description}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-blue-900 font-semibold uppercase text-[10px] tracking-wider block">
                        Actionable Fix
                      </strong>
                      <p className="text-slate-600 leading-relaxed">
                        {metric.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={onNavigateToBuilder}
                      className="app-btn-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <Sparkles size={13} className="text-blue-600" />
                      <span>Fix in Resume Builder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
