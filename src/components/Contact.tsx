"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowUpRight,
  ArrowUp,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { siteContent } from "@/lib/content";
import { ContactModal } from "./ContactModal";

export function Contact() {
  const { contact } = siteContent;
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Bangalore IST time
      const timeStr = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sagarsamrudh82@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        id="contact"
        className="relative w-full bg-[#E5E5E5] dark:bg-[#0E0E0E] text-[#111111] dark:text-white border-t border-[#BDBDBD] dark:border-[#262626] transition-colors duration-200 overflow-hidden"
      >
        {/* Subtle architectural background grid line */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#00A19C_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20 lg:py-20">
          {/* ========================================================= */}
          {/* TOP BAR: Availability Pill + Coordinates                 */}
          {/* ========================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 border-b border-[#BDBDBD]/60 dark:border-[#262626]">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/80 dark:bg-[#181818]/90 border border-[#BDBDBD]/60 dark:border-[#333333] flat-box">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A19C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A19C]" />
              </span>
              <span className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] dark:text-[#E0E0E0]">
                AVAILABLE FOR SELECT COMMISSIONS · 2026
              </span>
            </div>

            {/* Geographical Coordinates & Local Time */}
            <div className="flex items-center gap-4 text-xs font-heading font-semibold text-[#666666] dark:text-[#888888] tracking-widest uppercase">
              <span className="hidden md:inline">12.9716° N, 77.5946° E</span>
              <span className="hidden md:inline">·</span>
              <span>BANGALORE {currentTime && `[${currentTime} IST]`}</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* HERO FOOTER STATEMENT: Oversized Typographic Header      */}
          {/* ========================================================= */}
          <div className="py-12 md:py-16">
            <div className="max-w-4xl">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-[#80142B] dark:text-[#E03B5B] block mb-3">
                LET&apos;S COLLABORATE
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-[#111111] dark:text-white">
                HAVE A VISION?
                <br />
                <span className="text-[#80142B] dark:text-[#E03B5B]">LET&apos;S CREATE</span>{" "}
                <span className="text-[#00A19C] dark:text-[#00D1C7]">IMPACT.</span>
              </h2>
              <p className="mt-6 font-body text-xs sm:text-sm text-[#4A4A4A] dark:text-[#A0A0A0] max-w-xl leading-relaxed">
                Whether you need a complete corporate brand system, packaging architecture, or
                high-conversion campaign direction — reach out and let&apos;s build something remarkable.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BENTO ACTION GRID: Unique Interactive Designer Cards      */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {/* CARD 1: Email & Gmail */}
            <div className="group relative bg-white dark:bg-[#161616] border border-[#BDBDBD] dark:border-[#262626] p-6 flex flex-col justify-between flat-box transition-all duration-200 hover:border-[#00A19C] dark:hover:border-[#00D1C7]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#ECECEC] dark:bg-[#202020] text-[#00A19C] dark:text-[#00D1C7]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                    title="Copy email to clipboard"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-[#00A19C]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] mb-1">
                  DIRECT EMAIL
                </span>
                <p className="font-heading text-xs sm:text-sm font-bold text-[#111111] dark:text-white truncate">
                  sagarsamrudh82@gmail.com
                </p>
              </div>

              {/* Quick Gmail Button */}
              <div className="mt-6 pt-4 border-t border-[#ECECEC] dark:border-[#222222] flex items-center justify-between">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sagarsamrudh82@gmail.com&su=Project%20Inquiry%20via%20Portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-[11px] font-bold uppercase tracking-wider text-[#80142B] dark:text-[#E03B5B] hover:underline inline-flex items-center gap-1"
                >
                  <span>COMPOSE IN GMAIL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 2: Direct Call & WhatsApp */}
            <div className="group relative bg-white dark:bg-[#161616] border border-[#BDBDBD] dark:border-[#262626] p-6 flex flex-col justify-between flat-box transition-all duration-200 hover:border-[#80142B] dark:hover:border-[#E03B5B]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#ECECEC] dark:bg-[#202020] text-[#80142B] dark:text-[#E03B5B]">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] mb-1">
                  CALL / WHATSAPP
                </span>
                <p className="font-heading text-xs sm:text-sm font-bold text-[#111111] dark:text-white truncate">
                  +91 76192 71400
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECECEC] dark:border-[#222222] flex items-center justify-between">
                <a
                  href="https://wa.me/917619271400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-[11px] font-bold uppercase tracking-wider text-[#00A19C] dark:text-[#00D1C7] hover:underline inline-flex items-center gap-1"
                >
                  <span>CHAT ON WHATSAPP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 3: Behance & Visual Works */}
            <div className="group relative bg-white dark:bg-[#161616] border border-[#BDBDBD] dark:border-[#262626] p-6 flex flex-col justify-between flat-box transition-all duration-200 hover:border-[#00A19C] dark:hover:border-[#00D1C7]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#ECECEC] dark:bg-[#202020] text-[#111111] dark:text-white">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] mb-1">
                  BEHANCE ARCHIVE
                </span>
                <p className="font-heading text-xs sm:text-sm font-bold text-[#111111] dark:text-white truncate">
                  behance.net/samrudh-007
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECECEC] dark:border-[#222222] flex items-center justify-between">
                <a
                  href="https://www.behance.net/samrudh-007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white hover:underline inline-flex items-center gap-1"
                >
                  <span>VIEW LOOKBOOKS</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 4: Primary CTA Trigger */}
            <div
              onClick={() => setModalOpen(true)}
              className="group relative bg-[#111111] dark:bg-[#1F1F1F] text-white border border-[#111111] dark:border-[#333333] p-6 flex flex-col justify-between flat-box cursor-pointer transition-all duration-200 hover:bg-[#80142B] dark:hover:bg-[#80142B]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/10 text-white">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <Sparkles className="w-4 h-4 text-[#00D1C7] group-hover:text-white transition-colors" />
                </div>
                <span className="block font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0A0A0] group-hover:text-white/80 transition-colors mb-1">
                  INSTANT INQUIRY
                </span>
                <p className="font-heading text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                  START A CONVERSATION
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-[#00D1C7] group-hover:text-white transition-colors">
                  LAUNCH MODAL →
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM BAR: Minimalist Signature & Back to Top           */}
          {/* ========================================================= */}
          <div className="pt-8 border-t border-[#BDBDBD] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#555555] dark:text-[#888888]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-center sm:text-left">
              <p className="font-heading uppercase tracking-widest font-bold text-[#111111] dark:text-[#E0E0E0]">
                © 2026 SAMRUDH S. SAGAR
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="font-body text-[11px]">
                Brand Identity · Packaging Architecture · Social Direction
              </p>
            </div>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-[#111111] dark:text-[#D4D4D4] hover:text-[#00A19C] dark:hover:text-[#00D1C7] transition-colors cursor-pointer py-1 px-2 border border-transparent hover:border-[#BDBDBD] dark:hover:border-[#333333] flat-box"
              aria-label="Scroll back to top"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Global Contact Modal Dialog */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
