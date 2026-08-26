import React, { useState } from 'react';
import { ResumeData } from '../types';
import {
  X,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  FileText,
  Globe,
  RefreshCw,
  Linkedin
} from 'lucide-react';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedData: Partial<ResumeData>) => void;
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [importMode, setImportMode] = useState<'url' | 'text' | 'presets'>('url');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileText, setProfileText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Partial<ResumeData> | null>(null);

  if (!isOpen) return null;

  const samplePresets = [
    {
      title: 'Staff AI Systems Engineer',
      company: 'AI Research Labs',
      handle: 'https://linkedin.com/in/marcus-vance-ai',
      text: `Marcus Vance
Staff AI Systems & Distributed ML Engineer | Ex-Google Brain | Stanford MS CS
San Francisco, California | marcus.vance.ai@gmail.com | +1 (415) 555-0192 | linkedin.com/in/marcus-vance-ai | marcusvance.dev

About:
Staff AI Engineer with 9+ years of experience architecting distributed training clusters and high-throughput LLM inference engines. Pioneer in FP8 quantization and multi-node GPU orchestration. Led cross-functional systems engineering teams across foundational model releases.

Experience:
Staff Machine Learning Systems Engineer
Nexus AI • Full-time
Jan 2022 - Present • 3 yrs 8 mos
San Francisco Bay Area
- Architected distributed LLM inference engine serving 45,000+ queries per second with sub-40ms time-to-first-token.
- Engineered custom CUDA kernels and FP8 tensor quantization pipelines, reducing GPU infrastructure cluster costs by $4.2M annually.
- Mentored a specialized team of 14 systems engineers and coordinated cross-functional launch of v3 Enterprise API.

Senior Software Engineer - Infrastructure
CloudScale Technologies
Aug 2018 - Dec 2021 • 3 yrs 5 mos
Mountain View, CA
- Built distributed storage subsystem handling 12 PB daily telemetry with 99.999% availability.
- Automated Kubernetes scheduling for multi-cloud GPU workloads across AWS and GCP, reducing pod provisioning latency by 65%.

Education:
Stanford University
Master of Science (M.S.), Computer Science (Artificial Intelligence Specialization)
2016 - 2018
Honors: Graduate Research Fellow, Top 5% Cohort

University of Washington
Bachelor of Science (B.S.), Computer Engineering
2012 - 2016
Honors: Magna Cum Laude

Skills:
Distributed Systems, PyTorch, Triton, CUDA C++, Kubernetes, Ray, Python, Go, High-Performance Computing, LLM Serving, Docker, AWS, GCP, Terraform`,
    },
    {
      title: 'VP of Product Management',
      company: 'FinTech & Enterprise SaaS',
      handle: 'https://linkedin.com/in/elena-rostova-product',
      text: `Elena Rostova
VP of Product Management | FinTech & Enterprise B2B SaaS | Ex-Stripe | Harvard MBA
New York, NY | elena.rostova.pm@gmail.com | +1 (212) 555-0144 | linkedin.com/in/elena-rostova-product

About:
Executive Product Leader with 12+ years driving $100M+ ARR product lines from 0 to 1 and scaling global enterprise SaaS portfolios. Passionate about AI-driven workflows, developer experience, and strategic go-to-market execution.

Experience:
Vice President of Product Management
Horizon FinTech Solutions
Mar 2021 - Present • 4 yrs 6 mos
New York, NY
- Spearheaded enterprise payments platform expansion, scaling ARR from $28M to $115M across 40+ global markets.
- Led product organization of 35 Product Managers, Designers, and Technical Program Managers across 4 global hubs.
- Orchestrated rollout of AI-powered fraud prevention engine, reducing unauthorized chargebacks by 54%.

Director of Product Strategy
Stripe Platform Ecosystem
Jun 2017 - Feb 2021 • 3 yrs 9 mos
San Francisco, CA
- Drove developer platform APIs adopted by 250,000+ global merchant accounts.
- Reduced onboarding drop-off by 38% through friction-free verification flows.

Education:
Harvard Business School
Master of Business Administration (MBA), General Management & Strategy
2015 - 2017

Columbia University
Bachelor of Arts (B.A.), Economics & Mathematics
2011 - 2015
Honors: Summa Cum Laude, Phi Beta Kappa

Skills:
Enterprise SaaS Strategy, Product Growth, FinTech Payments, Go-To-Market (GTM), Executive Stakeholder Management, Team Leadership, User Research, A/B Testing, OKRs & KPIs`,
    },
    {
      title: 'Principal UX & Design Systems Lead',
      company: 'Enterprise Software',
      handle: 'https://linkedin.com/in/chloe-kim-design',
      text: `Chloe Kim
Principal Product Designer & Design Systems Architect | Ex-Airbnb | RISD BFA
Seattle, WA | chloe.kim.ux@design.io | +1 (206) 555-0188 | linkedin.com/in/chloe-kim-design | chloekim.design

About:
Human-centered design architect with 10+ years shaping multi-platform design systems and high-converting consumer experiences. Obsessed with accessibility (WCAG AAA), micro-interactions, and design-engineering bridges.

Experience:
Principal Design Systems Architect
Aura Consumer Tech
May 2021 - Present • 4 yrs 4 mos
Seattle, WA
- Created and governed multi-brand design system utilized by 120+ engineers and 30 designers across Web, iOS, and Android.
- Increased design-to-code velocity by 48% through automated Figma-to-Tokens pipeline with style dictionary.
- Championed WCAG 2.2 AAA accessibility compliance across all core customer conversion funnels.

Senior Product Designer
Airbnb Design Labs
Jan 2018 - Apr 2021 • 3 yrs 4 mos
San Francisco, CA
- Led mobile checkout redesign, driving a 14.2% lift in global booking completion rate.
- Authored component guideline specifications and led weekly design critiques.

Education:
Rhode Island School of Design (RISD)
Bachelor of Fine Arts (B.F.A.), Graphic Design & Digital Media
2013 - 2017
Honors: Highest Honors

Skills:
Design Systems, Figma, WCAG Accessibility, User Research, Prototyping, Interaction Design, Token Architecture, Cross-functional Leadership`,
    },
  ];

  const handleParse = async (urlInput?: string, textInput?: string) => {
    const url = urlInput !== undefined ? urlInput : linkedinUrl;
    const text = textInput !== undefined ? textInput : profileText;

    if (!url.trim() && !text.trim()) {
      setError('Please enter a LinkedIn Profile URL or paste your profile text.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep('Extracting LinkedIn profile structure...');

    try {
      setTimeout(() => setLoadingStep('Formatting STAR bullet points & metrics...'), 400);
      setTimeout(() => setLoadingStep('Categorizing skills & credentials...'), 800);

      const response = await fetch('/api/parse-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: url.trim(),
          profileText: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse LinkedIn data from server');
      }

      const json = await response.json();
      if (json.success && json.data) {
        setParsedPreview(json.data);
      } else {
        throw new Error(json.error || 'Unable to parse profile data');
      }
    } catch (err: any) {
      console.error('LinkedIn parse error:', err);
      setError(err.message || 'Error parsing LinkedIn profile. Please check the input or try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleApply = () => {
    if (parsedPreview) {
      onImportSuccess(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Linkedin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Import Profile Data</h3>
                <span className="app-badge-blue px-2 py-0.5 rounded text-[10px] font-semibold">
                  Parser
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Populate your resume fields automatically using a LinkedIn profile URL or text summary.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-grow">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setImportMode('url');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-all ${
                importMode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe size={13} />
              Profile URL
            </button>
            <button
              onClick={() => {
                setImportMode('text');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-all ${
                importMode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText size={13} />
              Profile Text
            </button>
            <button
              onClick={() => {
                setImportMode('presets');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-all ${
                importMode === 'presets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles size={13} />
              Sample Profiles
            </button>
          </div>

          {/* Mode 1: URL Input */}
          {importMode === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                    <Linkedin size={15} />
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Example: <code className="text-blue-600 font-mono">https://www.linkedin.com/in/satyanadella</code> or paste your profile link.
                </p>
              </div>

              <div className="app-subcard rounded-xl p-4 text-xs text-slate-600 space-y-1.5 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Sparkles size={13} className="text-blue-600" />
                  How profile extraction works
                </div>
                <p className="leading-relaxed">
                  Our parser extracts headline summary, standardizes employment dates into MM/YYYY ATS schemas, and converts responsibilities into metric-driven bullet points.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Text / PDF Paste */}
          {importMode === 'text' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Paste Profile Text / Bio Summary
                  </label>
                </div>
                <textarea
                  rows={6}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Paste LinkedIn About section, Experience items, or bio text here..."
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-600 leading-relaxed shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Check size={13} className="text-emerald-600" />
                Accepts raw unformatted text and unstructured career histories.
              </div>
            </div>
          )}

          {/* Mode 3: Presets */}
          {importMode === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select a sample profile to populate the builder with structured data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {samplePresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLinkedinUrl(preset.handle);
                      setProfileText(preset.text);
                      handleParse(preset.handle, preset.text);
                    }}
                    className="app-card hover:border-blue-300 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                        Preset 0{idx + 1}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{preset.company}</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>Load & Parse</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview Section */}
          {parsedPreview && (
            <div className="app-card border border-emerald-200 bg-emerald-50/20 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                    Extracted Resume Preview
                  </h4>
                </div>
                <span className="app-badge-success px-2 py-0.5 rounded text-[10px] font-semibold">
                  Ready to Apply
                </span>
              </div>

              {/* Candidate Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Candidate</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {parsedPreview.personalInfo?.firstName} {parsedPreview.personalInfo?.lastName}
                  </div>
                  <div className="text-blue-700 text-xs mt-0.5">
                    {parsedPreview.personalInfo?.professionalTitle}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Parsed Items</div>
                  <div className="text-slate-800 font-medium text-xs mt-0.5">
                    {parsedPreview.workExperience?.length || 0} Roles • {parsedPreview.education?.length || 0} Degrees •{' '}
                    {parsedPreview.skillsCategories?.length || 0} Skill Categories
                  </div>
                  <div className="text-slate-500 text-[11px] truncate mt-0.5">
                    {parsedPreview.personalInfo?.email || 'No email'} • {parsedPreview.personalInfo?.location}
                  </div>
                </div>
              </div>

              {/* Summary Snippet */}
              {parsedPreview.summary && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                    Generated Summary
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &quot;{parsedPreview.summary}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="app-btn-secondary px-4 py-2 text-xs rounded-lg"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {parsedPreview ? (
              <button
                onClick={handleApply}
                className="app-btn-primary text-xs px-5 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Apply to Builder</span>
              </button>
            ) : (
              <button
                onClick={() => handleParse()}
                disabled={isLoading}
                className="app-btn-primary text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>{loadingStep || 'Parsing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Extract Profile Data</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
