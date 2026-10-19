import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, FilePen, MapPin, User, ArrowLeftRight, Landmark, Stamp, Building2, CircleOff, Moon, Shuffle, Receipt, FileCheck2, MessageCircle, Layers } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, CheckList, PriceCard, Faq, CtaBand } from "@/components/site";
import { offerToTier } from "@/components/offer-ui";
import { TrustStrip, PriceTag, commandeOffre } from "@/components/services/blocks";
import { FORMALITE_SUPPLEMENT, FRAIS_ETAT, domiciliation, fmtDH, formalites, marque } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Modifier ou fermer sa société au Maroc, à prix fixe | Mziane",
  description:
    "Transfert de siège, changement de gérant, cession de parts, capital, dénomination, mise en sommeil, dissolution, marque OMPIC et domiciliation : prix fixes affichés.",
};

const details: Record<string, { icon: LucideIcon; desc: string }> = {
  gerant: { icon: User, desc: "Nomination ou démission, registre de commerce mis à jour." },
  siege: { icon: MapPin, desc: "Statuts mis à jour, greffe et annonce légale." },
  denomination: { icon: FilePen, desc: "Nouveau certificat négatif, statuts modifiés." },
  parts: { icon: ArrowLeftRight, desc: "Acte de cession, agrément et statuts." },
  capital: { icon: Landmark, desc: "Augmentation ou réduction, formalités au greffe." },
  objet: { icon: Shuffle, desc: "Ajout ou changement d'activité." },
  sommeil: { icon: Moon, desc: "Suspendre l'activité sans fermer la société." },
  fermer: { icon: CircleOff, desc: "Dissolution, liquidation et radiation du registre de commerce." },
};

const confiance = [
  { icon: Receipt, title: "Prix fixe affiché", desc: "Connu avant de commencer." },
  { icon: Landmark, title: "Frais officiels au réel", desc: "Sans marge." },
  { icon: FileCheck2, title: "Actes rédigés pour vous", desc: "Vous signez, nous déposons." },
  { icon: MessageCircle, title: "Suivi sur WhatsApp", desc: "Vous savez où en est votre dossier." },
];

const inclus = [
  "Rédaction des procès-verbaux et des actes",
  "Mise à jour des statuts",
  "Enregistrement et dépôt au tribunal de commerce",
  "Annonces légales",
  "Mise à jour du registre de commerce",
  "Un juriste qui suit votre dossier",
];

const faq = [
  { q: "Plusieurs changements en même temps ?", a: `Ils passent souvent dans le même acte. ${FORMALITE_SUPPLEMENT}` },
  { q: "Ma formalité n'est pas dans la liste ?", a: "Écrivez-nous sur WhatsApp, nous vous donnons un prix fixe avant de commencer." },
];

export default function GestionPage() {
  return (
    <>
      <PageHero
        icon={FilePen}
        tag="Vie de la société"
        title="Modifiez ou fermez votre société, à prix fixe"
        subtitle="Nous rédigeons les actes et faisons les formalités au greffe pour vous."
        note="Prix HT · Frais officiels en sus, au réel et sans marge"
      >
        <HeroButton href="#formalites">Voir les prix <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/onboarding?besoin=gerer" variant="ghost">Décrire mon besoin</HeroButton>
      </PageHero>

      <TrustStrip items={confiance} />

      <section id="formalites" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Formalités" title="Le prix de chaque formalité" subtitle="Honoraires HT, paiement unique, confirmés avant paiement." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formalites.map((f) => {
              const d = details[f.id];
              const Icon = d?.icon ?? FilePen;
              return (
                <article key={f.id} id={f.id} className="flex scroll-mt-28 flex-col rounded-3xl border border-zinc-200 bg-white p-6 target:ring-2 target:ring-blue-500">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
                    <PriceTag amount={f.price} />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-zinc-900">{f.label}</h3>
                  {d && <p className="text-[15px] leading-relaxed text-zinc-600">{d.desc}</p>}
                  {f.detail && <p className="mt-2 text-sm font-semibold text-zinc-700">{f.detail.charAt(0).toUpperCase() + f.detail.slice(1)}</p>}
                  <Link href={`/commande?formalite=${f.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-[15px] font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:border-blue-500">
                    Commander cette formalité<span className="sr-only"> : {f.label}</span> <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <p className="flex items-start gap-2.5 rounded-3xl border border-zinc-200 bg-white p-5 text-[15px] text-zinc-700">
              <Layers className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> {FORMALITE_SUPPLEMENT}
            </p>
            <p className="flex items-start gap-2.5 rounded-3xl border border-zinc-200 bg-white p-5 text-[15px] text-zinc-700">
              <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" /> Frais officiels en sus, au réel et sans marge.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Ce qui est inclus</h2>
            <p className="text-[17px] leading-relaxed text-zinc-600">
              Vous signez, nous faisons le reste.
            </p>
          </div>
          <CheckList items={inclus} className="rounded-3xl border border-zinc-200 bg-white p-6" />
        </div>
      </section>

      <section id="marque" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Marque OMPIC" tagClass="bg-amber-100 text-amber-800" title="Protégez le nom de votre entreprise" ar="العلامة التجارية" subtitle={`Honoraires HT. Taxe OMPIC en sus, environ ${fmtDH(FRAIS_ETAT.marqueParClasse)} par classe.`} />
          <div className="grid gap-6 md:grid-cols-3">
            {marque.map((o) => <PriceCard key={o.id} icon={Stamp} tier={offerToTier(o, commandeOffre(o.id))} />)}
          </div>
        </div>
      </section>

      <section id="domiciliation" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Domiciliation" title="Une adresse pour votre siège" ar="التوطين" subtitle="Mensuel HT, engagement 6 mois, attestation fournie." />
          <div className="grid gap-6 md:grid-cols-3">
            {domiciliation.map((o) => <PriceCard key={o.id} icon={Building2} tier={offerToTier(o, commandeOffre(o.id))} />)}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Questions fréquentes" title="Avant de lancer une formalité" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Une formalité à faire ?" subtitle="Dites-nous ce qui change, nous vous donnons le prix." href="/onboarding?besoin=gerer" label="Décrire mon besoin" />
    </>
  );
}
