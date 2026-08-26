import React, { useState, useEffect } from 'react';
import { ATSAnalysisResult } from '../../types';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Cpu,
  X,
  Sparkles
} from 'lucide-react';

interface ScannerHUDProps {
  analysis: ATSAnalysisResult;
  onClose: () => void;
  onNavigateToBuilder: () => void;
}

export const ScannerHUD: React.FC<ScannerHUDProps> = ({
  analysis,
  onClose,
  onNavigateToBuilder,
}) => {
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    { title: 'Optical Typography Deconstruction', progress: 100, status: 'complete' },
    { title: 'ATS Multi-Column & Table Parsing', progress: 95, status: 'complete' },
    { title: 'Semantic Keyword Matrix Calibration', progress: 84, status: 'warning' },
    { title: 'STAR & XYZ Metric Quantification', progress: 68, status: 'critical' },
    { title: 'Executive Tone & Power Verb Index', progress: 92, status: 'complete' },
  ];

  const simulatedLogs = [
    '[00.12s] [INIT] Optical character parser booted (2,400 DPI standard).',
    `[00.28s] [PARSER] File "${analysis.documentDetails.fileName}" deconstructed into 482 semantic tokens.`,
    '[00.45s] [STRUCTURE] Single-column body text parsed with 99.4% confidence.',
    `[00.72s] [CALIBRATION] Calibrating against benchmark for "${analysis.targetRole}".`,
    `[01.05s] [KEYWORDS] ${analysis.matchedKeywords.length} matching keywords indexed in technical skills token dictionary.`,
    `[01.32s] [GAPS] Identified ${analysis.missingKeywords.length} high-frequency missing keywords from target requirements.`,
    '[01.68s] [DIAGNOSTIC] Detected 3 bullet points lacking quantifiable dollar or percentage metrics.',
    `[02.10s] [SCORING] Final ATS Viability Index: ${analysis.overallScore}/100. Diagnostic Matrix finalized.`,
  ];

  useEffect(() => {
    setLogs([]);
    simulatedLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, (index + 1) * 200);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl p-6 sm:p-8 rounded-2xl relative shadow-2xl space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ATS Diagnostic Pipeline & Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Target Role: {analysis.targetRole} • File: {analysis.documentDetails.fileName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Diagnostic Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border space-y-1.5 ${
                stage.status === 'complete'
                  ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                  : stage.status === 'warning'
                  ? 'border-amber-200 bg-amber-50/40 text-amber-900'
                  : 'border-rose-200 bg-rose-50/40 text-rose-900'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span>Stage 0{idx + 1}</span>
                {stage.status === 'complete' && <CheckCircle2 size={12} className="text-emerald-600" />}
                {stage.status === 'warning' && <AlertTriangle size={12} className="text-amber-600" />}
                {stage.status === 'critical' && <XCircle size={12} className="text-rose-600" />}
              </div>
              <p className="text-[11px] font-medium leading-tight line-clamp-2">
                {stage.title}
              </p>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    stage.status === 'complete'
                      ? 'bg-emerald-500'
                      : stage.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Terminal Output */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 max-h-52 overflow-y-auto border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Terminal size={13} />
              Parser Execution Log
            </span>
            <span>Completed</span>
          </div>

          <div className="space-y-1 pt-1">
            {logs.map((log, idx) => (
              <div key={idx} className="text-slate-300">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Final Score: <strong className="text-slate-900">{analysis.overallScore}/100</strong>
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="app-btn-secondary px-4 py-2 rounded-lg text-xs"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToBuilder();
              }}
              className="app-btn-primary px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Apply Fixes in Builder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
