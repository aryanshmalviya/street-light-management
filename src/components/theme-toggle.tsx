"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={mode === "dark"}
    >
      <span className="sr-only">
        {mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
      {mode === "dark" ? (
        <svg
          className="theme-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          className="theme-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 4.2a.9.9 0 0 1 .9-.9h.2a.9.9 0 1 1 0 1.8h-.2a.9.9 0 0 1-.9-.9Zm0 15.9a.9.9 0 0 1 .9-.9h.2a.9.9 0 1 1 0 1.8h-.2a.9.9 0 0 1-.9-.9Zm7.9-7.9a.9.9 0 0 1-.9.9h-.2a.9.9 0 1 1 0-1.8h.2a.9.9 0 0 1 .9.9ZM5.1 12.2a.9.9 0 0 1-.9.9H4a.9.9 0 0 1 0-1.8h.2a.9.9 0 0 1 .9.9Zm11.6-5.7a.9.9 0 0 1 0-1.3l.1-.1a.9.9 0 1 1 1.3 1.3l-.1.1a.9.9 0 0 1-1.3 0Zm-9.4 9.4a.9.9 0 0 1 0-1.3l.1-.1a.9.9 0 1 1 1.3 1.3l-.1.1a.9.9 0 0 1-1.3 0Zm9.5 1.3a.9.9 0 0 1 1.3 0l.1.1a.9.9 0 0 1-1.3 1.3l-.1-.1a.9.9 0 0 1 0-1.3ZM7.2 7.1a.9.9 0 0 1 1.3 0l.1.1A.9.9 0 0 1 7.3 8.5l-.1-.1a.9.9 0 0 1 0-1.3ZM12 8.1a4 4 0 1 1 0 7.9 4 4 0 0 1 0-7.9Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
