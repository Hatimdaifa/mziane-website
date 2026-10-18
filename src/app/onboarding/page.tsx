"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, ArrowRight, Check, Building2, HandCoins, FilePen, Calculator, Globe, User, Users, House,
  ShoppingBag, Briefcase, Laptop, Hotel, Factory, Hammer, Sprout, HardHat, Tractor, Droplets, Cog, Trees,
  Warehouse, Beef, Package, ShieldCheck, Lightbulb, Store, UsersRound, HeartHandshake, MapPin,
  GraduationCap, Accessibility, BriefcaseBusiness, Clock, Stamp, ArrowLeftRight, Landmark, CircleOff,
  Ship, Zap, Receipt, Plane, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aideById, type Aide } from "@/lib/aides";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

// ── Types ────────────────────────────────────────────────────────────────────
interface Option {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
}

interface Step {
  id: string;
  question: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
  next: (a: Answers) => string;
  left: number; // nombre estimé de questions restantes après celle-ci
}

type Answers = Record<string, string[]>;
const has = (a: Answers, step: string, id: string) => a[step]?.includes(id) ?? false;
const one = (a: Answers, step: string) => a[step]?.[0];

// ── Questions ────────────────────────────────────────────────────────────────
const steps: Step[] = [
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
    left: 4,
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
    next: (a) => (one(a, "c-equipe") === "immo" ? "c-invest" : "c-secteur"),
    left: 4,
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
    next: (a) => (one(a, "c-equipe") === "seul" ? "c-ca" : one(a, "c-equipe") === "plusieurs" ? "c-financement" : "c-invest"),
    left: 3,
  },
  {
    id: "c-ca",
    question: "Chiffre d'affaires prévu la première année ?",
    subtitle: "Le statut auto-entrepreneur est plafonné à 200 000 DH (services) et 500 000 DH (commerce, industrie, artisanat).",
    options: [
      { id: "petit", icon: Receipt, label: "Moins de 200 000 DH" },
      { id: "moyen", icon: Receipt, label: "Entre 200 000 et 500 000 DH" },
      { id: "grand", icon: Receipt, label: "Plus de 500 000 DH" },
      { id: "nsp", icon: Lightbulb, label: "Je ne sais pas encore" },
    ],
    next: () => "c-invest",
    left: 3,
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
    next: () => "c-invest",
    left: 3,
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
    left: 2,
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
    next: () => "p-profil",
    left: 1,
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
    left: 3,
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
    left: 2,
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
    left: 1,
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
    left: 2,
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
    left: 1,
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
    left: 1,
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
    left: 0,
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
    left: 0,
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
    left: 1,
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
    left: 0,
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
    left: 1,
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
    left: 0,
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
    left: 1,
  },
];

const stepById = (id: string) => steps.find((s) => s.id === id)!;

// ── Résultat ─────────────────────────────────────────────────────────────────
interface Service {
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  features: string[];
  priceId?: string;
}

const PRICE_ID = "pri_01kqn7gsrncbnzk5zksye6385v";

function investOf(a: Answers) {
  return one(a, "c-invest") ?? one(a, "c-invest-e");
}

