import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Navbar";
import { WhatsAppIcon } from "@/components/site";
import { CONTACT, PROMESSES, waLink } from "@/lib/offers";

const columns = [
  {
    title: "Créer",
    links: [
      { name: "Création d'entreprise", href: "/creation-entreprise" },
      { name: "Auto-entrepreneur", href: "/creation-entreprise?forme=auto#formes" },
      { name: "MRE et étrangers", href: "/expatriation" },
      { name: "Trouver ma solution", href: "/onboarding" },
    ],
  },
  {
    title: "Accompagner",
    links: [
      { name: "Aides de l'État", href: "/aides" },
      { name: "Gestion de société", href: "/gestion" },
      { name: "Comptabilité", href: "/comptabilite" },
    ],
  },
  {
    title: "Mziane",
    links: [
      { name: "Packs", href: "/packs" },
      { name: "Tarifs", href: "/tarifs" },
      { name: "Contact", href: `mailto:${CONTACT.email}` },
    ],
  },
  {
    title: "Légal",
    links: [
      { name: "Conditions générales de vente", href: "/terms-and-conditions" },
      { name: "Confidentialité", href: "/privacy-policy" },
      { name: "Remboursement", href: "/refund-policy" },
    ],
  },
];

// Pied de page en deux cartes (même construction que Hoplion)
export default function Footer() {
  return (
    <footer className="bg-zinc-50 px-6 pt-6 pb-8 max-sm:px-4 print:hidden">
      <div className="mx-auto grid max-w-[1200px] gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-700 p-8 max-sm:p-6">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(254,215,102,.3)_0%,transparent_65%)]" />
          <div className="relative">
            <Logo dark />
            <p className="mt-5 text-lg font-semibold leading-snug text-white">
              Créez votre entreprise au Maroc et obtenez vos aides. Sans prêt à intérêt.
            </p>
          </div>
          <div className="relative grid gap-2.5 text-sm text-white/85">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-white hover:underline">
              <WhatsAppIcon className="h-4.5 w-4.5" /> WhatsApp {CONTACT.whatsappDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 font-semibold text-white hover:underline">
              <Mail className="h-4.5 w-4.5" aria-hidden="true" /> {CONTACT.email}
            </a>
            <p className="mt-3 text-white/80">© {new Date().getFullYear()} Mziane. Tous droits réservés.</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 rounded-[28px] border border-zinc-200 bg-white p-8 max-sm:p-6">
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
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
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
            <div>
              <div className="font-bold text-zinc-900">Une question avant de vous lancer ?</div>
              <p className="mt-1 text-sm text-zinc-600">Écrivez-nous sur WhatsApp ou répondez au questionnaire.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-900 transition hover:border-zinc-300"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 text-[#128C4B]" /> WhatsApp
              </a>
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_20px_-8px_rgba(0,105,122,.5)] transition hover:bg-blue-800">
                Trouver ma solution <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 max-md:pb-16">{PROMESSES.societePrivee}</p>
        </div>
      </div>
    </footer>
  );
}
