// Présentation des packs : icônes, ordre d'affichage et pack mis en avant par profil.
import type { LucideIcon } from "lucide-react";
import { HandCoins, Plane, Rocket, Sparkles, Stamp, Users } from "lucide-react";
import { type Pack, type Profil, packTotal, packs } from "@/lib/offers";

export const PACK_ICONS: Record<string, LucideIcon> = {
  lancement: Rocket,
  "lancement-equipe": Users,
  demarrage: Sparkles,
  envol: HandCoins,
  diaspora: Plane,
  identite: Stamp,
};

/** Échelle de prix lue de gauche à droite : leurre bas, recommandé au centre, ancre haute. */
export const PACK_ORDER = ["demarrage", "lancement", "lancement-equipe", "envol", "diaspora", "identite"];

export const sortPacks = (list: Pack[]) =>
  [...list].sort((a, b) => PACK_ORDER.indexOf(a.id) - PACK_ORDER.indexOf(b.id));

export const FEATURED_BY_PROFIL: Record<Profil | "tous", string> = {
  tous: "lancement",
  societe: "lancement",
  auto: "demarrage",
  aides: "envol",
  agri: "",
  mre: "diaspora",
};

/** Mois offerts quand on paie d'avance (le plus petit gain, pour rester vrai sur tous les packs). */
export const MOIS_OFFERTS_AVANCE = Math.min(
  ...packs.filter((p) => p.upfront && p.monthly).map((p) => Math.floor((packTotal(p) - p.upfront!) / p.monthly!)),
);

/** Les trois packs phares de la page tarifs, dans l'ordre d'affichage. */
export const PACKS_PHARES = ["demarrage", "lancement", "lancement-equipe"];
