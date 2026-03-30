import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { searchRepositories } from '@/data-access/github';

export function useRepoSearch(
  query: string,
  page: number,
  options: { perPage?: number } = {},
) {
  return useQuery({
    queryKey: ['repos', query, page],
    queryFn: ({ signal }) =>
      searchRepositories(query, page, options.perPage, signal),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}
