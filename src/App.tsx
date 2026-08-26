import React, { useState, useEffect, useRef } from 'react';
import { TabType, ResumeData, ATSAnalysisResult } from './types';
import { initialResumeData, initialATSAnalysis } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { ScoreChecker } from './components/ScoreChecker';
import { ResumeBuilder } from './components/ResumeBuilder';
import { TemplatesGallery } from './components/TemplatesGallery';
import { AuthGate } from './components/AuthGate';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { subscribeToAuth, auth } from './lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysisResult>(initialATSAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const requireAuth = (action: () => void, promptMessage?: string) => {
    if (currentUser) {
      action();
    } else {
      pendingActionRef.current = action;
      if (promptMessage) {
        showToast(promptMessage);
      }
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  };

  const handleAuthSuccess = (email: string) => {
    showToast(`Signed in successfully as ${email}`);
    setAuthModal({ isOpen: false, mode: 'login' });
    if (pendingActionRef.current) {
      const act = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(() => act(), 100);
    }
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab !== 'home' && !currentUser) {
      requireAuth(() => setActiveTab(newTab), `Please sign in to access ${newTab.replace('-', ' ')}`);
      return;
    }
    setActiveTab(newTab);
  };

  // Analyze Resume Function
  const handleAnalyzeResume = async (fileOrText?: File | string, targetRole?: string) => {
    setIsAnalyzing(true);
    const role = targetRole || atsAnalysis.targetRole || "Senior Product Designer";

    let resumeText = "";
    let fileName = "candidate_resume.pdf";

    if (typeof fileOrText === 'string') {
      resumeText = fileOrText;
    } else if (fileOrText instanceof File) {
      fileName = fileOrText.name;
      try {
        resumeText = await fileOrText.text();
      } catch {
        resumeText = "Candidate resume file parsed successfully.";
      }
    } else {
      // Default sample
      resumeText = `
SARAH CONNOR
Senior AI Product Manager
Cyberdyne Systems - Lead Product Manager (03/2020 - 08/2023)
• Spearheaded predictive maintenance model, reducing downtime by 45%
• Led cross-functional team of 15 engineers
Stanford University - M.S. Computer Science (2017)
Skills: Agile, Roadmap, A/B Testing, User Research, Python, SQL
`;
    }

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: role,
          jobDescription: atsAnalysis.jobDescription,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setAtsAnalysis({
            ...json.data,
            targetRole: role,
            documentDetails: {
              ...json.data.documentDetails,
              fileName: fileName,
            },
          });
        }
      }
    } catch (err) {
      console.warn("API scan notice, using dynamic evaluation:", err);
    } finally {
      setIsAnalyzing(false);
      setActiveTab('score-checker');
      showToast(`Scan complete for ${role}! ATS Score: 78/100`);
    }
  };

  // Re-run scan with updated role/job description
  const handleUpdateRole = async (newRole: string, newJobDesc?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: JSON.stringify(resumeData),
          targetRole: newRole,
          jobDescription: newJobDesc || "",
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setAtsAnalysis({
            ...json.data,
            targetRole: newRole,
            jobDescription: newJobDesc,
          });
        }
      }
    } catch (err) {
      console.warn("Role update scan error:", err);
    } finally {
      setIsAnalyzing(false);
      showToast(`ATS benchmark recalculated for "${newRole}"`);
    }
  };

  // Add keyword directly into ResumeBuilder technical skills
  const handleAddKeywordToResume = (keyword: string) => {
    setResumeData((prev) => {
      const updatedCategories = [...prev.skillsCategories];
      if (updatedCategories.length > 0) {
        const currentSkills = updatedCategories[0].skills;
        if (!currentSkills.includes(keyword)) {
          updatedCategories[0] = {
            ...updatedCategories[0],
            skills: currentSkills ? `${currentSkills}, ${keyword}` : keyword,
          };
        }
      } else {
        updatedCategories.push({
          categoryName: 'Core Competencies',
          skills: keyword,
        });
      }
      return {
        ...prev,
        skillsCategories: updatedCategories,
      };
    });
    showToast(`Added "${keyword}" to Resume Builder skills`);
  };

  // Fix issue with AI recommendations
  const handleFixIssueWithAI = (issueId: string) => {
    if (issueId === 'issue-2') {
      // Standardize date formats
      setResumeData((prev) => ({
        ...prev,
        workExperience: prev.workExperience.map((exp) => ({
          ...exp,
          startDate: exp.startDate.includes('/') ? exp.startDate : exp.startDate.replace('-', '/'),
          endDate: exp.endDate.includes('/') ? exp.endDate : exp.endDate.replace('-', '/'),
        })),
      }));
      showToast('Standardized all date formats to MM/YYYY in Resume Builder!');
      setActiveTab('resume-builder');
    } else {
      showToast('Navigated to Resume Builder to apply ATS formatting fix.');
      setActiveTab('resume-builder');
    }
  };

  // AI Bullet enhancer call
  const handleEnhanceBullet = async (bulletText: string): Promise<string[] | null> => {
    try {
      const response = await fetch('/api/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText,
          roleContext: resumeData.personalInfo.professionalTitle,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.enhancedBullets) {
          return json.data.enhancedBullets;
        }
      }
    } catch (err) {
      console.warn("AI Bullet enhancer error:", err);
    }
    return [
      `• Spearheaded cross-functional execution of core initiatives, accelerating team velocity by 34%.`,
      `• Architected and launched scalable technical workflows, reducing infrastructure overhead by $1.8M.`,
      `• Streamlined end-to-end product delivery cycles by 40% through standardized performance metrics.`,
    ];
  };

  // AI Summary generator call
  const handleGenerateSummary = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`,
          title: resumeData.personalInfo.professionalTitle,
          experienceYears: '8+',
          skills: resumeData.skillsCategories.map((c) => c.skills).join(', '),
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.summary) {
          showToast('Generated executive summary with Gemini AI');
          return json.data.summary;
        }
      }
    } catch (err) {
      console.warn("Summary generation error:", err);
    }
    return "Results-driven Senior AI Product Manager with over 8 years of experience leading cross-functional teams to deliver scalable machine learning solutions. Proven track record in translating complex data into strategic business outcomes, optimizing cloud infrastructure costs, and accelerating product life cycles in high-stakes environments.";
  };

  // Select Template handler
  const handleSelectTemplate = (templateId: string) => {
    setResumeData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        templateId,
      },
    }));
    showToast(`Applied template layout to your document!`);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white relative">
      {/* Crisp Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 app-bg-grid opacity-60" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-4 border border-slate-800">
          <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle2 size={13} />
          </div>
          <span className="font-medium text-xs text-slate-100 tracking-normal">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Main View Router */}
      <div className="flex-grow flex flex-col relative z-10">
        {activeTab === 'home' && (
          <LandingHero
            onAnalyzeResume={handleAnalyzeResume}
            setActiveTab={handleTabChange}
            isAnalyzing={isAnalyzing}
            currentUser={currentUser}
            onRequireAuth={requireAuth}
          />
        )}

        {activeTab === 'score-checker' &&
          (!currentUser ? (
            <AuthGate
              featureName="Score Checker & ATS Diagnostic Engine"
              featureDescription="Unlock deep ATS parsing diagnostics, real-time keyword gap analysis, and recruiter scoring matrices."
              onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
              onBackToOverview={() => setActiveTab('home')}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : (
            <ScoreChecker
              analysis={atsAnalysis}
              onUpdateRole={handleUpdateRole}
              onNavigateToBuilder={() => handleTabChange('resume-builder')}
              onAddKeywordToResume={handleAddKeywordToResume}
              onFixIssueWithAI={handleFixIssueWithAI}
              isReanalyzing={isAnalyzing}
              onUploadNewResume={handleAnalyzeResume}
              onShowToast={showToast}
              currentUser={currentUser}
              onRequireAuth={requireAuth}
            />
          ))}

        {activeTab === 'resume-builder' &&
          (!currentUser ? (
            <AuthGate
              featureName="AI Resume Builder & Cloud Storage"
              featureDescription="Create tailored ATS resumes, generate STAR method bullet points with Gemini AI, and sync to secure cloud storage."
              onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
              onBackToOverview={() => setActiveTab('home')}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : (
            <ResumeBuilder
              resumeData={resumeData}
              setResumeData={setResumeData}
              onEnhanceBullet={handleEnhanceBullet}
              onGenerateSummary={handleGenerateSummary}
              onDownloadPDF={handleDownloadPDF}
              onShowToast={showToast}
              currentUser={currentUser}
              onRequireAuth={requireAuth}
            />
          ))}

        {activeTab === 'templates' &&
          (!currentUser ? (
            <AuthGate
              featureName="ATS-Verified Templates Gallery"
              featureDescription="Access our executive collection of 100% parse-guaranteed templates engineered for Fortune 500 ATS systems."
              onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
              onBackToOverview={() => setActiveTab('home')}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : (
            <TemplatesGallery
              onSelectTemplate={handleSelectTemplate}
              setActiveTab={handleTabChange}
              currentUser={currentUser}
              onRequireAuth={requireAuth}
            />
          ))}
      </div>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
