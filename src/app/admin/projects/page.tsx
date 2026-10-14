"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string | null;
  link: string | null;
  imageUrl: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading projects";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublished = async (project: Project) => {
    try {
      const updatedPublished = !project.published;
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: updatedPublished } : p))
      );

      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          category: project.category,
          description: project.description,
          link: project.link,
          imageUrl: project.imageUrl,
          order: project.order,
          published: updatedPublished,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch {
      // Revert on error
      fetchProjects();
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Re-assign order numbers sequentially
    const updatedWithOrder = newProjects.map((p, idx) => ({
      ...p,
      order: idx + 1,
    }));

    setProjects(updatedWithOrder);

    try {
      await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
    } catch {
      fetchProjects();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#BDBDBD]">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111111]">
              PROJECTS MANAGEMENT
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#4A4A4A] mt-1">
              Manage work items, cover images, display ordering, and visibility.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-xs font-bold uppercase tracking-wider flat-box transition-colors shadow-none self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#80142B]/10 border border-[#80142B] text-xs text-[#80142B]">
            {error}
          </div>
        )}

        {/* Projects Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#4A4A4A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#00A19C] mb-2" />
            <p className="font-heading text-xs font-bold uppercase tracking-wider">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-[#BDBDBD] p-8 flat-box">
            <h3 className="font-heading text-base font-bold uppercase text-[#111111] mb-2">
              No Projects Found
            </h3>
            <p className="font-body text-sm text-[#4A4A4A] mb-6">
              Get started by adding your first portfolio project.
            </p>
            <Link
              href="/admin/projects/new"
              className="px-5 py-2.5 bg-[#00A19C] text-white font-heading text-xs font-bold uppercase tracking-wider flat-box inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Link>
          </div>
        ) : (
          <div className="border border-[#BDBDBD] overflow-x-auto flat-box">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#BDBDBD] font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  <th className="py-3.5 px-4 w-20">Order</th>
                  <th className="py-3.5 px-4 w-24">Cover</th>
                  <th className="py-3.5 px-4">Title &amp; Link</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 w-28 text-center">Published</th>
                  <th className="py-3.5 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BDBDBD]">
                {projects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#F7F7F7]/60 transition-colors"
                  >
                    {/* Order Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-heading text-xs font-bold">
                        <span className="w-5 text-center text-[#111111]">
                          {project.order}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, "up")}
                            className="p-1 text-[#4A4A4A] hover:text-[#111111] disabled:opacity-20 cursor-pointer"
                            aria-label="Move project up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === projects.length - 1}
                            onClick={() => handleMoveOrder(idx, "down")}
                            className="p-1 text-[#4A4A4A] hover:text-[#111111] disabled:opacity-20 cursor-pointer"
                            aria-label="Move project down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-16 bg-[#111111] border border-[#BDBDBD] overflow-hidden flat-box">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Link */}
                    <td className="py-3 px-4">
                      <div className="font-heading font-bold text-[#111111] uppercase tracking-wide">
                        {project.title}
                      </div>
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#80142B] hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate max-w-xs">{project.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-[#777777]">No link</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-body text-xs text-[#4A4A4A]">
                      {project.category}
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(project)}
                        className={`inline-flex items-center px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider flat-box cursor-pointer transition-colors ${
                          project.published
                            ? "bg-[#00A19C] text-white"
                            : "bg-[#D4D4D4] text-[#4A4A4A]"
                        }`}
                      >
                        {project.published ? "Active" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 text-[#111111] hover:text-[#00A19C] border border-[#BDBDBD] hover:border-[#00A19C] transition-colors"
                          aria-label={`Edit ${project.title}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 text-[#80142B] hover:bg-[#80142B] hover:text-white border border-[#80142B] transition-colors cursor-pointer"
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Are you sure you want to delete{" "}
              <strong className="text-[#111111]">{deleteTarget.title}</strong>?
              This action cannot be undone.
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
                <span>{deleting ? "Deleting..." : "Delete Project"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
