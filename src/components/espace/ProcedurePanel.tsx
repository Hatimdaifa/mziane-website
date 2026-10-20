"use client";

// Panneau du conseiller sur un dossier : les fiches procédures de la commande, étape par étape, avec la progression.
import { useState } from "react";
import Link from "next/link";
import { BookOpenCheck, ChevronDown, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { offerIdsOfSpec, proceduresForSpec } from "@/lib/procedures";
import type { Dossier } from "@/lib/espace";
import { Card, ProgressBar } from "@/components/espace/ui";
import { ProcedureHeader, ProcedureNotes, ProcedureSteps, procedureProgress } from "@/components/espace/ProcedureSteps";
import { useStepProgress } from "@/components/espace/useStepProgress";

export default function ProcedurePanel({ dossier, userId }: { dossier: Dossier; userId: string }) {
  const procedures = proceduresForSpec(dossier.spec);
  const offers = offerIdsOfSpec(dossier.spec);
  const { done, toggle, busy, error, local } = useStepProgress(dossier.id, userId);
  const [open, setOpen] = useState<string | null>(null);

  if (!procedures.length) return null;
  const totals = procedures.map((p) => procedureProgress(p, offers, done));
  const all = totals.reduce((a, t) => ({ total: a.total + t.total, done: a.done + t.done }), { total: 0, done: 0 });

  return (
    <Card className="mt-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><BookOpenCheck className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h2 className="font-extrabold text-zinc-900">Procédure à suivre</h2>
          <p className="text-[13px] text-zinc-500">Visible par vous seul. {all.done} étape{all.done > 1 ? "s" : ""} faite{all.done > 1 ? "s" : ""} sur {all.total}.</p>
        </div>
      </div>
      <div className="mt-3"><ProgressBar value={all.done} max={all.total} /></div>
      {local && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900">Les coches sont gardées dans ce navigateur seulement : la table de suivi n&apos;est pas encore créée en base.</p>}
      {error && <p role="alert" className="mt-3 text-[13px] font-semibold text-red-700">{error}</p>}

      <div className="mt-4 grid gap-3">
        {procedures.map((p, i) => {
          const t = totals[i];
          const isOpen = open === p.id || (open === null && i === totals.findIndex((x) => x.done < x.total));
          return (
            <div key={p.id} className="rounded-2xl border border-zinc-200">
              <button type="button" onClick={() => setOpen(isOpen ? "" : p.id)} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-zinc-900">{p.title}</span>
                  <span className="text-[13px] text-zinc-500">{t.done} / {t.total} étapes{p.duree ? ` · ${p.duree}` : ""}</span>
                </span>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", t.done === t.total ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-600")}>
                  {t.done === t.total ? "Terminé" : `${Math.round((t.done / Math.max(1, t.total)) * 100)} %`}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition", isOpen && "rotate-180")} aria-hidden />
              </button>
              {isOpen && (
                <div className="grid gap-5 border-t border-zinc-100 p-4">
                  <ProcedureHeader procedure={p} />
                  <ProcedureSteps procedure={p} offers={offers} done={done} onToggle={toggle} busy={busy} />
                  <ProcedureNotes procedure={p} />
                  <Link href={`/espace/conseiller/procedures/${p.id}`} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-700 hover:underline">
                    <FileDown className="h-4 w-4" aria-hidden /> Ouvrir la fiche complète (impression, PDF)
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
