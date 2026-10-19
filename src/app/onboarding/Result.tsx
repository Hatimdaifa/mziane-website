"use client";

// Page résultat du questionnaire : « Votre plan Mziane », trois choix, aides, prochaines étapes.
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Gift, HandCoins, MessageCircle, PiggyBank, RotateCcw, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROMESSES, fmtDH, offerById, waLink } from "@/lib/offers";
import { commandeHref } from "@/components/order/model";
import { buildPlan, type PlanChoice } from "./plan";
import { summaryLines, type Answers } from "./questions";

export default function Result({ answers, onRestart, onBack }: { answers: Answers; onRestart: () => void; onBack: () => void }) {
  const plan = buildPlan(answers);
  const [withAides, setWithAides] = useState(false);
  const rec = plan.choices.find((c) => c.recommended) ?? plan.choices[0];
  const canAddAides = plan.aides.length > 0 && plan.choices.some((c) => !c.aidesIncluded);
  const dossier = offerById("aides-dossier");
  const href = (c: PlanChoice) => commandeHref({ ...c.link, aides: withAides && !c.aidesIncluded ? true : c.link.aides });

  const wa = [
    "Bonjour Mziane, j'ai répondu au questionnaire.", "",
    ...summaryLines(answers).map((l) => `- ${l}`), "",
    rec ? `Plan recommandé : ${rec.title} (${rec.price}${rec.unit ? ` ${rec.unit}` : ""})` : "",
    ...(plan.aides.length ? ["", "Aides repérées :", ...plan.aides.map((x) => `- ${x.titre}`)] : []),
    "", "Pouvez-vous me conseiller ?",
  ].join("\n");

  const steps = [
    { t: "Vous validez votre commande", d: "Récapitulatif clair, puis vos coordonnées. Pas de compte à créer." },
    { t: "Un conseiller vous confirme tout", d: "Sur WhatsApp ou par téléphone, il vérifie votre dossier avec vous." },
    { t: "Vous recevez le lien de paiement", d: PROMESSES.paiement },
    { t: "On lance vos démarches", d: "Vous suivez chaque étape avec votre conseiller jusqu'au bout." },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-blue-700">
        <Sparkles className="h-3.5 w-3.5" /> D&apos;après vos réponses
      </span>
      <h1 className="mt-4 text-[clamp(1.9rem,4.5vw,2.7rem)] font-extrabold leading-tight tracking-tight text-zinc-900">Votre plan Mziane</h1>

      {plan.reasons.length > 0 && (
        <ul className="mt-5 grid gap-2.5">
          {plan.reasons.map((r) => (
            <li key={r} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-zinc-700">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-700 text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
              {r}
            </li>
          ))}
        </ul>
      )}

      {/* Les choix : le recommandé au centre sur ordinateur, en premier sur mobile */}
      <div className={cn("mt-10 grid gap-5", plan.choices.length === 3 && "lg:grid-cols-3", plan.choices.length === 2 && "md:grid-cols-2", plan.choices.length === 1 && "mx-auto max-w-[460px]")}>
        {plan.choices.map((c) => <ChoiceCard key={c.key} choice={c} href={href(c)} withAides={withAides && !c.aidesIncluded} />)}
      </div>
      {plan.note && <p className="mt-4 text-[13px] text-zinc-500">{plan.note}</p>}

      {plan.aides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            {plan.aides.length} aide{plan.aides.length > 1 ? "s" : ""} pour votre situation
          </h2>
          <p className="mt-2 text-zinc-600">D&apos;après vos réponses, vous pourriez y avoir droit. On vérifie chaque condition avec vous avant de monter le dossier.</p>

          {canAddAides && (
            <label className={cn("mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition", withAides ? "border-blue-700 bg-blue-50" : "border-zinc-200 bg-white hover:border-blue-500")}>
              <input type="checkbox" checked={withAides} onChange={(e) => setWithAides(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700" />
              <span className="flex-1">
                <span className="block font-semibold text-zinc-900">Ajouter le dossier d&apos;aides à mon plan</span>
                <span className="block text-[14px] text-zinc-600">{dossier?.priceLabel} de l&apos;aide versée, payés seulement au versement. <span className="font-semibold text-red-700">0 DH si refus.</span></span>
              </span>
              <HandCoins className="h-5 w-5 shrink-0 text-blue-700" />
            </label>
          )}

          <div className="mt-5 grid gap-3">
            {plan.aides.map((x) => (
              <Link key={x.id} href={`/aides#${x.id}`} className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_-8px_rgba(31,42,61,.18)]">
                <span className="block font-bold text-zinc-900 group-hover:text-blue-700">{x.titre}</span>
                <span className="mt-1 block text-sm text-zinc-500">{x.organisme}</span>
                <span className="mt-2 line-clamp-3 block text-[15px] leading-relaxed text-zinc-700">{x.apport}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-500">Montants indicatifs, susceptibles d&apos;évoluer selon les textes en vigueur. {PROMESSES.societePrivee}</p>
        </section>
      )}

      {/* Ce qui se passe ensuite */}
      <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 max-sm:p-5">
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">Ce qui se passe ensuite</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex gap-3 md:flex-col">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">{i + 1}</span>
              <span>
                <span className="block font-semibold text-zinc-900">{s.t}</span>
                <span className="mt-0.5 block text-[14px] leading-snug text-zinc-600">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        {rec && (
          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row">
            <Link href={href(rec)} className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 font-bold text-zinc-900 transition hover:bg-amber-300">
              Continuer avec {rec.title} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={waLink(wa)} target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-zinc-300 px-6 py-3.5 font-semibold text-zinc-800 transition hover:border-zinc-400">
              <MessageCircle className="h-4 w-4" /> Poser une question sur WhatsApp
            </a>
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-zinc-500 underline hover:text-zinc-800"><ArrowLeft className="h-3.5 w-3.5" /> Modifier ma dernière réponse</button>
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-1.5 text-zinc-500 underline hover:text-zinc-800"><RotateCcw className="h-3.5 w-3.5" /> Recommencer</button>
      </div>
    </div>
  );
}

function ChoiceCard({ choice: c, href, withAides }: { choice: PlanChoice; href: string; withAides: boolean }) {
  const hl = c.recommended;
  return (
    <article className={cn(
      "relative flex flex-col rounded-3xl border bg-white p-6 transition duration-300",
      hl ? "border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-[0_24px_48px_-16px_rgba(0,132,153,.35)] max-lg:order-first lg:-my-2 lg:py-8" : "border-zinc-200",
    )}>
      {hl && (
        <span className="absolute inset-x-0 -top-3.5 mx-auto inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
          <Star className="h-3 w-3" /> Recommandé pour vous
        </span>
      )}
      {!hl && <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">{c.kicker}</span>}
      <h3 className={cn("text-xl font-extrabold tracking-tight text-zinc-900", !hl && "mt-1")}>{c.title}</h3>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1" dir="ltr">
        <span className="text-[2.2rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{c.price}</span>
        {c.unit && <span className="text-sm text-zinc-500">{c.unit}</span>}
        {c.strike && <span className="text-sm text-zinc-500 line-through"><span className="sr-only">au lieu de </span>{c.strike}</span>}
      </div>
      {c.sub && <p className="mt-1.5 text-[13px] leading-snug text-zinc-500">{c.sub}</p>}
      {(c.freebie || c.savings) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {c.freebie && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-200"><Gift className="h-3.5 w-3.5" /> {c.freebie}</span>}
          {c.savings ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800"><PiggyBank className="h-3.5 w-3.5" /> {fmtDH(c.savings)} économisés</span> : null}
        </div>
      )}
      <ul className="mt-4 grid flex-1 content-start gap-2 border-t border-zinc-200 pt-4 text-[14px]">
        {c.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-zinc-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />{b}</li>
        ))}
        {withAides && <li className="flex items-start gap-2 font-semibold text-red-700"><Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />Dossier d&apos;aides, 0 DH si refus</li>}
      </ul>
      <Link
        href={href}
        className={cn(
          "mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition",
          hl ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "border border-zinc-300 text-zinc-800 hover:border-zinc-500",
        )}
      >
        {hl ? "Continuer" : "Choisir"} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
