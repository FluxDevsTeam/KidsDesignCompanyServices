// Base API configuration
export const BASE_URL = 'http://localhost:8000/api/v1'; // Adjust if backend is running on different port

// Helper to handle API errors
export const handleApiError = async (response: Response, customMessage: string) => {
  const errorText = await response.text();

  throw new Error(`${customMessage}. Status: ${response.status}. Message: ${errorText || 'No details provided'}`);
};

// Interface for paginated API response
export interface ApiResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}