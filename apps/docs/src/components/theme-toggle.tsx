"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition hover:border-accent hover:text-text"
      type="button"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