function matchAides(a: Answers): Aide[] {
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

function formeCreation(a: Answers) {
  const equipe = one(a, "c-equipe");
  if (equipe === "immo") return "sci";
  if (equipe === "plusieurs") return ({ associes: "sarl", investisseurs: "sas", gros: "sa" } as Record<string, string>)[one(a, "c-financement") ?? ""] ?? "sarl";
  const ca = one(a, "c-ca");
  const secteur = one(a, "c-secteur");
  const commerce = ["commerce", "industrie", "artisanat"].includes(secteur ?? "");
  if (ca === "petit" || (ca === "moyen" && commerce)) return "auto";
  return "sarlau";
}

const packs: Record<string, Service> = {
  auto: {
    title: "Pack Auto-entrepreneur", subtitle: "Le statut le plus simple pour démarrer seul, avec un impôt de 0,5 % à 1 % du chiffre d'affaires.",
    price: "490 DH", priceNote: "Conseiller dédié inclus",
    features: ["Inscription au registre national de l'auto-entrepreneur", "Affiliation AMO", "Modèles de factures conformes", "Alerte sur les plafonds de chiffre d'affaires", "Conseils pour passer en SARLAU"],
    priceId: PRICE_ID,
  },
  sarlau: {
    title: "Pack SARLAU", subtitle: "La forme la plus utilisée au Maroc pour entreprendre seul avec une responsabilité limitée.",
    price: "1 490 DH", priceNote: "Frais de greffe et Journal Officiel en sus",
    features: ["Rédaction des statuts", "Certificat négatif OMPIC", "Dépôt du capital", "Immatriculation au registre de commerce", "Publication au Journal Officiel", "Obtention de l'ICE", "Domiciliation 3 mois offerte"],
    priceId: PRICE_ID,
  },
  sarl: {
    title: "Pack SARL", subtitle: "Pour entreprendre à plusieurs avec une responsabilité limitée aux apports.",
    price: "1 990 DH", priceNote: "Frais de greffe et Journal Officiel en sus",
    features: ["Rédaction des statuts (jusqu'à 3 associés)", "Certificat négatif OMPIC", "Dépôt du capital", "Immatriculation au registre de commerce", "Publication au Journal Officiel", "Pacte d'associés simple", "Domiciliation 3 mois offerte"],
    priceId: PRICE_ID,
  },
  sas: {
    title: "Pack SAS", subtitle: "Des statuts sur mesure, adaptés à l'entrée d'investisseurs.",
    price: "2 490 DH", priceNote: "Frais de greffe et publications légales en sus",
    features: ["Statuts sur mesure", "Juriste dédié", "Traitement prioritaire", "Immatriculation complète", "Domiciliation 6 mois offerte", "Accompagnement fiscal 1 an"],
    priceId: PRICE_ID,
  },
  sa: {
    title: "Pack SA", subtitle: "Pour les grands projets avec plusieurs actionnaires.",
    price: "2 490 DH", priceNote: "Frais de greffe, commissaire aux apports et publications en sus",
    features: ["Statuts sur mesure", "Juriste dédié", "Organisation du conseil d'administration", "Immatriculation complète", "Domiciliation 6 mois offerte", "Accompagnement fiscal 1 an"],
    priceId: PRICE_ID,
  },
  sci: {
    title: "Pack SCI", subtitle: "Détenir, gérer et transmettre un patrimoine immobilier à plusieurs.",
    price: "2 490 DH", priceNote: "Frais d'enregistrement et de publication en sus",
    features: ["Statuts sur mesure", "Juriste dédié", "Immatriculation complète", "Conseils sur la transmission", "Accompagnement fiscal 1 an"],
    priceId: PRICE_ID,
  },
};

const gestionLabels: Record<string, string> = {
  siege: "Transfert du siège social", gerant: "Changement de gérant", parts: "Cession de parts ou entrée d'un associé",
  capital: "Modification du capital", denomination: "Changement de nom ou d'activité", marque: "Dépôt de marque à l'OMPIC",
  domiciliation: "Domiciliation de la société", fermer: "Dissolution et liquidation",
};

function getService(a: Answers): Service {
  const besoin = one(a, "besoin");
  const profil = one(a, "a-profil");

  if (besoin === "aides") {
    return {
      title: profil === "particulier" ? "Accompagnement aux aides sociales" : "Dossier d'aides de A à Z",
      subtitle: "On vérifie votre éligibilité, on monte le dossier, on le dépose et on le suit jusqu'au versement.",
      price: "Diagnostic gratuit",
      priceNote: "Honoraires annoncés par écrit avant de commencer",
      features: [
        "Vérification de votre éligibilité à chaque aide",
        "Liste précise des pièces à réunir",
        "Montage et dépôt du dossier",
        "Suivi auprès de l'organisme et relances",
        "Accompagnement jusqu'au versement de l'aide",
      ],
    };
  }
  if (besoin === "creer") {
    const p = packs[formeCreation(a)];
    return { ...p, features: [...p.features, "Option : montage des dossiers d'aides ci-dessous"] };
  }
  if (besoin === "gerer") {
    const actions = (a["g-action"] ?? []).map((x) => gestionLabels[x]).filter(Boolean);
    return {
      title: actions.length === 1 ? actions[0] : "Formalités juridiques de votre société",
      subtitle: "Rédaction des actes, dépôt au greffe, publications légales et mise à jour du registre de commerce.",
      price: "Sur devis",
      priceNote: "Devis gratuit sous 24 h, frais de greffe et publications en sus",
      features: [...actions, "Rédaction des procès-verbaux et actes", "Dépôt au tribunal de commerce", "Publications légales", "Mise à jour du registre de commerce"],
    };
  }
  if (besoin === "compta") {
    const forme = one(a, "k-forme");
    const sal = one(a, "k-salaries");
    const paie = sal && sal !== "non" ? ["Paie et déclarations CNSS"] : [];
    if (forme === "ae") return { title: "Comptabilité Starter", subtitle: "Pour les auto-entrepreneurs et entreprises individuelles.", price: "490 DH / mois", priceNote: "Sans engagement de durée", features: ["Tenue comptable", "Déclarations fiscales", "Bilan simplifié", "Une consultation par mois", ...paie] };
    if (forme === "societe" && sal !== "5plus") return { title: "Comptabilité Business", subtitle: "Pour les SARLAU et SARL en activité.", price: "990 DH / mois", priceNote: "Paie incluse jusqu'à 5 salariés", features: ["Tenue complète", "IS, TVA, IR et taxe professionnelle", "Bilan et liasse fiscale", "Paie jusqu'à 5 salariés", "Consultations illimitées"] };
    return { title: "Comptabilité sur mesure", subtitle: "Pour les structures plus complexes.", price: "Sur devis", priceNote: "Devis gratuit sous 24 h", features: ["Tenue complète", "Multi-sociétés", "Paie et déclarations CNSS", "Bilan, liasse fiscale et audit", "Conseil fiscal"] };
  }
  if (besoin === "etranger") {
    const s = one(a, "x-situation");
    return {
      title: s === "mre" ? "Pack MRE" : s === "zai" ? "Dossier zone franche ou CFC" : "Pack International",
      subtitle: "Créer et gérer votre structure au Maroc sans vous déplacer.",
      price: s === "mre" ? "2 490 DH" : s === "zai" ? "Sur devis" : "3 990 DH",
      priceNote: "Frais de greffe et publications légales en sus",
      features: ["Choix de la structure juridique", "Procurations et apostilles", "Compte en devises ou en dirhams convertibles", "Immatriculation à distance", "Domiciliation incluse", s === "zai" ? "Dossier d'éligibilité ZAI ou CFC" : "Conformité Office des Changes"],
      priceId: s === "zai" ? undefined : PRICE_ID,
    };
  }
  return packs.sarlau;
}

function summaryLines(a: Answers) {
  return Object.entries(a).flatMap(([stepId, ids]) => {
    const s = stepById(stepId);
    const labels = ids.map((id) => s.options.find((o) => o.id === id)?.label).filter(Boolean);
    return labels.length ? [`${s.question} ${labels.join(", ")}`] : [];
  });
}

// ── UI ───────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-76px)] bg-zinc-50" />}>
      <QuestionnaireFromUrl />
    </Suspense>
  );
}

