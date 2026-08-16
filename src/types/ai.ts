export type AIPostType =
  | 'recruitment'
  | 'admit_card'
  | 'result'
  | 'answer_key'
  | 'yojana'
  | 'exam_admission'
  | 'govt_news'
  | 'general_sarkari';

// ==========================================
// OFFICIAL INFORMATION EXTRACTION STRUCTURE
// ==========================================

export interface OfficialInfoBasic {
  organization: string;
  notificationName: string;
  postName: string;
  advertisementNumber: string;
  totalVacancies: string;
  postWiseVacancies: string;
}

export interface OfficialInfoDates {
  notificationDate: string;
  applicationStartDate: string;
  applicationLastDate: string;
  feePaymentLastDate: string;
  correctionWindow: string;
  examDate: string;
  admitCardDate: string;
  resultDate: string;
}

export interface OfficialInfoFee {
  general: string;
  obcEws: string;
  scSt: string;
  female: string;
  pwd: string;
  other: string;
  paymentMode: string;
}

export interface OfficialInfoAge {
  minimumAge: string;
  maximumAge: string;
  cutOffDate: string;
  ageRelaxation: string;
}

export interface OfficialInfoEligibility {
  educationalQualification: string;
  experience: string;
  nationality: string;
  otherConditions: string;
}

export interface OfficialInfoRecruitment {
  selectionProcess: string;
  examPattern: string;
  physicalEligibility: string;
  salaryPayScale: string;
}

export interface OfficialInfoApplication {
  howToApply: string;
  requiredDocuments: string;
  importantInstructions: string;
}

export interface OfficialInfoLinks {
  applyOnline: string;
  officialNotification: string;
  officialWebsite: string;
  otherOfficialLinks: string;
}

export interface ApprovedOfficialInformation {
  postType: AIPostType;
  officialSourceUrl: string;
  officialNotificationTitle: string;
  rawOfficialInformation: string;
  basic: OfficialInfoBasic;
  dates: OfficialInfoDates;
  fee: OfficialInfoFee;
  age: OfficialInfoAge;
  eligibility: OfficialInfoEligibility;
  recruitment: OfficialInfoRecruitment;
  application: OfficialInfoApplication;
  links: OfficialInfoLinks;
  languageTone?: 'professional_en_hi' | 'simple_hinglish' | 'formal_govt' | 'clear_beginner' | 'concise' | 'detailed';
}

export interface ExtractionMetadata {
  extractedFieldsCount: number;
  missingFieldsCount: number;
  extractionNotice: string;
}

export interface ExtractOfficialInfoResponse {
  extractedData: ApprovedOfficialInformation;
  fieldFlags?: Record<string, 'extracted' | 'review_required' | 'not_found'>;
  metadata: ExtractionMetadata;
}

// ==========================================
// LEGACY / COMPATIBILITY INTERFACES
// ==========================================

export interface AIArticleFacts {
  postType: AIPostType;
  organization: string;
  postName: string;
  totalVacancies?: string;
  officialWebsite?: string;
  importantDates?: {
    startDate?: string;
    lastDate?: string;
    examDate?: string;
    resultDate?: string;
    admitCardDate?: string;
  };
  eligibilityQualification?: string;
  ageLimit?: string;
  applicationFee?: string;
  salaryPayScale?: string;
  selectionProcess?: string;
  state?: string;
  rawNotesOrNotificationText?: string;
  languageStyle?: 'english' | 'hinglish' | 'hindi';
}

export interface AIDraftResponse {
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  htmlContent: string;
  importantLinks: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
}

export interface AIOutlineResponse {
  headings: string[];
  outlineText: string;
  recommendedStructure: string;
}

export interface AISEOResponse {
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
}

export interface AIFaqResponse {
  faqs: { question: string; answer: string }[];
}

export interface AIContentAuditResponse {
  completenessScore: number; // 0 - 100
  status: 'excellent' | 'good' | 'needs_attention';
  missingFacts: string[];
  hallucinationWarnings: string[];
  suggestions: string[];
}

export interface AIImproveResponse {
  improvedHtml: string;
  summaryOfChanges: string;
}
