"use client";

// Bouton WhatsApp flottant, présent sur tout le site.
// Le message prérempli dépend de la page pour que le conseiller sache d'emblée de quoi il s'agit.
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/offers";
import { WhatsAppIcon } from "@/components/site";

const MESSAGES: [prefix: string, text: string][] = [
  ["/packs", "Bonjour, j'ai une question sur les packs Mziane."],
  ["/tarifs", "Bonjour, j'ai une question sur vos tarifs."],
  ["/creation-entreprise", "Bonjour, je souhaite créer mon entreprise au Maroc."],
  ["/aides", "Bonjour, je voudrais savoir à quelles aides de l'État j'ai droit."],
  ["/comptabilite", "Bonjour, je cherche un accompagnement pour ma comptabilité."],
  ["/gestion", "Bonjour, j'ai une formalité à faire pour ma société."],
  ["/expatriation", "Bonjour, je vis à l'étranger et je souhaite créer mon entreprise au Maroc."],
  ["/non-residents", "Bonjour, je ne réside pas au Maroc et je souhaite y créer une entreprise."],
  ["/onboarding", "Bonjour, j'ai une question en remplissant le questionnaire."],
  ["/connexion", "Bonjour, je souhaite avoir des nouvelles de mon dossier."],
];
const DEFAUT = "Bonjour, je souhaite créer mon entreprise et connaître les aides auxquelles j'ai droit.";

/** Pages qui ont leur propre barre fixe en bas d'écran sur mobile. */
const AVEC_BARRE_MOBILE = ["/packs"];
/** Pages où le bouton gênerait le parcours (la commande a sa propre barre et son lien WhatsApp). */
const MASQUE = ["/commande"];

const match = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

export default function WhatsAppButton() {
  const pathname = usePathname() ?? "/";
  if (MASQUE.some((p) => match(pathname, p))) return null;

  const text = MESSAGES.find(([p]) => match(pathname, p))?.[1] ?? DEFAUT;
  const raised = AVEC_BARRE_MOBILE.some((p) => match(pathname, p));

  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire à Mziane sur WhatsApp (nouvelle fenêtre)"
      title="Écrire sur WhatsApp"
      style={{ right: "calc(1rem + env(safe-area-inset-right, 0px))" }}
      className={cn(
        "group fixed z-40 grid h-14 w-14 place-items-center rounded-full bg-[#128C4B] text-white shadow-[0_12px_28px_-8px_rgba(18,140,75,.6)] ring-4 ring-white transition hover:-translate-y-0.5 hover:bg-[#0E7A40] focus-visible:outline-none focus-visible:ring-[#00697A] motion-reduce:transition-none",
        raised
          ? "bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] md:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
          : "bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] md:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]",
      )}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
