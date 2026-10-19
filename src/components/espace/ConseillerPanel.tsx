"use client";

// Outils du conseiller sur un dossier : étape, vérification des pièces, documents à transmettre, messages.
import { useState } from "react";
import { Check, Eye, Loader2, Mail, Phone, RotateCcw, Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site";
import type { DossierData } from "@/components/espace/DossierView";
import { supabase } from "@/lib/supabase";
import { ACCEPT, ANNULE, STATUTS, openDocument, statutInfo, uploadDocument, type DocFile, type DossierStatus } from "@/lib/espace";

const waTo = (phone: string, text: string) => `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;

export default function ConseillerPanel({ data, authorId, onChange }: { data: DossierData; authorId: string; onChange: () => void }) {
  const { dossier, docs, owner } = data;
  const sb = supabase();
  const [note, setNote] = useState("");
  const [req, setReq] = useState({ label: "", hint: "" });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const toCheck = docs.filter((d) => !d.from_mziane && d.status === "recu");
  const contact = dossier.summary.contact ?? {};
  const phone = owner?.phone || contact.tel || "";
  const name = owner?.full_name || contact.nom || "Client";

  async function run(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    setError("");
    try { await fn(); } catch { setError("Action impossible, réessayez."); }
    setBusy("");
    onChange();
  }

  const event = (kind: "note" | "statut" | "demande", text: string) => sb.from("dossier_events").insert({ dossier_id: dossier.id, author: authorId, kind, text });

  const setStatus = (status: DossierStatus) => run("statut", async () => {
    const { error } = await sb.from("dossiers").update({ status }).eq("id", dossier.id);
    if (error) throw error;
    await event("statut", `Étape : ${statutInfo(status).label}`);
  });

  const review = (doc: DocFile, ok: boolean) => {
    const comment = ok ? "" : window.prompt("Que doit corriger le client ? (visible par le client)", "Photo floue, merci de la reprendre en pleine lumière.");
    if (!ok && comment === null) return;
    return run(`doc-${doc.id}`, async () => {
      const { error } = await sb.from("documents").update({ status: ok ? "valide" : "a_refaire", comment: comment ?? "" }).eq("id", doc.id);
      if (error) throw error;
      if (!ok) await event("demande", `Pièce à renvoyer : ${doc.name}. ${comment}`);
    });
  };

  const sendNote = () => run("note", async () => {
    if (!note.trim()) return;
    await event("note", note.trim());
    setNote("");
  });

  const requestDoc = () => run("demande", async () => {
    if (!req.label.trim()) return;
    const extra = [...dossier.extra_docs, { id: `extra-${Date.now().toString(36)}`, label: req.label.trim(), hint: req.hint.trim() || undefined }];
    const { error } = await sb.from("dossiers").update({ extra_docs: extra }).eq("id", dossier.id);
    if (error) throw error;
    await event("demande", `Nouvelle pièce demandée : ${req.label.trim()}`);
    setReq({ label: "", hint: "" });
  });

  const deliver = (files: FileList | null) => files?.length && run("envoi", async () => {
    for (const file of Array.from(files)) {
      const r = await uploadDocument({ file, dossier, requirementId: null, fromMziane: true, authorId });
      if (!r.ok) throw new Error(r.error);
    }
  });

  const input = "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";
  const btn = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50";

  return (
    <section className="rounded-3xl border-2 border-blue-200 bg-blue-50/40 p-6 max-sm:p-5" aria-label="Outils du conseiller">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-blue-800">Espace conseiller</p>
          <p className="mt-1 text-lg font-bold text-zinc-900">{name}</p>
          <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-zinc-600">
            {phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" aria-hidden />{phone}</span>}
            {contact.email && <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden />{contact.email}</span>}
            {contact.ville && <span>{contact.ville}</span>}
          </p>
        </div>
        {phone && (
          <a href={waTo(phone, `Bonjour ${name.split(" ")[0]}, c'est Mziane au sujet de votre dossier ${dossier.reference}.`)} target="_blank" rel="noopener noreferrer"
            className={cn(btn, "bg-[#0E7A40] text-white hover:bg-[#0B6634]")}>
            <WhatsAppIcon className="h-4 w-4" /> Écrire au client
          </a>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="statut" className="text-sm font-semibold text-zinc-800">Étape du dossier</label>
        <select id="statut" value={dossier.status} disabled={busy === "statut"} onChange={(e) => setStatus(e.target.value as DossierStatus)} className={cn(input, "mt-1.5 h-11 py-0")}>
          {[...STATUTS, ANNULE].map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {toCheck.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-zinc-800">À vérifier ({toCheck.length})</p>
          <ul className="mt-2 grid gap-2">
            {toCheck.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5">
                <span className="min-w-0 flex-1 truncate text-[14px] text-zinc-800" title={d.name}>{d.name}</span>
                <button type="button" onClick={() => openDocument(d)} className={cn(btn, "px-2.5 text-zinc-600 hover:bg-zinc-100")} aria-label={`Voir ${d.name}`}><Eye className="h-4 w-4" /></button>
                <button type="button" onClick={() => review(d, true)} disabled={busy === `doc-${d.id}`} className={cn(btn, "bg-emerald-600 py-2 text-white hover:bg-emerald-700")}><Check className="h-4 w-4" aria-hidden /> Valider</button>
                <button type="button" onClick={() => review(d, false)} disabled={busy === `doc-${d.id}`} className={cn(btn, "border border-red-200 bg-white py-2 text-red-700 hover:bg-red-50")}><RotateCcw className="h-4 w-4" aria-hidden /> À renvoyer</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Transmettre un document au client</p>
          <p className="text-[13px] text-zinc-500">Statuts, registre de commerce, attestations...</p>
          <input type="file" accept={ACCEPT} multiple id="livrable" className="sr-only" onChange={(e) => { deliver(e.target.files); e.target.value = ""; }} />
          <label htmlFor="livrable" className={cn(btn, "mt-2 cursor-pointer bg-blue-700 text-white hover:bg-blue-800", busy === "envoi" && "pointer-events-none opacity-60")}>
            {busy === "envoi" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />} Choisir un fichier
          </label>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-800">Demander une pièce en plus</p>
          <input value={req.label} onChange={(e) => setReq({ ...req, label: e.target.value })} placeholder="Ex. : Attestation de travail" className={cn(input, "mt-2")} aria-label="Pièce demandée" />
          <input value={req.hint} onChange={(e) => setReq({ ...req, hint: e.target.value })} placeholder="Précision (facultatif)" className={cn(input, "mt-2")} aria-label="Précision" />
          <button type="button" onClick={requestDoc} disabled={!req.label.trim() || busy === "demande"} className={cn(btn, "mt-2 bg-zinc-900 text-white hover:bg-zinc-800")}>Demander</button>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="note" className="text-sm font-semibold text-zinc-800">Message au client <span className="font-normal text-zinc-500">(visible dans son historique)</span></label>
        <div className="mt-1.5 flex gap-2">
          <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : Dossier déposé au CRI, réponse attendue sous 5 jours." className={input} />
          <button type="button" onClick={sendNote} disabled={!note.trim() || busy === "note"} className={cn(btn, "bg-zinc-900 text-white hover:bg-zinc-800")} aria-label="Envoyer le message"><Send className="h-4 w-4" aria-hidden /></button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
    </section>
  );
}
