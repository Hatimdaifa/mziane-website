// Tableau comparatif des packs. Sur mobile : colonne des critères figée,
// deux packs visibles, défilement horizontal limité au tableau (Baymard : en-têtes persistants,
// lignes groupées, attributs identiques évités).
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Pack, fmtDH, packSavings, packSavingsUpfront, packTotal, packValue, packs } from "@/lib/offers";
import { packHref } from "./links";
import { sortPacks } from "./meta";

const find = (p: Pack, re: RegExp) => p.items.find((i) => re.test(i.label));

type Row = { label: string; cell: (p: Pack) => React.ReactNode };

const included = (p: Pack, re: RegExp, extra?: (p: Pack) => string | undefined) => {
  const i = find(p, re);
  const more = extra?.(p);
  if (!i && !more) return <><Minus className="mx-auto h-4 w-4 text-zinc-400" aria-hidden /><span className="sr-only">Non inclus</span></>;
  return (
    <span className="inline-flex items-start gap-1.5 text-left">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" strokeWidth={2.5} aria-hidden />
      <span>{i ? i.label : more}{i?.offered && <span className="font-semibold text-red-700"> (offert)</span>}</span>
    </span>
  );
};

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Prix",
    rows: [
      { label: "Prix", cell: (p) => <strong className="text-base text-zinc-900">{p.monthly ? `${fmtDH(p.monthly)} / mois` : fmtDH(p.once ?? 0)}</strong> },
      { label: "Total sur la durée", cell: (p) => (p.monthly ? `${fmtDH(packTotal(p))} sur ${p.months} mois` : "Paiement unique") },
      { label: "Payé d'avance", cell: (p) => (p.upfront ? fmtDH(p.upfront) : p.once ? (p.installments ? `En une fois ou en ${p.installments} fois sans frais` : "En une fois") : "Au mois") },
      { label: "Valeur à la carte", cell: (p) => <span className="text-zinc-500 line-through">{fmtDH(packValue(p))}</span> },
      { label: "Vous économisez", cell: (p) => <span className="font-bold text-amber-800">{fmtDH(Math.max(packSavings(p), packSavingsUpfront(p)))}{p.upfront ? " max." : ""}</span> },
    ],
  },
  {
    title: "Ce qui est inclus",
    rows: [
      { label: "Création ou inscription", cell: (p) => included(p, /Création|Inscription/) },
      { label: "Site web", cell: (p) => included(p, /Site|Page web/) },
      { label: "Comptabilité", cell: (p) => included(p, /Comptabilité/) },
      { label: "Domiciliation", cell: (p) => included(p, /Domiciliation/) },
      { label: "Marque", cell: (p) => included(p, /Marque/) },
      { label: "Aides de l'État", cell: (p) => included(p, /Business plan|dossier/i, (x) => x.extra) },
      { label: "Hébergement et domaine", cell: (p) => included(p, /Hébergement/) },
    ],
  },
  {
    title: "Conditions",
    rows: [
      { label: "Engagement", cell: (p) => (p.monthly ? `${p.months} mois` : "Aucun") },
      { label: "Pour qui", cell: (p) => p.audience },
    ],
  },
];

export default function PackComparison({ featured = "lancement" }: { featured?: string }) {
  const list = sortPacks(packs);
  const hl = (p: Pack) => p.id === featured;
  const cellBase = "min-w-[150px] px-4 py-3 text-center align-top text-[14px] text-zinc-700 sm:min-w-[170px]";
  const sticky = "sticky left-0 z-10 w-[118px] min-w-[118px] bg-white px-4 py-3 text-left text-[13px] font-semibold text-zinc-700 shadow-[1px_0_0_#e4e4e7] sm:w-[190px] sm:min-w-[190px] sm:text-[14px]";

  return (
    <div className="relative overflow-x-auto rounded-[24px] border border-zinc-200 bg-white" role="region" aria-label="Tableau comparatif des packs, défilable horizontalement" tabIndex={0}>
      <table className="w-full border-collapse">
        <caption className="sr-only">Comparaison des packs Mziane : prix, contenu et conditions</caption>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" className={cn(sticky, "align-bottom")}><span className="sr-only">Critère</span></th>
            {list.map((p) => (
              <th key={p.id} scope="col" className={cn(cellBase, "pt-6 align-bottom", hl(p) && "bg-blue-50")}>
                {hl(p) && <span className="mb-2 inline-block rounded-full bg-blue-700 px-2.5 py-0.5 text-[11px] font-bold text-white">Recommandé</span>}
                <span className="block text-base font-extrabold text-zinc-900">Pack {p.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        {GROUPS.map((g) => (
          <tbody key={g.title}>
            <tr>
              <th scope="colgroup" colSpan={list.length + 1} className="bg-zinc-50 px-4 py-2 text-left text-[12px] font-bold uppercase tracking-wide text-zinc-600">
                <span className="sticky left-4">{g.title}</span>
              </th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.label} className="border-b border-zinc-100">
                <th scope="row" className={sticky}>{r.label}</th>
                {list.map((p) => <td key={p.id} className={cn(cellBase, hl(p) && "bg-blue-50/70")}>{r.cell(p)}</td>)}
              </tr>
            ))}
          </tbody>
        ))}
        <tfoot>
          <tr>
            <th scope="row" className={sticky}><span className="sr-only">Commander</span></th>
            {list.map((p) => (
              <td key={p.id} className={cn(cellBase, "py-5", hl(p) && "bg-blue-50")}>
                <Link
                  href={packHref(p)}
                  className={cn(
                    "inline-flex h-10 w-full items-center justify-center rounded-xl px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
                    hl(p) ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-zinc-900 text-white hover:bg-zinc-800",
                  )}
                >
                  Choisir<span className="sr-only"> le pack {p.name}</span>
                </Link>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
