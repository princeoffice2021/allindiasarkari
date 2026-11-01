export type BlogLanguage = 'hindi' | 'english';
export type BlogStatus = 'draft' | 'published';

export interface CareerBlog {
  id: string;
  language: BlogLanguage;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author_name: string;
  image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  published: boolean;
  is_deleted?: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface CareerBlogFormData {
  language: BlogLanguage;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string; // comma-separated input string
  author_name: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  published: boolean;
  published_at?: string;
}

export interface CareerBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export interface CareerBlogStats {
  total: number;
  published: number;
  drafts: number;
  hindiTotal: number;
  hindiPublished: number;
  hindiDrafts: number;
  englishTotal: number;
  englishPublished: number;
  englishDrafts: number;
  byCategory: Record<string, number>;
}
