// Questions guidées du dossier client, par démarche.
// Les réponses (table dossier_answers, ids "q:<champ>") servent à trois choses :
// 1. décider quelles pièces de documents.ts sont vraiment nécessaires (rules) ;
// 2. remplir automatiquement les informations écrites demandées (covers) ;
// 3. pré-remplir les documents à signer (signables).
import { SERVICE_DOCS, docsForOrder } from "@/lib/documents";
import type { DossierSpec } from "@/lib/espace";

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "yesno" | "names3" | "persons";

export interface Person { nom: string; piece: string; nationalite: "marocaine" | "etrangere"; societe?: boolean; parts?: string }
export type QValue = string | string[] | Person[];
export type QA = Record<string, QValue | undefined>;

export interface Field {
  id: string;
  label: string;
  hint?: string;
  type: FieldType;
  options?: { v: string; l: string }[];
  optional?: boolean;
  placeholder?: string;
  /** persons : nombre minimum de personnes */
  min?: number;
  /** persons : libellé d'une personne (associé, membre...) */
  person?: string;
  show?: (a: QA) => boolean;
}

export interface Ctx { email: string; phone: string; fullName: string }

export interface ServiceIntake {
  key: string;
  title: string;
  fields: Field[];
  /** Pièce de documents.ts -> nécessaire ou non d'après les réponses */
  rules?: Record<string, (a: QA) => boolean>;
  /** Information écrite de documents.ts -> texte rempli d'après les réponses */
  covers?: Record<string, (a: QA, c: Ctx) => string | undefined>;
}

// ── Lecture des réponses ────────────────────────────────────────────────────
export const QPREFIX = "q:";
export const str = (a: QA, id: string) => (typeof a[id] === "string" ? (a[id] as string).trim() : "");
export const yes = (a: QA, id: string) => a[id] === "oui";
export const num = (a: QA, id: string) => Number(str(a, id).replace(/[^\d]/g, "")) || 0;
export const list = (a: QA, id: string) => (Array.isArray(a[id]) ? (a[id] as unknown[]).filter((x) => typeof x === "string" && x.trim()) as string[] : []);
export const persons = (a: QA, id: string) => (Array.isArray(a[id]) ? (a[id] as unknown[]).filter((x): x is Person => typeof x === "object" && x !== null && !!(x as Person).nom?.trim()) : []);

export function parseAnswers(rows: { requirement_id: string; value: string }[]): QA {
  const a: QA = {};
  for (const r of rows) {
    if (!r.requirement_id.startsWith(QPREFIX)) continue;
    const id = r.requirement_id.slice(QPREFIX.length);
    try { a[id] = r.value.startsWith("[") ? JSON.parse(r.value) : r.value; } catch { a[id] = r.value; }
  }
  return a;
}
export const serialize = (v: QValue) => (typeof v === "string" ? v : JSON.stringify(v));

const yn = (id: string, label: string, hint?: string, show?: Field["show"]): Field => ({ id, label, hint, type: "yesno", show });
const fmtPersons = (ps: Person[], withParts = true) =>
  ps.map((p) => `${p.nom} (${p.piece || "pièce à préciser"}, ${p.nationalite === "marocaine" ? "marocaine" : "étrangère"}${p.societe ? ", société" : ""}${withParts && p.parts ? `, ${p.parts}` : ""})`).join("\n");
const fmtNames = (n: string[]) => n.map((x, i) => `${i + 1}. ${x}`).join("\n");

// ── Vous (demandé une seule fois, pour toutes les démarches) ────────────────
export const IDENTITE: Field[] = [
  { id: "id-nom", label: "Nom et prénom, comme sur votre pièce d'identité", type: "text" },
  { id: "id-piece", label: "Numéro de CIN ou de passeport", type: "text", placeholder: "Ex. AB123456" },
  { id: "id-naissance", label: "Date de naissance", type: "date" },
  { id: "id-nationalite", label: "Nationalité", type: "select", options: [{ v: "marocaine", l: "Marocaine" }, { v: "etrangere", l: "Autre nationalité" }] },
  { id: "id-adresse", label: "Adresse complète", hint: "Celle de votre pièce d'identité ou votre adresse actuelle", type: "textarea" },
  { id: "id-ville", label: "Ville et pays", type: "text", placeholder: "Ex. Casablanca, Maroc" },
];

