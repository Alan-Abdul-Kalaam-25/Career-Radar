import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getMe, logout } from "../utils/auth";
import type { User } from "../utils/types";
import { applyTheme } from "../utils/theme";
import type { ThemePreference } from "../utils/theme";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Career Finder", to: "/career" },
  { label: "Resources", to: "/resources" },
  { label: "History", to: "/history" },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof document === "undefined") return "dark";
    const existing = document.documentElement.dataset.theme;
    return existing === "light" || existing === "dark" ? existing : "dark";
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMe()
      .then((u) => {
        if (!active) return;
        setUser(u);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const initials = useMemo(() => {
    if (!user) return "";
    const first = user.firstName?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [user]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-xs font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white dark:bg-white/15 dark:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;

  const themeAria =
    theme === "dark" ? "Activate light theme" : "Activate dark theme";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 px-3 py-2 text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-2 py-1 text-base font-semibold tracking-tight text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-blue-500/80">
            CR
          </span>
          <span className="hidden text-sm sm:inline">Career Radar</span>
        </Link>
        <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {user &&
            links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navItemClass}>
                {link.label}
              </NavLink>
            ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeAria}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/60 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/30 dark:hover:text-white"
          >
            <ThemeIcon />
          </button>
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Create account
              </Link>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold uppercase text-white dark:bg-blue-500/70">
                  {initials || "CR"}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[0.6rem] uppercase text-slate-500 dark:text-slate-400">
                    Signed in
                  </span>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200/60 px-3 py-2 text-xs font-semibold text-red-500 transition hover:border-red-400 hover:bg-red-50 dark:border-white/10 dark:text-red-200 dark:hover:border-red-400/60 dark:hover:bg-red-500/10"
              >
                Log out
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeAria}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/60 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/30 dark:hover:text-white"
          >
            <ThemeIcon />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/60 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/30 dark:hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mt-2 rounded-3xl border border-slate-200/60 bg-white/95 px-3 py-5 text-slate-700 shadow-lg dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-200 md:hidden">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/5">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Signed in
                  </p>
                  <p className="text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-white dark:bg-blue-500/70">
                  {initials || "CR"}
                </span>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white dark:border-white/10 dark:bg-white/15"
                          : "border-slate-200/70 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:border-red-400 hover:bg-red-50 dark:border-red-400/60 dark:text-red-200 dark:hover:bg-red-500/10"
                >
                  Log out
                </button>
              </nav>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-slate-200/70 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z"
      />
    </svg>
  );
}
