import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";
import { CtaBand, Faq, HeroButton, PageHero, SectionHeader } from "@/components/site";
import {
  FRAIS_ETAT, PROMESSES, fmtDH, packById, packTotal, packValue,
} from "@/lib/offers";
import TarifsTabs, { TarifsTabsView } from "./TarifsTabs";

export const metadata: Metadata = {
  title: "Tarifs création, comptabilité et aides | Mziane",
  description:
    "Tous nos prix en dirhams : packs avec création offerte, création de SARL et d'auto-entreprise, comptabilité, aides de l'État payées au résultat, formalités, domiciliation et site web.",
};

const lancement = packById("lancement")!;

const faq = [
  { q: "Les frais d'État sont-ils inclus ?", a: `Non. Ils sont payés au tarif de l'administration, sans marge : environ ${fmtDH(FRAIS_ETAT.societe.estimate)} pour une SARL (${FRAIS_ETAT.societe.range}). ${FRAIS_ETAT.autoEntrepreneur.note}` },
  { q: "La comptabilité est-elle avec engagement ?", a: "Seule, elle est mensuelle et sans engagement. Dans un pack, l'engagement est de 12 mois, création offerte. Elle n'est facturée qu'à partir du registre de commerce." },
  { q: "Combien coûte l'accompagnement aux aides ?", a: `Le diagnostic est gratuit. Le dossier est payé en pourcentage de l'aide versée (barème dans l'onglet Aides). ${PROMESSES.zeroRefus}` },
  { q: "Pack ou formule seule ?", a: `Pour plusieurs services, le pack revient moins cher. Pack ${lancement.name} : ${fmtDH(packTotal(lancement))} sur 12 mois, contre ${fmtDH(packValue(lancement))} à la carte.` },
  { q: "Comment payer ?", a: PROMESSES.paiement },
];

export default function TarifsPage() {
  return (
    <>
      <PageHero
        icon={BadgeCheck}
        tag="Prix affichés, frais d'État à part"
        title="Des tarifs clairs, adaptés au Maroc"
        subtitle="Un pack ou un service à l'unité. HT pour les sociétés, TTC pour les particuliers et auto-entrepreneurs."
      >
        <HeroButton href="/packs">Voir les packs</HeroButton>
        <HeroButton href="/onboarding" variant="ghost">Trouver ma formule</HeroButton>
      </PageHero>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1180px] px-6 max-sm:px-4">
          <SectionHeader title="Choisissez votre service" />
          <Suspense fallback={<TarifsTabsView active="packs" />}>
            <TarifsTabs />
          </Suspense>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6 max-sm:px-4">
          <SectionHeader title="Questions fréquentes" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Vous hésitez entre deux offres ?" subtitle="Quelques questions, et on vous recommande la bonne formule." href="/onboarding" label="Trouver ma formule" />
    </>
  );
}
