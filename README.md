# GitHub Repo Explorer

Type a GitHub username and see that user's public profile and their public
repositories.

The React frontend never calls the GitHub API directly. Instead it talks to
our own Node.js backend, which proxies the request to GitHub and caches the
result for a short time. This keeps any API token private and avoids hitting
GitHub's rate limit.

## Project structure

- `client/` — React + Vite frontend (the user interface).
- `server/` — Node.js + Express backend (proxies and caches GitHub calls).

## Status

Work in progress. Full setup and run instructions will be added once the app
is built.
