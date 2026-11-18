import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CommunityChatModal } from "@/components/CommunityChatModal";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jemkirk.vercel.app"),
  title: "Jemkirk Utana - Full-Stack Developer in the Philippines",
  description:
    "Portfolio of Jemkirk Utana, a Full-Stack Web Developer & Graphic Designer building practical web apps with Next.js, React, Supabase, C#/.NET, and PHP/MySQL.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased w-full max-w-full overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <CommunityChatModal />
      </body>
    </html>
  );
}