// Entrée directe depuis une page : /onboarding?besoin=aides
function QuestionnaireFromUrl() {
  const b = useSearchParams().get("besoin");
  const valid = b && stepById("besoin").options.some((o) => o.id === b) ? b : null;
  return <Questionnaire key={valid ?? "start"} besoin={valid} />;
}

function Questionnaire({ besoin }: { besoin: string | null }) {
  const start: Answers = besoin ? { besoin: [besoin] } : {};
  const [stepId, setStepId] = useState(() => (besoin ? stepById("besoin").next(start) : "besoin"));
  const [answers, setAnswers] = useState<Answers>(start);
  const [history, setHistory] = useState<string[]>(besoin ? ["besoin"] : []);
  const [pending, setPending] = useState<string[]>([]);
  const done = stepId === "result";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepId]);

  function goTo(id: string, a: Answers) {
    setStepId(id);
    setPending(a[id] ?? []);
  }

  const step = done ? null : stepById(stepId);
  const progress = done ? 100 : Math.round((history.length / (history.length + (step!.left + 1))) * 100);

  function commit(ids: string[]) {
    // On efface les réponses des questions situées après celle-ci (le parcours peut changer)
    const keep = new Set([...history, stepId]);
    const next: Answers = Object.fromEntries(Object.entries(answers).filter(([k]) => keep.has(k)));
    next[stepId] = ids;
    setAnswers(next);
    setHistory([...history, stepId]);
    goTo(step!.next(next), next);
  }

  function choose(o: Option) {
    if (!step) return;
    if (!step.multi) return commit([o.id]);
    setPending((p) => {
      if (o.id === "aucun") return p.includes("aucun") ? [] : ["aucun"];
      const base = p.filter((x) => x !== "aucun");
      return base.includes(o.id) ? base.filter((x) => x !== o.id) : [...base, o.id];
    });
  }

  function back() {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory(history.slice(0, -1));
    goTo(prev, answers);
  }

  function restart() {
    setAnswers({});
    setHistory([]);
    goTo("besoin", {});
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-zinc-50 pb-24">
      <div className="mx-auto max-w-[760px] px-6 pt-12 max-sm:pt-8">
        {/* Progression */}
        <div className="mb-10 flex items-center gap-4">
          <button
            type="button"
            onClick={back}
            disabled={!history.length}
            aria-label="Question précédente"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-blue-500 hover:text-blue-700 disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="w-12 text-right text-sm font-semibold tabular-nums text-zinc-500">{progress} %</span>
        </div>

        {step && (
          <div key={step.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] font-extrabold leading-tight tracking-tight text-zinc-900 text-balance">{step.question}</h1>
            <p className="mt-3 mb-8 text-[17px] text-zinc-600">{step.subtitle}</p>

            <div className={cn("grid gap-3", step.options.length > 4 && "sm:grid-cols-2")}>
              {step.options.map((o) => {
                const selected = step.multi ? pending.includes(o.id) : answers[step.id]?.includes(o.id);
                const Icon = o.icon;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o)}
                    aria-pressed={step.multi ? selected : undefined}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_-8px_rgba(31,42,61,.18)] focus-visible:outline-2 focus-visible:outline-blue-600",
                      selected ? "border-blue-600 bg-blue-50" : "border-zinc-200"
                    )}
                  >
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl transition", selected ? "bg-blue-600 text-white" : "bg-zinc-50 text-blue-700 group-hover:bg-blue-50")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-zinc-900">{o.label}</span>
                      {o.description && <span className="mt-0.5 block text-sm leading-snug text-zinc-600">{o.description}</span>}
                    </span>
                    {step.multi ? (
                      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition", selected ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-300")}>
                        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {step.multi && (
              <button
                type="button"
                disabled={!pending.length}
                onClick={() => commit(pending)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_17px_20px_-8px_rgba(0,132,153,.35)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {done && <Result answers={answers} onRestart={restart} />}
      </div>
    </div>
  );
}

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const service = getService(answers);
  const aides = matchAides(answers);
  const lines = summaryLines(answers);
  const body = [
    "Bonjour,", "", "Voici mes réponses au questionnaire Mziane :", ...lines.map((l) => `- ${l}`), "",
    `Service recommandé : ${service.title}`,
    ...(aides.length ? ["", "Aides identifiées :", ...aides.map((x) => `- ${x.titre}`)] : []),
    "", "Mes coordonnées (nom, téléphone, ville) :", "",
  ].join("\n");
  const mailto = `mailto:contact@mziane.com?subject=${encodeURIComponent(`Demande : ${service.title}`)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-blue-700">
        <Check className="h-3.5 w-3.5" /> Votre recommandation
      </span>
      <h1 className="mt-4 text-[clamp(1.8rem,4.5vw,2.6rem)] font-extrabold leading-tight tracking-tight text-zinc-900">{service.title}</h1>
      <p className="mt-3 text-[17px] text-zinc-600">{service.subtitle}</p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_50px_-20px_rgba(31,42,61,.22)]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 bg-zinc-50 p-6">
          <div>
            <span className="block text-sm font-semibold text-zinc-500">Tarif</span>
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">{service.price}</span>
          </div>
          <span className="max-w-[240px] text-right text-sm text-zinc-500 max-sm:text-left">{service.priceNote}</span>
        </div>
        <ul className="grid gap-3 p-6">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[15px] text-zinc-800">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700"><Check className="h-3 w-3" strokeWidth={3} /></span>
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 border-t border-zinc-200 p-6 sm:flex-row">
          {service.priceId && (
            <div className="flex-1">
              <PaddleCheckoutButton priceId={service.priceId} label="Commander maintenant" popular />
            </div>
          )}
          <a href={mailto} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-700">
            <Mail className="h-4 w-4" /> {service.priceId ? "Parler à un expert" : "Demander mon diagnostic gratuit"}
          </a>
        </div>
      </div>

      {aides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            {aides.length} aide{aides.length > 1 ? "s" : ""} pour votre situation
          </h2>
          <p className="mt-2 text-zinc-600">
            D&apos;après vos réponses, vous pourriez y avoir droit. On vérifie chaque condition avec vous avant de monter le dossier.
          </p>
          <div className="mt-6 grid gap-3">
            {aides.map((x) => (
              <Link key={x.id} href={`/aides#${x.id}`} className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_-8px_rgba(31,42,61,.18)]">
                <span className="block font-bold text-zinc-900 group-hover:text-blue-700">{x.titre}</span>
                <span className="mt-1 block text-sm text-zinc-500">{x.organisme}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-zinc-700 line-clamp-3">{x.apport}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-500">Montants indicatifs, susceptibles d&apos;évoluer selon les textes en vigueur.</p>
        </section>
      )}

      <div className="mt-10 text-center">
        <button type="button" onClick={onRestart} className="text-sm text-zinc-500 underline transition hover:text-zinc-800">
          Recommencer le questionnaire
        </button>
      </div>
    </div>
  );
}
