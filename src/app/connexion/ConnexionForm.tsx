"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Info, Mail, Lock, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site";
import { CONTACT, mailLink, waLink } from "@/lib/offers";

type Mode = "connexion" | "inscription";

function Field({ id, label, icon: Icon, type = "text", autoComplete, children }: {
  id: string; label: string; icon: typeof Mail; type?: string; autoComplete?: string; children?: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="grid gap-1.5">
      <span className="text-sm font-semibold text-zinc-900">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-4 h-4.5 w-4.5 text-zinc-400" />
        <input
          id={id}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-zinc-200 bg-white pr-12 pl-11 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
        />
        {children}
      </span>
    </label>
  );
}

export default function ConnexionForm() {
  const [mode, setMode] = useState<Mode>("connexion");
  const [showPwd, setShowPwd] = useState(false);
  const [notice, setNotice] = useState(false);

  // L'espace client n'est pas encore relié à une base de comptes : aucune donnée n'est envoyée.
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(true);
  }

  return (
    <div>
      <div role="tablist" aria-label="Connexion ou inscription" className="mb-7 grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1.5">
        {(["connexion", "inscription"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => { setMode(m); setNotice(false); }}
            className={cn("rounded-full py-2.5 text-sm font-semibold transition", mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900")}
          >
            {m === "connexion" ? "Se connecter" : "Créer un compte"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid gap-4">
        {mode === "inscription" && (
          <>
            <Field id="nom" label="Nom et prénom" icon={User} autoComplete="name" />
            <Field id="telephone" label="Téléphone" icon={Phone} type="tel" autoComplete="tel" />
          </>
        )}
        <Field id="email" label="Adresse e-mail" icon={Mail} type="email" autoComplete="email" />
        <Field id="password" label="Mot de passe" icon={Lock} type={showPwd ? "text" : "password"} autoComplete={mode === "connexion" ? "current-password" : "new-password"}>
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-3 grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          >
            {showPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </Field>

        {mode === "connexion" && (
          <div className="flex justify-end">
            <a href={mailLink("Mot de passe oublié")} className="text-sm font-semibold text-blue-700 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        )}

        <button type="submit" className="mt-1 h-12 rounded-xl bg-blue-700 font-bold text-white shadow-[0_10px_20px_-8px_rgba(0,105,122,.5)] transition hover:bg-blue-800">
          {mode === "connexion" ? "Se connecter" : "Créer un compte"}
        </button>

        {notice && (
          <div role="status" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <p>
              L&apos;espace client en ligne n&apos;est pas encore ouvert et aucune donnée n&apos;a été envoyée. Votre conseiller suit votre dossier et vous répond sur{" "}
              <a href={waLink("Bonjour, je souhaite avoir des nouvelles de mon dossier.")} target="_blank" rel="noopener noreferrer" className="font-semibold underline">WhatsApp</a>{" "}
              ou à{" "}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold underline">{CONTACT.email}</a>.
            </p>
          </div>
        )}
      </form>

      <a
        href={waLink("Bonjour, je souhaite avoir des nouvelles de mon dossier.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0E7A40] font-bold text-white transition hover:bg-[#0B6634]"
      >
        <WhatsAppIcon className="h-5 w-5" /> Suivre mon dossier sur WhatsApp
      </a>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Pas encore client ?{" "}
        <Link href="/onboarding" className="font-semibold text-blue-700 hover:underline">Trouver ma solution</Link>
      </p>
    </div>
  );
}
