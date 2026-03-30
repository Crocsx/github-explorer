import { useState, useCallback } from 'react';

import {
  TextInput,
  Button,
  AppShell,
  Flex,
  Pagination,
  ActionIcon,
  Group,
} from '@mantine/core';
import { useDebouncedCallback, useScrollIntoView } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import {
  QueryBoundary,
  Header,
  EmptyState,
  ErrorAlert,
  RepositoryList,
  RepositoryListLoader,
  LandingState,
} from '@/components';
import { PER_PAGE } from '@/config/repository';
import { useRepoSearch } from '@/hooks/useRepoSearch';

const searchParsers = {
  keyword: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};

export const SearchPage = () => {
  const [{ keyword, page }, setSearchParams] = useQueryStates(searchParsers);
  const [inputValue, setInputValue] = useState(keyword);
  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 80,
    duration: 50,
  });

  const { data, isError, isLoading, isRefetching, isFetched, error } =
    useRepoSearch(keyword, page, { perPage: PER_PAGE });

  const updateSearch = useCallback(
    (params: Partial<{ keyword: string; page: number }>) => {
      if (params.page) scrollIntoView();
      setSearchParams((prev) => ({ ...prev, ...params }));
    },
    [scrollIntoView, setSearchParams],
  );

  const handleInputChange = useDebouncedCallback(
    (value: string) => updateSearch({ keyword: value, page: 1 }),
    500,
  );

  const handleSearch = () => updateSearch({ keyword: inputValue, page: 1 });

  const handlePageChange = (newPage: number) => updateSearch({ page: newPage });

  const clearSearch = () => {
    setInputValue('');
    updateSearch({ keyword: '', page: 1 });
  };

  const isBusy = isLoading || isRefetching;
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
              onChange={(e) => {
                setInputValue(e.currentTarget.value);
                handleInputChange(e.currentTarget.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              flex={1}
              rightSection={
                inputValue && (
                  <ActionIcon onClick={clearSearch} variant="outline">
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
            <Button onClick={handleSearch} loading={isBusy}>
              Search
            </Button>
          </Flex>
          <QueryBoundary
            isLoading={isBusy}
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
              <Group ref={targetRef}>
                <RepositoryList repos={result.items} />
              </Group>
            )}
          </QueryBoundary>
          <Flex justify="center" mt="md">
            <Pagination
              gap="lg"
              disabled={isBusy}
              total={Math.ceil((data?.total_count ?? 0) / PER_PAGE) || 0}
              value={page}
              onChange={handlePageChange}
            />
          </Flex>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
};
