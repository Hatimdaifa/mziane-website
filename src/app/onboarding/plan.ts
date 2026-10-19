// Plan Mziane : à partir des réponses, trois choix (formule seule, pack recommandé, option haute).
// Les montants sont calculés par le modèle de commande, donc identiques à ceux de /commande.
import {
  ADDONS, AIDES_TAUX_AGRI, aidesOffers, compta, fmt, fmtDH, formalites, offerById, packById, packSavings, packTerre, packValue, priceText,
  type FormeId,
} from "@/lib/offers";
import { commandeHref, compute, creationFor, formeLabel, isCreationOffer, parseSpec, resolveBase } from "@/components/order/model";
import { formeCreation, has, matchAides, one, type Answers } from "./questions";

export type Link = Parameters<typeof commandeHref>[0];

export interface PlanChoice {
  key: string;
  kicker: string;
  title: string;
  price: string;
  unit?: string;
  strike?: string;
  sub?: string;
  bullets: string[];
  freebie?: string;
  savings?: number;
  link: Link;
  /** L'aide de l'État est déjà comprise (pas besoin de l'option dossier d'aides) */
  aidesIncluded?: boolean;
  recommended?: boolean;
}

export interface Plan {
  reasons: string[];
  choices: PlanChoice[];
  aides: ReturnType<typeof matchAides>;
  note?: string;
}

// ── Lecture d'un lien de commande pour l'afficher en carte ──────────────────
function describe(link: Link) {
  const q = new URL(commandeHref(link), "https://x.invalid").searchParams;
  const spec = parseSpec(q);
  const base = resolveBase(spec);
  if (!base) return null;
  const forme = spec.forme;
  return { base, c: compute(base, forme, spec.opts, spec.mode ?? "mensuel"), spec };
}

const addonLabel = (id: string) => {
  const k = compta.find((c) => c.id === id);
  return ADDONS.find((a) => a.id === id)?.label ?? (k ? `Comptabilité ${k.name}` : id);
};

function packChoice(packId: string, forme: FormeId | undefined, opts: string[], kicker: string, title?: string): PlanChoice | null {
  const p = packById(packId);
  if (!p) return null;
  const link: Link = { pack: p.id, forme, opt: opts };
  const d = describe(link);
  const extras = d ? d.c.start.reduce((s, l) => s + (l.amount ?? 0), 0) : 0;
  const extraMonthly = d ? d.c.recurring.filter((r) => r.unit === "mois" && !r.label.startsWith("Pack ")).reduce((s, r) => s + r.amount, 0) : 0;
  const bullets = p.items.map((i) => (i.offered ? `${i.label} (offert)` : i.label));
  if (p.extra) bullets.push(p.extra);
  opts.filter((o) => o !== "aides-dossier").forEach((o) => bullets.push(`En plus : ${addonLabel(o)}`));
  if (opts.includes("aides-dossier")) bullets.push("Dossier d'aides, 0 DH si refus");
  return {
    key: `pack-${p.id}-${opts.join("-")}`,
    kicker,
    title: title ?? `Pack ${p.name}`,
    price: `${fmt(p.once ?? p.monthly ?? 0)} DH`,
    unit: `${p.tax}${p.monthly ? " / mois" : ""}`,
    strike: fmtDH(packValue(p)),
    sub: [
      p.monthly ? `Pendant ${p.months} mois${p.upfront ? `, ou ${fmtDH(p.upfront)} ${p.tax} payés d'avance` : ""}` : p.conditions.split(".")[0],
      extras > 0 && p.monthly ? `+ ${fmtDH(extras)} HT d'options au démarrage` : "",
      extraMonthly > 0 ? `+ ${fmtDH(extraMonthly)} HT / mois d'options` : "",
    ].filter(Boolean).join(". "),
    bullets,
    freebie: p.freebie,
    savings: packSavings(p) > 0 ? packSavings(p) : undefined,
    link,
    aidesIncluded: p.id === "envol" || opts.includes("aides-dossier"),
  };
}

