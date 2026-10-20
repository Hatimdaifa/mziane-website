// Source unique des offres, prix, packs et frais d'État de Mziane.
// Toutes les pages (tarifs, packs, questionnaire, commande) lisent ce fichier : ne jamais recopier un prix ailleurs.
// Entreprises : prix HT (TVA 20 % en sus). Auto-entrepreneurs et particuliers : prix TTC.

// ── Contact ─────────────────────────────────────────────────────────────────
export const CONTACT = {
  whatsapp: "33753345549",
  whatsappDisplay: "+33 7 53 34 55 49",
  email: "contact@mziane.com",
};

export function waLink(text?: string) {
  return `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function mailLink(subject: string, body?: string) {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}

// ── Formatage ───────────────────────────────────────────────────────────────
const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
export const fmt = (n: number) => nf.format(Math.round(n));
export const fmtDH = (n: number) => `${fmt(n)} DH`;

export const TVA = 0.2;

export type Tax = "HT" | "TTC";
export type Billing = "once" | "month" | "year";

export interface Offer {
  id: string;
  name: string;
  /** null = sur devis, ou prix exprimé par priceLabel */
  price: number | null;
  priceLabel?: string;
  billing: Billing;
  tax: Tax;
  pill: string;
  desc: string;
  features: string[];
  popular?: boolean;
}

// ── Frais d'État (reversés à l'administration, sans marge) ──────────────────
export interface FeeLine { label: string; amount: number; range?: string }

export const FRAIS_ETAT = {
  societe: {
    estimate: 1900,
    range: "1 600 à 2 400 DH",
    lines: [
      { label: "Certificat négatif OMPIC", amount: 230 },
      { label: "Registre de commerce (greffe)", amount: 350 },
      { label: "Annonce au journal d'annonces légales", amount: 750, range: "500 à 1 000" },
      { label: "Bulletin officiel", amount: 450, range: "400 à 600" },
      { label: "Timbres et légalisations", amount: 120, range: "100 à 250" },
    ] as FeeLine[],
    note: "Apports en argent exonérés de droits d'enregistrement à la constitution, taxe professionnelle exonérée 5 ans.",
  },
  autoEntrepreneur: {
    estimate: 0,
    note: "L'inscription au registre national de l'auto-entrepreneur est gratuite.",
  },
  /** Taxe OMPIC 2026, dépôt en ligne, TPE/PME, personnes physiques et auto-entrepreneurs (grille publiée sur ompic.ma). */
  marque: { premiereClasse: 1250, classeSup: 250 },
};

export const MARQUE_TAXE = `taxe OMPIC en sus, au réel : ${fmtDH(FRAIS_ETAT.marque.premiereClasse)} TTC pour la 1re classe puis ${fmtDH(FRAIS_ETAT.marque.classeSup)} par classe en plus (dépôt en ligne, TPE et particuliers)`;

// ── Création ────────────────────────────────────────────────────────────────
export type FormeId = "auto" | "sarlau" | "sarl" | "sas" | "cooperative" | "sa" | "sci";

export const FORMES: { id: FormeId; label: string; short: string; kind: "ae" | "societe" | "devis" }[] = [
  { id: "auto", label: "Auto-entrepreneur", short: "Auto-entrepreneur", kind: "ae" },
  { id: "sarlau", label: "SARL à associé unique", short: "SARLAU", kind: "societe" },
  { id: "sarl", label: "SARL", short: "SARL", kind: "societe" },
  { id: "sas", label: "SAS", short: "SAS", kind: "societe" },
  { id: "cooperative", label: "Coopérative", short: "Coopérative", kind: "societe" },
  { id: "sa", label: "Société anonyme", short: "SA", kind: "devis" },
  { id: "sci", label: "Société civile immobilière", short: "SCI", kind: "devis" },
];

export const creationAE: Offer[] = [
  { id: "ae-autonome", name: "Autonome", price: 0, billing: "once", tax: "TTC", pill: "Gratuit", desc: "Vous faites l'inscription vous-même avec notre guide.", features: ["Guide pas à pas", "Liste officielle des activités", "Modèles de factures", "Vérification de votre dossier"] },
  { id: "ae-accompagne", name: "Accompagné", price: 490, billing: "once", tax: "TTC", pill: "Paiement unique", desc: "On fait toute l'inscription pour vous.", features: ["Inscription faite par nous", "Affiliation CNSS / AMO", "Choix de l'activité et du taux", "Alerte sur les plafonds", "Suivi sur WhatsApp"], popular: true },
  { id: "ae-pro", name: "Pro", price: 990, billing: "once", tax: "TTC", pill: "Paiement unique", desc: "Inscription complète et présence en ligne.", features: ["Tout l'Accompagné", "Page web professionnelle", "Formation à la facturation", "Passage en SARLAU préparé"] },
];

export const creationSociete: Offer[] = [
  { id: "soc-essentiel", name: "Essentiel", price: 990, billing: "once", tax: "HT", pill: "Paiement unique", desc: "Votre société avec des statuts types.", features: ["Statuts types", "Certificat négatif OMPIC", "Dépôt au greffe et registre de commerce", "Identifiant commun (ICE)", "Inscriptions fiscales"] },
  { id: "soc-standard", name: "Standard", price: 1490, billing: "once", tax: "HT", pill: "Paiement unique", desc: "Des statuts sur mesure et un juriste dédié.", features: ["Tout l'Essentiel", "Statuts rédigés sur mesure", "Juriste dédié", "Dossier d'ouverture bancaire", "Suivi sur WhatsApp à chaque étape"], popular: true },
  { id: "soc-premium", name: "Premium", price: 2490, billing: "once", tax: "HT", pill: "Paiement unique", desc: "Tout est prêt pour démarrer le premier jour.", features: ["Tout le Standard", "Domiciliation 3 mois offerte", "Cachet de la société", "Registre des procès-verbaux", "Rendez-vous avec l'expert-comptable"] },
];

/** Prix des trois paliers selon la forme (Essentiel / Standard / Premium). */
export const PRIX_CREATION: Record<FormeId, [number, number, number] | null> = {
  auto: [0, 490, 990],
  sarlau: [990, 1490, 2490],
  sarl: [990, 1490, 2490],
  sas: [1490, 1990, 2990],
  cooperative: [1490, 1490, 1490],
  sa: null,
  sci: null,
};

// ── Comptabilité (mensuel HT) ───────────────────────────────────────────────
export const compta: Offer[] = [
  { id: "compta-declaratif", name: "Déclaratif", price: 190, billing: "month", tax: "HT", pill: "Auto-entrepreneur", desc: "Vos déclarations faites à l'heure, sans y penser.", features: ["Déclarations trimestrielles", "CNSS et AMO", "Registre des recettes tenu", "Alerte sur les plafonds", "Questions sur WhatsApp"] },
  { id: "compta-essentiel", name: "Essentiel", price: 690, billing: "month", tax: "HT", pill: "Société sans salarié", desc: "Pour la société qui démarre, chiffre d'affaires sous 500 000 DH.", features: ["Tenue comptable complète", "Déclarations TVA et IS", "Bilan et liasse fiscale inclus", "Rappel avant chaque échéance", "Questions illimitées"] },
  { id: "compta-business", name: "Business", price: 990, billing: "month", tax: "HT", pill: "Jusqu'à 5 salariés", desc: "Pour la société qui embauche.", features: ["Tout l'Essentiel", "Paie et déclarations CNSS jusqu'à 5 salariés", "IR sur salaires", "Taxe professionnelle", "Point trimestriel avec votre comptable"], popular: true },
  { id: "compta-premium", name: "Premium", price: 1790, billing: "month", tax: "HT", pill: "Jusqu'à 10 salariés", desc: "Pour piloter une entreprise qui grandit.", features: ["Tout le Business", "Paie jusqu'à 10 salariés", "Tableau de bord mensuel", "Prévisionnel de trésorerie", "Interlocuteur prioritaire"] },
];

export const COMPTA_EXTRAS = {
  bulletinPaie: 80,
  bilanSeul: 4990,
  annuel: "Payé à l'année : 10 mois payés pour 12.",
  /** Nombre de mois facturés quand la comptabilité est payée à l'année */
  annuelMoisPayes: 10,
};

export const comptaParForme = (forme: FormeId) => (forme === "auto" ? "compta-declaratif" : "compta-essentiel");

// ── Aides de l'État ─────────────────────────────────────────────────────────
export const aidesOffers: Offer[] = [
  { id: "aides-diagnostic", name: "Diagnostic", price: 0, billing: "once", tax: "HT", pill: "Gratuit et sans engagement", desc: "On repère les aides auxquelles vous avez droit.", features: ["Questionnaire de 2 minutes", "Appel avec un conseiller", "Liste des aides possibles", "Montants estimés"] },
  { id: "aides-dossier", name: "Dossier de A à Z", price: null, priceLabel: "10 à 4 %", billing: "once", tax: "HT", pill: "De l'aide versée, 0 DH si refus", desc: "On monte et suit votre dossier jusqu'au versement.", features: ["Vérification de chaque condition", "Liste précise des pièces", "Montage et dépôt du dossier", "Relances auprès de l'organisme", "Rien à payer si l'aide est refusée"], popular: true },
  { id: "aides-honneur", name: "Prêt d'honneur", price: 1490, billing: "once", tax: "HT", pill: "Payé seulement à l'accord", desc: "Prêts d'honneur à 0 % des réseaux d'entrepreneurs.", features: ["Business plan", "Dossier de candidature", "Préparation au comité", "Forfait fixe, pas de pourcentage"] },
];

/** Barème marginal sur le montant de l'aide effectivement versée. */
export const AIDES_BAREME: [number, number][] = [
  [50_000, 0.1],
  [200_000, 0.08],
  [1_000_000, 0.06],
  [Infinity, 0.04],
];
/** Petite aide : forfait fixe au lieu du pourcentage, payé aussi au versement. */
export const AIDES_PETITE = { seuil: 10_000, forfait: 200 };
export const AIDES_PETITE_TXT = `${fmtDH(AIDES_PETITE.forfait)} HT pour une aide de moins de ${fmtDH(AIDES_PETITE.seuil)}`;
export const AIDES_PLAFOND = 100_000;
export const AIDES_TAUX_AGRI = 0.05;

export type AideMode = "standard" | "agri" | "envol";

export function feeAide(amount: number, mode: AideMode = "standard") {
  if (amount <= 0) return 0;
  if (amount < AIDES_PETITE.seuil) return AIDES_PETITE.forfait;
  let fee = 0;
  if (mode === "standard") {
    let prev = 0;
    for (const [top, rate] of AIDES_BAREME) {
      if (amount <= prev) break;
      fee += (Math.min(amount, top) - prev) * rate;
      prev = top;
    }
  } else {
    fee = amount * AIDES_TAUX_AGRI;
  }
  return Math.min(AIDES_PLAFOND, fee);
}

// ── Domiciliation (mensuel HT, engagement 6 mois) ───────────────────────────
export const domiciliation: Offer[] = [
  { id: "domi-adresse", name: "Adresse", price: 250, billing: "month", tax: "HT", pill: "Engagement 6 mois", desc: "Le siège légal de votre société.", features: ["Adresse du siège", "Contrat de domiciliation", "Attestation pour le greffe"] },
  { id: "domi-business", name: "Business", price: 390, billing: "month", tax: "HT", pill: "Engagement 6 mois", desc: "Votre courrier suivi à distance.", features: ["Tout l'Adresse", "Courrier scanné", "Alerte WhatsApp à chaque courrier"], popular: true },
  { id: "domi-bureau", name: "Bureau", price: 690, billing: "month", tax: "HT", pill: "Engagement 6 mois", desc: "Pour recevoir vos clients.", features: ["Tout le Business", "Salle de réunion", "Accueil de vos rendez-vous"] },
];

// ── Formalités de société (honoraires HT, frais officiels en sus) ───────────
export const formalites: { id: string; label: string; price: number; detail?: string }[] = [
  { id: "gerant", label: "Changement de gérant", price: 1290 },
  { id: "siege", label: "Transfert de siège, même tribunal", price: 1490, detail: "1 990 DH vers un autre tribunal" },
  { id: "denomination", label: "Changement de dénomination", price: 1490 },
  { id: "parts", label: "Cession de parts", price: 1990, detail: "enregistrement exonéré avec l'attestation de non-prépondérance immobilière, sinon 5 %" },
  { id: "capital", label: "Augmentation ou réduction de capital", price: 1990 },
  { id: "objet", label: "Changement d'activité", price: 1290 },
  { id: "sommeil", label: "Mise en sommeil", price: 990 },
  { id: "fermer", label: "Dissolution et liquidation amiable", price: 3990, detail: "bilan de liquidation inclus pour nos clients compta" },
];
export const FORMALITE_SUPPLEMENT = "Opération en plus dans le même acte : + 50 %.";
/** Part du prix facturée pour chaque opération en plus dans le même acte (la plus chère est au prix plein). */
export const FORMALITE_SUPPLEMENT_TAUX = 0.5;

// ── Marque OMPIC (honoraires HT, taxe OMPIC en sus) ─────────────────────────
export const marque: Offer[] = [
  { id: "marque-simple", name: "Simple", price: 990, billing: "once", tax: "HT", pill: "1 classe", desc: "Votre marque déposée dans une classe.", features: ["Choix de la classe", "Dépôt à l'OMPIC", "Suivi jusqu'à l'enregistrement"] },
  { id: "marque-protection", name: "Protection", price: 1990, billing: "once", tax: "HT", pill: "Jusqu'à 3 classes", desc: "On vérifie avant de déposer.", features: ["Recherche d'antériorité", "Jusqu'à 3 classes", "Dépôt et suivi", "Réponse aux oppositions simples"], popular: true },
  { id: "marque-veille", name: "Protection + veille", price: 3490, billing: "once", tax: "HT", pill: "12 mois de veille", desc: "On surveille qu'on ne vous copie pas.", features: ["Tout le Protection", "Veille des dépôts similaires 12 mois", "Alerte en cas de risque"] },
];

// ── Site web (HT) ───────────────────────────────────────────────────────────
export const web: Offer[] = [
  { id: "web-page", name: "Page unique", price: 2490, billing: "once", tax: "HT", pill: "Livré en 7 jours", desc: "Une page claire qui donne envie de vous contacter.", features: ["Une page sur mesure", "Bouton WhatsApp et appel", "Nom de domaine .ma", "Adapté au mobile"] },
  { id: "web-vitrine", name: "Vitrine", price: 4990, billing: "once", tax: "HT", pill: "Livré en 15 jours", desc: "Le site complet d'une entreprise sérieuse.", features: ["5 pages", "Français et arabe", "Fiche Google de l'entreprise", "Formulaire de contact", "Adapté au mobile"], popular: true },
  { id: "web-pro", name: "Pro", price: 8990, billing: "once", tax: "HT", pill: "Livré en 30 jours", desc: "Pour être trouvé sur Google.", features: ["Tout le Vitrine", "Référencement Google", "Blog", "Trois langues"] },
];
export const HEBERGEMENT_AN = 990;

// ── MRE et étrangers (HT) ───────────────────────────────────────────────────
export const international: Offer[] = [
  { id: "intl-mre", name: "MRE", price: 2490, billing: "once", tax: "HT", pill: "Sans vous déplacer", desc: "Marocains résidant à l'étranger.", features: ["Choix du statut", "Procuration guidée", "Coordination bancaire", "Compte en dirhams convertibles", "Appel vidéo le soir ou le samedi"], popular: true },
  { id: "intl-etranger", name: "International", price: 3990, billing: "once", tax: "HT", pill: "Non-résidents", desc: "Étrangers qui investissent au Maroc.", features: ["Tout le MRE", "Procurations et apostilles", "Régime de convertibilité", "Accompagnement bancaire complet"] },
  { id: "intl-zai", name: "ZAI et CFC", price: null, priceLabel: "Sur devis", billing: "once", tax: "HT", pill: "Étude d'éligibilité", desc: "Zones d'accélération industrielle et Casablanca Finance City.", features: ["Étude d'éligibilité", "Dossier complet", "Avantages fiscaux", "Suivi réglementaire"] },
];

// ── Particuliers (TTC) ──────────────────────────────────────────────────────
export const particuliers: Offer[] = [
  { id: "part-guide", name: "Guides", price: 0, billing: "once", tax: "TTC", pill: "En libre accès", desc: "Toutes nos fiches d'aides, gratuites.", features: ["Conditions et montants", "Pièces à fournir", "Démarches pas à pas"] },
  { id: "part-asd", name: "Aide sociale directe", price: 0, billing: "once", tax: "TTC", pill: "Aucun honoraire", desc: "On vérifie votre dossier RSU gratuitement.", features: ["Vérification de l'éligibilité", "Aide à l'inscription au RSU", "Aucun frais, jamais"] },
  { id: "part-logement", name: "Aide au logement", price: 1490, billing: "once", tax: "TTC", pill: "Payé à l'obtention", desc: "Votre dossier d'aide directe au logement.", features: ["Vérification des conditions", "Dossier complet", "Suivi jusqu'à la décision", "Rien à payer si refus"], popular: true },
];

// ── Packs ───────────────────────────────────────────────────────────────────
export type Profil = "societe" | "auto" | "aides" | "agri" | "mre";

export interface PackItem { label: string; value: number; offered?: boolean; note?: string }

export interface Pack {
  id: string;
  name: string;
  audience: string;
  profils: Profil[];
  /** Prix mensuel HT sur la durée d'engagement */
  monthly?: number;
  months?: number;
  /** Prix payé d'avance pour la durée complète */
  upfront?: number;
  /** Prix unique (pack sans mensualité) */
  once?: number;
  /** Paiement du prix unique en plusieurs fois sans frais */
  installments?: number;
  tax: Tax;
  items: PackItem[];
  freebie?: string;
  extra?: string;
  conditions: string;
  popular?: boolean;
  /** Formes juridiques compatibles */
  formes?: FormeId[];
}

export const packs: Pack[] = [
  {
    id: "lancement",
    name: "Lancement",
    audience: "SARLAU ou SARL qui démarre",
    profils: ["societe"],
    monthly: 990, months: 12, upfront: 9900, tax: "HT",
    items: [
      { label: "Création Standard", value: 1490, offered: true },
      { label: "Site vitrine 5 pages", value: 4990 },
      { label: "Comptabilité Essentiel 12 mois", value: 690 * 12 },
      { label: "Hébergement et domaine, 1re année", value: HEBERGEMENT_AN },
    ],
    freebie: "Création offerte",
    conditions: "Engagement 12 mois. La comptabilité n'est facturée qu'à partir de l'obtention du registre de commerce. En cas d'arrêt anticipé, la remise est due au prorata des mois restants.",
    popular: true,
    formes: ["sarlau", "sarl"],
  },
  {
    id: "lancement-equipe",
    name: "Lancement Équipe",
    audience: "Société qui embauche dès le départ",
    profils: ["societe"],
    monthly: 1290, months: 12, upfront: 12900, tax: "HT",
    items: [
      { label: "Création Standard", value: 1490, offered: true },
      { label: "Site vitrine 5 pages", value: 4990 },
      { label: "Comptabilité Business 12 mois (paie jusqu'à 5 salariés)", value: 990 * 12 },
      { label: "Hébergement et domaine, 1re année", value: HEBERGEMENT_AN },
    ],
    freebie: "Création offerte",
    conditions: "Engagement 12 mois. Comptabilité facturée à partir du registre de commerce. En cas d'arrêt anticipé, la remise est due au prorata des mois restants.",
    formes: ["sarlau", "sarl", "sas"],
  },
  {
    id: "demarrage",
    name: "Démarrage",
    audience: "Auto-entrepreneur",
    profils: ["auto"],
    monthly: 250, months: 12, upfront: 2500, tax: "TTC",
    items: [
      { label: "Inscription accompagnée", value: 490, offered: true },
      { label: "Page web unique", value: 2490 },
      { label: "Comptabilité Déclaratif 12 mois", value: 190 * 12 },
      { label: "Hébergement et domaine, 1re année", value: HEBERGEMENT_AN },
    ],
    freebie: "Inscription offerte",
    conditions: "Engagement 12 mois. En cas d'arrêt anticipé, la remise est due au prorata des mois restants.",
    formes: ["auto"],
  },
  {
    id: "envol",
    name: "Envol",
    audience: "Créateur qui veut une aide de l'État",
    profils: ["societe", "aides"],
    monthly: 990, months: 12, tax: "HT",
    items: [
      { label: "Création Standard", value: 1490, offered: true },
      { label: "Business plan et dossier prime TPME ou prêt d'honneur à 0 %", value: 2990, offered: true },
      { label: "Comptabilité Business 12 mois", value: 990 * 12 },
    ],
    freebie: "Création et business plan offerts",
    extra: "Honoraires sur l'aide obtenue réduits à 5 %, 0 DH si refus",
    conditions: "Engagement 12 mois. Comptabilité facturée à partir du registre de commerce. Honoraires sur l'aide payés seulement au versement.",
    formes: ["sarlau", "sarl", "sas"],
  },
  {
    id: "diaspora",
    name: "Diaspora",
    audience: "MRE qui crée au Maroc à distance",
    profils: ["mre"],
    monthly: 1090, months: 12, upfront: 10900, tax: "HT",
    items: [
      { label: "Création MRE à distance", value: 2490, offered: true },
      { label: "Domiciliation Business 12 mois", value: 390 * 12 },
      { label: "Comptabilité Essentiel 12 mois", value: 690 * 12 },
    ],
    freebie: "Création offerte",
    conditions: "Engagement 12 mois. En cas d'arrêt anticipé, la remise est due au prorata des mois restants.",
    formes: ["sarlau", "sarl", "sas"],
  },
  {
    id: "identite",
    name: "Identité",
    audience: "Société qui veut protéger son nom et se montrer",
    profils: ["societe", "auto"],
    once: 5990, installments: 3, tax: "HT",
    items: [
      { label: "Marque Protection (jusqu'à 3 classes)", value: 1990 },
      { label: "Site vitrine 5 pages", value: 4990 },
    ],
    conditions: `Payable en 3 fois sans frais. ${MARQUE_TAXE.charAt(0).toUpperCase()}${MARQUE_TAXE.slice(1)}.`,
  },
];

export const packTerre = {
  id: "terre",
  name: "Terre",
  audience: "Agriculteur ou coopérative agricole",
  taux: AIDES_TAUX_AGRI,
  items: [
    "Diagnostic d'éligibilité gratuit",
    "Dossier de subvention irrigation (FDA) avec votre installateur",
    "Suivi jusqu'à la notification de paiement",
    "Option coopérative : création offerte avec la comptabilité de la coopérative à 490 DH HT par mois pendant 12 mois",
  ],
  conditions: "5 % de la subvention, minimum 990 DH, payés seulement à la notification de paiement du FDA. Rien à payer si refus.",
};

export const packValue = (p: Pack) => p.items.reduce((s, i) => s + i.value, 0);
export const packTotal = (p: Pack) => p.once ?? (p.monthly ?? 0) * (p.months ?? 0);
export const packSavings = (p: Pack) => packValue(p) - packTotal(p);
export const packSavingsUpfront = (p: Pack) => (p.upfront ? packValue(p) - p.upfront : packSavings(p));
export const packById = (id: string) => packs.find((p) => p.id === id);

// ── Options du configurateur et de la commande ──────────────────────────────
export interface AddOn { id: string; label: string; price: number; billing: Billing; tax: Tax; months?: number; hint?: string }

export const ADDONS: AddOn[] = [
  { id: "web-page", label: "Page web unique", price: 2490, billing: "once", tax: "HT" },
  { id: "web-vitrine", label: "Site vitrine 5 pages", price: 4990, billing: "once", tax: "HT" },
  { id: "hebergement", label: "Hébergement et domaine", price: HEBERGEMENT_AN, billing: "year", tax: "HT" },
  { id: "domi-business", label: "Domiciliation Business", price: 390, billing: "month", tax: "HT", months: 6, hint: "engagement 6 mois" },
  { id: "marque-protection", label: "Dépôt de marque Protection", price: 1990, billing: "once", tax: "HT", hint: "taxe OMPIC en sus" },
  { id: "aides-dossier", label: "Dossier d'aides de A à Z", price: 0, billing: "once", tax: "HT", hint: "10 à 4 % de l'aide versée, 0 DH si refus" },
];

/** Tous les services vendus à l'unité, pour retrouver une offre par son id. */
export const ALL_OFFERS: Offer[] = [
  ...creationAE, ...creationSociete, ...compta, ...aidesOffers, ...domiciliation, ...marque, ...web, ...international, ...particuliers,
];
export const offerById = (id: string) => ALL_OFFERS.find((o) => o.id === id);

export function priceText(o: Pick<Offer, "price" | "priceLabel" | "billing" | "tax">) {
  if (o.price === null) return o.priceLabel ?? "Sur devis";
  if (o.price === 0) return "Gratuit";
  const unit = o.billing === "month" ? " / mois" : o.billing === "year" ? " / an" : "";
  return `${fmtDH(o.price)} ${o.tax}${unit}`;
}

// ── Promesses affichées (à garder vraies) ───────────────────────────────────
export const PROMESSES = {
  societePrivee: "Mziane est une société privée, indépendante de l'administration. Les organismes publics instruisent les demandes d'aide gratuitement.",
  sansInteret: "Nous n'accompagnons que des aides sans intérêt : subventions, primes, exonérations et prêts d'honneur à 0 %.",
  zeroRefus: "Sur les aides, vous ne payez rien si l'aide est refusée.",
  paiement: "Après votre commande, un conseiller vous confirme tout et vous envoie le lien de paiement : carte bancaire, virement ou espèces (Cash Plus, Wafacash).",
};
