// Blocs communs aux pages intérieures (construction inspirée du site Hoplion)
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Bandeau d'en-tête en dégradé ────────────────────────────────────────────
export function PageHero({ icon: Icon, tag, title, subtitle, children, note }: {
  icon: LucideIcon; tag: string; title: string; subtitle: string; children?: React.ReactNode; note?: string;
}) {
  return (
    <section className="relative -mt-[76px] overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 pt-[calc(76px+64px)] pb-20 text-center max-sm:pb-14">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(254,215,102,.22)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(254,74,73,.16)_0%,transparent_65%)]" />
      <div className="relative z-10 mx-auto max-w-[860px] px-6">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold text-white">
          <Icon className="h-3.5 w-3.5" /> {tag}
        </span>
        <h1 className="mb-5 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.03em] text-white text-balance">{title}</h1>
        <p className="mx-auto max-w-[620px] text-lg leading-relaxed text-white/80">{subtitle}</p>
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
        {note && <p className="mt-4 text-[13px] text-white/65">{note}</p>}
      </div>
    </section>
  );
}

export function HeroButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold transition hover:-translate-y-0.5",
        variant === "primary" ? "bg-amber-400 text-zinc-900 shadow-[0_17px_20px_-8px_rgba(0,0,0,.25)] hover:bg-amber-300" : "border-2 border-white/70 text-white hover:bg-white hover:text-blue-700"
      )}
    >
      {children}
    </Link>
  );
}

// ── Titre de section ────────────────────────────────────────────────────────
export function SectionHeader({ tag, title, subtitle, tagClass = "bg-blue-50 text-blue-700", left = false }: {
  tag?: React.ReactNode; title: string; subtitle?: string; tagClass?: string; left?: boolean;
}) {
  return (
    <div className={cn("mb-12", left ? "text-left" : "text-center")}>
      {tag && <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold", tagClass)}>{tag}</span>}
      <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900 text-balance">{title}</h2>
      {subtitle && <p className={cn("mt-3 max-w-[620px] text-[17px] text-zinc-600", !left && "mx-auto")}>{subtitle}</p>}
    </div>
  );
}

// ── Grille de cartes à icône ────────────────────────────────────────────────
const tints = ["bg-blue-50 text-blue-700", "bg-amber-100 text-amber-800", "bg-red-50 text-red-600"];

export function FeatureGrid({ items, cols = 3, onGray = false }: { items: { icon: LucideIcon; title: string; desc: string }[]; cols?: 2 | 3 | 4; onGray?: boolean }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")}>
      {items.map(({ icon: Icon, title, desc }, n) => (
        <div key={title} className={cn("rounded-3xl p-6 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]", onGray ? "border border-zinc-200 bg-white" : "bg-zinc-50")}>
          <div className={cn("mb-5 grid h-[42px] w-14 place-items-center rounded-full", tints[n % 3])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="mb-2 text-lg font-bold text-zinc-900">{title}</div>
          <p className="text-[15px] leading-relaxed text-zinc-600">{desc}</p>
        </div>
      ))}
    </div>
  );
}

// ── Liste à coches ──────────────────────────────────────────────────────────
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-2.5", className)}>
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-[15px] text-zinc-700">
          <Check className="mt-1 h-4 w-4 shrink-0 text-blue-500" strokeWidth={2.5} />
          {f}
        </li>
      ))}
    </ul>
  );
}

// ── Carte tarifaire ─────────────────────────────────────────────────────────
export interface Tier {
  name: string;
  price: string;
  unit?: string;
  pill: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

export function PriceCard({ tier, icon: Icon }: { tier: Tier; icon: LucideIcon }) {
  const amount = tier.price.match(/^([\d\s]+)\s*DH$/);
  return (
    <div className={cn(
      "relative flex flex-col rounded-3xl border bg-white p-7 transition duration-300 hover:-translate-y-1",
      tier.popular ? "border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-[0_24px_48px_-16px_rgba(0,132,153,.35)]" : "border-zinc-200 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.15)]"
    )}>
      {tier.popular && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
          <Star className="h-3 w-3" /> Le plus choisi
        </span>
      )}
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className={cn("grid h-11 w-11 place-items-center rounded-xl", tier.popular ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700")}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-right text-lg font-bold text-zinc-900">{tier.name}</span>
      </div>
      <div className="mb-3 flex items-baseline gap-1.5">
        {amount ? (
          <>
            <span className="text-[2.6rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{amount[1].trim()}</span>
            <span className="text-lg font-bold text-zinc-900">DH</span>
          </>
        ) : (
          <span className="text-[2.1rem] font-extrabold leading-none tracking-tight text-zinc-900">{tier.price}</span>
        )}
        {tier.unit && <span className="text-sm text-zinc-500">{tier.unit}</span>}
      </div>
      <span className="mb-4 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{tier.pill}</span>
      <p className="mb-5 border-b border-zinc-200 pb-5 text-[15px] leading-relaxed text-zinc-600">{tier.desc}</p>
      <CheckList items={tier.features} className="mb-7 flex-1 content-start" />
      <Link
        href={tier.href}
        className={cn(
          "rounded-xl py-3 text-center text-[15px] font-semibold transition",
          tier.popular ? "bg-blue-600 text-white shadow-[0_10px_20px_-8px_rgba(0,132,153,.5)] hover:bg-blue-700" : "bg-zinc-900 text-white hover:bg-zinc-800"
        )}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto grid max-w-[820px] gap-3">
      {items.map(({ q, a }) => (
        <details key={q} className="group rounded-[18px] border border-zinc-200 bg-white px-5.5 transition open:border-blue-500/30 open:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
            {q}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-600 transition-transform group-open:rotate-45">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="pb-5 text-[15px] leading-relaxed text-zinc-600">{a}</p>
        </details>
      ))}
    </div>
  );
}

// ── Bandeau d'appel à l'action ──────────────────────────────────────────────
export function CtaBand({ title, subtitle, href, label }: { title: string; subtitle: string; href: string; label: string }) {
  return (
    <section className="bg-white py-20 max-md:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-zinc-900 px-10 py-14 text-center max-sm:px-6 max-sm:py-10">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,159,183,.35)_0%,transparent_65%)]" />
          <h2 className="relative mb-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold tracking-tight text-white text-balance">{title}</h2>
          <p className="relative mx-auto mb-8 max-w-[560px] text-lg text-white/65">{subtitle}</p>
          <Link href={href} className="relative inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-amber-300">
            {label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Pages légales ───────────────────────────────────────────────────────────
export function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="relative -mt-[76px] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 pt-[calc(76px+56px)] pb-14 text-center">
        <h1 className="px-6 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/70">{updated}</p>
      </section>
      <div className="bg-zinc-50 py-14">
        <article className="mx-auto max-w-[760px] rounded-3xl border border-zinc-200 bg-white px-8 py-10 max-sm:mx-4 max-sm:px-5 [&_a]:font-semibold [&_a]:text-blue-700 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-900 [&_p]:leading-relaxed [&_p]:text-zinc-600 [&_section]:mb-8 [&_section:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-zinc-600">
          {children}
        </article>
      </div>
    </>
  );
}
