import { ATSAnalysisResult, ResumeData, ResumeTemplate } from '../types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: "Sarah",
    lastName: "Connor",
    professionalTitle: "Senior AI Product Manager",
    email: "sarah.connor@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sconnor",
    website: "sarahconnor.ai"
  },
  summary: "Results-driven AI Product Manager with over 8 years of experience leading cross-functional teams to deliver scalable machine learning solutions. Proven track record in translating complex data into strategic business outcomes, optimizing cloud infrastructure costs, and accelerating product life cycles in high-stakes environments.",
  workExperience: [
    {
      id: "exp-1",
      jobTitle: "Lead Product Manager - Machine Learning",
      company: "Cyberdyne Systems",
      location: "San Francisco, CA",
      startDate: "2020-03",
      endDate: "2023-08",
      isCurrent: false,
      description: "• Spearheaded the development of a predictive maintenance model, reducing system downtime by 45%.\n• Led a cross-functional team of 15 engineers and data scientists through 4 successful product launch cycles.\n• Optimized NLP pipelines, resulting in a 20% improvement in processing speed and a $2M reduction in cloud computing costs."
    },
    {
      id: "exp-2",
      jobTitle: "Data Product Analyst",
      company: "TechCorp Analytics",
      location: "San Jose, CA",
      startDate: "2017-06",
      endDate: "2020-02",
      isCurrent: false,
      description: "• Designed and implemented interactive dashboards using Tableau, increasing executive visibility into core metrics by 30%.\n• Conducted A/B testing on pricing models that led to a 12% increase in quarterly revenue."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "M.S. Computer Science (Specialization in AI)",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduationYear: "2017",
      honors: "Dean's List"
    }
  ],
  skillsCategories: [
    {
      categoryName: "Product Management",
      skills: "Agile/Scrum, Roadmap Planning, A/B Testing, User Research"
    },
    {
      categoryName: "AI/ML",
      skills: "NLP, Predictive Analytics, TensorFlow (Basic), Python"
    },
    {
      categoryName: "Tools",
      skills: "Jira, Confluence, Tableau, SQL, AWS Services"
    }
  ],
  settings: {
    fontFamily: "Inter",
    spacing: "Normal",
    accentColor: "#0058be",
    templateId: "innovator"
  }
};

export const initialATSAnalysis: ATSAnalysisResult = {
  overallScore: 78,
  matchLevel: "Fair Match",
  summary: "Your resume passes basic filters but lacks key technical terminology required for this role.",
  targetRole: "Senior Product Designer",
  targetCompany: "Figma / Stripe Ecosystem",
  issues: [
    {
      id: "issue-1",
      title: "Complex Table Formatting Detected",
      description: "Legacy ATS systems cannot parse multi-column tables accurately. Your \"Skills\" section content may be dropped.",
      category: "Formatting",
      severity: "critical",
      recommendedFix: "Convert multi-column skill tables into bulleted lists or standard comma-separated text strings."
    },
    {
      id: "issue-2",
      title: "Ambiguous Date Formats",
      description: "Experience entries under \"Acme Corp\" use non-standard date formats (e.g., '21 - Present). Use MM/YYYY to ensure tenure is calculated correctly.",
      category: "Parsing Error",
      severity: "critical",
      recommendedFix: "Standardize all job date ranges to MM/YYYY – MM/YYYY format."
    },
    {
      id: "issue-3",
      title: "Missing Quantifiable Impact Metrics",
      description: "Several bullet points describe duties rather than measurable achievements with percent increase or dollar savings.",
      category: "Impact & Metrics",
      severity: "warning",
      recommendedFix: "Rewrite bullets with the XYZ formula (Accomplished X, measured by Y, by doing Z)."
    }
  ],
  missingKeywords: [
    { keyword: "Design Systems", frequency: 0, importance: "High" },
    { keyword: "Figma Auto-layout", frequency: 0, importance: "High" },
    { keyword: "User Testing", frequency: 0, importance: "High" },
    { keyword: "Agile Methodology", frequency: 0, importance: "High" },
    { keyword: "Design Tokens", frequency: 0, importance: "Medium" }
  ],
  matchedKeywords: [
    "UI Design",
    "Prototyping",
    "Wireframing",
    "Sketch",
    "CSS",
    "Information Architecture",
    "User Research",
    "Accessibility (WCAG)"
  ],
  documentDetails: {
    fileName: "jdoe_resume_2024.pdf",
    wordCount: 482,
    readabilityScore: "8.2 (Professional)",
    lastAnalyzed: "Just now"
  }
};

