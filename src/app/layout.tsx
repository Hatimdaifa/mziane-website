import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Police arabe pour les termes clés affichés à côté du français (composant <Ar>).
const kufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["400", "500"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Mziane",
    default: "Mziane | Créez votre entreprise au Maroc et obtenez vos aides",
  },
  description:
    "Création d'entreprise au Maroc, formalités, marque, domiciliation, comptabilité et accompagnement aux aides de l'État sans prêt à intérêt. Pas d'aide obtenue, pas de frais.",
  applicationName: "Mziane",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "Mziane",
    title: "Créez votre entreprise et obtenez vos aides. Sans prêt à intérêt.",
    description:
      "Création de société, auto-entrepreneur, comptabilité et aides de l'État au Maroc. Prix affichés, frais d'État reversés au réel, suivi sur WhatsApp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${kufi.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
