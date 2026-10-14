"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Eye, FileText, Download, Sparkles, Orbit, LayoutGrid } from "lucide-react";
import { ProjectGalleryModal, ProjectModalData } from "./ProjectGalleryModal";
import { OrbitGallery3D } from "./OrbitGallery3D";

interface ProjectsGalleryViewProps {
  initialProjects: ProjectModalData[];
}

export function ProjectsGalleryView({ initialProjects }: ProjectsGalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<ProjectModalData | null>(null);
  const [viewFormat, setViewFormat] = useState<"orbit" | "bento">("orbit");

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ["ALL", ...Array.from(set)];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <>
      <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-[#00A19C]" />
              <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#80142B] dark:text-[#E03B5B]">
                PORTFOLIO ARCHIVE
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#111111] dark:text-white">
              PROJECTS &amp; GALLERY
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#4A4A4A] dark:text-[#A0A0A0] max-w-xl mt-3 leading-relaxed">
              Experience the 3D orbital gallery with kinetic sliding physics. Drag or swipe to orbit through graphic identities, packaging systems, and editorial art.
            </p>
          </div>

          {/* View Mode Toggle: 3D Orbit vs Bento Archive */}
          <div className="flex items-center gap-1.5 p-1 bg-[#ECECEC] dark:bg-[#1E1E1E] border border-[#BDBDBD] dark:border-[#333333] shrink-0 self-start md:self-auto flat-box">
            <button
              onClick={() => setViewFormat("orbit")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flat-box ${
                viewFormat === "orbit"
                  ? "bg-[#00A19C] text-white shadow-sm"
                  : "text-[#555555] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D ORBIT VIEW</span>
            </button>
            <button
              onClick={() => setViewFormat("bento")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flat-box ${
                viewFormat === "bento"
                  ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-sm"
                  : "text-[#555555] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>BENTO GRID</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#BDBDBD] dark:border-[#262626] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flat-box ${
                  selectedCategory === cat
                    ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                    : "bg-[#ECECEC] dark:bg-[#1E1E1E] text-[#4A4A4A] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-[#BDBDBD] dark:border-[#333333] text-xs text-[#111111] dark:text-white focus:border-[#80142B] dark:focus:border-[#00D1C7] focus:outline-none flat-box placeholder:text-[#888888]"
            />
          </div>
        </div>

        {/* Results count & status banner */}
        <div className="mb-6 flex items-center justify-between text-xs font-heading font-semibold text-[#777777]">
          <span>SHOWING {filteredProjects.length} PROJECT{filteredProjects.length === 1 ? "" : "S"}</span>
          <span className="flex items-center gap-1.5 text-[#00A19C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {viewFormat === "orbit"
                ? "INTERACTIVE 3D ORBIT ACTIVE"
                : "CLICK ANY CARD FOR 3D GALLERY"}
            </span>
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#BDBDBD] dark:border-[#333333] p-10 bg-[#FAFAFA] dark:bg-[#141414]">
            <p className="font-heading text-sm uppercase tracking-wider text-[#777777]">
              No projects found matching your criteria.
            </p>
            <button
              onClick={() => { setSelectedCategory("ALL"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#00A19C] text-white flat-box hover:bg-[#008d88]"
            >
              Reset Filters
            </button>
          </div>
        ) : viewFormat === "orbit" ? (
          /* PRIMARY VIEW: 3D ORBIT SLIDING GALLERY */
          <div>
            <OrbitGallery3D
              projects={filteredProjects}
              onSelectProject={setActiveProject}
            />

            {/* Quick-switch teaser to bento archive */}
            <div className="mt-8 pt-6 border-t border-[#BDBDBD] dark:border-[#262626] flex items-center justify-between">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#777777]">
                Prefer a structured catalog view?
              </span>
              <button
                onClick={() => setViewFormat("bento")}
                className="inline-flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#00A19C] hover:underline cursor-pointer"
              >
                <span>SWITCH TO BENTO GRID</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          /* SECONDARY VIEW: CURATED BENTO GRID ARCHIVE */
          <BentoGrid projects={filteredProjects} onOpen={setActiveProject} />
        )}
      </section>

      {/* Project Multi-Image Gallery Modal (with 3D Orbit slider) */}
      <ProjectGalleryModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}

/* ========================================================================== */
/* BENTO GRID PATTERN                                                           */
/* ========================================================================== */

interface BentoPattern {
  colSpan: number;
  rowSpan: number;
}

const BENTO_PATTERNS: BentoPattern[] = [
  { colSpan: 2, rowSpan: 2 }, // Feature hero
  { colSpan: 1, rowSpan: 1 }, // Small
  { colSpan: 1, rowSpan: 1 }, // Small
  { colSpan: 1, rowSpan: 2 }, // Tall portrait
  { colSpan: 2, rowSpan: 1 }, // Wide
  { colSpan: 1, rowSpan: 1 }, // Small
];

function BentoGrid({
  projects,
  onOpen,
}: {
  projects: ProjectModalData[];
  onOpen: (p: ProjectModalData) => void;
}) {
  return (
    <div
      className="grid gap-3 sm:gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gridAutoRows: "240px",
      }}
    >
      {projects.map((project, idx) => {
        const pat = BENTO_PATTERNS[idx % BENTO_PATTERNS.length];
        return (
          <BentoCard
            key={project.id}
            project={project}
            idx={idx}
            colSpan={pat.colSpan}
            rowSpan={pat.rowSpan}
            onOpen={onOpen}
          />
        );
      })}
    </div>
  );
}

/* ========================================================================== */
/* INDIVIDUAL BENTO CARD                                                        */
/* ========================================================================== */

function BentoCard({
  project,
  idx,
  colSpan,
  rowSpan,
  onOpen,
}: {
  project: ProjectModalData;
  idx: number;
  colSpan: number;
  rowSpan: number;
  onOpen: (p: ProjectModalData) => void;
}) {
  const isFeature = colSpan === 2 && rowSpan === 2;
  const isWide = colSpan === 2 && rowSpan === 1;
  const isTall = colSpan === 1 && rowSpan === 2;

  return (
    <div
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title} gallery`}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      className="group relative bg-[#0E0E0E] border border-[#262626] hover:border-[#00A19C] overflow-hidden cursor-pointer flat-box transition-all duration-300 select-none min-h-[220px]"
    >
      {/* BG Image */}
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        priority={idx < 3}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Category badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="px-2 py-0.5 bg-[#00A19C] text-white font-heading text-[9px] font-bold uppercase tracking-wider">
          {project.category}
        </span>
      </div>

      {/* Format badges */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white font-heading text-[9px] font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1">
          <Eye className="w-2.5 h-2.5 text-[#00A19C]" />
          JPG
        </span>
        {project.pdfUrl && (
          <span className="px-2 py-0.5 bg-[#80142B]/90 text-white font-heading text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            PDF
          </span>
        )}
      </div>

      {/* Inspect CTA */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/25 text-white font-heading text-[10px] font-bold uppercase tracking-widest flat-box opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <Download className="w-3.5 h-3.5 text-[#00D1C7]" />
          <span>OPEN 3D GALLERY</span>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-20">
        <div className="w-6 h-[2px] bg-[#00A19C] mb-2 transition-all duration-300 group-hover:w-14" />

        <h3 className="font-heading font-extrabold uppercase tracking-tight text-white leading-tight transition-colors group-hover:text-[#00D1C7] text-sm sm:text-base mb-1">
          {project.title}
        </h3>

        {project.description && (
          <p className="font-body text-[11px] text-white/65 line-clamp-1 leading-relaxed mb-1.5">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1.5 group-hover:translate-y-0">
          <span className="font-heading text-[9px] font-bold uppercase tracking-widest text-[#00D1C7]">OPEN GALLERY</span>
          <span className="text-[#00D1C7] text-[10px]">→</span>
        </div>

        <div className="absolute bottom-3.5 right-3.5">
          <span className="font-heading text-[10px] font-bold text-white/25 tracking-[0.3em]">
            #{String(idx + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Subtle hover tint */}
      <div className="absolute inset-0 bg-[#80142B]/0 group-hover:bg-[#80142B]/8 transition-colors duration-300 pointer-events-none z-10" />
    </div>
  );
}
