"use client";

// « Composez votre pack » : total en direct de la première année à la carte,
// et proposition du pack qui couvre la sélection quand il revient moins cher.
import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADDONS, FORMES, FRAIS_ETAT, MARQUE_TAXE, type FormeId, HEBERGEMENT_AN, type Pack, PRIX_CREATION,
  fmtDH, offerById, packById, packTotal,
} from "@/lib/offers";
import { devisHref, offerHref, packHref } from "./links";

type Key = "creation" | "site" | "hebergement" | "compta" | "domi" | "marque" | "aides";
type Site = "none" | "web-page" | "web-vitrine";

interface Sel {
  forme: FormeId; mre: boolean; site: Site; compta: boolean; salaries: boolean; domi: boolean; marque: boolean; aides: boolean;
}

interface Line { key: Key; label: string; once: number; monthly: number; months: number; note?: string; addon?: string }

const FORMES_CONFIG: FormeId[] = ["auto", "sarlau", "sarl", "sas", "sa", "sci"];
const COMPTA_MOIS = 12;
const DOMI_MOIS = 12;

const price = (id: string) => offerById(id)?.price ?? 0;
const addon = (id: string) => ADDONS.find((a) => a.id === id);

const creationOffer = (s: Sel) => (s.mre ? "intl-mre" : s.forme === "auto" ? "ae-accompagne" : "soc-standard");
const comptaOffer = (s: Sel) => (s.forme === "auto" ? "compta-declaratif" : s.salaries ? "compta-business" : "compta-essentiel");

function buildLines(s: Sel): Line[] {
  const short = FORMES.find((f) => f.id === s.forme)?.short ?? "";
  const creationPrice = s.mre ? price("intl-mre") : (PRIX_CREATION[s.forme]?.[1] ?? 0);
  const lines: Line[] = [{
    key: "creation",
    label: s.mre ? `Création ${short} à distance (MRE)` : s.forme === "auto" ? "Inscription auto-entrepreneur accompagnée" : `Création ${short} Standard`,
    once: creationPrice, monthly: 0, months: 0,
  }];
  if (s.site !== "none") {
    lines.push({ key: "site", label: offerById(s.site)?.name === "Vitrine" ? "Site vitrine 5 pages" : "Page web unique", once: price(s.site), monthly: 0, months: 0, addon: s.site });
    lines.push({ key: "hebergement", label: "Hébergement et domaine, 1re année", once: HEBERGEMENT_AN, monthly: 0, months: 0, addon: "hebergement" });
  }
  if (s.compta) {
    const o = offerById(comptaOffer(s));
    lines.push({ key: "compta", label: `Comptabilité ${o?.name ?? ""}, ${COMPTA_MOIS} mois`, once: 0, monthly: o?.price ?? 0, months: COMPTA_MOIS });
  }
  if (s.domi) {
    lines.push({ key: "domi", label: `Domiciliation Business, ${DOMI_MOIS} mois`, once: 0, monthly: price("domi-business"), months: DOMI_MOIS, addon: "domi-business" });
  }
  if (s.marque) {
    lines.push({ key: "marque", label: "Dépôt de marque Protection", once: price("marque-protection"), monthly: 0, months: 0, note: MARQUE_TAXE, addon: "marque-protection" });
  }
  if (s.aides) {
    lines.push({ key: "aides", label: "Dossier d'aides de A à Z", once: 0, monthly: 0, months: 0, note: addon("aides-dossier")?.hint, addon: "aides-dossier" });
  }
  return lines;
}

const lineTotal = (l: Line) => l.once + l.monthly * l.months;

/** Ce que chaque pack couvre, et à quelles conditions il correspond à la sélection. */
function packCovers(p: Pack, s: Sel): Key[] | null {
  const formeOk = !p.formes || p.formes.includes(s.forme);
  if (!formeOk) return null;
  switch (p.id) {
    case "lancement":
      return !s.mre && s.site === "web-vitrine" && s.compta && !s.salaries ? ["creation", "site", "hebergement", "compta"] : null;
    case "lancement-equipe":
      return !s.mre && s.site === "web-vitrine" && s.compta && s.salaries ? ["creation", "site", "hebergement", "compta"] : null;
    case "demarrage":
      return !s.mre && s.forme === "auto" && s.site === "web-page" && s.compta ? ["creation", "site", "hebergement", "compta"] : null;
    case "envol":
      return !s.mre && s.forme !== "auto" && s.compta && s.aides ? ["creation", "compta", "aides"] : null;
    case "diaspora":
      return s.mre && s.domi && s.compta && !s.salaries ? ["creation", "domi", "compta"] : null;
    case "identite":
      return s.marque && s.site === "web-vitrine" ? ["marque", "site"] : null;
    default:
      return null;
  }
}

const PACK_IDS = ["lancement", "lancement-equipe", "demarrage", "envol", "diaspora", "identite"];

