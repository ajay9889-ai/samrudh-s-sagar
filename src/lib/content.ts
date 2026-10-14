export interface SkillItem {
  name: string;
  level: number; // percentage 0-100
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
}

export interface ContactDetail {
  type: "email" | "phone" | "behance" | "location";
  label: string;
  value: string;
  href: string | null;
}

export const siteContent = {
  header: {
    leftText: "DESIGNING VISUAL\nSTORIES THAT WORK",
    logoText: "S / S",
    rightText: "PORTFOLIO\n2026",
  },
  hero: {
    firstName: "SAMRUDH",
    lastName: "S. SAGAR",
    role: "GRAPHIC DESIGNER",
    tagline: "Branding, social media creatives and digital design, built with a detail-oriented eye.",
    image: "/hero-lockup-2x.png",
  },
  selectedWork: {
    title: "SELECTED\nWORK",
    description: "Branding, social and packaging work, with the full set on Behance.",
    behanceText: "VIEW ALL ON BEHANCE →",
    behanceUrl: "https://www.behance.net/samrudh-007",
  },
  skills: {
    title: "SKILLS & TOOLKIT",
    items: [
      { name: "ADOBE ILLUSTRATOR", level: 90 },
      { name: "ADOBE PHOTOSHOP", level: 90 },
      { name: "ADOBE AFTER EFFECTS", level: 65 },
      { name: "ADOBE INDESIGN", level: 90 },
      { name: "ADOBE PREMIERE PRO", level: 70 },
      { name: "CANVA", level: 90 },
      { name: "FIGMA", level: 90 },
    ] as SkillItem[],
    languages: "Languages: English, Kannada, Hindi",
  },
  impact: {
    title: "IMPACT & EXPERIENCE",
    stats: [
      { value: "2+", label: "Years of experience" },
      { value: "3", label: "Teams worked with" },
      { value: "7", label: "Design tools" },
    ] as StatItem[],
    experience: [
      {
        company: "Ithisa Group",
        role: "Graphic Designer",
        dates: "Apr 2026 – Present",
      },
      {
        company: "Flutch Marketing Services",
        role: "Graphic Designer (Internship)",
        dates: "Dec 2025 – Feb 2026",
      },
      {
        company: "Shankara Online Solutions",
        role: "Graphic Designer",
        dates: "Oct 2024 – Dec 2025",
      },
      {
        Karnataka: true,
        company: "Karnataka Chitrakala Parishath",
        role: "BVA, College of Fine Arts",
        dates: "2020 – 2024",
      },
    ] as ExperienceItem[],
    quote: {
      text: "A detail-oriented approach to visual storytelling and creative problem solving.",
      label: "ABOUT MY WORK",
    },
  },
  contact: {
    title: "LET'S\nCONNECT",
    availability: "I'm currently working at Ithisa Group and open to new design projects.",
    details: [
      {
        type: "email",
        label: "EMAIL",
        value: "sagarsamrudh82@gmail.com",
        href: "mailto:sagarsamrudh82@gmail.com",
      },
      {
        type: "phone",
        label: "PHONE",
        value: "+91 76192 71400",
        href: "tel:+917619271400",
      },
      {
        type: "behance",
        label: "BEHANCE",
        value: "behance.net/samrudh-007",
        href: "https://www.behance.net/samrudh-007",
      },
      {
        type: "location",
        label: "LOCATION",
        value: "Bangalore, Karnataka",
        href: null,
      },
    ] as ContactDetail[],
    cta: {
      heading: "LET'S DESIGN\nSOMETHING\nGREAT TOGETHER",
    },
  },
};
