"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────
interface Option {
  id: string;
  emoji: string;
  label: string;
  description: string;
  next: string;
}

interface Step {
  id: string;
  num: number;
  question: string;
  subtitle: string;
  options: Option[];
}

type Answers = Record<string, string>;

// ── Steps (marché marocain) ───────────────────────────────────────────────────
const steps: Step[] = [
  {
    id: "type",
    num: 1,
    question: "Quel est votre projet ?",
    subtitle: "Choisissez le parcours qui correspond à votre situation.",
    options: [
      {
        id: "solo",
        emoji: "🚀",
        label: "Je démarre seul",
        description: "Auto-entrepreneur, freelance digital ou vendeur en ligne.",
        next: "forme-solo",
      },
      {
        id: "societe",
        emoji: "🏢",
        label: "Je crée une société",
        description: "SARLAU, SARL ou SAS avec capital et statuts.",
        next: "forme-societe",
      },
      {
        id: "etranger",
        emoji: "🌍",
        label: "Je m'installe au Maroc",
        description: "MRE, étranger non-résident ou investisseur depuis l'étranger.",
        next: "situation-etranger",
      },
    ],
  },
  {
    id: "forme-solo",
    num: 2,
    question: "Quelle forme choisissez-vous ?",
    subtitle: "Chaque régime a ses plafonds et ses avantages.",
    options: [
      {
        id: "auto",
        emoji: "⚡",
        label: "Auto-entrepreneur",
        description: "Jusqu'à 500 000 DH (commerce) ou 200 000 DH (services). Inscription simple et rapide.",
        next: "secteur",
      },
      {
        id: "ei",
        emoji: "🧑‍💼",
        label: "Entreprise individuelle",
        description: "Immatriculé au registre de commerce sans plafond de CA, mais sans société.",
        next: "secteur",
      },
    ],
  },
  {
    id: "forme-societe",
    num: 2,
    question: "Quelle forme de société ?",
    subtitle: "SARLAU et SARL représentent 99,2% des créations au Maroc.",
    options: [
      {
        id: "sarlau",
        emoji: "⭐",
        label: "SARLAU",
        description: "1 associé, responsabilité limitée. La forme la plus répandue (64,7% des créations).",
        next: "secteur",
      },
      {
        id: "sarl",
        emoji: "🤝",
        label: "SARL",
        description: "2 à 50 associés, capital librement fixé (34,5% des créations).",
        next: "secteur",
      },
      {
        id: "sas",
        emoji: "🏗️",
        label: "SAS",
        description: "Grande liberté statutaire, adaptée aux startups et projets innovants.",
        next: "secteur",
      },
      {
        id: "sa",
        emoji: "🏦",
        label: "SA",
        description: "Capital minimum 300 000 DH, idéale pour les levées de fonds et l'introduction en bourse.",
        next: "secteur",
      },
      {
        id: "sci",
        emoji: "🏠",
        label: "SCI",
        description: "Société civile immobilière pour la détention et gestion de patrimoine immobilier.",
        next: "secteur",
      },
    ],
  },
  {
    id: "situation-etranger",
    num: 2,
    question: "Quelle est votre situation ?",
    subtitle: "Cela détermine les démarches administratives et bancaires nécessaires.",
    options: [
      {
        id: "mre",
        emoji: "🇲🇦",
        label: "MRE",
        description: "Marocain Résidant à l'Étranger souhaitant investir ou s'installer au Maroc.",
        next: "secteur",
      },
      {
        id: "etranger-nr",
        emoji: "🌐",
        label: "Étranger non-résident",
        description: "Investisseur étranger souhaitant créer une structure au Maroc.",
        next: "secteur",
      },
      {
        id: "cfc-zai",
        emoji: "🏙️",
        label: "Zone franche / CFC",
        description: "Projet ZAI (Zone d'Accélération Industrielle) ou Casablanca Finance City.",
        next: "secteur",
      },
    ],
  },
  {
    id: "secteur",
    num: 3,
    question: "Votre secteur d'activité ?",
    subtitle: "Le commerce représente 35,1% des créations, les services 18,2% au Maroc.",
    options: [
      { id: "commerce", emoji: "🛒", label: "Commerce / Distribution", description: "Négoce, import-export, vente physique ou en ligne.", next: "web" },
      { id: "services", emoji: "💼", label: "Services / Conseil", description: "Consulting, formation, coaching, RH, juridique…", next: "web" },
      { id: "digital", emoji: "💻", label: "Digital / E-commerce", description: "Agence web, développement, marketing digital, vente en ligne.", next: "web" },
      { id: "immo", emoji: "🏠", label: "BTP / Immobilier", description: "Construction, promotion immobilière, gestion locative.", next: "web" },
      { id: "resto", emoji: "🍽️", label: "Restauration / Hôtellerie", description: "Restaurant, café, traiteur, gîte, hôtel.", next: "web" },
      { id: "industrie", emoji: "⚙️", label: "Industrie / Transport", description: "Fabrication, logistique, transit, transport de marchandises.", next: "web" },
    ],
  },
  {
    id: "web",
    num: 4,
    question: "Avez-vous besoin d'un site web ?",
    subtitle: "123 891 noms de domaine .ma enregistrés fin 2024, +33 799 en un an.",
    options: [
      { id: "oui", emoji: "✅", label: "Oui, c'est essentiel", description: "Site vitrine, boutique en ligne ou page de prise de contact professionnelle.", next: "salaries" },
      { id: "plus-tard", emoji: "🤔", label: "Peut-être plus tard", description: "Pas maintenant, mais j'en aurai probablement besoin.", next: "salaries" },
      { id: "non", emoji: "❌", label: "Non, pas besoin", description: "Mon activité ne nécessite pas de présence en ligne pour l'instant.", next: "salaries" },
    ],
  },
  {
    id: "salaries",
    num: 5,
    question: "Prévoyez-vous des salariés ?",
    subtitle: "Cela détermine vos obligations CNSS, CIMR et la gestion de la paie.",
    options: [
      { id: "non", emoji: "👤", label: "Non, je travaille seul", description: "Pas de salarié prévu dans un premier temps.", next: "result" },
      { id: "1-5", emoji: "👥", label: "1 à 5 salariés", description: "Petite équipe, gestion de paie mensuelle.", next: "result" },
      { id: "5plus", emoji: "🏢", label: "Plus de 5 salariés", description: "Équipe structurée, besoins RH et sociaux conséquents.", next: "result" },
    ],
  },
];

