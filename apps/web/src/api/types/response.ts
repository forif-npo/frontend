/**
 * Common API response wrapper types
 */

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta;
}