function bestPack(s: Sel, lines: Line[], alaCarte: number) {
  let best: { pack: Pack; cost: number; savings: number; rest: Line[] } | null = null;
  for (const id of PACK_IDS) {
    const pack = packById(id);
    if (!pack) continue;
    const covers = packCovers(pack, s);
    if (!covers) continue;
    const rest = lines.filter((l) => !covers.includes(l.key));
    const cost = packTotal(pack) + rest.reduce((t, l) => t + lineTotal(l), 0);
    const savings = alaCarte - cost;
    if (savings > 0 && (!best || savings > best.savings)) best = { pack, cost, savings, rest };
  }
  return best;
}

export default function PackConfigurator() {
  const uid = useId();
  const [sel, setSel] = useState<Sel>({ forme: "sarlau", mre: false, site: "web-vitrine", compta: true, salaries: false, domi: false, marque: false, aides: false });
  const set = <K extends keyof Sel>(k: K, v: Sel[K]) => setSel((s) => {
    const next = { ...s, [k]: v };
    // Pour un auto-entrepreneur, la page unique est l'offre adaptée et la paie ne s'applique pas.
    // La création à distance (MRE) concerne une société, pas l'inscription auto-entrepreneur.
    if (k === "forme" && v === "auto") { next.salaries = false; next.mre = false; if (next.site === "web-vitrine") next.site = "web-page"; }
    if (k === "forme" && s.forme === "auto" && v !== "auto" && next.site === "web-page") next.site = "web-vitrine";
    return next;
  });

  const kind = FORMES.find((f) => f.id === sel.forme)?.kind;
  const devis = kind === "devis";
  const lines = buildLines(sel);
  const once = lines.reduce((t, l) => t + l.once, 0);
  const monthly = lines.reduce((t, l) => t + l.monthly, 0);
  const alaCarte = lines.reduce((t, l) => t + lineTotal(l), 0);
  const best = devis ? null : bestPack(sel, lines, alaCarte);
  const comptaId = sel.compta ? comptaOffer(sel) : undefined;

  const restOpts = (rest: Line[]) => rest.map((l) => l.addon).filter((a): a is string => !!a);
  const restCompta = (rest: Line[]) => (rest.some((l) => l.key === "compta") ? comptaId : undefined);

  const href = best
    ? packHref(best.pack, { forme: sel.forme, opt: restOpts(best.rest), compta: restCompta(best.rest) })
    : offerHref(creationOffer(sel), sel.forme, restOpts(lines), comptaId);
  const devisLink = devisHref(`la création d'une ${FORMES.find((f) => f.id === sel.forme)?.label}${sel.mre ? " depuis l'étranger" : ""}`);

  const checks: { k: "compta" | "domi" | "marque" | "aides"; label: string; hint: string }[] = [
    { k: "compta", label: `Comptabilité ${COMPTA_MOIS} mois`, hint: `${offerById(comptaOffer(sel))?.name}, ${fmtDH(price(comptaOffer(sel)))} HT / mois` },
    { k: "domi", label: "Domiciliation du siège", hint: `Business, ${fmtDH(price("domi-business"))} HT / mois` },
    { k: "marque", label: "Dépôt de marque", hint: `Protection, ${fmtDH(price("marque-protection"))} HT` },
    { k: "aides", label: "Dossier d'aides de l'État", hint: "0 DH si refus" },
  ];

  const field = "rounded-2xl border border-zinc-200 bg-white p-4 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-700";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <form className="grid gap-6 rounded-[28px] border border-zinc-200 bg-white p-7 max-sm:p-5" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="mb-3 text-[15px] font-bold text-zinc-900">1. Votre forme juridique</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FORMES_CONFIG.map((id) => {
              const f = FORMES.find((x) => x.id === id)!;
              return (
                <label key={id} className={cn(field, "cursor-pointer px-3 py-3 text-center")}>
                  <input type="radio" name={`${uid}-forme`} value={id} checked={sel.forme === id} onChange={() => set("forme", id)} className="sr-only" />
                  <span className="block text-sm font-bold text-zinc-900">{f.short}</span>
                  <span className="block text-[12px] text-zinc-500">{f.kind === "devis" ? "Sur devis" : f.kind === "ae" ? "Personne seule" : f.label}</span>
                </label>
              );
            })}
          </div>
          {kind === "societe" && (
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-700">
              <input type="checkbox" checked={sel.mre} onChange={(e) => set("mre", e.target.checked)} className="h-4 w-4 accent-blue-700" />
              Je vis à l&apos;étranger et je crée à distance (MRE)
            </label>
          )}
        </fieldset>

        {devis ? (
          <p className="rounded-2xl bg-zinc-50 p-4 text-[15px] leading-relaxed text-zinc-700">
            La {FORMES.find((f) => f.id === sel.forme)?.label} demande une étude de votre projet. Devis précis sur WhatsApp.
          </p>
        ) : (
          <>
            <fieldset>
              <legend className="mb-3 text-[15px] font-bold text-zinc-900">2. Votre site web</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  { id: "none", label: "Pas de site", hint: "Plus tard" },
                  { id: "web-page", label: "Page unique", hint: `${fmtDH(price("web-page"))} HT` },
                  { id: "web-vitrine", label: "Site vitrine", hint: `${fmtDH(price("web-vitrine"))} HT` },
                ] as { id: Site; label: string; hint: string }[]).map((o) => (
                  <label key={o.id} className={cn(field, "cursor-pointer px-3 py-3")}>
                    <input type="radio" name={`${uid}-site`} value={o.id} checked={sel.site === o.id} onChange={() => set("site", o.id)} className="sr-only" />
                    <span className="block text-sm font-bold text-zinc-900">{o.label}</span>
                    <span className="block text-[12px] text-zinc-500">{o.hint}</span>
                  </label>
                ))}
              </div>
              {sel.site !== "none" && <p className="mt-2 text-[12px] text-zinc-500">Hébergement et domaine ajoutés : {fmtDH(HEBERGEMENT_AN)} HT par an.</p>}
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[15px] font-bold text-zinc-900">3. Vos services</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {checks.map((c) => (
                  <label key={c.k} className={cn(field, "flex cursor-pointer items-start gap-3")}>
                    <input type="checkbox" checked={sel[c.k]} onChange={(e) => set(c.k, e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700" />
                    <span>
                      <span className="block text-sm font-bold text-zinc-900">{c.label}</span>
                      <span className="block text-[12px] text-zinc-500">{c.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {sel.compta && sel.forme !== "auto" && (
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-700">
                  <input type="checkbox" checked={sel.salaries} onChange={(e) => set("salaries", e.target.checked)} className="h-4 w-4 accent-blue-700" />
                  J&apos;embauche des salariés (paie incluse jusqu&apos;à 5 salariés)
                </label>
              )}
            </fieldset>
          </>
        )}
      </form>

      <aside className="flex flex-col rounded-[28px] bg-zinc-900 p-7 text-white max-sm:p-5 lg:sticky lg:top-[96px] lg:self-start" aria-label="Récapitulatif">
        <h3 className="text-lg font-bold">Votre première année</h3>
        {devis ? (
          <>
            <p className="mt-3 text-[15px] text-white/75">Prix sur devis, sous 24 heures.</p>
            <a href={devisLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 font-bold text-zinc-900 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900">
              <MessageCircle className="h-4 w-4" aria-hidden /> Demander un devis sur WhatsApp
            </a>
          </>
        ) : (
          <>
            <ul className="mt-4 grid gap-2.5 border-b border-white/15 pb-4 text-[14px]">
              {lines.map((l) => {
                const covered = best && !best.rest.includes(l);
                return (
                  <li key={l.key} className="flex justify-between gap-3">
                    <span className="text-white/85">
                      {covered && <Check className="mr-1 inline h-3.5 w-3.5 text-amber-300" aria-label="inclus dans le pack" />}
                      {l.label}
                      {l.note && <span className="block text-[12px] text-white/60">{l.note}</span>}
                    </span>
                    <span className="shrink-0 tabular-nums text-white/85">{lineTotal(l) ? fmtDH(lineTotal(l)) : "0 DH"}</span>
                  </li>
                );
              })}
            </ul>

            <div aria-live="polite" aria-atomic="true">
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="text-[15px] text-white/75">{best ? "À la carte" : "Total à la carte"}</span>
                <span className={cn("tabular-nums font-extrabold", best ? "text-lg text-white/60 line-through" : "text-3xl")}>{fmtDH(alaCarte)} HT</span>
              </div>
              {!best && (
                <p className="mt-1 text-right text-[13px] text-white/60">
                  {fmtDH(once)} au départ{monthly ? `, puis ${fmtDH(monthly)} par mois` : ""}
                </p>
              )}

              {best && (
                <div className="mt-4 rounded-2xl bg-white p-5 text-zinc-900">
                  <p className="flex items-center gap-2 text-[15px] font-bold">
                    <PiggyBank className="h-5 w-5 text-amber-800" aria-hidden />
                    Le pack {best.pack.name} vous fait économiser {fmtDH(best.savings)}
                  </p>
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <span className="text-sm text-zinc-600">Avec le pack</span>
                    <span className="text-3xl font-extrabold tabular-nums">{fmtDH(best.cost)} {best.pack.tax}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-zinc-600">
                    {best.pack.monthly ? `${fmtDH(best.pack.monthly)} par mois pendant ${best.pack.months} mois` : `${fmtDH(packTotal(best.pack))} une fois`}
                    {best.rest.length ? ", plus les options hors pack" : ""}.
                    {best.pack.upfront ? ` Payé d'avance : ${fmtDH(best.pack.upfront)} pour le pack.` : ""}
                  </p>
                </div>
              )}
            </div>

            <Link
              href={href}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 font-bold text-zinc-900 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {best ? `Commander le pack ${best.pack.name}` : "Commander cette sélection"} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="mt-3 text-[12px] leading-relaxed text-white/60">
              {sel.forme === "auto" && !sel.mre ? "Inscription en TTC, autres montants HT. " : "Montants HT. "}{sel.forme === "auto" ? FRAIS_ETAT.autoEntrepreneur.note : `Frais d'État en sus, environ ${fmtDH(FRAIS_ETAT.societe.estimate)}, reversés sans marge.`}
              {best?.pack.monthly ? " Pack avec engagement 12 mois." : " Sans engagement hors domiciliation (6 mois)."}
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
