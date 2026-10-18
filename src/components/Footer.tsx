import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "@/components/Navbar";

const columns = [
  {
    title: "Services",
    links: [
      { name: "Création d'entreprise", href: "/creation-entreprise" },
      { name: "Aides et subventions", href: "/aides" },
      { name: "Gestion de société", href: "/gestion" },
      { name: "Comptabilité", href: "/comptabilite" },
      { name: "Non-résidents & MRE", href: "/non-residents" },
      { name: "Expatriation", href: "/expatriation" },
    ],
  },
  {
    title: "Mziane",
    links: [
      { name: "Tarifs", href: "/tarifs" },
      { name: "Démarrer mon projet", href: "/onboarding" },
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

export default function Footer() {
  return (
    <footer className="bg-zinc-900 pt-20 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] mb-12">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/55">
              Le cabinet qui vous accompagne pour créer et gérer votre entreprise au Maroc, et obtenir les aides de l&apos;État de A à Z.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[15px] font-bold text-white">{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link key={l.name} href={l.href} className="text-[15px] text-white/55 hover:text-white transition-colors">
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 border-t border-white/10 text-sm text-white/40">
          <span>© {new Date().getFullYear()} Mziane. Tous droits réservés.</span>
          <span className="inline-flex items-center gap-1.5">
            Fait avec <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> pour les entrepreneurs au Maroc
          </span>
        </div>
      </div>
    </footer>
  );
}
