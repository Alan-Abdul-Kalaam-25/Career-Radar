const THEME_KEY = "cr-theme";

export type ThemePreference = "light" | "dark";

function getStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function detectSystemTheme(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.setProperty("color-scheme", theme);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme);
  }
}

export function initTheme(): ThemePreference {
  const theme = getStoredTheme() ?? detectSystemTheme();
  applyTheme(theme);
  return theme;
}
