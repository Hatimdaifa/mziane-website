"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FilePlus2, FolderOpen } from "lucide-react";
import { Ar } from "@/components/Ar";
import { useEspace } from "@/components/espace/EspaceShell";
import { StatusBadge, ProgressBar } from "@/components/espace/ui";
import { progress, requirementGroups } from "@/components/espace/progress";
import { supabase } from "@/lib/supabase";
import { fmtDate, type Answer, type DocFile, type Dossier } from "@/lib/espace";

interface Row { dossier: Dossier; done: number; total: number; redo: number; fromMziane: number }

export default function EspacePage() {
  const { userId, profile } = useEspace();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const sb = supabase();
    (async () => {
      const { data: dossiers } = await sb.from("dossiers").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      const list = (dossiers ?? []) as Dossier[];
      const ids = list.map((d) => d.id);
      const [{ data: docs }, { data: answers }] = ids.length
        ? await Promise.all([sb.from("documents").select("*").in("dossier_id", ids), sb.from("dossier_answers").select("*").in("dossier_id", ids)])
        : [{ data: [] }, { data: [] }];
      setRows(list.map((d) => {
        const mine = ((docs ?? []) as DocFile[]).filter((x) => x.dossier_id === d.id);
        const p = progress(requirementGroups(d, mine, ((answers ?? []) as Answer[]).filter((a) => a.dossier_id === d.id)));
        return { dossier: d, ...p, fromMziane: mine.filter((x) => x.from_mziane).length };
      }));
    })();
  }, [userId]);

  const prenom = profile?.full_name.trim().split(/\s+/)[0];

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold tracking-tight text-zinc-900">
        {prenom ? `Bonjour ${prenom}` : "Bonjour"}
      </h1>
      <p className="mt-1 text-zinc-600">Vos dossiers <Ar>ملفاتي</Ar></p>

      {rows === null ? (
        <p className="mt-8 text-sm text-zinc-500" role="status">Chargement...</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 text-center max-sm:p-6">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700"><FolderOpen className="h-7 w-7" aria-hidden /></span>
          <h2 className="mt-4 text-lg font-bold text-zinc-900">Aucun dossier pour l&apos;instant</h2>
          <p className="mx-auto mt-1 max-w-[420px] text-[15px] text-zinc-600">Votre dossier apparaît ici dès que vous passez commande. Vous pourrez alors envoyer vos documents.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link href="/onboarding" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-amber-400 px-6 font-bold text-zinc-900 hover:bg-amber-300">Trouver ma solution <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/packs" className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 font-semibold text-zinc-800 hover:border-zinc-300">Voir les packs</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map(({ dossier: d, done, total, redo, fromMziane }) => {
            const todo = d.status !== "termine" && d.status !== "annule" && (done < total || redo > 0);
            return (
              <li key={d.id}>
                <Link href={`/espace/dossier/${d.id}`} className="group block rounded-3xl border border-zinc-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-[0_18px_40px_-20px_rgba(31,42,61,.25)] max-sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-zinc-900">{d.title}</h2>
                      <p className="mt-0.5 text-[13px] text-zinc-500">Réf. {d.reference} · {fmtDate(d.created_at)}</p>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  {total > 0 && (
                    <div className="mt-5">
                      <div className="mb-1.5 flex justify-between text-[13px]">
                        <span className="font-semibold text-zinc-700">Documents : {done} sur {total}</span>
                        {redo > 0 && <span className="font-semibold text-red-700">{redo} à renvoyer</span>}
                      </div>
                      <ProgressBar value={done} max={total} />
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[14px] text-zinc-600">
                      {fromMziane > 0 ? `${fromMziane} document${fromMziane > 1 ? "s" : ""} de Mziane à télécharger` : todo ? "Des pièces sont attendues" : "Rien à faire pour l'instant"}
                    </span>
                    <span className={todo ? "inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-900" : "inline-flex items-center gap-1.5 text-sm font-bold text-blue-700"}>
                      {todo ? <><FilePlus2 className="h-4 w-4" aria-hidden /> Ajouter mes documents</> : <>Ouvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden /></>}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
