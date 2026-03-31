import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QueryBoundary } from '../QueryBoundary';

// Explicit fallback nodes so each assertion is unambiguous.
const LOADING = <div>loading</div>;
const ERROR = <div>error</div>;
const EMPTY = <div>empty</div>;
const LANDING = <div>landing</div>;

describe('QueryBoundary', () => {
  it('renders loadingFallback while loading', () => {
    render(
      <QueryBoundary
        isLoading={true}
        isError={false}
        data={undefined}
        loadingFallback={LOADING}
        errorFallback={ERROR}
      >
        {() => <div>content</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('loading takes precedence over error', () => {
    render(
      <QueryBoundary
        isLoading={true}
        isError={true}
        data={undefined}
        loadingFallback={LOADING}
        errorFallback={ERROR}
      >
        {() => <div>content</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.queryByText('error')).not.toBeInTheDocument();
  });

  it('renders errorFallback when query errors', () => {
    render(
      <QueryBoundary
        isLoading={false}
        isError={true}
        data={undefined}
        errorFallback={ERROR}
      >
        {() => <div>content</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders landingFallback before the first fetch', () => {
    render(
      <QueryBoundary
        isLoading={false}
        isError={false}
        isFetched={false}
        data={undefined}
        landingFallback={LANDING}
        emptyFallback={EMPTY}
      >
        {() => <div>content</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('landing')).toBeInTheDocument();
    expect(screen.queryByText('empty')).not.toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders emptyFallback when isEmpty is true', () => {
    render(
      <QueryBoundary
        isLoading={false}
        isError={false}
        isFetched={true}
        data={{ items: [] }}
        isEmpty={true}
        emptyFallback={EMPTY}
      >
        {() => <div>content</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('empty')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('calls children with data on success', () => {
    const data = { value: 42 };
    render(
      <QueryBoundary
        isLoading={false}
        isError={false}
        isFetched={true}
        data={data}
        isEmpty={false}
      >
        {(d) => <div>value: {d.value}</div>}
      </QueryBoundary>,
    );
    expect(screen.getByText('value: 42')).toBeInTheDocument();
  });
});
