"use client";

// Parcours de commande : 1 Offre, 2 Récapitulatif, 3 Coordonnées.
// Pas de paiement en ligne : la commande part sur WhatsApp, un conseiller confirme et envoie le lien de paiement.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, Copy, Gift, Landmark, Lock, Mail, MessageCircle, Phone,
  PiggyBank, ShieldCheck, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PRIX_CREATION, PROMESSES, compta, comptaParForme, creationAE, creationSociete, fmtDH, mailLink,
  offerById, packValue, packTerre, packs, waLink, type FormeId,
} from "@/lib/offers";
import { PackCard } from "@/components/offer-ui";
import {
  EMPTY_CONTACT, PAY_LABELS, PREF_LABELS, WEB_IDS, availableOptions, baseKey, buildMessage, commandeHref, compute,
  creationFor, defaultForme, defaultMode, emailValid, formeChoices, formeLabel, isCreationOffer, makeReference, parseSpec,
  payChoices, phoneValid, recurringText, resolveBase, upgradeFor, type Base, type Contact, type OrderSpec, type PayMode,
} from "./model";
import { readJSON, useHydrated, writeJSON } from "./storage";

const DRAFT_KEY = "mziane-commande-v1";

interface Draft { baseKey?: string; forme?: FormeId; opts?: string[]; mode?: PayMode; offreId?: string; contact?: Contact }

const INDICATIFS = [
  { v: "+212", l: "Maroc +212" }, { v: "+33", l: "France +33" }, { v: "+32", l: "Belgique +32" }, { v: "+34", l: "Espagne +34" },
  { v: "+39", l: "Italie +39" }, { v: "+31", l: "Pays-Bas +31" }, { v: "+49", l: "Allemagne +49" }, { v: "+41", l: "Suisse +41" },
  { v: "+44", l: "Royaume-Uni +44" }, { v: "+1", l: "Canada, États-Unis +1" }, { v: "+971", l: "Émirats +971" }, { v: "+966", l: "Arabie saoudite +966" },
];

const STEPS = ["Offre", "Récapitulatif", "Coordonnées"] as const;

// ── Entrée ──────────────────────────────────────────────────────────────────
export default function OrderFlow() {
  const hydrated = useHydrated();
  const sp = useSearchParams();
  if (!hydrated) return <Skeleton />;
  const spec = parseSpec(sp);
  const base = resolveBase(spec);
  if (!base) return <NoOffer invalid={!!(spec.packId || spec.offreId || sp.get("formalite"))} />;
  return <Order key={sp.toString()} spec={spec} base={base} />;
}

function Skeleton() {
  return (
    <div className="min-h-[70vh] bg-zinc-50">
      <div className="mx-auto max-w-[1120px] px-4 pt-10 sm:px-6">
        <div className="h-9 w-64 animate-pulse rounded-xl bg-zinc-200" />
        <div className="mt-8 h-80 animate-pulse rounded-3xl bg-white" />
      </div>
    </div>
  );
}

