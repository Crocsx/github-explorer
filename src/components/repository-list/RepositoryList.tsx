import { SimpleGrid } from '@mantine/core';

import type { OrderOption, Repository, SortOption } from '@/data-access/github';

import { RepositoryCard } from './RepositoryCard';
import { RepositoryListHeader } from './RepositoryListHeader';

export type RepositoryListProps = {
  repos: Repository[];
  totalCount: number;
  sort: SortOption | null;
  onSortChange: (sort: SortOption | null) => void;
  order: OrderOption | null;
  onOrderChange: (order: OrderOption) => void;
};

export function RepositoryList({
  repos,
  totalCount,
  sort,
  onSortChange,
  order,
  onOrderChange,
}: RepositoryListProps) {
  return (
    <SimpleGrid>
      <RepositoryListHeader
        totalCount={totalCount}
        sort={sort}
        onSortChange={onSortChange}
        order={order}
        onOrderChange={onOrderChange}
      />
      {repos.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </SimpleGrid>
  );
}
