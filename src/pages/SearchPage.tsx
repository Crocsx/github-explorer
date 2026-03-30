import { useState } from 'react';

import { TextInput, Button, Group, AppShell } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';

import { QueryBoundary, Header } from '@/components';
import { useRepoSearch } from '@/hooks/useRepoSearch';

export const SearchPage = () => {
  const [query, setQuery] = useState('');

  const { data, isError, isLoading } = useRepoSearch(query, 1);

  const handleSearch = useDebouncedCallback(() => {
    setQuery(query);
  }, 500);

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Group p="md">
          <Group>
            <TextInput
              placeholder="Search repositories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={handleSearch}
            />
            <Button onClick={handleSearch} loading={isLoading}>
              Search
            </Button>
          </Group>
          <Group>
            <QueryBoundary
              isLoading={isLoading}
              data={data}
              isError={isError}
              isEmpty={data?.items.length === 0}
              emptyFallback={<div>No results found.</div>}
            >
              {(result) =>
                result?.items.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.full_name}
                  </a>
                ))
              }
            </QueryBoundary>
          </Group>
        </Group>
      </AppShell.Main>
    </AppShell>
  );
};
