import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BellRing, FolderOpen, FileText, TrendingUp, Briefcase, Search, MessageCircle, Unlock, GraduationCap, CalendarCheck, Rocket } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, FeatureGrid, PriceCard, Faq, CtaBand } from "@/components/site";
import { PackCard, offerToTier } from "@/components/offer-ui";
import { TrustStrip, PriceTag, commandeOffre, commandePack } from "@/components/services/blocks";
import { COMPTA_EXTRAS, compta, fmtDH, packById } from "@/lib/offers";

const moinsCher = compta[0];
const lancement = packById("lancement")!;

export const metadata: Metadata = {
  title: "Comptabilité en abonnement au Maroc | Mziane",
  description: `Déclarations, TVA, IS, paie CNSS et bilan annuel, tenus par un expert-comptable inscrit à l'Ordre. Dès ${fmtDH(moinsCher.price ?? 0)} HT par mois, sans engagement.`,
};

const confiance = [
  { icon: GraduationCap, title: "Expert-comptable", desc: "Inscrit à l'Ordre des experts-comptables." },
  { icon: Unlock, title: "Sans engagement", desc: "Formule seule : vous arrêtez quand vous voulez." },
  { icon: BellRing, title: "Rappel avant chaque échéance", desc: "Plus d'oubli de déclaration." },
  { icon: MessageCircle, title: "Questions sur WhatsApp", desc: "Un interlocuteur qui connaît votre dossier." },
];

const prestations = [
  { icon: FolderOpen, title: "Tenue de comptabilité", desc: "Saisie des pièces, rapprochements bancaires et grand livre, conformes au CGNC." },
  { icon: FileText, title: "Déclarations fiscales", desc: "TVA, IS, IR et taxe professionnelle, déposées sur le portail de la DGI." },
  { icon: TrendingUp, title: "Bilan et liasse fiscale", desc: "Bilan annuel, CPC et liasse fiscale, inclus dès la formule Essentiel." },
  { icon: Briefcase, title: "Paie et CNSS", desc: "Bulletins de paie, déclarations CNSS et AMO, dès la formule Business." },
  { icon: Search, title: "Conseil fiscal", desc: "Choix du régime d'imposition et avantages fiscaux auxquels vous avez droit." },
  { icon: BarChart3, title: "Tableaux de bord", desc: "Trésorerie, chiffre d'affaires et résultat chaque mois, avec la formule Premium." },
];

const obligations = [
  { code: "TVA", label: "Taxe sur la valeur ajoutée", freq: "Mensuelle ou trimestrielle", taux: "7 %, 10 % ou 20 % selon l'activité" },
  { code: "IS", label: "Impôt sur les sociétés", freq: "Acomptes trimestriels et solde annuel", taux: "20 %, 35 % pour les très gros bénéfices" },
  { code: "IR", label: "Impôt de l'auto-entrepreneur", freq: "Trimestrielle", taux: "0,5 % (commerce) ou 1 % (services) du CA" },
  { code: "CNSS", label: "Cotisations sociales des salariés", freq: "Mensuelle", taux: "Parts patronale et salariale selon le barème CNSS" },
  { code: "TP", label: "Taxe professionnelle", freq: "Annuelle", taux: "Exonérée les 5 premières années" },
];

const extras = [
  { label: "Bulletin de paie supplémentaire", amount: COMPTA_EXTRAS.bulletinPaie, unit: "par bulletin" },
  { label: "Bilan seul, sans abonnement", amount: COMPTA_EXTRAS.bilanSeul, unit: "par exercice" },
];

const faq = [
  { q: "Suis-je engagé ?", a: "Non pour une formule seule : l'abonnement est mensuel et vous pouvez l'arrêter. Seuls les packs, qui offrent la création, demandent 12 mois." },
  { q: "Quelle formule choisir ?", a: "Auto-entrepreneur : Déclaratif. Société sans salarié : Essentiel. Dès votre premier salarié : Business, qui inclut la paie jusqu'à 5 salariés." },
  { q: "Je change de comptable, comment ça se passe ?", a: "Nous récupérons votre dossier auprès de votre ancien comptable et reprenons à partir du mois suivant. Vous n'avez rien à faire de plus que de nous donner son contact." },
  { q: "Qui tient ma comptabilité ?", a: "Votre comptabilité est tenue par un expert-comptable inscrit à l'Ordre. Votre bilan et votre liasse fiscale sont préparés sous sa responsabilité." },
];

