import React from "react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { SkillsAndImpact } from "@/components/SkillsAndImpact";
import { Contact } from "@/components/Contact";

export const revalidate = 0; // Ensure fresh data on request or dynamic revalidation

export default async function HomePage() {
  let projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string | null;
    link: string | null;
    imageUrl: string;
    order: number;
  }> = [];

  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        link: true,
        imageUrl: true,
        order: true,
      },
    });
  } catch (err) {
    console.error("Failed to load projects for homepage:", err);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F7] dark:bg-[#111111] transition-colors duration-200">
      {/* 1. Sticky Glassy Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Selected Work */}
      <Projects projects={projects} />

      {/* 4. Skills & Impact (Two Columns with Vertical Divider) */}
      <SkillsAndImpact />

      {/* 5. Contact Footer */}
      <Contact />
    </main>
  );
}
