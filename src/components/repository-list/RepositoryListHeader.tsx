import { ActionIcon, Flex, Select, Text, Tooltip } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

import { SORT_OPTIONS } from '@/config/repository';
import type { OrderOption, SortOption } from '@/data-access/github';

export type RepositoryListHeaderProps = {
  totalCount: number;
  sort: SortOption | null;
  onSortChange: (sort: SortOption | null) => void;
  order: OrderOption | null;
  onOrderChange: (order: OrderOption) => void;
};

export function RepositoryListHeader({
  totalCount,
  sort,
  onSortChange,
  order,
  onOrderChange,
}: RepositoryListHeaderProps) {
  const effectiveOrder = order ?? 'desc';
  const isDesc = effectiveOrder === 'desc';

  return (
    <Flex justify="space-between" align="center">
      <Text size="sm" c="dimmed">
        Showing{' '}
        <Text span fw={500} c="dark">
          {totalCount.toLocaleString()}
        </Text>{' '}
        results
      </Text>
      <Flex align="center" gap="xs">
        <Text size="sm" c="dimmed">
          Sort by:
        </Text>
        <Select
          size="xs"
          data={SORT_OPTIONS}
          aria-label="Sort repositories by"
          value={sort ?? ''}
          onChange={(v) => {
            onSortChange((v || null) as SortOption | null);
          }}
          allowDeselect={false}
          w={160}
        />
        <Tooltip label={isDesc ? 'Descending' : 'Ascending'}>
          <ActionIcon
            variant="subtle"
            color="gray"
            disabled={!sort}
            onClick={() => onOrderChange(isDesc ? 'asc' : 'desc')}
            aria-label={isDesc ? 'Descending' : 'Ascending'}
          >
            {isDesc ? (
              <IconSortDescending size={16} aria-hidden />
            ) : (
              <IconSortAscending size={16} aria-hidden />
            )}
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
