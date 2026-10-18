import type { Metadata } from "next";
import { FolderCheck, FileText, MessageCircle, HandCoins } from "lucide-react";
import { Logo } from "@/components/Navbar";
import ConnexionForm from "./ConnexionForm";

export const metadata: Metadata = {
  title: "Connexion à mon espace | Mziane",
  description: "Accédez à votre espace client Mziane pour suivre vos dossiers de création, d'aides et de comptabilité.",
};

const avantages = [
  { icon: FolderCheck, title: "Suivez vos dossiers", desc: "Création, aides, formalités : chaque étape en temps réel." },
  { icon: FileText, title: "Retrouvez vos documents", desc: "Statuts, registre de commerce, attestations, bilans." },
  { icon: HandCoins, title: "Vos aides en un coup d'œil", desc: "Dossiers déposés, décisions et versements." },
  { icon: MessageCircle, title: "Échangez avec votre conseiller", desc: "Vos questions et vos pièces au même endroit." },
];

export default function ConnexionPage() {
  return (
    <section className="bg-zinc-50 px-6 py-14 max-sm:px-4 max-sm:py-8">
      <div className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_30px_60px_-30px_rgba(31,42,61,.3)] lg:grid-cols-[1fr_1.05fr]">
        <div className="px-10 py-12 max-sm:px-6 max-sm:py-8">
          <h1 className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-extrabold tracking-tight text-zinc-900">Mon espace client</h1>
          <p className="mt-2 mb-8 text-zinc-600">Connectez-vous pour suivre vos dossiers et échanger avec votre conseiller.</p>
          <ConnexionForm />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 px-10 py-12 text-white max-lg:hidden">
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(254,215,102,.3)_0%,transparent_65%)]" />
          <div className="relative">
            <Logo dark />
            <p className="mt-8 text-2xl font-extrabold leading-snug tracking-tight text-balance">
              Toute votre entreprise au même endroit.
            </p>
            <ul className="mt-8 grid gap-5">
              {avantages.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-amber-400"><Icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block font-bold">{title}</span>
                    <span className="block text-sm text-white/70">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
