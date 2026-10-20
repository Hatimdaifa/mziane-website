"use client";

// Page d'un dossier : étapes, pièces à fournir, documents de Mziane, récapitulatif et historique.
// Le conseiller voit la même page avec ses outils de suivi en plus.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowLeft, Check, ChevronDown, Download, Eye, FileText, Loader2, FolderOpen, MessageSquareText,
  PhoneCall, Trash2, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Ar } from "@/components/Ar";
import { WhatsAppIcon } from "@/components/site";
import { useEspace } from "@/components/espace/EspaceShell";
import { Card, DocBadge, ProgressBar, StatusBadge, StatusSteps } from "@/components/espace/ui";
import { progress, requirementGroups, type GroupState, type ReqState } from "@/components/espace/progress";
import ConseillerPanel from "@/components/espace/ConseillerPanel";
import { supabase } from "@/lib/supabase";
import { waLink } from "@/lib/offers";
import ProcedurePanel from "@/components/espace/ProcedurePanel";
import {
  ACCEPT, fmtDate, fmtSize, openDocument, removeDocument, statutInfo, uploadDocument,
  type Answer, type DocFile, type Dossier, type DossierEvent, type Profile,
} from "@/lib/espace";

export interface DossierData { dossier: Dossier; docs: DocFile[]; answers: Answer[]; events: DossierEvent[]; owner: Profile | null }