// ── Blocs réutilisés ────────────────────────────────────────────────────────
const nomsSociete = (id = "soc-noms", label = "Trois noms possibles, par ordre de préférence"): Field => ({ id, label, hint: "Nous vérifions qu'ils sont libres à l'OMPIC et retenons le premier disponible", type: "names3" });
const activite = (id = "soc-activite", label = "Décrivez votre activité"): Field => ({ id, label, hint: "En quelques lignes : ce que vous vendez ou faites, pour qui", type: "textarea" });
const reglementee = (id = "soc-reglementee"): Field => yn(id, "L'activité est-elle réglementée ?", "Santé, transport, BTP, enseignement, tourisme, sécurité... : un diplôme ou une autorisation est alors demandé");
const societeExistante: Field[] = [
  { id: "fx-denomination", label: "Nom de la société", type: "text" },
  { id: "fx-rc", label: "Numéro du registre de commerce et ville du tribunal", type: "text", placeholder: "Ex. 123456, Casablanca" },
];
const siege = (forme: string): Field[] => [
  {
    id: "soc-siege", label: "Où sera le siège de la société ?", type: "select",
    options: [{ v: "domi", l: "Chez Mziane (domiciliation)" }, { v: "bail", l: "Un local loué" }, { v: "propriete", l: "Un local qui m'appartient" }],
    hint: forme === "cooperative" ? undefined : "Une adresse est obligatoire pour immatriculer la société",
  },
  { id: "soc-siege-adresse", label: "Adresse du local", type: "textarea", show: (a) => str(a, "soc-siege") !== "domi" && !!str(a, "soc-siege") },
];
const capital: Field = { id: "soc-capital", label: "Montant du capital (DH)", hint: "Libre pour une SARL ou une SAS. Au-delà de 100 000 DH, il doit être déposé à la banque avant la création", type: "number", placeholder: "Ex. 10 000" };
const associes = (label = "Associés", min = 1): Field => ({ id: "soc-associes", label, type: "persons", person: "associé", min, hint: "Indiquez aussi la part de chacun (en % ou en DH)" });
const gerant = (personne = "gérant"): Field[] => [
  {
    id: "soc-gerant", label: `Qui sera le ${personne} ?`, type: "select",
    options: [{ v: "moi", l: "Moi" }, { v: "associe", l: "Un autre associé" }, { v: "externe", l: "Une personne qui n'est pas associée" }],
  },
  { id: "soc-gerant-nom", label: `Nom et numéro de CIN du ${personne}`, type: "text", show: (a) => ["associe", "externe"].includes(str(a, "soc-gerant")) },
];
const coversCreation = {
  "noms-proposes": (a: QA) => (list(a, "soc-noms").length ? fmtNames(list(a, "soc-noms")) : undefined),
  activite: (a: QA) => str(a, "soc-activite") || undefined,
  "repartition-capital": (a: QA) => (num(a, "soc-capital") ? `Capital : ${num(a, "soc-capital").toLocaleString("fr-FR")} DH\n${fmtPersons(persons(a, "soc-associes"))}` : undefined),
};
const anyForeign = (a: QA) => persons(a, "soc-associes").some((p) => p.nationalite === "etrangere") || str(a, "id-nationalite") === "etrangere";
const anyCompany = (a: QA) => persons(a, "soc-associes").some((p) => p.societe);
const siegeNeeded = (a: QA) => str(a, "soc-siege") !== "domi";

