// Modèle de la commande : lecture des paramètres d'URL, lignes, totaux et message WhatsApp.
// Aucun prix ici : tout vient de src/lib/offers.ts.
import {
  ADDONS, AIDES_PETITE_TXT, AIDES_PLAFOND, COMPTA_EXTRAS, FORMALITE_SUPPLEMENT, FORMALITE_SUPPLEMENT_TAUX, FORMES, FRAIS_ETAT, PRIX_CREATION, TVA,
  compta, comptaParForme, creationAE, creationSociete, fmtDH, formalites, offerById, packById, packSavingsUpfront, packTerre,
  packTotal, packValue, type AddOn, type FormeId, type Offer, type Pack, type Tax,
} from "@/lib/offers";

// ── Paramètres d'URL ────────────────────────────────────────────────────────
// /commande?pack=<id> | ?offre=<id> | ?formalite=<id,id>
//   &forme=<FormeId> &opt=<addon ou compta id, séparés par des virgules> &aides=1 &paiement=avance|mensuel|3fois
export type PayMode = "avance" | "mensuel" | "3fois";
const PAY_MODES: PayMode[] = ["avance", "mensuel", "3fois"];

export interface OrderSpec {
  packId?: string;
  offreId?: string;
  formalites: string[];
  forme?: FormeId;
  opts: string[];
  mode?: PayMode;
}

interface ParamReader { get(name: string): string | null }

const list = (v: string | null) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const isForme = (v: string | null | undefined): v is FormeId => !!v && FORMES.some((f) => f.id === v);

export function parseSpec(sp: ParamReader): OrderSpec {
  const opts = list(sp.get("opt"));
  if (sp.get("aides") === "1" && !opts.includes("aides-dossier")) opts.push("aides-dossier");
  const paiement = sp.get("paiement");
  return {
    packId: sp.get("pack") ?? undefined,
    offreId: sp.get("offre") ?? undefined,
    formalites: list(sp.get("formalite")).filter((id) => formalites.some((f) => f.id === id)),
    forme: isForme(sp.get("forme")) ? (sp.get("forme") as FormeId) : undefined,
    opts,
    mode: PAY_MODES.includes(paiement as PayMode) ? (paiement as PayMode) : undefined,
  };
}

/** Construit l'URL de /commande (utilisée par le questionnaire et les suggestions). */
export function commandeHref(p: { pack?: string; offre?: string; formalite?: string[]; forme?: string; opt?: string[]; aides?: boolean; paiement?: PayMode }) {
  const q = new URLSearchParams();
  if (p.pack) q.set("pack", p.pack);
  if (p.offre) q.set("offre", p.offre);
  if (p.formalite?.length) q.set("formalite", p.formalite.join(","));
  if (p.forme) q.set("forme", p.forme);
  const opt = (p.opt ?? []).filter((o) => o !== "aides-dossier");
  if (opt.length) q.set("opt", opt.join(","));
  if (p.aides || p.opt?.includes("aides-dossier")) q.set("aides", "1");
  if (p.paiement) q.set("paiement", p.paiement);
  // Les virgules restent lisibles dans l'URL
  return `/commande?${q.toString().replace(/%2C/g, ",")}`;
}

// ── Base de la commande ─────────────────────────────────────────────────────
export type Formalite = (typeof formalites)[number];

export type Base =
  | { kind: "pack"; pack: Pack }
  | { kind: "terre" }
  | { kind: "items"; offer?: Offer; formalites: Formalite[] };

export function resolveBase(spec: OrderSpec): Base | null {
  if (spec.packId === packTerre.id) return { kind: "terre" };
  const pack = spec.packId ? packById(spec.packId) : undefined;
  if (pack) return { kind: "pack", pack };
  const offer = spec.offreId ? offerById(spec.offreId) : undefined;
  const fs = spec.formalites.map((id) => formalites.find((f) => f.id === id)).filter((f): f is Formalite => !!f);
  if (offer || fs.length) return { kind: "items", offer, formalites: fs };
  return null;
}

export const baseKey = (b: Base) =>
  b.kind === "pack" ? `pack:${b.pack.id}` : b.kind === "terre" ? "pack:terre" : `items:${b.offer?.id ?? ""}:${b.formalites.map((f) => f.id).join(",")}`;

