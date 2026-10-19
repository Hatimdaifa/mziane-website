// Briques d'affichage des offres et des packs, partagées par toutes les pages.
// Les données viennent toutes de src/lib/offers.ts.
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, Gift, Landmark, PiggyBank, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tier } from "@/components/site";
import {
  FRAIS_ETAT, type Offer, type Pack, fmt, fmtDH, packSavings, packSavingsUpfront, packTotal, packValue,
} from "@/lib/offers";

// ── Pastilles ───────────────────────────────────────────────────────────────
export function SavingsPill({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800", className)}>
      <PiggyBank className="h-3.5 w-3.5" /> {fmtDH(amount)} économisés
    </span>
  );
}

export function FreebiePill({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-200", className)}>
      <Gift className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

/** Rappel des frais d'État, affichés à part de nos honoraires. */
export function OfficialFeesNote({ kind = "societe", compact = false, className }: { kind?: "societe" | "auto"; compact?: boolean; className?: string }) {
  const text = kind === "auto"
    ? FRAIS_ETAT.autoEntrepreneur.note
    : compact
      ? `Frais d'État en sus, environ ${fmtDH(FRAIS_ETAT.societe.estimate)}, reversés sans marge.`
      : `Frais d'État en sus, au réel et sans marge : environ ${fmtDH(FRAIS_ETAT.societe.estimate)} pour une SARL (${FRAIS_ETAT.societe.range}).`;
  return (
    <p className={cn("flex items-start gap-2 rounded-xl bg-zinc-50 px-3 py-2.5 text-[13px] leading-snug text-zinc-600", className)}>
      <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" /> {text}
    </p>
  );
}

// ── Offre unitaire vers carte tarifaire ─────────────────────────────────────
export function offerToTier(o: Offer, href: string, cta?: string): Tier {
  const unit = o.billing === "month" ? `${o.tax} / mois` : o.billing === "year" ? `${o.tax} / an` : o.price ? o.tax : undefined;
  return {
    name: o.name,
    price: o.price === null ? (o.priceLabel ?? "Sur devis") : o.price === 0 ? "Gratuit" : `${fmt(o.price)} DH`,
    unit,
    pill: o.pill,
    desc: o.desc,
    features: o.features,
    cta: cta ?? (o.price === 0 ? "Commencer" : `Choisir ${o.name}`),
    href,
    popular: o.popular,
  };
}

// ── Carte tarifaire accessible (même entrée que PriceCard de site.tsx) ─────
/** Variante de PriceCard : texte blanc uniquement sur blue-700, focus visible, mise en avant optionnelle. */
export function OfferCard({ tier, icon: Icon, badge = "Recommandé", note, className }: {
  tier: Tier; icon: LucideIcon; badge?: string; note?: React.ReactNode; className?: string;
}) {
  const amount = tier.price.match(/^([\d\s\u202f\u00a0]+)\s*DH$/);
  const hl = tier.popular;
  const external = tier.href.startsWith("http");
  return (
    <article className={cn(
      "relative flex flex-col rounded-3xl border bg-white p-7 transition duration-300 hover:-translate-y-1 max-sm:p-6",
      hl ? "border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-[0_24px_48px_-16px_rgba(0,132,153,.35)]" : "border-zinc-200 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.15)]",
      className,
    )}>
      {hl && (
        <span className="absolute inset-x-0 -top-3.5 mx-auto inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
          <Star className="h-3 w-3" /> {badge}
        </span>
      )}
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", hl ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700")}>
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-right text-lg font-bold text-zinc-900">{tier.name}</h3>
      </div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-1.5" dir="ltr">
        {amount ? (
          <>
            <span className="text-[2.5rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{amount[1].trim()}</span>
            <span className="text-lg font-bold text-zinc-900">DH</span>
          </>
        ) : (
          <span className="text-[2rem] font-extrabold leading-none tracking-tight text-zinc-900">{tier.price}</span>
        )}
        {tier.unit && <span className="text-sm text-zinc-500">{tier.unit}</span>}
      </div>
      <span className="mb-4 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{tier.pill}</span>
      <p className="mb-5 border-b border-zinc-200 pb-5 text-[15px] leading-relaxed text-zinc-600">{tier.desc}</p>
      <ul className="mb-7 grid flex-1 content-start gap-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[15px] text-zinc-700">
            <Check className="mt-1 h-4 w-4 shrink-0 text-blue-700" strokeWidth={2.5} aria-hidden /> {f}
          </li>
        ))}
      </ul>
      {note && <div className="-mt-3 mb-5 text-[13px] leading-snug text-zinc-500">{note}</div>}
      <Link
        href={tier.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
          hl ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-zinc-900 text-white hover:bg-zinc-800",
        )}
      >
        {tier.cta} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}

