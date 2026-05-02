"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const formes = [
  {
    emoji: "⭐",
    label: "SARLAU",
    part: "64,7% des créations",
    desc: "Société à Responsabilité Limitée à Associé Unique. La forme la plus populaire au Maroc. Capital librement fixé, responsabilité limitée à l'apport.",
    avantages: ["1 seul associé", "Responsabilité limitée", "Capital libre", "Comptabilité simplifiée"],
    popular: true,
  },
  {
    emoji: "🤝",
    label: "SARL",
    part: "34,5% des créations",
    desc: "Société à Responsabilité Limitée classique. Entre 2 et 50 associés, régime réglementé, idéale pour les associés familiaux ou commerciaux.",
    avantages: ["2 à 50 associés", "Capital libre", "Protection du patrimoine", "Cédabilité des parts"],
    popular: false,
  },
  {
    emoji: "🏗️",
    label: "SAS",
    part: "Flexibilité statutaire",
    desc: "Société par Actions Simplifiée. Grande liberté de rédaction des statuts. Adaptée aux startups, projets innovants et entrées au capital.",
    avantages: ["Statuts libres", "Idéale startup", "Entrée investisseurs", "Pas d'appel public"],
    popular: false,
  },
  {
    emoji: "⚡",
    label: "Auto-entrepreneur",
    part: "Démarrage sans capital",
    desc: "Régime simplifié pour démarrer une activité. Plafonds : 500 000 DH (commerce/industrie) et 200 000 DH (services). Inscription en ligne sur Dar Al Moukawil.",
    avantages: ["Sans capital", "Inscription rapide", "Plafonds DH", "Liste officielle activités"],
    popular: false,
  },
  {
    emoji: "🏦",
    label: "SA",
    part: "Grands projets",
    desc: "Société Anonyme. Minimum 5 actionnaires, capital minimum 300 000 DH. Adaptée aux levées de fonds, introductions en bourse et projets capitalistiques.",
    avantages: ["Capital min. 300k DH", "5 actionnaires min.", "Actions librement cessibles", "Introduction possible en bourse"],
    popular: false,
  },
  {
    emoji: "🏠",
    label: "SCI",
    part: "Patrimoine immobilier",
    desc: "Société Civile Immobilière. Détention et gestion de biens immobiliers en commun. Très utilisée pour la transmission patrimoniale et l'optimisation fiscale.",
    avantages: ["Gestion patrimoniale", "Transmission facilitée", "Optimisation fiscale", "Multi-associés"],
    popular: false,
  },
];

const etapes = [
  { num: "01", title: "Choix du statut juridique", desc: "Questionnaire pour identifier la forme optimale selon votre projet, secteur d'activité, nombre d'associés et objectifs de développement." },
  { num: "02", title: "Rédaction des statuts", desc: "Rédaction professionnelle de vos statuts conformes au droit marocain des sociétés (loi 5-96 modifiée, loi 17-95 pour la SA)." },
  { num: "03", title: "Dépôt du capital bancaire", desc: "Assistance pour l'ouverture du compte de capital et l'obtention de l'attestation de dépôt nécessaire au greffe." },
  { num: "04", title: "Immatriculation OMPIC", desc: "Dépôt du dossier complet au greffe du tribunal de commerce, publication au Journal Officiel et obtention du RC." },
  { num: "05", title: "Obtention de l'ICE & fiscalité", desc: "Récupération de l'Identifiant Commun de l'Entreprise (ICE), inscription à la TVA, IS et à la patente selon votre activité." },
  { num: "06", title: "Accompagnement post-création", desc: "Domiciliation, compte bancaire professionnel, CNSS, mise en relation avec un expert-comptable partenaire." },
];

const stats = [
  { value: "95 235", label: "créations en 2024" },
  { value: "67 000+", label: "personnes morales" },
  { value: "48h", label: "pour obtenir votre RC" },
  { value: "+17,7%", label: "de hausse S1 2025" },
];

