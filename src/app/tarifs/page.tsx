import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck, Building2, Calculator, FilePen, Globe, Handshake, Stamp, Zap } from "lucide-react";
import { CtaBand, Faq, HeroButton, PageHero, SectionHeader } from "@/components/site";
import {
  COMPTA_EXTRAS, FRAIS_ETAT, PRIX_CREATION, PROMESSES, fmtDH, formalites, offerById, packById, packTotal, packValue,
} from "@/lib/offers";
import TarifsTabs, { TarifsTabsView } from "./TarifsTabs";

export const metadata: Metadata = {
  title: "Tarifs création, comptabilité et aides | Mziane",
  description:
    "Tous nos prix en dirhams : packs avec création offerte, création de SARL et d'auto-entreprise, comptabilité, aides de l'État payées au résultat, formalités, domiciliation et site web.",
};

const minFormalite = Math.min(...formalites.map((f) => f.price));
const lancement = packById("lancement")!;

const ponctuel = [
  { icon: Building2, service: "Création SARLAU ou SARL", tarif: `Dès ${fmtDH(PRIX_CREATION.sarlau?.[0] ?? 0)} HT` },
  { icon: Handshake, service: "Création SAS", tarif: `Dès ${fmtDH(PRIX_CREATION.sas?.[0] ?? 0)} HT` },
  { icon: Zap, service: "Inscription auto-entrepreneur accompagnée", tarif: `${fmtDH(offerById("ae-accompagne")?.price ?? 0)} TTC` },
  { icon: Globe, service: "Création à distance pour MRE", tarif: `${fmtDH(offerById("intl-mre")?.price ?? 0)} HT` },
  { icon: Calculator, service: "Bilan annuel seul", tarif: `${fmtDH(COMPTA_EXTRAS.bilanSeul)} HT` },
  { icon: Stamp, service: "Dépôt de marque, une classe", tarif: `${fmtDH(offerById("marque-simple")?.price ?? 0)} HT` },
  { icon: FilePen, service: "Modification de société", tarif: `Dès ${fmtDH(minFormalite)} HT` },
];

const faq = [
  { q: "Les frais d'État sont-ils inclus ?", a: `Non. Greffe, certificat négatif, annonces légales et timbres sont payés au tarif de l'administration, sans marge : environ ${fmtDH(FRAIS_ETAT.societe.estimate)} pour une SARL (${FRAIS_ETAT.societe.range}). ${FRAIS_ETAT.autoEntrepreneur.note}` },
  { q: "La comptabilité est-elle avec engagement ?", a: "Prise seule, la comptabilité est mensuelle et sans engagement. Dans un pack, l'engagement est de 12 mois, avec la création offerte en contrepartie. En cas d'arrêt anticipé d'un pack, la remise est due au prorata des mois restants." },
  { q: "Quand la comptabilité commence-t-elle à être facturée ?", a: "À partir de l'obtention de votre registre de commerce, pas avant." },
  { q: "Combien coûte l'accompagnement aux aides ?", a: `Le diagnostic est gratuit. Le dossier de A à Z est payé en pourcentage de l'aide réellement versée, selon un barème dégressif affiché dans l'onglet Aides. ${PROMESSES.zeroRefus}` },
  { q: "Pack ou formule seule : que choisir ?", a: `Si vous avez besoin de plusieurs services, le pack revient moins cher. Exemple : le pack ${lancement.name} coûte ${fmtDH(packTotal(lancement))} sur 12 mois, création offerte, contre ${fmtDH(packValue(lancement))} en prenant chaque service à part.` },
  { q: "Comment payer ?", a: PROMESSES.paiement },
];

export default function TarifsPage() {
  return (
    <>
      <PageHero
        icon={BadgeCheck}
        tag="Prix affichés, frais d'État à part"
        title="Des tarifs clairs, adaptés au Maroc"
        subtitle="Choisissez un pack ou un service à l'unité. Prix en DH HT pour les sociétés, TTC pour les auto-entrepreneurs et les particuliers."
      >
        <HeroButton href="/packs">Voir les packs</HeroButton>
        <HeroButton href="/onboarding" variant="ghost">Trouver ma formule</HeroButton>
      </PageHero>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1180px] px-6 max-sm:px-4">
          <SectionHeader title="Choisissez votre service" subtitle="Un onglet par service. La formule recommandée est mise en avant." />
          <Suspense fallback={<TarifsTabsView active="packs" />}>
            <TarifsTabs />
          </Suspense>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[820px] px-6 max-sm:px-4">
          <SectionHeader tag="Sans abonnement" tagClass="bg-amber-100 text-amber-800" title="Prestations ponctuelles" subtitle="Pour un besoin précis, payé une fois." />
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            {ponctuel.map(({ icon: Icon, service, tarif }) => (
              <div key={service} className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0 max-sm:px-4">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-4 w-4" aria-hidden /></span>
                  <span className="font-semibold text-zinc-900">{service}</span>
                </span>
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{tarif}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6 max-sm:px-4">
          <SectionHeader title="Questions fréquentes" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Vous hésitez entre deux offres ?" subtitle="Répondez à quelques questions, on vous recommande le pack ou la formule adaptée à votre projet." href="/onboarding" label="Trouver ma formule" />
    </>
  );
}