// ── Démarches ───────────────────────────────────────────────────────────────
const INTAKE: Omit<ServiceIntake, "title">[] = [
  {
    key: "auto",
    fields: [
      activite("ae-activite", "Quelle activité allez-vous exercer ?"),
      { id: "ae-adresse", label: "Adresse où vous exercez", hint: "Votre domicile peut convenir", type: "textarea" },
      reglementee("ae-reglementee"),
    ],
    rules: { "diplome-agrement": (a) => yes(a, "ae-reglementee") },
    covers: {
      telephone: (_a, c) => c.phone || undefined,
      email: (_a, c) => c.email || undefined,
      activite: (a) => str(a, "ae-activite") || undefined,
      "adresse-activite": (a) => str(a, "ae-adresse") || undefined,
    },
  },
  {
    key: "sarlau",
    fields: [nomsSociete(), activite(), reglementee(), capital, yn("soc-gerant-unique", "Serez-vous aussi le gérant ?", "Dans une SARLAU, l'associé unique est souvent le gérant"),
      { id: "soc-gerant-nom", label: "Nom et numéro de CIN du gérant", type: "text", show: (a) => a["soc-gerant-unique"] === "non" }, ...siege("sarlau")],
    rules: {
      "cin-gerant": (a) => a["soc-gerant-unique"] === "non",
      "justif-siege": siegeNeeded,
      "blocage-capital": (a) => num(a, "soc-capital") > 100000,
      "diplome-agrement": (a) => yes(a, "soc-reglementee"),
    },
    covers: { ...coversCreation, "repartition-capital": (a, c) => (num(a, "soc-capital") ? `Capital : ${num(a, "soc-capital").toLocaleString("fr-FR")} DH, détenu à 100 % par ${str(a, "id-nom") || c.fullName}` : undefined) },
  },
  {
    key: "sarl",
    fields: [nomsSociete(), activite(), reglementee(), capital, associes("Associés (vous compris)", 2), ...gerant(), ...siege("sarl")],
    rules: {
      "cin-gerant": (a) => str(a, "soc-gerant") === "externe",
      "passeport-etranger": anyForeign, "associe-personne-morale": anyCompany,
      "justif-siege": siegeNeeded, "blocage-capital": (a) => num(a, "soc-capital") > 100000,
    },
    covers: coversCreation,
  },
  {
    key: "sas",
    fields: [nomsSociete(), activite(), reglementee(), capital, associes("Associés (vous compris)"), ...gerant("président"), ...siege("sas")],
    rules: {
      "passeport-etranger": anyForeign, "associe-personne-morale": anyCompany,
      "justif-siege": siegeNeeded, "blocage-capital": (a) => num(a, "soc-capital") > 100000,
    },
    covers: coversCreation,
  },
  {
    key: "cooperative",
    fields: [nomsSociete("coop-noms", "Trois noms possibles pour la coopérative"), activite(), reglementee(), { id: "soc-associes", label: "Membres fondateurs (vous compris)", type: "persons", person: "membre", min: 5, hint: "Au moins 5 membres, avec la part souscrite de chacun" }, ...siege("cooperative")],
    rules: { "diplome-agrement": (a) => yes(a, "soc-reglementee") },
    covers: {
      "noms-cooperative": (a) => (list(a, "coop-noms").length ? fmtNames(list(a, "coop-noms")) : undefined),
      "liste-membres": (a) => (persons(a, "soc-associes").length ? fmtPersons(persons(a, "soc-associes")) : undefined),
      activite: (a) => str(a, "soc-activite") || undefined,
    },
  },
  {
    key: "sa",
    fields: [nomsSociete(), activite(), { ...capital, hint: "Minimum 300 000 DH, dont au moins un quart déposé à la banque" }, associes("Actionnaires (vous compris)"), { id: "sa-admins", label: "Administrateurs ou membres du directoire", hint: "Nom et numéro de CIN de chacun", type: "textarea" }, ...siege("sa")],
    rules: { "passeport-etranger": anyForeign, "associe-personne-morale": anyCompany, "justif-siege": siegeNeeded },
    covers: coversCreation,
  },
  {
    key: "sci",
    fields: [nomsSociete(), capital, associes("Associés (vous compris)"), yn("sci-apport", "Un associé apporte-t-il un bien immobilier à la société ?"), ...siege("sci")],
    rules: { "passeport-etranger": anyForeign, "titre-foncier-apport": (a) => yes(a, "sci-apport"), "justif-siege": siegeNeeded },
    covers: coversCreation,
  },
  {
    key: "mre",
    fields: [
      { id: "mre-pays", label: "Dans quel pays résidez-vous ?", type: "text" },
      yn("mre-devises", "Le capital sera-t-il envoyé depuis l'étranger ?", "Conseillé : vous pourrez rapatrier plus tard le capital et les bénéfices"),
      yn("mre-langue", "Certains de vos documents sont-ils dans une autre langue que l'arabe ou le français ?"),
    ],
    rules: { "avis-virement-devises": (a) => yes(a, "mre-devises"), "traduction-documents": (a) => yes(a, "mre-langue") },
  },
  {
    key: "domiciliation",
    fields: [],
    // En création, c'est nous qui obtenons le certificat négatif
    rules: { "certificat-negatif-ou-rc": (a) => a[CREATION_FLAG] !== "oui" },
    covers: { "adresse-gerant": (a, c) => [str(a, "id-adresse"), str(a, "id-ville"), c.phone].filter(Boolean).join("\n") || undefined },
  },
  {
    key: "gerant",
    fields: [...societeExistante, { id: "g-nouveau", label: "Nom et numéro de CIN du nouveau gérant", type: "text" }, yn("g-demission", "Le gérant sortant démissionne-t-il ?", "Sinon, il est révoqué par les associés")],
    rules: { "demission-gerant": (a) => yes(a, "g-demission") },
  },
  {
    key: "siege",
    fields: [...societeExistante, yn("s-domi", "Le nouveau siège sera-t-il chez Mziane (domiciliation) ?"), { id: "s-adresse", label: "Nouvelle adresse du siège", type: "textarea", show: (a) => a["s-domi"] === "non" }],
    rules: { "justif-nouveau-siege": (a) => a["s-domi"] !== "oui" },
  },
  {
    key: "denomination",
    fields: [...societeExistante, nomsSociete("d-noms", "Trois nouveaux noms possibles, par ordre de préférence")],
    covers: { "noms-proposes": (a) => (list(a, "d-noms").length ? fmtNames(list(a, "d-noms")) : undefined) },
  },
  {
    key: "parts",
    fields: [
      ...societeExistante,
      { id: "p-cessionnaire", label: "Acheteur des parts : nom et numéro de CIN", type: "text" },
      { id: "p-nombre", label: "Nombre de parts cédées", type: "number" },
      { id: "p-prix", label: "Prix total de la cession (DH)", type: "number" },
      { id: "p-agrement", label: "Les statuts imposent-ils l'accord des autres associés ?", type: "select", options: [{ v: "oui", l: "Oui" }, { v: "non", l: "Non, je suis seul associé" }, { v: "nsp", l: "Je ne sais pas" }], hint: "Nous le vérifions dans les statuts" },
    ],
    rules: { "cin-associes": (a) => str(a, "p-agrement") !== "non" },
    covers: { "conditions-cession": (a) => (num(a, "p-nombre") ? `${num(a, "p-nombre")} parts pour ${num(a, "p-prix").toLocaleString("fr-FR")} DH, au profit de ${str(a, "p-cessionnaire")}` : undefined) },
  },
  {
    key: "capital",
    fields: [
      ...societeExistante,
      { id: "c-operation", label: "Quelle opération ?", type: "select", options: [{ v: "argent", l: "Augmentation par apport d'argent" }, { v: "reserves", l: "Augmentation par les réserves ou le compte courant" }, { v: "nature", l: "Augmentation par apport d'un bien" }, { v: "reduction", l: "Réduction du capital" }] },
      { id: "c-montant", label: "Nouveau montant du capital (DH)", type: "number" },
      { id: "c-repartition", label: "Répartition après l'opération", hint: "Nom de chaque associé et sa part", type: "textarea" },
    ],
    rules: { "blocage-augmentation": (a) => str(a, "c-operation") === "argent", "dernier-bilan": (a) => ["reserves", "reduction"].includes(str(a, "c-operation")) },
    covers: { "montant-capital": (a) => (num(a, "c-montant") ? `${num(a, "c-montant").toLocaleString("fr-FR")} DH\n${str(a, "c-repartition")}` : undefined) },
  },
  {
    key: "objet",
    fields: [...societeExistante, activite("o-activite", "Décrivez la nouvelle activité"), reglementee("o-reglementee")],
    rules: { "diplome-agrement": (a) => yes(a, "o-reglementee") },
    covers: { activite: (a) => str(a, "o-activite") || undefined },
  },
  { key: "sommeil", fields: [...societeExistante, { id: "sm-date", label: "Depuis quand l'activité est-elle arrêtée ?", type: "date" }] },
  {
    key: "fermer",
    fields: [
      ...societeExistante,
      { id: "f-liquidateur", label: "Qui sera le liquidateur ?", type: "select", options: [{ v: "gerant", l: "Le gérant actuel" }, { v: "autre", l: "Une autre personne" }] },
      { id: "f-liquidateur-nom", label: "Nom et numéro de CIN du liquidateur", type: "text", show: (a) => str(a, "f-liquidateur") === "autre" },
      { id: "f-dettes", label: "Dettes et créances restantes", hint: "Écrivez « aucune » s'il n'y en a pas", type: "textarea" },
    ],
    covers: { "dettes-creances": (a) => str(a, "f-dettes") || undefined },
  },
  {
    key: "marque",
    fields: [
      { id: "m-nom", label: "Nom de la marque", type: "text" },
      { id: "m-forme", label: "Votre marque est...", type: "select", options: [{ v: "mot", l: "Un mot seul" }, { v: "logo", l: "Un logo" }, { v: "les-deux", l: "Un mot avec un logo" }] },
      { id: "m-deposant", label: "La marque sera déposée au nom de...", type: "select", options: [{ v: "moi", l: "Moi, personnellement" }, { v: "societe", l: "Ma société" }] },
      { id: "m-ice", label: "ICE de la société", type: "text", show: (a) => str(a, "m-deposant") === "societe" },
      { id: "m-produits", label: "Quels produits ou services voulez-vous protéger ?", hint: "En mots simples, nous choisissons les classes", type: "textarea" },
      yn("m-priorite", "Avez-vous déposé cette marque à l'étranger il y a moins de 6 mois ?"),
    ],
    rules: { "ice-deposant": (a) => str(a, "m-deposant") === "societe", "logo-marque": (a) => str(a, "m-forme") !== "mot", priorite: (a) => yes(a, "m-priorite") },
    covers: { "ice-deposant": (a) => str(a, "m-ice") || undefined, "produits-services": (a) => str(a, "m-produits") || undefined },
  },
  {
    key: "web",
    fields: [
      { id: "w-presentation", label: "Présentez votre activité et vos services", hint: "Quelques lignes suffisent, nous rédigeons le reste", type: "textarea" },
      { id: "w-coordonnees", label: "Coordonnées à afficher sur le site", hint: "Téléphone, WhatsApp, adresse, horaires", type: "textarea" },
      { id: "w-domaine", label: "Nom de domaine souhaité", type: "text", placeholder: "Ex. monentreprise.ma", optional: true },
    ],
    covers: { "textes-site": (a) => str(a, "w-presentation") || undefined, "coordonnees-site": (a) => str(a, "w-coordonnees") || undefined, "nom-domaine": (a) => str(a, "w-domaine") || undefined },
  },
  {
    key: "compta",
    fields: [
      yn("k-existe", "La société existe-t-elle déjà ?"),
      ...societeExistante.map((f) => ({ ...f, show: (a: QA) => yes(a, "k-existe") })),
      yn("k-clos", "Un exercice comptable a-t-il déjà été clôturé ?", undefined, (a) => yes(a, "k-existe")),
      yn("k-salaries", "La société a-t-elle des salariés ?"),
    ],
    rules: {
      "modele-j": (a) => yes(a, "k-existe"), "statuts-a-jour": (a) => yes(a, "k-existe"), "identifiants-fiscaux": (a) => yes(a, "k-existe"),
      "dernier-bilan": (a) => yes(a, "k-clos"), "dossier-salaries": (a) => yes(a, "k-salaries"),
      // Société nouvelle : relevés et factures arrivent ensuite chaque mois, rien à fournir au départ
      "releves-bancaires": (a) => yes(a, "k-existe"), factures: (a) => yes(a, "k-existe"),
    },
  },
  {
    key: "compta-ae",
    fields: [
      yn("kae-inscrit", "Êtes-vous déjà inscrit comme auto-entrepreneur ?"),
      { id: "kae-if", label: "Identifiant fiscal et ICE", type: "text", show: (a) => yes(a, "kae-inscrit") },
      { id: "kae-cnss", label: "Numéro d'immatriculation CNSS", type: "text", show: (a) => yes(a, "kae-inscrit") },
    ],
    rules: { "carte-ae": (a) => yes(a, "kae-inscrit"), "if-ice-ae": (a) => yes(a, "kae-inscrit"), "numero-cnss-ae": (a) => yes(a, "kae-inscrit") },
    covers: { "if-ice-ae": (a) => str(a, "kae-if") || undefined, "numero-cnss-ae": (a) => str(a, "kae-cnss") || undefined },
  },
  {
    key: "aides",
    fields: [
      yn("a-existe", "Votre société est-elle déjà créée ?"),
      yn("a-clos", "Un exercice comptable a-t-il déjà été clôturé ?", undefined, (a) => yes(a, "a-existe")),
      { id: "a-montant", label: "Montant total du projet (DH)", hint: "Matériel, local, travaux, stock", type: "number" },
      { id: "a-apport", label: "Votre apport personnel (DH)", type: "number" },
      { id: "a-ca", label: "Chiffre d'affaires visé la 1re année (DH)", type: "number" },
      { id: "a-emplois", label: "Nombre d'emplois prévus", type: "number" },
    ],
    rules: {
      "modele-j": (a) => yes(a, "a-existe"), "regularite-fiscale": (a) => yes(a, "a-existe"), "regularite-cnss": (a) => yes(a, "a-existe"),
      "dernier-bilan": (a) => yes(a, "a-clos"), "preuve-fonds-propres": (a) => num(a, "a-montant") >= 1_000_000,
    },
    covers: {
      "infos-business-plan": (a) => (num(a, "a-montant") ? `Projet : ${num(a, "a-montant").toLocaleString("fr-FR")} DH, apport ${num(a, "a-apport").toLocaleString("fr-FR")} DH, chiffre d'affaires visé ${num(a, "a-ca").toLocaleString("fr-FR")} DH, ${num(a, "a-emplois")} emploi(s)` : undefined),
    },
  },
  {
    key: "aides-honneur",
    fields: [{ id: "h-projet", label: "Présentez votre projet", hint: "Le besoin, les clients visés, le montant nécessaire", type: "textarea" }, yn("h-existe", "Votre entreprise est-elle déjà créée ?")],
    rules: { "modele-j": (a) => yes(a, "h-existe") },
    covers: { "idee-projet": (a) => str(a, "h-projet") || undefined },
  },
  {
    key: "terre",
    fields: [
      { id: "t-foncier", label: "Le terrain est...", type: "select", options: [{ v: "titre", l: "À moi, avec un titre ou une moulkia" }, { v: "location", l: "Loué" }, { v: "collectif", l: "Collectif ou sans titre" }] },
      { id: "t-surface", label: "Surface à irriguer (hectares)", type: "number" },
      { id: "t-versement", label: "La subvention sera versée à...", type: "select", options: [{ v: "installateur", l: "L'installateur (je n'avance presque rien)" }, { v: "moi", l: "Moi, après les travaux" }] },
    ],
    rules: { "attestation-collectif": (a) => str(a, "t-foncier") === "collectif", "engagement-5ha": (a) => num(a, "t-surface") > 0 && num(a, "t-surface") <= 5, rib: (a) => str(a, "t-versement") === "moi" },
  },
  {
    key: "part-asd",
    fields: [
      { id: "asd-ids", label: "Identifiant RNP et numéro RSU du ménage", hint: "Sur le reçu d'inscription. Laissez vide si vous ne les avez pas : nous vous aidons", type: "text", optional: true },
      yn("asd-enfants", "Le ménage a-t-il des enfants de moins de 21 ans ?"),
      yn("asd-handicap", "Un membre du ménage est-il en situation de handicap ?"),
    ],
    rules: { "livret-famille": (a) => yes(a, "asd-enfants"), "carte-handicap": (a) => yes(a, "asd-handicap") },
    covers: { "identifiant-rnp-rsu": (a) => str(a, "asd-ids") || undefined, telephone: (_a, c) => c.phone || undefined },
  },
  {
    key: "part-logement",
    fields: [
      { id: "l-promoteur", label: "Nom du promoteur", type: "text" },
      { id: "l-adresse", label: "Adresse du logement", type: "text" },
      { id: "l-prix", label: "Prix TTC du logement (DH)", hint: "700 000 DH TTC au plus", type: "number" },
      yn("l-indivision", "Détenez-vous une part d'un logement reçu en héritage ?"),
    ],
    rules: { "justif-indivision": (a) => yes(a, "l-indivision") },
    covers: { "infos-logement": (a) => (str(a, "l-promoteur") ? `${str(a, "l-promoteur")}, ${str(a, "l-adresse")}, ${num(a, "l-prix").toLocaleString("fr-FR")} DH TTC` : undefined), telephone: (_a, c) => c.phone || undefined },
  },
];

