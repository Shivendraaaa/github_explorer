// App.css holds all of our styles. Importing it here tells Vite to include
// it in the page.
import "./App.css";

// App is the top-level component of the whole frontend. Right now it's just
// the page "shell": a header with the title, and an empty main area where
// the search bar, profile, and repo list will go in the next steps.
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">GitHub Repo Explorer</h1>
        <p className="app-subtitle">
          Search a GitHub username to see their profile and public repositories.
        </p>
      </header>

      <main className="app-main">
        {/* Search bar, profile, and repo list will be added here. */}
      </main>
    </div>
  );
}
