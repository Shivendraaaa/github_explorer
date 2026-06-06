// A small button that switches between light and dark themes. It receives the
// current theme and a toggle function from App, so App stays the single owner
// of the theme state (this component just shows it and reports clicks).
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle dark mode"
    >
      {/* Show the icon + label for the theme you'd switch TO. */}
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
