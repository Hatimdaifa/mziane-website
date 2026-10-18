import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Navbar";

const columns = [
  {
    title: "Créer",
    links: [
      { name: "Création d'entreprise", href: "/creation-entreprise" },
      { name: "MRE et étrangers", href: "/expatriation" },
      { name: "Questionnaire", href: "/onboarding" },
    ],
  },
  {
    title: "Accompagner",
    links: [
      { name: "Aides et subventions", href: "/aides" },
      { name: "Gestion de société", href: "/gestion" },
      { name: "Comptabilité", href: "/comptabilite" },
    ],
  },
  {
    title: "Mziane",
    links: [
      { name: "Tarifs", href: "/tarifs" },
      { name: "Contact", href: "mailto:contact@mziane.com" },
    ],
  },
  {
    title: "Légal",
    links: [
      { name: "Conditions générales", href: "/terms-and-conditions" },
      { name: "Confidentialité", href: "/privacy-policy" },
      { name: "Remboursement", href: "/refund-policy" },
    ],
  },
];

// Pied de page en deux cartes (même construction que Hoplion)
export default function Footer() {
  return (
    <footer className="bg-zinc-50 px-6 pt-6 pb-8 max-sm:px-4">
      <div className="mx-auto grid max-w-[1200px] gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 p-8">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(254,215,102,.3)_0%,transparent_65%)]" />
          <div className="relative">
            <Logo dark />
            <p className="mt-5 text-lg font-semibold leading-snug text-white">
              Créez et gérez votre entreprise au Maroc, et obtenez les aides de l&apos;État de A à Z.
            </p>
          </div>
          <div className="relative text-sm text-white/70">
            <a href="mailto:contact@mziane.com" className="font-semibold text-white">contact@mziane.com</a>
            <p className="mt-3">© {new Date().getFullYear()} Mziane. Tous droits réservés.</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 rounded-[28px] border border-zinc-200 bg-white p-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="mb-4 text-[15px] font-bold text-zinc-900">{col.title}</div>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <Link key={l.name} href={l.href} className="text-[15px] text-zinc-600 transition-colors hover:text-blue-700">
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
            <div>
              <div className="font-bold text-zinc-900">Une question avant de vous lancer ?</div>
              <p className="mt-1 text-sm text-zinc-600">Un conseiller vous répond, 6 jours sur 7.</p>
            </div>
            <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_20px_-8px_rgba(0,132,153,.5)] transition hover:bg-blue-700">
              Démarrer mon projet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
