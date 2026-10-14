"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/projects";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials.");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-[#BDBDBD] bg-white p-8 sm:p-10 flat-box">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#80142B]">
          AUTHENTICATION
        </span>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-[#111111] mt-1">
          ADMIN LOGIN
        </h1>
        <div className="w-12 h-1 bg-[#00A19C] mx-auto mt-3" />
      </div>

      {error && (
        <div className="mb-6 p-3 bg-[#80142B]/10 border border-[#80142B] flex items-start gap-2.5 text-xs text-[#80142B]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="admin-email"
            className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#80142B] absolute left-3.5 top-3" />
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@samrudh.design"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#80142B] focus:outline-none flat-box"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#80142B] absolute left-3.5 top-3" />
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#80142B] focus:outline-none flat-box"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-xs font-bold uppercase tracking-[0.2em] flat-box transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "LOGGING IN..." : "SIGN IN TO DASHBOARD"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6">
      <Suspense fallback={<div className="text-sm font-heading">Loading...</div>}>
        <LoginForm />
      </Suspense>
      <div className="mt-8 text-center text-xs text-[#777777] font-body">
        Samrudh S. Sagar Portfolio Admin · Protected Area
      </div>
    </div>
  );
}