export default function ComptabilitePage() {
  return (
    <>
      <PageHero
        icon={BarChart3}
        tag="Comptabilité en abonnement"
        title="Votre comptabilité à prix fixe, chaque mois"
        subtitle="Déclarations, TVA, IS, paie et bilan : un expert-comptable s'en occupe. Vous recevez un rappel avant chaque échéance."
        note={`Dès ${fmtDH(moinsCher.price ?? 0)} HT par mois · Formule seule sans engagement`}
      >
        <HeroButton href="#formules">Voir les formules <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/onboarding?besoin=compta" variant="ghost">M&apos;aider à choisir</HeroButton>
      </PageHero>

      <TrustStrip items={confiance} />

      <section id="formules" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <SectionHeader tag="Formules" title="Quatre formules, un prix clair" subtitle="Abonnement mensuel en dirhams HT. Sans engagement pour une formule seule." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {compta.map((o) => (
              <PriceCard key={o.id} icon={BarChart3} tier={offerToTier(o, commandeOffre(o.id, o.id === "compta-declaratif" ? "auto" : undefined))} />
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {extras.map((e) => (
              <div key={e.label} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="mb-2 font-semibold text-zinc-900">{e.label}</p>
                <PriceTag amount={e.amount} unit={e.unit} />
              </div>
            ))}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="mb-2 flex items-center gap-2 font-semibold text-zinc-900"><CalendarCheck className="h-4 w-4 text-blue-700" /> Paiement à l&apos;année</p>
              <p className="text-[15px] text-zinc-700">{COMPTA_EXTRAS.annuel}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <SectionHeader left tag="Vous créez votre société ?" tagClass="bg-red-50 text-red-700" title="La création est offerte avec la comptabilité" subtitle="Avec le pack Lancement, la création Standard et un site vitrine sont inclus. La comptabilité n'est facturée qu'à partir du registre de commerce." />
            <Link href="/packs" className="inline-flex items-center gap-1 font-semibold text-blue-700">Comparer tous les packs <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <PackCard pack={lancement} href={commandePack(lancement.id)} icon={Rocket} />
        </div>
      </section>

      <section id="prestations" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Ce que nous faisons" title="Tout ce que nous gérons pour vous" subtitle="Conforme au CGNC, au Code général des impôts et aux obligations DGI et CNSS." />
          <FeatureGrid items={prestations} onGray />
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionHeader tag="Repères fiscaux" tagClass="bg-amber-100 text-amber-800" title="Vos principales obligations" subtitle="Nous préparons chaque déclaration avant l'échéance. Taux indicatifs, selon la loi de finances en vigueur." />
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            {obligations.map(({ code, label, freq, taux }) => (
              <div key={code} className="grid items-center gap-x-4 gap-y-1 border-b border-zinc-100 px-6 py-4 last:border-b-0 sm:grid-cols-[70px_1fr_auto]">
                <span className="justify-self-start rounded-full bg-amber-400 px-3 py-1 text-center text-sm font-extrabold text-zinc-900">{code}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900">{label}</span>
                  <span className="block text-sm text-zinc-500">{freq}</span>
                </span>
                <span className="text-sm font-semibold text-blue-700 sm:text-right">{taux}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <div className="flex items-start gap-4 rounded-3xl border border-zinc-200 bg-white p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-700 text-white"><GraduationCap className="h-6 w-6" /></span>
            <div>
              <p className="text-lg font-bold text-zinc-900">Votre comptabilité est tenue par un expert-comptable inscrit à l&apos;Ordre</p>
              <p className="mt-1 text-[15px] text-zinc-600">{/* Nom du cabinet partenaire à ajouter ici une fois la convention signée. */}Votre bilan et votre liasse fiscale sont préparés sous sa responsabilité.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Questions fréquentes" title="Avant de vous abonner" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Pas sûr de la formule ?" subtitle="Répondez à quelques questions : nous vous indiquons la formule adaptée à votre activité." href="/onboarding?besoin=compta" label="Trouver ma formule" />
    </>
  );
}
