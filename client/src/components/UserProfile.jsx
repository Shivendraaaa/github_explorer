// Shows a GitHub user's public profile. It receives the profile object as a
// prop and only displays it — it does no data fetching of its own. Keeping
// "components that show data" separate from "code that fetches data" makes
// each piece simpler to understand and reuse.
export default function UserProfile({ profile }) {
  return (
    <section className="profile">
      <img
        className="profile-avatar"
        src={profile.avatar_url}
        alt={`${profile.login}'s avatar`}
        width="80"
        height="80"
      />

      <div className="profile-info">
        {/* A user's display name can be empty on GitHub, so fall back to
            their login (username) if there's no name. */}
        <h2 className="profile-name">{profile.name || profile.login}</h2>
        <p className="profile-login">@{profile.login}</p>

        {/* Bio is optional, so only show it when it exists. */}
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}

        <ul className="profile-stats">
          <li>
            <strong>{profile.followers}</strong> followers
          </li>
          <li>
            <strong>{profile.following}</strong> following
          </li>
          <li>
            <strong>{profile.public_repos}</strong> repos
          </li>
        </ul>
      </div>
    </section>
  );
}
