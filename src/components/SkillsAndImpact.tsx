"use client";

import React from "react";
import { siteContent } from "@/lib/content";
import {
  PenTool,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Video,
  Palette,
  Layers,
} from "lucide-react";

export function SkillsAndImpact() {
  const { skills, impact } = siteContent;

  const getSkillIcon = (name: string) => {
    const iconClass = "w-3.5 h-3.5 text-[#4A4A4A] dark:text-[#A0A0A0] shrink-0";
    if (name.includes("ILLUSTRATOR")) return <PenTool className={iconClass} />;
    if (name.includes("PHOTOSHOP")) return <ImageIcon className={iconClass} />;
    if (name.includes("AFTER EFFECTS")) return <Sparkles className={iconClass} />;
    if (name.includes("INDESIGN")) return <BookOpen className={iconClass} />;
    if (name.includes("PREMIERE")) return <Video className={iconClass} />;
    if (name.includes("CANVA")) return <Palette className={iconClass} />;
    return <Layers className={iconClass} />;
  };

  return (
    <section className="w-full bg-[#F7F7F7] dark:bg-[#121212] border-b border-[#BDBDBD] dark:border-[#262626] transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* ========================================================= */}
          {/* LEFT COLUMN: SKILLS & TOOLKIT                             */}
          {/* ========================================================= */}
          <div className="px-6 py-16 md:px-12 lg:px-20 lg:border-r border-[#BDBDBD] dark:border-[#262626] flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-3">
                {skills.title}
              </h2>

              {/* Short Teal Rule (~74px) */}
              <div
                className="w-[74px] h-[3px] bg-[#00A19C] mb-8"
                aria-hidden="true"
              />

              {/* Skill Rows matching reference with icons, labels, bars */}
              <div className="space-y-5">
                {skills.items.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    {/* Icon + Label */}
                    <div className="flex items-center gap-2.5 w-44 sm:w-48 shrink-0">
                      {getSkillIcon(skill.name)}
                      <span className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] truncate">
                        {skill.name}
                      </span>
                    </div>

                    {/* Progress Bar (no percentage text as requested) */}
                    <div
                      className="flex-1 h-[4px] bg-[#D4D4D4] dark:bg-[#252525] overflow-hidden"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={skill.name}
                    >
                      <div
                        className="h-full bg-[#00A19C]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages Note below bars */}
            <div className="mt-10 pt-6 border-t border-[#BDBDBD] dark:border-[#262626]">
              <p className="font-body text-xs font-semibold tracking-wide text-[#4A4A4A] dark:text-[#A0A0A0]">
                {skills.languages}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: IMPACT & EXPERIENCE                         */}
          {/* ========================================================= */}
          <div className="px-6 py-16 md:px-12 lg:px-20 border-t lg:border-t-0 border-[#BDBDBD] dark:border-[#262626] flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-[#111111] dark:text-[#FFFFFF] mb-3">
                {impact.title}
              </h2>

              {/* Short Teal Rule (~74px) */}
              <div
                className="w-[74px] h-[3px] bg-[#00A19C] mb-8"
                aria-hidden="true"
              />

              {/* Three stats separated by vertical dividers matching reference */}
              <div className="grid grid-cols-3 border-y border-[#BDBDBD] dark:border-[#262626] divide-x divide-[#BDBDBD] dark:divide-[#262626] py-6 mb-8 text-center">
                {impact.stats.map((stat) => (
                  <div key={stat.label} className="px-2 sm:px-4">
                    <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-[#FFFFFF] leading-none mb-2">
                      {stat.value}
                    </div>
                    <div className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 4-row list (company, role, dates) with hairlines */}
              <div className="divide-y divide-[#BDBDBD] dark:divide-[#262626] border-b border-[#BDBDBD] dark:border-[#262626] mb-8">
                {impact.experience.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-heading font-bold text-[#111111] dark:text-[#FFFFFF] mr-2">
                        {item.company}
                      </span>
                      <span className="font-body text-[#4A4A4A] dark:text-[#A0A0A0] text-xs">
                        — {item.role}
                      </span>
                    </div>
                    <span className="font-body text-xs text-[#80142B] dark:text-[#E03B5B] font-semibold whitespace-nowrap">
                      {item.dates}
                    </span>
                  </div>
                ))}
              </div>

              {/* Thin-bordered quote box matching reference style */}
              <div className="border border-[#BDBDBD] dark:border-[#2A2A2A] p-6 bg-[#F7F7F7] dark:bg-[#181818] flex items-start gap-4 transition-colors">
                <div className="font-heading text-4xl text-[#00A19C] leading-none font-bold shrink-0 -mt-1 select-none">
                  “
                </div>
                <div>
                  <p className="font-body text-xs sm:text-sm text-[#111111] dark:text-[#EAEAEA] font-medium leading-relaxed mb-3">
                    {impact.quote.text}
                  </p>
                  <div className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[#80142B] dark:text-[#E03B5B]">
                    {impact.quote.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
