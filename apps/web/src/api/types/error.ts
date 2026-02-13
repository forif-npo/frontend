/**
 * API Error types
 */

export interface ApiErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}