export const sampleTemplates: ResumeTemplate[] = [
  {
    id: "innovator",
    title: "The Innovator",
    description: "A clean, two-column layout optimized for readability and high keyword density. Perfect for tech roles.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZUkBll3VVCBoRNGuE1f0LiKFxy6FHqC-DHuW6j61R-Ybsa_-rTNeni4raqsdhXSgOltLjbGAOAGRy2l1adletBBWqrS7TjuEmhzI8bVq0Y5cXunsgYJZ3QsQZJR4GsRzmEkxELzD8vGBDxmAdaRDSDqqY6EmzH9g93mbZBHi7lR2Gab7bd5MyDVakbafGBIzq8rUWtVdl22XvFQ_D1PH6L4HJwQf6Nc0CsUMF6INqf4D_U9mLHNWlzw",
    industry: "tech",
    experienceLevel: "mid",
    tags: ["Modern", "ATS Friendly"],
    features: ["Two-column density", "Sidebar skill highlights", "Engineered for 99% ATS parse rate"]
  },
  {
    id: "director",
    title: "The Director",
    description: "Classic, authoritative single-column design. Highlights extensive work history and leadership achievements.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzaNtAeAhCwW8wtprxRRQX7Zz7CAzBVgxCmXrVVDmBgHzc-H9kV6-STTswwWQKQOh9POWVAj0nKJ5nI1ByyYyK84FTNAShLtoBtia9ub0-kmiQKkX0a0fJ6YokbEzbZL3LPNfU8hoOSPsIH0A17hunGUn2qHlQhY1ig-xuAk1LFcPr7Ak4HyOv7Rsq0-9bozdIyX37zUIw5jhYtIGaRd4R5iWh1IRNkL_Uk8nnoUur23iSfE11EDCa5A",
    industry: "finance",
    experienceLevel: "executive",
    tags: ["Executive", "Traditional"],
    features: ["Classic serif headers", "Chronological impact timeline", "Board & C-Suite proven"]
  },
  {
    id: "visionary",
    title: "The Visionary",
    description: "Stand out with subtle color accents and unique typography. Ideal for marketing and design professionals.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjeO_fR6yD_2zMIS2e3CPoRRcPGyH3kdEf-KS-MSCDYcqA0g5HAl8uGG7T8fvnB2mZmlRWIpJWdmZmtzK-obtv2bie22i1jHEW8v2BoH0uIcl7dP2wxeT6523yYAzx5WOTl0JiEFbAEhg4zYn9hjU8By3yQEk4-OF4PK2gws3NgnFIafZgrH_EDZmJ9NEwy5CFYNNwXPadFydM9P7L7kK3wTasc31i8DX1Gq0ZoNmDO-KnevHsqoi4qQ",
    industry: "creative",
    experienceLevel: "mid",
    tags: ["Creative", "Design"],
    features: ["Subtle pastel accents", "Portfolio links & case studies", "Typography-forward balance"]
  }
];

export const socialProofAvatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCanBRfjkszExbVV8qrW5t8gglIx_Xrr_un_NXS1_EHC-Nd3Vdu84xWoLJuprqXt7dckkVpDJhtrbe8FDCHU6ZJji5AMK1B6istqEWKgD--HnF23JYTdUprcNir88FOeGbN4HLTYHYPDdbFqIugrbtXlelwh1OVy8jNaRCt49w_6zY9RN7csLsceZxgHk2OPAPpTTLgiPsxFa__6EGMSlgn4VJdMoAOGJlsYWKEyZB6ij11F6FYCw1tow",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAu-76W5NICCov8Y6OscA_qRuLeABSFcP5rnyxsIVA2cD5AzUHhoyeMWmG7CMHH2p_fQNCGfGtcmlkNtmujUB_3GIHr1hQ-osWyFhNXGnvyKrlx6wx2j1K_cpLsFKHB4obrEowWiuA6IKKw-cgG6V12B6GiYsg_lXWbhpFPLfHOxxNytYvLgrVwOG5VOY_jNJHZdur1KuIoIMzYqZxvcI6Evnzbo-DUP_A_yI46h1IkUZsrza6raZju6A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBtp_v_f6RX3tmSF1vkfnmitC8BidNo8ibD336H-BbAYRxJAvC-hEM0u2EoMcO6NOymPALXbcV9fp4XAzgvfMzgvPxXu6-AURsNDZmhhKew3EtAfI4sZuttEt3My-hq0HipJkPrt1fQKX5GWHUKEnjx_ftXv0280aHxiawweIsp6HP-W1uyMp-R97F-0dCOhvmMyaYN4bopfyIenc9KxnE0gMKDwBpYwZrRpAy-MGDzOlQksw20YtOddA"
];
