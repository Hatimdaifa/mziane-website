// Briques des pages de services (création, comptabilité, gestion, aides, expatriation).
// Aucune donnée ici : tous les prix viennent de src/lib/offers.ts.
import type { LucideIcon } from "lucide-react";
import { Landmark, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FRAIS_ETAT, PROMESSES, type FormeId, fmt, fmtDH, waLink } from "@/lib/offers";

// ── Liens de commande ───────────────────────────────────────────────────────
export function commandeOffre(offre: string, forme?: FormeId, opt?: string[]) {
  const q = new URLSearchParams({ offre });
  if (forme) q.set("forme", forme);
  if (opt?.length) q.set("opt", opt.join(","));
  return `/commande?${q.toString()}`;
}

export function commandePack(pack: string, forme?: FormeId) {
  const q = new URLSearchParams({ pack });
  if (forme) q.set("forme", forme);
  return `/commande?${q.toString()}`;
}

// ── Bandeau de réassurance (sous le hero) ───────────────────────────────────
export function TrustStrip({ items }: { items: { icon: LucideIcon; title: string; desc: string }[] }) {
  return (
    <section className="border-b border-zinc-200 bg-white py-10">
      <ul className="mx-auto grid max-w-[1100px] gap-x-6 gap-y-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block font-bold text-zinc-900">{title}</span>
              <span className="block text-sm leading-snug text-zinc-600">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Décomposition des frais d'État d'une société ────────────────────────────
export function FeesBreakdown({ className }: { className?: string }) {
  const f = FRAIS_ETAT.societe;
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-zinc-200 bg-white", className)}>
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-4">
        <Landmark className="h-5 w-5 shrink-0 text-zinc-600" />
        <span className="font-bold text-zinc-900">Frais d&apos;État d&apos;une SARL ou SARLAU</span>
      </div>
      <ul>
        {f.lines.map((l) => (
          <li key={l.label} className="flex items-baseline justify-between gap-4 border-b border-zinc-100 px-6 py-3.5 text-[15px]">
            <span className="text-zinc-700">{l.label}</span>
            <span className="shrink-0 text-right tabular-nums">
              <span className="font-semibold text-zinc-900">{fmtDH(l.amount)}</span>
              {l.range && <span className="block text-xs text-zinc-500">de {l.range} DH</span>}
            </span>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-4 bg-blue-50 px-6 py-4">
          <span className="font-bold text-zinc-900">Total estimé</span>
          <span className="text-right tabular-nums">
            <span className="text-lg font-extrabold text-zinc-900">{fmtDH(f.estimate)}</span>
            <span className="block text-xs text-zinc-600">de {f.range}</span>
          </span>
        </li>
      </ul>
      <p className="px-6 py-4 text-sm leading-relaxed text-zinc-600">
        Payés au réel, sans marge. {f.note}
      </p>
    </div>
  );
}

// ── Mentions obligatoires des pages d'aides ─────────────────────────────────
export function PromessesAides({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-3", className)}>
      {[PROMESSES.societePrivee, PROMESSES.sansInteret, PROMESSES.zeroRefus].map((t) => (
        <p key={t} className="flex items-start gap-2.5 rounded-3xl border border-zinc-200 bg-white p-5 text-[15px] leading-snug text-zinc-700">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> {t}
        </p>
      ))}
    </div>
  );
}

// ── Bouton WhatsApp ─────────────────────────────────────────────────────────
export function WaButton({ text, children, variant = "dark", icon: Icon = MessageCircle, className }: {
  text: string; children: React.ReactNode; variant?: "dark" | "amber" | "light"; icon?: LucideIcon; className?: string;
}) {
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold transition hover:-translate-y-0.5",
        variant === "dark" && "bg-zinc-900 text-white hover:bg-zinc-800",
        variant === "amber" && "bg-amber-400 text-zinc-900 hover:bg-amber-300",
        variant === "light" && "border border-zinc-200 bg-white text-zinc-900 hover:border-blue-500",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" /> {children}
    </a>
  );
}

// ── Prix en ligne (formalités, extras) ──────────────────────────────────────
export function PriceTag({ amount, tax = "HT", unit }: { amount: number; tax?: string; unit?: string }) {
  return (
    <span className="whitespace-nowrap tabular-nums">
      <span className="text-2xl font-extrabold tracking-tight text-zinc-900">{fmt(amount)}</span>{" "}
      <span className="text-sm font-bold text-zinc-900">DH</span>{" "}
      <span className="text-sm text-zinc-500">{tax}{unit ? ` ${unit}` : ""}</span>
    </span>
  );
}
