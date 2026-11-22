// app/layout.tsx
// The outer shell of every page. It loads the two fonts from the design:
// Fraunces for headlines and DM Sans for body text.
import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

// Each font gets a CSS variable so our styles can use it by name.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

// The title that shows in the browser tab.
export const metadata: Metadata = {
  title: "Adaptation options | WorldFish",
  description: "Practical ways to help fish farmers, fishers and coastal communities adapt to a changing climate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}