export default function DossierView({ id }: { id: string }) {
  const { userId, profile } = useEspace();
  const conseiller = profile?.role === "conseiller";
  const [data, setData] = useState<DossierData | null | "absent">(null);

  const load = useCallback(async () => {
    const sb = supabase();
    const { data: dossier } = await sb.from("dossiers").select("*").eq("id", id).maybeSingle();
    if (!dossier) return setData("absent");
    const [docs, answers, events, owner] = await Promise.all([
      sb.from("documents").select("*").eq("dossier_id", id).order("created_at"),
      sb.from("dossier_answers").select("*").eq("dossier_id", id),
      sb.from("dossier_events").select("*").eq("dossier_id", id).order("created_at", { ascending: false }),
      sb.from("profiles").select("*").eq("id", dossier.user_id).maybeSingle(),
    ]);
    setData({
      dossier: dossier as Dossier,
      docs: (docs.data ?? []) as DocFile[],
      answers: (answers.data ?? []) as Answer[],
      events: (events.data ?? []) as DossierEvent[],
      owner: (owner.data as Profile | null) ?? null,
    });
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial depuis Supabase
    load();
  }, [load]);

  if (data === null) return <p className="text-sm text-zinc-500" role="status">Chargement du dossier...</p>;
  if (data === "absent") {
    return (
      <Card>
        <h1 className="text-lg font-bold text-zinc-900">Dossier introuvable</h1>
        <p className="mt-1 text-zinc-600">Ce dossier n&apos;existe pas ou n&apos;est pas lié à votre compte.</p>
        <Link href="/espace" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> Mes dossiers</Link>
      </Card>
    );
  }

  const { dossier, docs, answers, events } = data;
  const groups = requirementGroups(dossier, docs, answers);
  const p = progress(groups);
  const info = statutInfo(dossier.status);
  const fromMziane = docs.filter((d) => d.from_mziane);
  const complete = p.total > 0 && p.done === p.total && p.redo === 0;
  const firstOpen = (groups.find((g) => g.items.some((i) => (i.required && !i.done) || i.redo)) ?? groups[0])?.key;

  return (
    <div className="grid gap-5">
      <div>
        <Link href={conseiller ? "/espace/conseiller" : "/espace"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {conseiller ? "Tous les dossiers" : "Mes dossiers"}
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[clamp(1.5rem,4vw,2.1rem)] font-extrabold leading-tight tracking-tight text-zinc-900">{dossier.title}</h1>
            <p className="mt-1 text-[13px] text-zinc-500">Réf. {dossier.reference} · commandé le {fmtDate(dossier.created_at)}</p>
          </div>
          <StatusBadge status={dossier.status} />
        </div>
      </div>

      {conseiller && <ConseillerPanel data={data} authorId={userId} onChange={load} />}
      {conseiller && <ProcedurePanel dossier={data.dossier} userId={userId} />}

      <Card>
        <StatusSteps status={dossier.status} />
        <p className="mt-5 rounded-2xl bg-zinc-50 px-4 py-3 text-[15px] text-zinc-700">
          <span className="font-bold text-zinc-900">{info.label}</span> <Ar>{info.ar}</Ar>
          <span className="block text-[14px] text-zinc-600">{info.desc}</span>
        </p>
      </Card>

      {fromMziane.length > 0 && (
        <Card className="border-2 border-emerald-200">
          <h2 className="text-lg font-bold text-zinc-900">Vos documents <Ar>وثائقكم</Ar></h2>
          <p className="mt-1 text-[14px] text-zinc-600">Transmis par Mziane. Gardez-les précieusement.</p>
          <ul className="mt-4 grid gap-2">
            {fromMziane.map((d) => <FileRow key={d.id} doc={d} canDelete={conseiller} onChange={load} />)}
          </ul>
        </Card>
      )}

      {groups.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Pièces à fournir <Ar>الوثائق المطلوبة</Ar></h2>
              <p className="mt-1 text-[14px] text-zinc-600">Une photo nette prise au téléphone suffit. PDF, JPG, PNG ou HEIC, 10 Mo maximum.</p>
            </div>
            {p.total > 0 && <span className="text-sm font-bold text-zinc-900 tabular-nums">{p.done} sur {p.total}</span>}
          </div>
          {p.total > 0 && <div className="mt-3"><ProgressBar value={p.done} max={p.total} /></div>}
          {p.redo > 0 && (
            <p className="mt-4 flex gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {p.redo} pièce{p.redo > 1 ? "s" : ""} à renvoyer : voyez le commentaire de votre conseiller.
            </p>
          )}

          <div className="mt-5 grid gap-3">
            {groups.map((g) => <Group key={g.key} group={g} dossier={dossier} authorId={userId} conseiller={conseiller} onChange={load} defaultOpen={g.key === firstOpen} />)}
          </div>

          {!conseiller && complete && (
            <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-emerald-50 p-4 sm:flex-row sm:items-center">
              <Check className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden />
              <p className="flex-1 text-[15px] text-emerald-900"><span className="font-bold">Toutes les pièces demandées sont envoyées.</span> Votre conseiller les vérifie.</p>
              <a href={waLink(`Bonjour, j'ai envoyé toutes mes pièces pour le dossier ${dossier.reference}.`)} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0E7A40] px-5 text-sm font-bold text-white hover:bg-[#0B6634]">
                <WhatsAppIcon className="h-4.5 w-4.5" /> Prévenir mon conseiller
              </a>
            </div>
          )}
        </Card>
      )}

      <Details title="Ma commande" icon={FileText}>
        <Summary dossier={dossier} />
      </Details>

      {events.length > 0 && (
        <Details title="Historique" icon={MessageSquareText} defaultOpen={events.some((e) => e.kind === "note" || e.kind === "demande")}>
          <ol className="grid gap-3">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3 text-[14px]">
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", e.kind === "note" || e.kind === "demande" ? "bg-amber-500" : "bg-zinc-300")} />
                <span>
                  <span className={cn("block", e.kind === "note" || e.kind === "demande" ? "font-semibold text-zinc-900" : "text-zinc-700")}>
                    {e.kind === "note" && "Votre conseiller : "}{e.text}
                  </span>
                  <span className="block text-[12px] text-zinc-500">{fmtDate(e.created_at, true)}</span>
                </span>
              </li>
            ))}
          </ol>
        </Details>
      )}

      {!conseiller && (
        <div className="flex flex-wrap gap-2.5">
          <a href={waLink(`Bonjour, j'ai une question sur mon dossier ${dossier.reference}.`)} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0E7A40] px-5 font-bold text-white hover:bg-[#0B6634]">
            <WhatsAppIcon className="h-5 w-5" /> Une question ? WhatsApp
          </a>
          <a href={waLink(`Bonjour, je souhaite être rappelé pour mon dossier ${dossier.reference}.`)} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 font-semibold text-zinc-800 hover:border-zinc-300">
            <PhoneCall className="h-4.5 w-4.5" aria-hidden /> Être rappelé
          </a>
        </div>
      )}
    </div>
  );
}