// ── Réponses déduites de la commande ────────────────────────────────────────
// Une création en cours veut dire « la société n'existe pas encore » ; une domiciliation commandée fixe le siège.
export const CREATION_FLAG = "_creation";
const CREATION_KEYS = ["auto", "sarlau", "sarl", "sas", "cooperative", "sa", "sci"];

export function withDefaults(serviceKeys: string[], a: QA): QA {
  const out: QA = { ...a };
  if (serviceKeys.some((k) => CREATION_KEYS.includes(k))) {
    out[CREATION_FLAG] = "oui";
    for (const id of ["k-existe", "a-existe", "h-existe", "kae-inscrit"]) out[id] = "non";
  }
  if (serviceKeys.includes("domiciliation")) out["soc-siege"] = "domi";
  return out;
}
const DEDUCED = (keys: string[]) => Object.keys(withDefaults(keys, {}));

export const INTAKE_BY_KEY: Record<string, ServiceIntake> = Object.fromEntries(
  INTAKE.map((s) => [s.key, { ...s, title: SERVICE_DOCS[s.key]?.title ?? s.key }]),
);

/** Démarches d'une commande, dans l'ordre de documents.ts. */
export function intakesForSpec(spec: DossierSpec): ServiceIntake[] {
  return docsForOrder(spec).map((g) => INTAKE_BY_KEY[g.key]).filter((s): s is ServiceIntake => !!s);
}

