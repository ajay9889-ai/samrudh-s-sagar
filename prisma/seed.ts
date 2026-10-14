import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample portfolio projects...");

  // Clear existing to avoid duplicates on re-seed
  await prisma.project.deleteMany();

  const projects = [
    {
      title: "KORU VISUAL IDENTITY",
      category: "Branding & Identity",
      description: "Minimalist corporate stationery, brand collateral and typography guidelines for Koru Studios. Includes bespoke typography guidelines, monochrome brand assets, print mockups, and corporate collateral.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-1.jpg",
      gallery: "/projects/project-1.jpg, /projects/project-2.jpg, /projects/project-3.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 1,
      published: true,
    },
    {
      title: "ELEVATE CAMPAIGN POSTERS",
      category: "Social Media Creatives",
      description: "Modernist social campaign graphics and editorial compositions with bold typographic hierarchy, high-contrast color theory, Swiss grid alignments, and dynamic editorial layouts.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-2.jpg",
      gallery: "/projects/project-2.jpg, /projects/project-1.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 2,
      published: true,
    },
    {
      title: "ATELIER LUXURY PACKAGING",
      category: "Packaging Design",
      description: "Monochrome sustainable packaging architecture with geometric accents and tactile luxury finishes. Minimalist geometric embossing, tactile matte paper stock selections, and foil-stamped visual identity standards.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-3.jpg",
      gallery: "/projects/project-3.jpg, /projects/project-1.jpg, /projects/project-2.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 3,
      published: true,
    },
    {
      title: "LUMEN EDITORIAL & LOOKBOOK",
      category: "Print & Editorial",
      description: "Editorial publication and seasonal fashion catalogue design focusing on structured typographic grids, full-bleed architectural imagery, and minimalist copy pacing.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-4.jpg",
      gallery: "/projects/project-4.jpg, /projects/project-1.jpg, /projects/project-2.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 4,
      published: true,
    },
    {
      title: "NEO-CYBER KINETIC EXHIBITION",
      category: "Exhibition & Motion",
      description: "Chromatic distortion typography posters and kinetic brand collateral for the Neo-Zurich digital arts pavilion. High-contrast typography with experimental Swiss grid alignment.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-5.jpg",
      gallery: "/projects/project-5.jpg, /projects/project-2.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 5,
      published: true,
    },
    {
      title: "AURA MONOLITH PACKAGING",
      category: "Packaging Design",
      description: "Tactile matte glass and emerald foil packaging identity for ultra-luxury skincare. Award-winning minimalist geometric industrial design and bespoke embossing.",
      link: "https://www.behance.net/samrudh-007",
      imageUrl: "/projects/project-6.jpg",
      gallery: "/projects/project-6.jpg, /projects/project-3.jpg",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      order: 6,
      published: true,
    },
  ];

  for (const project of projects) {
    const created = await prisma.project.create({
      data: project,
    });
    console.log(`Created project: ${created.title} (ID: ${created.id})`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
