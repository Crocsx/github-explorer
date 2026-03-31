import { useEffect, useRef } from 'react';

import {
  TextInput,
  Button,
  AppShell,
  Flex,
  Pagination,
  ActionIcon,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import {
  QueryBoundary,
  Header,
  EmptyState,
  ErrorAlert,
  RepositoryList,
  RepositoryListLoader,
  LandingState,
} from '@/components';
import { MAX_RESULTS, PER_PAGE } from '@/config/repository';
import { useRepoSearch } from '@/hooks/useRepoSearch';
import { useSearchState } from '@/hooks/useSearchState';

export const SearchPage = () => {
  const {
    keyword,
    page,
    sort,
    order,
    inputValue,
    setInputValue,
    handlePageChange,
    handleInputChange,
    handleSearch,
    clearSearch,
    handleSortChange,
    handleOrderChange,
  } = useSearchState();

  // tabIndex={-1} makes this div programmatically focusable so keyboard/screen
  // reader users land on the new content after a page change rather than
  // staying on the pagination control.
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data, isError, isLoading, isRefetching, isFetched, error } =
    useRepoSearch(keyword, page, {
      perPage: PER_PAGE,
      sort,
      order,
    });

  const clampedTotal = data ? Math.min(data.total_count, MAX_RESULTS) : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const onPageChange = (newPage: number) => {
    handlePageChange(newPage);
    resultsRef.current?.focus();
  };

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Flex p="md" direction="column" gap="md">
          <Flex gap="md">
            <TextInput
              aria-label="Search GitHub repositories"
              placeholder="Search repositories..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.currentTarget.value);
                handleInputChange(e.currentTarget.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              flex={1}
              rightSection={
                inputValue && (
                  <ActionIcon
                    onClick={clearSearch}
                    variant="outline"
                    aria-label="Clear search input"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
            <Button onClick={handleSearch} loading={isLoading || isRefetching}>
              Search
            </Button>
          </Flex>
          <div ref={resultsRef} tabIndex={-1} style={{ outline: 'none' }}>
            <QueryBoundary
              isLoading={isLoading}
              data={data}
              isError={isError}
              isFetched={isFetched}
              isEmpty={isFetched && data?.items.length === 0}
              landingFallback={<LandingState />}
              emptyFallback={<EmptyState />}
              errorFallback={<ErrorAlert message={error?.message} />}
              loadingFallback={<RepositoryListLoader count={PER_PAGE} />}
            >
              {(result) => (
                <>
                  <RepositoryList
                    repos={result.items}
                    totalCount={clampedTotal}
                    sort={sort}
                    onSortChange={handleSortChange}
                    order={order}
                    onOrderChange={handleOrderChange}
                  />
                  <Flex justify="center" mt="md" flex="1">
                    <Pagination
                      gap="lg"
                      total={Math.ceil(clampedTotal / PER_PAGE)}
                      value={page}
                      onChange={onPageChange}
                    />
                  </Flex>
                </>
              )}
            </QueryBoundary>
          </div>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
};
