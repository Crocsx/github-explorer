import { Anchor, Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconBook, IconGitFork, IconStar } from '@tabler/icons-react';
import dayjs from 'dayjs';

import type { Repository } from '@/data-access/github';

import { LanguageBadge } from '../language-badge/LanguageBadge';

export type RepositoryCardProps = {
  /*  The repository data to display in the card. */
  repo: Repository;
};

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="xs">
        <Group gap="xs" align="center">
          <IconBook size={16} color="gray" />
          <Title
            component={Anchor}
            fw={600}
            size="lg"
            // @ts-expect-error this property does exist from Mantine's Anchor component
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {repo.full_name}
          </Title>
          <Badge variant="outline" size="xs" color="gray">
            {repo.private ? 'Private' : 'Public'}
          </Badge>
        </Group>

        {repo.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {repo.description}
          </Text>
        )}

        <Group gap="md" mt={4}>
          {repo.language && <LanguageBadge language={repo.language} />}
          <Group gap={4} align="center">
            <IconStar size={13} color="gray" />
            <Text size="xs" c="dimmed">
              {repo.stargazers_count.toLocaleString()}
            </Text>
          </Group>
          <Group gap={4} align="center">
            <IconGitFork size={13} color="gray" />
            <Text size="xs" c="dimmed">
              {repo.forks_count.toLocaleString()}
            </Text>
          </Group>
          {repo.license && (
            <Text size="xs" c="dimmed">
              {repo.license.spdx_id}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            {dayjs(repo.updated_at).fromNow()}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
