import type { Endpoints } from '@octokit/types';

export type GitHubSearchResponse =
  Endpoints['GET /search/repositories']['response']['data'];

export type Repository =
  Endpoints['GET /search/repositories']['response']['data']['items'][number];

export async function searchRepositories(
  query: string,
  page: number,
  perPage: number = 20,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetch(
    `https://api.github.com/search/repositories?${params}`,
    {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
    },
  );

  if (response.status === 403 || response.status === 429) {
    throw new Error(
      `GitHub API rate limit exceeded. Please wait a moment and try again.`,
    );
  }

  if (response.status === 422) {
    throw new Error(`Invalid search query.`);
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json() as Promise<GitHubSearchResponse>;
}
