import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { WhatsAppIcon } from "@/components/site";
import { waLink } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

const liens = [
  { href: "/packs", label: "Nos packs" },
  { href: "/creation-entreprise", label: "Créer mon entreprise" },
  { href: "/aides", label: "Aides de l'État" },
  { href: "/tarifs", label: "Tarifs" },
];

export default function NotFound() {
  return (
    <section className="bg-zinc-50 px-6 py-20 max-sm:px-4 max-sm:py-12">
      <div className="mx-auto max-w-[640px] rounded-[32px] border border-zinc-200 bg-white px-10 py-12 text-center max-sm:px-6 max-sm:py-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Compass className="h-7 w-7" aria-hidden /></span>
        <h1 className="mt-5 text-[clamp(1.8rem,3.4vw,2.4rem)] font-extrabold tracking-tight text-zinc-900">Page introuvable</h1>
        <p className="mt-2 text-zinc-600">Cette page n&apos;existe pas ou a été déplacée. Répondez au questionnaire pour trouver la bonne solution, ou choisissez une rubrique.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
            Trouver ma solution <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-900 transition hover:border-zinc-300">
            <WhatsAppIcon className="h-4.5 w-4.5 text-[#128C4B]" /> WhatsApp
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-zinc-200 pt-6 text-sm font-semibold">
          {liens.map((l) => <li key={l.href}><Link href={l.href} className="text-blue-700 hover:underline">{l.label}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
