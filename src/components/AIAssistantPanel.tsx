import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Layers,
  Globe,
  Tag,
  Edit3,
  Calendar,
  DollarSign,
  UserCheck,
  GraduationCap,
  Briefcase,
  ListOrdered,
  Link2,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Plus,
  Compass,
} from 'lucide-react';
import {
  AIPostType,
  ApprovedOfficialInformation,
  AIDraftResponse,
  AIOutlineResponse,
  AISEOResponse,
  AIFaqResponse,
  AIContentAuditResponse,
  AIImproveResponse,
  AIArticleFacts,
} from '../types/ai';
import {
  checkAIServiceStatus,
  extractOfficialInformation,
  generateFromApprovedFacts,
  generateAIDraft,
  generateAIOutline,
  generateAISEO,
  generateAIFAQs,
  improveAIContent,
  auditAIFacts,
} from '../lib/aiAssistantService';

interface AIAssistantPanelProps {
  currentTitle: string;
  currentContent: string;
  currentCategory: string;
  currentState: string;
  onApplyTitleAndMeta: (meta: {
    title?: string;
    slug?: string;
    excerpt?: string;
    metaDescription?: string;
    keywords?: string;
    officialSourceUrl?: string;
  }) => void;
  onApplyContent: (htmlContent: string, mode: 'replace' | 'append') => void;
  onApplyFaqs: (faqs: { question: string; answer: string }[]) => void;
  onApplyLinks: (links: { label: string; url: string }[]) => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  currentTitle,
  currentContent,
  currentCategory,
  currentState,
  onApplyTitleAndMeta,
  onApplyContent,
  onApplyFaqs,
  onApplyLinks,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Top-level workflow tabs
  const [mainTab, setMainTab] = useState<'general' | 'official'>('official');

  // Sub-tab for General AI Assistant
  const [generalSubTab, setGeneralSubTab] = useState<
    'draft' | 'outline' | 'seo' | 'faqs' | 'improve' | 'audit'
  >('draft');

  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // =========================================================================
  // WORKFLOW 2: OFFICIAL INFORMATION -> EXTRACT -> REVIEW -> APPROVED -> ARTICLE
  // =========================================================================
  const [workflowStage, setWorkflowStage] = useState<'input' | 'review' | 'article'>('input');

  // Stage 1 Inputs
  const [rawInput, setRawInput] = useState({
    postType: 'recruitment' as AIPostType,
    officialSourceUrl: '',
    officialNotificationTitle: currentTitle || '',
    rawOfficialInformation: '',
  });

  // Stage 2: Extracted & Editable Facts (Will become APPROVED facts)
  const [editableFacts, setEditableFacts] = useState<ApprovedOfficialInformation>({
    postType: 'recruitment',
    officialSourceUrl: '',
    officialNotificationTitle: '',
    rawOfficialInformation: '',
    basic: {
      organization: '',
      notificationName: '',
      postName: '',
      advertisementNumber: '',
      totalVacancies: '',
      postWiseVacancies: '',
    },
    dates: {
      notificationDate: '',
      applicationStartDate: '',
      applicationLastDate: '',
      feePaymentLastDate: '',
      correctionWindow: '',
      examDate: '',
      admitCardDate: '',
      resultDate: '',
    },
    fee: {
      general: '',
      obcEws: '',
      scSt: '',
      female: '',
      pwd: '',
      other: '',
      paymentMode: '',
    },
    age: {
      minimumAge: '',
      maximumAge: '',
      cutOffDate: '',
      ageRelaxation: '',
    },
    eligibility: {
      educationalQualification: '',
      experience: '',
      nationality: '',
      otherConditions: '',
    },
    recruitment: {
      selectionProcess: '',
      examPattern: '',
      physicalEligibility: '',
      salaryPayScale: '',
    },
    application: {
      howToApply: '',
      requiredDocuments: '',
      importantInstructions: '',
    },
    links: {
      applyOnline: '',
      officialNotification: '',
      officialWebsite: '',
      otherOfficialLinks: '',
    },
    languageTone: 'professional_en_hi',
  });

  // Stage 3: Generated Draft from Approved Facts
  const [generatedDraft, setGeneratedDraft] = useState<AIDraftResponse | null>(null);
  const [officialPreviewTab, setOfficialPreviewTab] = useState<'visual' | 'html'>('visual');

  // =========================================================================
  // WORKFLOW 1: GENERAL AI ASSISTANT STATES
  // =========================================================================
  const [quickFacts, setQuickFacts] = useState<AIArticleFacts>({
    postType: 'recruitment',
    organization: '',
    postName: currentTitle || '',
    totalVacancies: '',
    officialWebsite: '',
    state: currentState || '',
    rawNotesOrNotificationText: '',
    languageStyle: 'english',
  });

  const [generalDraftResult, setGeneralDraftResult] = useState<AIDraftResponse | null>(null);
  const [generalPreviewTab, setGeneralPreviewTab] = useState<'visual' | 'html'>('visual');

  const [outlineResult, setOutlineResult] = useState<AIOutlineResponse | null>(null);
  const [seoResult, setSeoResult] = useState<AISEOResponse | null>(null);
  const [faqsResult, setFaqsResult] = useState<AIFaqResponse | null>(null);
  const [improveResult, setImproveResult] = useState<AIImproveResponse | null>(null);
  const [improveInstruction, setImproveInstruction] = useState('');
  const [auditResult, setAuditResult] = useState<AIContentAuditResponse | null>(null);

