"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  Mail,
  MailOpen,
  Trash2,
  AlertTriangle,
  Loader2,
  Calendar,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading messages";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (message: ContactMessage) => {
    const updatedRead = !message.read;
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, read: updatedRead } : m))
    );
    setUnreadCount((prev) => (updatedRead ? Math.max(0, prev - 1) : prev + 1));

    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: updatedRead }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch {
      fetchMessages();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/messages/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (!deleteTarget.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setDeleteTarget(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <AdminNav unreadCount={unreadCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#BDBDBD]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111111]">
                INBOX &amp; MESSAGES
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-[#80142B] text-white text-xs font-heading font-bold rounded-full">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            <p className="font-body text-xs sm:text-sm text-[#4A4A4A] mt-1">
              Contact messages sent from the portfolio contact form.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#80142B]/10 border border-[#80142B] text-xs text-[#80142B]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#4A4A4A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#00A19C] mb-2" />
            <p className="font-heading text-xs font-bold uppercase tracking-wider">
              Loading inbox...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 border border-[#BDBDBD] p-8 flat-box">
            <Mail className="w-8 h-8 text-[#BDBDBD] mx-auto mb-2" />
            <h3 className="font-heading text-base font-bold uppercase text-[#111111] mb-1">
              No Messages Yet
            </h3>
            <p className="font-body text-sm text-[#4A4A4A]">
              Messages submitted through your portfolio contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`border p-6 flat-box transition-colors ${
                  item.read
                    ? "bg-[#F7F7F7] border-[#BDBDBD]"
                    : "bg-white border-[#80142B] shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#BDBDBD]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.read ? "bg-[#BDBDBD]" : "bg-[#80142B]"
                      }`}
                    />
                    <h3 className="font-heading text-base font-bold text-[#111111] uppercase tracking-wide">
                      {item.name}
                    </h3>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-xs text-[#80142B] hover:underline font-body"
                    >
                      &lt;{item.email}&gt;
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#4A4A4A]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleRead(item)}
                      className="px-2.5 py-1 border border-[#BDBDBD] hover:border-[#111111] font-heading text-[10px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1 cursor-pointer transition-colors"
                      title={item.read ? "Mark as unread" : "Mark as read"}
                    >
                      {item.read ? (
                        <>
                          <Mail className="w-3 h-3 text-[#4A4A4A]" />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <MailOpen className="w-3 h-3 text-[#00A19C]" />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-1 text-[#80142B] hover:bg-[#80142B] hover:text-white border border-[#80142B] transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="font-body text-sm text-[#111111] whitespace-pre-wrap leading-relaxed">
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white border border-[#111111] p-6 sm:p-8 max-w-md w-full flat-box">
            <div className="flex items-center gap-3 text-[#80142B] mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading text-lg font-bold uppercase">
                Confirm Deletion
              </h3>
            </div>
            <p className="font-body text-sm text-[#4A4A4A] mb-6 leading-relaxed">
              Are you sure you want to delete the message from{" "}
              <strong className="text-[#111111]">{deleteTarget.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-[#BDBDBD] text-xs font-heading font-bold uppercase tracking-wider text-[#111111] hover:border-[#111111] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-heading font-bold uppercase tracking-wider flat-box flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? "Deleting..." : "Delete Message"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
