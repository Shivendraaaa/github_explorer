import { useState } from "react";

// A small "controlled" form. "Controlled" means React holds the input's
// current text in state, so the component is the single source of truth for
// what the user has typed. The parent (App) is told the username only when
// the form is submitted, via the onSearch function passed in as a prop.
export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    // Forms reload the page by default when submitted. preventDefault stops
    // that so our React app stays in control.
    event.preventDefault();

    // Ignore empty or spaces-only input.
    const username = value.trim();
    if (!username) return;

    // Hand the cleaned username up to the parent to do the search.
    onSearch(username);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Enter a GitHub username..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="GitHub username"
      />
      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}
