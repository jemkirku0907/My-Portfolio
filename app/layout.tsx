import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AskPalette } from "@/components/AskPalette";
import { CommunityChatModal } from "@/components/CommunityChatModal";
import { ProjectCaseStudyModal } from "@/components/ProjectCaseStudyModal";
import { SidebarNav } from "@/components/SidebarNav";
import { profile } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jemkirk.vercel.app"),
  title: "Jemkirk Utana - Full-Stack Developer in the Philippines",
  description:
    "Portfolio of Jemkirk Utana, a Full-Stack Web Developer & Graphic Designer building practical web apps with Next.js, React, Supabase, C#/.NET, and PHP/MySQL.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Jemkirk Utana — Full-Stack Web Developer",
    description:
      "Full-stack web apps, AI & Web3 prototypes, and NC III design work. Available for freelance builds and internships.",
    url: "https://jemkirk.vercel.app",
    siteName: "Jemkirk L. Utana Portfolio",
    images: [
      {
        url: "/profile/hero-face.jpg",
        width: 800,
        height: 800,
        alt: "Jemkirk L. Utana"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jemkirk Utana — Full-Stack Web Developer",
    description:
      "Full-stack web apps, AI & Web3 prototypes, and NC III design work.",
    images: ["/profile/hero-face.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  }
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme-mode");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||((!t||t==="system")&&d)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-Stack Web Developer & Graphic Designer",
  url: "https://jemkirk.vercel.app",
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH"
  },
  sameAs: [`https://github.com/${profile.github}`, profile.linkedin]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased w-full max-w-full overflow-x-clip`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper dark:focus:bg-paper dark:focus:text-ink"
        >
          Skip to main content
        </a>

        <div className="flex min-h-dvh w-full flex-col lg:flex-row lg:items-start">
          <SidebarNav />
          <div id="main-content" className="min-w-0 flex-1 w-full">
            {children}
          </div>
        </div>

        <AskPalette />
        <CommunityChatModal />
        <ProjectCaseStudyModal />
      </body>
    </html>
  );
}
