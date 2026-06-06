// Shows recently searched usernames as clickable pills. Clicking one searches
// for it again (via the onSelect function passed in from App). Renders nothing
// when the list is empty.
export default function RecentSearches({ items, onSelect }) {
  if (items.length === 0) return null;

  return (
    <div className="recent">
      <span className="recent-label">Recent:</span>
      <ul className="recent-list">
        {items.map((name) => (
          <li key={name}>
            <button
              type="button"
              className="recent-item"
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
