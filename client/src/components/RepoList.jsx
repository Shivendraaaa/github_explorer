import RepoCard from "./RepoCard.jsx";

// Renders the list of repositories. It receives the repos array as a prop and
// turns each repo into a RepoCard.
export default function RepoList({ repos }) {
  return (
    <section>
      <h3 className="repo-list-title">Repositories</h3>
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
