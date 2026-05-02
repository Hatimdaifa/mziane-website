import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const packs = [
  {
    emoji: "🚀",
    title: "Auto-entrepreneur",
    subtitle: "Freelance · Vendeur en ligne · Activité solo",
    tiers: [
      {
        name: "Starter",
        price: "Gratuit",
        desc: "Inscription en autonomie",
        features: ["Déclaration OMPIC", "Guide officiel", "Modèles de factures", "Espace personnel"],
        popular: false,
        cta: "Commencer",
      },
      {
        name: "Accompagné",
        price: "490 DH",
        desc: "On s'occupe de tout",
        features: ["Tout le Starter", "Conseiller dédié", "Inscription CNSS", "Alerte plafonds", "Suivi dossier"],
        popular: true,
        cta: "Choisir Accompagné",
      },
      {
        name: "Pro",
        price: "990 DH",
        desc: "Complet + présence en ligne",
        features: ["Tout l'Accompagné", "Mini-site professionnel", "Formation facturation", "Migration SARLAU", "1 an d'assistance"],
        popular: false,
        cta: "Choisir Pro",
      },
    ],
  },
  {
    emoji: "🏢",
    title: "Création de société",
    subtitle: "SARLAU · SARL · SAS · SA · SCI",
    tiers: [
      {
        name: "Essentiel",
        price: "990 DH",
        desc: "SARLAU clé en main",
        features: ["Statuts SARLAU", "Dépôt greffe OMPIC", "Journal Officiel", "Immatriculation RC", "ICE obtenu"],
        popular: false,
        cta: "Choisir Essentiel",
      },
      {
        name: "Standard",
        price: "1 490 DH",
        desc: "SARLAU/SARL accompagnée",
        features: ["Tout l'Essentiel", "Juriste dédié", "Domiciliation 3 mois", "Compte bancaire", "Mise en relation expert-comptable", "Obligations post-création"],
        popular: true,
        cta: "Choisir Standard",
      },
      {
        name: "Premium",
        price: "2 490 DH",
        desc: "Multi-associés · SAS · MRE",
        features: ["Tout le Standard", "Statuts sur mesure", "Traitement 24h", "Assurance anti-rejet", "Domiciliation 6 mois", "Accompagnement fiscal 1 an"],
        popular: false,
        cta: "Choisir Premium",
      },
    ],
  },
  {
    emoji: "📊",
    title: "Comptabilité",
    subtitle: "Gestion mensuelle · Déclarations · Paie",
    tiers: [
      {
        name: "Starter",
        price: "490 DH/mois",
        desc: "Auto-entrepreneurs & EI",
        features: ["Tenue comptable", "Déclarations TVA", "Bilan simplifié", "1 consultation/mois"],
        popular: false,
        cta: "Choisir Starter",
      },
      {
        name: "Business",
        price: "990 DH/mois",
        desc: "SARLAU & SARL actives",
        features: ["Tenue complète", "IS · TVA · IR · Patente", "Bilan & liasse fiscale", "Paie jusqu'à 5 salariés", "Tableau de bord", "Consultations illimitées"],
        popular: true,
        cta: "Choisir Business",
      },
      {
        name: "Sur mesure",
        price: "Sur devis",
        desc: "Multi-sociétés & complexe",
        features: ["Audit comptable", "Restructuration fiscale", "Multi-sociétés", "Levée de fonds", "Conseil patrimonial"],
        popular: false,
        cta: "Demander un devis",
      },
    ],
  },
  {
    emoji: "🌍",
    title: "Non-résidents & MRE",
    subtitle: "MRE · Étranger · ZAI · CFC",
    tiers: [
      {
        name: "MRE Standard",
        price: "2 490 DH",
        desc: "MRE souhaitant s'installer",
        features: ["Choix statut juridique", "Assistance documentaire", "Coordination bancaire", "Compte devises/DH convertibles", "Domiciliation incluse", "Suivi OMPIC"],
        popular: false,
        cta: "Démarrer",
      },
      {
        name: "International",
        price: "3 990 DH",
        desc: "Étranger non-résident",
        features: ["Tout MRE Standard", "Procurations & apostilles", "Régime convertibilité", "Optimisation structurelle", "Accompagnement bancaire complet", "Juriste bilingue"],
        popular: true,
        cta: "Demander un accompagnement",
      },
      {
        name: "ZAI / CFC",
        price: "Sur devis",
        desc: "Zone franche · Casablanca Finance City",
        features: ["Étude d'éligibilité", "Dossier ZAI ou CFC", "Avantages fiscaux", "Exonérations IS", "Suivi réglementaire", "Accompagnement complet"],
        popular: false,
        cta: "Demander un devis",
      },
    ],
  },
];

