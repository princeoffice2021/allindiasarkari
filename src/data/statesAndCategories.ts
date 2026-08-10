import { CategoryType } from '../types';

export const ALL_INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const ALL_UNION_TERRITORIES: string[] = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const ALL_STATES_AND_UTS = [...ALL_INDIAN_STATES, ...ALL_UNION_TERRITORIES];

export interface CategoryInfo {
  name: CategoryType;
  slug: string;
  description: string;
  color: string;
  iconName: string;
}

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  {
    name: 'Sarkari Yojana',
    slug: 'sarkari-yojana',
    description: 'Latest Central & State Government Welfare Schemes, PM Yojana, and Financial Assistance Programs across India.',
    color: 'bg-emerald-600 text-white',
    iconName: 'FileText',
  },
  {
    name: 'Sarkari Naukri',
    slug: 'sarkari-naukri',
    description: 'Central Government Jobs, State Level Recruitments, Defence, Railways, Banking, Police & Staff Selection Jobs.',
    color: 'bg-blue-700 text-white',
    iconName: 'Briefcase',
  },
  {
    name: 'Results',
    slug: 'results',
    description: 'Sarkari Exam Results, Cut Off Marks, Merit Lists, and Score Cards for UPSC, SSC, Railways, State PSCs & Boards.',
    color: 'bg-indigo-700 text-white',
    iconName: 'Award',
  },
  {
    name: 'Admit Card',
    slug: 'admit-card',
    description: 'Download Hall Tickets, e-Admit Cards, Exam City Intimation Slips for All India Competitive Exams.',
    color: 'bg-amber-600 text-white',
    iconName: 'Ticket',
  },
  {
    name: 'Answer Key',
    slug: 'answer-key',
    description: 'Official Answer Keys, Objection Tracker, Question Papers & Answer Solutions for Government Entrance Exams.',
    color: 'bg-teal-700 text-white',
    iconName: 'CheckSquare',
  },
  {
    name: 'Syllabus',
    slug: 'syllabus',
    description: 'Official Exam Pattern, Detailed Subject-Wise Syllabus PDF Downloads & Marking Schemes for Competitive Exams.',
    color: 'bg-purple-700 text-white',
    iconName: 'BookOpen',
  },
  {
    name: 'Scholarship',
    slug: 'scholarship',
    description: 'National Scholarship Portal (NSP), Post-Matric, Merit Cum Means, State Scholarships & Education Loans.',
    color: 'bg-rose-600 text-white',
    iconName: 'GraduationCap',
  },
  {
    name: 'Current Affairs',
    slug: 'current-affairs',
    description: 'Daily Current Affairs, General Knowledge Updates, National News & Weekly GK Quiz for Government Competitive Exams.',
    color: 'bg-cyan-700 text-white',
    iconName: 'Newspaper',
  },
];

export function stateToSlug(stateName: string): string {
  return stateName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function slugToState(slug: string): string | undefined {
  const normalizedSlug = slug.toLowerCase().trim();
  return ALL_STATES_AND_UTS.find(
    (st) => stateToSlug(st) === normalizedSlug
  );
}

export function categoryToSlug(categoryName: CategoryType): string {
  const found = CATEGORIES_CONFIG.find((c) => c.name === categoryName);
  return found ? found.slug : categoryName.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCategory(slug: string): CategoryType | undefined {
  const found = CATEGORIES_CONFIG.find((c) => c.slug === slug.toLowerCase());
  return found ? found.name : undefined;
}
