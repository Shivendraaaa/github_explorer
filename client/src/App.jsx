import { useState } from "react";
// App.css holds all of our styles. Importing it here tells Vite to include it.
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import UserProfile from "./components/UserProfile.jsx";
import RepoList from "./components/RepoList.jsx";
import Loader from "./components/Loader.jsx";
import { getProfile, getRepos } from "./api.js";

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
  // True while we're waiting for the backend to respond.
  const [loading, setLoading] = useState(false);
  // Which sort order the user has picked. Default to "stars".
  const [sort, setSort] = useState("stars");

  // Runs when the user submits a username in the search bar.
  async function handleSearch(username) {
    setLoading(true);
    try {
      // Ask for the profile and the first page of repos at the same time
      // (in parallel), so the user waits for one round-trip instead of two.
      const [profileData, reposData] = await Promise.all([
        getProfile(username),
        getRepos(username),
      ]);
      setProfile(profileData);
      setRepos(reposData);
    } catch (error) {
      // A proper on-screen error message is added in a later step. For now we
      // just log it so a failed search doesn't break anything.
      console.error(error);
    } finally {
      // Whether it succeeded or failed, we're no longer loading.
      setLoading(false);
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
      </main>
    </div>
  );
}
