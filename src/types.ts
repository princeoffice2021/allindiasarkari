export type CategoryType = 
  | 'Sarkari Yojana'
  | 'Sarkari Naukri'
  | 'Results'
  | 'Admit Card'
  | 'Answer Key'
  | 'Syllabus'
  | 'Scholarship'
  | 'Current Affairs';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: CategoryType;
  state?: string | null; // NULL or empty for Central / All India
  image_url?: string | null;
  meta_description?: string | null;
  official_source_url?: string | null;
  keywords?: string[];
  published: boolean;
  author_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: CategoryType;
  state: string;
  image_url: string;
  meta_description: string;
  official_source_url?: string;
  keywords: string; // Comma separated for form input
  published: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface PostStats {
  total: number;
  published: number;
  drafts: number;
  byCategory: Record<CategoryType, number>;
}
