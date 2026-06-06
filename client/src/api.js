// This file is the ONLY place the frontend talks to the network. Every
// function here calls OUR backend (never GitHub directly), which keeps the
// proxy/caching design intact and any API token safely on the server.

// The address of our backend. In development this defaults to the local
// server. In production we set VITE_API_URL (at build time) to the deployed
// backend's URL. import.meta.env is how Vite exposes environment variables.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// A small shared helper that does one GET request and returns the JSON.
// Our backend always replies with JSON, even for errors (e.g. { error: ... }).
async function request(path) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`);
  } catch {
    // fetch only rejects when the request can't be made at all, e.g. our
    // backend is down or there's no internet. Give a friendly message.
    throw new Error("Could not reach the server. Please try again.");
  }

  const data = await res.json();

  // If the backend returned an error status, throw with its message so the
  // calling code (and the UI) can show something useful to the user.
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// Get a user's profile from our backend.
// encodeURIComponent makes the username safe to drop into a URL.
export function getProfile(username) {
  return request(`/api/github/${encodeURIComponent(username)}`);
}

// Get one page of a user's repositories from our backend.
export function getRepos(username, page = 1) {
  return request(
    `/api/github/${encodeURIComponent(username)}/repos?page=${page}`
  );
}
