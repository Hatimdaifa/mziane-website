import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, CtaBand } from "@/components/site";
import { Suspense } from "react";
import FormesSelector, { FormesSelectorFromUrl } from "./FormesSelector";

export const metadata: Metadata = {
  title: "Créer son entreprise au Maroc | Mziane",
  description: "SARLAU, SARL, SAS, SA, SCI ou auto-entrepreneur : statuts, OMPIC, Journal Officiel et registre de commerce en 48 h.",
};

const stats = [
  { value: "95 235", label: "créations en 2024", color: "text-blue-600" },
  { value: "+17,7 %", label: "au 1er semestre 2025", color: "text-red-500" },
  { value: "48 h", label: "pour obtenir votre RC", color: "text-amber-600" },
  { value: "6 étapes", label: "gérées pour vous", color: "text-zinc-900" },
];

const etapes = [
  { title: "Choix du statut juridique", desc: "On identifie la forme adaptée à votre projet, votre secteur, au nombre d'associés et à vos objectifs." },
  { title: "Rédaction des statuts", desc: "Des statuts conformes au droit marocain des sociétés (loi 5-96, loi 17-95 pour la SA)." },
  { title: "Dépôt du capital", desc: "Ouverture du compte et attestation de dépôt demandée par le greffe." },
  { title: "Immatriculation", desc: "Dépôt au tribunal de commerce, publication au Journal Officiel et registre de commerce." },
  { title: "ICE et fiscalité", desc: "Identifiant commun de l'entreprise, inscription à la TVA, à l'IS et à la taxe professionnelle." },
  { title: "Après la création", desc: "Domiciliation, compte bancaire professionnel, CNSS et expert-comptable." },
];

export default function CreationEntreprisePage() {
  return (
    <>
      <PageHero
        icon={BadgeCheck}
        tag="Registre de commerce en 48 h"
        title="Créez votre société au Maroc en toute sérénité"
        subtitle="SARLAU, SARL, SAS ou auto-entrepreneur : nos juristes s'occupent des statuts, de l'OMPIC, du Journal Officiel et du registre de commerce."
        note="Frais de greffe et publications légales au tarif de l'administration"
      >
        <HeroButton href="/onboarding?besoin=creer">Démarrer mon projet <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/tarifs" variant="ghost">Voir les tarifs</HeroButton>
      </PageHero>

      <section className="border-b border-zinc-200 bg-white py-14">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-x-4 gap-y-7 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-[clamp(1.8rem,3.6vw,2.5rem)] font-extrabold tracking-tight tabular-nums ${s.color}`}>{s.value}</div>
              <p className="mt-1 text-[15px] text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="formes" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader tag="Structures disponibles" tagClass="bg-amber-100 text-amber-800" title="Quelle forme juridique choisir ?" subtitle="SARLAU et SARL représentent 99,2 % des sociétés créées au Maroc. Comparez les formes avant de vous lancer." />
          <Suspense fallback={<FormesSelector />}>
            <FormesSelectorFromUrl />
          </Suspense>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader tag="Notre processus" title="De l'idée au registre de commerce en 6 étapes" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {etapes.map(({ title, desc }, n) => (
              <li key={title} className="rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
                <span className="mb-4 block text-4xl font-black tracking-tight text-amber-400 tabular-nums">{String(n + 1).padStart(2, "0")}</span>
                <span className="mb-2 block text-lg font-bold text-zinc-900">{title}</span>
                <span className="block text-[15px] leading-relaxed text-zinc-600">{desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <Link href="/aides" className="group flex items-center gap-6 rounded-3xl bg-amber-400 p-7 text-zinc-900 transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)]">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-zinc-900 text-amber-400"><HandCoins className="h-6 w-6" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-xl font-extrabold tracking-tight">Créer avec les aides de l&apos;État</span>
              <span className="mt-1 block text-[15px] text-zinc-900/75">Prêt d&apos;honneur à 0 %, primes à l&apos;investissement, exonérations et aides à l&apos;embauche : on vérifie à quoi vous avez droit.</span>
            </span>
            <ArrowRight className="h-6 w-6 shrink-0 transition group-hover:translate-x-1 max-sm:hidden" />
          </Link>
        </div>
      </section>

      <CtaBand title="Prêt à créer votre société ?" subtitle="Répondez à quelques questions et obtenez votre recommandation personnalisée." href="/onboarding?besoin=creer" label="Démarrer le questionnaire" />
    </>
  );
}
