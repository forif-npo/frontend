import { HTTPError } from "ky";
import type { ApiErrorResponse } from "../types";

/**
 * Custom API Error class extending Error
 */
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    statusText: string,
    code?: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.code = code;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static async fromHTTPError(error: HTTPError): Promise<ApiError> {
    const { response } = error;
    const contentType = response.headers.get("content-type");

    let message = `API Error: ${response.status}`;
    let code: string | undefined;
    let errors: Record<string, string[]> | undefined;

    if (contentType?.includes("application/json")) {
      try {
        const errorData = (await response.json()) as ApiErrorResponse;
        message = errorData.message || message;
        code = errorData.code;
        errors = errorData.errors;
      } catch {
        // If JSON parsing fails, use default message
      }
    } else {
      try {
        const errorText = await response.text();
        message = errorText || message;
      } catch {
        // If text parsing fails, use default message
      }
    }

    return new ApiError(
      message,
      response.status,
      response.statusText,
      code,
      errors,
    );
  }
}
