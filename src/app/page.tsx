"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Building2, Rocket, Globe, Clock, ShieldCheck, Users, Scale,
  Landmark, Calculator, Check, MessageCircle, Plus, Star, Briefcase, House, Zap, Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Données ─────────────────────────────────────────────────────────────────
const heroPhrases = ["au Maroc", "votre SARLAU", "depuis l'étranger", "simplement"];

const stats = [
  { value: "95 235", label: "entreprises créées au Maroc en 2024", color: "text-blue-600" },
  { value: "+17,7 %", label: "de créations au 1er semestre 2025", color: "text-red-500" },
  { value: "48 h", label: "pour obtenir votre RC", color: "text-amber-600" },
  { value: "6 j/7", label: "experts disponibles au Maroc", color: "text-zinc-900" },
];

const organismes = ["OMPIC", "Tribunal de commerce", "DGI", "CNSS", "CRI", "Dar Al Moukawil", "Journal Officiel", "Banques marocaines"];

const avantages = [
  { icon: Clock, title: "RC en 48 h", desc: "Votre dossier est traité et déposé à l'OMPIC sous 24 h. Vous obtenez votre registre de commerce en un temps record." },
  { icon: ShieldCheck, title: "Zéro rejet OMPIC", desc: "Nos experts vérifient chaque dossier avant dépôt. Nous garantissons l'acceptation par le greffe." },
  { icon: Users, title: "Experts au Maroc", desc: "Juristes et comptables basés à Casablanca, Rabat et Marrakech, disponibles 6 jours sur 7." },
  { icon: Scale, title: "Juriste dédié", desc: "Un seul interlocuteur qui connaît votre dossier, de la rédaction des statuts jusqu'à l'immatriculation." },
  { icon: Landmark, title: "Banque et domiciliation", desc: "Ouverture du compte bancaire, dépôt du capital et domiciliation : on coordonne tout pour vous." },
  { icon: Calculator, title: "Comptabilité ensuite", desc: "Une fois la société créée, on assure la tenue comptable, la TVA, l'IS et le bilan annuel." },
];
const iconColors = [
  "bg-blue-50 text-blue-700",
  "bg-amber-100 text-amber-800",
  "bg-red-50 text-red-600",
];

const formes = [
  { icon: Star, label: "SARLAU", desc: "64,7 % des créations", head: "from-blue-700 to-blue-400", points: ["1 seul associé", "Responsabilité limitée", "Capital libre", "Comptabilité simplifiée"], popular: true },
  { icon: Handshake, label: "SARL", desc: "34,5 % des créations", head: "from-red-600 to-red-400", points: ["2 à 50 associés", "Capital libre", "Protection du patrimoine", "Cession des parts encadrée"] },
  { icon: Zap, label: "Auto-entrepreneur", desc: "Démarrage sans capital", head: "from-amber-500 to-amber-300", dark: true, points: ["Sans capital", "Inscription rapide", "Plafond 500 000 DH (commerce)", "Plafond 200 000 DH (services)"] },
  { icon: Rocket, label: "SAS", desc: "Flexibilité statutaire", head: "from-zinc-900 to-zinc-700", points: ["Statuts libres", "Idéale pour une startup", "Entrée d'investisseurs", "Pas d'appel public"] },
  { icon: Briefcase, label: "SA", desc: "Grands projets", head: "from-blue-800 to-blue-500", points: ["Capital min. 300 000 DH", "5 actionnaires minimum", "Actions librement cessibles", "Introduction en bourse possible"] },
  { icon: House, label: "SCI", desc: "Patrimoine immobilier", head: "from-red-700 to-amber-400", points: ["Gestion patrimoniale", "Transmission facilitée", "Optimisation fiscale", "Plusieurs associés"] },
];

const etapes = [
  { title: "Choix du statut juridique", desc: "Un questionnaire pour identifier la forme la plus adaptée à votre projet, votre secteur, au nombre d'associés et à vos objectifs." },
  { title: "Rédaction des statuts", desc: "Des statuts rédigés par un professionnel, conformes au droit marocain des sociétés (loi 5-96 modifiée, loi 17-95 pour la SA)." },
  { title: "Dépôt du capital", desc: "On vous assiste pour ouvrir le compte de capital et obtenir l'attestation de dépôt demandée par le greffe." },
  { title: "Immatriculation OMPIC", desc: "Dépôt du dossier complet au greffe du tribunal de commerce, publication au Journal Officiel et obtention du RC." },
  { title: "ICE et fiscalité", desc: "Récupération de l'Identifiant Commun de l'Entreprise, inscription à la TVA, à l'IS et à la taxe professionnelle." },
  { title: "Après la création", desc: "Domiciliation, compte bancaire professionnel, CNSS et mise en relation avec un expert-comptable." },
];

