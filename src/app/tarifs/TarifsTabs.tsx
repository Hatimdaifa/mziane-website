"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Building2, HandCoins, FilePen, Calculator, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCard, type Tier } from "@/components/site";

const groups: { id: string; label: string; icon: LucideIcon; note: string; tiers: Tier[] }[] = [
  {
    id: "auto", label: "Auto-entrepreneur", icon: Rocket,
    note: "Inscription au registre national de l'auto-entrepreneur. Aucun frais de greffe.",
    tiers: [
      { name: "Starter", price: "Gratuit", pill: "En autonomie", desc: "Vous faites l'inscription vous-même avec nos guides.", features: ["Guide pas à pas", "Modèles de factures", "Liste officielle des activités", "Espace personnel"], cta: "Commencer", href: "/onboarding?besoin=creer" },
      { name: "Accompagné", price: "490 DH", pill: "Paiement unique", desc: "On s'occupe de toute l'inscription pour vous.", features: ["Tout le Starter", "Conseiller dédié", "Affiliation AMO", "Alerte sur les plafonds", "Suivi du dossier"], cta: "Choisir Accompagné", href: "/onboarding?besoin=creer", popular: true },
      { name: "Pro", price: "990 DH", pill: "Paiement unique", desc: "Inscription complète et présence en ligne.", features: ["Tout l'Accompagné", "Mini-site professionnel", "Formation à la facturation", "Passage en SARLAU préparé", "Un an d'assistance"], cta: "Choisir Pro", href: "/onboarding?besoin=creer" },
    ],
  },
  {
    id: "societe", label: "Société", icon: Building2,
    note: "Frais de greffe OMPIC (environ 500 DH) et Journal Officiel (environ 400 DH) en sus.",
    tiers: [
      { name: "Essentiel", price: "990 DH", pill: "Paiement unique", desc: "Votre SARLAU clé en main.", features: ["Statuts SARLAU", "Certificat négatif OMPIC", "Journal Officiel", "Registre de commerce", "ICE"], cta: "Choisir Essentiel", href: "/onboarding?besoin=creer" },
      { name: "Standard", price: "1 490 DH", pill: "Paiement unique", desc: "SARLAU ou SARL avec un juriste dédié.", features: ["Tout l'Essentiel", "Juriste dédié", "Domiciliation 3 mois", "Ouverture du compte bancaire", "Mise en relation expert-comptable", "Obligations après création"], cta: "Choisir Standard", href: "/onboarding?besoin=creer", popular: true },
      { name: "Premium", price: "2 490 DH", pill: "Paiement unique", desc: "Plusieurs associés, SAS, SA ou SCI.", features: ["Tout le Standard", "Statuts sur mesure", "Traitement en 24 h", "Assurance anti-rejet", "Domiciliation 6 mois", "Accompagnement fiscal 1 an"], cta: "Choisir Premium", href: "/onboarding?besoin=creer" },
    ],
  },
  {
    id: "aides", label: "Aides de l'État", icon: HandCoins,
    note: "Uniquement des aides sans intérêt : subventions, primes, exonérations et prêts d'honneur à 0 %.",
    tiers: [
      { name: "Diagnostic", price: "Gratuit", pill: "Sans engagement", desc: "On repère les aides auxquelles vous avez droit.", features: ["Questionnaire en ligne", "Appel avec un conseiller", "Liste des aides possibles", "Estimation des montants"], cta: "Faire mon diagnostic", href: "/onboarding?besoin=aides" },
      { name: "Dossier de A à Z", price: "Sur devis", pill: "Honoraires annoncés avant de commencer", desc: "On monte et suit votre dossier jusqu'au versement.", features: ["Vérification de chaque condition", "Liste précise des pièces", "Montage et dépôt du dossier", "Relances auprès de l'organisme", "Suivi jusqu'au versement"], cta: "Demander un devis", href: "/onboarding?besoin=aides", popular: true },
      { name: "Coopératives et entreprises", price: "Sur devis", pill: "Plusieurs dossiers", desc: "Pour les structures qui cumulent plusieurs aides.", features: ["Plan de financement par aides", "Plusieurs dossiers en parallèle", "Interlocuteur unique", "Suivi des engagements", "Point régulier"], cta: "Demander un devis", href: "/onboarding?besoin=aides" },
    ],
  },
  {
    id: "gestion", label: "Gestion", icon: FilePen,
    note: "Frais de greffe, d'enregistrement et de publication au tarif fixé par l'administration.",
    tiers: [
      { name: "Modification", price: "Sur devis", pill: "Devis sous 24 h", desc: "Siège, gérant, associés, capital, nom ou activité.", features: ["Procès-verbaux et actes", "Statuts mis à jour", "Dépôt au greffe", "Publications légales", "Registre de commerce à jour"], cta: "Demander un devis", href: "/onboarding?besoin=gerer", popular: true },
      { name: "Marque et domiciliation", price: "Sur devis", pill: "Devis sous 24 h", desc: "Protéger votre marque et domicilier votre siège.", features: ["Recherche d'antériorité", "Dépôt de marque OMPIC", "Domiciliation du siège", "Réception du courrier"], cta: "Demander un devis", href: "/onboarding?besoin=gerer" },
      { name: "Fermeture", price: "Sur devis", pill: "Devis sous 24 h", desc: "Mise en sommeil ou fermeture complète.", features: ["Mise en sommeil", "Dissolution anticipée", "Liquidation", "Radiation du registre"], cta: "Demander un devis", href: "/onboarding?besoin=gerer" },
    ],
  },
  {
    id: "compta", label: "Comptabilité", icon: Calculator,
    note: "Sans engagement de durée. Tarifs en DH HT.",
    tiers: [
      { name: "Starter", price: "490 DH", unit: "/ mois", pill: "Abonnement mensuel", desc: "Auto-entrepreneurs et entreprises individuelles.", features: ["Tenue comptable", "Déclarations TVA", "Bilan simplifié", "Une consultation par mois"], cta: "Choisir Starter", href: "/onboarding?besoin=compta" },
      { name: "Business", price: "990 DH", unit: "/ mois", pill: "Abonnement mensuel", desc: "SARLAU et SARL en activité.", features: ["Tenue complète", "IS, TVA, IR et taxe professionnelle", "Bilan et liasse fiscale", "Paie jusqu'à 5 salariés", "Tableau de bord", "Consultations illimitées"], cta: "Choisir Business", href: "/onboarding?besoin=compta", popular: true },
      { name: "Sur mesure", price: "Sur devis", pill: "Structures complexes", desc: "Plusieurs sociétés ou besoins spécifiques.", features: ["Audit comptable", "Restructuration fiscale", "Multi-sociétés", "Levée de fonds", "Conseil patrimonial"], cta: "Demander un devis", href: "/onboarding?besoin=compta" },
    ],
  },
  {
    id: "international", label: "MRE et étrangers", icon: Globe,
    note: "Frais de greffe, apostilles et traductions en sus.",
    tiers: [
      { name: "MRE", price: "2 490 DH", pill: "Paiement unique", desc: "Marocains résidant à l'étranger.", features: ["Choix du statut juridique", "Assistance documentaire", "Coordination bancaire", "Compte en devises ou DH convertibles", "Domiciliation incluse", "Suivi OMPIC"], cta: "Démarrer", href: "/onboarding?besoin=etranger" },
      { name: "International", price: "3 990 DH", pill: "Paiement unique", desc: "Étrangers non-résidents.", features: ["Tout le pack MRE", "Procurations et apostilles", "Régime de convertibilité", "Structure optimisée", "Accompagnement bancaire complet", "Juriste bilingue"], cta: "Démarrer", href: "/onboarding?besoin=etranger", popular: true },
      { name: "ZAI et CFC", price: "Sur devis", pill: "Étude d'éligibilité", desc: "Zones d'accélération industrielle et Casablanca Finance City.", features: ["Étude d'éligibilité", "Dossier ZAI ou CFC", "Avantages fiscaux", "Suivi réglementaire", "Accompagnement complet"], cta: "Demander un devis", href: "/onboarding?besoin=etranger" },
    ],
  },
];

export default function TarifsTabs() {
  const [active, setActive] = useState(groups[1].id);
  const g = groups.find((x) => x.id === active)!;

  return (
    <>
      <div className="mb-12 flex justify-center">
        <div role="tablist" aria-label="Services" className="flex flex-wrap justify-center gap-1 rounded-3xl bg-zinc-100 p-1.5 sm:rounded-full">
          {groups.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
                active === id ? "bg-blue-600 text-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>
      <div key={g.id} className="grid animate-in gap-6 fade-in duration-300 md:grid-cols-3">
        {g.tiers.map((t) => <PriceCard key={t.name} tier={t} icon={g.icon} />)}
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">{g.note}</p>
    </>
  );
}
