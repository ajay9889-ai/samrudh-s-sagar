"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus management and Esc key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#111111] dark:border-[#333333] p-6 sm:p-10 shadow-none flat-box transition-colors"
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1 text-[#111111] dark:text-[#EAEAEA] hover:text-[#80142B] dark:hover:text-[#E03B5B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80142B]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#80142B] dark:text-[#E03B5B]">
            GET IN TOUCH
          </span>
          <h2
            id="contact-modal-title"
            className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111111] dark:text-[#FFFFFF] mt-1"
          >
            SEND A MESSAGE
          </h2>
          <div className="w-[74px] h-[3px] bg-[#00A19C] mt-3" aria-hidden="true" />
        </div>

        {/* Live Status Region */}
        <div aria-live="polite" className="sr-only">
          {success && "Thanks, your message has been sent."}
          {error && error}
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-[#00A19C] mx-auto" />
            <h3 className="font-heading text-lg font-bold uppercase text-[#111111] dark:text-[#FFFFFF]">
              MESSAGE SENT
            </h3>
            <p className="font-body text-sm text-[#4A4A4A] dark:text-[#A0A0A0] max-w-xs mx-auto">
              Thanks, your message has been sent. I will get back to you shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-xs font-bold uppercase tracking-widest flat-box transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-[#80142B]/10 border border-[#80142B] flex items-start gap-2.5 text-xs text-[#80142B] dark:text-[#E03B5B]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Honeypot field (hidden from users, traps bots) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_field">Do not fill this field</label>
              <input
                id="hp_field"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="contact-name"
                className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#EAEAEA] mb-1"
              >
                Your Name <span className="text-[#80142B] dark:text-[#E03B5B]">*</span>
              </label>
              <input
                id="contact-name"
                ref={nameInputRef}
                type="text"
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-[#BDBDBD] dark:border-[#333333] text-sm text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#999999] dark:placeholder:text-[#666666] focus:border-[#80142B] dark:focus:border-[#00D1C7] focus:outline-none flat-box transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="contact-email"
                className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#EAEAEA] mb-1"
              >
                Email Address <span className="text-[#80142B] dark:text-[#E03B5B]">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-[#BDBDBD] dark:border-[#333333] text-sm text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#999999] dark:placeholder:text-[#666666] focus:border-[#80142B] dark:focus:border-[#00D1C7] focus:outline-none flat-box transition-colors"
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="contact-message"
                className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-[#EAEAEA] mb-1"
              >
                Project Details / Message <span className="text-[#80142B] dark:text-[#E03B5B]">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                minLength={10}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your brand, project timeline, or goals..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-[#BDBDBD] dark:border-[#333333] text-sm text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#999999] dark:placeholder:text-[#666666] focus:border-[#80142B] dark:focus:border-[#00D1C7] focus:outline-none flat-box resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-xs font-bold uppercase tracking-[0.2em] flat-box transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? "SENDING..." : "SEND MESSAGE VIA SITE"}</span>
              </button>

              {/* Direct Gmail Composer Alternative */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#BDBDBD] dark:border-[#333333]" />
                <span className="shrink-0 mx-3 font-heading text-[10px] uppercase tracking-wider text-[#777777]">
                  OR USE GMAIL DIRECTLY
                </span>
                <div className="flex-grow border-t border-[#BDBDBD] dark:border-[#333333]" />
              </div>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=sagarsamrudh82@gmail.com&su=${encodeURIComponent(
                  name ? `Design Inquiry from ${name}` : "Project Inquiry for Samrudh S. Sagar"
                )}&body=${encodeURIComponent(
                  message || "Hi Samrudh,\n\nI came across your portfolio and would like to discuss a project..."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 border border-[#80142B] dark:border-[#E03B5B] text-[#80142B] dark:text-[#E03B5B] hover:bg-[#80142B] hover:text-white dark:hover:bg-[#E03B5B] dark:hover:text-[#111111] font-heading text-xs font-bold uppercase tracking-[0.15em] flat-box transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>OPEN IN GMAIL WEB APP</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
