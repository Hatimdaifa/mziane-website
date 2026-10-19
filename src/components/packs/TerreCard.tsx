import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDH, packTerre } from "@/lib/offers";
import { TERRE_HREF } from "./links";

/** Carte du pack Terre : rémunération au résultat, 0 DH si refus. */
export function TerreCard({ className }: { className?: string }) {
  return (
    <article className={cn("relative flex flex-col rounded-[28px] border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-7 max-sm:p-6", className)}>
      <span className="absolute inset-x-0 -top-3.5 mx-auto inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-300">
        <ShieldCheck className="h-3 w-3" aria-hidden /> 0 DH si refus
      </span>
      <div className="mb-1 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800"><Sprout className="h-5 w-5" aria-hidden /></span>
        <span>
          <span className="block text-xl font-extrabold tracking-tight text-zinc-900">Pack {packTerre.name}</span>
          <span className="block text-sm text-zinc-500">{packTerre.audience}</span>
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2" dir="ltr">
        <span className="text-[2.5rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{Math.round(packTerre.taux * 100)} %</span>
        <span className="text-sm text-zinc-600">de la subvention versée</span>
      </div>
      <p className="mt-1.5 text-[13px] text-zinc-500">Minimum {fmtDH(packTerre.min)} HT, payés seulement à la notification de paiement.</p>
      <ul className="mt-5 grid flex-1 content-start gap-2.5 border-t border-amber-200 pt-5">
        {packTerre.items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] text-zinc-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" strokeWidth={2.5} aria-hidden /> {i}
          </li>
        ))}
      </ul>
      <Link
        href={TERRE_HREF}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-[15px] font-bold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
      >
        Vérifier mon éligibilité <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">{packTerre.conditions}</p>
    </article>
  );
}
