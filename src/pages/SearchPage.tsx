import { useState, useCallback } from 'react';

import { TextInput, Button, AppShell, Flex, Pagination } from '@mantine/core';
import { useDebouncedValue, useScrollIntoView } from '@mantine/hooks';

import {
  QueryBoundary,
  Header,
  EmptyState,
  ErrorAlert,
  RepositoryList,
  RepositoryListLoader,
} from '@/components';
import { PER_PAGE } from '@/config/repository';
import { useRepoSearch } from '@/hooks/useRepoSearch';

export const SearchPage = () => {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery] = useDebouncedValue(inputValue, 500);
  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 60,
    duration: 50,
  });
  const { data, isError, isLoading, isRefetching, error } = useRepoSearch(
    debouncedQuery,
    page,
    { perPage: PER_PAGE },
  );

  const handleSearch = useCallback(() => {
    setInputValue(inputValue);
  }, [inputValue]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      scrollIntoView();
      setPage(newPage);
    },
    [scrollIntoView],
  );

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
              ref={targetRef}
            />
            <Button onClick={handleSearch} loading={isLoading || isRefetching}>
              Search
            </Button>
          </Flex>
          <QueryBoundary
            isLoading={isLoading || isRefetching}
            data={data}
            isError={isError}
            isEmpty={data?.items.length === 0}
            emptyFallback={<EmptyState />}
            errorFallback={<ErrorAlert message={error?.message} />}
            loadingFallback={<RepositoryListLoader count={PER_PAGE} />}
          >
            {(result) => <RepositoryList repos={result.items} />}
          </QueryBoundary>
          <Pagination
            disabled={isLoading || isRefetching}
            total={data?.total_count || 0}
            value={page}
            onChange={handlePageChange}
          />
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
};
