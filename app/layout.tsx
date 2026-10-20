import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Jemkirk Utana - Full-Stack Developer in the Philippines",
  description: "Portfolio of Jemkirk Utana, a Full-Stack Developer in the Philippines building web systems with Next.js, React, Supabase, PHP, and MySQL.",
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
      </body>
    </html>
  );
}
