import { BASE_URL, handleApiError } from './config';
import type { ApiResponse } from './config';

// Types
export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface PastProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  category: ProjectCategory;
  location?: string;
  completion_date?: string;
  client_name?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch all past projects
export async function fetchPastProjects(params?: {
  page?: number;
  page_size?: number;
  category?: string;
  search?: string;
  is_featured?: boolean;
}): Promise<ApiResponse<PastProject>> {
  try {
    let url = `${BASE_URL}/past_projects/`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch past projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching past projects:', error);
    throw error;
  }
}

// Fetch featured past projects
export async function fetchFeaturedPastProjects(): Promise<PastProject[]> {
  try {
    const response = await fetch(`${BASE_URL}/past_projects/featured/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch featured past projects');
    }
    const data: ApiResponse<PastProject> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching featured past projects:', error);
    throw error;
  }
}

// Fetch past projects by category
export async function fetchPastProjectsByCategory(categorySlug: string): Promise<PastProject[]> {
  try {
    const response = await fetch(`${BASE_URL}/past_projects/by_category/?category=${encodeURIComponent(categorySlug)}`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch past projects by category');
    }
    const data: ApiResponse<PastProject> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching past projects by category:', error);
    throw error;
  }
}

// Fetch project categories
export async function fetchProjectCategories(): Promise<ProjectCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}/past_projects/categories/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch project categories');
    }
    const data: ApiResponse<ProjectCategory> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching project categories:', error);
    throw error;
  }
}