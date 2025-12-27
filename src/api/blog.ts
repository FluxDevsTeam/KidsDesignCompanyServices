import { BASE_URL, handleApiError } from './config';
import type { ApiResponse } from './config';

// Types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  category?: BlogCategory;
  tags: BlogTag[];
  featured_image?: string;
  status: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
  views: number;
  comment_count: number;
}

// Fetch blog posts
export async function fetchBlogPosts(params?: {
  page?: number;
  page_size?: number;
  category?: number;
  tags?: number[];
  search?: string;
}): Promise<ApiResponse<BlogPost>> {
  try {
    let url = `${BASE_URL}/blog/post/`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag.toString()));
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch blog posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Fetch blog post by slug
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const response = await fetch(`${BASE_URL}/blog/post/retrieve_by_slug/${slug}/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch blog post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

// Fetch blog categories
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}/blog/category/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch blog categories');
    }
    const data: ApiResponse<BlogCategory> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
}

// Fetch blog tags
export async function fetchBlogTags(): Promise<BlogTag[]> {
  try {
    const response = await fetch(`${BASE_URL}/blog/tag/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch blog tags');
    }
    const data: ApiResponse<BlogTag> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
}