const faq = [
  { q: "Combien de temps faut-il pour créer ma société ?", a: "Une fois votre dossier complet, nous le déposons à l'OMPIC sous 24 h. Vous obtenez en général votre registre de commerce en 48 h." },
  { q: "SARLAU ou SARL : laquelle choisir ?", a: "La SARLAU convient si vous êtes seul associé : c'est la forme la plus utilisée au Maroc (64,7 % des créations). La SARL s'adresse aux projets de 2 à 50 associés. Le capital est libre dans les deux cas et votre responsabilité est limitée à vos apports." },
  { q: "Quels sont les plafonds de l'auto-entrepreneur ?", a: "Le chiffre d'affaires annuel ne doit pas dépasser 500 000 DH pour le commerce et l'industrie, et 200 000 DH pour les prestations de services. Au-delà, nous vous accompagnons pour passer en SARLAU." },
  { q: "Je vis à l'étranger, puis-je créer ma société au Maroc ?", a: "Oui. MRE, non-résidents et investisseurs étrangers : nous gérons le compte en devises, les procurations et toutes les démarches sur place, sans que vous ayez à vous déplacer." },
  { q: "Les frais de greffe sont-ils inclus dans vos tarifs ?", a: "Non. Les frais de greffe et de publications légales sont facturés à part, au prix fixé par l'administration. Nos tarifs couvrent notre accompagnement." },
];

// ── Titre animé du hero ─────────────────────────────────────────────────────
function FlipPhrase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % heroPhrases.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span aria-hidden="true" className="relative block h-[1.1em] text-blue-600 [perspective:1200px]">
      {heroPhrases.map((p, n) => (
        <span
          key={p}
          className={cn(
            "absolute inset-0 whitespace-nowrap transition-all duration-500 [backface-visibility:hidden]",
            n === i ? "opacity-100 [transform:rotateX(0deg)]" : "opacity-0 [transform:rotateX(-90deg)]"
          )}
        >
          {p}
        </span>
      ))}
    </span>
  );
}

