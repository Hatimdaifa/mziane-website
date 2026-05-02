"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Users, ChevronRight, FileText, Star, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────
interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number | "devis";
  unit?: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

type PricingCategory = "auto-entrepreneur" | "societe" | "comptabilite";

// ── Pricing data (DH) ───────────────────────────────────────────────────────
const pricingData: Record<PricingCategory, PricingTier[]> = {
  "auto-entrepreneur": [
    {
      name: "Starter",
      icon: <FileText className="w-6 h-6" />,
      price: 0,
      description: "Inscription en autonomie",
      color: "blue",
      features: ["Déclaration micro-entreprise", "Guide officiel OMPIC", "Modèles de factures", "Espace personnel sécurisé"],
    },
    {
      name: "Accompagné",
      icon: <Star className="w-6 h-6" />,
      price: 490,
      unit: "DH",
      description: "On s'occupe de tout",
      color: "amber",
      popular: true,
      features: ["Tout le pack Starter", "Conseiller dédié", "Inscription CNSS/CNRPS", "Suivi de dossier", "Alerte plafonds (200k/500k DH)"],
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-6 h-6" />,
      price: 990,
      unit: "DH",
      description: "Complet + présence en ligne",
      color: "purple",
      features: ["Tout le pack Accompagné", "Mini-site ou page pro", "Formation facturation", "Migration vers SARLAU quand besoin", "1 an d'assistance"],
    },
  ],
  societe: [
    {
      name: "Essentiel",
      icon: <FileText className="w-6 h-6" />,
      price: 990,
      unit: "DH",
      description: "SARLAU clé en main",
      color: "blue",
      features: ["Rédaction des statuts SARLAU", "Dépôt au greffe OMPIC", "Publication Journal Officiel", "Immatriculation RC", "Kbis en 48h"],
    },
    {
      name: "Standard",
      icon: <Star className="w-6 h-6" />,
      price: 1490,
      unit: "DH",
      description: "SARL / SARLAU avec accompagnement",
      color: "amber",
      popular: true,
      features: ["Tout le pack Essentiel", "Juriste dédié", "Domiciliation 3 mois offerte", "Ouverture compte bancaire", "Obligations post-création", "Mise en relation cabinet comptable"],
    },
    {
      name: "Premium",
      icon: <Sparkles className="w-6 h-6" />,
      price: 2490,
      unit: "DH",
      description: "SAS / SARL multi-associés ou MRE",
      color: "purple",
      features: ["Tout le pack Standard", "Statuts sur mesure multi-associés", "Traitement prioritaire 24h", "Coordination bancaire complète", "Accompagnement fiscal 1 an", "Assurance anti-rejet OMPIC"],
    },
  ],
  comptabilite: [
    {
      name: "Starter",
      icon: <FileText className="w-6 h-6" />,
      price: 490,
      unit: "DH/mois",
      description: "Auto-entrepreneurs & micro-entreprises",
      color: "blue",
      features: ["Tenue comptable mensuelle", "Déclarations TVA", "Bilan annuel simplifié", "1 consultation/mois"],
    },
    {
      name: "Business",
      icon: <Star className="w-6 h-6" />,
      price: 990,
      unit: "DH/mois",
      description: "SARLAU & SARL actives",
      color: "amber",
      popular: true,
      features: ["Tenue comptable complète", "IS, TVA, IR, CFE", "Bilan & liasse fiscale", "Paie jusqu'à 5 salariés", "Tableau de bord mensuel", "Consultations illimitées"],
    },
    {
      name: "Sur mesure",
      icon: <Sparkles className="w-6 h-6" />,
      price: "devis",
      description: "Multi-sociétés & cas complexes",
      color: "purple",
      features: ["Audit comptable", "Restructuration fiscale", "Multi-sociétés", "Levée de fonds", "Conseil patrimonial"],
    },
  ],
};