  // Status & Feedback
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Initialize & check server AI status
  useEffect(() => {
    checkAIServiceStatus().then((st) => setIsConfigured(st.configured));
  }, []);

  // Sync category mapping to postType
  useEffect(() => {
    if (currentCategory) {
      const lower = currentCategory.toLowerCase();
      let pt: AIPostType = 'recruitment';
      if (lower.includes('admit') || lower.includes('hall')) pt = 'admit_card';
      else if (lower.includes('result') || lower.includes('merit')) pt = 'result';
      else if (lower.includes('answer') || lower.includes('key')) pt = 'answer_key';
      else if (lower.includes('yojana') || lower.includes('scheme')) pt = 'yojana';
      else if (lower.includes('admission') || lower.includes('exam')) pt = 'exam_admission';
      else if (lower.includes('news') || lower.includes('policy')) pt = 'govt_news';

      setRawInput((prev) => ({ ...prev, postType: pt }));
      setEditableFacts((prev) => ({ ...prev, postType: pt }));
      setQuickFacts((prev) => ({ ...prev, postType: pt }));
    }
  }, [currentCategory]);

  // Sync title if changed
  useEffect(() => {
    if (currentTitle && !rawInput.officialNotificationTitle) {
      setRawInput((prev) => ({ ...prev, officialNotificationTitle: currentTitle }));
      setQuickFacts((prev) => ({ ...prev, postName: currentTitle }));
    }
  }, [currentTitle]);

