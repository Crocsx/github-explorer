import { SimpleGrid, Skeleton } from '@mantine/core';

export type RepositoryListLoaderProps = {
  /* The number of skeleton cards to display while loading. Defaults to 6. */
  count?: number;
};

export function RepositoryListLoader({ count = 6 }: RepositoryListLoaderProps) {
  return (
    <SimpleGrid>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={80} radius="md" />
      ))}
    </SimpleGrid>
  );
}