// ── Tabbed Pricing ──────────────────────────────────────────────────────────
function TabbedPricing() {
  const [activeCategory, setActiveCategory] = useState<PricingCategory>("auto-entrepreneur");

  const categories: { key: PricingCategory; label: string }[] = [
    { key: "auto-entrepreneur", label: "Auto-entrepreneur" },
    { key: "societe", label: "Création de société" },
    { key: "comptabilite", label: "Comptabilité" },
  ];

  const tiers = pricingData[activeCategory];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center space-y-6 mb-12">
        <div className="text-xl text-blue-500 rotate-[-1deg]">Tarifs transparents</div>
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 rotate-[-1deg]">
            Nos offres au meilleur prix
            <span className="absolute -right-10 top-0 text-amber-500 rotate-12 text-3xl">✨</span>
            <span className="absolute -left-6 bottom-0 text-blue-500 -rotate-12 text-3xl">⭐️</span>
          </h2>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-blue-500/20 rotate-[-1deg] rounded-full blur-sm" />
        </div>
        <p className="text-xl text-zinc-600">Des offres claires, sans frais cachés</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-zinc-100 border-2 border-zinc-900 rounded-full p-1 gap-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                activeCategory === cat.key
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group transition-all duration-300",
              index === 0 && "rotate-[-1deg]",
              index === 1 && "rotate-[1deg]",
              index === 2 && "rotate-[-2deg]"
            )}
          >
            <div className={cn(
              "absolute inset-0 bg-white border-2 border-zinc-900 rounded-lg",
              "shadow-[4px_4px_0px_0px] shadow-zinc-900 transition-all duration-300",
              "group-hover:shadow-[8px_8px_0px_0px]",
              "group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"
            )} />
            <div className="relative p-6">
              {tier.popular && (
                <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 px-3 py-1 rounded-full rotate-12 text-sm font-bold border-2 border-zinc-900">
                  Populaire !
                </div>
              )}
              <div className="mb-6">
                <div className={cn("w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 border-zinc-900", `text-${tier.color}-500`)}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-black text-zinc-900">{tier.name}</h3>
                <p className="text-zinc-600">{tier.description}</p>
              </div>
              <div className="mb-6">
                {tier.price === 0 ? (
                  <span className="text-4xl font-bold text-zinc-900">Gratuit</span>
                ) : tier.price === "devis" ? (
                  <span className="text-3xl font-bold text-zinc-900">Sur devis</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-zinc-900">{tier.price}</span>
                    <span className="text-zinc-600 ml-1 text-sm">{tier.unit}</span>
                  </>
                )}
              </div>
              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-900 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-zinc-900 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className={cn(
                "w-full h-12 text-base font-bold border-2 border-zinc-900 transition-all duration-300",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]",
                tier.popular
                  ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                  : "bg-zinc-50 text-zinc-900 hover:bg-white"
              )}>
                Commencer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const parcours = [
  {
    emoji: "🚀",
    title: "Je démarre seul",
    subtitle: "Auto-entrepreneur · Freelance · Vendeur en ligne",
    description: "Le régime auto-entrepreneur vous permet de démarrer rapidement, avec des plafonds de 500 000 DH (commerce) et 200 000 DH (services).",
    badge: "Gratuit à 490 DH",
    badgeColor: "bg-blue-100 border-blue-300 text-blue-800",
    href: "/onboarding",
    cta: "Démarrer →",
  },
  {
    emoji: "🏢",
    title: "Je lance ma société",
    subtitle: "SARLAU · SARL · SAS",
    description: "99,2% des sociétés créées au Maroc sont des SARLAU ou SARL. On s'occupe des statuts, du greffe et de votre Kbis en 48h.",
    badge: "À partir de 990 DH",
    badgeColor: "bg-amber-100 border-amber-300 text-amber-800",
    href: "/onboarding",
    cta: "Lancer ma société →",
  },
  {
    emoji: "🌍",
    title: "Je m'installe au Maroc",
    subtitle: "MRE · Non-résident · Investisseur",
    description: "Vous êtes MRE ou investisseur étranger ? Compte en devises, procurations, ZAI, CFC : nous orchestrons tout votre dossier.",
    badge: "Offre premium",
    badgeColor: "bg-green-100 border-green-300 text-green-800",
    href: "/non-residents",
    cta: "En savoir plus →",
  },
];

const formes = [
  { emoji: "⭐", label: "SARLAU", part: "64,7% des créations", desc: "1 associé, responsabilité limitée, la plus répandue au Maroc.", popular: true },
  { emoji: "🤝", label: "SARL", part: "34,5% des créations", desc: "2 à 50 associés, capital librement fixé.", popular: false },
  { emoji: "⚡", label: "Auto-entrepreneur", part: "Démarrage simplifié", desc: "Jusqu'à 500 000 DH (commerce) ou 200 000 DH (services).", popular: false },
  { emoji: "🏗️", label: "SAS", part: "Flexibilité statutaire", desc: "Grande liberté de rédaction des statuts, adaptée aux startups.", popular: false },
  { emoji: "🏦", label: "SA", part: "Grands projets", desc: "Capital min. 300 000 DH, idéale pour les levées de fonds.", popular: false },
  { emoji: "🏠", label: "SCI", part: "Patrimoine immobilier", desc: "Détention et gestion de biens immobiliers en famille ou entre associés.", popular: false },
];

