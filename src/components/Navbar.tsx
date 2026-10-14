"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Mail } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ContactModal } from "./ContactModal";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS", href: "/projects", badge: "3D ORBIT" },
    { label: "SKILLS", href: "/#skills" },
    { label: "EXPERIENCE", href: "/#experience" },
    { label: "CONTACT", href: "/#contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/80 dark:bg-[#111111]/85 shadow-sm border-b border-[#BDBDBD]/50 dark:border-[#262626]/70"
            : "backdrop-blur-md bg-white/65 dark:bg-[#111111]/70 border-b border-[#BDBDBD]/35 dark:border-[#262626]/50"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          {/* ========================================================= */}
          {/* LEFT: Branding Tagline & Main Nav Links                   */}
          {/* ========================================================= */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80142B] dark:focus-visible:ring-[#00D1C7]"
              aria-label="Samrudh S. Sagar Portfolio"
            >
              <div className="flex items-center font-heading text-lg font-black tracking-widest text-[#111111] dark:text-white">
                <span>S</span>
                <span className="mx-0.5 text-[#00A19C] dark:text-[#00D1C7] select-none font-light">/</span>
                <span>S</span>
              </div>
              <span className="hidden lg:inline-block ml-3 pl-3 border-l border-[#BDBDBD]/60 dark:border-[#333333] font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-[#555555] dark:text-[#A0A0A0]">
                SAMRUDH S. SAGAR
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative font-heading text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
                      isActive
                        ? "text-[#00A19C] dark:text-[#00D1C7]"
                        : "text-[#4A4A4A] dark:text-[#B0B0B0] hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1.5 px-1 py-0.2 bg-[#00A19C]/15 dark:bg-[#00D1C7]/15 text-[#00A19C] dark:text-[#00D1C7] text-[9px] font-extrabold tracking-widest rounded-xs">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00A19C] dark:bg-[#00D1C7]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Actions, Theme Toggle, Contact CTA                 */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {/* Contact CTA Button (Desktop) */}
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#80142B] dark:hover:bg-[#00D1C7] font-heading text-[11px] font-bold uppercase tracking-wider flat-box transition-colors duration-200 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>MESSAGE</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111111] dark:text-white hover:text-[#80142B] dark:hover:text-[#00D1C7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80142B]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE GLASSY DRAWER                                      */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-2xl bg-white/95 dark:bg-[#111111]/95 border-b border-[#BDBDBD] dark:border-[#262626] px-6 py-6 transition-all duration-200 shadow-xl">
            <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between font-heading text-sm font-bold uppercase tracking-wider py-2 border-b border-[#EEEEEE] dark:border-[#222222] ${
                      isActive
                        ? "text-[#00A19C] dark:text-[#00D1C7]"
                        : "text-[#333333] dark:text-[#D4D4D4] hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="px-2 py-0.5 bg-[#00A19C]/15 text-[#00A19C] text-[10px] font-extrabold tracking-widest">
                        {item.badge}
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-[#888888]" />
                    )}
                  </Link>
                );
              })}

              <div className="pt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setContactModalOpen(true);
                  }}
                  className="w-full py-3 bg-[#00A19C] text-white font-heading text-xs font-bold uppercase tracking-widest flat-box text-center cursor-pointer"
                >
                  SEND A MESSAGE
                </button>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sagarsamrudh82@gmail.com&su=Project%20Inquiry%20via%20Portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 border border-[#80142B] dark:border-[#E03B5B] text-[#80142B] dark:text-[#E03B5B] font-heading text-xs font-bold uppercase tracking-widest flat-box text-center"
                >
                  COMPOSE IN GMAIL
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Contact Modal triggered from Navbar */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  );
}
