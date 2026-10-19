// Questions du questionnaire /onboarding et calcul des aides possibles.
import type { LucideIcon } from "lucide-react";
import {
  Building2, HandCoins, FilePen, Calculator, Globe, User, Users, House,
  ShoppingBag, Briefcase, Laptop, Hotel, Factory, Hammer, Sprout, HardHat, Tractor, Droplets, Cog, Trees,
  Warehouse, Beef, Package, ShieldCheck, Lightbulb, Store, UsersRound, HeartHandshake, MapPin,
  GraduationCap, Accessibility, BriefcaseBusiness, Clock, Stamp, ArrowLeftRight, Landmark, CircleOff,
  Ship, Zap, Receipt, Plane,
} from "lucide-react";
import { aideById, type Aide } from "@/lib/aides";
import type { FormeId } from "@/lib/offers";

export interface Option {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
}

export interface Step {
  id: string;
  question: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
  next: (a: Answers) => string;
}

export type Answers = Record<string, string[]>;
export const has = (a: Answers, step: string, id: string) => a[step]?.includes(id) ?? false;
export const one = (a: Answers, step: string) => a[step]?.[0];

// ── Questions ────────────────────────────────────────────────────────────────
export const steps: Step[] = [
  {
    id: "besoin",
    question: "De quoi avez-vous besoin ?",
    subtitle: "Choisissez ce qui vous amène, on vous pose ensuite quelques questions ciblées.",
    options: [
      { id: "creer", icon: Building2, label: "Créer mon entreprise", description: "Auto-entrepreneur, SARLAU, SARL, SAS, SA ou SCI." },
      { id: "aides", icon: HandCoins, label: "Obtenir une aide de l'État", description: "Subventions, primes, prêts d'honneur à 0 % et exonérations." },
      { id: "gerer", icon: FilePen, label: "Modifier ou fermer ma société", description: "Siège, gérant, associés, capital, marque, dissolution." },
      { id: "compta", icon: Calculator, label: "Confier ma comptabilité", description: "Tenue, TVA, IS, paie et bilan annuel." },
      { id: "etranger", icon: Globe, label: "Investir depuis l'étranger", description: "MRE, étranger non-résident, zone franche ou CFC." },
    ],
    next: (a) => ({ creer: "c-equipe", aides: "a-profil", gerer: "g-action", compta: "k-forme", etranger: "x-situation" })[one(a, "besoin")!] ?? "result",
  },

  // ── Créer ──
  {
    id: "c-equipe",
    question: "Vous lancez votre activité...",
    subtitle: "Le nombre d'associés détermine la forme juridique possible.",
    options: [
      { id: "seul", icon: User, label: "Seul", description: "Vous êtes le seul propriétaire de l'activité." },
      { id: "plusieurs", icon: Users, label: "À plusieurs", description: "Avec un ou plusieurs associés." },
      { id: "immo", icon: House, label: "Pour gérer un bien immobilier", description: "Détenir et transmettre un patrimoine immobilier." },
    ],
    next: (a) => ({ seul: "c-ca", plusieurs: "c-financement" } as Record<string, string>)[one(a, "c-equipe") ?? ""] ?? "result",
  },
  {
    id: "c-secteur",
    question: "Dans quel secteur ?",
    subtitle: "Certaines aides sont réservées à des secteurs précis.",
    options: [
      { id: "commerce", icon: ShoppingBag, label: "Commerce", description: "Négoce, boutique, import-export, vente en ligne." },
      { id: "services", icon: Briefcase, label: "Services et conseil", description: "Consulting, formation, prestations." },
      { id: "digital", icon: Laptop, label: "Digital et innovation", description: "Tech, application, startup innovante." },
      { id: "tourisme", icon: Hotel, label: "Tourisme et restauration", description: "Hébergement, animation, restaurant, agence." },
      { id: "industrie", icon: Factory, label: "Industrie et transformation", description: "Atelier, usine, agroalimentaire." },
      { id: "artisanat", icon: Hammer, label: "Artisanat", description: "Artisan, coopérative artisanale." },
      { id: "agriculture", icon: Sprout, label: "Agriculture et élevage", description: "Exploitation agricole, élevage, apiculture." },
      { id: "btp", icon: HardHat, label: "BTP et immobilier", description: "Construction, travaux, promotion." },
    ],
    next: (a) => (one(a, "besoin") === "creer" ? "p-profil" : "c-invest"),
  },
  {
    id: "c-ca",
    question: "Chiffre d'affaires prévu la première année ?",
    subtitle: "Le statut auto-entrepreneur est plafonné à 200 000 DH (services) et 500 000 DH (commerce, industrie, artisanat).",
    options: [
      { id: "petit", icon: Receipt, label: "Moins de 200 000 DH" },
      { id: "moyen-commerce", icon: ShoppingBag, label: "200 000 à 500 000 DH, en commerce, industrie ou artisanat" },
      { id: "moyen-services", icon: Briefcase, label: "200 000 à 500 000 DH, en services" },
      { id: "grand", icon: Receipt, label: "Plus de 500 000 DH" },
      { id: "nsp", icon: Lightbulb, label: "Je ne sais pas encore" },
    ],
    next: () => "c-salaries",
  },
  {
    id: "c-financement",
    question: "Comment sera financé le projet ?",
    subtitle: "Cela oriente vers une SARL, une SAS ou une SA.",
    options: [
      { id: "associes", icon: Users, label: "Entre associés", description: "Capital apporté par les associés." },
      { id: "investisseurs", icon: Lightbulb, label: "Avec des investisseurs", description: "Levée de fonds, entrée de nouveaux actionnaires." },
      { id: "gros", icon: Landmark, label: "Grand projet", description: "Capital de 300 000 DH ou plus, nombreux actionnaires." },
    ],
    next: () => "c-salaries",
  },
  {
    id: "c-invest",
    question: "Combien prévoyez-vous d'investir ?",
    subtitle: "Matériel, local, travaux, stock. Les primes de l'État dépendent de ce montant.",
    options: [
      { id: "lt100k", icon: HandCoins, label: "Moins de 100 000 DH" },
      { id: "100k-1m", icon: HandCoins, label: "100 000 DH à 1 million DH" },
      { id: "1m-50m", icon: HandCoins, label: "1 à 50 millions DH" },
      { id: "gt50m", icon: HandCoins, label: "Plus de 50 millions DH" },
    ],
    next: (a) => (one(a, "besoin") === "etranger" ? "result" : "c-salaries"),
  },
  {
    id: "c-salaries",
    question: "Prévoyez-vous de recruter ?",
    subtitle: "L'État peut prendre en charge une partie des charges des premiers salariés.",
    options: [
      { id: "non", icon: User, label: "Non, pas au début" },
      { id: "1-5", icon: Users, label: "1 à 5 salariés" },
      { id: "5plus", icon: UsersRound, label: "Plus de 5 salariés" },
    ],
    next: (a) => (one(a, "besoin") === "creer" ? "c-aide" : "p-profil"),
  },
  {
    id: "c-aide",
    question: "Voulez-vous qu'on cherche une aide de l'État ?",
    subtitle: "Primes, subventions et prêts d'honneur à 0 %. Jamais de prêt avec intérêt. Le montant dépend surtout de votre investissement.",
    options: [
      { id: "non", icon: CircleOff, label: "Non, pas pour l'instant" },
      { id: "lt100k", icon: HandCoins, label: "Oui, j'investis moins de 100 000 DH" },
      { id: "100k-1m", icon: HandCoins, label: "Oui, j'investis de 100 000 DH à 1 million DH" },
      { id: "1m-50m", icon: HandCoins, label: "Oui, j'investis de 1 à 50 millions DH" },
      { id: "gt50m", icon: HandCoins, label: "Oui, j'investis plus de 50 millions DH" },
    ],
    next: (a) => (one(a, "c-aide") === "non" ? "result" : "c-secteur"),
  },

  // ── Aides ──
  {
    id: "a-profil",
    question: "Vous êtes...",
    subtitle: "Les aides ne sont pas les mêmes pour un agriculteur, une entreprise ou un particulier.",
    options: [
      { id: "agri", icon: Tractor, label: "Agriculteur ou éleveur", description: "Vous exploitez ou voulez exploiter une terre." },
      { id: "porteur", icon: Lightbulb, label: "Porteur de projet", description: "Vous voulez créer votre activité." },
      { id: "entreprise", icon: Store, label: "Une entreprise en activité", description: "Vous voulez investir, recruter, former ou exporter." },
      { id: "coop", icon: HeartHandshake, label: "Une coopérative ou association", description: "Agricole, artisanale, féminine..." },
      { id: "particulier", icon: User, label: "Un particulier", description: "Une aide pour vous ou votre famille." },
    ],
    next: (a) => ({ agri: "a-agri", porteur: "c-secteur", entreprise: "e-besoins", coop: "coop-secteur", particulier: "part-situation" })[one(a, "a-profil")!] ?? "result",
  },
  {
    id: "a-agri",
    question: "Quel est votre projet agricole ?",
    subtitle: "Plusieurs choix possibles.",
    multi: true,
    options: [
      { id: "irrigation", icon: Droplets, label: "Irrigation goutte-à-goutte" },
      { id: "materiel", icon: Cog, label: "Tracteur ou matériel agricole" },
      { id: "plantations", icon: Trees, label: "Plantations (olivier, amandier...)" },
      { id: "serres", icon: Warehouse, label: "Serres" },
      { id: "elevage", icon: Beef, label: "Élevage ou apiculture" },
      { id: "transfo", icon: Package, label: "Stockage, conditionnement, transformation" },
      { id: "assurance", icon: ShieldCheck, label: "Assurer mes récoltes" },
    ],
    next: () => "a-surface",
  },
  {
    id: "a-surface",
    question: "Quelle surface exploitez-vous ?",
    subtitle: "Les petites exploitations ont droit à des taux de subvention plus élevés.",
    options: [
      { id: "petit", icon: Sprout, label: "5 hectares ou moins" },
      { id: "moyen", icon: Sprout, label: "Entre 5 et 20 hectares" },
      { id: "grand", icon: Tractor, label: "Plus de 20 hectares" },
      { id: "aucune", icon: CircleOff, label: "Je n'ai pas encore de terre" },
    ],
    next: () => "p-profil",
  },
  {
    id: "e-besoins",
    question: "Que voulez-vous financer ?",
    subtitle: "Plusieurs choix possibles.",
    multi: true,
    options: [
      { id: "investir", icon: Factory, label: "Investir ou agrandir", description: "Machines, local, nouvelle unité." },
      { id: "recruter", icon: Users, label: "Recruter", description: "Embaucher des salariés ou des jeunes diplômés." },
      { id: "former", icon: GraduationCap, label: "Former mes salariés", description: "Formations remboursées." },
      { id: "exporter", icon: Ship, label: "Exporter", description: "Salons, prospection à l'étranger." },
      { id: "tourisme", icon: Hotel, label: "Moderniser une activité touristique" },
      { id: "energie", icon: Zap, label: "Économiser l'énergie", description: "Projets verts, efficacité énergétique." },
    ],
    next: (a) => (has(a, "e-besoins", "investir") || has(a, "e-besoins", "tourisme") ? "c-invest-e" : "p-profil"),
  },
  {
    id: "c-invest-e",
    question: "Montant de l'investissement prévu ?",
    subtitle: "Les primes à l'investissement dépendent de ce montant.",
    options: [
      { id: "lt100k", icon: HandCoins, label: "Moins de 100 000 DH" },
      { id: "100k-1m", icon: HandCoins, label: "100 000 DH à 1 million DH" },
      { id: "1m-50m", icon: HandCoins, label: "1 à 50 millions DH" },
      { id: "gt50m", icon: HandCoins, label: "Plus de 50 millions DH" },
    ],
    next: () => "p-profil",
  },
  {
    id: "coop-secteur",
    question: "Dans quel domaine est votre coopérative ?",
    subtitle: "Chaque domaine a ses programmes d'appui.",
    options: [
      { id: "agricole", icon: Sprout, label: "Agriculture ou élevage" },
      { id: "argan", icon: Trees, label: "Argan ou produits des oasis" },
      { id: "artisanat", icon: Hammer, label: "Artisanat" },
      { id: "autre", icon: HeartHandshake, label: "Autre activité" },
    ],
    next: () => "p-profil",
  },
  {
    id: "part-situation",
    question: "Quelle est votre situation ?",
    subtitle: "Plusieurs choix possibles.",
    multi: true,
    options: [
      { id: "logement", icon: House, label: "J'achète mon premier logement" },
      { id: "modeste", icon: HeartHandshake, label: "Mon foyer a des revenus modestes" },
      { id: "enfants", icon: Users, label: "Je suis salarié avec des enfants" },
      { id: "chomage", icon: BriefcaseBusiness, label: "J'ai perdu mon emploi" },
      { id: "retraite", icon: Clock, label: "Je suis à l'âge de la retraite" },
      { id: "etudiant", icon: GraduationCap, label: "Je suis étudiant ou bachelier" },
      { id: "handicap", icon: Accessibility, label: "Situation de handicap dans mon foyer" },
      { id: "independant", icon: Store, label: "Je suis indépendant sans couverture santé" },
      { id: "sinistre", icon: MapPin, label: "Sinistré du séisme d'Al Haouz" },
      { id: "relogement", icon: Building2, label: "Je vis en bidonville ou en habitat menaçant ruine" },
    ],
    next: () => "result",
  },
  {
    id: "p-profil",
    question: "Votre profil",
    subtitle: "Plusieurs choix possibles. Certains programmes sont réservés à ces profils.",
    multi: true,
    options: [
      { id: "femme", icon: User, label: "Je suis une femme" },
      { id: "jeune", icon: GraduationCap, label: "J'ai moins de 45 ans" },
      { id: "mre", icon: Plane, label: "Je vis à l'étranger (MRE)" },
      { id: "modeste", icon: HeartHandshake, label: "Je suis en situation de précarité" },
      { id: "oasis", icon: Trees, label: "Je suis dans une zone d'oasis ou d'arganier" },
      { id: "aucun", icon: CircleOff, label: "Aucun de ces cas" },
    ],
    next: () => "result",
  },

  // ── Gérer ──
  {
    id: "g-action",
    question: "Que voulez-vous faire ?",
    subtitle: "Plusieurs choix possibles.",
    multi: true,
    options: [
      { id: "siege", icon: MapPin, label: "Transférer le siège social" },
      { id: "gerant", icon: User, label: "Changer de gérant" },
      { id: "parts", icon: ArrowLeftRight, label: "Céder des parts ou faire entrer un associé" },
      { id: "capital", icon: Landmark, label: "Modifier le capital" },
      { id: "denomination", icon: FilePen, label: "Changer le nom ou l'activité" },
      { id: "marque", icon: Stamp, label: "Déposer ma marque (OMPIC)" },
      { id: "domiciliation", icon: Building2, label: "Domicilier ma société" },
      { id: "fermer", icon: CircleOff, label: "Fermer ma société (dissolution et liquidation)" },
    ],
    next: () => "g-forme",
  },
  {
    id: "g-forme",
    question: "Quelle est la forme de votre entreprise ?",
    subtitle: "Les formalités et le coût dépendent de la forme.",
    options: [
      { id: "sarlau", icon: User, label: "SARLAU" },
      { id: "sarl", icon: Users, label: "SARL" },
      { id: "sa", icon: Landmark, label: "SA ou SAS" },
      { id: "ae", icon: Store, label: "Auto-entrepreneur ou entreprise individuelle" },
      { id: "creation", icon: Lightbulb, label: "Pas encore créée" },
    ],
    next: () => "result",
  },

  // ── Comptabilité ──
  {
    id: "k-forme",
    question: "Quelle est votre structure ?",
    subtitle: "Les obligations comptables ne sont pas les mêmes.",
    options: [
      { id: "ae", icon: Store, label: "Auto-entrepreneur ou entreprise individuelle" },
      { id: "societe", icon: Building2, label: "SARLAU ou SARL" },
      { id: "multi", icon: Landmark, label: "SA, SAS ou plusieurs sociétés" },
    ],
    next: () => "k-salaries",
  },
  {
    id: "k-salaries",
    question: "Combien de salariés ?",
    subtitle: "Pour prévoir la gestion de la paie et des déclarations CNSS.",
    options: [
      { id: "non", icon: User, label: "Aucun" },
      { id: "1-5", icon: Users, label: "1 à 5" },
      { id: "5plus", icon: UsersRound, label: "Plus de 5" },
    ],
    next: () => "result",
  },

  // ── Étranger ──
  {
    id: "x-situation",
    question: "Quelle est votre situation ?",
    subtitle: "Cela détermine les démarches bancaires et administratives.",
    options: [
      { id: "mre", icon: Plane, label: "Marocain résidant à l'étranger (MRE)" },
      { id: "etranger", icon: Globe, label: "Étranger non-résident" },
      { id: "zai", icon: Factory, label: "Projet en zone franche ou à Casablanca Finance City" },
    ],
    next: () => "c-invest",
  },
];