// ── Commande ────────────────────────────────────────────────────────────────
function Order({ spec, base: urlBase }: { spec: OrderSpec; base: Base }) {
  const [draft] = useState<Draft | null>(() => {
    const d = readJSON<Draft>(DRAFT_KEY);
    return d && typeof d === "object" ? d : null;
  });
  const sameBase = draft?.baseKey === baseKey(urlBase);

  // Palier de création modifiable (Essentiel, Standard, Premium)
  const [offreId, setOffreId] = useState<string | undefined>(() =>
    urlBase.kind === "items" && isCreationOffer(urlBase.offer?.id) ? (sameBase && isCreationOffer(draft?.offreId) ? draft!.offreId : urlBase.offer!.id) : undefined,
  );
  const base: Base = useMemo(() => {
    if (urlBase.kind === "items" && offreId) {
      const o = offerById(offreId);
      if (o) return { ...urlBase, offer: o };
    }
    return urlBase;
  }, [urlBase, offreId]);

  const [forme, setForme] = useState<FormeId | undefined>(() => defaultForme(urlBase, spec.forme ?? (sameBase ? draft?.forme : undefined)));
  const [opts, setOpts] = useState<string[]>(() => {
    const wanted = spec.opts.length ? spec.opts : sameBase ? (draft?.opts ?? []) : [];
    const avail = availableOptions(urlBase, defaultForme(urlBase, spec.forme), wanted.find((w) => compta.some((c) => c.id === w)));
    return wanted.filter((w) => avail.some((a) => a.id === w));
  });
  const [mode, setMode] = useState<PayMode>(() => defaultMode(urlBase, spec.mode ?? (sameBase ? draft?.mode : undefined)));
  const [contact, setContact] = useState<Contact>(() => ({ ...EMPTY_CONTACT, ...(draft?.contact ?? {}) }));
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmed, setConfirmed] = useState<{ reference: string; message: string } | null>(null);

  const key = baseKey(urlBase);
  useEffect(() => {
    writeJSON(DRAFT_KEY, { baseKey: key, forme, opts, mode, offreId, contact } satisfies Draft);
  }, [key, forme, opts, mode, offreId, contact]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, confirmed]);

  const comptaWanted = opts.find((o) => compta.some((c) => c.id === o));
  const options = availableOptions(base, forme, comptaWanted);
  const activeOpts = opts.filter((o) => options.some((a) => a.id === o));
  const c = compute(base, forme, activeOpts, mode);
  const upgrade = upgradeFor(base, forme, activeOpts, c);
  const needsEngagement = c.engagement.length > 0;
  const aidesInvolved = base.kind === "terre" || c.success.length > 0;

  const errors = {
    nom: contact.nom.trim().length < 2 ? "Indiquez votre nom." : "",
    tel: !phoneValid(contact) ? "Indiquez un numéro valide, par exemple 6 12 34 56 78." : "",
    email: contact.email.trim() && !emailValid(contact.email) ? "Cette adresse e-mail semble incomplète." : contact.pref === "email" && !contact.email.trim() ? "Indiquez votre e-mail pour être contacté par e-mail." : "",
  };
  const contactOk = !errors.nom && !errors.tel && !errors.email;

  function changeForme(f: FormeId) {
    setForme(f);
    // La formule de comptabilité suit la forme choisie
    setOpts((o) => o.map((x) => (compta.some((k) => k.id === x) ? comptaParForme(f) : x)));
  }

  function toggle(id: string) {
    setOpts((o) => {
      if (o.includes(id)) return o.filter((x) => x !== id);
      const next = WEB_IDS.includes(id) ? o.filter((x) => !WEB_IDS.includes(x)) : o;
      return [...next, id];
    });
  }

  function primary() {
    if (step === 0) return setStep(1);
    if (step === 1) {
      if (needsEngagement && !accepted) {
        setShowErrors(true);
        document.getElementById("engagement")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setShowErrors(false);
      return setStep(2);
    }
    if (!contactOk || (needsEngagement && !accepted)) {
      setShowErrors(true);
      if (needsEngagement && !accepted) setStep(1);
      return;
    }
    const ref = makeReference();
    const message = buildMessage({ ref, c, forme, mode, base, contact, accepted });
    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setConfirmed({ reference: ref, message });
  }

  if (confirmed) return <Confirmation {...confirmed} title={c.title} onEdit={() => setConfirmed(null)} />;

  const primaryLabel = step === 0 ? "Voir le récapitulatif" : step === 1 ? "Continuer" : "Envoyer ma commande sur WhatsApp";
  const firstRecurring = c.recurring.find((r) => r.unit === "mois");

  return (
    <div className="min-h-[70vh] bg-zinc-50 pb-40 lg:pb-24">
      <div className="mx-auto max-w-[1120px] px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Votre commande</p>
            <h1 className="mt-1 text-[clamp(1.6rem,4vw,2.3rem)] font-extrabold leading-tight tracking-tight text-zinc-900">{c.title}</h1>
          </div>
          <Stepper step={step} onGo={(i) => i < step && setStep(i)} />
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {step === 0 && (
              <StepOffer
                base={base} forme={forme} onForme={changeForme} offreId={offreId} onOffre={setOffreId}
                mode={mode} onMode={setMode} options={options} opts={activeOpts} onToggle={toggle} upgrade={upgrade} start={c.start}
              />
            )}
            {step === 1 && (
              <StepRecap c={c} accepted={accepted} onAccept={setAccepted} needsEngagement={needsEngagement} showError={showErrors && needsEngagement && !accepted} onEdit={() => setStep(0)} />
            )}
            {step === 2 && <StepContact contact={contact} onChange={setContact} errors={showErrors ? errors : null} />}

            <div className="mt-6 hidden items-center gap-3 lg:flex">
              {step > 0 && (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 font-semibold text-zinc-700 transition hover:border-zinc-300">
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
              )}
            </div>
          </div>

          {/* Résumé fixe sur ordinateur */}
          <aside className="hidden lg:sticky lg:top-[96px] lg:block">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_24px_50px_-28px_rgba(31,42,61,.35)]">
              <p className="text-sm font-semibold text-zinc-500">À payer au démarrage</p>
              <p className="mt-1 text-[2rem] font-extrabold leading-none tracking-tight text-zinc-900 tabular-nums">{fmtDH(c.startTotal)} <span className="text-sm font-semibold text-zinc-500">TTC</span></p>
              {c.feesTotal > 0 && <p className="mt-1.5 text-[13px] text-zinc-500">dont {fmtDH(c.feesTotal)} de frais d&apos;État estimés</p>}
              {c.hasQuote && <p className="mt-1.5 text-[13px] text-zinc-500">+ éléments sur devis, confirmés par votre conseiller</p>}
              {c.recurring.length > 0 && (
                <div className="mt-4 grid gap-1.5 border-t border-zinc-200 pt-4 text-[13px] text-zinc-600">
                  <span className="font-semibold text-zinc-800">Puis</span>
                  {c.recurring.map((r) => <span key={r.label + r.unit}>{r.label} : {recurringText(r)}</span>)}
                </div>
              )}
              {c.success.length > 0 && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">Honoraires sur l&apos;aide : 0 DH si refus</p>
              )}
              <button type="button" onClick={primary} className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-[15px] font-bold text-zinc-900 transition hover:bg-amber-300">
                {step === 2 && <MessageCircle className="h-4 w-4" />} {primaryLabel} {step < 2 && <ArrowRight className="h-4 w-4" />}
              </button>
              <Reassurance aides={aidesInvolved} step={step} />
            </div>
          </aside>
        </div>
      </div>

      {/* Barre fixe sur mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 pt-3 shadow-[0_-12px_30px_-18px_rgba(31,42,61,.35)] backdrop-blur lg:hidden" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-[640px] items-center gap-3">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} aria-label="Étape précédente" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-zinc-200 text-zinc-700">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Au démarrage</span>
            <span className="block truncate text-lg font-extrabold leading-tight text-zinc-900 tabular-nums">{fmtDH(c.startTotal)} TTC</span>
            {firstRecurring && <span className="block truncate text-[12px] text-zinc-500">puis {fmtDH(firstRecurring.amount)} {firstRecurring.tax} / {firstRecurring.unit}{firstRecurring.label.endsWith("échéances suivantes") ? `, ${firstRecurring.months} fois` : ""}</span>}
          </div>
          <button type="button" onClick={primary} className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-amber-400 px-4 text-[15px] font-bold text-zinc-900">
            {step === 2 ? <><MessageCircle className="h-4 w-4" /> Envoyer</> : <>{step === 0 ? "Récapitulatif" : "Continuer"} <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Étapes ──────────────────────────────────────────────────────────────────
function Stepper({ step, onGo }: { step: number; onGo: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Étapes de la commande">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onGo(i)}
            disabled={i >= step}
            aria-current={i === step ? "step" : undefined}
            className={cn("inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 font-semibold transition", i === step ? "bg-blue-700 text-white" : i < step ? "bg-white text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50" : "bg-white text-zinc-500 ring-1 ring-zinc-200")}
          >
            <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs", i === step ? "bg-white text-blue-700" : i < step ? "bg-blue-700 text-white" : "bg-zinc-100 text-zinc-500")}>
              {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn(i !== step && "max-sm:hidden")}>{s}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Card({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={cn("rounded-3xl border border-zinc-200 bg-white p-6 max-sm:p-5", className)}>{children}</section>;
}

function Price({ amount, tax, strike }: { amount: number | null; tax: string; strike?: number }) {
  return (
    <span className="shrink-0 text-right tabular-nums">
      {strike && amount !== null && strike > amount ? <span className="mr-1.5 text-zinc-500 line-through"><span className="sr-only">au lieu de </span>{fmtDH(strike)}</span> : null}
      <span className="font-semibold text-zinc-900">{amount === null ? "Sur devis" : amount === 0 ? "Gratuit" : `${fmtDH(amount)} ${tax}`}</span>
    </span>
  );
}

function StepOffer({ base, forme, onForme, offreId, onOffre, mode, onMode, options, opts, onToggle, upgrade, start }: {
  start: ReturnType<typeof compute>["start"]; base: Base; forme?: FormeId; onForme: (f: FormeId) => void; offreId?: string; onOffre: (id: string) => void;
  mode: PayMode; onMode: (m: PayMode) => void; options: ReturnType<typeof availableOptions>; opts: string[]; onToggle: (id: string) => void;
  upgrade: ReturnType<typeof upgradeFor>;
}) {
  const formes = formeChoices(base);
  const choices = payChoices(base);
  const pack = base.kind === "pack" ? base.pack : null;
  const prixForme = forme ? PRIX_CREATION[forme] : null;
  const prixUnique = !!prixForme && prixForme.every((p) => p === prixForme[0]);
  const tiers = offreId && forme && !prixUnique ? (forme === "auto" ? creationAE : creationSociete) : null;
  const tierIdx = offreId ? Math.max(0, [...creationAE, ...creationSociete].findIndex((o) => o.id === offreId) % 3) : -1;

  return (
    <div className="grid gap-5">
      <Card>
        <h2 className="text-lg font-bold text-zinc-900">Votre offre</h2>

        {formes.length > 1 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-zinc-700">Forme juridique</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Forme juridique">
              {formes.map((f) => (
                <button key={f} type="button" role="radio" aria-checked={forme === f} onClick={() => onForme(f)}
                  className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold transition", forme === f ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-500")}>
                  {formeLabel(f)}
                </button>
              ))}
            </div>
          </div>
        )}

        {tiers && forme && (
          <div className="mt-5 grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Formule de création">
            {tiers.map((t, i) => {
              const price = PRIX_CREATION[forme]?.[i] ?? null;
              const on = i === tierIdx;
              return (
                <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => onOffre(t.id)}
                  className={cn("relative rounded-2xl border-2 p-4 text-left transition", on ? "border-blue-700 bg-blue-50" : "border-zinc-200 hover:border-blue-500")}>
                  {i === 1 && <span className="absolute -top-2.5 left-4 rounded-full bg-blue-700 px-2 py-0.5 text-[11px] font-bold text-white">Recommandé</span>}
                  <span className="block font-bold text-zinc-900">{t.name}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-zinc-700 tabular-nums">{price === null ? "Sur devis" : price === 0 ? "Gratuit" : `${fmtDH(price)} ${t.tax}`}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-zinc-500">{t.desc}</span>
                </button>
              );
            })}
          </div>
        )}
        {offreId && forme && isCreationOffer(offreId) && (
          <ul className="mt-4 grid gap-1.5 text-[14px] text-zinc-700">
            {creationFor(offreId, forme).offer.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{f}</li>)}
          </ul>
        )}

        {pack && (
          <>
            <ul className="mt-5 grid gap-2 border-t border-zinc-200 pt-4 text-[14px]">
              {pack.items.map((i) => (
                <li key={i.label} className="flex justify-between gap-3">
                  <span className="text-zinc-700">{i.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {i.offered ? <><span className="text-zinc-500 line-through">{fmtDH(i.value)}</span> <span className="font-semibold text-red-700">offert</span></> : <span className="text-zinc-500">{fmtDH(i.value)}</span>}
                  </span>
                </li>
              ))}
              {pack.extra && <li className="text-[13px] font-semibold text-blue-700">{pack.extra}</li>}
            </ul>
            <p className="mt-3 text-[13px] text-zinc-500">Valeur des services pris séparément : <span className="line-through">{fmtDH(packValue(pack))} {pack.tax}</span></p>
            {pack.freebie && <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-200"><Gift className="h-3.5 w-3.5" /> {pack.freebie}</p>}
          </>
        )}

        {base.kind === "terre" && (
          <ul className="mt-4 grid gap-1.5 text-[14px] text-zinc-700">
            {packTerre.items.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{f}</li>)}
            <li className="mt-2 rounded-xl bg-red-50 px-3 py-2 font-semibold text-red-700">{packTerre.conditions}</li>
          </ul>
        )}

        {base.kind === "items" && !tiers && base.offer && (
          <ul className="mt-4 grid gap-1.5 text-[14px] text-zinc-700">
            {base.offer.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{f}</li>)}
          </ul>
        )}
        {base.kind === "items" && base.formalites.length > 0 && (
          <ul className="mt-4 grid gap-2 border-t border-zinc-200 pt-4 text-[14px]">
            {base.formalites.map((f) => {
              const l = start.find((x) => x.label === f.label);
              return (
                <li key={f.id} className="flex justify-between gap-3"><span className="text-zinc-700">{f.label}{l?.note && <span className="block text-[12px] text-zinc-500">{l.note}</span>}</span><Price amount={l?.amount ?? f.price} tax="HT" strike={l?.strike} /></li>
              );
            })}
          </ul>
        )}
      </Card>

      {choices.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-zinc-900">Comment souhaitez-vous payer ?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Mode de paiement">
            {choices.map((ch) => {
              const on = mode === ch.mode;
              return (
                <button key={ch.mode} type="button" role="radio" aria-checked={on} onClick={() => onMode(ch.mode)}
                  className={cn("rounded-2xl border-2 p-4 text-left transition", on ? "border-blue-700 bg-blue-50" : "border-zinc-200 hover:border-blue-500")}>
                  <span className="block font-bold text-zinc-900">{ch.title}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-zinc-700 tabular-nums">{ch.price}</span>
                  {ch.hint && <span className="mt-1 block text-[13px] text-zinc-500">{ch.hint}</span>}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {upgrade && (
        <div className="flex flex-col gap-3 rounded-3xl border-2 border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <PiggyBank className="h-6 w-6 shrink-0 text-amber-700" />
          <div className="flex-1 text-[15px] text-zinc-800">
            {upgrade.savings > 0
              ? <><strong>Passez au pack {upgrade.pack.name} et économisez {fmtDH(upgrade.savings)} HT</strong> sur ce que vous avez choisi{upgrade.adds.length ? <>, avec en plus : {upgrade.adds.join(", ").toLowerCase()}</> : null}.</>
              : <><strong>Pour {fmtDH(upgrade.extraCost)} HT de plus, le pack {upgrade.pack.name}</strong> ajoute {upgrade.adds.join(", ").toLowerCase()}, et la création est offerte.</>}
            <span className="block text-[13px] text-zinc-600">Prix du pack payé d&apos;avance : {fmtDH(upgrade.pack.upfront!)} HT pour {upgrade.pack.months} mois.</span>
          </div>
          <Link href={upgrade.href} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 text-sm font-bold text-white hover:bg-zinc-800">
            Voir le pack <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {options.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-zinc-900">Options</h2>
          <p className="mt-1 text-sm text-zinc-500">Facultatives, ajoutez seulement ce dont vous avez besoin.</p>
          <div className="mt-4 grid gap-2.5">
            {options.map((o) => {
              const on = opts.includes(o.id);
              const price = o.id === "aides-dossier" ? "0 DH si refus" : `${fmtDH(o.price)} ${o.tax}${o.billing === "month" ? " / mois" : o.billing === "year" ? " / an" : ""}`;
              return (
                <label key={o.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition", on ? "border-blue-700 bg-blue-50" : "border-zinc-200 hover:border-blue-500")}>
                  <input type="checkbox" checked={on} onChange={() => onToggle(o.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-zinc-900">{o.label}</span>
                    {o.hint && <span className="block text-[13px] text-zinc-500">{o.hint}</span>}
                  </span>
                  <span className={cn("shrink-0 text-right text-sm font-semibold tabular-nums", o.id === "aides-dossier" ? "text-red-700" : "text-zinc-800")}>{price}</span>
                </label>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function StepRecap({ c, accepted, onAccept, needsEngagement, showError, onEdit }: {
  c: ReturnType<typeof compute>; accepted: boolean; onAccept: (v: boolean) => void; needsEngagement: boolean; showError: boolean; onEdit: () => void;
}) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">Récapitulatif</h2>
          <button type="button" onClick={onEdit} className="text-sm font-semibold text-blue-700 hover:underline">Modifier</button>
        </div>

        {c.start.length > 0 && (
          <ul className="mt-4 grid gap-2.5 text-[15px]">
            {c.start.map((l) => (
              <li key={l.label} className="flex justify-between gap-3">
                <span className="text-zinc-700">{l.label}{l.note && l.amount !== null && <span className="block text-[12px] text-zinc-500">{l.note}</span>}</span>
                <Price amount={l.amount} tax={l.tax} strike={l.strike} />
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-4 grid gap-2 border-t border-zinc-200 pt-4 text-[14px]">
          {c.startHT > 0 && <Row label="Sous-total HT" value={fmtDH(c.startHT)} />}
          {c.tva > 0 && <Row label="TVA 20 %" value={fmtDH(c.tva)} />}
          {c.startTTCnoVat > 0 && <Row label="Honoraires TTC, sans TVA en sus" value={fmtDH(c.startTTCnoVat)} />}
          {c.fees.map((f) => (
            <Row key={f.label} label={<span className="inline-flex items-start gap-1.5"><Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />{f.label}<span className="sr-only">, </span></span>} sub={`${f.note}, sans TVA`} value={f.amount === null ? "Au réel" : fmtDH(f.amount)} />
          ))}
        </dl>
        <div className="mt-4 flex items-baseline justify-between gap-3 rounded-2xl bg-zinc-900 px-4 py-3.5 text-white">
          <span className="font-semibold">À payer au démarrage</span>
          <span className="text-xl font-extrabold tabular-nums">{fmtDH(c.startTotal)} TTC</span>
        </div>
        {c.hasQuote && <p className="mt-2 text-[13px] text-zinc-500">Les éléments sur devis ou au réel vous sont confirmés par écrit avant tout paiement.</p>}

        {c.recurring.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Puis</h3>
            <ul className="mt-2 grid gap-2 text-[14px] text-zinc-700">
              {c.recurring.map((r) => <li key={r.label + r.unit}><span className="font-semibold text-zinc-900">{r.label}</span> : {recurringText(r)}</li>)}
            </ul>
          </div>
        )}
        {c.success.length > 0 && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4">
            <h3 className="text-sm font-bold text-red-700">Seulement si l&apos;aide est obtenue</h3>
            <ul className="mt-1.5 grid gap-1.5 text-[14px] text-zinc-700">
              {c.success.map((s) => <li key={s.label}><span className="font-semibold">{s.label}</span> : {s.text}</li>)}
            </ul>
          </div>
        )}
        {c.notes.map((n) => <p key={n} className="mt-3 text-[13px] text-zinc-500">{n}</p>)}
      </Card>

      {needsEngagement && (
        <Card id="engagement" className={cn(showError && "border-red-400 ring-2 ring-red-100")}>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={accepted} onChange={(e) => onAccept(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700" aria-describedby="engagement-text" />
            <span id="engagement-text" className="text-[14px] leading-relaxed text-zinc-700">
              <span className="font-semibold text-zinc-900">J&apos;accepte les conditions d&apos;engagement.</span>{" "}
              {c.engagement.join(" ")} Voir les <Link href="/terms-and-conditions" target="_blank" className="font-semibold text-blue-700 underline">conditions générales</Link>.
            </span>
          </label>
          {showError && <p className="mt-2 text-sm font-semibold text-red-700" role="alert">Cochez cette case pour continuer.</p>}
        </Card>
      )}
    </div>
  );
}

function Row({ label, value, sub }: { label: React.ReactNode; value: string; sub?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-600">{label}{sub && <span className="block text-[12px] text-zinc-500">{sub}</span>}</dt>
      <dd className="shrink-0 font-semibold text-zinc-900 tabular-nums">{value}</dd>
    </div>
  );
}

function StepContact({ contact, onChange, errors }: { contact: Contact; onChange: (c: Contact) => void; errors: Record<"nom" | "tel" | "email", string> | null }) {
  const set = <K extends keyof Contact>(k: K, v: Contact[K]) => onChange({ ...contact, [k]: v });
  const input = "h-12 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
  const err = (k: "nom" | "tel" | "email") => errors?.[k] ? <p id={`err-${k}`} className="mt-1 text-sm font-semibold text-red-700">{errors[k]}</p> : null;
  return (
    <Card>
      <h2 className="text-lg font-bold text-zinc-900">Vos coordonnées</h2>
      <p className="mt-1 text-sm text-zinc-500">Pas de compte à créer. Ces informations servent seulement à confirmer votre commande.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nom" className="text-sm font-semibold text-zinc-800">Nom et prénom</label>
          <input id="nom" autoComplete="name" value={contact.nom} onChange={(e) => set("nom", e.target.value)} className={cn(input, "mt-1.5", errors?.nom && "border-red-400")} aria-invalid={!!errors?.nom} aria-describedby={errors?.nom ? "err-nom" : undefined} />
          {err("nom")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tel" className="text-sm font-semibold text-zinc-800">Téléphone <span className="font-normal text-zinc-500">(WhatsApp de préférence)</span></label>
          <div className="mt-1.5 flex gap-2">
            <select aria-label="Indicatif du pays" value={contact.indicatif} onChange={(e) => set("indicatif", e.target.value)} className={cn(input, "w-[150px] shrink-0 px-2.5")}>
              {INDICATIFS.map((i) => <option key={i.v} value={i.v}>{i.l}</option>)}
            </select>
            <input id="tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="6 12 34 56 78" value={contact.tel} onChange={(e) => set("tel", e.target.value)} className={cn(input, errors?.tel && "border-red-400")} aria-invalid={!!errors?.tel} aria-describedby={errors?.tel ? "err-tel" : "tel-help"} />
          </div>
          <p id="tel-help" className="mt-1 text-[12px] text-zinc-500">Autre pays : tapez le numéro complet avec + (par exemple +33 6 12 34 56 78).</p>
          {err("tel")}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-zinc-800">E-mail <span className="font-normal text-zinc-500">(facultatif)</span></label>
          <input id="email" type="email" autoComplete="email" value={contact.email} onChange={(e) => set("email", e.target.value)} className={cn(input, "mt-1.5", errors?.email && "border-red-400")} aria-invalid={!!errors?.email} aria-describedby={errors?.email ? "err-email" : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="ville" className="text-sm font-semibold text-zinc-800">Ville <span className="font-normal text-zinc-500">(facultatif)</span></label>
          <input id="ville" autoComplete="address-level2" value={contact.ville} onChange={(e) => set("ville", e.target.value)} className={cn(input, "mt-1.5")} />
        </div>
      </div>

      <Choice label="Comment préférez-vous être contacté ?" value={contact.pref} labels={PREF_LABELS} onChange={(v) => set("pref", v)} icons={{ whatsapp: MessageCircle, appel: Phone, email: Mail }} />
      <Choice label="Moyen de paiement préféré" value={contact.paiement} labels={PAY_LABELS} onChange={(v) => set("paiement", v)} />
      <p className="mt-2 text-[13px] text-zinc-500">Rien n&apos;est payé maintenant. {PROMESSES.paiement}</p>

      <div className="mt-5">
        <label htmlFor="message" className="text-sm font-semibold text-zinc-800">Un mot pour votre conseiller <span className="font-normal text-zinc-500">(facultatif)</span></label>
        <textarea id="message" rows={3} value={contact.message} onChange={(e) => set("message", e.target.value)} placeholder="Nom envisagé pour la société, date souhaitée, question..." className={cn(input, "mt-1.5 h-auto py-3")} />
      </div>
    </Card>
  );
}

function Choice<T extends string>({ label, value, labels, onChange, icons }: {
  label: string; value: T; labels: Record<T, string>; onChange: (v: T) => void; icons?: Partial<Record<string, LucideIcon>>;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-semibold text-zinc-800">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(labels) as T[]).map((k) => {
          const Icon = icons?.[k];
          return (
            <label key={k} className={cn("inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-300", value === k ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-500")}>
              <input type="radio" className="sr-only" checked={value === k} onChange={() => onChange(k)} />
              {Icon && <Icon className="h-4 w-4" />} {labels[k]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Reassurance({ aides, step }: { aides: boolean; step: number }) {
  const items = [
    { icon: BadgeCheck, text: "Prix connus d'avance, rien n'est payé maintenant." },
    { icon: Landmark, text: "Frais d'État au réel, reversés sans marge." },
    ...(aides ? [{ icon: ShieldCheck, text: PROMESSES.societePrivee }] : []),
    ...(step === 2 ? [{ icon: Lock, text: "Vos coordonnées servent seulement à traiter votre commande." }] : []),
  ];
  return (
    <ul className="mt-4 grid gap-2 text-[12.5px] leading-snug text-zinc-500">
      {items.map(({ icon: Icon, text }) => <li key={text} className="flex gap-2"><Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />{text}</li>)}
    </ul>
  );
}

// ── Confirmation ────────────────────────────────────────────────────────────
function Confirmation({ reference, message, title, onEdit }: { reference: string; message: string; title: string; onEdit: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  const next = [
    { t: "Vous envoyez le message", d: "WhatsApp s'est ouvert avec votre commande déjà écrite : appuyez sur Envoyer." },
    { t: "Un conseiller vous confirme tout", d: "Il vérifie votre commande avec vous et répond à vos questions." },
    { t: "Vous recevez le lien de paiement", d: PROMESSES.paiement },
    { t: "On lance votre dossier", d: "Vous suivez chaque étape avec votre conseiller." },
  ];
  return (
    <div className="min-h-[70vh] bg-zinc-50 pb-24">
      <div className="mx-auto max-w-[720px] px-4 pt-10 sm:px-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-7 text-center max-sm:p-5">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-700"><Sparkles className="h-6 w-6" /></span>
          <h1 className="mt-4 text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-tight text-zinc-900">Votre commande est prête</h1>
          <p className="mt-2 text-zinc-600">{title}. Référence <span className="whitespace-nowrap font-bold text-zinc-900">{reference}</span></p>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] text-zinc-600">
            WhatsApp s&apos;est ouvert avec votre commande. Elle ne nous parvient qu&apos;une fois que vous appuyez sur Envoyer dans WhatsApp. S&apos;il ne s&apos;est pas ouvert, utilisez le bouton ci-dessous.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 font-bold text-zinc-900 hover:bg-amber-300">
              <MessageCircle className="h-4 w-4" /> Rouvrir WhatsApp
            </a>
            <a href={mailLink(`Commande ${reference}`, message)} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-6 font-semibold text-zinc-800 hover:border-zinc-300">
              <Mail className="h-4 w-4" /> Envoyer plutôt par e-mail
            </a>
          </div>
          <button type="button" onClick={copy} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline">
            {copied ? <><Check className="h-4 w-4" /> Récapitulatif copié</> : <><Copy className="h-4 w-4" /> Copier le récapitulatif</>}
          </button>
        </div>

        <ol className="mt-6 grid gap-3">
          {next.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">{i + 1}</span>
              <span><span className="block font-semibold text-zinc-900">{s.t}</span><span className="block text-[14px] text-zinc-600">{s.d}</span></span>
            </li>
          ))}
        </ol>
        <div className="mt-6 text-center">
          <button type="button" onClick={onEdit} className="text-sm text-zinc-500 underline hover:text-zinc-800">Modifier ma commande</button>
        </div>
      </div>
    </div>
  );
}

// ── Sans offre valide ───────────────────────────────────────────────────────
function NoOffer({ invalid }: { invalid: boolean }) {
  return (
    <div className="bg-zinc-50 pb-24">
      <div className="mx-auto max-w-[1120px] px-4 pt-10 sm:px-6">
        <h1 className="text-[clamp(1.6rem,4vw,2.3rem)] font-extrabold tracking-tight text-zinc-900">Choisissez votre offre</h1>
        <p className="mt-2 max-w-[640px] text-zinc-600">
          {invalid ? "L'offre indiquée dans le lien n'existe pas ou plus. " : ""}
          Répondez à quelques questions pour recevoir votre plan, ou choisissez directement un pack.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/onboarding" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-amber-400 px-6 font-bold text-zinc-900 hover:bg-amber-300">Trouver mon offre en 1 minute <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/tarifs" className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 font-semibold text-zinc-800">Voir tous les tarifs</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => <PackCard key={p.id} pack={p} href={commandeHref({ pack: p.id })} cta="Commander ce pack" />)}
        </div>
        <p className="mt-6 text-[13px] text-zinc-500">Agriculteur ? Pack {packTerre.name} : {packTerre.conditions} <Link href={commandeHref({ pack: packTerre.id })} className="font-semibold text-blue-700 underline">Commander le pack {packTerre.name}</Link></p>
      </div>
    </div>
  );
}