// ── Carte de pack ───────────────────────────────────────────────────────────
export type PackPayment = "monthly" | "upfront";

export function PackCard({ pack, href, icon: Icon, cta = "Choisir ce pack", highlighted, className, payment = "monthly", badge = "Recommandé" }: {
  pack: Pack; href: string; icon?: LucideIcon; cta?: string; highlighted?: boolean; className?: string;
  /** Affichage du prix : mensualités (défaut) ou payé d'avance quand le pack le permet. */
  payment?: PackPayment;
  /** Texte de la pastille du pack mis en avant. */
  badge?: string;
}) {
  const hl = highlighted ?? pack.popular;
  const value = packValue(pack);
  const upfront = payment === "upfront" && pack.upfront ? pack.upfront : undefined;
  const savings = upfront ? packSavingsUpfront(pack) : packSavings(pack);
  const big = upfront ?? pack.once ?? pack.monthly ?? 0;
  return (
    <article className={cn(
      "relative flex flex-col rounded-[28px] border bg-white p-7 transition duration-300 hover:-translate-y-1 max-sm:p-6",
      hl ? "border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-[0_24px_48px_-16px_rgba(0,132,153,.35)]" : "border-zinc-200 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.15)]",
      className,
    )}>
      {hl && (
        <span className="absolute inset-x-0 -top-3.5 mx-auto inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
          <Star className="h-3 w-3" aria-hidden /> {badge}
        </span>
      )}
      <div className="mb-1 flex items-center gap-3">
        {Icon && <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", hl ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700")}><Icon className="h-5 w-5" aria-hidden /></span>}
        <span>
          <span className="block text-xl font-extrabold tracking-tight text-zinc-900">Pack {pack.name}</span>
          <span className="block text-sm text-zinc-500">{pack.audience}</span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1" dir="ltr">
        <span className="text-[2.5rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{fmt(big)}</span>
        <span className="text-lg font-bold text-zinc-900">DH</span>
        <span className="text-sm text-zinc-500">{pack.tax}{upfront ? ` pour ${pack.months} mois` : pack.monthly ? " / mois" : ""}</span>
        <span className="text-sm text-zinc-500 line-through"><span className="sr-only">au lieu de </span>{fmtDH(value)}</span>
      </div>
      <p className="mt-1.5 text-[13px] text-zinc-500">
        {upfront
          ? <>Payé en une fois, soit {fmtDH(upfront / (pack.months ?? 12))} par mois au lieu de {fmtDH(pack.monthly ?? 0)}</>
          : pack.monthly
            ? <>Pendant {pack.months} mois, soit {fmtDH(packTotal(pack))} au total{pack.upfront ? <>, ou {fmtDH(pack.upfront)} payés d&apos;avance</> : null}</>
            : pack.conditions.split(".")[0]}
      </p>
      {payment === "upfront" && !pack.upfront && pack.monthly && (
        <p className="mt-1 text-[12px] font-semibold text-zinc-600">Ce pack se règle uniquement au mois.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {pack.freebie && <FreebiePill label={pack.freebie} />}
        {savings > 0 && <SavingsPill amount={savings} />}
      </div>

      <ul className="mt-5 grid flex-1 content-start gap-2 border-t border-zinc-200 pt-5 text-[14px]">
        {pack.items.map((i) => (
          <li key={i.label} className="flex justify-between gap-3">
            <span className="text-zinc-700">{i.label}</span>
            <span className="shrink-0 tabular-nums">
              {i.offered ? <><span className="text-zinc-500 line-through"><span className="sr-only">valeur </span>{fmt(i.value)}</span> <span className="font-semibold text-red-700">offert</span></> : <span className="text-zinc-500">{fmt(i.value)}</span>}
            </span>
          </li>
        ))}
        {pack.extra && <li className="text-[13px] font-semibold text-blue-700">{pack.extra}</li>}
      </ul>

      <Link
        href={href}
        className={cn(
          "mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
          hl ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-zinc-900 text-white hover:bg-zinc-800",
        )}
      >
        {cta} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">{pack.monthly ? pack.conditions : pack.conditions.split(".").slice(1).join(".").trim()}</p>
    </article>
  );
}
