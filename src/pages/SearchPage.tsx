import { useState, useCallback, useEffect, useRef } from 'react';

import {
  TextInput,
  Button,
  AppShell,
  Flex,
  Pagination,
  ActionIcon,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';

import {
  QueryBoundary,
  Header,
  EmptyState,
  ErrorAlert,
  RepositoryList,
  RepositoryListLoader,
  LandingState,
} from '@/components';
import { MAX_RESULTS, PER_PAGE, SORT_VALUES } from '@/config/repository';
import type { OrderOption, SortOption } from '@/data-access/github';
import { useRepoSearch } from '@/hooks/useRepoSearch';

const searchParsers = {
  keyword: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringEnum<SortOption>(SORT_VALUES),
  order: parseAsStringEnum<OrderOption>(['asc', 'desc']),
};

export const SearchPage = () => {
  const [{ keyword, page, sort, order }, setSearchParams] =
    useQueryStates(searchParsers);
  const [inputValue, setInputValue] = useState(keyword);
  const { data, isError, isLoading, isRefetching, isFetched, error } =
    useRepoSearch(keyword, page, {
      perPage: PER_PAGE,
      sort,
      order,
    });

  // Sync the controlled input when the user navigates back/forward in browser
  // history — the URL keyword changes externally so the input must follow.
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const updateSearch = useCallback(
    (
      params: Partial<{
        keyword: string;
        page: number;
        sort: SortOption | null;
        order: OrderOption | null;
      }>,
    ) => {
      setSearchParams((prev) => ({ ...prev, ...params }));
    },
    [setSearchParams],
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback(
    (newPage: number) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateSearch({ page: newPage });
      // Move focus to the top of results so keyboard/screen reader users
      // land on the new content rather than staying on the pagination control.
      resultsRef.current?.focus();
    },
    [updateSearch],
  );

  const handleInputChange = useDebouncedCallback(
    (value: string) => updateSearch({ keyword: value, page: 1 }),
    500,
  );

  const handleSearch = useCallback(() => {
    handleInputChange.cancel();
    updateSearch({ keyword: inputValue, page: 1 });
  }, [handleInputChange, inputValue, updateSearch]);

  const clearSearch = useCallback(() => {
    setInputValue('');
    updateSearch({ keyword: '', page: 1 });
  }, [updateSearch]);

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
                    aria-label="Clear search Input"
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
          {/* tabIndex={-1} makes this div programmatically focusable for pagination focus management */}
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
                    totalCount={Math.min(result.total_count, MAX_RESULTS)}
                    sort={sort}
                    onSortChange={(s) =>
                      updateSearch({ sort: s, order: null, page: 1 })
                    }
                    order={order}
                    onOrderChange={(o) => updateSearch({ order: o, page: 1 })}
                  />
                  <Flex justify="center" mt="md" flex="1">
                    <Pagination
                      gap="lg"
                      total={Math.ceil(
                        Math.min(result.total_count, MAX_RESULTS) / PER_PAGE,
                      )}
                      value={page}
                      onChange={handlePageChange}
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
