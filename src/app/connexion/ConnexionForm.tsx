"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site";
import { waLink } from "@/lib/offers";
import { supabase } from "@/lib/supabase";
import { readPending } from "@/lib/espace";

type Mode = "connexion" | "inscription" | "oubli";

function Field({ id, label, icon: Icon, type = "text", autoComplete, value, onChange, minLength, children }: {
  id: string; label: string; icon: typeof Mail; type?: string; autoComplete?: string; value: string; onChange: (v: string) => void; minLength?: number; children?: React.ReactNode;
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
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-zinc-200 bg-white pr-12 pl-11 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
        />
        {children}
      </span>
    </label>
  );
}

const ERREURS: [RegExp, string][] = [
  [/invalid login credentials/i, "E-mail ou mot de passe incorrect."],
  [/already registered|already exists/i, "Un compte existe déjà avec cet e-mail. Connectez-vous."],
  [/password should be at least/i, "Le mot de passe doit faire au moins 8 caractères."],
  [/rate limit|too many/i, "Trop de tentatives. Réessayez dans quelques minutes ou écrivez-nous sur WhatsApp."],
  [/valid email|invalid email/i, "Cette adresse e-mail semble incorrecte."],
];
const traduire = (msg: string) => ERREURS.find(([r]) => r.test(msg))?.[1] ?? "Une erreur est survenue. Réessayez dans un instant.";

export default function ConnexionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const suivant = params.get("suivant")?.startsWith("/espace") ? params.get("suivant")! : "/espace";
  const [mode, setMode] = useState<Mode>(() => (params.get("mode") === "inscription" ? "inscription" : "connexion"));
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [f, setF] = useState({ nom: "", tel: "", email: "", password: "" });
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  // Déjà connecté : direction l'espace
  useEffect(() => {
    supabase().auth.getSession().then(({ data }) => { if (data.session) router.replace(suivant); });
  }, [router, suivant]);

  // Une commande vient d'être passée : on préremplit l'inscription avec ses coordonnées
  useEffect(() => {
    const p = readPending();
    const c = p?.summary.contact;
    if (!c) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage local au montage
    setF((x) => ({ ...x, nom: x.nom || c.nom || "", tel: x.tel || c.tel || "", email: x.email || c.email || "" }));
    setMode("inscription");
  }, []);

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
    setInfo("");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const sb = supabase();
    const email = f.email.trim().toLowerCase();
    try {
      if (mode === "connexion") {
        const { error } = await sb.auth.signInWithPassword({ email, password: f.password });
        if (error) return setError(traduire(error.message));
        router.replace(suivant);
      } else if (mode === "inscription") {
        const { data, error } = await sb.auth.signUp({ email, password: f.password, options: { data: { full_name: f.nom.trim(), phone: f.tel.trim() } } });
        if (error) return setError(traduire(error.message));
        if (!data.session) return setInfo("Compte créé. Vérifiez vos e-mails pour l'activer, puis connectez-vous.");
        router.replace(suivant);
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/espace/profil?motdepasse=1` });
        if (error) return setError(traduire(error.message));
        setInfo("Si un compte existe avec cet e-mail, vous allez recevoir un lien pour choisir un nouveau mot de passe.");
      }
    } finally {
      setBusy(false);
    }
  }

  const label = mode === "connexion" ? "Se connecter" : mode === "inscription" ? "Créer mon espace" : "Recevoir le lien";

  return (
    <div>
      {mode !== "oubli" ? (
        <div role="tablist" aria-label="Connexion ou inscription" className="mb-7 grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1.5">
          {(["connexion", "inscription"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
              className={cn("rounded-full py-2.5 text-sm font-semibold transition", mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900")}>
              {m === "connexion" ? "Se connecter" : "Créer un compte"}
            </button>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-[15px] text-zinc-600">Indiquez votre e-mail : nous vous envoyons un lien pour choisir un nouveau mot de passe.</p>
      )}

      <form onSubmit={submit} className="grid gap-4">
        {mode === "inscription" && (
          <>
            <Field id="nom" label="Nom et prénom" icon={User} autoComplete="name" value={f.nom} onChange={set("nom")} minLength={2} />
            <Field id="telephone" label="Téléphone (WhatsApp)" icon={Phone} type="tel" autoComplete="tel" value={f.tel} onChange={set("tel")} minLength={8} />
          </>
        )}
        <Field id="email" label="Adresse e-mail" icon={Mail} type="email" autoComplete="email" value={f.email} onChange={set("email")} />
        {mode !== "oubli" && (
          <Field id="password" label="Mot de passe" icon={Lock} type={showPwd ? "text" : "password"} autoComplete={mode === "connexion" ? "current-password" : "new-password"} value={f.password} onChange={set("password")} minLength={8}>
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
              {showPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </Field>
        )}
        {mode === "inscription" && <p className="-mt-2 text-[13px] text-zinc-500">8 caractères minimum.</p>}

        {mode === "connexion" && (
          <div className="flex justify-end">
            <button type="button" onClick={() => switchMode("oubli")} className="text-sm font-semibold text-blue-700 hover:underline">Mot de passe oublié ?</button>
          </div>
        )}

        {error && (
          <p role="alert" className="flex gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" /> {error}</p>
        )}
        {info && (
          <p role="status" className="flex gap-2.5 rounded-xl bg-blue-50 p-3.5 text-sm text-blue-900"><CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" /> {info}</p>
        )}

        <button type="submit" disabled={busy} className="mt-1 h-12 rounded-xl bg-blue-700 font-bold text-white shadow-[0_10px_20px_-8px_rgba(0,105,122,.5)] transition hover:bg-blue-800 disabled:opacity-60">
          {busy ? "Un instant..." : label}
        </button>

        {mode === "oubli" && (
          <button type="button" onClick={() => switchMode("connexion")} className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">Retour à la connexion</button>
        )}
      </form>

      <a href={waLink("Bonjour, j'ai besoin d'aide pour accéder à mon espace client.")} target="_blank" rel="noopener noreferrer"
        className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 font-bold text-zinc-900 transition hover:border-zinc-300">
        <WhatsAppIcon className="h-5 w-5 text-[#128C4B]" /> Besoin d&apos;aide ? WhatsApp
      </a>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Pas encore client ?{" "}
        <Link href="/onboarding" className="font-semibold text-blue-700 hover:underline">Trouver ma solution</Link>
      </p>
    </div>
  );
}
