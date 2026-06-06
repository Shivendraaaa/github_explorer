# GitHub Repo Explorer

Type a GitHub username and instantly see that user's public profile and a
list of their public repositories. You can sort the repos by stars, name, or
last updated, load more pages, click any repo to reveal extra details, and
re-run recent searches.

The key design choice is that **the React frontend never calls the GitHub API
directly**. Every request goes through our own Node.js backend, which proxies
the call to GitHub, caches each response for 60 seconds, and returns a small,
clean shape. This keeps any GitHub token private on the server, protects us
from GitHub's rate limit, and gives the frontend a stable, predictable API.

## Live demo

- Frontend: _https://your-frontend.vercel.app_ (placeholder — added after deployment)
- Backend: _https://your-backend.onrender.com_ (placeholder — added after deployment)

## Features

- Search any GitHub user by username
- Profile display: avatar, name, bio, followers, following, public repo count
- Repository list: name, description, language, stars, last updated
- Sort repos by stars / name / last updated (done in the browser)
- Click a repo to expand its open-issues count, default branch, and a GitHub link
- "Load more" pagination (GitHub returns 30 repos per page)
- 60-second server-side cache (with an `x-cache: HIT` header on cache hits)
- Clear states for loading (skeleton), errors, and empty results
- Recently searched usernames saved in the browser (click one to search again)

## Tech stack and why

| Area      | Choice                          | Why |
|-----------|---------------------------------|-----|
| Backend   | Node.js + Express (ES modules)  | Small, well-understood web framework; minimal setup |
| HTTP      | Native `fetch` (Node 18+)       | Built in — no need for an extra library like axios |
| Cache     | In-memory `Map` with a 60s TTL  | Simplest thing that meets the requirement; no database needed |
| Frontend  | React + Vite (JavaScript)       | Fast dev server and modern build; the current standard |
| State     | `useState` / `useEffect` only   | The app is small, so a state library would be overkill |
| Styling   | One plain CSS file with variables | Consistent theming and responsiveness without a UI library |

## Run locally

You only need [Node.js](https://nodejs.org/) installed (version **20.12 or
newer**, because the backend uses Node's built-in `.env` file loading). npm
comes bundled with Node.

The app is two separate parts, so open **two terminals**.

**Terminal 1 — backend** (runs on http://localhost:3001):

```bash
cd server
npm install
npm run dev
```

**Terminal 2 — frontend** (runs on http://localhost:5173):

```bash
cd client
npm install
npm run dev
```

Then open the frontend URL that Vite prints (usually http://localhost:5173).

### Optional: a GitHub token (raises the rate limit)

Without a token, GitHub allows 60 requests per hour, which is plenty for trying
the app. With a token it rises to 5000/hour. To add one:

```bash
cd server
cp .env.example .env      # then open .env and paste your token
```

Create a token (no scopes needed for public data) at
https://github.com/settings/tokens. The token stays on the server and is never
sent to the browser.

## API documentation

All responses are JSON. Errors return the matching status code with a body of
the form `{ "error": "..." }`. On a cache hit, the response includes an
`x-cache: HIT` header.

| Method | Path                              | Request                                         | Success response |
|--------|-----------------------------------|-------------------------------------------------|------------------|
| GET    | `/api/health`                     | —                                               | `{ "status": "ok" }` |
| GET    | `/api/github/:username`           | `username` in the path                          | `{ login, name, avatar_url, bio, followers, following, public_repos }` |
| GET    | `/api/github/:username/repos`     | `username` in the path; `page` query (optional, default 1) | array of `{ id, name, description, language, stargazers_count, updated_at, open_issues_count, default_branch, html_url }` |

### Error responses

| Situation                          | Status | Body |
|------------------------------------|--------|------|
| GitHub user not found              | 404    | `{ "error": "User not found" }` |
| GitHub rate limit reached          | 429    | `{ "error": "GitHub rate limit reached, please try again shortly" }` |
| Network or other upstream failure  | 502    | `{ "error": "Could not reach GitHub" }` |

## Project structure

```
github_explorer/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx        # the search input + submit
│   │   │   ├── UserProfile.jsx      # profile card
│   │   │   ├── RepoList.jsx         # list + sort control
│   │   │   ├── RepoCard.jsx         # one repo, expandable
│   │   │   ├── Loader.jsx           # loading skeleton
│   │   │   ├── ErrorMessage.jsx     # error banner
│   │   │   └── RecentSearches.jsx   # recent-username pills
│   │   ├── api.js                   # calls OUR backend (never GitHub directly)
│   │   ├── App.jsx                  # owns state, wires everything together
│   │   ├── App.css                  # all styles (CSS variables, responsive)
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   └── package.json
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── github.js            # /api/github/:username and /repos
│   │   ├── services/
│   │   │   └── github.js            # talks to the real GitHub API
│   │   ├── utils/
│   │   │   └── cache.js             # 60-second in-memory cache
│   │   └── index.js                # Express app, middleware, error handler
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Deployment

The frontend deploys to Vercel and the backend to Render. See
[DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions and the
environment variables each side needs.

## Next steps

Things intentionally left out to keep the scope focused, and what I'd do next:

- **Automated tests** — unit tests for the cache (expiry) and the GitHub
  service (the not-found path), plus a couple of component tests.
- **Server-side sorting** — sorting currently happens in the browser, so a
  newly loaded page can interleave with already-sorted repos. Sorting on the
  server would keep sort and pagination perfectly consistent.
- **Shared/persistent cache** — swap the in-memory `Map` for something like
  Redis so the cache survives restarts and is shared across multiple servers.
- **Deep links** — put the searched username in the URL so a profile can be
  shared and reloaded directly.
- **Debounced search** and a synced input when clicking a recent search.
- **Dark mode** — the CSS variables make this a small change.
```
