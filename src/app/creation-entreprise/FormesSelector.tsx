"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Star, Handshake, Rocket, Zap, Briefcase, House, UsersRound, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckList } from "@/components/site";
import { Ar } from "@/components/Ar";
import { OfficialFeesNote } from "@/components/offer-ui";
import { FORMES, PRIX_CREATION, type FormeId, fmt, waLink } from "@/lib/offers";
import { commandeOffre } from "@/components/services/blocks";

const formes: { id: FormeId; icon: LucideIcon; ar: string; part: string; desc: string; avantages: string[]; popular?: boolean }[] = [
  { id: "sarlau", ar: "شركة ذات مسؤولية محدودة بشريك وحيد", icon: Star, part: "La plus créée au Maroc", desc: "Vous êtes seul, votre patrimoine personnel est protégé.", avantages: ["Un seul associé", "Responsabilité limitée à l'apport", "Capital libre", "Passage en SARL possible plus tard"], popular: true },
  { id: "sarl", ar: "شركة ذات مسؤولية محدودة", icon: Handshake, part: "Pour s'associer", desc: "Société à responsabilité limitée, de 2 à 50 associés.", avantages: ["2 à 50 associés", "Capital libre", "Patrimoine protégé", "Entrée des associés encadrée"] },
  { id: "sas", ar: "شركة المساهمة المبسطة", icon: Rocket, part: "Statuts flexibles", desc: "Société par actions simplifiée, pour les startups et les investisseurs.", avantages: ["Statuts libres", "Adaptée aux startups", "Entrée d'investisseurs", "Actions faciles à céder"] },
  { id: "auto", ar: "المقاول الذاتي", icon: Zap, part: "Démarrer seul, sans capital", desc: "Plafonds de chiffre d'affaires : 500 000 DH (commerce, industrie, artisanat), 200 000 DH (services).", avantages: ["Sans capital", "Inscription gratuite à l'État", "Impôt de 0,5 % à 1 % du chiffre d'affaires", "Couverture AMO"] },
  { id: "cooperative", ar: "تعاونية", icon: UsersRound, part: "Produire ensemble", desc: "Au moins 5 membres (loi 112-12), pour produire et vendre ensemble.", avantages: ["5 membres minimum", "Accès aux aides ODCo et FDA", "Un membre, une voix", "Gestion collective"] },
  { id: "sa", ar: "شركة المساهمة", icon: Briefcase, part: "Grands projets", desc: "Pour les levées de fonds et les gros projets.", avantages: ["Capital minimum 300 000 DH", "5 actionnaires minimum", "Actions librement cessibles", "Conseil d'administration"] },
  { id: "sci", ar: "الشركة المدنية العقارية", icon: House, part: "Patrimoine immobilier", desc: "Détenir des biens immobiliers à plusieurs et les transmettre.", avantages: ["Gestion patrimoniale", "Transmission facilitée", "Plusieurs associés", "Fiscalité à étudier au cas par cas"] },
];

const label = (id: FormeId) => FORMES.find((f) => f.id === id)?.short ?? id;

// Forme présélectionnée depuis le menu : /creation-entreprise?forme=sarl
export function FormesSelectorFromUrl() {
  const forme = useSearchParams().get("forme");
  const i = Math.max(0, formes.findIndex((f) => f.id === forme));
  return <FormesSelector key={i} initial={i} />;
}

export default function FormesSelector({ initial = 0 }: { initial?: number }) {
  const [active, setActive] = useState(initial);
  const f = formes[active];
  const Icon = f.icon;
  const kind = FORMES.find((x) => x.id === f.id)?.kind;
  const prix = PRIX_CREATION[f.id];

  const cta = kind === "ae"
    ? { href: commandeOffre("ae-accompagne", "auto"), text: "M'inscrire en auto-entrepreneur", external: false }
    : kind === "societe"
      ? { href: commandeOffre("soc-standard", f.id), text: `Créer ma ${label(f.id)}`, external: false }
      : { href: waLink(`Bonjour, je souhaite un devis pour créer une ${label(f.id)}.`), text: `Demander un devis ${label(f.id)}`, external: true };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {formes.map((x, i) => {
          const p = PRIX_CREATION[x.id];
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={cn(
                "relative rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5",
                active === i ? "border-blue-700 bg-blue-50" : "border-zinc-200 bg-white hover:border-blue-400",
              )}
            >
              {x.popular && <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-zinc-900">N°1</span>}
              <x.icon className={cn("mb-3 h-6 w-6", active === i ? "text-blue-700" : "text-zinc-500")} />
              <span className="block font-bold text-zinc-900">{label(x.id)}</span>
              <span className="mt-0.5 block text-xs font-semibold text-zinc-600">
                {!p ? "Sur devis" : p[0] === 0 ? "Gratuit en autonomie" : `dès ${fmt(p[0])} DH`}
              </span>
            </button>
          );
        })}
      </div>

      <div key={f.id} className="animate-in fade-in rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_24px_50px_-20px_rgba(31,42,61,.22)] duration-300 max-sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-700 text-white"><Icon className="h-6 w-6" /></span>
          <span>
            <span className="block text-2xl font-extrabold tracking-tight text-zinc-900">{FORMES.find((x) => x.id === f.id)?.label}</span>
            <span className="block"><Ar className="ml-0 text-[13px] leading-normal">{f.ar}</Ar></span>
            <span className="text-sm font-semibold text-blue-700">{f.part}</span>
          </span>
        </div>
        <p className="mb-5 leading-relaxed text-zinc-600">{f.desc}</p>
        <CheckList items={f.avantages} className="mb-6" />

        <div className="mb-5 rounded-2xl bg-zinc-50 px-4 py-3">
          {prix ? (
            <p className="text-[15px] text-zinc-700">
              <span className="text-2xl font-extrabold text-zinc-900 tabular-nums">{fmt(prix[1])} DH</span>{" "}
              <span className="text-sm text-zinc-500">{kind === "ae" ? "TTC, inscription faite pour vous" : "HT, formule Standard"}</span>
              {kind === "ae" && <span className="mt-1 block text-sm text-zinc-600">Ou gratuit si vous faites l&apos;inscription vous-même avec notre guide.</span>}
            </p>
          ) : (
            <p className="text-[15px] text-zinc-700">Devis écrit et gratuit.</p>
          )}
        </div>

        {cta.external ? (
          <a href={cta.href} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800">
            <MessageCircle className="h-4 w-4" /> {cta.text}
          </a>
        ) : (
          <Link href={cta.href} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800">
            {cta.text} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {kind !== "devis" && <OfficialFeesNote kind={kind === "ae" ? "auto" : "societe"} compact className="mt-4" />}
      </div>
    </div>
  );
}