// ── Création : prix selon la forme ──────────────────────────────────────────
const isCreationAE = (id?: string) => !!id && creationAE.some((o) => o.id === id);
const isCreationSoc = (id?: string) => !!id && creationSociete.some((o) => o.id === id);
export const isCreationOffer = (id?: string) => isCreationAE(id) || isCreationSoc(id);
const isComptaId = (id: string) => compta.some((o) => o.id === id);
const isIntlCreation = (id?: string) => id === "intl-mre" || id === "intl-etranger";

/** Offre de création équivalente pour la forme choisie, et son prix (null = sur devis). */
export function creationFor(offerId: string, forme: FormeId): { offer: Offer; price: number | null } {
  const idx = Math.max(0, isCreationAE(offerId) ? creationAE.findIndex((o) => o.id === offerId) : creationSociete.findIndex((o) => o.id === offerId));
  const offer = (forme === "auto" ? creationAE : creationSociete)[idx];
  const prices = PRIX_CREATION[forme];
  // Prix unique pour toutes les formules (coopérative) : une seule formule, la Standard
  if (prices && prices.every((p) => p === prices[0])) return { offer: creationSociete[1], price: prices[1] };
  return { offer, price: prices ? prices[idx] : null };
}

export const formeLabel = (f?: FormeId) => FORMES.find((x) => x.id === f)?.short ?? "";

/** Formes proposées dans le sélecteur, et forme par défaut. */
export function formeChoices(base: Base): FormeId[] {
  if (base.kind === "pack") return base.pack.formes ?? [];
  if (base.kind === "items" && base.offer) {
    if (isCreationOffer(base.offer.id)) return FORMES.map((f) => f.id);
    if (isIntlCreation(base.offer.id)) return FORMES.filter((f) => f.kind === "societe" && f.id !== "cooperative").map((f) => f.id);
  }
  return [];
}

export function defaultForme(base: Base, wanted?: FormeId): FormeId | undefined {
  const choices = formeChoices(base);
  if (!choices.length) return wanted;
  if (wanted && choices.includes(wanted)) return wanted;
  if (base.kind === "items" && isCreationAE(base.offer?.id)) return "auto";
  return choices.includes("sarlau") ? "sarlau" : choices[0];
}

// ── Mode de paiement ────────────────────────────────────────────────────────
export interface PayChoice { mode: PayMode; title: string; price: string; hint: string }

/** Échéances d'un prix payé en plusieurs fois : la première absorbe l'arrondi. */
export function splitInstallments(total: number, n: number) {
  const next = Math.floor(total / n);
  return { first: total - next * (n - 1), next };
}

/** Modes de paiement proposés pour cette commande (le premier est celui par défaut). */
export function payChoices(base: Base): PayChoice[] {
  if (base.kind === "pack") {
    const p = base.pack;
    if (p.monthly && p.upfront) {
      const gain = packTotal(p) - p.upfront;
      const months = Math.round(gain / p.monthly);
      return [
        { mode: "mensuel", title: "Chaque mois", price: `${fmtDH(p.monthly)} ${p.tax} / mois pendant ${p.months} mois`, hint: "Rien à payer sur le pack avant le démarrage." },
        { mode: "avance", title: "D'avance", price: `${fmtDH(p.upfront)} ${p.tax} en une fois`, hint: gain > 0 ? `${fmtDH(gain)} de moins${months > 0 ? `, soit ${months} mois offerts` : ""}. Économie totale ${fmtDH(packSavingsUpfront(p))}.` : "" },
      ];
    }
    if (p.once != null && p.installments) {
      const { first, next } = splitInstallments(p.once, p.installments);
      return [
        { mode: "avance", title: "En une fois", price: `${fmtDH(p.once)} ${p.tax}`, hint: "Réglé au démarrage." },
        { mode: "3fois", title: `En ${p.installments} fois sans frais`, price: `${fmtDH(first)} puis ${p.installments - 1} x ${fmtDH(next)} ${p.tax}`, hint: "Première échéance au démarrage, puis une par mois. Même prix total." },
      ];
    }
  }
  if (base.kind === "items" && base.offer && isComptaId(base.offer.id) && base.offer.price) {
    const o = base.offer;
    const paid = COMPTA_EXTRAS.annuelMoisPayes;
    return [
      { mode: "mensuel", title: "Chaque mois", price: `${fmtDH(o.price!)} ${o.tax} / mois`, hint: "Facturé chaque mois." },
      { mode: "avance", title: "À l'année", price: `${fmtDH(o.price! * paid)} ${o.tax} pour 12 mois`, hint: `${paid} mois payés pour 12, soit ${fmtDH(o.price! * (12 - paid))} de moins.` },
    ];
  }
  return [];
}

