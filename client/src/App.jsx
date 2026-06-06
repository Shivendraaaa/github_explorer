import { useState } from "react";
// App.css holds all of our styles. Importing it here tells Vite to include it.
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import UserProfile from "./components/UserProfile.jsx";
import RepoList from "./components/RepoList.jsx";
import Loader from "./components/Loader.jsx";
import { getProfile, getRepos } from "./api.js";

// GitHub returns up to this many repos per page (our backend asks for 30).
// We use it to decide whether there might be another page to load: if a page
// comes back full, there may be more; if it's short, we've reached the end.
const PER_PAGE = 30;

// Return a NEW array of repos sorted by the chosen option. We sort on the
// client (in the browser) because we already have all the repos, so there's
// no need to ask the server again just to reorder them.
function sortRepos(repos, sort) {
  // Copy the array first. Array.sort() reorders in place, and we must never
  // change the array that lives in React state directly.
  const copy = [...repos];

  if (sort === "name") {
    // A to Z. localeCompare handles letters/casing in a sensible order.
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "updated") {
    // Most recently updated first. Subtracting two dates gives the time
    // difference; b - a puts the newer (larger) date first.
    return copy.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  // Default: most stars first.
  return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
}

// App is the top-level component. It owns the app's state and decides what to
// render based on that state.
export default function App() {
  // The profile returned by our backend. null means "no search yet".
  const [profile, setProfile] = useState(null);
  // The list of repositories for the searched user. Starts as an empty array.
  const [repos, setRepos] = useState([]);
  // True while we're waiting for the first search to respond.
  const [loading, setLoading] = useState(false);
  // Which sort order the user has picked. Default to "stars".
  const [sort, setSort] = useState("stars");
  // Remember the searched username and the current page so "Load more" knows
  // whose next page to fetch.
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  // Whether there might be more repos to load, and whether a load-more
  // request is currently running (used to disable the button).
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Runs when the user submits a username in the search bar.
  async function handleSearch(name) {
    setLoading(true);
    setUsername(name);
    try {
      // Ask for the profile and the first page of repos at the same time
      // (in parallel), so the user waits for one round-trip instead of two.
      const [profileData, reposData] = await Promise.all([
        getProfile(name),
        getRepos(name, 1),
      ]);
      setProfile(profileData);
      setRepos(reposData);
      setPage(1);
      // A full page means there may be more pages to load.
      setHasMore(reposData.length === PER_PAGE);
    } catch (error) {
      // A proper on-screen error message is added in a later step. For now we
      // just log it so a failed search doesn't break anything.
      console.error(error);
    } finally {
      // Whether it succeeded or failed, we're no longer loading.
      setLoading(false);
    }
  }

  // Runs when the user clicks "Load more".
  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const more = await getRepos(username, nextPage);
      // Add the new repos onto the end of the list we already have. Using the
      // updater form (current => ...) is the safe way to build on previous
      // state.
      setRepos((current) => [...current, ...more]);
      setPage(nextPage);
      setHasMore(more.length === PER_PAGE);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }

  // Work out the order to display in. This recomputes on every render, which
  // is cheap for a list this small.
  const sortedRepos = sortRepos(repos, sort);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">GitHub Repo Explorer</h1>
        <p className="app-subtitle">
          Search a GitHub username to see their profile and public repositories.
        </p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} />

        {/* While waiting, show the loading skeleton. Otherwise show the
            profile card and the repo list once we have them. */}
        {loading && <Loader />}
        {!loading && profile && <UserProfile profile={profile} />}
        {!loading && repos.length > 0 && (
          <RepoList repos={sortedRepos} sort={sort} onSortChange={setSort} />
        )}

        {/* Show "Load more" only when there may be another page. The button
            disables itself while a load is in progress. */}
        {!loading && hasMore && (
          <button
            className="load-more"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        )}
      </main>
    </div>
  );
}
