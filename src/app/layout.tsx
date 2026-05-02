import type { Metadata } from "next";
import { Geist, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mziane — Cabinet de conseil",
  description:
    "Accompagnement en création d'entreprise, comptabilité et expatriation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7] font-[family-name:var(--font-geist-sans)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
