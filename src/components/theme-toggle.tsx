"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextMode = !isDark;
    root.classList.toggle("dark", nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode ? "dark" : "light");
    setIsDark(nextMode);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/80 bg-surface/80 text-fg hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
    >
      {mounted && isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