// ── Recommendation engine (DH) ────────────────────────────────────────────────
interface Recommendation {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  features: string[];
  extras: string[];
  tier: "starter" | "standard" | "premium" | "international";
  cta: string;
}

function getRecommendation(answers: Answers): Recommendation {
  const type = answers["type"];
  const formeSolo = answers["forme-solo"];
  const formeSociete = answers["forme-societe"];
  const situationEtr = answers["situation-etranger"];
  const salaries = answers["salaries"];
  const web = answers["web"];

  const extras: string[] = [];
  if (web === "oui") extras.push("✦ Création de site web ou boutique en ligne");
  if (salaries === "1-5") extras.push("✦ Gestion de la paie & déclarations CNSS");
  if (salaries === "5plus") extras.push("✦ Accompagnement RH et droit du travail marocain");

  if (type === "etranger") {
    const label = situationEtr === "mre" ? "MRE" : situationEtr === "cfc-zai" ? "ZAI/CFC" : "Étranger non-résident";
    return {
      badge: "Pack International",
      badgeColor: "bg-green-50 border-green-300",
      title: `Pack Premium — ${label}`,
      subtitle: "Accompagnement sur mesure pour votre implantation au Maroc.",
      price: "Sur devis",
      priceNote: "À partir de 3 990 DH selon la complexité du dossier",
      tier: "international",
      features: [
        "Choix du statut juridique adapté",
        "Coordination bancaire (compte devises / DH convertibles)",
        "Assistance documentaire complète",
        "Procurations et apostilles",
        "Domiciliation incluse",
        "Suivi OMPIC et greffe",
        situationEtr === "cfc-zai" ? "Dossier ZAI / CFC — avantages fiscaux" : "Régime de convertibilité Office des Changes",
      ],
      extras,
      cta: "Demander un accompagnement →",
    };
  }

  if (type === "solo" && formeSolo === "auto") {
    return {
      badge: "Pack Starter · Gratuit",
      badgeColor: "bg-blue-50 border-blue-300",
      title: "Pack Auto-entrepreneur",
      subtitle: "Le régime le plus simple pour démarrer votre activité au Maroc.",
      price: "Gratuit",
      priceNote: "Pack complet disponible à partir de 490 DH",
      tier: "starter",
      features: [
        "Déclaration auto-entrepreneur (OMPIC)",
        "Guide officiel Dar Al Moukawil",
        "Modèles de factures conformes",
        "Espace personnel sécurisé",
        "Alerte plafonds (200k/500k DH)",
        "Conseils migration vers SARLAU",
      ],
      extras,
      cta: "Créer mon auto-entreprise →",
    };
  }

  if (type === "solo" && formeSolo === "ei") {
    return {
      badge: "Pack Standard · 990 DH",
      badgeColor: "bg-amber-50 border-amber-300",
      title: "Pack Entreprise Individuelle",
      subtitle: "Immatriculation au registre de commerce sans plafond de CA.",
      price: "990 DH",
      priceNote: "Frais de greffe ~150 DH en sus",
      tier: "standard",
      features: [
        "Immatriculation RC (OMPIC)",
        "Conseiller dédié",
        "Inscription fiscale (patente, TVA)",
        "Compte bancaire professionnel",
        "Guide obligations comptables",
      ],
      extras,
      cta: "Créer mon entreprise individuelle →",
    };
  }

  if (formeSociete === "sarlau") {
    return {
      badge: "Pack Standard · 1 490 DH",
      badgeColor: "bg-amber-50 border-amber-300",
      title: "Pack SARLAU",
      subtitle: "La forme juridique la plus populaire au Maroc (64,7% des créations).",
      price: "1 490 DH",
      priceNote: "Frais de greffe OMPIC ~500 DH + Journal Officiel ~400 DH en sus",
      tier: "standard",
      features: [
        "Rédaction statuts SARLAU",
        "Dépôt capital bancaire",
        "Immatriculation OMPIC (RC)",
        "Publication Journal Officiel",
        "Obtention de l'ICE",
        "Domiciliation 3 mois offerte",
        "Mise en relation expert-comptable",
      ],
      extras,
      cta: "Créer ma SARLAU →",
    };
  }

  if (formeSociete === "sarl") {
    return {
      badge: "Pack Standard · 1 990 DH",
      badgeColor: "bg-amber-50 border-amber-300",
      title: "Pack SARL",
      subtitle: "Structure multi-associés avec responsabilité limitée au capital.",
      price: "1 990 DH",
      priceNote: "Frais de greffe OMPIC ~500 DH + Journal Officiel ~400 DH en sus",
      tier: "standard",
      features: [
        "Rédaction statuts SARL (jusqu'à 3 associés)",
        "Dépôt capital bancaire",
        "Immatriculation OMPIC",
        "Publication Journal Officiel",
        "Pacte d'associés basique",
        "Domiciliation 3 mois offerte",
      ],
      extras,
      cta: "Créer ma SARL →",
    };
  }

  const forme = formeSociete?.toUpperCase() ?? "SAS";
  return {
    badge: "Pack Premium · 2 490 DH",
    badgeColor: "bg-purple-50 border-purple-300",
    title: `Pack ${forme}`,
    subtitle: "Structure sur mesure avec accompagnement complet.",
    price: "2 490 DH",
    priceNote: "Frais de greffe et publications légales en sus",
    tier: "premium",
    features: [
      `Rédaction statuts ${forme} sur mesure`,
      "Juriste expert dédié",
      "Traitement prioritaire 24h",
      "Immatriculation OMPIC complète",
      "Assurance anti-rejet greffe",
      "Domiciliation 6 mois offerte",
      "Accompagnement fiscal 1 an",
    ],
    extras,
    cta: `Créer ma ${forme} →`,
  };
}

