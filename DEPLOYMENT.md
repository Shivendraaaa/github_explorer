# Deployment

The app is two parts, deployed separately:

- **Backend** (Express) → Render
- **Frontend** (Vite + React) → Vercel

Each one needs to know the other's URL, so deploy in this order to wire them
together correctly.

## 1. Deploy the backend to Render

1. Make sure this repo is pushed to GitHub.
2. On https://render.com, create a new **Web Service** from this repo, with:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - (Or connect the included [`render.yaml`](render.yaml) as a Blueprint,
     which fills all of this in for you.)
3. Add environment variables:
   - `GITHUB_TOKEN` — optional; raises the GitHub rate limit to 5000/hour.
   - `CLIENT_ORIGIN` — leave blank for now; you'll set it in step 3.
   - Do **not** set `PORT` — Render provides it automatically and the server
     already reads `process.env.PORT`.
4. Deploy, then copy the service URL, e.g.
   `https://github-explorer-server.onrender.com`.

## 2. Deploy the frontend to Vercel

1. On https://vercel.com, import this repo as a new project, with:
   - **Root directory:** `client`
   - **Framework preset:** Vite (auto-detected)
   - **Build command:** `npm run build` (default)
   - **Output directory:** `dist` (default)
2. Add an environment variable:
   - `VITE_API_URL` = the Render backend URL from step 1
     (e.g. `https://github-explorer-server.onrender.com`).
3. Deploy, then copy the frontend URL, e.g.
   `https://github-explorer.vercel.app`.

## 3. Lock down CORS

1. Back in Render, set `CLIENT_ORIGIN` to your Vercel frontend URL from step 2.
2. Render redeploys automatically when an environment variable changes.

Now the backend only accepts requests from your deployed frontend, and the
frontend points at your deployed backend.

## Environment variables summary

| Where  | Variable        | Purpose                                          |
|--------|-----------------|--------------------------------------------------|
| Render | `GITHUB_TOKEN`  | Optional; raises GitHub rate limit to 5000/hour  |
| Render | `CLIENT_ORIGIN` | The frontend URL that CORS will allow            |
| Render | `PORT`          | Provided automatically by Render                 |
| Vercel | `VITE_API_URL`  | The backend URL the frontend calls               |

## Note on free tiers

Render's free web services sleep after a period of inactivity, so the **first**
request after a while can take a few seconds while the server wakes up.
Requests after that are fast.
