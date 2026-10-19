"use client";

// Grille des packs filtrée par profil, avec bascule mensuel / payé d'avance.
// Le pack recommandé est au centre sur grand écran et en premier sur mobile (effet de compromis).
import { useState } from "react";
import { Building2, HandCoins, LayoutGrid, Plane, Sparkles, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Profil, packs } from "@/lib/offers";
import { PackCard, type PackPayment } from "@/components/offer-ui";
import { FEATURED_BY_PROFIL, MOIS_OFFERTS_AVANCE, PACK_ICONS, sortPacks } from "./meta";
import { packHref } from "./links";
import { TerreCard } from "./TerreCard";
import { Tablist, Toggle, panelId, tabId } from "./Tablist";

type Filtre = Profil | "tous";

const FILTRES = [
  { id: "tous" as const, label: "Tous", icon: LayoutGrid },
  { id: "societe" as const, label: "Société", icon: Building2 },
  { id: "auto" as const, label: "Auto-entrepreneur", icon: Sparkles },
  { id: "aides" as const, label: "Aides", icon: HandCoins },
  { id: "agri" as const, label: "Agriculteur", icon: Sprout },
  { id: "mre" as const, label: "MRE", icon: Plane },
];

const PREFIX = "packs-profil";

export default function PacksExplorer() {
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [payment, setPayment] = useState<PackPayment>("monthly");

  const visible = sortPacks(filtre === "tous" ? packs : packs.filter((p) => p.profils.includes(filtre)));
  const showTerre = filtre === "tous" || filtre === "aides" || filtre === "agri";
  const featuredId = FEATURED_BY_PROFIL[filtre] || visible.find((p) => p.popular)?.id || visible[0]?.id;
  const featured = visible.find((p) => p.id === featuredId);
  const others = visible.filter((p) => p !== featured);
  const canPrepay = visible.some((p) => p.upfront);
  const count = visible.length + (showTerre ? 1 : 0);

  // Ordre DOM : recommandé d'abord (mobile). Sur grand écran : un autre à gauche, le recommandé au centre.
  const ordered = featured ? [featured, ...others] : others;
  const lgOrder = (n: number, isFeatured: boolean) =>
    count < 3 ? "" : isFeatured ? "lg:order-2" : n === 1 ? "lg:order-1" : "lg:order-3";

  return (
    <div>
      <Tablist items={FILTRES} active={filtre} onChange={setFiltre} label="Filtrer les packs par profil" idPrefix={PREFIX} />

      {canPrepay && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Toggle
            label="Mode de paiement"
            value={payment}
            onChange={setPayment}
            options={[
              { id: "monthly", label: "Payé chaque mois" },
              { id: "upfront", label: "Payé d'avance", hint: `${MOIS_OFFERTS_AVANCE} mois offerts` },
            ]}
          />
        </div>
      )}

      <div
        id={panelId(PREFIX)}
        role="tabpanel"
        aria-labelledby={tabId(PREFIX, filtre)}
        className={cn(
          "mt-12 grid gap-8 md:gap-6",
          count === 1 && "mx-auto max-w-[440px]",
          count === 2 && "mx-auto max-w-[900px] md:grid-cols-2",
          count >= 3 && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {ordered.map((p, n) => (
          <PackCard
            key={p.id}
            pack={p}
            icon={PACK_ICONS[p.id]}
            payment={payment}
            highlighted={p === featured}
            href={packHref(p, { upfront: payment === "upfront" })}
            className={lgOrder(n, p === featured)}
          />
        ))}
        {showTerre && <TerreCard className={count >= 3 ? "lg:order-3" : ""} />}
      </div>
    </div>
  );
}
