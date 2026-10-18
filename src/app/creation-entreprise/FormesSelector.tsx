"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Star, Handshake, Rocket, Zap, Briefcase, House } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckList } from "@/components/site";

const formes = [
  { id: "sarlau", icon: Star, label: "SARLAU", part: "64,7 % des créations", desc: "Société à responsabilité limitée à associé unique. La forme la plus utilisée au Maroc : capital librement fixé, responsabilité limitée à l'apport.", avantages: ["Un seul associé", "Responsabilité limitée", "Capital libre", "Comptabilité simplifiée"], popular: true },
  { id: "sarl", icon: Handshake, label: "SARL", part: "34,5 % des créations", desc: "Société à responsabilité limitée de 2 à 50 associés. Idéale pour s'associer en famille ou entre partenaires.", avantages: ["2 à 50 associés", "Capital libre", "Patrimoine protégé", "Cession des parts encadrée"] },
  { id: "sas", icon: Rocket, label: "SAS", part: "Statuts flexibles", desc: "Société par actions simplifiée. Grande liberté de rédaction des statuts, adaptée aux startups et à l'entrée d'investisseurs.", avantages: ["Statuts libres", "Adaptée aux startups", "Entrée d'investisseurs", "Pas d'appel public"] },
  { id: "auto", icon: Zap, label: "Auto-entrepreneur", part: "Démarrage sans capital", desc: "Régime simplifié pour démarrer seul. Plafonds de 500 000 DH (commerce, industrie, artisanat) et 200 000 DH (services).", avantages: ["Sans capital", "Inscription rapide", "Impôt de 0,5 % à 1 % du CA", "Couverture AMO"] },
  { id: "sa", icon: Briefcase, label: "SA", part: "Grands projets", desc: "Société anonyme. Au moins 5 actionnaires et 300 000 DH de capital. Pour les levées de fonds et les projets capitalistiques.", avantages: ["Capital min. 300 000 DH", "5 actionnaires minimum", "Actions librement cessibles", "Introduction en bourse possible"] },
  { id: "sci", icon: House, label: "SCI", part: "Patrimoine immobilier", desc: "Société civile immobilière. Détenir et gérer des biens immobiliers à plusieurs, faciliter leur transmission.", avantages: ["Gestion patrimoniale", "Transmission facilitée", "Plusieurs associés", "Fiscalité à étudier au cas par cas"] },
];

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

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {formes.map((x, i) => (
          <button
            key={x.label}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={cn(
              "relative rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5",
              active === i ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:border-blue-400"
            )}
          >
            {x.popular && <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-zinc-900">N°1</span>}
            <x.icon className={cn("mb-3 h-6 w-6", active === i ? "text-blue-700" : "text-zinc-500")} />
            <span className="block font-bold text-zinc-900">{x.label}</span>
            <span className="mt-0.5 block text-xs font-semibold text-blue-700">{x.part}</span>
          </button>
        ))}
      </div>

      <div key={f.label} className="animate-in fade-in rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_24px_50px_-20px_rgba(31,42,61,.22)] duration-300">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white"><Icon className="h-6 w-6" /></span>
          <span>
            <span className="block text-2xl font-extrabold tracking-tight text-zinc-900">{f.label}</span>
            <span className="text-sm font-semibold text-blue-700">{f.part}</span>
          </span>
        </div>
        <p className="mb-5 leading-relaxed text-zinc-600">{f.desc}</p>
        <CheckList items={f.avantages} className="mb-6" />
        <Link href="/onboarding?besoin=creer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          Créer ma {f.label === "Auto-entrepreneur" ? "micro-entreprise" : f.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
