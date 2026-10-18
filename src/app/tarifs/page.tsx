import type { Metadata } from "next";
import { BadgeCheck, Star, Handshake, Zap, Globe, Calculator, MessageCircle, Stamp } from "lucide-react";
import { PageHero, SectionHeader, Faq, CtaBand } from "@/components/site";
import TarifsTabs from "./TarifsTabs";

export const metadata: Metadata = {
  title: "Tarifs | Mziane",
  description: "Création d'entreprise, aides de l'État, gestion de société, comptabilité et accompagnement MRE : nos tarifs en dirhams, sans frais cachés.",
};

const ponctuel = [
  { icon: Star, service: "Création SARLAU complète", tarif: "À partir de 990 DH" },
  { icon: Handshake, service: "Création SARL (2 à 3 associés)", tarif: "À partir de 1 490 DH" },
  { icon: Zap, service: "Inscription auto-entrepreneur", tarif: "À partir de 490 DH" },
  { icon: Globe, service: "Dossier MRE ou non-résident", tarif: "À partir de 2 490 DH" },
  { icon: Calculator, service: "Bilan annuel seul (SARLAU)", tarif: "À partir de 2 500 DH" },
  { icon: Stamp, service: "Dépôt de marque", tarif: "Sur devis" },
  { icon: MessageCircle, service: "Consultation conseil (1 h)", tarif: "500 DH HT" },
];

const faq = [
  { q: "Les frais de greffe sont-ils inclus ?", a: "Non. Les frais de greffe, de Journal Officiel et d'enregistrement sont payés au tarif fixé par l'administration. Ils sont indiqués sous chaque offre et dans votre devis." },
  { q: "Combien coûte l'accompagnement aux aides ?", a: "Le diagnostic est gratuit. Si vous décidez de monter un dossier, on vous annonce nos honoraires par écrit avant de commencer, en fonction de l'aide visée." },
  { q: "L'abonnement comptable est-il avec engagement ?", a: "Non, il est mensuel et sans engagement de durée." },
];

export default function TarifsPage() {
  return (
    <>
      <PageHero
        icon={BadgeCheck}
        tag="Zéro frais cachés · Paiement en dirhams"
        title="Des tarifs clairs, adaptés au Maroc"
        subtitle="Choisissez votre service. Les prix sont en DH HT, les frais administratifs sont indiqués à part."
      />

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader title="Choisissez votre service" subtitle="Un onglet par service, trois formules à chaque fois." />
          <TarifsTabs />
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[820px] px-6">
          <SectionHeader tag="Sans abonnement" tagClass="bg-amber-100 text-amber-800" title="Prestations ponctuelles" subtitle="Pour un besoin précis, sans engagement." />
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            {ponctuel.map(({ icon: Icon, service, tarif }) => (
              <div key={service} className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-4 w-4" /></span>
                  <span className="font-semibold text-zinc-900">{service}</span>
                </span>
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{tarif}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader title="Questions fréquentes" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Vous hésitez entre deux offres ?" subtitle="Répondez à quelques questions, on vous recommande la formule adaptée à votre projet." href="/onboarding" label="Trouver ma formule" />
    </>
  );
}