export const stepById = (id: string) => steps.find((s) => s.id === id);
export const BESOINS = steps[0].options.map((o) => o.id);

/** Nombre maximal de questions restantes (celle-ci comprise) : le total affiché ne peut que baisser. */
export function maxRemaining(id: string, a: Answers, depth = 0): number {
  const s = stepById(id);
  if (!s || depth > 12) return 0;
  if (a[id]?.length) return 1 + maxRemaining(s.next(a), a, depth + 1);
  const nexts = new Map<string, Answers>();
  for (const o of s.options) {
    const h = { ...a, [id]: [o.id] };
    const n = s.next(h);
    if (!nexts.has(n)) nexts.set(n, h);
  }
  let best = 0;
  nexts.forEach((h, n) => (best = Math.max(best, maxRemaining(n, h, depth + 1))));
  return 1 + best;
}

/** Réponses du chemin réellement parcouru (les réponses d'autres branches sont gardées pour le retour, mais ignorées). */
export function pathAnswers(a: Answers, history: string[]): Answers {
  return Object.fromEntries(history.filter((h) => a[h]).map((h) => [h, a[h]]));
}

export function summaryLines(a: Answers) {
  return Object.entries(a).flatMap(([stepId, ids]) => {
    const s = stepById(stepId);
    if (!s) return [];
    const labels = ids.map((id) => s.options.find((o) => o.id === id)?.label).filter(Boolean);
    return labels.length ? [`${s.question} ${labels.join(", ")}`] : [];
  });
}

