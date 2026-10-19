"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { aides, categories, type AideCategorie } from "@/lib/aides";
import { waLink } from "@/lib/offers";

const rows = [
  ["Pour qui ?", "pourQui"],
  ["Ce que ça apporte", "apport"],
  ["Conditions", "conditions"],
  ["Démarche", "demarche"],
] as const;

// Catégorie présélectionnée depuis le menu : /aides?cat=agriculture
export function AidesCatalogueFromUrl() {
  const c = useSearchParams().get("cat");
  const initial = categories.some((x) => x.id === c) ? (c as AideCategorie) : "toutes";
  return <AidesCatalogue key={initial} initial={initial} />;
}

export default function AidesCatalogue({ initial = "toutes" }: { initial?: AideCategorie | "toutes" }) {
  const [cat, setCat] = useState<AideCategorie | "toutes">(initial);
  const [openId, setOpenId] = useState<string | null>(null);

  // Lien direct vers une fiche : /aides#A01
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!aides.some((a) => a.id === id)) return;
    const el = document.getElementById(id) as HTMLDetailsElement | null;
    if (!el) return;
    el.open = true; // onToggle met ensuite l'état à jour
    requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, []);

  const list = cat === "toutes" ? aides : aides.filter((a) => a.cat === cat);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Catégories d'aides">
        {[{ id: "toutes" as const, label: `Toutes (${aides.length})` }, ...categories.map((c) => ({ id: c.id, label: `${c.label} (${aides.filter((a) => a.cat === c.id).length})` }))].map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === c.id ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-500 hover:text-blue-700"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {list.map((a) => (
          <details
            key={a.id}
            id={a.id}
            open={openId === a.id}
            onToggle={(e) => (e.currentTarget.open ? setOpenId(a.id) : openId === a.id && setOpenId(null))}
            className="group scroll-mt-28 rounded-[18px] border border-zinc-200 bg-white px-5.5 transition open:border-blue-500/30 open:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block font-semibold text-zinc-900">{a.titre}</span>
                <span className="mt-0.5 block text-sm text-zinc-500">{a.organisme}</span>
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-600 transition-transform group-open:rotate-45">
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <dl className="grid gap-x-6 border-t border-zinc-200 pb-5 sm:grid-cols-[160px_1fr]">
              {rows.map(([label, key]) => (
                <div key={key} className="contents">
                  <dt className="pt-4 text-sm font-bold text-blue-700 sm:pb-0">{label}</dt>
                  <dd className="min-w-0 pt-1 text-[15px] leading-relaxed text-zinc-700 sm:pt-4">{a[key]}</dd>
                </div>
              ))}
              <dt className="pt-4 text-sm font-bold text-blue-700">Se renseigner</dt>
              <dd className="pt-1 text-[15px] text-zinc-700 sm:pt-4">{a.site}</dd>
            </dl>
            <div className="flex flex-col gap-2 border-t border-zinc-200 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-600">Nous vérifions si vous y avez droit, gratuitement.</p>
              <a
                href={waLink(`Bonjour, je voudrais savoir si j'ai droit à cette aide : ${a.titre} (${a.id}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                <MessageCircle className="h-4 w-4" /> Vérifier mon droit à cette aide
              </a>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