export function defaultMode(base: Base, wanted?: PayMode): PayMode {
  const choices = payChoices(base);
  if (wanted && choices.some((c) => c.mode === wanted)) return wanted;
  return choices[0]?.mode ?? "mensuel";
}

// ── Options ─────────────────────────────────────────────────────────────────
/** Services déjà compris dans chaque pack ("compta" = toute formule de comptabilité). */
const PACK_INCLUDES: Record<string, string[]> = {
  lancement: ["web-page", "web-vitrine", "hebergement", "compta"],
  "lancement-equipe": ["web-page", "web-vitrine", "hebergement", "compta"],
  demarrage: ["web-page", "web-vitrine", "hebergement", "compta"],
  envol: ["aides-dossier", "compta"],
  diaspora: ["domi-business", "compta"],
  identite: ["web-page", "web-vitrine", "marque-protection"],
};

export const WEB_IDS = ["web-page", "web-vitrine"];

export interface OptionDef extends AddOn { kind: "addon" | "compta" }

/** Options proposées pour cette commande. */
export function availableOptions(base: Base, forme: FormeId | undefined, wantedCompta?: string): OptionDef[] {
  if (base.kind === "terre") return [];
  const hide = new Set<string>();
  let comptaOpt: OptionDef | null = null;

  if (base.kind === "pack") {
    (PACK_INCLUDES[base.pack.id] ?? []).forEach((id) => hide.add(id));
  } else {
    const id = base.offer?.id ?? "";
    if (id.startsWith("part-")) return [];
    if (id.startsWith("web-")) WEB_IDS.forEach((w) => hide.add(w));
    if (id.startsWith("domi-")) hide.add("domi-business");
    if (id.startsWith("marque-")) hide.add("marque-protection");
    if (id === "aides-dossier" || id === "aides-honneur") hide.add("aides-dossier");
    // Comptabilité proposée en option quand on crée une structure
    if (isCreationOffer(id) || isIntlCreation(id)) {
      const cid = wantedCompta && isComptaId(wantedCompta) ? wantedCompta : comptaParForme(forme ?? "sarlau");
      const c = compta.find((o) => o.id === cid)!;
      comptaOpt = { id: c.id, label: `Comptabilité ${c.name}`, price: c.price ?? 0, billing: "month", tax: c.tax, hint: c.desc, kind: "compta" };
    }
  }
  if (forme === "auto") hide.add("domi-business");
  const addons: OptionDef[] = ADDONS.filter((a) => !hide.has(a.id)).map((a) => ({ ...a, kind: "addon" }));
  return comptaOpt ? [comptaOpt, ...addons] : addons;
}

// ── Lignes et totaux ────────────────────────────────────────────────────────
export interface StartLine { label: string; amount: number | null; tax: Tax; strike?: number; note?: string }
export interface RecurringLine { label: string; amount: number; tax: Tax; unit: "mois" | "an"; months?: number; from: string }
export interface SuccessLine { label: string; text: string }
export interface FeeLine { label: string; amount: number | null; note: string }

export interface Computed {
  title: string;
  start: StartLine[];
  recurring: RecurringLine[];
  success: SuccessLine[];
  fees: FeeLine[];
  startHT: number;
  startTTCnoVat: number;
  tva: number;
  feesTotal: number;
  startTotal: number;
  hasQuote: boolean;
  engagement: string[];
  notes: string[];
  feesKind: "societe" | "auto" | null;
}