  // =========================================================================
  // OFFICIAL WORKFLOW HANDLERS
  // =========================================================================
  const handleExtractInformation = async () => {
    if (!rawInput.rawOfficialInformation.trim() && !rawInput.officialNotificationTitle.trim()) {
      setErrorMessage('Please enter the Official Notification Title or paste the Raw Official Information text.');
      return;
    }

    setErrorMessage(null);
    setLoadingAction('extract');
    setStatusMessage('Extracting verified facts from provided official information...');

    try {
      const res = await extractOfficialInformation({
        postType: rawInput.postType,
        officialSourceUrl: rawInput.officialSourceUrl,
        officialNotificationTitle: rawInput.officialNotificationTitle,
        rawOfficialInformation: rawInput.rawOfficialInformation,
      });

      setEditableFacts(res.extractedData);
      setWorkflowStage('review');
      setStatusMessage(`Extracted ${res.metadata.extractedFieldsCount} fields. Review information before generating the article.`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to extract official information. Please check your text.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateFromApprovedFacts = async () => {
    setErrorMessage(null);
    setLoadingAction('generate_approved');
    setStatusMessage('Generating authoritative article based EXCLUSIVELY on approved factual information...');

    try {
      const draft = await generateFromApprovedFacts({
        approvedInfo: editableFacts,
      });

      setGeneratedDraft(draft);
      setWorkflowStage('article');
      setStatusMessage('Article draft generated strictly from approved facts! Ready for editorial review.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to generate article from approved facts.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Status helper badge for field extraction state
  const getFieldStatus = (val?: string) => {
    if (val && val.trim()) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
          <CheckSquare className="h-3 w-3" /> Extracted from provided information
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
        — Not found in provided information
      </span>
    );
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // =========================================================================
  // GENERAL AI WORKFLOW HANDLERS
  // =========================================================================
  const handleGenerateGeneralDraft = async () => {
    setErrorMessage(null);
    setLoadingAction('general_draft');
    setStatusMessage('Generating structured draft with SEO, FAQs, and important links...');

    try {
      const res = await generateAIDraft(quickFacts);
      setGeneralDraftResult(res);
      setStatusMessage('Draft ready! You can review and choose which sections to apply.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Draft generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateOutline = async () => {
    setErrorMessage(null);
    setLoadingAction('general_outline');
    setStatusMessage('Generating structured article outline...');

    try {
      const res = await generateAIOutline(quickFacts);
      setOutlineResult(res);
      setStatusMessage('Outline generated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Outline generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateSEO = async () => {
    setErrorMessage(null);
    setLoadingAction('general_seo');
    setStatusMessage('Generating high-CTR title, slug, meta description, and keywords...');

    try {
      const res = await generateAISEO({
        title: quickFacts.postName || currentTitle,
        content: currentContent,
        postType: quickFacts.postType,
        organization: quickFacts.organization,
      });
      setSeoResult(res);
      setStatusMessage('SEO metadata generated!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'SEO generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateFAQs = async () => {
    setErrorMessage(null);
    setLoadingAction('general_faqs');
    setStatusMessage('Generating candidate FAQs based on verified article details...');

    try {
      const res = await generateAIFAQs({
        title: currentTitle || quickFacts.postName,
        content: currentContent,
        postType: quickFacts.postType,
      });
      setFaqsResult(res);
      setStatusMessage('Candidate FAQs generated!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'FAQ generation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleImproveContent = async (customInstruction?: string) => {
    if (!currentContent.trim()) {
      setErrorMessage('Editor content is empty. Write or paste article content first.');
      return;
    }

    setErrorMessage(null);
    setLoadingAction('general_improve');
    setStatusMessage('Polishing content, formatting tables, and enhancing clarity...');

    try {
      const res = await improveAIContent({
        htmlContent: currentContent,
        instruction: customInstruction || improveInstruction,
      });
      setImproveResult(res);
      setStatusMessage(res.summaryOfChanges || 'Content polished successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Content enhancement failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAuditFacts = async () => {
    if (!currentContent.trim()) {
      setErrorMessage('Editor content is empty. Write or paste article content first.');
      return;
    }

    setErrorMessage(null);
    setLoadingAction('general_audit');
    setStatusMessage('Auditing fact completeness and editorial structure...');

    try {
      const res = await auditAIFacts({
        title: currentTitle || quickFacts.postName,
        htmlContent: currentContent,
        postType: quickFacts.postType,
      });
      setAuditResult(res);
      setStatusMessage('Completeness audit complete!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Audit failed');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/40 shadow-sm overflow-hidden transition-all duration-200 mb-8">
      {/* Top Banner & Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white select-none hover:opacity-98 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-blue-950 shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                AI Article Assistant
              </h2>
              <span className="rounded-full bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-300">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Official Information Pipeline • Structured Drafts • SEO • FAQs • Content Polish • Fact Auditing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-blue-950/70 px-3 py-1 text-[11px] font-semibold text-slate-200 border border-blue-800/60">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Strict Anti-Hallucination</span>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Universal Notice */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-950">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold uppercase text-amber-900 block text-[11px]">
                🛡️ Verified Editorial Policy:
              </strong>
              <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                AI organizes information from the text you provide. Missing details remain blank and are never fabricated. Always review facts against the official government source before publishing.
              </p>
            </div>
          </div>

          {/* Top-Level Primary Workflow Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setMainTab('official')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase transition-all shadow-xs ${
                mainTab === 'official'
                  ? 'bg-blue-900 text-amber-300 ring-2 ring-blue-900 ring-offset-1'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>1. Create from Official Information</span>
              <span className="rounded-md bg-amber-400 text-blue-950 px-1.5 py-0.5 text-[9px] font-black">
                Recommended
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMainTab('general')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase transition-all shadow-xs ${
                mainTab === 'general'
                  ? 'bg-blue-900 text-amber-300 ring-2 ring-blue-900 ring-offset-1'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Wand2 className="h-4 w-4" />
              <span>2. General AI Assistant & Tools</span>
            </button>
          </div>

          {/* =========================================================================
              WORKFLOW 2: CREATE FROM OFFICIAL INFORMATION (3-STEP STAGED REVIEW)
             ========================================================================= */}
          {mainTab === 'official' && (
            <div className="space-y-6">
              {/* Stepper Indicator */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWorkflowStage('input')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    workflowStage === 'input'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[10px] text-white">
                    1
                  </span>
                  <span>Enter Official Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkflowStage('review')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    workflowStage === 'review'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[10px] text-white">
                    2
                  </span>
                  <span>Review & Approve Facts</span>
                </button>

                <button
                  type="button"
                  onClick={() => generatedDraft && setWorkflowStage('article')}
                  disabled={!generatedDraft}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 ${
                    workflowStage === 'article'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[10px] text-white">
                    3
                  </span>
                  <span>Approved Draft & Apply</span>
                </button>
              </div>

              {/* STAGE 1: INPUT OFFICIAL INFORMATION */}
              {workflowStage === 'input' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Step 1: Provide Raw Official Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Paste official notification text, press releases, or recruitment bulletin excerpt.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Post Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={rawInput.postType}
                        onChange={(e) =>
                          setRawInput({ ...rawInput, postType: e.target.value as AIPostType })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      >
                        <option value="recruitment">1. Recruitment / Job Vacancy</option>
                        <option value="admit_card">2. Admit Card / Hall Ticket</option>
                        <option value="result">3. Result / Merit List</option>
                        <option value="answer_key">4. Answer Key & Objections</option>
                        <option value="yojana">5. Sarkari Yojana / Schemes</option>
                        <option value="exam_admission">6. Exam / Admission</option>
                        <option value="govt_news">7. Government News & Policy Updates</option>
                        <option value="general_sarkari">8. General Sarkari Information</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Official Source URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={rawInput.officialSourceUrl}
                        onChange={(e) =>
                          setRawInput({ ...rawInput, officialSourceUrl: e.target.value })
                        }
                        placeholder="https://ssc.gov.in/notices/..."
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Official Notification Title
                      </label>
                      <input
                        type="text"
                        value={rawInput.officialNotificationTitle}
                        onChange={(e) =>
                          setRawInput({ ...rawInput, officialNotificationTitle: e.target.value })
                        }
                        placeholder="e.g. SSC Constable GD Recruitment 2026"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                      <span>Raw Official Information / PDF Notification Text <span className="text-red-600">*</span></span>
                      <span className="text-slate-400 font-normal text-[10px]">
                        Paste raw text from official PDF bulletin or press release
                      </span>
                    </label>
                    <textarea
                      rows={8}
                      value={rawInput.rawOfficialInformation}
                      onChange={(e) =>
                        setRawInput({ ...rawInput, rawOfficialInformation: e.target.value })
                      }
                      placeholder="Paste notification text here (Dates, Vacancies, Age Limits, Educational Criteria, Application Fees, Selection Process, Official URLs, etc.)..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:outline-hidden font-mono bg-slate-50/50"
                    />
                  </div>

                  {/* Extract Button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      The AI will extract only facts explicitly present in the text above. Missing details will remain empty.
                    </span>

                    <button
                      type="button"
                      onClick={handleExtractInformation}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'extract' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Extracting Facts...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 text-amber-400" />
                          <span>Extract & Organize Information</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: REVIEW EXTRACTED INFORMATION (EDITABLE SCREEN) */}
              {workflowStage === 'review' && (
                <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                          Step 2: Review Extracted Information
                        </h3>
                        <span className="rounded-full bg-blue-100 text-blue-900 px-2 py-0.5 text-[10px] font-bold">
                          Editable Facts Screen
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Review, edit, add, or delete facts. Only reviewed information will be used to generate the article.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWorkflowStage('input')}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Input</span>
                    </button>
                  </div>

                  {/* 1. Basic Information */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <Briefcase className="h-4 w-4 text-blue-800" />
                        <span>Basic Information</span>
                      </div>
                      {getFieldStatus(editableFacts.basic?.postName)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Organization / Board
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.organization || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, organization: e.target.value },
                            })
                          }
                          placeholder="e.g. Staff Selection Commission (SSC)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Notification Name
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.notificationName || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, notificationName: e.target.value },
                            })
                          }
                          placeholder="e.g. Constable (GD) Examination, 2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Post Name / Scheme Name
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.postName || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, postName: e.target.value },
                            })
                          }
                          placeholder="e.g. Constable GD"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Advertisement / Notification Number
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.advertisementNumber || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, advertisementNumber: e.target.value },
                            })
                          }
                          placeholder="e.g. F.No. 3/1/2026-P&P-I"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Total Vacancies
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.totalVacancies || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, totalVacancies: e.target.value },
                            })
                          }
                          placeholder="e.g. 26,146 Posts"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Post-Wise Breakdown
                        </label>
                        <input
                          type="text"
                          value={editableFacts.basic?.postWiseVacancies || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              basic: { ...editableFacts.basic, postWiseVacancies: e.target.value },
                            })
                          }
                          placeholder="e.g. BSF: 6174, CISF: 11025, CRPF: 3337"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Important Dates */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <Calendar className="h-4 w-4 text-indigo-700" />
                        <span>Important Dates</span>
                      </div>
                      {getFieldStatus(editableFacts.dates?.applicationLastDate || editableFacts.dates?.applicationStartDate)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Notification Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.notificationDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, notificationDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 24-01-2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Application Start Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.applicationStartDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, applicationStartDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 24-01-2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Application Last Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.applicationLastDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, applicationLastDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 28-02-2026 (11:00 PM)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Fee Payment Last Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.feePaymentLastDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, feePaymentLastDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 01-03-2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Correction Window Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.correctionWindow || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, correctionWindow: e.target.value },
                            })
                          }
                          placeholder="e.g. 04 to 06 March 2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Exam Date / Schedule
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.examDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, examDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 20 February to 12 March 2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Admit Card Release Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.admitCardDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, admitCardDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 4 days before exam"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Result Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.dates?.resultDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              dates: { ...editableFacts.dates, resultDate: e.target.value },
                            })
                          }
                          placeholder="e.g. May 2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Application Fee */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <DollarSign className="h-4 w-4 text-emerald-700" />
                        <span>Application Fee</span>
                      </div>
                      {getFieldStatus(editableFacts.fee?.general || editableFacts.fee?.scSt)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          General / UR Fee
                        </label>
                        <input
                          type="text"
                          value={editableFacts.fee?.general || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              fee: { ...editableFacts.fee, general: e.target.value },
                            })
                          }
                          placeholder="e.g. ₹100/-"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          OBC / EWS Fee
                        </label>
                        <input
                          type="text"
                          value={editableFacts.fee?.obcEws || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              fee: { ...editableFacts.fee, obcEws: e.target.value },
                            })
                          }
                          placeholder="e.g. ₹100/-"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          SC / ST / PwD Fee
                        </label>
                        <input
                          type="text"
                          value={editableFacts.fee?.scSt || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              fee: { ...editableFacts.fee, scSt: e.target.value },
                            })
                          }
                          placeholder="e.g. ₹0/- (Exempted)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Payment Mode
                        </label>
                        <input
                          type="text"
                          value={editableFacts.fee?.paymentMode || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              fee: { ...editableFacts.fee, paymentMode: e.target.value },
                            })
                          }
                          placeholder="e.g. Online (UPI / Net Banking / Debit Card)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Age Limit & Eligibility */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <GraduationCap className="h-4 w-4 text-purple-700" />
                        <span>Age Limit & Eligibility Qualifications</span>
                      </div>
                      {getFieldStatus(editableFacts.eligibility?.educationalQualification)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Minimum Age
                        </label>
                        <input
                          type="text"
                          value={editableFacts.age?.minimumAge || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              age: { ...editableFacts.age, minimumAge: e.target.value },
                            })
                          }
                          placeholder="e.g. 18 Years"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Maximum Age
                        </label>
                        <input
                          type="text"
                          value={editableFacts.age?.maximumAge || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              age: { ...editableFacts.age, maximumAge: e.target.value },
                            })
                          }
                          placeholder="e.g. 23 Years"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Age Cut-Off Date
                        </label>
                        <input
                          type="text"
                          value={editableFacts.age?.cutOffDate || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              age: { ...editableFacts.age, cutOffDate: e.target.value },
                            })
                          }
                          placeholder="e.g. 01-01-2026"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Age Relaxation
                        </label>
                        <input
                          type="text"
                          value={editableFacts.age?.ageRelaxation || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              age: { ...editableFacts.age, ageRelaxation: e.target.value },
                            })
                          }
                          placeholder="e.g. SC/ST: 5 Yrs, OBC: 3 Yrs"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Educational Qualification
                        </label>
                        <textarea
                          rows={2}
                          value={editableFacts.eligibility?.educationalQualification || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              eligibility: {
                                ...editableFacts.eligibility,
                                educationalQualification: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. 10th Class / Matriculation Examination passed from a recognized Board/University."
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Experience / Other Conditions
                        </label>
                        <textarea
                          rows={2}
                          value={editableFacts.eligibility?.otherConditions || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              eligibility: {
                                ...editableFacts.eligibility,
                                otherConditions: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. NCC Certificate holders get bonus marks."
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Recruitment & Selection */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <UserCheck className="h-4 w-4 text-amber-700" />
                        <span>Selection Process & Salary</span>
                      </div>
                      {getFieldStatus(editableFacts.recruitment?.salaryPayScale)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Selection Process Stages
                        </label>
                        <input
                          type="text"
                          value={editableFacts.recruitment?.selectionProcess || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              recruitment: {
                                ...editableFacts.recruitment,
                                selectionProcess: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. Computer Based Examination (CBE), PST/PET, Medical Exam (DME/RME)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Salary / Pay Scale
                        </label>
                        <input
                          type="text"
                          value={editableFacts.recruitment?.salaryPayScale || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              recruitment: {
                                ...editableFacts.recruitment,
                                salaryPayScale: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. Pay Level-3 (₹21,700 - ₹69,100)"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Important Links */}
                  <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-950">
                        <Link2 className="h-4 w-4 text-blue-700" />
                        <span>Official Links</span>
                      </div>
                      {getFieldStatus(editableFacts.links?.officialWebsite || editableFacts.links?.applyOnline)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Apply Online URL
                        </label>
                        <input
                          type="url"
                          value={editableFacts.links?.applyOnline || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              links: { ...editableFacts.links, applyOnline: e.target.value },
                            })
                          }
                          placeholder="https://..."
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Official Notification PDF URL
                        </label>
                        <input
                          type="url"
                          value={editableFacts.links?.officialNotification || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              links: { ...editableFacts.links, officialNotification: e.target.value },
                            })
                          }
                          placeholder="https://..."
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-800 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Official Department Website
                        </label>
                        <input
                          type="url"
                          value={editableFacts.links?.officialWebsite || ''}
                          onChange={(e) =>
                            setEditableFacts({
                              ...editableFacts,
                              links: { ...editableFacts.links, officialWebsite: e.target.value },
                            })
                          }
                          placeholder="https://ssc.gov.in"
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-mono text-slate-800 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tone Preference & Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                        Language Tone:
                      </label>
                      <select
                        value={editableFacts.languageTone}
                        onChange={(e: any) =>
                          setEditableFacts({ ...editableFacts, languageTone: e.target.value })
                        }
                        className="rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-800 font-bold focus:outline-hidden"
                      >
                        <option value="professional_en_hi">Professional Hindi-English</option>
                        <option value="simple_hinglish">Simple Hinglish</option>
                        <option value="formal_govt">Formal Government Information</option>
                        <option value="clear_beginner">Clear & Beginner Friendly</option>
                        <option value="concise">Concise</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateFromApprovedFacts}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-7 py-3 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50 w-full sm:w-auto"
                    >
                      {loadingAction === 'generate_approved' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Generating from Approved Facts...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span>Continue to Article (Approved Facts)</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: APPROVED DRAFT PREVIEW & SELECTIVE APPLY */}
              {workflowStage === 'article' && generatedDraft && (
                <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                          Step 3: Approved Factual Draft Preview
                        </h3>
                        <span className="rounded-full bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-black uppercase">
                          Ready for Review
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Generated strictly from approved facts. Review and choose what to apply to the post editor.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWorkflowStage('review')}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Back to Edit Information</span>
                    </button>
                  </div>

                  {/* Selective Application Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyTitleAndMeta({
                          title: generatedDraft.title,
                          slug: generatedDraft.slug,
                          excerpt: generatedDraft.excerpt,
                          metaDescription: generatedDraft.metaDescription,
                          keywords: generatedDraft.keywords?.join(', '),
                          officialSourceUrl: editableFacts.officialSourceUrl || editableFacts.links?.officialWebsite,
                        });
                        onApplyContent(generatedDraft.htmlContent, 'replace');
                        if (generatedDraft.faqs?.length) onApplyFaqs(generatedDraft.faqs);
                        if (generatedDraft.importantLinks?.length) onApplyLinks(generatedDraft.importantLinks);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-black uppercase text-amber-300 hover:bg-blue-950 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Apply All to Editor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onApplyContent(generatedDraft.htmlContent, 'replace')}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-700" />
                      <span>Apply Article Only</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onApplyTitleAndMeta({
                          title: generatedDraft.title,
                          slug: generatedDraft.slug,
                          excerpt: generatedDraft.excerpt,
                          metaDescription: generatedDraft.metaDescription,
                          keywords: generatedDraft.keywords?.join(', '),
                        })
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Apply SEO Only</span>
                    </button>

                    {generatedDraft.faqs?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onApplyFaqs(generatedDraft.faqs)}
                        className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-purple-700" />
                        <span>Apply FAQs Only ({generatedDraft.faqs.length})</span>
                      </button>
                    )}

                    {generatedDraft.importantLinks?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onApplyLinks(generatedDraft.importantLinks);
                          if (editableFacts.officialSourceUrl || editableFacts.links?.officialWebsite) {
                            onApplyTitleAndMeta({
                              officialSourceUrl: editableFacts.officialSourceUrl || editableFacts.links?.officialWebsite,
                            });
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <Link2 className="h-3.5 w-3.5 text-amber-700" />
                        <span>Apply Links Only ({generatedDraft.importantLinks.length})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(generatedDraft.htmlContent)}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors ml-auto"
                    >
                      {copiedSuccess ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy HTML</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SEO Metadata Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-800 border-b border-slate-200 pb-1.5">
                      <Globe className="h-4 w-4 text-blue-900" />
                      <span>Approved SEO Metadata</span>
                    </div>

                    <div>
                      <strong className="text-slate-600 block text-[10px] uppercase">Title:</strong>
                      <span className="font-bold text-slate-900">{generatedDraft.title}</span>
                    </div>

                    <div>
                      <strong className="text-slate-600 block text-[10px] uppercase">Meta Description:</strong>
                      <span className="text-slate-700">{generatedDraft.metaDescription}</span>
                    </div>

                    {generatedDraft.keywords?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <strong className="text-slate-600 text-[10px] uppercase mr-1">Keywords:</strong>
                        {generatedDraft.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live HTML Content Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-800">
                        Article Content Preview
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setOfficialPreviewTab('visual')}
                          className={`px-2.5 py-1 rounded font-bold ${
                            officialPreviewTab === 'visual'
                              ? 'bg-white text-blue-950 shadow-xs'
                              : 'text-slate-600'
                          }`}
                        >
                          Visual Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setOfficialPreviewTab('html')}
                          className={`px-2.5 py-1 rounded font-bold ${
                            officialPreviewTab === 'html'
                              ? 'bg-white text-blue-950 shadow-xs'
                              : 'text-slate-600'
                          }`}
                        >
                          Raw HTML
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 p-4 bg-white shadow-inner">
                      {officialPreviewTab === 'visual' ? (
                        <div
                          className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-4"
                          dangerouslySetInnerHTML={{ __html: generatedDraft.htmlContent }}
                        />
                      ) : (
                        <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap">
                          {generatedDraft.htmlContent}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              WORKFLOW 1: GENERAL AI ASSISTANT & TOOLS
             ========================================================================= */}
          {mainTab === 'general' && (
            <div className="space-y-5">
              {/* General Sub-Navigation Bar */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setGeneralSubTab('draft')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'draft'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5 text-blue-800" />
                  <span>1. Draft Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneralSubTab('outline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'outline'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-indigo-700" />
                  <span>2. Generate Outline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneralSubTab('seo')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'seo'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-700" />
                  <span>3. Generate SEO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneralSubTab('faqs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'faqs'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5 text-purple-700" />
                  <span>4. Generate FAQs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneralSubTab('improve')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'improve'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5 text-amber-700" />
                  <span>5. Improve Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneralSubTab('audit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    generalSubTab === 'audit'
                      ? 'bg-white text-blue-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" />
                  <span>6. Fact Audit</span>
                </button>
              </div>

              {/* 1. STRUCTURED DRAFT GENERATOR */}
              {generalSubTab === 'draft' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Structured Draft Generator
                      </h3>
                      <p className="text-xs text-slate-500">
                        Quickly create a complete, well-structured Sarkari article from basic notes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Post Type
                      </label>
                      <select
                        value={quickFacts.postType}
                        onChange={(e) =>
                          setQuickFacts({ ...quickFacts, postType: e.target.value as AIPostType })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      >
                        <option value="recruitment">Recruitment / Job Vacancy</option>
                        <option value="admit_card">Admit Card / Hall Ticket</option>
                        <option value="result">Result / Merit List</option>
                        <option value="answer_key">Answer Key & Objection</option>
                        <option value="yojana">Sarkari Yojana / Scheme</option>
                        <option value="exam_admission">Admission / Entrance</option>
                        <option value="govt_news">Government News & Policy</option>
                        <option value="general_sarkari">General Sarkari Info</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Organization / Department
                      </label>
                      <input
                        type="text"
                        value={quickFacts.organization}
                        onChange={(e) => setQuickFacts({ ...quickFacts, organization: e.target.value })}
                        placeholder="e.g. Staff Selection Commission (SSC)"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Post / Scheme Name
                      </label>
                      <input
                        type="text"
                        value={quickFacts.postName}
                        onChange={(e) => setQuickFacts({ ...quickFacts, postName: e.target.value })}
                        placeholder="e.g. Constable GD 2026 / Sub Inspector"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                      Key Facts, Dates & Bullet Points
                    </label>
                    <textarea
                      rows={5}
                      value={quickFacts.rawNotesOrNotificationText}
                      onChange={(e) =>
                        setQuickFacts({ ...quickFacts, rawNotesOrNotificationText: e.target.value })
                      }
                      placeholder="Enter key dates, fees, eligibility, vacancies, and application details..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Generates complete HTML article with SEO, FAQs, and links.
                    </span>

                    <button
                      type="button"
                      onClick={handleGenerateGeneralDraft}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'general_draft' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Generating Draft...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span>Generate Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* General Draft Result View */}
                  {generalDraftResult && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyTitleAndMeta({
                              title: generalDraftResult.title,
                              slug: generalDraftResult.slug,
                              excerpt: generalDraftResult.excerpt,
                              metaDescription: generalDraftResult.metaDescription,
                              keywords: generalDraftResult.keywords?.join(', '),
                            });
                            onApplyContent(generalDraftResult.htmlContent, 'replace');
                            if (generalDraftResult.faqs?.length) onApplyFaqs(generalDraftResult.faqs);
                            if (generalDraftResult.importantLinks?.length) onApplyLinks(generalDraftResult.importantLinks);
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-black uppercase text-amber-300 hover:bg-blue-950 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Apply All</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onApplyContent(generalDraftResult.htmlContent, 'replace')}
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-blue-700" />
                          <span>Replace Content</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onApplyContent(generalDraftResult.htmlContent, 'append')}
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5 text-indigo-700" />
                          <span>Append Content</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onApplyTitleAndMeta({
                              title: generalDraftResult.title,
                              slug: generalDraftResult.slug,
                              excerpt: generalDraftResult.excerpt,
                              metaDescription: generalDraftResult.metaDescription,
                              keywords: generalDraftResult.keywords?.join(', '),
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Apply SEO</span>
                        </button>

                        {generalDraftResult.faqs?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onApplyFaqs(generalDraftResult.faqs)}
                            className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-purple-700" />
                            <span>Apply FAQs</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(generalDraftResult.htmlContent)}
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors ml-auto"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy HTML</span>
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 p-4 bg-white shadow-inner">
                        <div
                          className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-4"
                          dangerouslySetInnerHTML={{ __html: generalDraftResult.htmlContent }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. GENERATE OUTLINE */}
              {generalSubTab === 'outline' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Generate Article Outline
                      </h3>
                      <p className="text-xs text-slate-500">
                        Create an editorial structure with recommended H2/H3 headings and wireframe layout.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Post Name / Title
                      </label>
                      <input
                        type="text"
                        value={quickFacts.postName}
                        onChange={(e) => setQuickFacts({ ...quickFacts, postName: e.target.value })}
                        placeholder="e.g. UPSC Civil Services Exam 2026"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={quickFacts.organization}
                        onChange={(e) => setQuickFacts({ ...quickFacts, organization: e.target.value })}
                        placeholder="e.g. Union Public Service Commission"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateOutline}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'general_outline' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Generating Outline...</span>
                        </>
                      ) : (
                        <>
                          <Layers className="h-4 w-4 text-amber-400" />
                          <span>Generate Outline</span>
                        </>
                      )}
                    </button>
                  </div>

                  {outlineResult && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800">
                          Recommended Headings:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onApplyContent(outlineResult.recommendedStructure, 'append')}
                            className="flex items-center gap-1 rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-blue-950"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Append Outline Wireframe to Content</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <ul className="list-disc list-inside text-xs text-slate-800 space-y-1 font-semibold">
                          {outlineResult.headings.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                          <p>{outlineResult.outlineText}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. GENERATE SEO SUGGESTIONS */}
              {generalSubTab === 'seo' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Generate SEO Suggestions
                      </h3>
                      <p className="text-xs text-slate-500">
                        Generates a high-CTR Title, SEO Slug, Meta Description, and Search Keywords.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Article Title / Topic
                      </label>
                      <input
                        type="text"
                        value={quickFacts.postName || currentTitle}
                        onChange={(e) => setQuickFacts({ ...quickFacts, postName: e.target.value })}
                        placeholder="e.g. SSC GD Constable Recruitment 2026"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={quickFacts.organization}
                        onChange={(e) => setQuickFacts({ ...quickFacts, organization: e.target.value })}
                        placeholder="e.g. Staff Selection Commission"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateSEO}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'general_seo' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Generating SEO...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 text-amber-400" />
                          <span>Generate SEO</span>
                        </>
                      )}
                    </button>
                  </div>

                  {seoResult && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800">
                          Generated SEO Package:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onApplyTitleAndMeta({
                              title: seoResult.title,
                              slug: seoResult.slug,
                              excerpt: seoResult.excerpt,
                              metaDescription: seoResult.metaDescription,
                              keywords: seoResult.keywords?.join(', '),
                            })
                          }
                          className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Apply SEO to Editor Fields</span>
                        </button>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div>
                          <strong className="text-slate-600 block text-[10px] uppercase">Title:</strong>
                          <span className="font-bold text-slate-900">{seoResult.title}</span>
                        </div>

                        <div>
                          <strong className="text-slate-600 block text-[10px] uppercase">Slug:</strong>
                          <span className="font-mono text-blue-900">{seoResult.slug}</span>
                        </div>

                        <div>
                          <strong className="text-slate-600 block text-[10px] uppercase">Excerpt:</strong>
                          <span className="text-slate-700">{seoResult.excerpt}</span>
                        </div>

                        <div>
                          <strong className="text-slate-600 block text-[10px] uppercase">Meta Description:</strong>
                          <span className="text-slate-700">{seoResult.metaDescription}</span>
                        </div>

                        {seoResult.keywords?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            <strong className="text-slate-600 text-[10px] uppercase mr-1">Keywords:</strong>
                            {seoResult.keywords.map((kw, i) => (
                              <span
                                key={i}
                                className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-semibold"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. GENERATE FAQS */}
              {generalSubTab === 'faqs' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Generate FAQs
                      </h3>
                      <p className="text-xs text-slate-500">
                        Create high-value candidate questions & answers backed by current article details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Scans the current article title and content to generate 4-6 factual FAQs.
                    </span>

                    <button
                      type="button"
                      onClick={handleGenerateFAQs}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'general_faqs' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Generating FAQs...</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="h-4 w-4 text-amber-400" />
                          <span>Generate FAQs</span>
                        </>
                      )}
                    </button>
                  </div>

                  {faqsResult && faqsResult.faqs?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800">
                          Generated FAQs ({faqsResult.faqs.length}):
                        </span>
                        <button
                          type="button"
                          onClick={() => onApplyFaqs(faqsResult.faqs)}
                          className="flex items-center gap-1 rounded-lg bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-800"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Apply FAQs to FAQ Builder</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {faqsResult.faqs.map((faq, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                            <div className="font-extrabold text-blue-950 mb-0.5">
                              Q: {faq.question}
                            </div>
                            <div className="text-slate-700">A: {faq.answer}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. IMPROVE / ENHANCE CONTENT */}
              {generalSubTab === 'improve' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Improve / Enhance Content
                      </h3>
                      <p className="text-xs text-slate-500">
                        Polishes existing content without changing any underlying facts or numbers.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                      Custom Polish Instruction (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={improveInstruction}
                        onChange={(e) => setImproveInstruction(e.target.value)}
                        placeholder="e.g. Fix grammar, make paragraphs punchy, or convert notes into responsive tables"
                        className="flex-1 rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-hidden bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleImproveContent()}
                        disabled={Boolean(loadingAction)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2.5 text-xs font-black uppercase text-amber-300 hover:bg-blue-950 disabled:opacity-50 shrink-0"
                      >
                        {loadingAction === 'general_improve' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="h-3.5 w-3.5" />
                        )}
                        <span>Run Polish</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleImproveContent(
                          'Format all tables into clean responsive Sarkari cards, add clear H2/H3 headings, fix grammar and make formatting pristine.'
                        )
                      }
                      disabled={Boolean(loadingAction)}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left text-xs font-bold text-slate-800 hover:border-blue-700 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-blue-900 mb-0.5">
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>Format & Polish Tables</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Converts plain tables into clean responsive cards.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleImproveContent(
                          'Add an exhaustive step-by-step How to Apply section with numbered points and document checklist.'
                        )
                      }
                      disabled={Boolean(loadingAction)}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left text-xs font-bold text-slate-800 hover:border-blue-700 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-indigo-900 mb-0.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Expand How-to-Apply Steps</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Adds step-by-step online registration procedure.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleImproveContent(
                          'Add strict statutory notice, disclaimer, and candidate warnings in a styled blockquote.'
                        )
                      }
                      disabled={Boolean(loadingAction)}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left text-xs font-bold text-slate-800 hover:border-blue-700 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-amber-800 mb-0.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Add Candidate Warnings</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Embeds official anti-fraud warnings and verification notice.
                      </p>
                    </button>
                  </div>

                  {improveResult && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-800">
                          {improveResult.summaryOfChanges || 'Improved Content Ready'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onApplyContent(improveResult.improvedHtml, 'replace')}
                            className="flex items-center gap-1 rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-blue-950"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Replace Content in Editor</span>
                          </button>
                        </div>
                      </div>

                      <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 p-4 bg-white shadow-inner">
                        <div
                          className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-3"
                          dangerouslySetInnerHTML={{ __html: improveResult.improvedHtml }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. FACT COMPLETENESS AUDIT */}
              {generalSubTab === 'audit' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                        Fact Completeness & Quality Audit
                      </h3>
                      <p className="text-xs text-slate-500">
                        Scans your article for missing information, unverified claims, and structural gaps.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Scans the editor content to ensure complete candidate guidance before publishing.
                    </span>

                    <button
                      type="button"
                      onClick={handleAuditFacts}
                      disabled={Boolean(loadingAction)}
                      className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-xs font-black uppercase text-amber-300 shadow-md hover:bg-blue-950 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loadingAction === 'general_audit' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          <span>Auditing Content...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 text-amber-400" />
                          <span>Run Fact Audit</span>
                        </>
                      )}
                    </button>
                  </div>

                  {auditResult && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-slate-700">
                          Completeness Score:
                        </span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            auditResult.completenessScore >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : auditResult.completenessScore >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {auditResult.completenessScore}% ({auditResult.status.toUpperCase()})
                        </span>
                      </div>

                      {auditResult.missingFacts.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> Missing Information:
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                            {auditResult.missingFacts.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {auditResult.hallucinationWarnings?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Items Requiring Official Source Confirmation:
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                            {auditResult.hallucinationWarnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {auditResult.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Editorial Recommendations:
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                            {auditResult.suggestions.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status & Error Messages */}
          {statusMessage && !errorMessage && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-900 font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
