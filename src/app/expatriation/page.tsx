import type { Metadata } from "next";
import { ArrowRight, Globe, Shield, FileText, Plane, Building2 } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, FeatureGrid, CheckList, CtaBand } from "@/components/site";

export const metadata: Metadata = {
  title: "MRE et non-résidents : investir au Maroc | Mziane",
  description: "Créer sa société au Maroc depuis l'étranger : compte en devises, procurations, apostilles, convertibilité et zones franches.",
};

const profils = [
  {
    icon: Plane, titre: "Marocains résidant à l'étranger", head: "from-blue-700 to-blue-400",
    items: ["SARLAU ou SARL créée depuis l'étranger", "Compte en DH convertibles ou en devises", "Procurations et pouvoirs notariés", "Rapatriement libre des revenus", "Immatriculation OMPIC à distance", "Subvention MDM Invest possible"],
  },
  {
    icon: Globe, titre: "Étrangers non-résidents", head: "from-red-600 to-red-400",
    items: ["Choix de la structure juridique", "Compte en devises ou DH convertibles", "Garantie de transfert des revenus", "Apostilles et légalisations", "Dépôt du capital coordonné", "Accompagnement bilingue"],
  },
  {
    icon: Building2, titre: "Zones franches et CFC", head: "from-zinc-900 to-zinc-700",
    items: ["Zones d'accélération industrielle", "Avantages fiscaux sur l'IS", "Statut Casablanca Finance City", "Régime fiscal des salariés CFC", "Avantages à l'export", "Étude d'éligibilité"],
  },
];

const stats = [
  { value: "Libre", label: "transfert des revenus en devises", color: "text-blue-600" },
  { value: "0 déplacement", label: "pour créer votre société", color: "text-red-500" },
  { value: "10 %", label: "de subvention MDM Invest possible", color: "text-amber-600" },
  { value: "24 h", label: "pour une première réponse", color: "text-zinc-900" },
];

const engagements = [
  { icon: Globe, title: "Expertise internationale", desc: "Régime de convertibilité, conventions fiscales et procédures OMPIC pour les non-résidents." },
  { icon: Shield, title: "Conformité Office des Changes", desc: "Vos investissements sont déclarés pour bénéficier de la garantie de transfert des revenus et du produit de cession." },
  { icon: FileText, title: "Suivi documentaire complet", desc: "Apostilles, procurations, traductions certifiées et coordination bancaire." },
];

export default function ExpatriationPage() {
  return (
    <>
      <PageHero
        icon={Globe}
        tag="MRE, étrangers et investisseurs internationaux"
        title="Implantez-vous au Maroc sans vous déplacer"
        subtitle="Le Maroc offre un régime de convertibilité favorable et une fiscalité incitative. Mziane gère tout votre dossier sur place."
        note="Réponse sous 24 h · Experts bilingues"
      >
        <HeroButton href="/onboarding?besoin=etranger">Démarrer mon dossier <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/tarifs" variant="ghost">Voir les tarifs</HeroButton>
      </PageHero>

      <section className="border-b border-zinc-200 bg-white py-14">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-x-4 gap-y-7 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-tight ${s.color}`}>{s.value}</div>
              <p className="mt-1 text-[15px] text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader tag="Votre situation" title="Un accompagnement pour chaque profil" />
          <div className="grid gap-6 md:grid-cols-3">
            {profils.map(({ icon: Icon, titre, head, items }) => (
              <div key={titre} className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)]">
                <div className={`bg-gradient-to-br p-7 text-white ${head}`}>
                  <span className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Icon className="h-5 w-5" /></span>
                  <span className="block text-xl font-extrabold">{titre}</span>
                </div>
                <CheckList items={items} className="p-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader left tag="Nos engagements" title="Vous n'êtes jamais seul" />
          <FeatureGrid items={engagements} />
        </div>
      </section>

      <CtaBand title="Votre projet au Maroc commence ici" subtitle="Dossier personnalisé, réponse sous 24 h, experts bilingues." href="/onboarding?besoin=etranger" label="Démarrer mon dossier" />
    </>
  );
}