const stats = [
  { value: "95 235", label: "entreprises créées en 2024" },
  { value: "+17,7%", label: "de hausse au S1 2025" },
  { value: "40,2M", label: "connexions internet au Maroc" },
  { value: "2,03M", label: "unités informelles à formaliser" },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeForm, setActiveForm] = useState(0);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-green-100 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-800 mb-8 rotate-[-1deg]">
            <span>🇲🇦</span> 95 235 entreprises créées au Maroc en 2024 · +17,7% en 2025
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6">
            Lancez votre activité
            <span className="relative inline-block mx-3">
              <span className="relative z-10">au Maroc</span>
              <span className="absolute bottom-1 left-0 w-full h-4 bg-amber-300 -z-0 rotate-[-1deg]" />
            </span>
            <br />
            <span className="text-blue-600">simplement.</span>
          </h1>
          <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
            Auto-entrepreneur, SARLAU, SARL ou implantation depuis l&apos;étranger —
            Mziane vous accompagne de A à Z, de l&apos;inscription à la comptabilité.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="h-14 px-8 bg-zinc-900 text-white text-lg font-bold rounded-full shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <Link href="/onboarding">
                Démarrer mon projet <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-2 border-zinc-900 hover:bg-zinc-100 transition-all">
              <Link href="/tarifs">Voir les tarifs</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            ✓ Kbis en 48h &nbsp;·&nbsp; ✓ Experts basés au Maroc &nbsp;·&nbsp; ✓ Zéro rejet OMPIC garanti
          </p>
        </div>

        <div className="absolute right-6 top-24 hidden lg:block">
          <div className="bg-white border-2 border-zinc-900 rounded-2xl p-5 shadow-[6px_6px_0px_0px] shadow-zinc-900 rotate-[2deg] w-64">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">🎉</div>
              <div>
                <p className="font-bold text-sm text-zinc-900">SARLAU créée avec succès</p>
                <p className="text-xs text-zinc-500">Casablanca · il y a 3 minutes</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600">RC reçu · Dossier validé par le greffe OMPIC</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-zinc-900 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-amber-400 mb-1">{s.value}</p>
              <p className="text-zinc-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TROIS PARCOURS ── */}
      <section id="tarifs" className="py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl rotate-12 opacity-20 select-none">✎</div>
        <div className="absolute bottom-20 right-10 text-4xl -rotate-12 opacity-20 select-none">✏️</div>
        <TabbedPricing />
        <p className="text-center text-zinc-500 text-sm mt-8">
          * Frais de greffe et publications légales non inclus · Paiement sécurisé en DH
        </p>
      </section>

      {/* ── PARCOURS ── */}
      <section id="services" className="bg-zinc-50 border-y-2 border-zinc-200 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-semibold mb-2">Votre situation</p>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
              Choisissez votre parcours
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto">
              Trois entrées claires adaptées aux réalités du marché marocain.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {parcours.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group bg-white border-2 border-zinc-200 rounded-2xl p-8 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <span className={cn("text-xs font-bold px-3 py-1 rounded-full border inline-block mb-4", p.badgeColor)}>
                  {p.badge}
                </span>
                <h3 className="text-2xl font-black text-zinc-900 mb-1">{p.title}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">{p.subtitle}</p>
                <p className="text-sm text-zinc-500 leading-relaxed mb-5">{p.description}</p>
                <div className="flex items-center gap-1 text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  {p.cta} <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMES JURIDIQUES ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-blue-500 font-semibold mb-2">Structures disponibles</p>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
            Quelle forme juridique<br />choisir au Maroc ?
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto">
            SARLAU et SARL représentent 99,2% des sociétés créées. On vous aide à choisir la bonne dès le départ.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formes.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActiveForm(i)}
              className={cn(
                "group p-6 rounded-2xl border-2 text-left transition-all duration-200",
                activeForm === i
                  ? "border-zinc-900 bg-amber-50 shadow-[4px_4px_0px_0px] shadow-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              )}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-xl text-zinc-900">{f.label}</h3>
                {f.popular && (
                  <span className="text-xs bg-amber-400 text-zinc-900 font-bold px-2 py-0.5 rounded-full border border-amber-500">
                    #1
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-600 font-semibold mb-2">{f.part}</p>
              <p className="text-sm text-zinc-500 leading-snug">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── POURQUOI MZIANE ── */}
      <section id="pourquoi" className="bg-zinc-50 border-y-2 border-zinc-200 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-semibold mb-2">Pourquoi Mziane ?</p>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900">Simple. Rapide. Fiable.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock className="w-7 h-7" />, title: "RC en 48h", desc: "Votre dossier est traité et déposé à l'OMPIC sous 24h. Obtenez votre RC en un temps record.", color: "bg-blue-50 text-blue-600" },
              { icon: <Shield className="w-7 h-7" />, title: "Zéro rejet OMPIC", desc: "Nos experts vérifient chaque dossier avant dépôt. Nous garantissons l'acceptation du greffe.", color: "bg-amber-50 text-amber-600" },
              { icon: <Users className="w-7 h-7" />, title: "Experts au Maroc", desc: "Juristes et comptables basés à Casablanca, Rabat et Marrakech, disponibles 6j/7.", color: "bg-green-50 text-green-600" },
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
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Prêt à vous lancer ?</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Rejoignez les milliers d&apos;entrepreneurs qui ont formalisé leur activité avec Mziane.
          </p>
          <Button asChild className="h-14 px-10 bg-amber-400 text-zinc-900 text-lg font-black rounded-full shadow-[4px_4px_0px_0px] shadow-amber-600 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Link href="/onboarding">Démarrer mon projet gratuitement →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
