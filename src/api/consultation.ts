import { BASE_URL, handleApiError } from './config';
import type { ApiResponse } from './config';

// Types
export interface ConsultationPackage {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultationRequest {
  package: number;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
  user_name: string;
  user_email: string;
  phone_number: string;
  organization_name?: string;
  industry: string;
  project_description: string;
  estimated_budget: string;
}

// Fetch consultation packages
export async function fetchConsultationPackages(): Promise<ConsultationPackage[]> {
  try {
    const response = await fetch(`${BASE_URL}/consultation/package/`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch consultation packages');
    }
    const data: ApiResponse<ConsultationPackage> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching consultation packages:', error);
    throw error;
  }
}

// Submit consultation request
export async function submitConsultationRequest(requestData: ConsultationRequest): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/consultation/consultation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to submit consultation request');
    }
  } catch (error) {
    console.error('Error submitting consultation request:', error);
    throw error;
  }
}