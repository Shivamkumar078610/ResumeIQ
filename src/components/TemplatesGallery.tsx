import React, { useState } from 'react';
import { ResumeTemplate, TabType } from '../types';
import { sampleTemplates } from '../data/mockData';
import { Search, Check, Eye, ArrowRight, X } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface TemplatesGalleryProps {
  onSelectTemplate: (templateId: string) => void;
  setActiveTab: (tab: TabType) => void;
  currentUser?: FirebaseUser | null;
  onRequireAuth?: (action: () => void, message?: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onSelectTemplate,
  setActiveTab,
  onRequireAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const filteredTemplates = sampleTemplates.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry = selectedIndustry === 'all' || tpl.industry === selectedIndustry;
    const matchesLevel = selectedLevel === 'all' || tpl.experienceLevel === selectedLevel;

    return matchesSearch && matchesIndustry && matchesLevel;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedLevel('all');
  };

  const handleUseTemplate = (templateId: string) => {
    if (onRequireAuth) {
      onRequireAuth(() => {
        onSelectTemplate(templateId);
        setActiveTab('resume-builder');
      }, 'Please sign in to customize and build with this template.');
    } else {
      onSelectTemplate(templateId);
      setActiveTab('resume-builder');
    }
  };

  return (
    <main className="w-full px-4 md:px-8 max-w-7xl mx-auto py-10 text-slate-900">
      {/* Header */}
      <header className="mb-8 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="app-badge-blue px-2 py-0.5 rounded text-[11px] font-semibold">
            ATS Verified Layouts
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive & Technical Templates
        </h1>
        <p className="text-sm text-slate-500 max-w-3xl mt-1 leading-relaxed">
          Standardized single-column structures engineered for 100% parse accuracy with enterprise ATS platforms (Workday, Greenhouse, Lever, Taleo).
        </p>
      </header>

      {/* Filter Toolbar */}
      <div className="app-card p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-6 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by role, style, or keywords..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 bg-white text-slate-900 rounded-lg focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          {/* Industry dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              <option value="all">All Industries</option>
              <option value="tech">Technology & Software</option>
              <option value="finance">Finance & Operations</option>
              <option value="creative">Creative & Design</option>
              <option value="healthcare">Healthcare & Science</option>
            </select>
          </div>

          {/* Experience Level dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              <option value="all">All Experience Levels</option>
              <option value="entry">Entry Level / Graduate</option>
              <option value="mid">Mid-Senior Professional</option>
              <option value="executive">Executive & C-Suite</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedIndustry !== 'all' || selectedLevel !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">
              Active Filters:
            </span>
            {selectedIndustry !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium text-[11px] border border-slate-200">
                {selectedIndustry}
                <button onClick={() => setSelectedIndustry('all')}>
                  <X size={12} className="text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {selectedLevel !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium text-[11px] border border-slate-200">
                {selectedLevel}
                <button onClick={() => setSelectedLevel('all')}>
                  <X size={12} className="text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium text-[11px] border border-slate-200">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')}>
                  <X size={12} className="text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-rose-600 hover:underline text-[11px] ml-2 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="app-card overflow-hidden hover:border-slate-300 transition-all duration-200 flex flex-col group"
          >
            {/* Template Image Preview */}
            <div className="relative aspect-[1/1.2] bg-slate-100 overflow-hidden border-b border-slate-100">
              <img
                src={template.imageSrc}
                alt={template.title}
                className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Hover Quick Action Overlay */}
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-2.5 p-6">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full app-btn-primary text-xs py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  <span>Use This Template</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="w-full bg-white/90 hover:bg-white text-slate-800 font-semibold text-xs py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye size={13} /> Quick Preview
                </button>
              </div>
            </div>

            {/* Template Info Card */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {template.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {template.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {template.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check size={13} /> ATS Verified
                </span>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  Select Layout &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 app-card">
          <p className="text-sm text-slate-500 mb-3">
            No templates matched your selected criteria.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 font-semibold text-xs hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Template Detail Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {previewTemplate.title}
                </h3>
                <p className="text-xs text-slate-500">
                  ATS Verified Structural Schema
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[1/1.3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={previewTemplate.imageSrc}
                  alt={previewTemplate.title}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">
                      Template Overview
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {previewTemplate.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
                      Key Highlights
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {previewTemplate.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="app-subcard p-3.5 rounded-xl text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-900 text-xs">PARSER COMPATIBILITY:</div>
                    <div>Compatible with Workday, Taleo, Greenhouse, Lever, iCIMS.</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="flex-1 py-2 app-btn-secondary text-xs rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleUseTemplate(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1 py-2 app-btn-primary text-xs rounded-lg"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
