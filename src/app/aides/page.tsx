import type { Metadata } from "next";
import { ArrowRight, HandCoins, Search, FileCheck, Send, BadgeCheck, Tractor, Building2, User, UsersRound } from "lucide-react";
import AidesCatalogue from "@/components/AidesCatalogue";
import { PageHero, HeroButton, CtaBand } from "@/components/site";

export const metadata: Metadata = {
  title: "Aides et subventions au Maroc | Mziane",
  description:
    "Subventions agricoles, primes à l'investissement, prêts d'honneur à 0 %, exonérations et aides sociales : Mziane identifie vos aides et monte votre dossier de A à Z.",
};

const etapes = [
  { icon: Search, title: "Diagnostic gratuit", desc: "Quelques questions pour repérer les aides auxquelles vous avez droit." },
  { icon: FileCheck, title: "Montage du dossier", desc: "On vous donne la liste exacte des pièces et on prépare le dossier complet." },
  { icon: Send, title: "Dépôt et suivi", desc: "On dépose auprès de l'organisme et on relance jusqu'à la décision." },
  { icon: BadgeCheck, title: "Versement", desc: "On vous accompagne jusqu'au versement de l'aide sur votre compte." },
];

const publics = [
  { icon: Tractor, title: "Agriculteurs", desc: "Goutte-à-goutte jusqu'à 100 %, matériel, plantations, serres, élevage, valorisation." },
  { icon: Building2, title: "Créateurs et entreprises", desc: "Primes jusqu'à 30 % de l'investissement, prêts d'honneur à 0 %, aides à l'embauche." },
  { icon: UsersRound, title: "Femmes entrepreneures", desc: "Programmes dédiés, primes de parité, coopératives féminines." },
  { icon: User, title: "Particuliers", desc: "Aide au logement jusqu'à 100 000 DH, aide sociale directe, AMO, perte d'emploi." },
];

export default function AidesPage() {
  return (
    <>
      <PageHero
        icon={HandCoins}
        tag="Aides et subventions de l'État"
        title="Les aides existent. On vous aide à les obtenir."
        subtitle="Beaucoup d'agriculteurs, d'entreprises et de familles ne demandent jamais les aides auxquelles ils ont droit. Mziane repère vos aides et monte votre dossier de A à Z, jusqu'au versement."
        note="Diagnostic gratuit · Honoraires annoncés avant de commencer · Uniquement des aides sans prêt à intérêt"
      >
        <HeroButton href="/onboarding?besoin=aides">Trouver mes aides <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="#catalogue" variant="ghost">Voir toutes les aides</HeroButton>
      </PageHero>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {publics.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl bg-zinc-50 p-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-800"><Icon className="h-5 w-5" /></span>
              <div className="mb-1.5 text-lg font-bold text-zinc-900">{title}</div>
              <p className="text-[15px] leading-relaxed text-zinc-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="mb-10 text-center text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Comment on vous accompagne</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map(({ icon: Icon, title, desc }, n) => (
              <li key={title} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
                  <span className="text-3xl font-black text-amber-400 tabular-nums">{n + 1}</span>
                </div>
                <div className="mb-1.5 text-lg font-bold text-zinc-900">{title}</div>
                <p className="text-[15px] leading-relaxed text-zinc-600">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[900px] px-6">
          <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Toutes les aides</h2>
          <p className="mt-3 mb-8 text-[17px] text-zinc-600">
            Subventions, primes, exonérations et prêts d&apos;honneur à 0 %. Les montants sont indicatifs et peuvent évoluer : on vérifie les conditions en vigueur pour chaque dossier.
          </p>
          <AidesCatalogue />
        </div>
      </section>

      <CtaBand title="Quelles aides pour vous ?" subtitle="Répondez à quelques questions, on vous indique les aides qui correspondent à votre situation." href="/onboarding?besoin=aides" label="Faire mon diagnostic gratuit" />
    </>
  );
}
