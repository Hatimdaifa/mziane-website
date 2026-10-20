"use client";

// Parcours guidé du client après la commande : ses informations, les questions de chaque démarche,
// les pièces (photo directe au téléphone), puis la signature en ligne. Tout est enregistré à chaque étape.
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Check, CheckCircle2, FileText, Loader2, Lock, PenLine, Printer, ShieldCheck, Smartphone, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useEspace } from "@/components/espace/EspaceShell";
import { Card, ProgressBar } from "@/components/espace/ui";
import { requirementGroups, type ReqState } from "@/components/espace/progress";
import { ACCEPT, uploadDocument, type Answer, type DocFile, type Dossier } from "@/lib/espace";
import { IDENTITE, QPREFIX, intakesForSpec, isFilled, parseAnswers, serialize, visibleFields, type Ctx, type Field, type QA, type QValue } from "@/lib/intake";
import { docText, sha256, signDocsFor, toE164, type SignDoc, type Signature } from "@/lib/signatures";
import { FieldInput } from "@/components/espace/intake/FieldInput";
import SignaturePad from "@/components/espace/intake/SignaturePad";

interface Data { dossier: Dossier; docs: DocFile[]; answers: Answer[]; signatures: Signature[] | null }
type StepDef = { key: string; title: string; fields?: Field[] };