function itemsChoice(link: Link, kicker: string, title?: string, bullets?: string[]): PlanChoice | null {
  const d = describe(link);
  if (!d) return null;
  const { c, base } = d;
  const start = c.startHT + c.startTTCnoVat;
  const monthly = c.recurring.filter((r) => r.unit === "mois").reduce((s, r) => s + r.amount, 0);
  const tax = c.startTTCnoVat > 0 && c.startHT === 0 ? "TTC" : "HT";
  const success = c.success[0];
  let price = "Gratuit";
  let unit: string | undefined;
  let sub: string | undefined;
  if (c.hasQuote && start === 0) price = "Sur devis";
  else if (start > 0) { price = `${fmt(start)} DH`; unit = tax; if (monthly) sub = `Puis ${fmtDH(monthly)} HT / mois`; }
  else if (monthly > 0) { price = `${fmt(monthly)} DH`; unit = "HT / mois"; }
  const offer = base.kind === "items" ? base.offer : undefined;
  if (start === 0 && monthly === 0 && success) {
    if (offer?.price) { price = `${fmt(offer.price)} DH`; unit = `${offer.tax}, si accord`; }
    else { price = "0 DH"; unit = "si refus"; }
  }
  if (success && !sub) sub = success.text;
  const opts = (link.opt ?? []).filter((o) => o !== "aides-dossier");
  const list = bullets ?? [
    ...(offer && isCreationOffer(offer.id) && link.forme ? creationFor(offer.id, link.forme as FormeId).offer.features : offer?.features ?? []),
    ...(base.kind === "items" ? base.formalites.map((f) => `${f.label} : ${fmtDH(c.start.find((l) => l.label === f.label)?.amount ?? f.price)} HT`) : []),
    ...opts.map((o) => `En plus : ${addonLabel(o)}`),
    ...(link.opt?.includes("aides-dossier") ? ["Dossier d'aides, 0 DH si refus"] : []),
  ];
  return {
    key: `items-${commandeHref(link)}`,
    kicker,
    title: title ?? c.title,
    price, unit, sub,
    bullets: list.slice(0, 7),
    link,
    aidesIncluded: !!offer?.id.startsWith("aides-") || !!offer?.id.startsWith("part-"),
  };
}

function terreChoice(kicker: string): PlanChoice {
  return {
    key: "terre", kicker, title: `Pack ${packTerre.name}`,
    price: `${Math.round(packTerre.taux * 100)} %`, unit: "de la subvention",
    sub: packTerre.conditions,
    bullets: packTerre.items,
    freebie: "0 DH si refus",
    link: { pack: packTerre.id },
    aidesIncluded: true,
  };
}

const compact = <T,>(l: (T | null | undefined | false)[]) => l.filter(Boolean) as T[];

function mark(choices: PlanChoice[], recommendedKey?: string) {
  const k = recommendedKey ?? choices[Math.min(1, choices.length - 1)]?.key;
  return choices.map((c) => ({ ...c, recommended: c.key === k }));
}

// ── Construction du plan ────────────────────────────────────────────────────
const TAUX_ENVOL = `${Math.round(AIDES_TAUX_AGRI * 100)} %`;
const BAREME = aidesOffers.find((o) => o.id === "aides-dossier")?.priceLabel ?? "";
const FORMALITE_IDS = new Set(formalites.map((f) => f.id));

