import type { ReactNode } from 'react';

import { Loader, Alert } from '@mantine/core';

export type QueryBoundaryProps<T> = {
  /* The data to render when the query is successful. Can be undefined if the query hasn't returned yet or if it returned no data. */
  data: T | undefined;
  /* Whether the query is currently loading. */
  isLoading: boolean;
  /* Whether the query resulted in an error. */
  isError: boolean;
  /* Whether the query returned no data. This is separate from isError because an empty result can be a valid response (e.g. no repos found for a search term). */
  isEmpty?: boolean;
  /* Whether the query has completed at least once. When false, landingFallback is shown instead of emptyFallback. */
  isFetched?: boolean;
  /* Fallback content to render when the query returns no data. Defaults to a simple message. */
  emptyFallback?: ReactNode;
  /* Fallback content to render before the query has been fetched for the first time. */
  landingFallback?: ReactNode;
  /* Fallback content to render when the query results in an error. Defaults to a simple alert. */
  errorFallback?: ReactNode;
  /* Fallback content to render when the query is loading. Defaults to a simple loader. */
  loadingFallback?: ReactNode;
  /* A render prop that receives the query data and returns the content to render when the query is successful. */
  children: (data: T) => ReactNode;
};

export function QueryBoundary<T>({
  data,
  isLoading,
  isError,
  isEmpty,
  isFetched,
  emptyFallback = <p>No results found.</p>,
  landingFallback = null,
  errorFallback = (
    <Alert color="red">An error occurred while fetching data.</Alert>
  ),
  loadingFallback = <Loader />,
  children,
}: QueryBoundaryProps<T>) {
  if (isLoading) return loadingFallback;

  if (isError) return errorFallback;

  if (!isFetched && !data) return landingFallback;

  if (isEmpty || !data) return emptyFallback;

  return children(data);
}