export default function IntakeWizard({ id }: { id: string }) {
  const { userId, email, profile } = useEspace();
  const [data, setData] = useState<Data | null | "absent">(null);
  const [qa, setQa] = useState<QA>({});
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const sb = supabase();
    const { data: dossier } = await sb.from("dossiers").select("*").eq("id", id).maybeSingle();
    if (!dossier) return setData("absent");
    const [docs, answers, sigs] = await Promise.all([
      sb.from("documents").select("*").eq("dossier_id", id).order("created_at"),
      sb.from("dossier_answers").select("*").eq("dossier_id", id),
      sb.from("signatures").select("*").eq("dossier_id", id),
    ]);
    const d: Data = { dossier: dossier as Dossier, docs: (docs.data ?? []) as DocFile[], answers: (answers.data ?? []) as Answer[], signatures: sigs.error ? null : (sigs.data ?? []) as Signature[] };
    setData(d);
    return d;
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial depuis Supabase, comme DossierView
    load().then((d) => {
      if (!d) return;
      const a = parseAnswers(d.answers);
      if (!a["id-nom"] && profile?.full_name) a["id-nom"] = profile.full_name;
      setQa(a);
    });
  }, [load, profile?.full_name]);

  const ctx: Ctx = useMemo(() => ({
    email,
    phone: profile?.phone || (data && data !== "absent" ? data.dossier.summary.contact?.tel ?? "" : ""),
    fullName: profile?.full_name ?? "",
  }), [email, profile, data]);

  if (data === null) return <p className="text-sm text-zinc-500" role="status">Chargement de votre dossier...</p>;
  if (data === "absent") return <Card><p className="text-zinc-700">Ce dossier n&apos;existe pas ou n&apos;est pas lié à votre compte.</p></Card>;
  const { dossier } = data;

  const services = intakesForSpec(dossier.spec);
  const steps: StepDef[] = [
    { key: "vous", title: "Vos informations", fields: IDENTITE },
    ...visibleFields(services, qa).map(({ service, fields }) => ({ key: service.key, title: service.title, fields })),
    { key: "documents", title: "Vos documents" },
    { key: "signature", title: "Signature" },
    { key: "fin", title: "C'est envoyé" },
  ];
  const current = steps[Math.min(step, steps.length - 1)];
  const go = (n: number) => { setStep(n); setTouched(false); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function saveFields(fields: Field[]) {
    const missing = fields.filter((f) => !isFilled(f, qa));
    setTouched(true);
    if (missing.length) return setError(`Il manque ${missing.length > 1 ? `${missing.length} réponses` : "une réponse"} : ${missing.map((f) => f.label).join(" ; ")}.`);
    setSaving(true);
    const rows = fields.filter((f) => qa[f.id] !== undefined).map((f) => ({
      dossier_id: dossier.id, requirement_id: `${QPREFIX}${f.id}`, user_id: dossier.user_id,
      value: serialize(qa[f.id] as QValue).slice(0, 4000), updated_at: new Date().toISOString(),
    }));
    const { error: e } = rows.length ? await supabase().from("dossier_answers").upsert(rows) : { error: null };
    setSaving(false);
    if (e) return setError("L'enregistrement a échoué. Vérifiez votre connexion et réessayez.");
    await load();
    go(step + 1);
  }

  const set = (fid: string) => (v: QValue) => setQa((a) => ({ ...a, [fid]: v }));
  const signDocs = signDocsFor(dossier, qa, ctx);
  const signedKeys = (data.signatures ?? []).map((s) => s.doc_key);
  const replaced = signDocs.filter((d) => d.replaces && signedKeys.includes(d.key)).map((d) => d.replaces!);
  const groups = requirementGroups(dossier, data.docs, data.answers, replaced);

  return (
    <div className="mx-auto grid max-w-[720px] gap-5">
      <div>
        <Link href={`/espace/dossier/${dossier.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Mon dossier
        </Link>
        <p className="mt-3 text-[13px] font-semibold text-zinc-500">{dossier.title} · Réf. {dossier.reference}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={step} max={steps.length - 1} /></div>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-600" aria-live="polite">Étape {Math.min(step + 1, steps.length)} sur {steps.length}</span>
        </div>
        <h1 className="mt-4 text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-tight text-zinc-900">{current.title}</h1>
      </div>

      {current.fields && (
        <Card className="grid gap-6">
          {current.key === "vous" && <p className="-mb-2 text-[15px] text-zinc-600">Ces informations servent à remplir vos formulaires et vos documents à signer. Vous ne les donnez qu&apos;une fois.</p>}
          {current.fields.map((f) => <FieldInput key={f.id} field={f} value={qa[f.id]} onChange={set(f.id)} invalid={touched && !isFilled(f, qa)} />)}
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[14px] font-semibold text-red-800">{error}</p>}
          <Nav back={step > 0 ? () => go(step - 1) : undefined} next={() => saveFields(current.fields!)} busy={saving} />
        </Card>
      )}

      {current.key === "documents" && (
        <DocumentsStep dossier={dossier} groups={groups} userId={userId} onChange={load} back={() => go(step - 1)} next={() => go(step + 1)} />
      )}

      {current.key === "signature" && (
        <SignatureStep dossier={dossier} docs={signDocs} signatures={data.signatures} name={(qa["id-nom"] as string) || ctx.fullName} phone={ctx.phone}
          onSigned={load} back={() => go(step - 1)} next={async () => {
            await supabase().from("dossier_events").insert({ dossier_id: dossier.id, author: userId, kind: "document", text: "Dossier complété par le client : informations, pièces et signatures envoyées." });
            go(step + 1);
          }} />
      )}

      {current.key === "fin" && (
        <Card className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden />
          <h2 className="mt-3 text-xl font-extrabold text-zinc-900">Merci, votre dossier est entre nos mains</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-zinc-600">Votre conseiller vérifie tout et vous prévient sur WhatsApp à chaque étape. S&apos;il manque quelque chose, vous le verrez dans votre dossier.</p>
          <Link href={`/espace/dossier/${dossier.id}`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Voir mon dossier <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </Card>
      )}
    </div>
  );
}

function Nav({ back, next, busy, label = "Continuer", disabled }: { back?: () => void; next: () => void; busy?: boolean; label?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      {back ? <button type="button" onClick={back} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</button> : <span />}
      <button type="button" onClick={next} disabled={busy || disabled}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:bg-zinc-200 disabled:text-zinc-500">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}{label} {!busy && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}

// ── Documents ───────────────────────────────────────────────────────────────
function DocumentsStep({ dossier, groups, userId, onChange, back, next }: { dossier: Dossier; groups: ReturnType<typeof requirementGroups>; userId: string; onChange: () => void; back: () => void; next: () => void }) {
  const items = groups.flatMap((g) => g.items).filter((i) => i.req.kind !== "rdv");
  const needed = items.filter((i) => i.required);
  const maybe = items.filter((i) => !i.required);
  const left = needed.filter((i) => !i.done).length;
  return (
    <>
      <Card className="grid gap-3">
        <p className="text-[15px] text-zinc-600">
          Prenez chaque pièce en photo, bien à plat et en pleine lumière, ou envoyez un PDF.
          {left ? <b className="text-zinc-900"> Il reste {left} pièce{left > 1 ? "s" : ""}.</b> : <b className="text-emerald-700"> Toutes les pièces demandées sont là.</b>}
        </p>
        {needed.map((i) => <DocCard key={i.req.id} item={i} dossier={dossier} userId={userId} onChange={onChange} />)}
      </Card>
      {!!maybe.length && (
        <Card className="grid gap-3">
          <h2 className="font-bold text-zinc-900">Seulement si cela vous concerne</h2>
          {maybe.map((i) => <DocCard key={i.req.id} item={i} dossier={dossier} userId={userId} onChange={onChange} />)}
        </Card>
      )}
      <p className="flex items-center gap-2 text-[13px] text-zinc-500"><Lock className="h-3.5 w-3.5" aria-hidden /> Vos documents sont stockés de façon privée : seuls vous et votre conseiller y avez accès.</p>
      <Nav back={back} next={next} label={left ? "Continuer, je les ajouterai plus tard" : "Continuer"} />
    </>
  );
}

function DocCard({ item, dossier, userId, onChange }: { item: ReqState; dossier: Dossier; userId: string; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { req, files, done, redo, answer, signed } = item;

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError("");
    for (const file of Array.from(list)) {
      const r = await uploadDocument({ file, dossier, requirementId: req.id, authorId: userId });
      if (!r.ok) { setError(r.error); break; }
    }
    setBusy(false);
    onChange();
  }

  return (
    <div className={cn("rounded-2xl border p-4", done && !redo ? "border-emerald-200 bg-emerald-50/50" : redo ? "border-red-200 bg-red-50/50" : "border-zinc-200")}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full", done && !redo ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500")}>
          {done && !redo ? <Check className="h-4 w-4" aria-hidden /> : <FileText className="h-4 w-4" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900">{req.label}</p>
          {req.hint && <p className="text-[13px] text-zinc-500">{req.hint}</p>}
          {req.condition && <p className="text-[13px] text-zinc-500">{req.condition}</p>}
          {signed && <p className="mt-1 text-[13px] font-semibold text-emerald-700">Signé en ligne à l&apos;étape suivante.</p>}
          {req.kind === "info" && answer && <p className="mt-1 whitespace-pre-line text-[13px] text-zinc-600">{answer.value}</p>}
          {!!files.length && <p className="mt-1 text-[13px] text-zinc-600">{files.length} fichier{files.length > 1 ? "s" : ""} envoyé{files.length > 1 ? "s" : ""}{redo ? " : à refaire, voir le commentaire de votre conseiller" : ""}</p>}
        </div>
      </div>
      {req.kind !== "info" && !signed && (
        <div className="mt-3 flex flex-wrap gap-2 pl-10">
          <label className={cn("inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition", files.length && !redo ? "border border-zinc-200 bg-white text-zinc-800" : "bg-blue-700 text-white hover:bg-blue-800", busy && "pointer-events-none opacity-60")}>
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => onFiles(e.target.files)} disabled={busy} />
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Camera className="h-4 w-4" aria-hidden />} {files.length && !redo ? "Ajouter une page" : "Prendre en photo"}
          </label>
          <label className={cn("inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 hover:border-zinc-300", busy && "pointer-events-none opacity-60")}>
            <input type="file" accept={ACCEPT} multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} disabled={busy} />
            <Upload className="h-4 w-4" aria-hidden /> Choisir un fichier
          </label>
        </div>
      )}
      {error && <p role="alert" className="mt-2 pl-10 text-[13px] font-semibold text-red-700">{error}</p>}
    </div>
  );
}

// ── Signature ───────────────────────────────────────────────────────────────
function SignatureStep({ dossier, docs, signatures, name, phone: initialPhone, onSigned, back, next }: {
  dossier: Dossier; docs: SignDoc[]; signatures: Signature[] | null; name: string; phone: string; onSigned: () => void; back: () => void; next: () => void;
}) {
  const online = docs.filter((d) => d.mode === "online");
  const legalise = docs.filter((d) => d.mode === "legalise");
  const signed = new Set((signatures ?? []).map((s) => s.doc_key));
  const toSign = online.filter((d) => !signed.has(d.key));
  const [accepted, setAccepted] = useState(false);
  const [png, setPng] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sign() {
    if (!toSign.length) return next();
    setBusy(true);
    setError("");
    const rows = await Promise.all(toSign.map(async (d) => {
      const content = docText(d);
      return {
        dossier_id: dossier.id, user_id: dossier.user_id, doc_key: d.key, title: d.title, content,
        content_hash: await sha256(content), signer_name: name.trim(), signer_phone: toE164(phone),
        phone_verified: verified, signature_png: png, user_agent: navigator.userAgent.slice(0, 300),
      };
    }));
    const { error: e } = await supabase().from("signatures").insert(rows);
    setBusy(false);
    if (e) return setError(signatures === null ? "La signature en ligne n'est pas encore activée sur notre serveur. Continuez : votre conseiller vous enverra les documents à signer." : "La signature a échoué. Vérifiez votre connexion et réessayez.");
    await supabase().from("dossier_events").insert({ dossier_id: dossier.id, author: dossier.user_id, kind: "document", text: `Documents signés en ligne : ${toSign.map((d) => d.title).join(", ")}${verified ? " (téléphone vérifié par SMS)" : ""}.` });
    onSigned();
    next();
  }

  return (
    <>
      {!toSign.length && !!online.length && (
        <Card><p className="flex items-center gap-2 font-semibold text-emerald-700"><CheckCircle2 className="h-5 w-5" aria-hidden /> Tous vos documents sont signés.</p></Card>
      )}
      {toSign.map((d) => (
        <Card key={d.key}>
          <h2 className="flex items-center gap-2 font-bold text-zinc-900"><FileText className="h-4.5 w-4.5 text-blue-700" aria-hidden /> {d.title}</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{d.why}</p>
          <div className="mt-3 max-h-56 overflow-y-auto rounded-xl bg-zinc-50 px-4 py-3 text-[14px] leading-relaxed text-zinc-800">
            {d.paragraphs.map((p) => <p key={p} className="mb-2 last:mb-0">{p}</p>)}
          </div>
        </Card>
      ))}
      {!!toSign.length && (
        <Card className="grid gap-5">
          <PhoneCheck phone={phone} setPhone={setPhone} verified={verified} setVerified={setVerified} />
          <div>
            <p className="mb-2 flex items-center gap-2 font-semibold text-zinc-900"><PenLine className="h-4 w-4" aria-hidden /> Votre signature</p>
            <SignaturePad onChange={setPng} />
          </div>
          <label className="flex items-start gap-3 text-[14px] text-zinc-700">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span>Je, <b>{name || "..."}</b>, ai lu {toSign.length > 1 ? `les ${toSign.length} documents ci-dessus et les signe` : "le document ci-dessus et le signe"} électroniquement. Ma signature, mon numéro de téléphone, la date et l&apos;heure sont enregistrés avec {toSign.length > 1 ? "eux" : "lui"}.</span>
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[14px] font-semibold text-red-800">{error}</p>}
          <Nav back={back} next={sign} busy={busy} label={`Signer ${toSign.length > 1 ? `les ${toSign.length} documents` : "le document"}`} disabled={!accepted || !png || !name.trim() || !phone.trim()} />
          {error && signatures === null && <button type="button" onClick={next} className="text-sm font-semibold text-blue-700 underline">Continuer sans signer</button>}
        </Card>
      )}
      {legalise.map((d) => (
        <Card key={d.key}>
          <h2 className="font-bold text-zinc-900">{d.title}</h2>
          <p className="mt-1 text-[14px] text-zinc-600">{d.why}</p>
          <Link href={`/espace/dossier/${dossier.id}/document/${d.key}`} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-800 hover:border-blue-500">
            <Printer className="h-4 w-4" aria-hidden /> Ouvrir pour imprimer
          </Link>
        </Card>
      ))}
      {!toSign.length && <Nav back={back} next={next} />}
    </>
  );
}

function PhoneCheck({ phone, setPhone, verified, setVerified }: { phone: string; setPhone: (v: string) => void; verified: boolean; setVerified: (v: boolean) => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "checking" | "off">("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase().auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u?.phone && u.phone_confirmed_at && u.phone.replace(/\D/g, "") === toE164(phone).replace(/\D/g, "")) setVerified(true);
    });
  }, [phone, setVerified]);

  async function send() {
    setState("sending");
    setError("");
    const { error: e } = await supabase().auth.updateUser({ phone: toE164(phone) });
    if (e) { setState("off"); return; }
    setState("sent");
  }
  async function check() {
    setState("checking");
    const { error: e } = await supabase().auth.verifyOtp({ phone: toE164(phone), token: code.trim(), type: "phone_change" });
    if (e) { setState("sent"); setError("Code incorrect ou expiré."); return; }
    setVerified(true);
  }

  return (
    <div>
      <label htmlFor="sign-phone" className="mb-2 flex items-center gap-2 font-semibold text-zinc-900"><Smartphone className="h-4 w-4" aria-hidden /> Votre numéro de téléphone</label>
      <div className="flex flex-wrap gap-2">
        <input id="sign-phone" type="tel" value={phone} disabled={verified} onChange={(e) => { setPhone(e.target.value); setState("idle"); }} placeholder="Ex. 06 12 34 56 78"
          className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-[16px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:bg-zinc-50" />
        {verified ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-3 text-sm font-bold text-emerald-800"><ShieldCheck className="h-4 w-4" aria-hidden /> Vérifié</span>
        ) : state === "idle" || state === "sending" ? (
          <button type="button" onClick={send} disabled={!phone.trim() || state === "sending"} className="rounded-xl border border-blue-700 px-4 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50 disabled:opacity-50">
            {state === "sending" ? "Envoi..." : "Recevoir un code par SMS"}
          </button>
        ) : null}
      </div>
      {(state === "sent" || state === "checking") && !verified && (
        <div className="mt-2 flex flex-wrap gap-2">
          <input inputMode="numeric" autoComplete="one-time-code" aria-label="Code reçu par SMS" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Code à 6 chiffres"
            className="w-40 rounded-xl border border-zinc-200 px-3.5 py-3 text-[16px] tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
          <button type="button" onClick={check} disabled={code.length < 6 || state === "checking"} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white disabled:bg-zinc-200 disabled:text-zinc-500">Vérifier</button>
        </div>
      )}
      {error && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-700">{error}</p>}
      {state === "off" && <p className="mt-1.5 text-[13px] text-zinc-500">L&apos;envoi de code par SMS n&apos;est pas disponible pour le moment : votre numéro est enregistré avec la signature, votre conseiller le confirmera sur WhatsApp.</p>}
    </div>
  );
}
