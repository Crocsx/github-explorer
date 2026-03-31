import type { SortOption } from '@/data-access/github';

export const PER_PAGE = 20;
// GitHub Search API only returns up to 1000 results
export const MAX_RESULTS = 1000;

export const SORT_OPTIONS = [
  { value: '', label: 'Best Match' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'forks', label: 'Most Forks' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'help-wanted-issues', label: 'Help Wanted Issues' },
] satisfies { value: SortOption | ''; label: string }[];

export const SORT_VALUES = SORT_OPTIONS.map((o) => o.value).filter(
  (v): v is SortOption => v !== '',
);
