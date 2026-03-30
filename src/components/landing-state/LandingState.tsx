import { Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

type LandingStateProps = {
  message?: string;
};

export function LandingState({
  message = 'Search for repositories to get started.',
}: LandingStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl" c="dimmed">
      <IconSearch size={40} stroke={1.5} />
      <Text size="sm">{message}</Text>
    </Stack>
  );
}
