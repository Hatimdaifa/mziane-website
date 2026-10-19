"use client";

// Espace client : types, statuts, session et envoi des documents.
// Les tables et les règles d'accès sont décrites dans supabase/migrations.
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// ── Types ───────────────────────────────────────────────────────────────────
export type Role = "client" | "conseiller";
export interface Profile { id: string; full_name: string; phone: string; role: Role; created_at: string }

export type DossierStatus = "recu" | "documents" | "en_cours" | "depose" | "termine" | "annule";
export interface DossierSpec { packId?: string; offreId?: string; formalites?: string[]; forme?: string; opts?: string[]; mode?: string }
export interface SummaryLine { label: string; value: string }
export interface DossierSummary { start?: SummaryLine[]; startTotal?: string; recurring?: SummaryLine[]; success?: SummaryLine[]; contact?: { nom?: string; tel?: string; email?: string; ville?: string } }
export interface ExtraDoc { id: string; label: string; hint?: string }

export interface Dossier {
  id: string;
  user_id: string;
  reference: string;
  title: string;
  spec: DossierSpec;
  summary: DossierSummary;
  status: DossierStatus;
  extra_docs: ExtraDoc[];
  created_at: string;
  updated_at: string;
}

export type DocStatus = "recu" | "valide" | "a_refaire";
export interface DocFile {
  id: string;
  dossier_id: string;
  user_id: string;
  requirement_id: string | null;
  name: string;
  path: string;
  size: number;
  mime: string;
  from_mziane: boolean;
  status: DocStatus;
  comment: string;
  created_at: string;
}

export interface Answer { dossier_id: string; requirement_id: string; user_id: string; value: string; updated_at: string }

export interface DossierEvent { id: string; dossier_id: string; author: string | null; kind: "note" | "statut" | "document" | "demande"; text: string; created_at: string }

// ── Libellés ────────────────────────────────────────────────────────────────
export const STATUTS: { id: DossierStatus; label: string; ar: string; desc: string }[] = [
  { id: "recu", label: "Commande reçue", ar: "تم استلام الطلب", desc: "Votre conseiller vérifie la commande avec vous." },
  { id: "documents", label: "Documents à fournir", ar: "الوثائق المطلوبة", desc: "Ajoutez les pièces demandées ci-dessous." },
  { id: "en_cours", label: "Dossier en préparation", ar: "الملف قيد الإعداد", desc: "Nous préparons et vérifions votre dossier." },
  { id: "depose", label: "Déposé à l'administration", ar: "تم إيداع الملف", desc: "Le dossier est entre les mains de l'organisme." },
  { id: "termine", label: "Terminé", ar: "تم الإنجاز", desc: "Vos documents finaux sont disponibles ici." },
];
export const ANNULE = { id: "annule" as const, label: "Annulé", ar: "ملغى", desc: "Ce dossier a été annulé." };
export const statutInfo = (s: DossierStatus) => STATUTS.find((x) => x.id === s) ?? ANNULE;

export const DOC_STATUTS: Record<DocStatus, { label: string; ar: string; tone: string }> = {
  recu: { label: "En vérification", ar: "قيد التحقق", tone: "bg-zinc-100 text-zinc-700" },
  valide: { label: "Validé", ar: "مقبول", tone: "bg-emerald-50 text-emerald-800" },
  a_refaire: { label: "À renvoyer", ar: "يرجى إعادة الإرسال", tone: "bg-red-50 text-red-700" },
};

export const fmtDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(iso));

