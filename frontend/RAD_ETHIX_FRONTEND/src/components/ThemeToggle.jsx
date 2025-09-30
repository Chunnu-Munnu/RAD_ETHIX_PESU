import React from "react";

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            title="Switch theme">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
