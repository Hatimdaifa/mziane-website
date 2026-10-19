import type { Metadata } from "next";
import { Suspense } from "react";
import OrderFlow from "@/components/order/OrderFlow";

export const metadata: Metadata = {
  title: "Votre commande | Mziane",
  description: "Composez votre commande, vérifiez le récapitulatif et envoyez-la sur WhatsApp. Un conseiller vous confirme tout et vous envoie le lien de paiement.",
  robots: { index: false, follow: true },
};

export default function CommandePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-zinc-50" />}>
      <OrderFlow />
    </Suspense>
  );
}
