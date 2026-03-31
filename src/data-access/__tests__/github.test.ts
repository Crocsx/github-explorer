import { describe, expect, it } from 'vitest';

import {
  GitHubAPIError,
  GitHubRateLimitError,
  GitHubValidationError,
  mapErrorResponse,
} from '@/data-access/github';

function makeResponse(
  status: number,
  options: { headers?: Record<string, string>; body?: object } = {},
): Response {
  const { headers = {}, body } = options;
  return new Response(body !== undefined ? JSON.stringify(body) : null, {
    status,
    headers:
      body !== undefined
        ? { 'Content-Type': 'application/json', ...headers }
        : headers,
  });
}

describe('mapErrorResponse', () => {
  describe('rate limiting', () => {
    it('throws GitHubRateLimitError for 429', async () => {
      await expect(mapErrorResponse(makeResponse(429))).rejects.toBeInstanceOf(
        GitHubRateLimitError,
      );
    });

    it('throws GitHubRateLimitError for 403 when X-RateLimit-Remaining is 0', async () => {
      const response = makeResponse(403, {
        headers: { 'X-RateLimit-Remaining': '0' },
      });
      await expect(mapErrorResponse(response)).rejects.toBeInstanceOf(
        GitHubRateLimitError,
      );
    });

    it('throws GitHubAPIError for 403 when X-RateLimit-Remaining is not 0', async () => {
      const error = await mapErrorResponse(makeResponse(403)).catch(
        (e) => e as GitHubAPIError,
      );
      expect(error).toBeInstanceOf(GitHubAPIError);
      expect(error.statusCode).toBe(403);
    });

    it('parses X-RateLimit-Reset header into retryAfter', async () => {
      const resetEpoch = Math.floor(Date.now() / 1000) + 60;
      const response = makeResponse(429, {
        headers: { 'X-RateLimit-Reset': String(resetEpoch) },
      });
      const error = await mapErrorResponse(response).catch(
        (e) => e as GitHubRateLimitError,
      );
      expect(error.retryAfter).toEqual(new Date(resetEpoch * 1000));
    });

    it('sets retryAfter to undefined when X-RateLimit-Reset header is absent', async () => {
      const error = await mapErrorResponse(makeResponse(429)).catch(
        (e) => e as GitHubRateLimitError,
      );
      expect(error.retryAfter).toBeUndefined();
    });
  });

  describe('validation errors (422)', () => {
    it('uses the API message when present in the response body', async () => {
      const response = makeResponse(422, {
        body: { message: 'Validation Failed' },
      });
      const error = await mapErrorResponse(response).catch((e) => e);
      expect(error).toBeInstanceOf(GitHubValidationError);
      expect(error.message).toBe('Validation Failed');
    });

    it('falls back to default message when body has no message field', async () => {
      const response = makeResponse(422, { body: {} });
      const error = await mapErrorResponse(response).catch((e) => e);
      expect(error).toBeInstanceOf(GitHubValidationError);
      expect(error.message).toBe('Invalid search query.');
    });

    it('falls back to default message when body is not valid JSON', async () => {
      const response = new Response('not json', { status: 422 });
      const error = await mapErrorResponse(response).catch((e) => e);
      expect(error).toBeInstanceOf(GitHubValidationError);
      expect(error.message).toBe('Invalid search query.');
    });
  });

  describe('generic API errors', () => {
    it('throws GitHubAPIError carrying the status code', async () => {
      const error = await mapErrorResponse(makeResponse(500)).catch(
        (e) => e as GitHubAPIError,
      );
      expect(error).toBeInstanceOf(GitHubAPIError);
      expect(error.statusCode).toBe(500);
    });
  });
});
