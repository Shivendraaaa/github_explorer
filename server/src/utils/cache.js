// A tiny in-memory cache with a time-to-live (TTL).
//
// Why we need it: every request to our API would otherwise hit GitHub.
// GitHub limits how many requests we can make per hour, and repeat calls
// for the same user are wasteful. By remembering each response for a short
// time, many visitors can share one GitHub call, and repeat requests come
// back instantly.
//
// "In-memory" means it lives in this running program's memory. It's simple
// and needs no database, but it's cleared whenever the server restarts.

// A Map is a built-in key/value store. We use it to hold cached entries.
const store = new Map();

// How long an entry stays fresh: 60 seconds, written in milliseconds.
const TTL_MS = 60 * 1000;

// Read a value from the cache.
// Returns the stored value if it exists and is still fresh, otherwise
// returns undefined (which the caller treats as "not cached").
export function get(key) {
  const entry = store.get(key);

  // Nothing was ever stored for this key.
  if (!entry) return undefined;

  // The entry exists but has expired. Delete it so the Map doesn't keep
  // growing with stale data, and report it as a miss.
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  // Still fresh: hand back the stored value.
  return entry.value;
}

// Save a value in the cache. We record when it should expire so `get`
// can later decide whether it is still fresh.
export function set(key, value) {
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
