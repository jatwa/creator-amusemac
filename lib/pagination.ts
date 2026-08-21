export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export function paginateArray<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 12
): PaginatedResult<T> {
  const currentPage = Math.max(1, Math.floor(page));
  const validPageSize = Math.max(1, Math.floor(pageSize));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / validPageSize));

  const startIndex = (currentPage - 1) * validPageSize;
  const paginatedItems = items.slice(startIndex, startIndex + validPageSize);

  return {
    items: paginatedItems,
    meta: {
      page: currentPage,
      pageSize: validPageSize,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

export function filterByStatus<T extends { status?: string }>(
  items: T[],
  allowedStatuses: string[] = ["published"]
): T[] {
  return items.filter((item) => {
    // If item doesn't define status, default to published
    if (!item.status) return true;
    return allowedStatuses.includes(item.status);
  });
}