/** Champs à afficher pour une démarche (les questions déjà posées dans une démarche précédente ne sont pas répétées). */
export function visibleFields(services: ServiceIntake[], answers: QA): { service: ServiceIntake; fields: Field[] }[] {
  const keys = services.map((s) => s.key);
  const a = withDefaults(keys, answers);
  const seen = new Set<string>(DEDUCED(keys));
  return services.map((service) => {
    const fields = service.fields.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return !f.show || f.show(a);
    });
    return { service, fields };
  }).filter((x) => x.fields.length);
}

export function isFilled(f: Field, a: QA) {
  if (f.optional) return true;
  const v = a[f.id];
  if (f.type === "names3") return list(a, f.id).length >= 1;
  if (f.type === "persons") return persons(a, f.id).length >= (f.min ?? 1);
  return typeof v === "string" && v.trim().length > 0;
}

/** Règle d'une pièce pour une démarche : true = demandée, false = inutile, undefined = pas de règle. */
export function ruleFor(serviceKey: string, docId: string, a: QA): boolean | undefined {
  const r = INTAKE_BY_KEY[serviceKey]?.rules?.[docId];
  return r ? r(a) : undefined;
}

export function coverFor(serviceKey: string, docId: string, a: QA, c: Ctx): string | undefined {
  const fn = INTAKE_BY_KEY[serviceKey]?.covers?.[docId];
  return fn ? fn(a, c) : undefined;
}
