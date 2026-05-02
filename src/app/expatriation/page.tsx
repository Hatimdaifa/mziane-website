import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Shield, FileText } from "lucide-react";

const profils = [
  {
    emoji: "🇲🇦",
    titre: "MRE — Marocain Résidant à l'Étranger",
    color: "bg-blue-50 border-blue-200 hover:border-blue-500",
    items: [
      "Création de SARLAU ou SARL depuis l'étranger",
      "Compte bancaire en DH convertibles ou devises",
      "Procurations et pouvoirs notariés",
      "Régime de convertibilité Office des Changes",
      "Rapatriement libre des revenus et produits de cession",
      "Immatriculation OMPIC à distance",
    ],
  },
  {
    emoji: "🌐",
    titre: "Étranger non-résident investissant au Maroc",
    color: "bg-amber-50 border-amber-200 hover:border-amber-500",
    items: [
      "Choix de la structure juridique adaptée",
      "Compte en devises ou DH convertibles",
      "Garantie de transfert des revenus (Office des Changes)",
      "Apostilles et légalisations",
      "Coordination bancaire et dépôt de capital",
      "Accompagnement fiscal et juridique bilingue",
    ],
  },
  {
    emoji: "🏙️",
    titre: "ZAI & Casablanca Finance City",
    color: "bg-green-50 border-green-200 hover:border-green-500",
    items: [
      "Zones d'Accélération Industrielle (ZAI)",
      "Avantages fiscaux IS et droits d'enregistrement",
      "Casablanca Finance City (CFC)",
      "IR spécifique 20% pour les salariés (10 ans max)",
      "Exonération retenue source dividendes non-résidents",
      "Traitement douanier préférentiel à l'export",
    ],
  },
];

const stats = [
  { value: "Libre", label: "transfert des revenus en devises" },
  { value: "300k DH", label: "convertibles à l'ouverture" },
  { value: "20%", label: "IR plafonné pour les salariés CFC" },
  { value: "0%", label: "retenue source dividendes CFC" },
];

export default function NonResidentsPage() {
  return (
    <>
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-full px-4 py-1.5 text-sm font-semibold text-green-800 mb-8 rotate-[-1deg]">
          🌍 MRE, étrangers & investisseurs internationaux
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6 max-w-3xl">
          Implantez-vous
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">au Maroc</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-amber-300 -z-0 rotate-[-1deg]" />
          </span>
          <span className="text-blue-600"> sans frontières.</span>
        </h1>
        <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
          MRE, étranger non-résident ou investisseur international — le Maroc offre
          un régime de convertibilité favorable et une fiscalité incitative.
          Mziane orchestre tout votre dossier.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="h-14 px-8 bg-zinc-900 text-white text-lg font-bold rounded-full shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer mon dossier →</Link>
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
              <p className="text-3xl font-black text-amber-400 mb-1">{s.value}</p>
              <p className="text-zinc-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROFILS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold mb-2">Votre situation</p>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Un accompagnement adapté à chaque profil</h2>
          <p className="text-zinc-600 max-w-xl mx-auto">
            Le Maroc offre un cadre favorable : compte en devises, libre transfert des revenus et avantages fiscaux pour les structures internationales.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {profils.map(({ emoji, titre, color, items }) => (
            <div key={titre} className={cn("border-2 rounded-2xl p-8 transition-all duration-200 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900", color)}>
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-black text-lg text-zinc-900 mb-6 pb-4 border-b-2 border-zinc-200">{titre}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-700 leading-relaxed">
                    <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section className="bg-zinc-50 border-y-2 border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-500 font-semibold mb-2">Nos engagements</p>
            <h2 className="text-4xl font-black text-zinc-900">Vous n&apos;êtes jamais seul.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Globe className="w-7 h-7" />, title: "Expertise internationale", desc: "Nos juristes maîtrisent les conventions fiscales bilatérales, le régime de convertibilité et les procédures OMPIC pour les non-résidents.", color: "bg-blue-50 text-blue-600" },
              { icon: <Shield className="w-7 h-7" />, title: "Conformité Office des Changes", desc: "Tous vos investissements bénéficient de la garantie de transfert des revenus et du produit de liquidation selon la réglementation en vigueur.", color: "bg-amber-50 text-amber-600" },
              { icon: <FileText className="w-7 h-7" />, title: "Suivi documentaire complet", desc: "Apostilles, procurations notariées, traductions certifiées et coordination bancaire : nous gérons chaque détail de votre dossier.", color: "bg-green-50 text-green-600" },
            ].map((item) => (
              <div key={item.title} className="bg-white border-2 border-zinc-200 rounded-2xl p-8 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 transition-all duration-200">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5", item.color)}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Votre projet au Maroc mérite le meilleur accompagnement.</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Dossier personnalisé, réponse sous 24h, experts bilingues.
          </p>
          <Button asChild className="h-14 px-10 bg-amber-400 text-zinc-900 text-lg font-black rounded-full shadow-[4px_4px_0px_0px] shadow-amber-600 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer mon dossier →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
