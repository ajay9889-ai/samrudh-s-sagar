import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { ProjectsGalleryView } from "@/components/ProjectsGalleryView";
import { Contact } from "@/components/Contact";
import { ProjectModalData } from "@/components/ProjectGalleryModal";

export const metadata: Metadata = {
  title: "Projects & Gallery | Samrudh S. Sagar — Graphic Designer",
  description:
    "Explore graphic design projects, brand identity systems, social media creatives, and packaging designs. View multi-image JPG galleries and download PDF case study lookbooks.",
};

export const revalidate = 0; // Dynamic data

// Fallback high-fidelity sample projects if database is empty
const defaultFallbackProjects: ProjectModalData[] = [
  {
    id: "fb-1",
    title: "KORU VISUAL IDENTITY",
    category: "Branding & Identity",
    description:
      "A complete modernist corporate brand identity and stationery system engineered for Koru Studios. Includes bespoke typography guidelines, monochrome brand assets, print mockups, and corporate collateral.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-1.jpg",
    gallery: "/projects/project-1.jpg, /projects/project-2.jpg, /projects/project-3.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 1,
  },
  {
    id: "fb-2",
    title: "ELEVATE CAMPAIGN POSTERS",
    category: "Social Media Creatives",
    description:
      "Bold experimental social campaign posters and typographic art direction for high-engagement digital launches. Featuring high-contrast color theory, Swiss grid alignments, and dynamic editorial layouts.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-2.jpg",
    gallery: "/projects/project-2.jpg, /projects/project-1.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 2,
  },
  {
    id: "fb-3",
    title: "ATELIER LUXURY PACKAGING",
    category: "Packaging Design",
    description:
      "Sustainable premium packaging architecture developed for artisanal skincare. Minimalist geometric embossing, tactile matte paper stock selections, and foil-stamped visual identity standards.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-3.jpg",
    gallery: "/projects/project-3.jpg, /projects/project-1.jpg, /projects/project-2.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 3,
  },
  {
    id: "fb-4",
    title: "LUMEN EDITORIAL & LOOKBOOK",
    category: "Print & Editorial",
    description:
      "Editorial publication and seasonal fashion catalogue design focusing on structured typographic grids, full-bleed architectural imagery, and minimalist copy pacing.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-4.jpg",
    gallery: "/projects/project-4.jpg, /projects/project-1.jpg, /projects/project-2.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 4,
  },
  {
    id: "fb-5",
    title: "NEO-CYBER KINETIC EXHIBITION",
    category: "Exhibition & Motion",
    description:
      "Chromatic distortion typography posters and kinetic brand collateral for the Neo-Zurich digital arts pavilion. High-contrast typography with experimental Swiss grid alignment.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-5.jpg",
    gallery: "/projects/project-5.jpg, /projects/project-2.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 5,
  },
  {
    id: "fb-6",
    title: "AURA MONOLITH PACKAGING",
    category: "Packaging Design",
    description:
      "Tactile matte glass and emerald foil packaging identity for ultra-luxury skincare. Award-winning minimalist geometric industrial design and bespoke embossing.",
    link: "https://www.behance.net/samrudh-007",
    imageUrl: "/projects/project-6.jpg",
    gallery: "/projects/project-6.jpg, /projects/project-3.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 6,
  },
];

export default async function ProjectsPage() {
  let projects: ProjectModalData[] = [];

  try {
    const dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        link: true,
        imageUrl: true,
        gallery: true,
        pdfUrl: true,
        order: true,
      },
    });

    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        link: p.link,
        imageUrl: p.imageUrl,
        gallery: p.gallery,
        pdfUrl: p.pdfUrl,
        order: p.order,
      }));
    } else {
      projects = defaultFallbackProjects;
    }
  } catch (err) {
    console.error("Failed to load projects from DB:", err);
    projects = defaultFallbackProjects;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] dark:bg-[#111111] transition-colors duration-200">
      {/* Sticky Glassy Navbar */}
      <Navbar />

      {/* Main Public Projects & Gallery Showcase */}
      <main className="flex-1">
        <ProjectsGalleryView initialProjects={projects} />
      </main>

      {/* Unique Designer Footer */}
      <Contact />
    </div>
  );
}
