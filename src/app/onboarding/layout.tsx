import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Votre plan en 1 minute | Mziane",
  description: "Quelques questions sur votre projet : statut conseillé, pack adapté, prix connus d'avance et aides de l'État auxquelles vous pourriez avoir droit.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
