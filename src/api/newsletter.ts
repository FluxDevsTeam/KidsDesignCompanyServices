import { BASE_URL, handleApiError } from './config';
import type { ApiResponse } from './config';

// Types
export interface Subscriber {
  id: number;
  email: string;
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  status: string;
  preferences: Record<string, any>;
  subscribed_at: string;
  last_active_at?: string;
}

export interface NewsletterCampaign {
  id: number;
  subject: string;
  content: string;
  plain_text_content: string;
  status: string;
  recipients_filter: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  total_sent: number;
  open_count: number;
  click_count: number;
  bounce_count: number;
  open_rate: number;
  click_rate: number;
}

export interface SubscribeRequest {
  email: string;
  preferences?: Record<string, any>;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(data: SubscribeRequest): Promise<{ message: string; subscriber: Subscriber }> {
  try {
    const response = await fetch(`${BASE_URL}/newsletter/subscriber/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to subscribe to newsletter');
    }

    return await response.json();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/newsletter/subscriber/unsubscribe/?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to unsubscribe from newsletter');
    }

    return await response.json();
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    throw error;
  }
}

// Fetch newsletter campaigns (if needed for public view)
export async function fetchNewsletterCampaigns(params?: {
  page?: number;
  page_size?: number;
}): Promise<ApiResponse<NewsletterCampaign>> {
  try {
    let url = `${BASE_URL}/newsletter/campaign/`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch newsletter campaigns');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching newsletter campaigns:', error);
    throw error;
  }
}