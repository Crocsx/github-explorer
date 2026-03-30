import { Badge, Group, Text } from '@mantine/core';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Vue: '#41b883',
};

export type LanguageBadgeProps = {
  /* The programming language to display in the badge. */
  language: string;
};

export const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  const color = LANGUAGE_COLORS[language] ?? '#ccc';
  return (
    <Group gap={4} align="center">
      <Badge size="xs" circle style={{ backgroundColor: color }} />
      <Text size="xs" c="dimmed">
        {language}
      </Text>
    </Group>
  );
};
