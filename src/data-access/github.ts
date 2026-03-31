import type { Endpoints } from '@octokit/types';

import { PER_PAGE } from '@/config/repository';

// ============================================================================
// Types
// ============================================================================

type GitHubSearchParameters =
  Endpoints['GET /search/repositories']['parameters'];
type GitHubSearchResponse =
  Endpoints['GET /search/repositories']['response']['data'];

export type Repository =
  Endpoints['GET /search/repositories']['response']['data']['items'][number];

export type SortOption = NonNullable<GitHubSearchParameters['sort']>;
export type OrderOption = NonNullable<GitHubSearchParameters['order']>;

export interface SearchRepositoriesParams {
  query: string;
  page: number;
  perPage?: number;
  sort?: SortOption;
  order?: OrderOption;
  signal?: AbortSignal;
}

// ============================================================================
// Errors
// ============================================================================

export class GitHubNetworkError extends Error {
  constructor() {
    super(
      'Unable to reach GitHub. Check your internet connection and try again.',
    );
    this.name = 'GitHubNetworkError';
  }
}

export class GitHubRateLimitError extends Error {
  readonly retryAfter?: Date;

  constructor(retryAfter?: Date) {
    const retryMessage = retryAfter
      ? ` Try again after ${retryAfter.toLocaleTimeString()}.`
      : ' Please wait a moment and try again.';
    super(`GitHub API rate limit exceeded.${retryMessage}`);
    this.name = 'GitHubRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class GitHubValidationError extends Error {
  constructor(apiMessage?: string) {
    super(apiMessage ?? 'Invalid search query.');
    this.name = 'GitHubValidationError';
  }
}

export class GitHubAPIError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number) {
    super(`GitHub API error: ${statusCode}`);
    this.name = 'GitHubAPIError';
    this.statusCode = statusCode;
  }
}

// ============================================================================
// Config
// ============================================================================

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
if (!GITHUB_API_URL) {
  throw new Error('VITE_GITHUB_API_URL is not set. Check your .env file.');
}

// ============================================================================
// Helpers
// ============================================================================

function isValidSearchResponse(data: unknown): data is GitHubSearchResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'total_count' in data &&
    'items' in data &&
    Array.isArray((data as GitHubSearchResponse).items)
  );
}

function buildSearchUrl(params: SearchRepositoriesParams): string {
  const searchParams = new URLSearchParams({
    q: params.query,
    page: String(params.page),
    per_page: String(params.perPage ?? PER_PAGE),
  });

  if (params.sort) searchParams.set('sort', params.sort);
  if (params.order) searchParams.set('order', params.order);

  return `${GITHUB_API_URL}/search/repositories?${searchParams}`;
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10',
  };

  if (import.meta.env.VITE_GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
  }

  return headers;
}

export async function mapErrorResponse(response: Response): Promise<never> {
  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get('X-RateLimit-Remaining') === '0')
  ) {
    const resetHeader = response.headers.get('X-RateLimit-Reset');
    const retryAfter = resetHeader
      ? new Date(Number(resetHeader) * 1000)
      : undefined;
    throw new GitHubRateLimitError(retryAfter);
  } else if (response.status === 403) {
    throw new GitHubAPIError(403);
  }

  if (response.status === 422) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new GitHubValidationError(body?.message);
  }
  throw new GitHubAPIError(response.status);
}

// ============================================================================
// API
// ============================================================================

export async function searchRepositories(
  params: SearchRepositoriesParams,
): Promise<GitHubSearchResponse> {
  let response: Response;
  try {
    response = await fetch(buildSearchUrl(params), {
      signal: params.signal,
      headers: buildHeaders(),
    });
  } catch (e) {
    // Re-throw AbortError so React Query can handle query cancellation.
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new GitHubNetworkError();
  }

  if (!response.ok) {
    await mapErrorResponse(response);
  }

  const data = await response.json();
  if (!isValidSearchResponse(data)) {
    throw new GitHubAPIError(200);
  }
  return data;
}