// ── Maquette produit (décorative) ───────────────────────────────────────────
function HeroMock() {
  return (
    <div aria-hidden="true" className="group relative mx-auto mt-5 mb-10 w-full max-w-[460px] max-sm:max-w-[220px] max-sm:h-[340px]">
      <div className="max-sm:hidden absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg [transform:translate(-16px,-16px)_rotate(6deg)]" />
      <div className="max-sm:hidden absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg [transform:translate(-30px,-30px)_rotate(12deg)]" />

      <div className="max-sm:hidden relative z-10 overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_30px_60px_-20px_rgba(31,42,61,.35)] rotate-2 transition-transform duration-500 group-hover:rotate-1">
        <div className="flex items-center gap-3.5 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <span className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <i className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <i className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          </span>
          <span className="flex-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-500">mziane · mon dossier</span>
        </div>
        <div className="min-h-[290px] p-5">
          <div className="mb-4 flex items-center gap-2.5 text-[15px] text-zinc-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white"><Building2 className="h-4 w-4" /></span>
            <b>Bonjour, Yasmine</b>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              ["Forme", "SARLAU", "bg-blue-50"],
              ["Ville", "Casablanca", "bg-red-50"],
              ["Étape", "4 / 6", "bg-amber-50"],
            ].map(([k, v, bg]) => (
              <div key={k} className={cn("rounded-2xl p-2.5", bg)}>
                <span className="block text-[10px] font-semibold text-zinc-500">{k}</span>
                <b className="text-[15px] tracking-tight text-zinc-900">{v}</b>
              </div>
            ))}
          </div>
          {[
            ["Statuts rédigés", "100%"],
            ["Dépôt OMPIC", "70%"],
          ].map(([k, w]) => (
            <div key={k} className="mb-2.5 text-[11px] font-semibold text-zinc-900">
              {k}
              <div className="mt-1 h-[7px] overflow-hidden rounded-full bg-zinc-100">
                <i className="block h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-300" style={{ width: w }} />
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["Statuts", "bg-blue-600 text-white"],
              ["Banque", "bg-red-500 text-white"],
              ["OMPIC", "bg-amber-400 text-zinc-900"],
              ["ICE", "bg-zinc-900 text-white"],
              ["CNSS", "bg-blue-400 text-white"],
            ].map(([k, c]) => (
              <span key={k} className={cn("rounded-xl px-2.5 py-2 text-[11px] font-bold", c)}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute z-20 -right-8 -bottom-11 h-80 w-[170px] rounded-[34px] bg-zinc-900 p-[7px] shadow-[0_30px_50px_-18px_rgba(17,27,46,.55)] -rotate-[10deg] transition-transform duration-500 group-hover:-rotate-6 max-sm:relative max-sm:right-auto max-sm:bottom-auto max-sm:mx-auto max-sm:-rotate-[4deg]">
        <div className="h-full overflow-hidden rounded-[28px] bg-white px-3 py-3">
          <div className="mb-3 flex justify-between text-[10px] text-zinc-500"><b className="text-zinc-900">9:41</b><span>Dossier</span></div>
          <div className="mb-2.5 text-xs font-bold leading-snug text-zinc-900">Votre SARLAU avance</div>
          {[
            ["Certificat négatif", true],
            ["Statuts signés", true],
            ["Registre de commerce", true],
            ["ICE", false],
          ].map(([k, ok]) => (
            <div
              key={k as string}
              className={cn(
                "mb-1.5 rounded-[10px] border px-2 py-1.5 text-[11px]",
                ok ? "border-blue-500 bg-blue-50 font-bold text-blue-800" : "border-zinc-200 text-zinc-900"
              )}
            >
              {k} {ok ? "✓" : ""}
            </div>
          ))}
          <div className="mt-2.5 rounded-full bg-blue-600 p-2 text-center text-[10px] font-bold text-white">Voir mon RC →</div>
        </div>
      </div>
    </div>
  );
}

// ── Étapes : carrousel (même construction que les avis Hoplion) ─────────────
function Etapes() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % etapes.length), 5000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="bg-white py-24 max-md:py-16 overflow-hidden">
      <div className="mx-auto grid max-w-[1100px] items-center gap-20 px-6 max-md:gap-10 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-bold text-blue-700">
            <Clock className="h-3.5 w-3.5" /> Notre processus
          </span>
          <h2 className="mt-5 mb-4 text-[clamp(2rem,4.2vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-zinc-900">
            De l&apos;idée au RC en 6 étapes
          </h2>
          <p className="max-w-[460px] text-lg leading-relaxed text-zinc-600">
            On s&apos;occupe de chaque démarche, vous suivez l&apos;avancement de votre dossier à chaque étape.
          </p>
          <div className="flex gap-2.5 pt-7">
            {etapes.map((e, n) => (
              <button
                key={e.title}
                type="button"
                aria-label={`Voir l'étape ${n + 1}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={cn("h-2.5 rounded-full transition-all duration-300", n === i ? "w-10 bg-blue-600" : "w-2.5 bg-zinc-900/20")}
              />
            ))}
          </div>
        </div>

        <div className="relative isolate grid min-h-[300px] md:mr-6" aria-live="polite">
          {etapes.map((e, n) => (
            <figure
              key={e.title}
              aria-hidden={n !== i}
              className={cn(
                "relative m-0 flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_24px_50px_-20px_rgba(31,42,61,.22)] transition-all duration-500 [grid-area:1/1] max-md:p-6",
                n === i ? "z-10 opacity-100" : "pointer-events-none opacity-0 translate-x-24 scale-90"
              )}
            >
              <span className="mb-5 text-5xl font-black tracking-tight text-amber-400">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-zinc-900">{e.title}</h3>
              <p className="flex-1 text-[17px] leading-relaxed text-zinc-600">{e.desc}</p>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-5 text-sm text-zinc-500">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-300 text-white">
                  <Check className="h-5 w-5" />
                </span>
                Étape {n + 1} sur {etapes.length}, gérée par votre juriste
              </figcaption>
            </figure>
          ))}
          <span aria-hidden="true" className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 rounded-[20px] bg-blue-500/10" />
          <span aria-hidden="true" className="absolute -top-6 -right-6 -z-10 h-24 w-24 rounded-[20px] bg-amber-400/20" />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ tag, title, subtitle, tagClass = "bg-blue-50 text-blue-700", left = false }: {
  tag: React.ReactNode; title: string; subtitle?: string; tagClass?: string; left?: boolean;
}) {
  return (
    <div className={cn("mb-14", left ? "text-left" : "text-center")}>
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold", tagClass)}>{tag}</span>
      <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">{title}</h2>
      {subtitle && (
        <p className={cn("mt-3 max-w-[600px] text-[17px] text-zinc-600", !left && "mx-auto")}>{subtitle}</p>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative -mt-[76px] overflow-hidden bg-gradient-to-b from-white to-zinc-50 pt-[calc(76px+72px)] pb-20 max-sm:pb-10">
        <div className="pointer-events-none absolute -top-48 -right-48 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(0,159,183,.08)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(254,74,73,.06)_0%,transparent_65%)]" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-blue-700">
              <Building2 className="h-3.5 w-3.5" /> Cabinet de création d&apos;entreprise au Maroc
            </span>
            <h1 className="mb-6 text-[clamp(2rem,5.2vw,4rem)] font-extrabold leading-[1.05] tracking-[-.04em] text-zinc-900">
              <span className="sr-only">Lancez votre activité au Maroc, simplement</span>
              <span aria-hidden="true" className="block">Lancez votre activité</span>
              <FlipPhrase />
            </h1>
            <p className="mb-8 max-w-[520px] text-lg leading-relaxed text-zinc-600">
              Auto-entrepreneur, SARLAU, SARL ou implantation depuis l&apos;étranger : Mziane vous accompagne{" "}
              <strong className="text-zinc-900">de l&apos;inscription à la comptabilité</strong>, avec un juriste dédié et un suivi de votre dossier à chaque étape.
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_17px_20px_-8px_rgba(0,132,153,.35)] transition hover:-translate-y-0.5 hover:bg-blue-700">
                Démarrer mon projet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tarifs" className="inline-flex items-center rounded-2xl border-2 border-blue-600 px-8 py-4 font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white">
                Voir les tarifs
              </Link>
            </div>
            <p className="text-[13px] text-zinc-500">RC en 48 h · Experts basés au Maroc · Zéro rejet OMPIC garanti</p>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* ── CHIFFRES ── */}
      <section className="border-b border-zinc-200 bg-white py-14">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-4 gap-y-7 px-6 md:grid-cols-4 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={cn("text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-tight tabular-nums", s.color)}>{s.value}</div>
              <p className="mt-1.5 text-[15px] text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARCOURS (bento) ── */}
      <section className="bg-zinc-50 py-24 max-md:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeader
            tag={<><Rocket className="h-3.5 w-3.5" /> Votre situation</>}
            title="Choisissez votre parcours"
            subtitle="Trois entrées claires adaptées aux réalités du marché marocain, et la comptabilité pour la suite."
          />
          <div className="mx-auto grid max-w-[1100px] auto-rows-[minmax(190px,auto)] gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/onboarding" className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)] sm:col-span-2 lg:row-span-2 max-sm:p-6">
              <svg aria-hidden="true" viewBox="0 0 377 368" className="absolute -right-16 -bottom-16 h-[340px] w-[340px] fill-blue-50 transition-transform duration-[2s] group-hover:rotate-180"><path d="M179.692 5.79814C182.635 -1.93287 193.572 -1.93285 196.515 5.79816L229.505 92.466C231.206 96.9342 236.103 99.2928 240.657 97.8366L328.986 69.5929C336.865 67.0735 343.684 75.6242 339.474 82.7452L292.284 162.574C289.851 166.69 291.061 171.99 295.038 174.642L372.192 226.091C379.075 230.68 376.641 241.343 368.449 242.491L276.613 255.369C271.878 256.033 268.489 260.283 268.895 265.047L276.776 357.445C277.479 365.688 267.625 370.433 261.619 364.744L194.293 300.973C190.821 297.686 185.386 297.686 181.914 300.973L114.588 364.744C108.582 370.433 98.7281 365.688 99.4311 357.445L107.312 265.047C107.718 260.283 104.329 256.033 99.5941 255.369L7.7582 242.491C-0.433812 241.343 -2.86746 230.68 4.01488 226.091L81.1687 174.642C85.1465 171.99 86.3561 166.69 83.9231 162.574L36.7325 82.7452C32.523 75.6242 39.342 67.0735 47.2212 69.5929L135.55 97.8366C140.104 99.2928 145.001 96.9342 146.702 92.4659L179.692 5.79814Z" /></svg>
              <span className="relative self-start rounded-full bg-blue-600 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-white">À partir de 990 DH</span>
              <span className="relative text-[clamp(2.4rem,5vw,3.6rem)] font-black leading-none tracking-[-.05em] text-zinc-900">Je lance ma société</span>
              <span className="relative max-w-[380px] text-[17px] leading-relaxed text-zinc-600">SARLAU, SARL ou SAS : statuts, greffe, Journal Officiel et RC en 48 h. 99,2 % des sociétés créées au Maroc sont des SARLAU ou des SARL.</span>
              <span aria-hidden="true" className="relative grid max-w-[360px] -rotate-[1.5deg] gap-1.5 rounded-[18px] border border-zinc-200 bg-white p-3.5 shadow-[0_14px_28px_-16px_rgba(31,42,61,.25)] transition-transform group-hover:rotate-0">
                <span className="flex justify-between text-[11px] text-zinc-500"><b className="text-blue-700">Dossier · SARLAU</b><span>Étape 4 sur 6</span></span>
                {[["Statuts rédigés", true], ["Capital déposé", true], ["Dépôt OMPIC", false]].map(([k, ok]) => (
                  <span key={k as string} className={cn("flex items-center gap-2.5 rounded-xl border-2 px-2.5 py-1.5 text-[13px] font-semibold", ok ? "border-blue-500 bg-blue-50 text-blue-800" : "border-zinc-200 text-zinc-900")}>
                    <i className={cn("grid h-6 w-6 place-items-center rounded-full not-italic", ok ? "bg-blue-500 text-white" : "bg-zinc-100")}>
                      {ok ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    </i>
                    {k}
                  </span>
                ))}
              </span>
              <span className="relative inline-flex items-center gap-2.5 self-start rounded-full bg-blue-600 px-6 py-3.5 font-bold text-white shadow-[0_17px_20px_-8px_rgba(0,132,153,.35)] transition group-hover:-translate-y-0.5 max-sm:self-stretch max-sm:justify-center">
                Lancer ma société <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link href="/onboarding" className="flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-red-500 p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)]">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-white/20"><Zap className="h-5 w-5" /></span>
              <span>
                <span className="block text-[2rem] font-black leading-none tracking-tight">Je démarre seul</span>
                <span className="mt-1.5 block text-[15px] font-semibold opacity-95">Auto-entrepreneur, freelance, e-commerce</span>
              </span>
              <span className="text-sm opacity-90">Gratuit à 490 DH →</span>
            </Link>

            <Link href="/non-residents" className="flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-zinc-900 p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)]">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-blue-600"><Globe className="h-5 w-5" /></span>
              <span>
                <span className="block text-[2rem] font-black leading-none tracking-tight">Je m&apos;installe au Maroc</span>
                <span className="mt-1.5 block text-[15px] font-semibold text-white/70">MRE, non-résident, investisseur</span>
              </span>
              <span className="text-sm text-white/60">Compte en devises, procurations →</span>
            </Link>

            <Link href="/comptabilite" className="group flex items-center gap-6 overflow-hidden rounded-3xl bg-blue-600 p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)] sm:col-span-2">
              <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-amber-400 text-zinc-900 max-sm:h-14 max-sm:w-14">
                <Calculator className="h-8 w-8 max-sm:h-6 max-sm:w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.35rem] font-extrabold leading-tight tracking-tight">Comptabilité</span>
                <span className="mt-1 block text-sm opacity-90">Tenue comptable, TVA, IS et bilan annuel, dès 490 DH par mois.</span>
              </span>
              <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-white text-3xl font-bold text-blue-700 transition-transform group-hover:translate-x-1 max-sm:hidden">→</span>
            </Link>
          </div>
          <p className="mt-7 text-center text-sm text-zinc-600">
            Frais de greffe et publications légales non inclus ·{" "}
            <Link href="/tarifs" className="font-semibold text-blue-700">Voir tous les tarifs →</Link>
          </p>
        </div>
      </section>

      {/* ── ORGANISMES ── */}
      <section className="bg-white pt-12 pb-4">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-6 text-center text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-zinc-900">Vos démarches auprès de</h2>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-[mz-marquee_30s_linear_infinite] gap-4 motion-reduce:animate-none">
              {[...organismes, ...organismes].map((o, n) => (
                <span key={n} aria-hidden={n >= organismes.length} className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-6 py-3 text-[15px] font-semibold text-zinc-700">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POURQUOI MZIANE ── */}
      <section className="bg-white py-24 max-md:py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader
            left
            tag="Pourquoi Mziane ?"
            title="Simple. Rapide. Fiable."
            subtitle="Un accompagnement complet pensé pour que vous vous concentriez sur votre activité."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {avantages.map(({ icon: Icon, title, desc }, n) => (
              <div key={title} className="rounded-3xl bg-zinc-50 p-6.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
                <div className={cn("mb-5 grid h-[42px] w-14 place-items-center rounded-full", iconColors[n % 3])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-2 text-lg font-bold text-zinc-900">{title}</div>
                <p className="text-[15px] leading-relaxed text-zinc-600 line-clamp-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMES JURIDIQUES ── */}
      <section className="bg-zinc-50 py-24 max-md:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeader
            tag="Structures disponibles"
            tagClass="bg-amber-100 text-amber-800"
            title="Quelle forme juridique choisir ?"
            subtitle="SARLAU et SARL représentent 99,2 % des sociétés créées au Maroc. On vous aide à choisir la bonne dès le départ."
          />
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {formes.map(({ icon: Icon, label, desc, head, points, popular, dark }) => (
              <div key={label} className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)]">
                <div className={cn("relative bg-gradient-to-br p-7", head, dark ? "text-zinc-900" : "text-white")}>
                  {popular && (
                    <span className="absolute top-5 right-5 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-zinc-900">N°1</span>
                  )}
                  <div className={cn("mb-3.5 grid h-11 w-11 place-items-center rounded-xl", dark ? "bg-zinc-900/10" : "bg-white/15")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mb-1 text-xl font-extrabold">{label}</div>
                  <div className={cn("text-sm", dark ? "text-zinc-900/75" : "text-white/80")}>{desc}</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-5 flex flex-1 flex-col gap-2">
                    {points.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-sm text-zinc-600">
                        <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" strokeWidth={2.5} />
                        {p}
                      </div>
                    ))}
                  </div>
                  <Link href="/onboarding" className="rounded-xl bg-blue-600 py-3 text-center text-[15px] font-semibold text-white transition hover:bg-blue-700">
                    Créer ma {label === "Auto-entrepreneur" ? "micro-entreprise" : label} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <Etapes />

      {/* ── FAQ ── */}
      <section className="bg-zinc-50 py-24 max-md:py-16">
        <div className="mx-auto grid max-w-[1100px] items-start gap-14 px-6 max-md:gap-7 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-28">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold tracking-[.12em] text-blue-700">FAQ</span>
            <h2 className="mt-3.5 mb-3 text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-zinc-900">Vous avez des questions ?</h2>
            <p className="mb-6 leading-relaxed text-zinc-600">
              Les réponses aux questions les plus posées sur la création d&apos;entreprise au Maroc. Une autre question ? Écrivez-nous à{" "}
              <a href="mailto:contact@mziane.com" className="font-semibold text-blue-700">contact@mziane.com</a>.
            </p>
            <div className="grid gap-3 rounded-[20px] border border-zinc-200 bg-white p-4.5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800"><MessageCircle className="h-5 w-5" /></span>
                <div>
                  <b className="block text-[15px] text-zinc-900">Parler à un expert</b>
                  <small className="text-[13px] text-zinc-600">Un juriste vous répond, 6 jours sur 7</small>
                </div>
              </div>
              <a href="mailto:contact@mziane.com" className="rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700">
                Nous contacter →
              </a>
            </div>
          </div>
          <div className="grid gap-3">
            {faq.map(({ q, a }) => (
              <details key={q} className="group rounded-[18px] border border-zinc-200 bg-white px-5.5 transition open:border-blue-500/30 open:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-600 transition-transform group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-zinc-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