export const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`);

// ── Session ─────────────────────────────────────────────────────────────────
export function useSession() {
  const [state, setState] = useState<{ loading: boolean; session: Session | null; profile: Profile | null }>({ loading: true, session: null, profile: null });

  useEffect(() => {
    const sb = supabase();
    let alive = true;
    async function load(session: Session | null) {
      let profile: Profile | null = null;
      if (session) {
        const { data } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        profile = (data as Profile | null) ?? null;
      }
      if (alive) setState({ loading: false, session, profile });
    }
    sb.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load(session);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

// ── Commande en attente de rattachement ─────────────────────────────────────
// Une commande passée sans être connecté est gardée ici, puis rattachée au compte à la connexion.
const PENDING_KEY = "mziane-dossier-attente";
export interface PendingDossier { reference: string; title: string; spec: DossierSpec; summary: DossierSummary }

export function savePending(p: PendingDossier) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(p)); } catch { /* stockage indisponible */ }
}

export function readPending(): PendingDossier | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingDossier) : null;
  } catch {
    return null;
  }
}

/** Crée le dossier de la commande en attente ; renvoie son id (ou celui du dossier déjà créé). */
export async function attachPending(userId: string): Promise<string | null> {
  const p = readPending();
  if (!p) return null;
  const sb = supabase();
  const { data, error } = await sb.from("dossiers").insert({ user_id: userId, reference: p.reference, title: p.title, spec: p.spec, summary: p.summary }).select("id").single();
  let id = data?.id as string | undefined;
  if (error) {
    // Déjà rattachée (même référence) : on retrouve le dossier
    const { data: existing } = await sb.from("dossiers").select("id").eq("reference", p.reference).maybeSingle();
    id = existing?.id;
  }
  try { localStorage.removeItem(PENDING_KEY); } catch { /* rien */ }
  return id ?? null;
}

/** Enregistre directement une commande quand le client est déjà connecté. */
export async function createDossier(p: PendingDossier): Promise<string | null> {
  const sb = supabase();
  const { data: s } = await sb.auth.getSession();
  if (!s.session) {
    savePending(p);
    return null;
  }
  const { data } = await sb.from("dossiers").insert({ user_id: s.session.user.id, reference: p.reference, title: p.title, spec: p.spec, summary: p.summary }).select("id").single();
  return (data?.id as string | undefined) ?? null;
}

// ── Fichiers ────────────────────────────────────────────────────────────────
export const MAX_SIZE = 10 * 1024 * 1024;
export const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";
const OK_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/** Réduit les photos lourdes prises au téléphone (JPEG, PNG, WebP) pour un envoi rapide. */
async function shrinkImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 2.5 * 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.(png|webp|jpe?g)$/i, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function guessType(file: File) {
  if (file.type) return file.type;
  if (/\.heic$/i.test(file.name)) return "image/heic";
  if (/\.heif$/i.test(file.name)) return "image/heif";
  if (/\.pdf$/i.test(file.name)) return "application/pdf";
  return "";
}

export async function uploadDocument(p: { file: File; dossier: Dossier; requirementId: string | null; fromMziane?: boolean; authorId: string }): Promise<{ ok: true; doc: DocFile } | { ok: false; error: string }> {
  const type = guessType(p.file);
  if (!OK_TYPES.includes(type)) return { ok: false, error: "Format non accepté. Envoyez un PDF ou une photo (JPG, PNG, HEIC)." };
  const file = await shrinkImage(p.file);
  if (file.size > MAX_SIZE) return { ok: false, error: "Fichier trop lourd (10 Mo maximum). Prenez une photo moins grande ou compressez le PDF." };

  const sb = supabase();
  const ext = (file.name.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? type.split("/")[1]).toLowerCase();
  const path = `${p.dossier.user_id}/${p.dossier.id}/${crypto.randomUUID()}.${ext}`;
  const up = await sb.storage.from("documents").upload(path, file, { contentType: file.type || type, upsert: false });
  if (up.error) return { ok: false, error: "L'envoi a échoué. Vérifiez votre connexion et réessayez." };

  const { data, error } = await sb.from("documents").insert({
    dossier_id: p.dossier.id,
    user_id: p.dossier.user_id,
    requirement_id: p.requirementId,
    name: p.file.name,
    path,
    size: file.size,
    mime: file.type || type,
    from_mziane: !!p.fromMziane,
  }).select("*").single();
  if (error || !data) {
    await sb.storage.from("documents").remove([path]);
    return { ok: false, error: "L'envoi a échoué. Réessayez dans un instant." };
  }
  await sb.from("dossier_events").insert({ dossier_id: p.dossier.id, author: p.authorId, kind: "document", text: `${p.fromMziane ? "Document transmis par Mziane" : "Document ajouté"} : ${p.file.name}` });
  return { ok: true, doc: data as DocFile };
}

export async function openDocument(doc: DocFile, download = false) {
  const { data } = await supabase().storage.from("documents").createSignedUrl(doc.path, 120, download ? { download: doc.name } : undefined);
  if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

export async function removeDocument(doc: DocFile) {
  const sb = supabase();
  const { error } = await sb.from("documents").delete().eq("id", doc.id);
  if (error) return false;
  await sb.storage.from("documents").remove([doc.path]);
  return true;
}
