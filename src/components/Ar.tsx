// Terme clé en arabe standard (termes administratifs marocains), affiché à côté du français.
// Usage : <Ar>السجل التجاري</Ar> juste après le terme français. Réservé aux mots clés, jamais une traduction complète.
import { cn } from "@/lib/utils";

export function Ar({ children, tone = "muted", block = false, className }: {
  children: React.ReactNode;
  /** muted : fond clair (zinc-500). light : fond bleu-700 ou plus foncé. */
  tone?: "muted" | "light";
  /** block : sur sa propre ligne (sous un titre). */
  block?: boolean;
  className?: string;
}) {
  const term = (
    <span
      lang="ar"
      dir="rtl"
      className={cn(
        "font-arabic font-normal tracking-normal normal-case",
        block ? "inline-block text-[0.5em] leading-normal" : "ml-1.5 mr-1 inline-block text-[0.85em] leading-none",
        tone === "light" ? "text-white/75" : "text-zinc-500",
        className,
      )}
    >
      {children}
    </span>
  );
  // En bloc, le conteneur garde l'alignement du titre (le texte arabe ne part pas à droite).
  return block ? <span className="mt-2 block">{term}</span> : term;
}
