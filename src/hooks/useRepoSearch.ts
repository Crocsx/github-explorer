import { useQuery } from '@tanstack/react-query';

import type { OrderOption, SortOption } from '@/data-access/github';
import { searchRepositories } from '@/data-access/github';

export function useRepoSearch(
  query: string,
  page: number,
  params: { perPage?: number; sort: SortOption | null; order: OrderOption | null },
) {
  return useQuery({
    queryKey: ['repos', query, page, params.sort, params.order, params.perPage],
    queryFn: ({ signal }) =>
      searchRepositories({
        query,
        page,
        perPage: params.perPage,
        sort: params.sort ?? undefined,
        order: params.order ?? undefined,
        signal,
      }),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
