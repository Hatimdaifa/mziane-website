import type { Metadata } from "next";
import { Boxes, Check, Minus, Scale } from "lucide-react";
import { CtaBand, Faq, HeroButton, PageHero, SectionHeader } from "@/components/site";
import PacksExplorer from "@/components/packs/PacksExplorer";
import PackConfigurator from "@/components/packs/PackConfigurator";
import PackComparison from "@/components/packs/PackComparison";
import { MOIS_OFFERTS_AVANCE } from "@/components/packs/meta";
import {
  FRAIS_ETAT, PRIX_CREATION, PROMESSES, TVA, fmtDH, offerById, packById, packSavings, packSavingsUpfront, packTotal,
} from "@/lib/offers";

export const metadata: Metadata = {
  title: "Packs création, site et comptabilité | Mziane",
  description:
    "Création de société offerte, site web et comptabilité 12 mois en un seul prix mensuel. Packs pour SARL, auto-entrepreneur, MRE, aides de l'État et agriculteurs, au Maroc.",
};

const lancement = packById("lancement")!;
const sarlStandard = PRIX_CREATION.sarl?.[1] ?? 0;
const comptaEssentiel = offerById("compta-essentiel")?.price ?? 0;
const ttc = (n: number) => Math.round(n * (1 + TVA));

const COMPARE: { label: string; seul: string; cabinet: string; mziane: string; good?: [boolean, boolean, boolean] }[] = [
  {
    label: "Création d'une SARL",
    seul: `Frais d'État seuls, environ ${FRAIS_ETAT.societe.range}, et plusieurs passages à l'OMPIC, au greffe et aux impôts`,
    cabinet: "2 500 à 5 500 DH TTC clé en main selon les cabinets",
    mziane: `${fmtDH(ttc(sarlStandard))} TTC (${fmtDH(sarlStandard)} HT), frais d'État affichés à part, ou offerte dans un pack`,
  },
  {
    label: "Comptabilité d'une SARL",
    seul: "Possible, mais déclarations TVA, IS et liasse fiscale à maîtriser vous-même",
    cabinet: "500 à 2 500 DH par mois selon le cabinet et le volume",
    mziane: `${fmtDH(comptaEssentiel)} HT par mois, bilan et liasse inclus`,
  },
  {
    label: "Prix connu avant de commencer",
    seul: "Oui pour les frais d'État, le temps passé ne se chiffre pas",
    cabinet: "Souvent sur devis, à comparer à périmètre égal",
    mziane: "Oui, chaque prix est affiché sur ce site",
    good: [false, false, true],
  },
  {
    label: "Contact",
    seul: "Vous seul face aux guichets",
    cabinet: "Rendez-vous au cabinet, utile si vous préférez le face à face",
    mziane: "WhatsApp et appel vidéo, sans vous déplacer",
    good: [false, true, true],
  },
  {
    label: "Aides de l'État",
    seul: "À rechercher et monter seul",
    cabinet: "Variable selon le cabinet",
    mziane: "Diagnostic gratuit, honoraires seulement si l'aide est versée",
    good: [false, false, true],
  },
];

const faq = [
  {
    q: "Les packs ont-ils un engagement ?",
    a: `Oui, les packs au mois engagent sur 12 mois : c'est ce qui nous permet d'offrir la création. Si vous arrêtez avant, vous payez seulement la part de la remise qui correspond aux mois restants, au prorata. Exemple avec le pack ${lancement.name} : la remise totale est de ${fmtDH(packSavings(lancement))} sur 12 mois.`,
  },
  {
    q: "Quand commence la facturation de la comptabilité ?",
    a: "La comptabilité n'est facturée qu'à partir de l'obtention de votre registre de commerce. Les semaines de création ne vous coûtent rien en abonnement.",
  },
  {
    q: "Les frais d'État sont-ils compris dans le prix ?",
    a: `Non. Ils sont payés à l'administration au réel, sans marge : environ ${fmtDH(FRAIS_ETAT.societe.estimate)} pour une SARL (${FRAIS_ETAT.societe.range}). ${FRAIS_ETAT.societe.note} ${FRAIS_ETAT.autoEntrepreneur.note}`,
  },
  {
    q: "Comment se passe le paiement ?",
    a: PROMESSES.paiement,
  },
  {
    q: "Pourquoi payer d'avance ?",
    a: `Payer les 12 mois en une fois revient moins cher : ${MOIS_OFFERTS_AVANCE} mois offerts. Pour le pack ${lancement.name}, ${fmtDH(lancement.upfront ?? 0)} au lieu de ${fmtDH(packTotal(lancement))}, soit ${fmtDH(packSavingsUpfront(lancement))} d'économie au total par rapport aux services pris séparément.`,
  },
  {
    q: "Quelle différence entre un pack et une formule seule ?",
    a: "Une formule seule couvre un seul service : la comptabilité seule est mensuelle et sans engagement, la création se paie une fois. Un pack réunit plusieurs services pour 12 mois, avec la création offerte et un prix total plus bas. Le configurateur ci-dessus vous montre les deux prix côte à côte.",
  },
  {
    q: "Le pack Envol garantit-il l'aide ?",
    a: `Non, aucune aide n'est garantie : c'est l'organisme public qui décide. ${PROMESSES.zeroRefus} ${PROMESSES.sansInteret}`,
  },
];