// ── Labels for summary ────────────────────────────────────────────────────────
const answerLabels: Record<string, Record<string, string>> = {
  type: { solo: "Activité solo", societe: "Société", etranger: "Implantation Maroc" },
  "forme-solo": { auto: "Auto-entrepreneur", ei: "Entreprise individuelle" },
  "forme-societe": { sarlau: "SARLAU", sarl: "SARL", sas: "SAS", sa: "SA", sci: "SCI" },
  "situation-etranger": { mre: "MRE", "etranger-nr": "Étranger non-résident", "cfc-zai": "ZAI / CFC" },
  secteur: { commerce: "Commerce", services: "Services/Conseil", digital: "Digital", immo: "BTP/Immobilier", resto: "Restauration", industrie: "Industrie" },
  web: { oui: "Site web souhaité", "plus-tard": "Site web plus tard", non: "Sans site web" },
  salaries: { non: "Sans salarié", "1-5": "1–5 salariés", "5plus": "5+ salariés" },
};

// ── Animated wrapper ──────────────────────────────────────────────────────────
function StepWrapper({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [stepKey]);

  return (
    <div
      key={stepKey}
      className={cn(
        "transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [currentStepId, setCurrentStepId] = useState("type");
  const [answers, setAnswers] = useState<Answers>({});
  const [history, setHistory] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [stepKey, setStepKey] = useState("type");

  const totalSteps = 5;
  const currentStep = steps.find((s) => s.id === currentStepId)!;
  const progress = done ? 100 : ((currentStep?.num ?? 1) - 1) / totalSteps * 100;

  function handleSelect(option: Option) {
    const newAnswers = { ...answers, [currentStepId]: option.id };
    setAnswers(newAnswers);
    setHistory([...history, currentStepId]);
    if (option.next === "result") {
      setDone(true);
      setStepKey("result");
    } else {
      setCurrentStepId(option.next);
      setStepKey(option.next + Date.now());
    }
  }

  function handleBack() {
    if (done) {
      setDone(false);
      const prev = history[history.length - 1];
      setCurrentStepId(prev);
      setHistory(history.slice(0, -1));
      setStepKey(prev + "-back");
      return;
    }
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCurrentStepId(prev);
    setHistory(history.slice(0, -1));
    setStepKey(prev + "-back");
  }

  const recommendation = done ? getRecommendation(answers) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Progress */}
      <div className="w-full h-1.5 bg-zinc-100">
        <div className="h-full bg-amber-400 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={handleBack}
          className={cn(
            "flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors",
            history.length === 0 && !done ? "opacity-0 pointer-events-none" : ""
          )}
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        {!done ? (
          <span className="text-sm text-zinc-400 font-medium">{currentStep?.num} / {totalSteps}</span>
        ) : (
          <span className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            🇲🇦 Votre recommandation
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {!done ? (
          <StepWrapper stepKey={stepKey}>
            <div className="max-w-3xl w-full">
              <div className="mb-10 text-center">
                <p className="text-blue-500 font-semibold text-sm mb-3 uppercase tracking-widest">
                  Question {currentStep?.num}
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 leading-tight">
                  {currentStep?.question}
                </h1>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto">{currentStep?.subtitle}</p>
              </div>

              <div className={cn(
                "grid gap-4",
                currentStep?.options.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                currentStep?.options.length >= 4 ? "grid-cols-1 md:grid-cols-2" :
                "grid-cols-1 md:grid-cols-3"
              )}>
                {currentStep?.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="group text-left bg-white border-2 border-zinc-200 rounded-2xl p-6 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 focus:outline-none"
                  >
                    <div className="text-4xl mb-4">{option.emoji}</div>
                    <h3 className="font-black text-xl text-zinc-900 mb-1">{option.label}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{option.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-transparent group-hover:text-zinc-700 transition-colors">
                      Choisir <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </StepWrapper>
        ) : (
          <StepWrapper stepKey={stepKey}>
            <div className="max-w-2xl w-full">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 rounded-full px-4 py-1.5 text-sm font-bold text-amber-800 mb-6 rotate-[-1deg]">
                  🎉 Profil analysé !
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 leading-tight">
                  Votre recommandation
                </h1>
                <p className="text-zinc-500 text-lg">
                  Basée sur le marché marocain et vos réponses.
                </p>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {Object.entries(answers).map(([stepId, optionId]) => {
                  const label = answerLabels[stepId]?.[optionId];
                  if (!label) return null;
                  return (
                    <span key={stepId} className="bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {label}
                    </span>
                  );
                })}
              </div>

              {recommendation && (
                <div className="border-2 border-zinc-900 rounded-2xl bg-white shadow-[6px_6px_0px_0px] shadow-zinc-900 overflow-hidden">
                  <div className={cn("p-6 border-b-2 border-zinc-900", recommendation.badgeColor)}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-zinc-900 bg-white inline-block mb-3">
                          {recommendation.badge}
                        </span>
                        <h2 className="text-2xl font-black text-zinc-900">{recommendation.title}</h2>
                        <p className="text-zinc-600 mt-1">{recommendation.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-3xl font-black text-zinc-900">{recommendation.price}</p>
                        <p className="text-xs text-zinc-500 mt-1 max-w-[160px]">{recommendation.priceNote}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Ce qui est inclus</p>
                    <ul className="space-y-3 mb-6">
                      {recommendation.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-zinc-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-zinc-800 font-medium text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {recommendation.extras.length > 0 && (
                      <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-4 mb-6">
                        <p className="text-sm font-bold text-zinc-700 mb-2">Options recommandées pour vous</p>
                        {recommendation.extras.map((e) => (
                          <p key={e} className="text-sm text-zinc-600 mb-1">{e}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 h-12 bg-zinc-900 text-white font-bold rounded-full text-base shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                        {recommendation.cta}
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 border-2 border-zinc-900 rounded-full text-base font-bold hover:bg-zinc-50">
                        Parler à un expert
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={() => { setAnswers({}); setHistory([]); setDone(false); setCurrentStepId("type"); setStepKey("restart-" + Date.now()); }}
                  className="text-sm text-zinc-400 hover:text-zinc-600 underline transition-colors"
                >
                  Recommencer le questionnaire
                </button>
              </div>
            </div>
          </StepWrapper>
        )}
      </div>
    </div>
  );
}