const ponctuel = [
  { service: "Création SARLAU complète", tarif: "À partir de 990 DH", icon: "⭐" },
  { service: "Création SARL (2-3 associés)", tarif: "À partir de 1 490 DH", icon: "🤝" },
  { service: "Inscription auto-entrepreneur", tarif: "À partir de 490 DH", icon: "⚡" },
  { service: "Dossier MRE / non-résident", tarif: "À partir de 2 490 DH", icon: "🌍" },
  { service: "Bilan annuel seul (SARLAU)", tarif: "À partir de 2 500 DH", icon: "📊" },
  { service: "Consultation conseil (1h)", tarif: "500 DH HT", icon: "💬" },
];

export default function TarifsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-800 mb-8 rotate-[-1deg]">
          💰 Zéro frais cachés · Paiement en dirhams
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6 max-w-3xl">
          Des tarifs clairs,
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">adaptés au Maroc.</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-amber-300 -z-0 rotate-[-1deg]" />
          </span>
        </h1>
        <p className="text-xl text-zinc-600 mb-6 max-w-xl leading-relaxed">
          Tous nos prix sont en dirhams (DH HT). Frais de greffe et publications légales indiqués séparément.
        </p>
      </section>

      {/* ── PACKS ── */}
      {packs.map((pack, pi) => (
        <section key={pack.title} className={cn("py-16 relative overflow-hidden", pi % 2 === 1 ? "bg-zinc-50 border-y-2 border-zinc-100" : "")}>
          <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
            <div className="text-3xl mb-2">{pack.emoji}</div>
            <h2 className="text-3xl font-black text-zinc-900">{pack.title}</h2>
            <p className="text-zinc-500 text-sm mt-1">{pack.subtitle}</p>
          </div>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {pack.tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "relative bg-white border-2 rounded-2xl p-6 flex flex-col transition-all duration-200",
                  tier.popular
                    ? "border-zinc-900 shadow-[6px_6px_0px_0px] shadow-zinc-900"
                    : "border-zinc-200 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 -right-3 bg-amber-400 text-zinc-900 px-3 py-1 rounded-full rotate-12 text-xs font-black border-2 border-zinc-900">
                    Populaire !
                  </div>
                )}
                <h3 className="text-xl font-black text-zinc-900 mb-1">{tier.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">{tier.desc}</p>
                <p className="text-3xl font-black text-zinc-900 mb-6">{tier.price}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={cn(
                    "w-full rounded-full font-bold border-2 border-zinc-900 transition-all",
                    "shadow-[3px_3px_0px_0px] shadow-zinc-900 hover:shadow-[5px_5px_0px_0px]",
                    "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                    tier.popular ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-white text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  <Link href="/onboarding">{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── PONCTUEL ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold mb-2">Sans abonnement</p>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Prestations ponctuelles</h2>
          <p className="text-zinc-600 max-w-xl mx-auto">Pour des besoins spécifiques sans engagement mensuel.</p>
        </div>
        <div className="border-2 border-zinc-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px] shadow-zinc-900 bg-white max-w-3xl mx-auto">
          {ponctuel.map(({ service, tarif, icon }, i) => (
            <div key={service} className={cn("flex items-center justify-between px-8 py-5", i !== ponctuel.length - 1 ? "border-b-2 border-zinc-100" : "")}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold text-zinc-900">{service}</span>
              </div>
              <span className="font-black text-zinc-900 bg-amber-100 px-3 py-1 rounded-full text-sm border-2 border-amber-300">
                {tarif}
              </span>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 text-sm mt-4 text-center">
          * Frais de greffe OMPIC (~500 DH) et Journal Officiel (~400 DH) non inclus.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Vous avez des questions ?</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Nos experts vous répondent sous 24h et établissent un devis personnalisé.
          </p>
          <Button asChild className="h-14 px-10 bg-amber-400 text-zinc-900 text-lg font-black rounded-full shadow-[4px_4px_0px_0px] shadow-amber-600 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer mon projet →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