// ── Groupe de pièces ────────────────────────────────────────────────────────
function Group({ group, dossier, authorId, conseiller, onChange, defaultOpen }: { group: GroupState; dossier: Dossier; authorId: string; conseiller: boolean; onChange: () => void; defaultOpen: boolean }) {
  const items = group.items.filter((i) => i.req.kind !== "rdv");
  const withAdvisor = group.items.filter((i) => i.req.kind === "rdv");
  const main = items.filter((i) => !i.req.condition);
  const cases = items.filter((i) => i.req.condition);
  const anyCaseUsed = cases.some((i) => i.files.length || i.answer);
  const req = main.filter((i) => i.required);
  const done = req.filter((i) => i.done).length;
  const redo = items.some((i) => i.redo);
  const full = req.length > 0 && done === req.length && !redo;
  return (
    <details className="group/g rounded-2xl border border-zinc-200" open={defaultOpen || redo}>
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5">
        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold", full ? "bg-emerald-600 text-white" : redo ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600")}>
          {full ? <Check className="h-4 w-4" aria-hidden /> : redo ? <AlertCircle className="h-4 w-4" aria-hidden /> : <FolderOpen className="h-3.5 w-3.5" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-zinc-900">{group.title}</span>
          {group.titleAr && <span lang="ar" dir="rtl" className="font-arabic block text-left text-[12px] text-zinc-500" style={{ unicodeBidi: "plaintext" }}>{group.titleAr}</span>}
        </span>
        <span className="shrink-0 text-[13px] font-semibold text-zinc-500 tabular-nums">{done}/{req.length}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition group-open/g:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-zinc-100 px-4">
        <ul className="divide-y divide-zinc-100">
          {main.map((i) => <Requirement key={i.req.id} item={i} dossier={dossier} authorId={authorId} conseiller={conseiller} onChange={onChange} />)}
        </ul>
        {cases.length > 0 && (
          <details className="group/d mb-3 rounded-xl bg-zinc-50" open={anyCaseUsed}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-semibold text-zinc-700">
              Seulement si cela vous concerne ({cases.length})
              <ChevronDown className="h-4 w-4 transition group-open/d:rotate-180" aria-hidden />
            </summary>
            <ul className="divide-y divide-zinc-200/70 px-3.5">
              {cases.map((i) => <Requirement key={i.req.id} item={i} dossier={dossier} authorId={authorId} conseiller={conseiller} onChange={onChange} />)}
            </ul>
          </details>
        )}
        {withAdvisor.length > 0 && (
          <p className="mb-4 rounded-xl bg-blue-50 px-3.5 py-2.5 text-[13px] text-blue-900">
            <span className="font-semibold">Vu avec votre conseiller :</span> {withAdvisor.map((i) => i.req.label).join(", ")}. Ne communiquez jamais vos mots de passe par écrit.
          </p>
        )}
      </div>
    </details>
  );
}

