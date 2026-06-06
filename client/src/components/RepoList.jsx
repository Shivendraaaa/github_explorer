import RepoCard from "./RepoCard.jsx";

// Renders the repositories: a header with a sort dropdown, then the list.
// It receives the already-sorted repos plus the current sort value and a
// function to call when the user changes it. App owns that state; this
// component just shows it and reports changes back up.
export default function RepoList({ repos, sort, onSortChange }) {
  return (
    <section>
      <div className="repo-list-header">
        <h3 className="repo-list-title">Repositories</h3>

        {/* Wrapping the select in a <label> means clicking "Sort by" focuses
            the dropdown, which is good for accessibility. */}
        <label className="sort-control">
          <span>Sort by</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="stars">Most stars</option>
            <option value="name">Name (A–Z)</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
      </div>

      <ul className="repo-list">
        {repos.map((repo) => (
          // React needs a stable, unique "key" for each item in a list so it
          // can update the list efficiently. A repo's id is perfect for this.
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </ul>
    </section>
  );
}
