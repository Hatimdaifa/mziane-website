// Fiches procédures internes : comment réaliser chaque offre, étape par étape.
// Une fiche par famille d'offres, dans data/<id>.json (recherchées puis relues, sources en bas de chaque fiche).
// Réservé aux conseillers : affiché dans l'espace conseiller et imprimé en PDF (scripts/procedures-pdf.mjs).
import type { DossierSpec } from "@/lib/espace";

import creationAe from "./data/creation-ae.json";
import creationSarlau from "./data/creation-sarlau.json";
import creationSas from "./data/creation-sas.json";
import creationCooperative from "./data/creation-cooperative.json";
import creationSaSci from "./data/creation-sa-sci.json";
import intlMre from "./data/intl-mre.json";
import intlEtranger from "./data/intl-etranger.json";
import intlZai from "./data/intl-zai.json";
import comptaAe from "./data/compta-ae.json";
import comptaSociete from "./data/compta-societe.json";
import domiciliation from "./data/domiciliation.json";
import formaliteGerant from "./data/formalite-gerant.json";
import formaliteSiege from "./data/formalite-siege.json";
import formaliteDenominationObjet from "./data/formalite-denomination-objet.json";
import formaliteParts from "./data/formalite-parts.json";
import formaliteCapital from "./data/formalite-capital.json";
import formaliteSommeil from "./data/formalite-sommeil.json";
import formaliteFermer from "./data/formalite-fermer.json";
import marque from "./data/marque.json";
import web from "./data/web.json";
import aidesEntreprise from "./data/aides-entreprise.json";
import aidesAgri from "./data/aides-agri.json";
import aidesParticuliers from "./data/aides-particuliers.json";

export type Who = "moi" | "cabinet" | "client" | "administration";

export interface Step {
  id: string;
  title: string;
  who: Who;
  where?: string;
  how?: string[];
  pieces?: string[];
  delai?: string;
  cout?: string;
  pieges?: string[];
  preuve?: string;
  /** Formules concernées ; vide = toutes */
  offers?: string[];
}

export interface Procedure {
  id: string;
  title: string;
  offers: string[];
  summary: string;
  duree?: string;
  frais_officiels?: { label: string; montant: string; note?: string }[];
  avant_de_commencer?: string[];
  phases: { title: string; steps: Step[] }[];
  cabinet?: string[];
  client?: string[];
  apres?: string[];
  sources?: { title: string; url: string }[];
  a_verifier?: string[];
}

export const WHO: Record<Who, { label: string; tone: string }> = {
  moi: { label: "Moi", tone: "bg-blue-50 text-blue-800" },
  cabinet: { label: "Cabinet comptable", tone: "bg-amber-100 text-amber-900" },
  client: { label: "Client", tone: "bg-red-50 text-red-700" },
  administration: { label: "Administration", tone: "bg-zinc-100 text-zinc-700" },
};

export const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Créer une entreprise", ids: ["creation-ae", "creation-sarlau", "creation-sas", "creation-cooperative", "creation-sa-sci"] },
  { title: "MRE et étrangers", ids: ["intl-mre", "intl-etranger", "intl-zai"] },
  { title: "Comptabilité et domiciliation", ids: ["compta-ae", "compta-societe", "domiciliation"] },
  { title: "Vie de la société", ids: ["formalite-gerant", "formalite-siege", "formalite-denomination-objet", "formalite-parts", "formalite-capital", "formalite-sommeil", "formalite-fermer"] },
  { title: "Marque et site web", ids: ["marque", "web"] },
  { title: "Aides de l'État", ids: ["aides-entreprise", "aides-agri", "aides-particuliers"] },
];

export const PROCEDURES = [
  creationAe, creationSarlau, creationSas, creationCooperative, creationSaSci,
  intlMre, intlEtranger, intlZai,
  comptaAe, comptaSociete, domiciliation,
  formaliteGerant, formaliteSiege, formaliteDenominationObjet, formaliteParts, formaliteCapital, formaliteSommeil, formaliteFermer,
  marque, web,
  aidesEntreprise, aidesAgri, aidesParticuliers,
] as Procedure[];

export const procedureById = (id: string) => PROCEDURES.find((p) => p.id === id);
export const stepCount = (p: Procedure) => p.phases.reduce((n, ph) => n + ph.steps.length, 0);

