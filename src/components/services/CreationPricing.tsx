"use client";

// Les 3 paliers de création de société, au prix réel de la forme choisie.
import { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCard } from "@/components/site";
import { OfficialFeesNote, offerToTier } from "@/components/offer-ui";
import { FORMES, PRIX_CREATION, creationSociete, type FormeId } from "@/lib/offers";
import { commandeOffre } from "@/components/services/blocks";

const choix = FORMES.filter((f) => f.kind === "societe");

export default function CreationPricing() {
  const [forme, setForme] = useState<FormeId>(choix[0].id);
  const prix = PRIX_CREATION[forme] ?? [0, 0, 0];
  const prixUnique = prix.every((p) => p === prix[0]);
  const label = choix.find((f) => f.id === forme)?.short ?? "";

  const offres = creationSociete
    .map((o, i) => ({ ...o, price: prix[i] }))
    .filter((o) => !prixUnique || o.popular);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Forme de la société">
        {choix.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={forme === f.id}
            onClick={() => setForme(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              forme === f.id ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-500",
            )}
          >
            {f.short}
          </button>
        ))}
      </div>

      <div className={cn("grid gap-6", prixUnique ? "mx-auto max-w-[420px]" : "md:grid-cols-3")}>
        {offres.map((o) => (
          <PriceCard key={o.id} icon={Building2} tier={offerToTier(o, commandeOffre(o.id, forme), `Créer ma ${label} en ${o.name}`)} />
        ))}
      </div>
      {prixUnique && (
        <p className="mt-4 text-center text-sm text-zinc-600">Pour une {label.toLowerCase()}, un seul prix : statuts sur mesure et suivi inclus.</p>
      )}
      <OfficialFeesNote className="mx-auto mt-6 max-w-[720px]" />
    </div>
  );
}
