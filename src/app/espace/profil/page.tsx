"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ar } from "@/components/Ar";
import { useEspace } from "@/components/espace/EspaceShell";
import { Card } from "@/components/espace/ui";
import { supabase } from "@/lib/supabase";

const input = "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";

export default function ProfilPage() {
  return <Suspense><Profil /></Suspense>;
}

function Profil() {
  const { userId, email, profile } = useEspace();
  const reset = useSearchParams().get("motdepasse") === "1";
  const [f, setF] = useState({ nom: profile?.full_name ?? "", tel: profile?.phone ?? "" });
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<{ which: "profil" | "pwd"; ok: boolean; text: string } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase().from("profiles").update({ full_name: f.nom.trim(), phone: f.tel.trim() }).eq("id", userId);
    setMsg({ which: "profil", ok: !error, text: error ? "Échec de l'enregistrement, réessayez." : "Coordonnées enregistrées." });
  }

  async function savePwd(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase().auth.updateUser({ password: pwd });
    setMsg({ which: "pwd", ok: !error, text: error ? "Le mot de passe doit faire au moins 8 caractères." : "Mot de passe modifié." });
    if (!error) setPwd("");
  }

  const note = (which: "profil" | "pwd") => msg?.which === which && (
    <p role="status" className={msg.ok ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>{msg.text}</p>
  );

  return (
    <div className="grid max-w-[560px] gap-5">
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold tracking-tight text-zinc-900">Mon profil <Ar>معلوماتي</Ar></h1>

      <Card>
        <form onSubmit={saveProfile} className="grid gap-4">
          <label className="grid gap-1.5"><span className="text-sm font-semibold text-zinc-900">Nom et prénom</span>
            <input className={input} value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} autoComplete="name" required minLength={2} /></label>
          <label className="grid gap-1.5"><span className="text-sm font-semibold text-zinc-900">Téléphone (WhatsApp)</span>
            <input className={input} type="tel" value={f.tel} onChange={(e) => setF({ ...f, tel: e.target.value })} autoComplete="tel" /></label>
          <p className="text-sm text-zinc-600">E-mail de connexion : <span className="font-semibold text-zinc-900">{email}</span></p>
          <div className="flex items-center gap-3">
            <button type="submit" className="h-11 rounded-xl bg-blue-700 px-5 font-bold text-white hover:bg-blue-800">Enregistrer</button>
            {note("profil")}
          </div>
        </form>
      </Card>

      <Card className={reset ? "border-2 border-blue-500" : undefined}>
        <form onSubmit={savePwd} className="grid gap-4">
          <h2 className="text-lg font-bold text-zinc-900">{reset ? "Choisissez votre nouveau mot de passe" : "Changer de mot de passe"}</h2>
          <label className="grid gap-1.5"><span className="text-sm font-semibold text-zinc-900">Nouveau mot de passe</span>
            <input className={input} type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="new-password" required minLength={8} /></label>
          <div className="flex items-center gap-3">
            <button type="submit" className="h-11 rounded-xl bg-zinc-900 px-5 font-bold text-white hover:bg-zinc-800">Modifier</button>
            {note("pwd")}
          </div>
        </form>
      </Card>

      <p className="text-[13px] text-zinc-500">Vos documents sont privés : seuls vous et votre conseiller Mziane y avez accès. Pour supprimer votre compte et vos données, écrivez-nous.</p>
    </div>
  );
}
