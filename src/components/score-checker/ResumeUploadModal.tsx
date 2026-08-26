import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fileOrText: File | string, targetRole?: string) => Promise<void>;
  currentTargetRole: string;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentTargetRole,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(currentTargetRole || 'Senior AI Product Manager');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanTelemetrySteps = [
    'Parsing typography, fonts, and document structure...',
    'Evaluating ATS table safety and multi-column parsing...',
    'Extracting semantic keyword tokens against target role...',
    'Benchmarking against industry hiring vectors...',
    'Finalizing diagnostic report and ATS compatibility score...',
  ];

  useEffect(() => {
    if (isScanning) {
      setScanStep(0);
      const interval = setInterval(() => {
        setScanStep((prev) => {
          if (prev < scanTelemetrySteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (selectedFile) {
      await onUpload(selectedFile, targetRole);
    } else {
      await onUpload('Sample Resume Content Parsed', targetRole);
    }
    setIsScanning(false);
    onClose();
  };

  const handleLoadSample = async (sampleTitle: string, sampleRole: string) => {
    setTargetRole(sampleRole);
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await onUpload(
      `Sample Resume for ${sampleRole} (${sampleTitle}) with verified ATS experience bullets and skills.`,
      sampleRole
    );
    setIsScanning(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg p-6 sm:p-8 rounded-2xl relative shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload Resume for ATS Audit
              </h3>
              <p className="text-xs text-slate-500">
                Upload your document to generate a complete ATS diagnostic report.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isScanning}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Target Role Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
            Target Job Title
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior AI Product Manager"
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        {/* Upload Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-blue-600 mb-3 shadow-xs">
            <UploadCloud size={22} />
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                File Ready
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB • Click to change file
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Click or drag & drop resume file
              </p>
              <p className="text-[11px] text-slate-400">PDF, DOCX, or TXT up to 10MB</p>
            </div>
          )}
        </div>

        {/* Scanning progress display */}
        {isScanning && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <RefreshCw size={14} className="animate-spin text-blue-600" />
              <span>Analyzing Document...</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              {scanTelemetrySteps[scanStep]}
            </p>
          </div>
        )}

        {/* Quick Sample Candidates */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Or Test With Sample Candidate
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleLoadSample('Senior PM Sample', 'Senior AI Product Manager')}
              className="p-2.5 rounded-lg border border-slate-200 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="font-semibold text-slate-900">AI Product Manager</div>
              <div className="text-[10px] text-slate-400">8+ Years Experience</div>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('Staff Engineer Sample', 'Staff Software Engineer')}
              className="p-2.5 rounded-lg border border-slate-200 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="font-semibold text-slate-900">Staff Software Engineer</div>
              <div className="text-[10px] text-slate-400">Distributed Systems</div>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isScanning}
            className="app-btn-secondary px-4 py-2 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="app-btn-primary px-5 py-2 rounded-lg text-xs flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Start Diagnostic Scan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
