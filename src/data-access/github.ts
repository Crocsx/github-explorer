import type { Endpoints } from '@octokit/types';

type GitHubSearchResponse =
  Endpoints['GET /search/repositories']['response']['data'];

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

  return response.json() as Promise<GitHubSearchResponse>;
}
