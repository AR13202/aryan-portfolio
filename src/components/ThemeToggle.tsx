"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the active theme from documentElement attribute (which is set by our head script)
    const activeTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    setTimeout(() => {
      if (activeTheme) {
        setTheme(activeTheme);
      } else {
        // Fallback if script didn't run
        const saved = localStorage.getItem("theme") as "dark" | "light" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initial = saved || systemTheme;
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
      }
      setMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  if (!mounted) {
    // Render a skeleton button to avoid hydration mismatch layout shift
    return (
      <button className="theme-btn" aria-label="Toggle colour scheme">
        <span className="t-icon">◐</span>
        <span>Light</span>
      </button>
    );
  }

  return (
    <button
      className="theme-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className="t-icon">{theme === "dark" ? "◐" : "◑"}</span>
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
