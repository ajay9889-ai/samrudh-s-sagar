"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-[84px] h-[30px] border border-[#BDBDBD] dark:border-[#333333] opacity-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-heading font-bold uppercase tracking-[0.2em] border border-[#BDBDBD] dark:border-[#333333] bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-[#F5F5F5] hover:border-[#80142B] dark:hover:border-[#A8203B] hover:text-[#80142B] dark:hover:text-[#A8203B] transition-colors flat-box cursor-pointer select-none"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#00D1C7]" aria-hidden="true" />
          <span>LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#80142B]" aria-hidden="true" />
          <span>DARK</span>
        </>
      )}
    </button>
  );
}
