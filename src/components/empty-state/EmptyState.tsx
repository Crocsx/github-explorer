import { Stack, Text } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

type EmptyStateProps = {
  /** Optional message to display. Defaults to 'No results found.' if not provided. */
  message?: string;
};

export function EmptyState({ message = 'No results found.' }: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl" c="dimmed">
      <IconInbox size={40} stroke={1.5} />
      <Text size="sm">{message}</Text>
    </Stack>
  );
}
