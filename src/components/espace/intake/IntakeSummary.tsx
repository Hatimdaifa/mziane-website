"use client";

// Dans le dossier : invitation à compléter (client) et récapitulatif des réponses et signatures (client et conseiller).
import Link from "next/link";
import { ArrowRight, ClipboardList, FileSignature, ShieldCheck } from "lucide-react";
import { Card } from "@/components/espace/ui";
import { fmtDate, type Dossier } from "@/lib/espace";
import { IDENTITE, intakesForSpec, isFilled, persons, visibleFields, type Ctx, type Field, type QA } from "@/lib/intake";
import { signDocsFor, type Signature } from "@/lib/signatures";

function display(f: Field, a: QA): string {
  const v = a[f.id];
  if (v === undefined || v === "") return "";
  if (f.type === "persons") return persons(a, f.id).map((p) => `${p.nom} · ${p.piece || "pièce ?"}${p.parts ? ` · ${p.parts}` : ""}${p.nationalite === "etrangere" ? " · étrangère" : ""}${p.societe ? " · société" : ""}`).join("\n");
  if (Array.isArray(v)) return (v as string[]).filter(Boolean).join(" / ");
  if (f.type === "yesno") return v === "oui" ? "Oui" : "Non";
  if (f.type === "select") return f.options?.find((o) => o.v === v)?.l ?? String(v);
  if (f.type === "date") return new Date(String(v)).toLocaleDateString("fr-FR");
  return String(v);
}

export function intakeState(dossier: Dossier, qa: QA, ctx: Ctx, signatures: Signature[] | null) {
  const sections = [{ title: "Identité", fields: IDENTITE }, ...visibleFields(intakesForSpec(dossier.spec), qa).map((s) => ({ title: s.service.title, fields: s.fields }))];
  const missing = sections.flatMap((s) => s.fields).filter((f) => !isFilled(f, qa)).length;
  const docs = signDocsFor(dossier, qa, ctx);
  const signedKeys = new Set((signatures ?? []).map((s) => s.doc_key));
  const toSign = docs.filter((d) => d.mode === "online" && !signedKeys.has(d.key)).length;
  return { sections, missing, docs, toSign, replaced: docs.filter((d) => d.replaces && signedKeys.has(d.key)).map((d) => d.replaces!) };
}

export function CompleteBanner({ dossier, missing, docsLeft, toSign }: { dossier: Dossier; missing: number; docsLeft: number; toSign: number }) {
  if (!missing && !docsLeft && !toSign) return null;
  const parts = [missing && `${missing} réponse${missing > 1 ? "s" : ""}`, docsLeft && `${docsLeft} pièce${docsLeft > 1 ? "s" : ""}`, toSign && `${toSign} signature${toSign > 1 ? "s" : ""}`].filter(Boolean);
  return (
    <Card className="flex flex-col gap-4 border-2 border-blue-200 sm:flex-row sm:items-center">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-700 text-white"><ClipboardList className="h-6 w-6" aria-hidden /></span>
      <div className="flex-1">
        <p className="font-bold text-zinc-900">Complétez votre dossier</p>
        <p className="text-[14px] text-zinc-600">Il reste {parts.join(", ")}. Le parcours vous guide pas à pas, vos réponses sont gardées.</p>
      </div>
      <Link href={`/espace/dossier/${dossier.id}/completer`} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 font-bold text-white hover:bg-blue-800">
        Continuer <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

export function AnswersCard({ dossier, qa, sections, signatures, docs, conseiller }: {
  dossier: Dossier; qa: QA; sections: { title: string; fields: Field[] }[]; signatures: Signature[] | null; docs: ReturnType<typeof signDocsFor>; conseiller: boolean;
}) {
  const answered = sections.map((s) => ({ ...s, rows: s.fields.map((f) => ({ f, v: display(f, qa) })).filter((r) => r.v) })).filter((s) => s.rows.length);
  if (!answered.length && !signatures?.length) return null;
  return (
    <Card>
      <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900"><ClipboardList className="h-5 w-5 text-blue-700" aria-hidden /> {conseiller ? "Réponses du client" : "Vos réponses"}</h2>
      <div className="mt-4 grid gap-5">
        {answered.map((s) => (
          <div key={s.title}>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-500">{s.title}</h3>
            <dl className="grid gap-2 text-[14px]">
              {s.rows.map(({ f, v }) => (
                <div key={f.id} className="grid gap-0.5 rounded-xl bg-zinc-50 px-3.5 py-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                  <dt className="text-zinc-500">{f.label}</dt>
                  <dd className="whitespace-pre-line font-semibold text-zinc-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {!!docs.length && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-500">Documents à signer</h3>
          <ul className="grid gap-2">
            {docs.map((d) => {
              const s = signatures?.find((x) => x.doc_key === d.key);
              return (
                <li key={d.key}>
                  <Link href={`/espace/dossier/${dossier.id}/document/${d.key}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 px-3.5 py-3 hover:border-blue-500">
                    <FileSignature className="h-4.5 w-4.5 text-blue-700" aria-hidden />
                    <span className="min-w-0 flex-1 font-semibold text-zinc-900">{d.title}</span>
                    {s ? (
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-4 w-4" aria-hidden /> Signé le {fmtDate(s.signed_at)}{s.phone_verified ? ", téléphone vérifié" : ""}
                      </span>
                    ) : (
                      <span className="text-[13px] font-semibold text-zinc-500">{d.mode === "legalise" ? "À signer et faire légaliser" : "Pas encore signé"}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}

