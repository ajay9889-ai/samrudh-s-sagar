"use client";

import React from "react";
import Link from "next/link";
import { siteContent } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { header } = siteContent;

  return (
    <header className="w-full bg-[#F7F7F7] dark:bg-[#121212] border-b border-[#BDBDBD] dark:border-[#262626] px-6 py-5 md:px-12 lg:px-20 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Column: 2-line caps tagline */}
        <div className="w-1/3 text-left">
          <p className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#111111] dark:text-[#EAEAEA] leading-tight">
            <span>DESIGNING VISUAL</span>
            <br />
            <span>STORIES THAT WORK</span>
          </p>
        </div>

        {/* Center: Split Initials Logo S / S */}
        <div className="w-1/3 flex justify-center items-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80142B] dark:focus-visible:ring-[#00D1C7]"
            aria-label="Samrudh S. Sagar Home"
          >
            <div className="relative flex items-center font-heading text-base sm:text-lg font-bold tracking-widest text-[#111111] dark:text-[#FFFFFF]">
              <span className="font-extrabold text-sm sm:text-base">S</span>
              <span className="mx-1 text-[#00A19C] dark:text-[#00D1C7] font-light text-base sm:text-lg select-none">/</span>
              <span className="font-extrabold text-sm sm:text-base">S</span>
            </div>
          </Link>
        </div>

        {/* Right Column: Theme Toggle + 2-line caps Portfolio 2026 */}
        <div className="w-1/3 flex items-center justify-end gap-3 sm:gap-5">
          <ThemeToggle />
          <p className="hidden sm:block font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#111111] dark:text-[#EAEAEA] leading-tight text-right">
            <span>PORTFOLIO</span>
            <br />
            <span>2026</span>
          </p>
        </div>
      </div>
    </header>
  );
}