export function packStartText(pack: Pack, forme?: FormeId) {
  if (forme === "auto") return "à partir de votre inscription";
  if (pack.conditions.includes("registre de commerce")) return "à partir de l'obtention du registre de commerce";
  return "à partir du démarrage de votre accompagnement";
}

const aidesSuccessText = (label: string) =>
  `${label}, ${AIDES_PETITE_TXT}, plafonné à ${fmtDH(AIDES_PLAFOND)}. Payé seulement au versement, 0 DH si refus.`;

export function compute(base: Base, forme: FormeId | undefined, opts: string[], mode: PayMode): Computed {
  const start: StartLine[] = [];
  const recurring: RecurringLine[] = [];
  const success: SuccessLine[] = [];
  const fees: FeeLine[] = [];
  const engagement: string[] = [];
  const notes: string[] = [];
  let title = "";
  let creation = false;
  let marqueFee = false;

  if (base.kind === "terre") {
    title = `Pack ${packTerre.name}`;
    start.push({ label: "Diagnostic d'éligibilité", amount: 0, tax: "HT" });
    success.push({ label: `Pack ${packTerre.name}`, text: packTerre.conditions });
  } else if (base.kind === "pack") {
    const p = base.pack;
    title = `Pack ${p.name}`;
    creation = p.id !== "identite";
    marqueFee = p.id === "identite";
    if (p.once != null && p.installments && mode === "3fois") {
      const { first, next } = splitInstallments(p.once, p.installments);
      start.push({ label: `Pack ${p.name}, 1re échéance sur ${p.installments}`, amount: first, tax: p.tax, note: `prix total ${fmtDH(p.once)} ${p.tax}` });
      recurring.push({ label: `Pack ${p.name}, échéances suivantes`, amount: next, tax: p.tax, unit: "mois", months: p.installments - 1, from: "à partir du mois suivant" });
    } else if (p.once != null) {
      start.push({ label: `Pack ${p.name}`, amount: p.once, tax: p.tax, strike: packValue(p) });
    } else if (p.monthly) {
      if (mode === "avance" && p.upfront) {
        start.push({ label: `Pack ${p.name}, ${p.months} mois payés d'avance`, amount: p.upfront, tax: p.tax, strike: packValue(p) });
      } else {
        recurring.push({ label: `Pack ${p.name}`, amount: p.monthly, tax: p.tax, unit: "mois", months: p.months, from: packStartText(p, forme) });
      }
      engagement.push(p.conditions);
    }
    if (p.extra) success.push({ label: "Aide de l'État", text: `${p.extra}.` });
    if (p.once != null) notes.push(p.conditions);
  } else {
    const o = base.offer;
    if (o) {
      if (isCreationOffer(o.id) && forme) {
        const { offer, price } = creationFor(o.id, forme);
        title = `Création ${formeLabel(forme)} ${offer.name}`;
        creation = true;
        start.push({ label: title, amount: price, tax: offer.tax, note: price === null ? "Sur devis" : undefined });
      } else {
        title = o.name === "MRE" ? "Création MRE à distance" : o.id.startsWith("compta-") ? `Comptabilité ${o.name}` : o.id.startsWith("domi-") ? `Domiciliation ${o.name}` : o.id.startsWith("marque-") ? `Marque ${o.name}` : o.id.startsWith("web-") ? `Site web ${o.name}` : o.name;
        creation = isIntlCreation(o.id);
        marqueFee = o.id.startsWith("marque-");
        if (o.id === "aides-dossier") {
          success.push({ label: "Dossier d'aides de A à Z", text: aidesSuccessText(`${o.priceLabel} de l'aide versée`) });
        } else if (o.id === "aides-honneur" || o.id === "part-logement") {
          success.push({ label: o.name, text: `${fmtDH(o.price ?? 0)} ${o.tax}, ${o.pill.toLowerCase()}. Rien à payer si refus.` });
        } else if (o.price === null) {
          start.push({ label: title, amount: null, tax: o.tax, note: o.priceLabel ?? "Sur devis" });
        } else if (o.billing === "month" && isComptaId(o.id) && mode === "avance") {
          const paid = COMPTA_EXTRAS.annuelMoisPayes;
          start.push({ label: `${title}, 12 mois payés à l'année`, amount: o.price * paid, tax: o.tax, strike: o.price * 12, note: `${paid} mois payés pour 12` });
        } else if (o.billing === "month") {
          const months = o.id.startsWith("domi-") ? 6 : undefined;
          recurring.push({ label: title, amount: o.price, tax: o.tax, unit: "mois", months, from: "à partir du début de la prise en charge" });
          if (months) engagement.push(`Domiciliation : engagement ${months} mois.`);
        } else {
          start.push({ label: title, amount: o.price, tax: o.tax });
        }
      }
    }
    if (base.formalites.length) {
      if (!title) title = base.formalites.length === 1 ? base.formalites[0].label : "Formalités de société";
      // La plus chère au prix plein, les suivantes au tarif « même acte » (comme annoncé sur le site)
      const main = base.formalites.reduce((m, f) => (f.price > m.price ? f : m), base.formalites[0]);
      base.formalites.forEach((f) => {
        const extra = f !== main;
        start.push({
          label: f.label,
          amount: extra ? Math.round(f.price * FORMALITE_SUPPLEMENT_TAUX) : f.price,
          strike: extra ? f.price : undefined,
          tax: "HT",
          note: extra ? `opération en plus dans le même acte${f.detail ? `, ${f.detail}` : ""}` : f.detail,
        });
      });
      if (base.formalites.length > 1) notes.push(`${FORMALITE_SUPPLEMENT} Si les opérations ne peuvent pas passer dans le même acte, votre conseiller vous le dit avant tout paiement.`);
      fees.push({ label: "Frais officiels de la formalité", amount: null, note: "greffe et annonces légales, au réel et sans marge, montant exact confirmé par votre conseiller" });
    }
  }

  // Options cochées
  const avail = availableOptions(base, forme, opts.find(isComptaId));
  for (const id of opts) {
    const a = avail.find((x) => x.id === id);
    if (!a) continue;
    if (a.id === "aides-dossier") {
      success.push({ label: a.label, text: aidesSuccessText(`${offerById("aides-dossier")?.priceLabel ?? ""} de l'aide versée`) });
    } else if (a.kind === "compta") {
      recurring.push({ label: a.label, amount: a.price, tax: a.tax, unit: "mois", from: forme === "auto" ? "à partir de votre inscription" : "à partir du registre de commerce" });
    } else if (a.billing === "month") {
      recurring.push({ label: a.label, amount: a.price, tax: a.tax, unit: "mois", months: a.months, from: "à partir de la signature du contrat" });
      if (a.months) engagement.push(`${a.label} : engagement ${a.months} mois.`);
    } else if (a.billing === "year") {
      start.push({ label: `${a.label}, 1re année`, amount: a.price, tax: a.tax });
      recurring.push({ label: a.label, amount: a.price, tax: a.tax, unit: "an", from: "à partir de la 2e année" });
    } else {
      start.push({ label: a.label, amount: a.price, tax: a.tax, note: a.hint });
      if (a.id.startsWith("marque-")) marqueFee = true;
    }
  }

  // Frais d'État, sans TVA ni marge
  let feesKind: Computed["feesKind"] = null;
  if (creation) {
    if (forme === "auto") {
      feesKind = "auto";
      fees.push({ label: "Inscription auto-entrepreneur", amount: FRAIS_ETAT.autoEntrepreneur.estimate, note: FRAIS_ETAT.autoEntrepreneur.note });
    } else {
      feesKind = "societe";
      fees.push({ label: "Frais d'État de création (estimation)", amount: FRAIS_ETAT.societe.estimate, note: `${FRAIS_ETAT.societe.range}, au réel et sans marge` });
    }
  }
  if (marqueFee) fees.push({ label: "Taxe OMPIC, 1re classe (dépôt en ligne)", amount: FRAIS_ETAT.marque.premiereClasse, note: `+ ${FRAIS_ETAT.marque.classeSup} DH par classe en plus, au réel et sans marge` });

  const startHT = start.filter((l) => l.tax === "HT").reduce((s, l) => s + (l.amount ?? 0), 0);
  const startTTCnoVat = start.filter((l) => l.tax === "TTC").reduce((s, l) => s + (l.amount ?? 0), 0);
  const tva = Math.round(startHT * TVA);
  const feesTotal = fees.reduce((s, f) => s + (f.amount ?? 0), 0);
  return {
    title, start, recurring, success, fees, startHT, startTTCnoVat, tva, feesTotal,
    startTotal: startHT + tva + startTTCnoVat + feesTotal,
    hasQuote: start.some((l) => l.amount === null) || fees.some((f) => f.amount === null),
    engagement, notes, feesKind,
  };
}

