"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, Mail, ExternalLink, LogOut } from "lucide-react";

interface AdminNavProps {
  unreadCount?: number;
}

export function AdminNav({ unreadCount: initialUnreadCount }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount || 0);

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/admin/messages");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // Ignore background polling error
      }
    };

    fetchUnread();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
      active: pathname.startsWith("/admin/projects"),
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: Mail,
      active: pathname.startsWith("/admin/messages"),
      badge: unreadCount,
    },
  ];

  return (
    <header className="w-full bg-white border-b border-[#BDBDBD] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin/projects"
            className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-[#111111] flex items-center gap-2"
          >
            <span>SAMRUDH PORTFOLIO</span>
            <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5 tracking-widest">
              ADMIN
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
                    item.active
                      ? "text-[#80142B] border-b-2 border-[#80142B]"
                      : "text-[#4A4A4A] hover:text-[#111111]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#80142B] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Public site link & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-semibold text-[#4A4A4A] hover:text-[#111111] border border-[#BDBDBD] hover:border-[#111111] transition-colors"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-semibold text-[#80142B] hover:bg-[#80142B] hover:text-white border border-[#80142B] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
