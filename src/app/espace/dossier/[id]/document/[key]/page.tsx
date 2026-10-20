"use client";

// Document du dossier, prêt à imprimer : signé en ligne (avec la trace de signature) ou pré-rempli à signer à la main.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEspace } from "@/components/espace/EspaceShell";
import { fmtDate, type Answer, type Dossier } from "@/lib/espace";
import { parseAnswers } from "@/lib/intake";
import { signDocsFor, type Signature } from "@/lib/signatures";

export default function DocumentPage() {
  const { id, key } = useParams<{ id: string; key: string }>();
  const { email, profile } = useEspace();
  const [state, setState] = useState<{ dossier: Dossier; answers: Answer[]; sig: Signature | null } | null | "absent">(null);

  useEffect(() => {
    const sb = supabase();
    (async () => {
      const { data: dossier } = await sb.from("dossiers").select("*").eq("id", id).maybeSingle();
      if (!dossier) return setState("absent");
      const [{ data: answers }, { data: sig }] = await Promise.all([
        sb.from("dossier_answers").select("*").eq("dossier_id", id),
        sb.from("signatures").select("*").eq("dossier_id", id).eq("doc_key", key).maybeSingle(),
      ]);
      setState({ dossier: dossier as Dossier, answers: (answers ?? []) as Answer[], sig: (sig as Signature | null) ?? null });
    })();
  }, [id, key]);

  if (state === null) return <p className="text-sm text-zinc-500" role="status">Chargement...</p>;
  if (state === "absent") return <p className="text-zinc-600">Document introuvable.</p>;

  const { dossier, answers, sig } = state;
  const live = signDocsFor(dossier, parseAnswers(answers), { email, phone: profile?.phone ?? dossier.summary.contact?.tel ?? "", fullName: profile?.full_name ?? "" }).find((d) => d.key === key);
  const title = sig?.title ?? live?.title;
  const paragraphs = sig ? sig.content.split("\n\n").slice(1) : live?.paragraphs;
  if (!title || !paragraphs) return <p className="text-zinc-600">Document introuvable.</p>;

  return (
    <div className="mx-auto grid max-w-[760px] gap-5">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Link href={`/espace/dossier/${id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft className="h-4 w-4" aria-hidden /> Dossier</Link>
        <button type="button" onClick={() => window.print()} className="ml-auto inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:border-blue-500">
          <Printer className="h-4 w-4" aria-hidden /> Imprimer ou enregistrer en PDF
        </button>
      </div>
      <article className="rounded-3xl border border-zinc-200 bg-white p-8 text-[15px] leading-relaxed text-zinc-900 max-sm:p-5 print:border-0 print:p-0">
        <p className="text-lg font-extrabold">Mziane<span className="text-blue-500">.</span></p>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-zinc-500">Dossier {dossier.reference}</p>
        <div className="mt-6 grid gap-3">{paragraphs.map((p) => <p key={p}>{p}</p>)}</div>

        {sig ? (
          <div className="mt-8 break-inside-avoid">
            <p className="text-[14px]">Signé électroniquement par <b>{sig.signer_name}</b>, le {fmtDate(sig.signed_at, true)}.</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- image de signature stockée en data URL */}
            <img src={sig.signature_png} alt={`Signature de ${sig.signer_name}`} className="mt-2 h-28 w-auto" />
            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-[12px] leading-relaxed text-zinc-600">
              <p className="mb-1 flex items-center gap-1.5 font-bold text-zinc-800"><ShieldCheck className="h-4 w-4" aria-hidden /> Trace de la signature</p>
              <p>Téléphone : {sig.signer_phone || "non renseigné"} {sig.phone_verified ? "(vérifié par code SMS)" : "(non vérifié par SMS)"}</p>
              <p>Date et heure : {new Date(sig.signed_at).toLocaleString("fr-FR")}</p>
              <p className="break-all">Empreinte SHA-256 du texte signé : {sig.content_hash}</p>
              <p className="break-all">Appareil : {sig.user_agent}</p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 text-[14px] sm:grid-cols-2">
            <p>Fait à ______________________<br />le ____ / ____ / ________</p>
            <p>Signature {live?.mode === "legalise" ? "légalisée" : ""}<br /><span className="mt-16 block border-b border-zinc-400" /></p>
          </div>
        )}
      </article>
    </div>
  );
}
