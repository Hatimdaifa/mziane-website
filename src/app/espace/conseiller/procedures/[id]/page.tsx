"use client";

// Fiche procédure complète : à suivre en cochant (coches gardées dans ce navigateur) ou à imprimer en PDF.
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { useEspace } from "@/components/espace/EspaceShell";
import { procedureById } from "@/lib/procedures";
import { ProcedureHeader, ProcedureNotes, ProcedureSteps } from "@/components/espace/ProcedureSteps";
import { useStepProgress } from "@/components/espace/useStepProgress";

export default function ProcedurePage() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useEspace();
  const p = procedureById(id);
  const { done, toggle } = useStepProgress(null);

  if (profile?.role !== "conseiller") return <p className="text-zinc-600">Cette page est réservée aux conseillers Mziane.</p>;
  if (!p) return <p className="text-zinc-600">Fiche introuvable.</p>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Link href="/espace/conseiller/procedures" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Toutes les fiches
        </Link>
        <span className="ml-auto flex gap-2">
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:border-blue-500">
            <Printer className="h-4 w-4" aria-hidden /> Imprimer ou enregistrer en PDF
          </button>
        </span>
      </div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold tracking-tight text-zinc-900">{p.title}</h1>
      <ProcedureHeader procedure={p} />
      <ProcedureSteps procedure={p} offers={null} done={done} onToggle={toggle} />
      <ProcedureNotes procedure={p} />
    </div>
  );
}
