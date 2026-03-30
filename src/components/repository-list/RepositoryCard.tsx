import { Card, Text } from '@mantine/core';

import type { Repository } from '@/data-access/github';

export type RepositoryCardProps = {
  /*  The repository data to display in the card. */
  repo: Repository;
};

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <Card withBorder padding="md" radius="md">
      <Text fw={500}>{repo.full_name}</Text>
    </Card>
  );
}
