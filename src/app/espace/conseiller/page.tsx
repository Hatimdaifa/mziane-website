"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEspace } from "@/components/espace/EspaceShell";
import { StatusBadge } from "@/components/espace/ui";
import { supabase } from "@/lib/supabase";
import { ANNULE, STATUTS, fmtDate, type DocFile, type Dossier, type DossierStatus, type Profile } from "@/lib/espace";

interface Row { d: Dossier; client: string; phone: string; toCheck: number }

export default function ConseillerPage() {
  const { profile } = useEspace();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<DossierStatus | "tous" | "a_verifier">("tous");

  useEffect(() => {
    if (profile?.role !== "conseiller") return;
    const sb = supabase();
    (async () => {
      const [{ data: dossiers }, { data: profiles }, { data: docs }] = await Promise.all([
        sb.from("dossiers").select("*").order("updated_at", { ascending: false }),
        sb.from("profiles").select("*"),
        sb.from("documents").select("dossier_id,status,from_mziane").eq("status", "recu").eq("from_mziane", false),
      ]);
      const ps = (profiles ?? []) as Profile[];
      setRows(((dossiers ?? []) as Dossier[]).map((d) => {
        const p = ps.find((x) => x.id === d.user_id);
        return {
          d,
          client: p?.full_name || d.summary.contact?.nom || "Client",
          phone: p?.phone || d.summary.contact?.tel || "",
          toCheck: ((docs ?? []) as Pick<DocFile, "dossier_id">[]).filter((x) => x.dossier_id === d.id).length,
        };
      }));
    })();
  }, [profile?.role]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows ?? []).filter((r) =>
      (filter === "tous" || (filter === "a_verifier" ? r.toCheck > 0 : r.d.status === filter))
      && (!s || [r.d.reference, r.d.title, r.client, r.phone].some((v) => v.toLowerCase().includes(s))));
  }, [rows, q, filter]);

  if (profile?.role !== "conseiller") return <p className="text-zinc-600">Cette page est réservée aux conseillers Mziane.</p>;

  const count = (f: typeof filter) => (rows ?? []).filter((r) => (f === "tous" ? true : f === "a_verifier" ? r.toCheck > 0 : r.d.status === f)).length;
  const filters: { id: typeof filter; label: string }[] = [
    { id: "tous", label: "Tous" },
    { id: "a_verifier", label: "Pièces à vérifier" },
    ...[...STATUTS, ANNULE].map((s) => ({ id: s.id, label: s.label })),
  ];

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold tracking-tight text-zinc-900">Tous les dossiers</h1>
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Référence, nom, téléphone" aria-label="Rechercher un dossier"
          className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-[15px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
            className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold transition", filter === f.id ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-500")}>
            {f.label} <span className="tabular-nums opacity-75">{count(f.id)}</span>
          </button>
        ))}
      </div>

      {rows === null ? <p className="mt-6 text-sm text-zinc-500" role="status">Chargement...</p> : shown.length === 0 ? (
        <p className="mt-6 text-zinc-600">Aucun dossier.</p>
      ) : (
        <ul className="mt-5 grid gap-3">
          {shown.map((r) => (
            <li key={r.d.id}>
              <Link href={`/espace/dossier/${r.d.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:border-blue-500">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-zinc-900">{r.client} <span className="font-normal text-zinc-500">· {r.d.title}</span></span>
                  <span className="block text-[13px] text-zinc-500">Réf. {r.d.reference} · mis à jour le {fmtDate(r.d.updated_at, true)}</span>
                </span>
                {r.toCheck > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{r.toCheck} à vérifier</span>}
                <StatusBadge status={r.d.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
