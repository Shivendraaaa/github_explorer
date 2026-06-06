import { useState } from "react";

// Turn an ISO date string (e.g. "2026-06-03T19:56:34Z") into a short,
// readable date like "Jun 3, 2026".
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// One repository shown as a card. Clicking the header expands the card to
// reveal extra details (open issues, default branch, link). That data is
// already part of the repos response, so expanding needs NO extra request.
export default function RepoCard({ repo }) {
  // Each card remembers on its own whether it is expanded.
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="repo-card">
      {/* A <button> for the clickable header so it's keyboard-accessible for
          free (focusable, responds to Enter/Space). aria-expanded tells
          screen readers whether the extra details are open. */}
      <button
        className="repo-header"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <span className="repo-name">{repo.name}</span>
        <span className="repo-stars">★ {repo.stargazers_count}</span>
      </button>

      {/* Description is optional, so only show it when present. */}
      {repo.description && <p className="repo-description">{repo.description}</p>}

      <div className="repo-meta">
        {repo.language && <span className="repo-language">{repo.language}</span>}
        <span>Updated {formatDate(repo.updated_at)}</span>
      </div>

      {/* Extra details, rendered only while expanded. */}
      {expanded && (
        <dl className="repo-details">
          <div>
            <dt>Open issues</dt>
            <dd>{repo.open_issues_count}</dd>
          </div>
          <div>
            <dt>Default branch</dt>
            <dd>{repo.default_branch}</dd>
          </div>
          <div>
            <dt>Link</dt>
            <dd>
              {/* rel="noopener noreferrer" is a safety habit for links that
                  open a new tab: it stops the new page from accessing ours. */}
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </dd>
          </div>
        </dl>
      )}
    </li>
  );
}
