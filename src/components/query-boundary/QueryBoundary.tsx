import type { ReactNode } from 'react';

import { Loader, Alert } from '@mantine/core';

export type QueryBoundaryProps<T> = {
  /* The data to render when the query is successful. Can be undefined if the query hasn't returned yet or if it returned no data. */
  data: T | undefined;
  /* Whether the query is currently loading. */
  isLoading: boolean;
  /* Whether the query resulted in an error. */
  isError: boolean;
  /* The error object if the query resulted in an error. Can be null if isError is false. */
  error?: Error | null;
  /* Whether the query returned no data. This is separate from isError because an empty result can be a valid response (e.g. no repos found for a search term). */
  isEmpty?: boolean;
  /* Fallback content to render when the query returns no data. Defaults to a simple message. */
  emptyFallback?: ReactNode;
  /* A render prop that receives the query data and returns the content to render when the query is successful. */
  children: (data: T) => ReactNode;
};

export function QueryBoundary<T>({
  data,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyFallback = <p>No results found.</p>,
  children,
}: QueryBoundaryProps<T>) {
  if (isLoading) return <Loader />;

  if (isError)
    return (
      <Alert color="red">{error?.message ?? 'Something went wrong.'}</Alert>
    );

  if (isEmpty || !data) return <>{emptyFallback}</>;

  return <>{children(data)}</>;
}
