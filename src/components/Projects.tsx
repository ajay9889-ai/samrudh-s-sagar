import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/lib/content";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  link?: string | null;
  imageUrl: string;
  order: number;
}

interface ProjectsProps {
  projects?: ProjectData[];
}

export function Projects({ projects = [] }: ProjectsProps) {
  const { selectedWork } = siteContent;

  const fallbackTiles = [
    {
      id: "placeholder-1",
      number: "01",
      title: "KORU VISUAL IDENTITY",
      category: "Branding & Identity",
      link: selectedWork.behanceUrl,
      imageUrl: "/projects/project-1.jpg",
    },
    {
      id: "placeholder-2",
      number: "02",
      title: "ELEVATE CAMPAIGN POSTERS",
      category: "Social Media Creatives",
      link: selectedWork.behanceUrl,
      imageUrl: "/projects/project-2.jpg",
    },
    {
      id: "placeholder-3",
      number: "03",
      title: "ATELIER LUXURY PACKAGING",
      category: "Packaging Design",
      link: selectedWork.behanceUrl,
      imageUrl: "/projects/project-3.jpg",
    },
  ];

  const displayCards = [0, 1, 2].map((idx) => {
    const dbProject = projects[idx];
    if (dbProject) {
      return {
        id: dbProject.id,
        number: `0${idx + 1}`,
        title: dbProject.title,
        category: dbProject.category,
        link: dbProject.link || selectedWork.behanceUrl,
        imageUrl: dbProject.imageUrl,
      };
    }
    return fallbackTiles[idx];
  });

  return (
    <section className="w-full bg-[#ECECEC] dark:bg-[#141414] px-6 py-16 md:px-12 lg:px-20 border-b border-[#BDBDBD] dark:border-[#262626] transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Column 1: Intro Column */}
          <div className="flex flex-col justify-between self-stretch pr-4 py-1">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] mb-4 whitespace-pre-line">
                {selectedWork.title}
              </h2>

              <p className="font-body text-xs sm:text-sm text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed max-w-xs mb-8">
                {selectedWork.description}
              </p>
            </div>

            <div className="mt-auto pt-6 flex flex-col gap-3">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-between px-4 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-heading text-[11px] font-bold uppercase tracking-[0.15em] flat-box transition-colors hover:bg-[#00A19C] dark:hover:bg-[#00D1C7] cursor-pointer"
              >
                <span>EXPLORE 3D ORBIT GALLERY</span>
                <span className="text-xs">→</span>
              </Link>

              <a
                href={selectedWork.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-[#80142B] dark:text-[#E03B5B] transition-colors hover:text-[#111111] dark:hover:text-[#FFFFFF]"
              >
                <span>{selectedWork.behanceText}</span>
              </a>
            </div>
          </div>

          {/* Columns 2, 3, 4: Project Cards matching reference */}
          {displayCards.map((card) => {
            const cardInner = (
              <div className="group flex flex-col bg-[#ECECEC] dark:bg-[#141414] cursor-pointer">
                {/* Header: Number on left + Title & Category */}
                <div className="pb-2.5">
                  <div className="flex items-start gap-2.5 mb-1">
                    <span className="font-heading text-xs font-bold tracking-wider text-[#111111] dark:text-[#FFFFFF] shrink-0 mt-0.5">
                      {card.number}
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] truncate group-hover:text-[#80142B] dark:group-hover:text-[#E03B5B] transition-colors">
                        {card.title}
                      </h3>
                      <p className="font-body text-[11px] text-[#4A4A4A] dark:text-[#A0A0A0] truncate mt-0.5">
                        {card.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thin bottom border with short teal segment at the left */}
                <div className="relative w-full h-[1px] bg-[#BDBDBD] dark:bg-[#333333] mb-3">
                  <div className="absolute left-0 top-0 h-[2px] w-9 bg-[#00A19C]" />
                </div>

                {/* Card Portrait Image (~1:1.15) */}
                <div className="relative w-full aspect-[1/1.15] bg-[#111111] border border-[#BDBDBD] dark:border-[#333333] overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                </div>
              </div>
            );

            return card.link ? (
              <Link
                key={card.id}
                href={card.link}
                target={card.link.startsWith("http") ? "_blank" : undefined}
                rel={card.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80142B]"
              >
                {cardInner}
              </Link>
            ) : (
              <div key={card.id}>{cardInner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
