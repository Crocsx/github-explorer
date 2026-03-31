# GitHub Explorer

Search GitHub repositories by keyword with sorting, pagination, and persistent URL state.

## Stack

- React 19, TypeScript, Vite
- Mantine UI, TanStack Query
- React Router, nuqs (URL state)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `VITE_GITHUB_API_URL` | Yes | GitHub API base URL — use `https://api.github.com` |
| `VITE_GITHUB_TOKEN` | No | Personal access token for higher rate limits. Generate one at github.com/settings/tokens (no scopes needed for public repos) |
