"use client";

// Affichage d'une fiche procédure : phases, étapes cochables, détails dépliables (où, comment, pièces, pièges...).
import { useState } from "react";
import { AlertTriangle, Building2, Check, ChevronDown, Clock, ExternalLink, FileCheck2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHO, stepApplies, type Procedure, type Step } from "@/lib/procedures";

export const stepKey = (p: Procedure, s: Step) => `${p.id}:${s.id}`;

export function procedureProgress(p: Procedure, offers: string[] | null, done: Set<string>) {
  const steps = p.phases.flatMap((ph) => ph.steps).filter((s) => stepApplies(s, offers));
  return { total: steps.length, done: steps.filter((s) => done.has(stepKey(p, s))).length };
}

export function ProcedureSteps({ procedure: p, offers, done, onToggle, busy }: {
  procedure: Procedure;
  /** Formules du dossier ; null = toutes les étapes (bibliothèque) */
  offers: string[] | null;
  done: Set<string>;
  onToggle?: (key: string, value: boolean) => void;
  busy?: string;
}) {
  // Numérotation continue sur toute la fiche, phases vides retirées.
  const phases = p.phases
    .map((ph) => ({ title: ph.title, steps: ph.steps.filter((s) => stepApplies(s, offers)) }))
    .filter((ph) => ph.steps.length);
  const starts = phases.map((_, i) => phases.slice(0, i).reduce((sum, ph) => sum + ph.steps.length, 0));
  return (
    <div className="grid gap-6">
      {phases.map((ph, i) => (
        <section key={ph.title}>
          <h3 className="mb-2.5 text-[15px] font-extrabold text-zinc-900">{ph.title}</h3>
          <ol className="grid gap-2">
            {ph.steps.map((s, j) => (
              <StepRow key={s.id} n={starts[i] + j + 1} step={s} k={stepKey(p, s)} done={done.has(stepKey(p, s))} onToggle={onToggle} busy={busy === stepKey(p, s)} showOffers={!offers} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function StepRow({ n, step: s, k, done, onToggle, busy, showOffers }: {
  n: number; step: Step; k: string; done: boolean; onToggle?: (key: string, value: boolean) => void; busy: boolean; showOffers: boolean;
}) {
  const [open, setOpen] = useState(false);
  const who = WHO[s.who] ?? WHO.moi;
  const hasDetails = !!(s.where || s.how?.length || s.pieces?.length || s.pieges?.length || s.preuve);
  return (
    <li className={cn("rounded-2xl border bg-white transition print:border-zinc-300", done ? "border-emerald-200 bg-emerald-50/40" : "border-zinc-200")}>
      <div className="flex items-start gap-3 p-3.5">
        <button
          type="button"
          disabled={!onToggle || busy}
          onClick={() => onToggle?.(k, !done)}
          aria-pressed={done}
          aria-label={done ? `Décocher l'étape ${n}` : `Cocher l'étape ${n} comme faite`}
          className={cn(
            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition disabled:cursor-default",
            done ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-300 bg-white hover:border-blue-600",
          )}
        >
          {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <span className="text-[11px] font-bold text-zinc-400 print:text-zinc-500">{n}</span>}
        </button>
        <button type="button" onClick={() => hasDetails && setOpen(!open)} aria-expanded={hasDetails ? open : undefined}
          className={cn("min-w-0 flex-1 text-left", !hasDetails && "cursor-default")}>
          <span className={cn("block font-semibold leading-snug", done ? "text-zinc-500 line-through decoration-zinc-300" : "text-zinc-900")}>{s.title}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className={cn("rounded-full px-2 py-0.5 font-bold", who.tone)}>{who.label}</span>
            {s.delai && <span className="inline-flex items-center gap-1 text-zinc-500"><Clock className="h-3 w-3" aria-hidden />{s.delai}</span>}
            {s.cout && <span className="inline-flex items-center gap-1 text-zinc-500"><Wallet className="h-3 w-3" aria-hidden />{s.cout}</span>}
            {showOffers && !!s.offers?.length && <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-600">Seulement : {s.offers.join(", ")}</span>}
          </span>
        </button>
        {hasDetails && <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-zinc-400 transition print:hidden", open && "rotate-180")} aria-hidden />}
      </div>
      {hasDetails && (
        <div className={cn("grid gap-3 border-t border-zinc-100 px-4 py-3.5 pl-[52px] text-[14px] leading-relaxed text-zinc-700", open ? "" : "hidden print:grid")}>
          {s.where && <p className="flex gap-2"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden /><span><b className="text-zinc-900">Où : </b><Linkify text={s.where} /></span></p>}
          {!!s.how?.length && (
            <div><b className="text-zinc-900">Comment :</b>
              <ol className="mt-1 list-decimal space-y-1 pl-5">{s.how.map((h) => <li key={h}><Linkify text={h} /></li>)}</ol>
            </div>
          )}
          {!!s.pieces?.length && (
            <div><b className="text-zinc-900">Pièces :</b>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">{s.pieces.map((h) => <li key={h}>{h}</li>)}</ul>
            </div>
          )}
          {!!s.pieges?.length && (
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-950">
              <b className="inline-flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" aria-hidden /> Pièges à éviter</b>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">{s.pieges.map((h) => <li key={h}>{h}</li>)}</ul>
            </div>
          )}
          {s.preuve && <p className="flex gap-2"><FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden /><span><b className="text-zinc-900">C&apos;est fait quand : </b>{s.preuve}</span></p>}
        </div>
      )}
    </li>
  );
}

/** Rend cliquables les adresses web citées dans le texte. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s),;]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part)
          ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-blue-700 underline break-all">{part}<ExternalLink className="h-3 w-3 shrink-0 print:hidden" aria-hidden /></a>
          : part,
      )}
    </>
  );
}

/** Encadrés de fin de fiche : cabinet, client, après, points à vérifier, sources. */
export function ProcedureNotes({ procedure: p }: { procedure: Procedure }) {
  const blocks: { title: string; items?: string[]; tone: string }[] = [
    { title: "Quand appeler le cabinet comptable", items: p.cabinet, tone: "bg-amber-50 text-amber-950" },
    { title: "Ce que le client fait lui-même", items: p.client, tone: "bg-red-50 text-red-950" },
    { title: "Après la livraison", items: p.apres, tone: "bg-blue-50 text-blue-950" },
    { title: "À vérifier avant de s'y fier", items: p.a_verifier, tone: "bg-zinc-100 text-zinc-800" },
  ];
  return (
    <div className="grid gap-3">
      {blocks.filter((b) => b.items?.length).map((b) => (
        <div key={b.title} className={cn("break-inside-avoid rounded-2xl px-4 py-3.5 text-[14px] leading-relaxed", b.tone)}>
          <b>{b.title}</b>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">{b.items!.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
      {!!p.sources?.length && (
        <div className="text-[13px] text-zinc-600">
          <b className="text-zinc-900">Sources</b>
          <ul className="mt-1 space-y-0.5">{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{s.title}</a></li>)}</ul>
        </div>
      )}
    </div>
  );
}

/** En-tête de fiche : résumé, durée, frais officiels, prérequis. */
export function ProcedureHeader({ procedure: p }: { procedure: Procedure }) {
  return (
    <div className="grid gap-3 text-[14px] leading-relaxed text-zinc-700">
      <p className="text-[15px] text-zinc-800">{p.summary}</p>
      <div className="flex flex-wrap gap-2 text-[13px]">
        {p.duree && <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700"><Clock className="h-3.5 w-3.5" aria-hidden /> {p.duree}</span>}
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">Formules : {p.offers.join(", ")}</span>
      </div>
      {!!p.frais_officiels?.length && (
        <div className="break-inside-avoid rounded-2xl border border-zinc-200 bg-white p-4">
          <b className="text-zinc-900">Frais officiels à prévoir</b>
          <table className="mt-2 w-full text-[13px]">
            <tbody>
              {p.frais_officiels.map((f) => (
                <tr key={f.label} className="border-t border-zinc-100 first:border-0">
                  <td className="py-1.5 pr-3">{f.label}{f.note && <span className="block text-zinc-500">{f.note}</span>}</td>
                  <td className="py-1.5 text-right font-semibold whitespace-nowrap text-zinc-900">{f.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!!p.avant_de_commencer?.length && (
        <div className="break-inside-avoid rounded-2xl bg-blue-50 px-4 py-3.5 text-blue-950">
          <b>Avant de commencer</b>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">{p.avant_de_commencer.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
