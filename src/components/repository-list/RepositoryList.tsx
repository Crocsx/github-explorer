import { SimpleGrid } from '@mantine/core';

import type { Repository } from '@/data-access/github';

import { RepositoryCard } from './RepositoryCard';

export type RepositoryListProps = {
  /* The list of repositories to display. */
  repos: Repository[];
};

export function RepositoryList({ repos }: RepositoryListProps) {
  return (
    <SimpleGrid>
      {repos.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </SimpleGrid>
  );
}