export function buildPlan(a: Answers): Plan {
  const besoin = one(a, "besoin");
  const aides = matchAides(a);
  const reasons: string[] = [];
  let choices: PlanChoice[] = [];
  let note: string | undefined;
  const nAides = aides.length ? `${aides.length} aide${aides.length > 1 ? "s" : ""} de l'État correspond${aides.length > 1 ? "ent" : ""} à vos réponses, la liste est plus bas.` : "";

  const creation = (forme: FormeId, wantsAide: boolean, salaries: string | undefined, extraOpts: string[] = []) => {
    if (forme === "sa" || forme === "sci") {
      choices = mark(compact([itemsChoice({ offre: "soc-standard", forme, opt: extraOpts }, "Sur devis", `Création ${formeLabel(forme)}`)]));
      return;
    }
    const hasSal = !!salaries && salaries !== "non";
    // Auto-entrepreneur : le pack Démarrage (comptabilité Déclaratif), avec le dossier d'aides si demandé.
    // Le pack Envol comprend la comptabilité d'une société, il ne lui convient pas.
    const mid = forme === "auto" ? "demarrage" : wantsAide ? "envol" : hasSal || forme === "sas" ? "lancement-equipe" : "lancement";
    const midPack = packById(mid)!;
    const packOpts = [...extraOpts, ...(wantsAide && mid !== "envol" ? ["aides-dossier"] : [])];
    const low = itemsChoice({ offre: forme === "auto" ? "ae-accompagne" : "soc-standard", forme, opt: [...extraOpts, ...(wantsAide ? ["aides-dossier"] : [])] }, "Formule seule");
    const highOpts = (forme === "auto" ? ["marque-protection"] : ["marque-protection", "domi-business"]).filter((o) => !extraOpts.includes(o));
    const highTitle = `Pack ${midPack.name} + ${forme === "auto" ? "marque protégée" : "marque et domiciliation"}`;
    choices = mark(compact([
      low,
      packChoice(mid, forme, packOpts, "Recommandé pour vous"),
      packChoice(mid, forme, [...packOpts, ...highOpts], "Le plus complet", highTitle),
    ]), `pack-${mid}-${packOpts.join("-")}`);
    const s = packSavings(midPack);
    if (s > 0) reasons.push(`Le pack ${midPack.name} vous fait économiser ${fmtDH(s)} par rapport aux mêmes services pris séparément${midPack.freebie ? ` : ${midPack.freebie.toLowerCase()}` : ""}.`);
    if (wantsAide && mid === "demarrage") reasons.push(`Pour l'aide, le dossier de A à Z est ajouté : ${BAREME} de l'aide versée, payés seulement au versement, 0 DH si refus.`);
    if (mid === "envol") reasons.push(`Vous voulez une aide de l'État : le pack Envol offre le business plan et réduit nos honoraires sur l'aide à ${TAUX_ENVOL}, payés seulement au versement, 0 DH si refus.`);
    if (mid === "lancement-equipe" && !hasSal) reasons.push("Le pack Lancement Équipe est le pack prévu pour une SAS, avec la paie déjà comprise si vous recrutez.");
    if (hasSal && mid !== "envol") reasons.push("Vous prévoyez de recruter : la paie jusqu'à 5 salariés est comprise dans la comptabilité Business du pack.");
    if (salaries === "5plus") {
      const prem = compta.find((c) => c.id === "compta-premium");
      if (prem) note = `Au-delà de 5 salariés, la comptabilité ${prem.name} couvre jusqu'à 10 salariés (${priceText(prem)}) : votre conseiller l'ajuste avec vous.`;
    }
  };

  if (besoin === "creer") {
    const forme = formeCreation(a);
    const ca = one(a, "c-ca");
    const formeReason: Record<string, string> = {
      auto: "Vous démarrez seul avec un chiffre d'affaires sous le plafond : le statut auto-entrepreneur est le plus simple et le moins cher.",
      sarlau: ca === "nsp" ? "Vous ne connaissez pas encore votre chiffre d'affaires : la SARLAU vous protège et vous laisse grandir sans plafond." : "Seul, au-delà du plafond auto-entrepreneur : la SARLAU protège votre patrimoine personnel.",
      sarl: "Vous créez entre associés : la SARL est la forme la plus courante, avec une responsabilité limitée aux apports.",
      sas: "Vous accueillez des investisseurs : la SAS facilite leur entrée au capital.",
      sa: "Pour un grand projet avec plusieurs actionnaires, la SA est adaptée. Elle se fait sur devis.",
      sci: "Pour détenir un bien immobilier, la SCI est adaptée. Elle se fait sur devis.",
    };
    reasons.push(formeReason[forme]);
    const aide = one(a, "c-aide");
    creation(forme, !!aide && aide !== "non", one(a, "c-salaries"));
    if (nAides) reasons.push(nAides);
  } else if (besoin === "aides") {
    const profil = one(a, "a-profil");
    const coop = one(a, "coop-secteur");
    if (profil === "agri" || (profil === "coop" && coop === "agricole")) {
      choices = mark(compact([itemsChoice({ offre: "aides-diagnostic" }, "Pour commencer"), terreChoice("Recommandé pour vous")]), "terre");
      reasons.push(`Pour l'agriculture, nos honoraires sont de ${Math.round(packTerre.taux * 100)} % de la subvention, minimum ${fmtDH(packTerre.min)}, payés seulement à la notification de paiement.`);
    } else if (profil === "porteur") {
      choices = mark(compact([
        itemsChoice({ offre: "aides-dossier" }, "Formule seule", "Dossier d'aides seul"),
        packChoice("envol", "sarlau", [], "Recommandé pour vous"),
        packChoice("envol", "sarlau", ["marque-protection", "domi-business"], "Le plus complet", "Pack Envol + marque et domiciliation"),
      ]), "pack-envol-");
      reasons.push(`Vous voulez créer avec une aide : le pack Envol crée votre société, offre le business plan et réduit nos honoraires sur l'aide à ${TAUX_ENVOL}.`);
    } else if (profil === "particulier") {
      choices = mark(compact([
        has(a, "part-situation", "modeste") && itemsChoice({ offre: "part-asd" }, "Gratuit"),
        has(a, "part-situation", "logement") && itemsChoice({ offre: "part-logement" }, "Recommandé pour vous"),
      ]));
      if (!choices.length) choices = mark(compact([itemsChoice({ offre: "aides-diagnostic" }, "Pour commencer")]));
      reasons.push("Pour les aides aux particuliers, nos guides sont gratuits et la vérification du dossier RSU ne coûte rien.");
    } else {
      choices = mark(compact([
        itemsChoice({ offre: "aides-diagnostic" }, "Pour commencer"),
        itemsChoice({ offre: "aides-dossier" }, "Recommandé pour vous"),
      ]), undefined);
      reasons.push(`Vous ne payez nos honoraires que si l'aide est versée : ${BAREME} du montant, 0 DH si refus.`);
    }
    if (nAides) reasons.unshift(nAides);
  } else if (besoin === "gerer") {
    const actions = a["g-action"] ?? [];
    const gf = one(a, "g-forme");
    const forme = ({ sarlau: "sarlau", sarl: "sarl", sa: "sas", ae: "auto" } as Record<string, FormeId>)[gf ?? ""];
    const opts = [...(actions.includes("marque") ? ["marque-protection"] : []), ...(actions.includes("domiciliation") && gf !== "ae" ? ["domi-business"] : [])];
    const formal = actions.filter((x) => FORMALITE_IDS.has(x));
    if (gf === "creation") {
      reasons.push("Votre société n'est pas encore créée : on commence par la création, puis vos démarches suivent.");
      creation("sarlau", false, undefined, opts);
    } else if (formal.length) {
      choices = mark(compact([itemsChoice({ formalite: formal, forme, opt: opts }, "Votre devis", formal.length === 1 ? undefined : "Vos formalités")]));
      reasons.push("Nos honoraires sont des prix fixes, annoncés d'avance. Les frais officiels sont reversés au réel, sans marge.");
    } else if (actions.includes("marque")) {
      const rest = opts.filter((o) => o !== "marque-protection");
      choices = mark(compact(["marque-simple", "marque-protection", "marque-veille"].map((id, i) => itemsChoice({ offre: id, forme, opt: rest }, ["Formule seule", "Recommandé pour vous", "Le plus complet"][i]))));
      reasons.push("La recherche d'antériorité vérifie qu'une marque proche n'existe pas déjà avant de payer la taxe OMPIC.");
    } else {
      choices = mark(compact(["domi-adresse", "domi-business", "domi-bureau"].map((id, i) => itemsChoice({ offre: id, forme }, ["Formule seule", "Recommandé pour vous", "Le plus complet"][i]))));
      reasons.push("Avec la formule Business, votre courrier est scanné et vous êtes prévenu sur WhatsApp à chaque arrivée.");
    }
  } else if (besoin === "compta") {
    const kf = one(a, "k-forme");
    const sal = one(a, "k-salaries");
    if (kf === "ae") {
      choices = mark(compact([itemsChoice({ offre: "compta-declaratif", forme: "auto" }, "Recommandé pour vous")]));
      reasons.push("En auto-entrepreneur, il suffit de déclarer votre chiffre d'affaires chaque trimestre : on le fait pour vous.");
    } else {
      const rec = sal === "5plus" ? "compta-premium" : sal === "1-5" || kf === "multi" ? "compta-business" : "compta-essentiel";
      const ids = ["compta-essentiel", "compta-business", "compta-premium"];
      choices = ids.map((id, i) => itemsChoice({ offre: id, forme: kf === "societe" ? "sarlau" : undefined }, id === rec ? "Recommandé pour vous" : ["Pour démarrer", "Pour embaucher", "Pour grandir"][i])).filter((x): x is PlanChoice => !!x);
      choices = mark(choices, choices[ids.indexOf(rec)]?.key);
      const recOffer = offerById(rec);
      if (recOffer) reasons.push(`${recOffer.pill} : la formule ${recOffer.name} correspond à votre situation.`);
      if (kf === "multi") note = "Pour plusieurs sociétés, votre conseiller vous fait un devis adapté.";
    }
    if (kf !== "ae") reasons.push("Bilan, liasse fiscale et déclarations TVA et IS sont compris dans chaque formule.");
  } else if (besoin === "etranger") {
    const s = one(a, "x-situation");
    if (s === "zai") {
      choices = mark(compact([itemsChoice({ offre: "intl-zai" }, "Étude d'éligibilité")]));
      reasons.push("Les avantages des zones d'accélération industrielle et de Casablanca Finance City dépendent de votre projet : on étudie d'abord votre éligibilité.");
    } else if (s === "mre") {
      choices = mark(compact([
        itemsChoice({ offre: "intl-mre", forme: "sarlau" }, "Formule seule"),
        packChoice("diaspora", "sarlau", [], "Recommandé pour vous"),
        packChoice("diaspora", "sarlau", ["web-vitrine", "marque-protection"], "Le plus complet", "Pack Diaspora + site et marque"),
      ]), "pack-diaspora-");
      const p = packById("diaspora");
      reasons.push("Tout se fait à distance, avec une procuration guidée et des appels vidéo le soir ou le samedi.");
      if (p && packSavings(p) > 0) reasons.push(`Le pack Diaspora vous fait économiser ${fmtDH(packSavings(p))} : création offerte, domiciliation et comptabilité comprises.`);
    } else {
      choices = mark(compact([
        itemsChoice({ offre: "intl-etranger", forme: "sarlau" }, "Formule seule"),
        itemsChoice({ offre: "intl-etranger", forme: "sarlau", opt: ["compta-essentiel", "domi-business"] }, "Recommandé pour vous", "International + gestion sur place"),
        itemsChoice({ offre: "intl-etranger", forme: "sarlau", opt: ["compta-essentiel", "domi-business", "web-vitrine", "marque-protection"] }, "Le plus complet", "International + gestion, site et marque"),
      ]));
      reasons.push("Procurations, apostilles et régime de convertibilité sont gérés pour vous, sans vous déplacer.");
      reasons.push("Domiciliation et comptabilité sur place : votre société reste en règle pendant que vous êtes à l'étranger.");
    }
    if (nAides) reasons.push(nAides);
  }

  return { reasons: reasons.filter(Boolean).slice(0, 3), choices, aides, note };
}
