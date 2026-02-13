/**
 * Common API request types
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}
