import { useState } from "react";
// App.css holds all of our styles. Importing it here tells Vite to include it.
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import UserProfile from "./components/UserProfile.jsx";
import Loader from "./components/Loader.jsx";
import { getProfile } from "./api.js";

// App is the top-level component. It owns the app's state and decides what to
// render based on that state.
export default function App() {
  // The profile returned by our backend. null means "no search yet".
  const [profile, setProfile] = useState(null);
  // True while we're waiting for the backend to respond.
  const [loading, setLoading] = useState(false);

  // Runs when the user submits a username in the search bar.
  async function handleSearch(username) {
    setLoading(true);
    try {
      const data = await getProfile(username);
      setProfile(data);
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

        {/* While waiting, show the loading skeleton. Once we have a profile
            (and are no longer loading), show the profile card. */}
        {loading && <Loader />}
        {!loading && profile && <UserProfile profile={profile} />}
      </main>
    </div>
  );
}
