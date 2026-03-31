import { useCallback, useEffect, useState } from 'react';

import { useDebouncedCallback } from '@mantine/hooks';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';

import { SORT_VALUES } from '@/config/repository';
import type { OrderOption, SortOption } from '@/data-access/github';

const searchParsers = {
  keyword: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringEnum<SortOption>(SORT_VALUES),
  order: parseAsStringEnum<OrderOption>(['asc', 'desc']),
};

export function useSearchState() {
  const [{ keyword, page, sort, order }, setSearchParams] =
    useQueryStates(searchParsers);
  const [inputValue, setInputValue] = useState(keyword);

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

  const handlePageChange = useCallback(
    (newPage: number) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateSearch({ page: newPage });
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

  const handleSortChange = useCallback(
    (newSort: SortOption | null) => {
      updateSearch({ sort: newSort, order: null, page: 1 });
    },
    [updateSearch],
  );

  const handleOrderChange = useCallback(
    (newOrder: OrderOption) => {
      updateSearch({ order: newOrder, page: 1 });
    },
    [updateSearch],
  );

  return {
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
  };
}
