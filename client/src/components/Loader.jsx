// A loading "skeleton": grey placeholder shapes shown while we wait for the
// backend to respond. It mirrors the profile card's layout so the page
// doesn't jump around when the real content appears. aria-hidden hides these
// decorative shapes from screen readers.
export default function Loader() {
  return (
    <section className="profile skeleton" aria-hidden="true">
      <div className="skeleton-avatar"></div>

      <div className="profile-info">
        <div className="skeleton-line skeleton-line-lg"></div>
        <div className="skeleton-line skeleton-line-md"></div>
        <div className="skeleton-line skeleton-line-sm"></div>
      </div>
    </section>
  );
}
