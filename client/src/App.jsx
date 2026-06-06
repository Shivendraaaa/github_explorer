import { useState } from "react";
// App.css holds all of our styles. Importing it here tells Vite to include it.
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import { getProfile } from "./api.js";

// App is the top-level component. It owns the app's state and decides what to
// render. For now it holds the fetched profile and wires up the search bar.
export default function App() {
  // The profile returned by our backend. null means "no search yet".
  const [profile, setProfile] = useState(null);

  // Runs when the user submits a username in the search bar.
  async function handleSearch(username) {
    try {
      const data = await getProfile(username);
      setProfile(data);
    } catch (error) {
      // A proper on-screen error message is added in a later step. For now we
      // just log it so a failed search doesn't break anything.
      console.error(error);
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

        {/* Temporary check that the round-trip to our backend works. In the
            next step we replace this with a proper profile card and add
            loading and error states. */}
        {profile && (
          <p>
            Found: <strong>{profile.login}</strong> ({profile.public_repos}{" "}
            public repos)
          </p>
        )}
      </main>
    </div>
  );
}