export default function PacksPage() {
  return (
    <>
      <PageHero
        icon={Boxes}
        tag="Création offerte dans les packs"
        title="Tout pour lancer votre activité, en un seul prix"
        subtitle="Création, site web, comptabilité et domiciliation réunis dans un pack. Un prix mensuel clair, et moins cher que chaque service pris à part."
        note="Prix en DH HT. Frais d'État affichés à part, reversés sans marge."
      >
        <HeroButton href="#packs">Voir les packs</HeroButton>
        <HeroButton href="#composer" variant="ghost">Composer mon pack</HeroButton>
      </PageHero>

      <section id="packs" className="scroll-mt-[96px] bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1180px] px-6 max-sm:px-4">
          <SectionHeader title="Choisissez votre pack" subtitle="Filtrez selon votre situation. Chaque pack indique ce que vous économisez par rapport aux services pris séparément." />
          <PacksExplorer />
        </div>
      </section>

      <section id="composer" className="scroll-mt-[96px] bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1180px] px-6 max-sm:px-4">
          <SectionHeader tag="Configurateur" title="Composez votre pack" subtitle="Cochez ce dont vous avez besoin. Si un pack couvre votre sélection pour moins cher, on vous le montre." />
          <PackConfigurator />
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1180px] px-6 max-sm:px-4">
          <SectionHeader title="Comparer les packs" subtitle="Faites défiler le tableau sur mobile pour voir tous les packs." />
          <PackComparison />
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6 max-sm:px-4">
          <SectionHeader
            tag={<><Scale className="h-3.5 w-3.5" aria-hidden /> Comparaison honnête</>}
            title="Mziane, un cabinet traditionnel ou tout faire seul"
            subtitle="Les trois choix sont valables. Voici ce qui change, avec les fourchettes de prix constatées au Maroc."
          />
          <div className="grid gap-4 md:hidden">
            {COMPARE.map((r) => (
              <div key={r.label} className="rounded-3xl border border-zinc-200 bg-white p-5">
                <h3 className="mb-3 font-bold text-zinc-900">{r.label}</h3>
                <dl className="grid gap-2 text-[14px]">
                  <div><dt className="font-semibold text-zinc-500">Tout faire seul</dt><dd className="text-zinc-700">{r.seul}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">Cabinet traditionnel</dt><dd className="text-zinc-700">{r.cabinet}</dd></div>
                  <div className="rounded-xl bg-blue-50 p-2.5"><dt className="font-semibold text-blue-800">Mziane</dt><dd className="text-zinc-800">{r.mziane}</dd></div>
                </dl>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white max-md:hidden">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">Comparaison entre tout faire seul, un cabinet traditionnel et Mziane</caption>
              <thead>
                <tr className="border-b border-zinc-200">
                  <th scope="col" className="w-[20%] px-5 py-4"><span className="sr-only">Critère</span></th>
                  <th scope="col" className="px-5 py-4 font-bold text-zinc-900">Tout faire seul</th>
                  <th scope="col" className="px-5 py-4 font-bold text-zinc-900">Cabinet traditionnel</th>
                  <th scope="col" className="bg-blue-50 px-5 py-4 font-bold text-blue-800">Mziane</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.label} className="border-b border-zinc-100 last:border-b-0">
                    <th scope="row" className="px-5 py-4 align-top font-semibold text-zinc-900">{r.label}</th>
                    {[r.seul, r.cabinet, r.mziane].map((v, n) => (
                      <td key={n} className={n === 2 ? "bg-blue-50/70 px-5 py-4 align-top text-zinc-800" : "px-5 py-4 align-top text-zinc-600"}>
                        {r.good && (r.good[n]
                          ? <Check className="mr-1.5 inline h-4 w-4 text-blue-700" strokeWidth={2.5} aria-hidden />
                          : <Minus className="mr-1.5 inline h-4 w-4 text-zinc-400" aria-hidden />)}
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-[13px] text-zinc-500">
            Fourchettes indicatives du marché marocain. Pour comparer, vérifiez toujours si les frais d&apos;État sont inclus dans le prix annoncé.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6 max-sm:px-4">
          <SectionHeader title="Questions fréquentes sur les packs" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand
        title="Pas sûr du pack qui vous convient ?"
        subtitle="Répondez à quelques questions en deux minutes, on vous recommande le pack ou la formule adaptée."
        href="/onboarding"
        label="Trouver mon pack"
      />
    </>
  );
}