// ── Une pièce ───────────────────────────────────────────────────────────────
function Requirement({ item, dossier, authorId, conseiller, onChange }: { item: ReqState; dossier: Dossier; authorId: string; conseiller: boolean; onChange: () => void }) {
  const { req, files, done, redo } = item;
  const kind = req.kind ?? "file";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const locked = dossier.status === "termine" || dossier.status === "annule";

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError("");
    for (const file of Array.from(list)) {
      const r = await uploadDocument({ file, dossier, requirementId: req.id, authorId });
      if (!r.ok) { setError(r.error); break; }
    }
    if (input.current) input.current.value = "";
    setBusy(false);
    onChange();
  }

  return (
    <li className="py-4">
      <div className="flex items-start gap-3">
        <span className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
          redo ? "bg-red-100 text-red-700" : done && kind !== "rdv" ? "bg-emerald-600 text-white" : "border-2 border-zinc-300 bg-white",
        )}>
          {redo ? <AlertCircle className="h-3.5 w-3.5" aria-hidden /> : done && kind !== "rdv" ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-zinc-900">
            {req.label}
            {req.optional && <span className="ml-1.5 text-[13px] font-normal text-zinc-500">(facultatif)</span>}
          </p>
          {req.labelAr && <p lang="ar" dir="rtl" className="font-arabic mt-0.5 text-left text-[13px] text-zinc-500" style={{ unicodeBidi: "plaintext" }}>{req.labelAr}</p>}
          {(req.hint || req.condition) && (
            <p className="mt-1 text-[13px] text-zinc-500">{[req.condition, req.hint].filter(Boolean).join(". ")}</p>
          )}

          {kind === "info" && <AnswerBox item={item} dossier={dossier} authorId={authorId} disabled={locked || conseiller} onSaved={onChange} />}

          {files.length > 0 && (
            <ul className="mt-3 grid gap-2">
              {files.map((f) => <FileRow key={f.id} doc={f} canDelete={!locked && (conseiller || f.status !== "valide")} onChange={onChange} />)}
            </ul>
          )}

          {kind === "file" && !locked && !conseiller && (
            <div className="mt-3">
              <input ref={input} type="file" accept={ACCEPT} multiple className="sr-only" id={`f-${req.id}`} onChange={(e) => onFiles(e.target.files)} disabled={busy} />
              <label htmlFor={`f-${req.id}`}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-within:ring-2 focus-within:ring-blue-700",
                  files.length && !redo ? "border border-zinc-200 text-zinc-800 hover:border-zinc-300" : "bg-blue-700 text-white hover:bg-blue-800",
                  busy && "pointer-events-none opacity-60",
                )}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
                {busy ? "Envoi en cours..." : redo ? "Renvoyer la pièce" : files.length ? "Ajouter une page" : "Ajouter"}
              </label>
            </div>
          )}
          {error && <p role="alert" className="mt-2 text-[13px] font-semibold text-red-700">{error}</p>}
        </div>
      </div>
    </li>
  );
}

function AnswerBox({ item, dossier, authorId, disabled, onSaved }: { item: ReqState; dossier: Dossier; authorId: string; disabled: boolean; onSaved: () => void }) {
  const [value, setValue] = useState(item.answer?.value ?? "");
  const [open, setOpen] = useState(!!item.answer);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saved = (item.answer?.value ?? "") === value;

  async function save() {
    setState("saving");
    const { error } = await supabase().from("dossier_answers").upsert({ dossier_id: dossier.id, requirement_id: item.req.id, user_id: dossier.user_id, value: value.trim(), updated_at: new Date().toISOString() });
    if (error) return setState("error");
    if (!item.answer) await supabase().from("dossier_events").insert({ dossier_id: dossier.id, author: authorId, kind: "document", text: `Information ajoutée : ${item.req.label}` });
    setState("saved");
    onSaved();
  }

  if (disabled) {
    return item.answer ? <p className="mt-2 whitespace-pre-line rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[14px] text-zinc-800">{item.answer.value}</p> : <p className="mt-2 text-[13px] text-zinc-500">Pas encore de réponse.</p>;
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
        <MessageSquareText className="h-4 w-4" aria-hidden /> Répondre
      </button>
    );
  }
  return (
    <div className="mt-3">
      <label htmlFor={`a-${item.req.id}`} className="sr-only">{item.req.label}</label>
      <textarea id={`a-${item.req.id}`} autoFocus={!item.answer} value={value} maxLength={4000} rows={value.length > 120 ? 4 : 2} onChange={(e) => { setValue(e.target.value); setState("idle"); }}
        placeholder="Écrivez votre réponse ici"
        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
      <div className="mt-1.5 flex items-center gap-3">
        <button type="button" onClick={save} disabled={saved || !value.trim() || state === "saving"}
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800 disabled:bg-zinc-200 disabled:text-zinc-500">
          {state === "saving" ? "Enregistrement..." : "Enregistrer"}
        </button>
        {state === "saved" && saved && <span className="text-[13px] font-semibold text-emerald-700" role="status">Enregistré</span>}
        {state === "error" && <span className="text-[13px] font-semibold text-red-700" role="alert">Échec, réessayez.</span>}
      </div>
    </div>
  );
}

