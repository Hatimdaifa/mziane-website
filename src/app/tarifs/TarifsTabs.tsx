"use client";

// Onglets de la page tarifs. L'onglet actif vit dans l'URL (?tab=), ce qui permet
// de partager un lien direct (ex. /tarifs?tab=compta) et de pré-sélectionner l'onglet.
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, Boxes, Building2, Calculator, FilePen, Globe, HandCoins, Laptop, MapPin, MessageCircle, Sparkles, Sprout, Stamp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AIDES_TAUX_AGRI, COMPTA_EXTRAS, FORMALITE_SUPPLEMENT, MARQUE_TAXE, type FormeId, HEBERGEMENT_AN, type Offer,
  PRIX_CREATION, PROMESSES, aidesOffers, compta, creationAE, creationSociete, domiciliation, fmtDH, formalites,
  international, marque, packById, packTerre, particuliers, web,
} from "@/lib/offers";
import { OfferCard, OfficialFeesNote, PackCard, offerToTier } from "@/components/offer-ui";
import { Tablist, Toggle, panelId, tabId } from "@/components/packs/Tablist";
import { AIDES_HREF, TERRE_HREF, devisHref, offerHref, packHref } from "@/components/packs/links";
import { PACKS_PHARES, PACK_ICONS } from "@/components/packs/meta";
import AideFeeCalculator, { BaremeTable } from "@/components/packs/AideFeeCalculator";

export const TABS = [
  { id: "packs", label: "Packs", icon: Boxes },
  { id: "auto", label: "Auto-entrepreneur", icon: Sparkles },
  { id: "societe", label: "Société", icon: Building2 },
  { id: "compta", label: "Comptabilité", icon: Calculator },
  { id: "aides", label: "Aides", icon: HandCoins },
  { id: "formalites", label: "Formalités", icon: FilePen },
  { id: "domiciliation", label: "Domiciliation", icon: MapPin },
  { id: "web", label: "Site web", icon: Laptop },
  { id: "international", label: "International", icon: Globe },
  { id: "particuliers", label: "Particuliers", icon: Users },
] as const;

export type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string | null): v is TabId => !!v && TABS.some((t) => t.id === v);
const PREFIX = "tarifs";

