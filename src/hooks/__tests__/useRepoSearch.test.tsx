import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRepoSearch } from '../useRepoSearch';

vi.mock('@/data-access/github', () => ({
  searchRepositories: vi.fn().mockResolvedValue({
    items: [],
    total_count: 0,
    incomplete_results: false,
  }),
}));

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useRepoSearch', () => {
  describe('enabled guard', () => {
    it('does not fetch when query is empty', () => {
      const { result } = renderHook(
        () => useRepoSearch('', 1, { sort: null, order: null }),
        { wrapper: makeWrapper() },
      );
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('does not fetch when query is whitespace only', () => {
      const { result } = renderHook(
        () => useRepoSearch('   ', 1, { sort: null, order: null }),
        { wrapper: makeWrapper() },
      );
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('fetches when query is non-empty', () => {
      const { result } = renderHook(
        () => useRepoSearch('react', 1, { sort: null, order: null }),
        { wrapper: makeWrapper() },
      );
      expect(result.current.fetchStatus).not.toBe('idle');
    });
  });
});
