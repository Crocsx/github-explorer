import { useState, useCallback } from 'react';

import { TextInput, Button, AppShell, Flex } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import {
  QueryBoundary,
  Header,
  EmptyState,
  ErrorAlert,
  RepositoryList,
  RepositoryListLoader,
} from '@/components';
import { useRepoSearch } from '@/hooks/useRepoSearch';

export const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery] = useDebouncedValue(inputValue, 500);

  const { data, isError, isLoading, isRefetching, error } = useRepoSearch(
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
        <Flex p="md" direction="column" gap="md">
          <Flex gap="md">
            <TextInput
              placeholder="Search repositories..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSearch}
              flex={1}
            />
            <Button onClick={handleSearch} loading={isLoading || isRefetching}>
              Search
            </Button>
          </Flex>
          <QueryBoundary
            isLoading={isLoading}
            data={data}
            isError={isError}
            isEmpty={data?.items.length === 0}
            emptyFallback={<EmptyState />}
            errorFallback={<ErrorAlert message={error?.message} />}
            loadingFallback={<RepositoryListLoader />}
          >
            {(result) => <RepositoryList repos={result.items} />}
          </QueryBoundary>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
};
