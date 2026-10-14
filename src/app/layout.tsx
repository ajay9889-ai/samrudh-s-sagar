import type { Metadata } from "next";
import { Montserrat, Open_Sans, Anton } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAMRUDH S. SAGAR | Graphic Designer Portfolio",
  description:
    "Graphic Designer specializing in branding, social media creatives, and digital design with a detail-oriented eye. Bangalore, Karnataka.",
  openGraph: {
    title: "SAMRUDH S. SAGAR | Graphic Designer",
    description:
      "Branding, social media creatives and digital design, built with a detail-oriented eye.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${openSans.variable} ${anton.variable} dark scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F8F8] dark:bg-[#111111] text-[#111111] dark:text-[#F5F5F5] antialiased selection:bg-[#00A19C] selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