export const withVat = (l: { amount: number; tax: Tax }) => (l.tax === "HT" ? Math.round(l.amount * (1 + TVA)) : l.amount);

export function recurringText(l: RecurringLine) {
  const ttc = l.tax === "HT" ? ` (${fmtDH(withVat(l))} TTC)` : "";
  return `${fmtDH(l.amount)} ${l.tax} par ${l.unit}${ttc}${l.months ? ` pendant ${l.months} mois` : ""}, ${l.from}`;
}

// ── Suggestion : passer au pack quand c'est plus avantageux ─────────────────
export interface Upgrade { pack: Pack; href: string; savings: number; extraCost: number; adds: string[] }

const UPGRADE: Partial<Record<FormeId, { pack: string; web: string; compta: string }>> = {
  sarlau: { pack: "lancement", web: "web-vitrine", compta: "compta-essentiel" },
  sarl: { pack: "lancement", web: "web-vitrine", compta: "compta-essentiel" },
  auto: { pack: "demarrage", web: "web-page", compta: "compta-declaratif" },
};

export function upgradeFor(base: Base, forme: FormeId | undefined, opts: string[], c: Computed): Upgrade | null {
  if (base.kind !== "items" || !base.offer || !isCreationOffer(base.offer.id) || !forme) return null;
  const u = UPGRADE[forme];
  const pack = u ? packById(u.pack) : undefined;
  if (!u || !pack?.upfront || !pack.months) return null;
  const creationPrice = c.start[0]?.amount ?? 0;
  const addon = (id: string) => ADDONS.find((a) => a.id === id)?.price ?? 0;
  const comptaPrice = compta.find((o) => o.id === u.compta)?.price ?? 0;
  const hasWeb = opts.includes(u.web);
  const hasHeb = opts.includes("hebergement");
  const hasCompta = opts.includes(u.compta);
  const covered = creationPrice + (hasWeb ? addon(u.web) : 0) + (hasHeb ? addon("hebergement") : 0) + (hasCompta ? comptaPrice * pack.months : 0);
  const picked = [hasWeb, hasHeb, hasCompta].filter(Boolean).length;
  if (!picked) return null;
  const adds: string[] = [];
  if (!hasWeb) adds.push(pack.items.find((i) => i.label.toLowerCase().includes("page") || i.label.toLowerCase().includes("site"))?.label ?? "");
  if (!hasCompta) adds.push(pack.items.find((i) => i.label.startsWith("Comptabilité"))?.label ?? "");
  if (!hasHeb) adds.push(pack.items.find((i) => i.label.startsWith("Hébergement"))?.label ?? "");
  const rest = opts.filter((o) => !(PACK_INCLUDES[pack.id] ?? []).includes(o) && !isComptaId(o));
  const href = commandeHref({ pack: pack.id, forme, opt: rest, paiement: "avance" });
  const savings = covered - pack.upfront;
  if (savings <= 0 && picked < 2) return null;
  return { pack, href, savings, extraCost: Math.max(0, -savings), adds: adds.filter(Boolean) };
}