// ── Briques ─────────────────────────────────────────────────────────────────
function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return <div className={cn("grid gap-8 md:gap-6", cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4")}>{children}</div>;
}

/** Cartes d'offres : la recommandée passe en premier sur mobile. */
function Offers({ list, icon, href, cta, price, cols }: {
  list: Offer[]; icon: LucideIcon; href: (o: Offer) => string; cta?: (o: Offer) => string | undefined; price?: (o: Offer, n: number) => number | null; cols?: 3 | 4;
}) {
  return (
    <Grid cols={cols}>
      {list.map((o, n) => {
        const p = price ? price(o, n) : o.price;
        const tier = offerToTier({ ...o, price: p }, href(o), cta?.(o));
        return <OfferCard key={o.id} tier={tier} icon={icon} className={o.popular ? "max-md:order-first" : ""} />;
      })}
    </Grid>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-8 text-center text-sm text-zinc-500">{children}</p>;
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 text-center">
      <Link href={href} className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-900 px-6 py-3 font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2">
        {children} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

// ── Onglets ─────────────────────────────────────────────────────────────────
function PacksTab() {
  const list = PACKS_PHARES.map((id) => packById(id)!).filter(Boolean);
  return (
    <>
      <p className="mx-auto mb-10 max-w-[640px] text-center text-[15px] text-zinc-600">
        Création offerte. Un prix mensuel sur 12 mois, moins cher qu&apos;à la carte.
      </p>
      <Grid>
        {list.map((p) => (
          <PackCard key={p.id} pack={p} icon={PACK_ICONS[p.id]} href={packHref(p)} className={p.popular ? "max-md:order-first" : ""} />
        ))}
      </Grid>
      <MoreLink href="/packs">Tous les packs</MoreLink>
    </>
  );
}

const SOC_FORMES: { id: FormeId; label: string }[] = [
  { id: "sarlau", label: "SARLAU" },
  { id: "sarl", label: "SARL" },
  { id: "sas", label: "SAS" },
];

function SocieteTab() {
  const [forme, setForme] = useState<FormeId>("sarlau");
  const prix = PRIX_CREATION[forme];
  return (
    <>
      <div className="mb-10 flex justify-center">
        <Toggle label="Forme juridique" value={forme} onChange={setForme} options={SOC_FORMES} />
      </div>
      <Offers list={creationSociete} icon={Building2} href={(o) => offerHref(o.id, forme)} price={(o, n) => prix?.[n] ?? o.price} />
      <OfficialFeesNote className="mx-auto mt-8 max-w-[720px]" />
      <div className="mx-auto mt-6 grid max-w-[720px] gap-3 sm:grid-cols-2">
        {[
          { label: "Société anonyme (SA)", sujet: "la création d'une société anonyme (SA)" },
          { label: "Société civile immobilière (SCI)", sujet: "la création d'une société civile immobilière (SCI)" },
        ].map((d) => (
          <a key={d.label} href={devisHref(d.sujet)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 font-semibold text-zinc-900 transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
            {d.label}
            <span className="inline-flex items-center gap-1.5 text-sm text-blue-700"><MessageCircle className="h-4 w-4" aria-hidden /> Sur devis</span>
          </a>
        ))}
      </div>
      <Note>Vous voulez aussi un site et la comptabilité ? <Link href="/tarifs?tab=packs" className="font-semibold text-blue-700 underline-offset-2 hover:underline">Dans un pack, la création est offerte.</Link></Note>
    </>
  );
}

function ComptaTab() {
  return (
    <>
      <Offers list={compta} icon={Calculator} cols={4} href={(o) => offerHref(o.id, o.id === "compta-declaratif" ? "auto" : "sarlau")} />
      <div className="mx-auto mt-10 grid max-w-[900px] gap-3 sm:grid-cols-3">
        {[
          { label: "Bulletin de paie en plus", value: `${fmtDH(COMPTA_EXTRAS.bulletinPaie)} HT` },
          { label: "Bilan annuel seul", value: `${fmtDH(COMPTA_EXTRAS.bilanSeul)} HT` },
          { label: "Payé à l'année", value: COMPTA_EXTRAS.annuel },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl bg-zinc-50 px-5 py-4">
            <p className="text-sm text-zinc-500">{x.label}</p>
            <p className="font-bold text-zinc-900">{x.value}</p>
          </div>
        ))}
      </div>
      <Note>Seule : sans engagement. En pack : 12 mois, facturée dès le registre de commerce.</Note>
    </>
  );
}

function AidesTab() {
  return (
    <>
      <Offers
        list={aidesOffers}
        icon={HandCoins}
        href={(o) => (o.id === "aides-honneur" ? offerHref(o.id) : AIDES_HREF)}
        cta={(o) => (o.id === "aides-diagnostic" ? "Faire mon diagnostic" : o.id === "aides-dossier" ? "Vérifier mon éligibilité" : undefined)}
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-bold text-zinc-900">Le barème du dossier de A à Z</h3>
          <BaremeTable />
          <p className="mt-3 text-[13px] text-zinc-500">Par tranches, comme l&apos;impôt.</p>
        </div>
        <AideFeeCalculator />
        <div className="flex flex-col rounded-3xl border-2 border-amber-300 bg-amber-50 p-6">
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-800"><Sprout className="h-5 w-5" aria-hidden /></span>
          <h3 className="text-lg font-bold text-zinc-900">Agriculteurs et coopératives</h3>
          <p className="mt-1 text-[2rem] font-extrabold text-zinc-900">{Math.round(AIDES_TAUX_AGRI * 100)} %</p>
          <p className="text-[14px] text-zinc-700">de la subvention, minimum {fmtDH(packTerre.min)} HT. {packTerre.conditions.split(". ").slice(1).join(". ")}</p>
          <ul className="mt-3 grid gap-1.5 text-[14px] text-zinc-700">
            {packTerre.items.slice(0, 3).map((i) => <li key={i}>{i}</li>)}
          </ul>
          <Link href={TERRE_HREF} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 font-bold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 max-lg:mt-5">
            Pack Terre <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <Note>{PROMESSES.sansInteret}</Note>
    </>
  );
}

function FormalitesTab() {
  return (
    <>
      <div className="mx-auto max-w-[860px] overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <ul>
          {formalites.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0 max-sm:flex-wrap max-sm:px-4">
              <span className="min-w-0">
                <span className="block font-semibold text-zinc-900">{f.label}</span>
                {f.detail && <span className="block text-[13px] text-zinc-500">{f.detail}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 tabular-nums">{fmtDH(f.price)} HT</span>
                <Link href={offerHref(f.id)} className="rounded-xl px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
                  Commander<span className="sr-only"> : {f.label}</span>
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Note>Prix fixe. {FORMALITE_SUPPLEMENT} Frais officiels en sus, au réel.</Note>

      <h3 className="mb-8 mt-16 text-center text-2xl font-bold text-zinc-900">Dépôt de marque à l&apos;OMPIC</h3>
      <Offers list={marque} icon={Stamp} href={(o) => offerHref(o.id)} />
      <Note>{MARQUE_TAXE.charAt(0).toUpperCase()}{MARQUE_TAXE.slice(1)}.</Note>
    </>
  );
}

function TabPanel({ id }: { id: TabId }) {
  switch (id) {
    case "packs": return <PacksTab />;
    case "auto":
      return (
        <>
          <Offers list={creationAE} icon={Sparkles} href={(o) => offerHref(o.id, "auto")} />
          <OfficialFeesNote kind="auto" className="mx-auto mt-8 max-w-[720px]" />
          <Note>Prix TTC. Avec la comptabilité et une page web, le <Link href="/packs" className="font-semibold text-blue-700 underline-offset-2 hover:underline">pack Démarrage</Link> offre l&apos;inscription.</Note>
        </>
      );
    case "societe": return <SocieteTab />;
    case "compta": return <ComptaTab />;
    case "aides": return <AidesTab />;
    case "formalites": return <FormalitesTab />;
    case "domiciliation":
      return (
        <>
          <Offers list={domiciliation} icon={MapPin} href={(o) => offerHref(o.id, "sarlau")} />
          <Note>Engagement 6 mois. Domiciliation 12 mois incluse dans le pack Diaspora.</Note>
        </>
      );
    case "web":
      return (
        <>
          <Offers list={web} icon={Laptop} href={(o) => offerHref(o.id)} />
          <Note>Hébergement et domaine : {fmtDH(HEBERGEMENT_AN)} HT par an, 1re année incluse dans les packs.</Note>
        </>
      );
    case "international":
      return (
        <>
          <Offers
            list={international}
            icon={Globe}
            href={(o) => (o.price === null ? devisHref(`un projet ${o.name} (${o.desc.replace(/\.$/, "")})`) : offerHref(o.id, "sarlau"))}
            cta={(o) => (o.price === null ? "Demander un devis" : undefined)}
          />
          <OfficialFeesNote compact className="mx-auto mt-8 max-w-[720px]" />
          <Note>Apostilles et traductions en sus. Le <Link href="/packs" className="font-semibold text-blue-700 underline-offset-2 hover:underline">pack Diaspora</Link> ajoute domiciliation et comptabilité, création offerte.</Note>
        </>
      );
    case "particuliers":
      return (
        <>
          <Offers
            list={particuliers}
            icon={Users}
            href={(o) => (o.id === "part-guide" ? "/aides" : o.id === "part-asd" ? AIDES_HREF : offerHref(o.id))}
            cta={(o) => (o.id === "part-guide" ? "Lire les guides" : o.id === "part-asd" ? "Vérifier mes droits" : undefined)}
          />
          <Note>Prix TTC. {PROMESSES.zeroRefus}</Note>
        </>
      );
  }
}

/** Vue contrôlée (utilisée aussi comme rendu de secours pré-rendu). */
export function TarifsTabsView({ active, onChange }: { active: TabId; onChange?: (id: TabId) => void }) {
  return (
    <>
      <Tablist items={[...TABS]} active={active} onChange={onChange ?? (() => {})} label="Services" idPrefix={PREFIX} className="mb-12" />
      <div id={panelId(PREFIX)} role="tabpanel" aria-labelledby={tabId(PREFIX, active)} tabIndex={0} className="rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4">
        <TabPanel id={active} />
      </div>
    </>
  );
}

export default function TarifsTabs() {
  const params = useSearchParams();
  const tab = params.get("tab");
  const active: TabId = isTab(tab) ? tab : "packs";
  const onChange = (id: TabId) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("tab", id);
    window.history.replaceState(null, "", `?${sp.toString()}`);
  };
  return <TarifsTabsView active={active} onChange={onChange} />;
}

