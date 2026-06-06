// This file is the only place that talks to the real GitHub API.
// Keeping it separate means our routes don't need to know the details
// of how GitHub works, and it's easy to find and change later.

// The base address of GitHub's public REST API.
const GITHUB_API = "https://api.github.com";

// Build the headers we send to GitHub on every request.
function githubHeaders() {
  const headers = {
    // GitHub recommends this header so we always get the stable API format.
    Accept: "application/vnd.github+json",
  };

  // If a token is set in the environment, send it. A token raises our
  // rate limit from 60 requests/hour to 5000/hour. It lives only on the
  // server and is never sent to the browser, so it stays secret.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

// Fetch one user's public profile from GitHub.
export async function getUser(username) {
  // `fetch` is built into Node 18+, so we don't need a library like axios.
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: githubHeaders(),
  });

  // If GitHub did not return a success status (e.g. 404 for a missing
  // user), throw an error. We attach the status code so whoever calls
  // this function can tell a "not found" apart from other failures.
  if (!res.ok) {
    const error = new Error(`GitHub responded with ${res.status}`);
    error.status = res.status;
    throw error;
  }

  // GitHub sends back many fields. We keep only the ones the frontend
  // needs. This keeps our own API small and avoids exposing extra data.
  const data = await res.json();
  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
  };
}
