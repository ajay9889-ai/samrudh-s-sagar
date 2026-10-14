const fs = require('fs');
const path = require('path');

const content = `"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, AlertCircle, Loader2, ArrowLeft, Plus, X, Images } from "lucide-react";
import Link from "next/link";
import { projectSchema, ProjectFormData } from "@/lib/schemas";

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    category: string;
    description?: string | null;
    link?: string | null;
    imageUrl: string;
    gallery?: string | null;
    pdfUrl?: string | null;
    order: number;
    published: boolean;
  };
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    if (!initialData?.gallery) return [];
    return initialData.gallery
      .split(/[\\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  });
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [order, setOrder] = useState<number>(initialData?.order ?? 1);
  const [published, setPublished] = useState<boolean>(initialData?.published ?? true);

  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  /* ------------------------------------------------------------------ */
  /* Upload: cover image                                                   */
  /* ------------------------------------------------------------------ */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 5 MB.");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Upload: gallery image (single, appended to list)                     */
  /* ------------------------------------------------------------------ */
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Gallery file exceeds maximum allowed size of 5 MB.");
      return;
    }
    try {
      setGalleryUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gallery upload failed");
      setGalleryUrls((prev) => [...prev, data.url]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gallery image upload failed");
    } finally {
      setGalleryUploading(false);
    }
  };

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim();
    if (url && !galleryUrls.includes(url)) {
      setGalleryUrls((prev) => [...prev, url]);
      setGalleryUrlInput("");
    }
  };

  const removeGalleryUrl = (idx: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ------------------------------------------------------------------ */
  /* Submit                                                                */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const galleryString = galleryUrls.join(", ") || null;

    const payload: ProjectFormData = {
      title,
      category,
      description: description || null,
      link: link || null,
      imageUrl,
      gallery: galleryString,
      pdfUrl: pdfUrl || null,
      order: Number(order),
      published,
    };

    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Validation failed");
      return;
    }

    try {
      setSaving(true);
      const url = isEdit ? \`/api/admin/projects/\${initialData?.id}\` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Saving failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white border border-[#BDBDBD] p-6 sm:p-10 flat-box">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#4A4A4A] hover:text-[#111111]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <h2 className="font-heading text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#111111] mb-6 pb-4 border-b border-[#BDBDBD]">
        {isEdit ? "Edit Project" : "New Portfolio Project"}
      </h2>

      {error && (
        <div className="mb-6 p-3.5 bg-[#80142B]/10 border border-[#80142B] flex items-start gap-2.5 text-xs text-[#80142B]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="proj-title" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Project Title <span className="text-[#80142B]">*</span>
          </label>
          <input
            id="proj-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. KORU VISUAL IDENTITY"
            className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="proj-category" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Category <span className="text-[#80142B]">*</span>
          </label>
          <input
            id="proj-category"
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Branding & Identity"
            className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="proj-desc" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Short Description
          </label>
          <textarea
            id="proj-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the design system, client or deliverables..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] focus:border-[#80142B] focus:outline-none flat-box resize-none"
          />
        </div>

        {/* Project Link */}
        <div>
          <label htmlFor="proj-link" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Project Link (Behance / Case Study)
          </label>
          <input
            id="proj-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.behance.net/gallery/..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="proj-image-url" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Cover Image <span className="text-[#80142B]">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed border-[#BDBDBD] p-5 flex flex-col items-center justify-center text-center bg-[#F7F7F7]">
              <Upload className="w-6 h-6 text-[#80142B] mb-2" />
              <label
                htmlFor="file-upload"
                className="font-heading text-xs font-bold uppercase tracking-wider text-[#80142B] hover:underline cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload Cover Image"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="text-[11px] text-[#777777] mt-1">JPG, PNG, WebP — max 5 MB</span>
            </div>

            <div className="space-y-3">
              <input
                id="proj-image-url"
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL (/projects/... or https://...)"
                className="w-full px-3 py-2 bg-white border border-[#BDBDBD] text-xs text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
              />
              {imageUrl ? (
                <div className="relative w-28 h-32 bg-[#111111] border border-[#BDBDBD] overflow-hidden flat-box">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-28 h-32 border border-[#BDBDBD] bg-[#F7F7F7] flex items-center justify-center text-[11px] text-[#777777]">
                  No preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* GALLERY IMAGES (multi-upload)                                 */}
        {/* ============================================================ */}
        <div className="border border-[#BDBDBD] p-5 bg-[#FAFAFA] flat-box">
          <div className="flex items-center gap-2 mb-3">
            <Images className="w-4 h-4 text-[#00A19C]" />
            <label className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111]">
              Gallery Images (shown in modal slideshow)
            </label>
          </div>

          {/* Gallery upload button */}
          <div className="flex items-center gap-3 mb-4">
            <label
              htmlFor="gallery-file-upload"
              className={\`inline-flex items-center gap-2 px-4 py-2 text-[11px] font-heading font-bold uppercase tracking-wider flat-box cursor-pointer transition-colors \${
                galleryUploading
                  ? "bg-[#D4D4D4] text-[#777777] cursor-not-allowed"
                  : "bg-[#00A19C] text-white hover:bg-[#008d88]"
              }\`}
            >
              {galleryUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{galleryUploading ? "Uploading..." : "UPLOAD GALLERY IMAGE"}</span>
            </label>
            <input
              id="gallery-file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryFileUpload}
              disabled={galleryUploading}
              className="hidden"
            />
            <span className="text-[11px] text-[#777777]">or</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryUrl())}
                placeholder="Paste URL and press Enter or +"
                className="flex-1 px-3 py-2 bg-white border border-[#BDBDBD] text-xs text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                className="p-2 bg-[#111111] text-white hover:bg-[#00A19C] transition-colors flat-box"
                title="Add URL"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gallery preview strip */}
          {galleryUrls.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {galleryUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 bg-[#111111] border border-[#BDBDBD] overflow-hidden flat-box group">
                  <Image src={url} alt={\`Gallery \${i + 1}\`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryUrl(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Remove gallery image"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <span className="absolute bottom-0.5 right-1 font-heading text-[8px] font-bold text-white/50">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#888888] font-body italic">
              No gallery images added yet. Upload images or paste URLs above.
            </p>
          )}

          {galleryUrls.length > 0 && (
            <p className="mt-2 text-[11px] text-[#777777]">
              {galleryUrls.length} image{galleryUrls.length === 1 ? "" : "s"} in gallery slideshow. Hover to remove.
            </p>
          )}
        </div>

        {/* PDF Format */}
        <div>
          <label htmlFor="proj-pdf" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Project PDF Document Link
          </label>
          <input
            id="proj-pdf"
            type="text"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="e.g. /projects/koru-brand-guidelines.pdf or https://drive.google.com/..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-xs text-[#111111] focus:border-[#80142B] focus:outline-none flat-box font-mono"
          />
          <span className="text-[11px] text-[#777777] mt-1 block">
            Enables the &quot;Download PDF Format&quot; button in the public project gallery.
          </span>
        </div>

        {/* Display Order & Published */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#BDBDBD]">
          <div>
            <label htmlFor="proj-order" className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Display Order
            </label>
            <input
              id="proj-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#BDBDBD] text-sm text-[#111111] focus:border-[#80142B] focus:outline-none flat-box"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              id="proj-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-[#00A19C] cursor-pointer"
            />
            <label htmlFor="proj-published" className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111] cursor-pointer select-none">
              Published (Visible on Home Page)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-[#BDBDBD] flex items-center justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-5 py-2.5 border border-[#BDBDBD] text-xs font-heading font-bold uppercase tracking-wider text-[#111111] hover:border-[#111111]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading || galleryUploading}
            className="px-6 py-2.5 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-xs font-bold uppercase tracking-wider flat-box flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
`;

const targetPath = require('path').join(__dirname, '..', 'src', 'components', 'admin', 'ProjectForm.tsx');
require('fs').writeFileSync(targetPath, content, 'utf8');
console.log('SUCCESS: ProjectForm.tsx written');
