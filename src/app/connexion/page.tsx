import type { Metadata } from "next";
import { FolderCheck, FileText, MessageCircle, HandCoins } from "lucide-react";
import { Logo } from "@/components/Navbar";
import { WhatsAppIcon } from "@/components/site";
import { CONTACT, waLink } from "@/lib/offers";
import ConnexionForm from "./ConnexionForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "L'espace client en ligne de Mziane est en préparation. Votre conseiller suit votre dossier et vous répond sur WhatsApp ou par e-mail.",
};

const avantages = [
  { icon: MessageCircle, title: "Votre conseiller sur WhatsApp", desc: "Vos questions et vos pièces passent par WhatsApp, à chaque étape." },
  { icon: FolderCheck, title: "Des nouvelles de votre dossier", desc: "Nous vous prévenons dès qu'une étape est franchie." },
  { icon: FileText, title: "Vos documents envoyés", desc: "Statuts, registre de commerce, attestations : transmis dès réception." },
  { icon: HandCoins, title: "Vos aides suivies", desc: "Dépôt, relances et décision de l'organisme." },
];

export default function ConnexionPage() {
  return (
    <section className="bg-zinc-50 px-6 py-14 max-sm:px-4 max-sm:py-8">
      <div className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_30px_60px_-30px_rgba(31,42,61,.3)] lg:grid-cols-[1fr_1.05fr]">
        <div className="px-10 py-12 max-sm:px-6 max-sm:py-8">
          <h1 className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-extrabold tracking-tight text-zinc-900">Espace client</h1>
          <p className="mt-2 mb-8 text-zinc-600">L&apos;espace client en ligne est en préparation. Pour toute question sur votre dossier, votre conseiller vous répond sur WhatsApp.</p>
          <ConnexionForm />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-700 px-10 py-12 text-white max-lg:hidden">
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(254,215,102,.3)_0%,transparent_65%)]" />
          <div className="relative">
            <Logo dark />
            <p className="mt-8 text-2xl font-extrabold leading-snug tracking-tight text-balance">
              En attendant l&apos;espace en ligne, votre suivi se fait avec votre conseiller.
            </p>
            <ul className="mt-8 grid gap-5">
              {avantages.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white"><Icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block font-bold">{title}</span>
                    <span className="block text-sm text-white/85">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={waLink("Bonjour, je souhaite avoir des nouvelles de mon dossier.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-zinc-900 transition hover:bg-zinc-50"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#128C4B]" /> WhatsApp {CONTACT.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
