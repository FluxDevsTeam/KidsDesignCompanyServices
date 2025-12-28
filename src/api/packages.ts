import { BASE_URL, handleApiError } from './config';
import type { ApiResponse } from './config';

// Types
export interface PackageTag {
  id: number;
  name: string;
  slug: string;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  price: string;
  undiscounted_price?: string;
  tags: PackageTag[];
  is_active: boolean;
  is_featured: boolean;
  featured_position?: number;
  duration_days: number;
  includes: string;
  requirements: string;
  created_at: string;
  updated_at: string;
  discount_percentage: number;
  is_on_sale: boolean;
}

// Fetch all packages
export async function fetchPackages(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  is_featured?: boolean;
  tags?: number[];
}): Promise<ApiResponse<Package>> {
  try {
    let url = `${BASE_URL}/packages/`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag.toString()));
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch packages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

// Fetch featured packages
export async function fetchFeaturedPackages(): Promise<Package[]> {
  try {
    const response = await fetch(`${BASE_URL}/packages/featured/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch featured packages');
    }
    const data: ApiResponse<Package> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    throw error;
  }
}

// Search packages
export async function searchPackages(query: string): Promise<Package[]> {
  try {
    const response = await fetch(`${BASE_URL}/packages/search/?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to search packages');
    }
    const data: ApiResponse<Package> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching packages:', error);
    throw error;
  }
}

// Fetch packages on sale
export async function fetchPackagesOnSale(): Promise<Package[]> {
  try {
    const response = await fetch(`${BASE_URL}/packages/on_sale/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch packages on sale');
    }
    const data: ApiResponse<Package> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching packages on sale:', error);
    throw error;
  }
}

// Fetch package tags
export async function fetchPackageTags(): Promise<PackageTag[]> {
  try {
    const response = await fetch(`${BASE_URL}/packages/tags/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch package tags');
    }
    const data: ApiResponse<PackageTag> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching package tags:', error);
    throw error;
  }
}