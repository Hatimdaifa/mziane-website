"use client";

// Bibliothèque des fiches procédures : une fiche par offre, à suivre étape par étape ou à imprimer.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEspace } from "@/components/espace/EspaceShell";
import { GROUPS, procedureById, stepCount } from "@/lib/procedures";

export default function ProceduresPage() {
  const { profile } = useEspace();
  if (profile?.role !== "conseiller") return <p className="text-zinc-600">Cette page est réservée aux conseillers Mziane.</p>;

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold tracking-tight text-zinc-900">Fiches procédures</h1>
      <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-zinc-600">
        Comment réaliser chaque offre, étape par étape : où aller, quoi déposer, combien ça coûte, quand appeler le cabinet comptable.
        Dans un dossier client, la bonne fiche s&apos;affiche toute seule avec les cases à cocher.
      </p>
      {GROUPS.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">{g.title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {g.ids.map(procedureById).filter((p) => !!p).map((p) => (
              <li key={p!.id}>
                <Link href={`/espace/conseiller/procedures/${p!.id}`} className="group flex h-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-blue-500">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-zinc-900">{p!.title}</span>
                    <span className="mt-0.5 block text-[13px] text-zinc-500">{stepCount(p!)} étapes{p!.duree ? ` · ${p!.duree}` : ""}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
