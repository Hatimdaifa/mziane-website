// Petits éléments d'affichage de l'espace client.
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_STATUTS, STATUTS, statutInfo, type DocStatus, type DossierStatus } from "@/lib/espace";

const TONES: Record<DossierStatus, string> = {
  recu: "bg-blue-50 text-blue-800",
  documents: "bg-amber-100 text-amber-900",
  en_cours: "bg-blue-50 text-blue-800",
  depose: "bg-blue-50 text-blue-800",
  termine: "bg-emerald-50 text-emerald-800",
  annule: "bg-zinc-100 text-zinc-600",
};

export function StatusBadge({ status }: { status: DossierStatus }) {
  return <span className={cn("inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold", TONES[status])}>{statutInfo(status).label}</span>;
}

export function DocBadge({ status }: { status: DocStatus }) {
  const s = DOC_STATUTS[status];
  return <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-bold", s.tone)}>{s.label}</span>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label="Documents envoyés">
      <div className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-emerald-600" : "bg-blue-600")} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Étapes du dossier, de la commande au résultat. */
export function StatusSteps({ status }: { status: DossierStatus }) {
  if (status === "annule") return null;
  const current = STATUTS.findIndex((s) => s.id === status);
  return (
    <ol className="grid gap-0 sm:grid-cols-5">
      {STATUTS.map((s, i) => {
        const done = i < current || status === "termine";
        const on = i === current && status !== "termine";
        return (
          <li key={s.id} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 max-sm:py-1.5">
            <span className="flex w-full items-center max-sm:w-auto">
              <span className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold",
                done ? "bg-emerald-600 text-white" : on ? "bg-blue-700 text-white ring-4 ring-blue-100" : "bg-zinc-100 text-zinc-500",
              )}>
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              {i < STATUTS.length - 1 && <span className={cn("mx-2 h-0.5 flex-1 rounded max-sm:hidden", done ? "bg-emerald-600" : "bg-zinc-200")} />}
            </span>
            <span className={cn("text-[13px] leading-tight", on ? "font-bold text-zinc-900" : "text-zinc-600")}>
              {s.label}
              {on && <span className="sr-only"> (étape actuelle)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border border-zinc-200 bg-white p-6 max-sm:p-5", className)}>{children}</section>;
}
