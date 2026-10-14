"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/lib/content";

const TICKER_ITEMS = [
  "BRANDING & IDENTITY",
  "SOCIAL MEDIA CREATIVES",
  "PACKAGING DESIGN",
  "PRINT & EDITORIAL",
  "MOTION GRAPHICS",
  "VISUAL STORYTELLING",
  "CORPORATE IDENTITY",
  "ART DIRECTION",
];


export function Hero() {
  const { hero } = siteContent;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#F8F8F8] dark:bg-[#111111] border-b border-[#BDBDBD] dark:border-[#262626] transition-colors duration-200"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      {/* Architectural grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,161,156,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,161,156,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner accent marks */}
      <div className="absolute top-8 left-8 w-5 h-5 border-l-2 border-t-2 border-[#00A19C]/25 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-8 right-8 w-5 h-5 border-r-2 border-t-2 border-[#00A19C]/25 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-12 left-8 w-5 h-5 border-l-2 border-b-2 border-[#00A19C]/25 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-12 right-8 w-5 h-5 border-r-2 border-b-2 border-[#00A19C]/25 pointer-events-none" aria-hidden="true" />

      {/* ============================================================ */}
      {/* UNIFIED DESIGNER LOCKUP (matches hero-lockup-2x.png)         */}
      {/* ============================================================ */}
      <div
        className="relative mx-auto max-w-7xl w-full flex items-center justify-center px-4 sm:px-8 lg:px-12"
        style={{ minHeight: "calc(100vh - 73px)", paddingBottom: "48px", paddingTop: "24px" }}
      >
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          
          {/* Top Meta Row */}
          <div
            className="w-full flex items-center justify-between mb-4 sm:mb-6 transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-10px)",
              transitionDelay: "100ms",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A19C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A19C]" />
              </span>
              <span className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-[#4A4A4A] dark:text-[#A0A0A0]">
                AVAILABLE FOR COMMISSIONS · 2026
              </span>
            </div>
            <span className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-[#BDBDBD] dark:text-[#444444] hidden sm:block">
              PORTFOLIO ARCHIVE
            </span>
          </div>

          {/* Core Master Lockup: Live Typography + Leaning Person on 'H' */}
          <div className="relative w-full flex flex-col lg:flex-row items-center justify-between">
            
            {/* Left side: Editorial Typography */}
            <div className="flex flex-col z-10 w-full lg:w-auto">
              
              {/* Giant Name Typography with Anton font */}
              <div
                className="transition-all duration-1000"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-30px)",
                  transitionDelay: "200ms",
                }}
              >
                <h1
                  className="font-anton uppercase leading-[0.85] tracking-tight text-[#111111] dark:text-white select-none text-[clamp(4.2rem,9.5vw,9.5rem)]"
                  aria-label="Samrudh S. Sagar"
                >
                  <span className="block">{hero.firstName}</span>
                  <span className="block mt-1 sm:mt-2">
                    <span className="text-[#80142B] dark:text-[#E03B5B]">S.</span>{" "}
                    <span>SAGAR</span>
                  </span>
                </h1>
              </div>

              {/* Accent Line & Designer Details (directly matches hero-lockup-2x.png) */}
              <div
                className="mt-3 sm:mt-4 transition-all duration-700"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-20px)",
                  transitionDelay: "450ms",
                }}
              >
                {/* Horizontal Teal Bar directly under S. */}
                <div className="w-14 sm:w-16 h-[3px] bg-[#00A19C] dark:bg-[#00D1C7] mb-4" aria-hidden="true" />

                <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-[#80142B] dark:text-[#E03B5B] mb-2">
                  {hero.role}
                </p>
                <p className="font-body text-xs sm:text-sm text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed max-w-sm sm:max-w-md mb-6">
                  {hero.tagline}
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-heading text-[11px] font-bold uppercase tracking-[0.18em] flat-box transition-colors hover:bg-[#80142B] dark:hover:bg-[#00D1C7] cursor-pointer"
                  >
                    <span>VIEW WORK</span>
                    <span>→</span>
                  </Link>
                  <a
                    href="https://www.behance.net/samrudh-007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#181818] border border-[#BDBDBD] dark:border-[#333333] text-[#111111] dark:text-white font-heading text-[11px] font-bold uppercase tracking-[0.18em] flat-box transition-colors hover:border-[#00A19C] hover:text-[#00A19C] dark:hover:border-[#00D1C7] dark:hover:text-[#00D1C7] cursor-pointer shadow-sm"
                  >
                    <span>BEHANCE</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right side: The Person Leaning directly onto 'H' */}
            <div
              className="relative flex-shrink-0 -mt-6 sm:-mt-10 lg:mt-0 lg:-ml-16 xl:-ml-20 z-20 flex items-center justify-center transition-all duration-1000"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "scale(1)" : "scale(0.96)",
                transitionDelay: "300ms",
              }}
            >
              {/* Soft Pastel Mint Circle (matches hero-lockup-2x.png) */}
              <div
                className="absolute rounded-full w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[470px] lg:h-[470px] bg-[#D6ECE9] dark:bg-[#00A19C]/20 border border-[#C5E4E0] dark:border-[#00A19C]/30 transition-colors pointer-events-none -z-10 shadow-sm"
                style={{ top: "14%", left: "10%" }}
                aria-hidden="true"
              />

              {/* Floating tags */}
              <div className="absolute top-4 right-0 flex flex-col gap-2 z-30 hidden lg:flex items-end">
                {["EDITORIAL", "SOCIAL MEDIA", "MOTION"].map((tag, i) => (
                  <span
                    key={tag}
                    className="font-heading text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 bg-white/95 dark:bg-[#181818]/95 border border-[#BDBDBD]/70 dark:border-[#333333] text-[#4A4A4A] dark:text-[#999999] backdrop-blur-sm shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Person Cutout with Uncut Head & Leaning Hand */}
              <Image
                src="/samrudh-person-transparent.png"
                alt="Samrudh S. Sagar — Graphic Designer"
                width={465}
                height={630}
                className="w-auto h-[440px] sm:h-[520px] lg:h-[600px] xl:h-[640px] max-w-full object-contain select-none pointer-events-none drop-shadow-xl"
                priority
              />

              {/* Location Badge */}
              <div
                className="absolute bottom-8 left-4 bg-white/95 dark:bg-[#1A1A1A]/95 border border-[#BDBDBD] dark:border-[#333333] px-3.5 py-2.5 backdrop-blur-sm hidden sm:block shadow-sm"
              >
                <p className="font-heading text-[9px] font-bold uppercase tracking-[0.25em] text-[#777777] dark:text-[#888888]">BASED IN</p>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white mt-0.5">BANGALORE, IN</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MARQUEE TICKER STRIP — Bottom                                 */}
      {/* ============================================================ */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#BDBDBD] dark:border-[#1A1A1A] bg-[#111111] dark:bg-[#0A0A0A] overflow-hidden h-9 flex items-center">
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: "hero-ticker 28s linear infinite" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <React.Fragment key={i}>
              <span className="font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 px-6">
                {item}
              </span>
              <span className="text-[#00A19C] text-[8px]" aria-hidden="true">◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