// ── Fiches d'un dossier ─────────────────────────────────────────────────────
const creationFor = (forme?: string) =>
  forme === "auto" ? "creation-ae"
  : forme === "sas" ? "creation-sas"
  : forme === "cooperative" ? "creation-cooperative"
  : forme === "sa" || forme === "sci" ? "creation-sa-sci"
  : "creation-sarlau";

const PACKS: Record<string, (forme?: string) => string[]> = {
  lancement: (f) => [creationFor(f), "compta-societe", "web"],
  "lancement-equipe": (f) => [creationFor(f), "compta-societe", "web"],
  demarrage: () => ["creation-ae", "compta-ae", "web"],
  envol: (f) => [creationFor(f), "aides-entreprise", "compta-societe"],
  diaspora: (f) => ["intl-mre", creationFor(f), "domiciliation", "compta-societe"],
  identite: () => ["marque", "web"],
  terre: () => ["aides-agri"],
};

function forOffer(id: string, forme?: string): string[] {
  if (id.startsWith("ae-")) return ["creation-ae"];
  if (id.startsWith("soc-")) return [creationFor(forme)];
  if (id === "compta-declaratif") return ["compta-ae"];
  if (id.startsWith("compta-")) return ["compta-societe"];
  if (id.startsWith("domi-")) return ["domiciliation"];
  if (id.startsWith("marque-")) return ["marque"];
  if (id.startsWith("web-") || id === "hebergement") return ["web"];
  if (id === "intl-mre") return ["intl-mre", creationFor(forme)];
  if (id === "intl-etranger") return ["intl-etranger", creationFor(forme)];
  if (id === "intl-zai") return ["intl-zai"];
  if (id.startsWith("aides-")) return ["aides-entreprise"];
  if (id.startsWith("part-")) return ["aides-particuliers"];
  return [];
}

const FORMALITE: Record<string, string> = {
  gerant: "formalite-gerant", siege: "formalite-siege", denomination: "formalite-denomination-objet", objet: "formalite-denomination-objet",
  parts: "formalite-parts", capital: "formalite-capital", sommeil: "formalite-sommeil", fermer: "formalite-fermer",
};

/** Fiches à suivre pour un dossier, dans l'ordre où on les réalise, sans doublon. */
export function proceduresForSpec(spec: DossierSpec): Procedure[] {
  const ids = [
    ...(spec.packId ? PACKS[spec.packId]?.(spec.forme) ?? [] : []),
    ...(spec.offreId ? forOffer(spec.offreId, spec.forme) : []),
    ...(spec.formalites ?? []).map((f) => FORMALITE[f]).filter(Boolean),
    ...(spec.opts ?? []).flatMap((o) => forOffer(o, spec.forme)),
  ];
  return [...new Set(ids)].map(procedureById).filter((p): p is Procedure => !!p);
}

/** Ids des offres d'un dossier, pour n'afficher que les étapes de la bonne formule. */
export function offerIdsOfSpec(spec: DossierSpec): string[] {
  return [spec.packId, ...(spec.packId ? PACK_OFFERS[spec.packId] ?? [] : []), spec.offreId, ...(spec.offreId ? PACK_OFFERS[spec.offreId] ?? [] : []), spec.forme, ...(spec.formalites ?? []), ...(spec.opts ?? [])].filter((x): x is string => !!x);
}

// Formules comprises dans chaque pack ou offre combinée (voir les items des packs dans offers.ts).
const PACK_OFFERS: Record<string, string[]> = {
  lancement: ["soc-standard", "compta-essentiel", "web-vitrine", "hebergement"],
  "lancement-equipe": ["soc-standard", "compta-business", "web-vitrine", "hebergement"],
  demarrage: ["ae-accompagne", "compta-declaratif", "web-page", "hebergement"],
  envol: ["soc-standard", "aides-dossier", "compta-business"],
  diaspora: ["intl-mre", "soc-standard", "domi-business", "compta-essentiel"],
  // Création à distance (MRE, étrangers) : statuts sur mesure, comme la formule Standard.
  "intl-mre": ["soc-standard"],
  "intl-etranger": ["soc-standard"],
  identite: ["marque-protection", "web-vitrine"],
  terre: ["aides-dossier"],
};

export const stepApplies = (step: Step, offers: string[] | null) =>
  !offers || !step.offers?.length || step.offers.some((o) => offers.includes(o));
