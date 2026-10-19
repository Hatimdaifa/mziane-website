// Liens d'achat : tout passe par /commande (commande puis paiement).
import { FORMES, type FormeId, type Pack, formalites, waLink } from "@/lib/offers";

export const AIDES_HREF = "/onboarding?besoin=aides";
export const TERRE_HREF = "/onboarding?besoin=aides";

function qs(params: Record<string, string | undefined>) {
  const parts = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!).replace(/%2C/g, ",")}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

/** Forme par défaut d'un pack (la première compatible). */
export const packForme = (p: Pack, forme?: FormeId) =>
  forme && (!p.formes || p.formes.includes(forme)) ? forme : p.formes?.[0];

/** /commande?pack=<id>&forme=<FormeId>[&opt=a,b][&paiement=avance] */
export function packHref(p: Pack, opts: { forme?: FormeId; opt?: string[]; upfront?: boolean; compta?: string } = {}) {
  return `/commande${qs({
    pack: p.id,
    forme: packForme(p, opts.forme),
    opt: joinOpt(opts.opt, opts.compta),
    paiement: opts.upfront && p.upfront ? "avance" : undefined,
  })}`;
}

// La formule de comptabilité voyage dans opt, comme les options (format lu par /commande).
function joinOpt(opt?: string[], compta?: string) {
  const all = [...(opt ?? []), ...(compta ? [compta] : [])];
  return all.length ? all.join(",") : undefined;
}

/** /commande?offre=<id>&forme=<FormeId>[&opt=a,b] ; une formalité passe par ?formalite=<id> */
export function offerHref(offre: string, forme?: FormeId, opt?: string[], compta?: string) {
  if (formalites.some((f) => f.id === offre)) return `/commande${qs({ formalite: offre })}`;
  return `/commande${qs({ offre, forme, opt: joinOpt(opt, compta) })}`;
}

/** Devis WhatsApp prérempli (SA, SCI, ZAI et CFC). */
export function devisHref(sujet: string) {
  return waLink(`Bonjour Mziane, je souhaite un devis pour : ${sujet}.`);
}

export const formeLabel = (id: FormeId) => FORMES.find((f) => f.id === id)?.label ?? id;
