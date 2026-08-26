import React, { useState } from 'react';
import { ResumeData, WorkExperience, EducationItem, SkillCategory } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  Eye,
  Type,
  Check,
  RefreshCw,
  Cloud,
  FolderOpen,
  Save,
  CheckCircle,
  Linkedin,
  UploadCloud,
  AlertCircle,
  X
} from 'lucide-react';
import { LinkedInImportModal } from './LinkedInImportModal';
import { saveResumeToCloud, loadUserResumes, deleteResumeFromCloud, SavedResumeRecord, auth } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface ResumeBuilderProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onEnhanceBullet: (bulletText: string) => Promise<string[] | null>;
  onGenerateSummary: () => Promise<string | null>;
  onDownloadPDF: () => void;
  onShowToast?: (msg: string) => void;
  currentUser?: FirebaseUser | null;
  onRequireAuth?: (action: () => void, message?: string) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resumeData,
  setResumeData,
  onEnhanceBullet,
  onGenerateSummary,
  onDownloadPDF,
  onShowToast,
  currentUser,
  onRequireAuth,
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills' | 'summary'>('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [enhancingExpId, setEnhancingExpId] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ expId: string; bullets: string[] } | null>(null);
  
  // LinkedIn Import State
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Cloud Persistence State
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [cloudResumes, setCloudResumes] = useState<SavedResumeRecord[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [cloudDocTitle, setCloudDocTitle] = useState(`${resumeData.personalInfo.firstName || 'Candidate'} - Resume`);
  const [cloudMessage, setCloudMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const executeWithAuth = (action: () => void, message?: string) => {
    if (onRequireAuth) {
      onRequireAuth(action, message);
    } else {
      action();
    }
  };

  const toast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  const handleLinkedInImportSuccess = (imported: Partial<ResumeData>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...(imported.personalInfo || {}),
      },
      summary: imported.summary !== undefined ? imported.summary : prev.summary,
      workExperience: imported.workExperience && imported.workExperience.length > 0 ? imported.workExperience : prev.workExperience,
      education: imported.education && imported.education.length > 0 ? imported.education : prev.education,
      skillsCategories: imported.skillsCategories && imported.skillsCategories.length > 0 ? imported.skillsCategories : prev.skillsCategories,
    }));
    toast('Imported profile data from LinkedIn successfully!');
  };

  // Fetch Cloud Resumes
  const handleOpenCloudModal = async () => {
    setIsCloudModalOpen(true);
    setCloudMessage(null);
    if (!auth.currentUser) {
      return;
    }
    setIsLoadingCloud(true);
    try {
      const records = await loadUserResumes();
      setCloudResumes(records || []);
    } catch (err: any) {
      setCloudMessage({ type: 'error', text: 'Sign in to access your cloud resumes.' });
    } finally {
      setIsLoadingCloud(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!auth.currentUser) {
      setCloudMessage({ type: 'error', text: 'Please sign in to save your resume to the cloud.' });
      return;
    }
    setIsSavingCloud(true);
    setCloudMessage(null);
    try {
      const resumeId = `resume_${Date.now()}`;
      const title = cloudDocTitle.trim() || `${resumeData.personalInfo.firstName} Resume`;
      await saveResumeToCloud(resumeId, title, resumeData);
      setCloudMessage({ type: 'success', text: `Saved "${title}" securely to cloud storage.` });
      toast(`Saved "${title}" to Cloud!`);
      const records = await loadUserResumes();
      setCloudResumes(records || []);
    } catch (err: any) {
      setCloudMessage({ type: 'error', text: err.message || 'Failed to save to cloud' });
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleLoadCloudResume = (record: SavedResumeRecord) => {
    setResumeData(record.resumeData);
    setCloudDocTitle(record.title);
    setIsCloudModalOpen(false);
    toast(`Loaded "${record.title}" from storage!`);
  };

  const handleDeleteCloudResume = async (resumeId: string) => {
    try {
      await deleteResumeFromCloud(resumeId);
      setCloudResumes((prev) => prev.filter((r) => r.id !== resumeId));
      toast('Resume removed from cloud storage.');
    } catch (err: any) {
      toast('Failed to delete resume.');
    }
  };

  // Update handlers
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      jobTitle: 'Senior Role Title',
      company: 'Company Name',
      location: 'City, State',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      description: '• Spearheaded key initiatives that accelerated team productivity by 25%.\n• Designed and delivered scalable cross-functional workflows.',
    };
    setResumeData((prev) => ({
      ...prev,
      workExperience: [newExp, ...prev.workExperience],
    }));
    setActiveSection('experience');
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const deleteExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'University Name',
      location: 'City, State',
      graduationYear: '2020',
      honors: 'Cum Laude',
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
    setActiveSection('education');
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const deleteEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateSkillCategory = (index: number, field: keyof SkillCategory, value: string) => {
    setResumeData((prev) => {
      const updated = [...prev.skillsCategories];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, skillsCategories: updated };
    });
  };

  const handleAddSkillCategory = () => {
    setResumeData((prev) => ({
      ...prev,
      skillsCategories: [
        ...prev.skillsCategories,
        { categoryName: 'Specialization', skills: 'Skill A, Skill B, Skill C' },
      ],
    }));
  };

  const handleDeleteSkillCategory = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skillsCategories: prev.skillsCategories.filter((_, i) => i !== index),
    }));
  };

  const triggerAIBulletEnhance = async (exp: WorkExperience) => {
    executeWithAuth(async () => {
      setEnhancingExpId(exp.id);
      const suggestions = await onEnhanceBullet(exp.description);
      if (suggestions && suggestions.length > 0) {
        setAiSuggestions({ expId: exp.id, bullets: suggestions });
      }
      setEnhancingExpId(null);
    }, 'Please sign in to generate AI-optimized STAR bullet points.');
  };

  const applyAISuggestion = (expId: string, bulletText: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            description: exp.description + '\n' + bulletText,
          };
        }
        return exp;
      }),
    }));
    setAiSuggestions(null);
  };

  const triggerAISummary = async () => {
    executeWithAuth(async () => {
      setIsGeneratingSummary(true);
      const summary = await onGenerateSummary();
      if (summary) {
        updateSummary(summary);
      }
      setIsGeneratingSummary(false);
    }, 'Please sign in to generate an AI Executive Summary.');
  };

  // Font family styles
  const fontClass =
    resumeData.settings.fontFamily === 'Merriweather'
      ? "font-['Merriweather',serif]"
      : resumeData.settings.fontFamily === 'Roboto'
      ? "font-['Roboto',sans-serif]"
      : "font-sans";

  // Spacing styles
  const spacingClass =
    resumeData.settings.spacing === 'Compact'
      ? 'space-y-3 leading-snug text-[13px]'
      : resumeData.settings.spacing === 'Spacious'
      ? 'space-y-6 leading-loose text-[15px]'
      : 'space-y-4 leading-normal text-[14px]';

  return (
    <div className="w-full text-slate-900 min-h-[calc(100vh-64px)] pb-16">
      {/* Top Clean Toolbar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="px-4 md:px-8 max-w-7xl mx-auto h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6 overflow-x-auto py-1">
            {/* Font Selector */}
            <div className="flex items-center gap-2">
              <Type size={14} className="text-slate-400" />
              <select
                value={resumeData.settings.fontFamily}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      fontFamily: e.target.value as any,
                    },
                  }))
                }
                className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
              >
                <option value="Inter">Inter (Sans)</option>
                <option value="Merriweather">Merriweather (Serif)</option>
                <option value="Roboto">Roboto (Clean)</option>
              </select>
            </div>

            {/* Spacing Selector */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-3 md:pl-6">
              <span className="text-[11px] font-semibold uppercase text-slate-400 hidden sm:inline mr-1">
                Spacing:
              </span>
              {(['Compact', 'Normal', 'Spacious'] as const).map((space) => (
                <button
                  key={space}
                  onClick={() =>
                    setResumeData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, spacing: space },
                    }))
                  }
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    resumeData.settings.spacing === space
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {space}
                </button>
              ))}
            </div>

            {/* Accent Color */}
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-6">
              <span className="text-[11px] font-semibold uppercase text-slate-400">Accent:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Navy', hex: '#0f172a' },
                  { name: 'Blue', hex: '#2563eb' },
                  { name: 'Emerald', hex: '#059669' },
                  { name: 'Purple', hex: '#7c3aed' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() =>
                      setResumeData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, accentColor: c.hex },
                      }))
                    }
                    style={{ backgroundColor: c.hex }}
                    className={`w-4 h-4 rounded-full border border-slate-300 transition-transform ${
                      resumeData.settings.accentColor === c.hex
                        ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                        : 'hover:scale-105 opacity-80'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* LinkedIn Import Button */}
            <button
              onClick={() => setIsLinkedInModalOpen(true)}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
              title="Import profile data from LinkedIn"
            >
              <Linkedin size={13} />
              <span className="hidden sm:inline">Import</span> LinkedIn
            </button>

            {/* Cloud Storage Button */}
            <button
              onClick={handleOpenCloudModal}
              className="app-btn-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              title="Save to or load from Cloud"
            >
              <Cloud size={13} className="text-blue-600" />
              <span className="hidden md:inline">Cloud</span> Docs
            </button>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
            >
              <Eye size={13} />
              {previewMode ? 'Editor' : 'Preview'}
            </button>

            <button
              onClick={onDownloadPDF}
              className="app-btn-primary text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Editor Panel */}
          <div
            className={`lg:col-span-5 app-card rounded-xl overflow-hidden ${
              previewMode ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Form Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Resume Editor</h2>
                <p className="text-xs text-slate-500">
                  Standard single-column formatting
                </p>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['personal', 'experience', 'education', 'skills', 'summary'] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setActiveSection(sec)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded transition-all ${
                      activeSection === sec
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {sec === 'personal' ? 'Info' : sec === 'experience' ? 'Exp' : sec === 'education' ? 'Edu' : sec === 'skills' ? 'Skills' : 'Summary'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick LinkedIn Callout Banner */}
            <div className="p-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Linkedin size={13} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Autofill with LinkedIn</span>
                  <span className="text-slate-500 hidden sm:inline"> • Import bio and experience</span>
                </div>
              </div>
              <button
                onClick={() => setIsLinkedInModalOpen(true)}
                className="text-[11px] font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 shadow-xs"
              >
                <Sparkles size={11} />
                Import
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
              {/* Section 1: Personal Information */}
              <section className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.professionalTitle}
                    onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                      LinkedIn / Portfolio URL
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2: Executive Summary */}
              <section className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Professional Summary
                  </h3>
                  <button
                    onClick={triggerAISummary}
                    disabled={isGeneratingSummary}
                    className="app-btn-secondary text-[11px] px-2.5 py-1 rounded flex items-center gap-1"
                  >
                    <Sparkles size={12} className={isGeneratingSummary ? 'animate-spin text-blue-600' : 'text-blue-600'} />
                    {isGeneratingSummary ? 'Writing...' : 'AI Suggest'}
                  </button>
                </div>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-600 leading-relaxed shadow-xs"
                  placeholder="Summarize your professional experience, leadership metrics, and core expertise..."
                />
              </section>

              {/* Section 3: Work Experience */}
              <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Work Experience
                  </h3>
                  <button
                    onClick={handleAddExperience}
                    className="app-btn-primary text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Role
                  </button>
                </div>

                {resumeData.workExperience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 app-subcard rounded-xl space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">
                        Role #{idx + 1}
                      </span>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-semibold uppercase text-slate-500">
                          Bullet Points (STAR formula)
                        </label>
                        <button
                          type="button"
                          onClick={() => triggerAIBulletEnhance(exp)}
                          disabled={enhancingExpId === exp.id}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Sparkles
                            size={12}
                            className={enhancingExpId === exp.id ? 'animate-spin' : ''}
                          />
                          {enhancingExpId === exp.id ? 'Refining...' : 'AI Enhance'}
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs leading-relaxed focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                    </div>

                    {/* AI Suggestions Accordion */}
                    {aiSuggestions && aiSuggestions.expId === exp.id && (
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
                        <span className="text-xs font-bold text-blue-950 flex items-center gap-1">
                          <Sparkles size={12} className="text-blue-600" />
                          STAR Metric Suggestions:
                        </span>
                        <div className="space-y-1.5">
                          {aiSuggestions.bullets.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="text-xs bg-white p-2.5 rounded-lg border border-blue-200 flex items-start justify-between gap-2 text-slate-800"
                            >
                              <span>{b}</span>
                              <button
                                onClick={() => applyAISuggestion(exp.id, b)}
                                className="app-btn-primary text-[10px] px-2 py-0.5 rounded whitespace-nowrap"
                              >
                                + Insert
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </section>

              {/* Section 4: Education */}
              <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Education
                  </h3>
                  <button
                    onClick={handleAddEducation}
                    className="app-btn-primary text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Degree
                  </button>
                </div>

                {resumeData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3.5 app-subcard rounded-xl space-y-2.5 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Degree & School</span>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree / Major"
                        className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="University Name"
                        className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.location || ''}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="City, State"
                        className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                        placeholder="Graduation Year (e.g. 2020)"
                        className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* Section 5: Technical Skills */}
              <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Technical Skills & Categories
                  </h3>
                  <button
                    onClick={handleAddSkillCategory}
                    className="app-btn-primary text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Category
                  </button>
                </div>

                {resumeData.skillsCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 app-subcard rounded-xl space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cat.categoryName}
                        onChange={(e) => updateSkillCategory(idx, 'categoryName', e.target.value)}
                        placeholder="Category Name"
                        className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1 text-xs font-semibold w-2/3 focus:outline-none focus:border-blue-600 shadow-xs"
                      />
                      <button
                        onClick={() => handleDeleteSkillCategory(idx)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <textarea
                      value={cat.skills}
                      onChange={(e) => updateSkillCategory(idx, 'skills', e.target.value)}
                      placeholder="Comma-separated keywords (e.g., Python, Figma, React, Agile)"
                      rows={2}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2 text-xs leading-relaxed focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                  </div>
                ))}
              </section>
            </div>
          </div>

          {/* Right Live Document Canvas */}
          <div
            className={`lg:col-span-7 flex flex-col items-center ${
              previewMode ? 'block' : 'block'
            }`}
          >
            <div className="w-full flex justify-between items-center mb-3 text-xs text-slate-500 px-2 font-medium">
              <span>Standard ATS Layout (US Letter 8.5&quot; x 11&quot;)</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check size={14} /> 99.4% Parsing Compatibility
              </span>
            </div>

            <div className={`resume-preview-document ${fontClass} ${spacingClass}`}>
              {/* Document Header */}
              <header className="border-b border-slate-900 pb-5 mb-5 text-center sm:text-left">
                <h1
                  style={{ color: resumeData.settings.accentColor }}
                  className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight leading-tight"
                >
                  {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                </h1>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mt-1">
                  {resumeData.personalInfo.professionalTitle}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
                  <span>{resumeData.personalInfo.email}</span>
                  <span className="text-slate-300">•</span>
                  <span>{resumeData.personalInfo.phone}</span>
                  <span className="text-slate-300">•</span>
                  <span>{resumeData.personalInfo.location}</span>
                  {resumeData.personalInfo.linkedin && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-blue-700 font-semibold">{resumeData.personalInfo.linkedin}</span>
                    </>
                  )}
                </div>
              </header>

              {/* Professional Summary */}
              {resumeData.summary && (
                <section className="mb-5">
                  <h2
                    style={{ color: resumeData.settings.accentColor }}
                    className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2"
                  >
                    Professional Summary
                  </h2>
                  <p className="text-slate-800 text-xs leading-relaxed text-justify">
                    {resumeData.summary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              <section className="mb-5">
                <h2
                  style={{ color: resumeData.settings.accentColor }}
                  className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-3"
                >
                  Work Experience
                </h2>

                <div className="space-y-4">
                  {resumeData.workExperience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                        <div className="font-bold text-slate-900">
                          {exp.jobTitle}{' '}
                          <span className="font-normal text-slate-600">
                            | {exp.company}
                            {exp.location ? `, ${exp.location}` : ''}
                          </span>
                        </div>
                        <div className="font-medium text-slate-500">
                          {exp.startDate} – {exp.endDate}
                        </div>
                      </div>

                      <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed pl-1">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              {resumeData.education.length > 0 && (
                <section className="mb-5">
                  <h2
                    style={{ color: resumeData.settings.accentColor }}
                    className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2.5"
                  >
                    Education
                  </h2>

                  <div className="space-y-2">
                    {resumeData.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs"
                      >
                        <div>
                          <strong className="font-bold text-slate-900">{edu.degree}</strong>
                          <span className="text-slate-600"> — {edu.institution}</span>
                          {edu.honors && (
                            <span className="text-blue-700 text-xs font-medium ml-1">
                              ({edu.honors})
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-slate-500">
                          {edu.graduationYear}
                          {edu.location ? ` | ${edu.location}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Skills */}
              {resumeData.skillsCategories.length > 0 && (
                <section>
                  <h2
                    style={{ color: resumeData.settings.accentColor }}
                    className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2"
                  >
                    Technical Skills & Competencies
                  </h2>

                  <div className="space-y-1.5 text-xs">
                    {resumeData.skillsCategories.map((cat, idx) => (
                      <div key={idx} className="leading-snug">
                        <strong className="font-bold text-slate-900">{cat.categoryName}: </strong>
                        <span className="text-slate-700">{cat.skills}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Import Modal */}
      <LinkedInImportModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        onImportSuccess={handleLinkedInImportSuccess}
      />

      {/* Cloud Storage & Saved Resumes Modal */}
      {isCloudModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Cloud size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cloud Resumes</h3>
                  <p className="text-xs text-slate-500">
                    {auth.currentUser
                      ? `Signed in as ${auth.currentUser.email}`
                      : 'Sign in to access encrypted persistent storage'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCloudModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-grow custom-scrollbar">
              {/* Message Banner */}
              {cloudMessage && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    cloudMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {cloudMessage.type === 'success' ? (
                    <CheckCircle size={14} className="flex-shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="flex-shrink-0" />
                  )}
                  <span>{cloudMessage.text}</span>
                </div>
              )}

              {/* Save Current Document Section */}
              <div className="app-subcard rounded-xl p-4 space-y-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                    <Save size={13} className="text-blue-600" />
                    Save Active Document
                  </h4>
                  <span className="text-[10px] text-slate-400">Cloud Storage</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={cloudDocTitle}
                    onChange={(e) => setCloudDocTitle(e.target.value)}
                    placeholder="Enter document title (e.g. Senior AI PM Resume)"
                    className="flex-grow bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                  <button
                    onClick={handleSaveToCloud}
                    disabled={isSavingCloud}
                    className="app-btn-primary text-xs px-4 py-1.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingCloud ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={13} />
                        Save Document
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Saved Documents List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                    <FolderOpen size={13} className="text-blue-600" />
                    Saved Documents ({cloudResumes.length})
                  </h4>
                  <button
                    onClick={handleOpenCloudModal}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={11} /> Refresh
                  </button>
                </div>

                {isLoadingCloud ? (
                  <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                    <RefreshCw size={15} className="animate-spin text-blue-600" />
                    Loading saved documents...
                  </div>
                ) : cloudResumes.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-500">
                      {auth.currentUser
                        ? 'No saved cloud resumes found. Save your current resume above to keep it synced!'
                        : 'Sign in to access your saved documents.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cloudResumes.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate">{rec.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            Candidate: {rec.resumeData?.personalInfo?.firstName}{' '}
                            {rec.resumeData?.personalInfo?.lastName} •{' '}
                            {rec.resumeData?.personalInfo?.professionalTitle || 'Resume'}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleLoadCloudResume(rec)}
                            className="app-btn-secondary text-xs px-2.5 py-1 rounded flex items-center gap-1"
                          >
                            <Check size={12} />
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteCloudResume(rec.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                            title="Delete resume"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsCloudModalOpen(false)}
                className="app-btn-secondary px-4 py-1.5 text-xs rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
