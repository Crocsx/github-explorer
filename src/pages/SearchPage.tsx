import { useState, useCallback } from 'react';

import { TextInput, Button, Group, AppShell } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import { QueryBoundary, Header } from '@/components';
import { useRepoSearch } from '@/hooks/useRepoSearch';

export const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery] = useDebouncedValue(inputValue, 500);

  const { data, isError, isLoading, isRefetching } = useRepoSearch(
    debouncedQuery,
    1,
  );

  const handleSearch = useCallback(() => {
    setInputValue(inputValue);
  }, [inputValue]);

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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={handleSearch}
            />
            <Button onClick={handleSearch} loading={isLoading || isRefetching}>
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