function investOf(a: Answers) {
  const c = one(a, "c-aide");
  return one(a, "c-invest") ?? one(a, "c-invest-e") ?? (c && c !== "non" ? c : undefined);
}

export function matchAides(a: Answers): Aide[] {
  const ids = new Set<string>();
  const add = (...l: string[]) => l.forEach((i) => ids.add(i));
  const besoin = one(a, "besoin");
  const profil = one(a, "a-profil");
  const invest = investOf(a);
  const secteur = one(a, "c-secteur");

  // Création d'activité (parcours Créer ou porteur de projet)
  if (besoin === "creer" || profil === "porteur") {
    add("B09");
    if (formeCreation(a) === "auto") add("B08");
    if (invest !== "gt50m" && invest !== "1m-50m") add("B03", "B04");
    else add("B04");
    if (invest && invest !== "lt100k") add("B10");
    if (invest === "1m-50m") add("B01");
    if (invest === "gt50m") add("B02");
    if (one(a, "c-salaries") && one(a, "c-salaries") !== "non") add("B11", "B12", "B13");
    if (secteur === "tourisme") add("B15");
    if (secteur === "digital") add("B05");
    if (secteur === "artisanat") add("B18");
    if (secteur === "industrie") add("B16");
    if (secteur === "agriculture") add("A01", "A02", "A08");
  }

  // Agriculteurs
  if (profil === "agri") {
    const map: Record<string, string> = { irrigation: "A01", materiel: "A02", plantations: "A03", serres: "A04", elevage: "A05", transfo: "A06", assurance: "A09" };
    (a["a-agri"] ?? []).forEach((b) => map[b] && add(map[b]));
    const surface = one(a, "a-surface");
    if (surface === "grand") add("A07");
    if (surface === "aucune" || has(a, "p-profil", "jeune")) add("A08");
    add("A10");
  }

  // Entreprises en activité
  if (profil === "entreprise") {
    if (has(a, "e-besoins", "investir")) {
      add("B16", "B10");
      if (invest === "1m-50m") add("B01");
      if (invest === "gt50m") add("B02");
    }
    if (has(a, "e-besoins", "recruter")) add("B11", "B12", "B13");
    if (has(a, "e-besoins", "former")) add("B14");
    if (has(a, "e-besoins", "exporter")) add("B17");
    if (has(a, "e-besoins", "tourisme")) add("B15");
    if (has(a, "e-besoins", "energie")) add("B16");
  }

  // Coopératives
  if (profil === "coop") {
    add("A13");
    const s = one(a, "coop-secteur");
    if (s === "agricole") add("A11", "A06");
    if (s === "argan") add("A12", "A06");
    if (s === "artisanat") add("B18", "B17");
    add("B07");
    if (has(a, "p-profil", "femme")) add("C03");
  }

  // Particuliers
  if (profil === "particulier") {
    const map: Record<string, string[]> = {
      logement: ["D01"], modeste: ["D02", "D03", "D04"], enfants: ["D07"], chomage: ["D06"], retraite: ["D08"],
      etudiant: ["D09"], handicap: ["D10"], independant: ["D05"], sinistre: ["D11"], relogement: ["D12"],
    };
    (a["part-situation"] ?? []).forEach((s) => map[s] && add(...map[s]));
  }

  // Investissement depuis l'étranger
  if (besoin === "etranger") {
    if (one(a, "x-situation") === "mre") add("B06");
    if (invest === "1m-50m") add("B01");
    if (invest === "gt50m") add("B02");
    if (invest && invest !== "lt100k") add("B10");
  }

  // Profil
  if (has(a, "p-profil", "femme")) {
    add("C02", "C04");
    if (invest === "1m-50m" || invest === "gt50m") add("C01");
  }
  if (has(a, "p-profil", "mre")) add("B06");
  if (has(a, "p-profil", "modeste")) add("B07");
  if (has(a, "p-profil", "oasis")) add("A12");

  return [...ids].map(aideById).filter((x): x is Aide => !!x);
}

/** Forme juridique conseillée d'après les réponses du parcours Créer. */
export function formeCreation(a: Answers): FormeId {
  const equipe = one(a, "c-equipe");
  if (equipe === "immo") return "sci";
  if (equipe === "plusieurs") return ({ associes: "sarl", investisseurs: "sas", gros: "sa" } as Record<string, FormeId>)[one(a, "c-financement") ?? ""] ?? "sarl";
  const ca = one(a, "c-ca");
  if (ca === "petit" || ca === "moyen-commerce") return "auto";
  return "sarlau";
}

