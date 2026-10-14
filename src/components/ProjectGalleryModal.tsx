"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ExternalLink,
  Eye,
  Orbit,
  Maximize2,
} from "lucide-react";

export interface ProjectModalData {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  link?: string | null;
  imageUrl: string;
  gallery?: string | null;
  pdfUrl?: string | null;
  order?: number;
}

interface ProjectGalleryModalProps {
  project: ProjectModalData | null;
  onClose: () => void;
}

export function ProjectGalleryModal({ project, onClose }: ProjectGalleryModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<"orbit3d" | "flat">("orbit3d");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Parse gallery images (cover image + any extra gallery images)
  const images: string[] = [];
  if (project) {
    if (project.imageUrl) images.push(project.imageUrl);
    if (project.gallery) {
      const extras = project.gallery
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !images.includes(s));
      images.push(...extras);
    }
  }

  useEffect(() => {
    setActiveImageIndex(0);
    setDragOffset(0);
  }, [project]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [project, images.length]);

  if (!project) return null;

  const currentImage = images[activeImageIndex] || project.imageUrl;

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (displayMode !== "orbit3d" || images.length <= 1) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 5) hasMovedRef.current = true;
    setDragOffset(delta);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }
    setDragOffset(0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Gallery`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-white dark:bg-[#141414] border border-[#BDBDBD] dark:border-[#2E2E2E] flat-box overflow-hidden shadow-2xl text-[#111111] dark:text-white transition-colors duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#BDBDBD] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#0E0E0E] transition-colors">
          <div className="overflow-hidden pr-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-[#80142B] dark:text-[#00A19C]">
                {project.category}
              </span>
              <span className="text-black/30 dark:text-white/30 text-xs">|</span>
              <span className="text-[#666666] dark:text-white/50 text-[10px] font-heading font-medium tracking-wider">
                {images.length} ARTWORK ASSET{images.length === 1 ? "" : "S"}
              </span>
            </div>
            <h2 className="font-heading text-base sm:text-lg md:text-xl font-extrabold uppercase text-[#111111] dark:text-white truncate mt-0.5">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* 3D Orbit vs Flat mode switch (only when multiple images exist) */}
            {images.length > 1 && (
              <div className="flex items-center bg-[#ECECEC] dark:bg-[#1A1A1A] border border-[#BDBDBD] dark:border-[#333333] p-0.5 mr-2 flat-box">
                <button
                  onClick={() => setDisplayMode("orbit3d")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-heading font-bold uppercase tracking-wider transition-colors flat-box ${
                    displayMode === "orbit3d"
                      ? "bg-[#00A19C] text-white"
                      : "text-[#666666] dark:text-white/50 hover:text-[#111111] dark:hover:text-white"
                  }`}
                  title="3D Orbit Sliding View"
                >
                  <Orbit className="w-3 h-3" />
                  <span>3D ORBIT</span>
                </button>
                <button
                  onClick={() => setDisplayMode("flat")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-heading font-bold uppercase tracking-wider transition-colors flat-box ${
                    displayMode === "flat"
                      ? "bg-[#00A19C] text-white"
                      : "text-[#666666] dark:text-white/50 hover:text-[#111111] dark:hover:text-white"
                  }`}
                  title="2D Cinematic Single View"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>2D FOCUS</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 text-[#111111] dark:text-white hover:text-[#80142B] dark:hover:text-[#E03B5B] border border-[#BDBDBD] dark:border-[#333333] hover:border-[#80142B] dark:hover:border-[#E03B5B] transition-colors cursor-pointer flat-box"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Gallery Stage (3D Orbit or Flat Focus) */}
        <div
          className="relative flex-1 bg-gradient-to-b from-[#0A0A0A] via-[#0E0E0E] to-[#121212] min-h-[340px] sm:min-h-[420px] max-h-[56vh] flex items-center justify-center overflow-hidden select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ touchAction: "pan-y" }}
        >
          {/* Subtle Ambient Background Grid & Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(0, 161, 156, 0.25) 0%, transparent 60%)",
            }}
          />

          {/* MODE 1: 3D ORBIT SLIDING IMAGES */}
          {displayMode === "orbit3d" && images.length > 1 ? (
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                perspective: "1100px",
                perspectiveOrigin: "50% 48%",
              }}
            >
              {/* Elliptical floor ring */}
              <div
                className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-[#00A19C]/30 pointer-events-none"
                style={{
                  top: "60%",
                  transform: "translate(-50%, -50%) rotateX(75deg)",
                  left: "50%",
                }}
              />

              {/* 3D Orbiting Slides */}
              {images.map((img, idx) => {
                const diff = idx - activeImageIndex;
                let wrappedDiff = diff;
                if (wrappedDiff > images.length / 2) wrappedDiff -= images.length;
                if (wrappedDiff < -images.length / 2) wrappedDiff += images.length;

                const baseAngle = wrappedDiff * (360 / Math.max(images.length, 3));
                const dragAngle = (dragOffset / 400) * 45;
                const totalAngle = baseAngle + dragAngle;

                const rad = (totalAngle * Math.PI) / 180;
                const cosVal = Math.cos(rad);
                const sinVal = Math.sin(rad);

                const radius = 280;
                const translateX = sinVal * radius;
                const translateZ = (cosVal - 1) * 220;
                const rotateY = totalAngle * 0.85;

                const scale = Math.max(0.68, 1 - Math.abs(wrappedDiff) * 0.18);
                const opacity = Math.max(0.3, 1 - Math.abs(wrappedDiff) * 0.45);
                const zIndex = Math.round((cosVal + 1) * 50);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!hasMovedRef.current) setActiveImageIndex(idx);
                    }}
                    className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging ? "duration-0" : "duration-300 ease-out"
                    }`}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                  >
                    <div
                      className={`relative max-w-[280px] sm:max-w-[360px] h-[240px] sm:h-[310px] bg-[#161616] border flat-box overflow-hidden transition-shadow ${
                        idx === activeImageIndex
                          ? "border-[#00A19C] shadow-[0_0_30px_rgba(0,161,156,0.5)]"
                          : "border-[#333333] hover:border-white/50"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${project.title} - 3D Orbit ${idx + 1}`}
                        className="w-full h-full object-contain p-2"
                      />

                      {/* Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-heading font-bold text-white uppercase border border-white/20">
                        SLIDE {idx + 1}
                      </div>
                    </div>

                    {/* Subsurface Reflection */}
                    <div
                      className="w-[280px] sm:w-[360px] h-[35px] overflow-hidden pointer-events-none opacity-20 mt-1"
                      style={{
                        transform: "scaleY(-1)",
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MODE 2: FLAT 2D CINEMATIC VIEW */
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${project.title} - Preview ${activeImageIndex + 1}`}
                className="max-h-[50vh] max-w-full object-contain select-none"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous gallery image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-[#80142B] text-white border border-white/20 transition-colors cursor-pointer flat-box z-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next gallery image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-[#80142B] text-white border border-white/20 transition-colors cursor-pointer flat-box z-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide Indicator Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/85 text-white font-heading text-[10px] font-bold uppercase tracking-wider border border-white/20 z-30">
              {activeImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 p-3 overflow-x-auto bg-[#F4F4F4] dark:bg-[#111111] border-t border-[#BDBDBD] dark:border-[#222222] transition-colors">
            <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-[#777777] dark:text-white/40 shrink-0 mr-1 hidden sm:inline">
              SLIDES:
            </span>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-14 shrink-0 border transition-all overflow-hidden ${
                  activeImageIndex === idx
                    ? "border-[#00A19C] ring-2 ring-[#00A19C] opacity-100"
                    : "border-[#BDBDBD] dark:border-[#333333] opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Footer: Description & Action Buttons (JPG / PDF Format) */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161616] border-t border-[#BDBDBD] dark:border-[#262626] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="max-w-xl">
            {project.description ? (
              <p className="font-body text-xs sm:text-sm text-[#4A4A4A] dark:text-white/70 leading-relaxed">
                {project.description}
              </p>
            ) : (
              <p className="font-body text-xs text-[#777777] dark:text-white/50 italic">
                Graphic design identity and production assets by Samrudh S. Sagar.
              </p>
            )}
          </div>

          {/* Action Format Buttons (JPG Format, PDF Format, Link) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            {/* View/Download JPG Format */}
            <a
              href={currentImage}
              download={`${project.title.toLowerCase().replace(/\s+/g, "-")}-gallery-${activeImageIndex + 1}.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#F2F2F2] dark:bg-[#222222] hover:bg-[#E5E5E5] dark:hover:bg-[#2C2C2C] text-[#111111] dark:text-white border border-[#BDBDBD] dark:border-[#3A3A3A] hover:border-[#00A19C] hover:text-[#00A19C] dark:hover:text-[#00D1C7] transition-colors flat-box cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00A19C]" />
              <span>JPG FORMAT</span>
            </a>

            {/* View/Download PDF Format */}
            {project.pdfUrl ? (
              <a
                href={project.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#80142B] hover:bg-[#6b1124] text-white transition-colors flat-box cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF FORMAT</span>
              </a>
            ) : (
              <a
                href={currentImage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#80142B] hover:bg-[#6b1124] text-white transition-colors flat-box cursor-pointer"
                title="Full resolution artwork"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>FULL ARTWORK</span>
              </a>
            )}

            {/* External Case Study / Behance */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#00A19C] hover:bg-[#008d88] text-white transition-colors flat-box cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>CASE STUDY</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