// ── Référence et message ────────────────────────────────────────────────────
export function makeReference(now = new Date()) {
  const d = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  try { crypto.getRandomValues(bytes); } catch { bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256))); }
  return `MZ-${d}-${[...bytes].map((b) => alphabet[b % alphabet.length]).join("")}`;
}

export interface Contact {
  nom: string;
  indicatif: string;
  tel: string;
  email: string;
  ville: string;
  pref: "whatsapp" | "appel" | "email";
  paiement: "carte" | "virement" | "especes";
  message: string;
}

export const EMPTY_CONTACT: Contact = { nom: "", indicatif: "+212", tel: "", email: "", ville: "", pref: "whatsapp", paiement: "carte", message: "" };

export const PREF_LABELS: Record<Contact["pref"], string> = { whatsapp: "WhatsApp", appel: "Appel téléphonique", email: "E-mail" };
export const PAY_LABELS: Record<Contact["paiement"], string> = { carte: "Carte bancaire", virement: "Virement", especes: "Espèces (Cash Plus, Wafacash)" };

export function fullPhone(c: Contact) {
  const raw = c.tel.replace(/[\s.\-()]/g, "");
  if (raw.startsWith("+")) return raw;
  if (raw.startsWith("00")) return `+${raw.slice(2)}`;
  return `${c.indicatif}${raw.replace(/^0/, "")}`;
}