export default function CreationEntreprisePage() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-800 mb-8 rotate-[-1deg]">
          🇲🇦 RC en 48h garanti — OMPIC
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6 max-w-3xl">
          Créez votre société
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">au Maroc</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-amber-300 -z-0 rotate-[-1deg]" />
          </span>
          <span className="text-blue-600"> en toute sérénité.</span>
        </h1>
        <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
          SARLAU, SARL, SAS ou auto-entrepreneur — nos juristes s&apos;occupent de tout :
          statuts, greffe OMPIC, Journal Officiel et Kbis en 48h.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="h-14 px-8 bg-zinc-900 text-white text-lg font-bold rounded-full shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer mon projet →</Link>
          </Button>
          <Button asChild variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-2 border-zinc-900 hover:bg-zinc-100 transition-all">
            <Link href="/tarifs">Voir les tarifs</Link>
          </Button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-zinc-900 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-amber-400 mb-1">{s.value}</p>
              <p className="text-zinc-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMES JURIDIQUES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold mb-2">Structures disponibles</p>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Quelle forme juridique choisir ?</h2>
          <p className="text-zinc-600 max-w-xl mx-auto">
            SARLAU et SARL représentent 99,2% des sociétés créées au Maroc. Nous vous aidons à faire le bon choix dès le départ.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {formes.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActive(i)}
              className={cn(
                "group p-6 rounded-2xl border-2 text-left transition-all duration-200",
                active === i
                  ? "border-zinc-900 bg-amber-50 shadow-[4px_4px_0px_0px] shadow-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              )}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-xl text-zinc-900">{f.label}</h3>
                {f.popular && (
                  <span className="text-xs bg-amber-400 text-zinc-900 font-bold px-2 py-0.5 rounded-full border border-amber-500">#1</span>
                )}
              </div>
              <p className="text-xs text-blue-600 font-semibold mb-2">{f.part}</p>
              <p className="text-sm text-zinc-500 leading-snug hidden md:block">{f.desc.slice(0, 80)}…</p>
              <div className={cn("mt-3 flex items-center gap-1 text-sm font-semibold transition-colors", active === i ? "text-zinc-900" : "text-transparent group-hover:text-zinc-400")}>
                En savoir plus <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 shadow-[4px_4px_0px_0px] shadow-zinc-900">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{formes[active].emoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-zinc-900">{formes[active].label}</h3>
                  <p className="text-blue-600 font-semibold text-sm">{formes[active].part}</p>
                </div>
              </div>
              <p className="text-zinc-600 leading-relaxed">{formes[active].desc}</p>
            </div>
            <div className="md:w-56">
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Points clés</p>
              <ul className="space-y-2">
                {formes[active].avantages.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-zinc-700">
                    <span className="text-amber-500 font-bold">✓</span> {a}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full mt-6 bg-zinc-900 text-white rounded-full font-bold shadow-[3px_3px_0px_0px] shadow-amber-400 hover:shadow-[5px_5px_0px_0px] transition-all">
                <Link href="/onboarding">Choisir cette forme →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ÉTAPES ── */}
      <section className="bg-zinc-50 border-y-2 border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-500 font-semibold mb-2">Notre processus</p>
            <h2 className="text-4xl font-black text-zinc-900">De l&apos;idée au RC en 6 étapes</h2>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {etapes.map(({ num, title, desc }) => (
              <div key={num} className="bg-white border-2 border-zinc-200 rounded-2xl p-6 flex gap-6 items-start hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 transition-all duration-200">
                <span className="text-4xl font-black text-amber-300 min-w-[3rem]">{num}</span>
                <div>
                  <h3 className="font-black text-lg text-zinc-900 mb-1">{title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Prêt à créer votre société ?</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Répondez à 5 questions et obtenez votre recommandation personnalisée.
          </p>
          <Button asChild className="h-14 px-10 bg-amber-400 text-zinc-900 text-lg font-black rounded-full shadow-[4px_4px_0px_0px] shadow-amber-600 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer le questionnaire →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
