"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { readJSON, removeKey, useHydrated, writeJSON } from "@/components/order/storage";
import { BESOINS, maxRemaining, pathAnswers, stepById, type Answers, type Option } from "./questions";
import Result from "./Result";

const SAVE_KEY = "mziane-onboarding-v1";

interface Saved { stepId: string; answers: Answers; history: string[] }

function validSaved(s: Saved | null): s is Saved {
  if (!s || typeof s !== "object" || !Array.isArray(s.history) || typeof s.answers !== "object" || !s.answers) return false;
  if (s.stepId !== "result" && !stepById(s.stepId)) return false;
  return s.history.every((h) => typeof h === "string" && !!stepById(h) && Array.isArray(s.answers[h]));
}

// ── Entrée ──────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-76px)] bg-zinc-50" />}>
      <QuestionnaireFromUrl />
    </Suspense>
  );
}

// Entrée directe depuis une page : /onboarding?besoin=aides
function QuestionnaireFromUrl() {
  const hydrated = useHydrated();
  const b = useSearchParams().get("besoin");
  const besoin = b && BESOINS.includes(b) ? b : null;
  if (!hydrated) return <div className="min-h-[calc(100vh-76px)] bg-zinc-50" />;
  return <Questionnaire key={besoin ?? "start"} besoin={besoin} />;
}

function initialState(besoin: string | null): Saved & { resumed: boolean } {
  const saved = readJSON<Saved>(SAVE_KEY);
  if (validSaved(saved) && saved.history.length && (!besoin || saved.answers.besoin?.[0] === besoin)) return { ...saved, resumed: true };
  if (besoin) {
    const answers: Answers = { besoin: [besoin] };
    return { stepId: stepById("besoin")!.next(answers), answers, history: ["besoin"], resumed: false };
  }
  return { stepId: "besoin", answers: {}, history: [], resumed: false };
}

function Questionnaire({ besoin }: { besoin: string | null }) {
  const [init] = useState(() => initialState(besoin));
  const [stepId, setStepId] = useState(init.stepId);
  const [answers, setAnswers] = useState<Answers>(init.answers);
  const [history, setHistory] = useState<string[]>(init.history);
  const [pending, setPending] = useState<string[]>(init.answers[init.stepId] ?? []);
  const [resumed, setResumed] = useState(init.resumed);
  const done = stepId === "result";

  useEffect(() => {
    writeJSON(SAVE_KEY, { stepId, answers, history } satisfies Saved);
  }, [stepId, answers, history]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepId]);

  const step = done ? null : stepById(stepId) ?? null;
  const total = history.length + (step ? maxRemaining(stepId, answers) : 0);
  const position = history.length + 1;
  const progress = done ? 100 : Math.round((history.length / Math.max(1, total)) * 100);

  function goTo(id: string, a: Answers) {
    setStepId(id);
    setPending(a[id] ?? []);
  }

  function commit(ids: string[]) {
    if (!step) return;
    // Les réponses des autres questions sont gardées : un retour en arrière ne fait rien perdre.
    const next: Answers = { ...answers, [stepId]: ids };
    setAnswers(next);
    setHistory([...history, stepId]);
    goTo(step.next(next), next);
  }

  function choose(o: Option) {
    if (!step) return;
    if (!step.multi) return commit([o.id]);
    setPending((p) => {
      if (o.id === "aucun") return p.includes("aucun") ? [] : ["aucun"];
      const base = p.filter((x) => x !== "aucun");
      return base.includes(o.id) ? base.filter((x) => x !== o.id) : [...base, o.id];
    });
  }

  function back() {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory(history.slice(0, -1));
    goTo(prev, answers);
  }

  function restart() {
    removeKey(SAVE_KEY);
    setResumed(false);
    setAnswers({});
    setHistory([]);
    goTo("besoin", {});
  }

  const kept = step && !step.multi ? answers[step.id]?.[0] : undefined;
  const keptLabel = kept ? step?.options.find((o) => o.id === kept)?.label : undefined;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-zinc-50 pb-24">
      <div className={cn("mx-auto px-6 pt-12 max-sm:px-4 max-sm:pt-8", done ? "max-w-[1120px]" : "max-w-[760px]")}>
        {!done && (
          <div className="mb-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={back}
                disabled={!history.length}
                aria-label="Question précédente"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-blue-500 hover:text-blue-700 disabled:opacity-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progression du questionnaire">
                <div className="h-full rounded-full bg-blue-700 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-600" aria-live="polite">
                {stepId === "besoin" ? "Question 1" : `Question ${position} sur ${total}`}
              </span>
            </div>
            {stepId === "besoin" && (
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-zinc-500"><Clock className="h-3.5 w-3.5" /> Quelques questions selon votre besoin, environ 1 minute. Sans inscription.</p>
            )}
            {resumed && history.length > 0 && (
              <p className="mt-3 text-[13px] text-zinc-500">
                Nous avons repris vos réponses là où vous vous étiez arrêté.{" "}
                <button type="button" onClick={restart} className="font-semibold text-blue-700 underline">Recommencer</button>
              </p>
            )}
          </div>
        )}

        {step && (
          <div key={step.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h1 className="text-[clamp(1.8rem,4.5vw,2.6rem)] font-extrabold leading-tight tracking-tight text-zinc-900 text-balance">{step.question}</h1>
            <p className="mt-3 mb-8 text-[17px] text-zinc-600">{step.subtitle}</p>

            <div className={cn("grid gap-3", step.options.length > 4 && "sm:grid-cols-2")}>
              {step.options.map((o) => {
                const selected = step.multi ? pending.includes(o.id) : answers[step.id]?.includes(o.id);
                const Icon = o.icon;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o)}
                    aria-pressed={selected}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_-8px_rgba(31,42,61,.18)] focus-visible:outline-2 focus-visible:outline-blue-600",
                      selected ? "border-blue-700 bg-blue-50" : "border-zinc-200",
                    )}
                  >
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl transition", selected ? "bg-blue-700 text-white" : "bg-zinc-50 text-blue-700 group-hover:bg-blue-50")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-zinc-900">{o.label}</span>
                      {o.description && <span className="mt-0.5 block text-sm leading-snug text-zinc-600">{o.description}</span>}
                    </span>
                    {step.multi ? (
                      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition", selected ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-300")}>
                        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                    )}
                  </button>
                );
              })}
            </div>

            {step.multi && (
              <button
                type="button"
                disabled={!pending.length}
                onClick={() => commit(pending)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 font-bold text-zinc-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {keptLabel && (
              <button type="button" onClick={() => commit([kept!])} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                Garder « {keptLabel} » et continuer <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {done && <Result answers={pathAnswers(answers, history)} onRestart={restart} onBack={back} />}
      </div>
    </div>
  );
}
