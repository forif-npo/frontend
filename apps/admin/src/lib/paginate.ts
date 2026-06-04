export interface LocalPageResult<T> {
  content: T[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

/**
 * 서버가 한 번에 전체를 내려주는 경우(예: "그 외" 학기 필터)에
 * 클라이언트에서 오프셋 페이지네이션을 적용한다.
 */
export function paginateLocally<T>(
  content: T[],
  page: number,
  size: number,
): LocalPageResult<T> {
  const currentPage = Math.max(page, 0);
  const pageSize = Math.max(size, 1);
  const totalElements = content.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const from = currentPage * pageSize;

  return {
    content: content.slice(from, from + pageSize),
    totalElements,
    currentPage,
    totalPages,
    pageSize,
  };
}
