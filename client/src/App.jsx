import { useState } from "react";
// App.css holds all of our styles. Importing it here tells Vite to include it.
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import UserProfile from "./components/UserProfile.jsx";
import RepoList from "./components/RepoList.jsx";
import Loader from "./components/Loader.jsx";
import { getProfile, getRepos } from "./api.js";

// App is the top-level component. It owns the app's state and decides what to
// render based on that state.
export default function App() {
  // The profile returned by our backend. null means "no search yet".
  const [profile, setProfile] = useState(null);
  // The list of repositories for the searched user. Starts as an empty array.
  const [repos, setRepos] = useState([]);
  // True while we're waiting for the backend to respond.
  const [loading, setLoading] = useState(false);

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
        {!loading && repos.length > 0 && <RepoList repos={repos} />}
      </main>
    </div>
  );
}
