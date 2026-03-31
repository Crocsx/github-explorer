import { Card, Flex, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export type RepositoryListLoaderProps = {
  /* The number of skeleton cards to display while loading. Defaults to 6. */
  count?: number;
};

export function RepositoryListLoader({ count = 6 }: RepositoryListLoaderProps) {
  return (
    <SimpleGrid>
      <Flex justify="space-between" align="center">
        <Skeleton height={14} width={120} radius="sm" />
        <Flex gap="xs" align="center">
          <Skeleton height={28} width={160} radius="sm" />
          <Skeleton circle height={28} width={28} />
        </Flex>
      </Flex>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} withBorder padding="md" radius="md">
          <Stack gap="xs">
            <Group gap="xs" align="center">
              <Skeleton circle height={16} width={16} />
              <Skeleton height={14} width={180} radius="sm" />
              <Skeleton height={18} width={48} radius="sm" />
            </Group>
            <Skeleton height={12} radius="sm" />
            <Skeleton height={12} width="70%" radius="sm" />
            <Group gap="md" mt={4}>
              <Skeleton height={10} width={70} radius="sm" />
              <Skeleton height={10} width={40} radius="sm" />
              <Skeleton height={10} width={40} radius="sm" />
              <Skeleton height={10} width={80} radius="sm" />
              <Skeleton height={10} width={100} radius="sm" />
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