export const phoneValid = (c: Contact) => /^\+\d{8,15}$/.test(fullPhone(c));
export const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

const amountText = (l: StartLine) => (l.amount === null ? (l.note ?? "Sur devis") : l.amount === 0 ? "Gratuit" : `${fmtDH(l.amount)} ${l.tax}`);

export function buildMessage(p: { ref: string; c: Computed; forme?: FormeId; mode: PayMode; base: Base; contact: Contact; accepted: boolean }) {
  const { c, contact } = p;
  const L: string[] = [];
  L.push("Bonjour Mziane, voici ma commande.", `Référence : ${p.ref}`, "");
  L.push(`*Offre : ${c.title}*`);
  // La forme n'est utile que si elle a été choisie (création) ou indiquée (formalités)
  const formeUtile = formeChoices(p.base).length > 0 || (p.base.kind === "items" && p.base.formalites.length > 0);
  if (p.forme && formeUtile) L.push(`Forme : ${FORMES.find((f) => f.id === p.forme)?.label ?? p.forme}`);
  const choice = payChoices(p.base).find((x) => x.mode === p.mode);
  if (choice) L.push(`Paiement : ${choice.title.toLowerCase()}`);
  L.push("");
  if (c.start.length) {
    L.push("*À payer au démarrage*");
    c.start.forEach((l) => L.push(`- ${l.label} : ${amountText(l)}${l.note && l.amount !== null ? ` (${l.note})` : ""}`));
    if (c.tva) L.push(`- TVA 20 % : ${fmtDH(c.tva)}`);
    c.fees.forEach((f) => L.push(`- ${f.label} : ${f.amount === null ? "au réel" : fmtDH(f.amount)} (sans TVA)`));
    L.push(`Total au démarrage : ${fmtDH(c.startTotal)} TTC${c.hasQuote ? " + éléments sur devis" : ""}`, "");
  } else if (c.fees.length) {
    L.push("*Frais d'État*");
    c.fees.forEach((f) => L.push(`- ${f.label} : ${f.amount === null ? "au réel" : fmtDH(f.amount)} (sans TVA)`));
    L.push(`Total au démarrage : ${fmtDH(c.startTotal)}${c.hasQuote ? " + éléments au réel" : ""}`, "");
  }
  if (c.recurring.length) {
    L.push("*Ensuite*");
    c.recurring.forEach((l) => L.push(`- ${l.label} : ${recurringText(l)}`));
    L.push("");
  }
  if (c.success.length) {
    L.push("*Seulement si l'aide est obtenue*");
    c.success.forEach((s) => L.push(`- ${s.label} : ${s.text}`));
    L.push("");
  }
  if (c.engagement.length) L.push(`Conditions d'engagement acceptées : ${p.accepted ? "oui" : "non"}`, "");
  L.push("*Mes coordonnées*");
  L.push(`- Nom : ${contact.nom.trim()}`);
  L.push(`- Téléphone : ${fullPhone(contact)}`);
  if (contact.email.trim()) L.push(`- E-mail : ${contact.email.trim()}`);
  if (contact.ville.trim()) L.push(`- Ville : ${contact.ville.trim()}`);
  L.push(`- Contact préféré : ${PREF_LABELS[contact.pref]}`);
  L.push(`- Paiement préféré : ${PAY_LABELS[contact.paiement]}`);
  if (contact.message.trim()) L.push("", `Précisions : ${contact.message.trim()}`);
  L.push("", "Merci de me confirmer la commande et de m'envoyer le lien de paiement.");
  return L.join("\n");
}