// ── Un fichier ──────────────────────────────────────────────────────────────
function FileRow({ doc, canDelete, onChange }: { doc: DocFile; canDelete: boolean; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!window.confirm(`Retirer « ${doc.name} » ?`)) return;
    setBusy(true);
    await removeDocument(doc);
    setBusy(false);
    onChange();
  }
  return (
    <li className={cn("rounded-xl border px-3.5 py-2.5", doc.status === "a_refaire" ? "border-red-200 bg-red-50/50" : "border-zinc-200 bg-white")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <FileText className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
        <span className="min-w-[55%] flex-1 truncate text-[14px] font-medium text-zinc-800" title={doc.name}>{doc.name}</span>
        <span className="text-[12px] text-zinc-500">{fmtSize(doc.size)}</span>
        {!doc.from_mziane && <DocBadge status={doc.status} />}
        <span className="flex items-center gap-0.5">
          <IconBtn label={`Voir ${doc.name}`} onClick={() => openDocument(doc)}><Eye className="h-4 w-4" /></IconBtn>
          <IconBtn label={`Télécharger ${doc.name}`} onClick={() => openDocument(doc, true)}><Download className="h-4 w-4" /></IconBtn>
          {canDelete && <IconBtn label={`Retirer ${doc.name}`} onClick={del} disabled={busy}><Trash2 className="h-4 w-4" /></IconBtn>}
        </span>
      </div>
      {doc.comment && <p className="mt-1.5 text-[13px] font-semibold text-red-800">Conseiller : {doc.comment}</p>}
    </li>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40">
      {children}
    </button>
  );
}

// ── Sections repliables ─────────────────────────────────────────────────────
function Details({ title, icon: Icon, defaultOpen = false, children }: { title: string; icon: typeof FileText; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group rounded-3xl border border-zinc-200 bg-white" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 text-[15px] font-bold text-zinc-900">
        <Icon className="h-4.5 w-4.5 text-zinc-400" aria-hidden /> <span className="flex-1">{title}</span>
        <ChevronDown className="h-4 w-4 text-zinc-500 transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

function Summary({ dossier }: { dossier: Dossier }) {
  const s = dossier.summary;
  const block = (title: string, lines?: { label: string; value: string }[]) =>
    lines?.length ? (
      <div>
        <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-zinc-500">{title}</p>
        <ul className="grid gap-1.5 text-[14px]">
          {lines.map((l) => <li key={l.label} className="flex justify-between gap-4"><span className="text-zinc-700">{l.label}</span><span className="shrink-0 text-right font-semibold text-zinc-900 tabular-nums">{l.value}</span></li>)}
        </ul>
      </div>
    ) : null;
  return (
    <div className="grid gap-5">
      {block("Au démarrage", s.start)}
      {s.startTotal && <p className="flex justify-between border-t border-zinc-200 pt-3 text-[15px] font-bold text-zinc-900"><span>Total au démarrage</span><span className="tabular-nums">{s.startTotal}</span></p>}
      {block("Ensuite", s.recurring)}
      {block("Seulement si l'aide est obtenue", s.success)}
      {!s.start?.length && !s.recurring?.length && !s.success?.length && <p className="text-[14px] text-zinc-600">Le détail de la commande vous a été envoyé sur WhatsApp.</p>}
      <p className="text-[13px] text-zinc-500">Le paiement se fait par le lien envoyé par votre conseiller. Rien n&apos;est prélevé depuis cet espace.</p>
    </div>
  );
}
