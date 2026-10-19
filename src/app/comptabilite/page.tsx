import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BellRing, FolderOpen, FileText, TrendingUp, Briefcase, Search, MessageCircle, Unlock, GraduationCap, CalendarCheck, Rocket } from "lucide-react";
import { Ar } from "@/components/Ar";
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
  { icon: FolderOpen, title: "Tenue de comptabilité", desc: "Saisie des pièces et rapprochements, conformes au CGNC." },
  { icon: FileText, title: "Déclarations fiscales", desc: "TVA, IS, IR et taxe professionnelle, déposées à la DGI." },
  { icon: TrendingUp, title: "Bilan et liasse fiscale", desc: "Inclus dès la formule Essentiel." },
  { icon: Briefcase, title: "Paie et CNSS", desc: "Bulletins, CNSS et AMO, dès la formule Business." },
  { icon: Search, title: "Conseil fiscal", desc: "Le bon régime et vos avantages fiscaux." },
  { icon: BarChart3, title: "Tableaux de bord", desc: "Trésorerie et résultat chaque mois (Premium)." },
];

const obligations: { code: string; label: string; ar?: string; freq: string; taux: string }[] = [
  { code: "TVA", label: "Taxe sur la valeur ajoutée", ar: "الضريبة على القيمة المضافة", freq: "Mensuelle ou trimestrielle", taux: "7 %, 10 % ou 20 % selon l'activité" },
  { code: "IS", label: "Impôt sur les sociétés", freq: "Acomptes trimestriels et solde annuel", taux: "20 %, 35 % pour les très gros bénéfices" },
  { code: "IR", label: "Impôt de l'auto-entrepreneur", freq: "Trimestrielle", taux: "0,5 % (commerce) ou 1 % (services) du CA" },
  { code: "CNSS", label: "Cotisations sociales des salariés", ar: "الضمان الاجتماعي", freq: "Mensuelle", taux: "Selon le barème CNSS" },
  { code: "TP", label: "Taxe professionnelle", freq: "Annuelle", taux: "Exonérée les 5 premières années" },
];

const extras = [
  { label: "Bulletin de paie supplémentaire", amount: COMPTA_EXTRAS.bulletinPaie, unit: "par bulletin" },
  { label: "Bilan seul, sans abonnement", amount: COMPTA_EXTRAS.bilanSeul, unit: "par exercice" },
];

const faq = [
  { q: "Suis-je engagé ?", a: "Non pour une formule seule. Seuls les packs, qui offrent la création, demandent 12 mois." },
  { q: "Quelle formule choisir ?", a: "Auto-entrepreneur : Déclaratif. Société sans salarié : Essentiel. Avec salariés : Business, paie incluse jusqu'à 5 salariés." },
  { q: "Je change de comptable, comment faire ?", a: "Donnez-nous son contact. Nous récupérons le dossier et reprenons le mois suivant." },
  { q: "Qui tient ma comptabilité ?", a: "Un expert-comptable inscrit à l'Ordre. Bilan et liasse fiscale sont préparés sous sa responsabilité." },
];

export default function ComptabilitePage() {
  return (
    <>
      <PageHero
        icon={BarChart3}
        tag="Comptabilité en abonnement"
        title="Votre comptabilité à prix fixe, chaque mois"
        ar="المحاسبة"
        subtitle="Déclarations, paie et bilan : un expert-comptable s'en occupe."
        note={`Dès ${fmtDH(moinsCher.price ?? 0)} HT par mois · Formule seule sans engagement`}
      >
        <HeroButton href="#formules">Voir les formules <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/onboarding?besoin=compta" variant="ghost">M&apos;aider à choisir</HeroButton>
      </PageHero>

      <TrustStrip items={confiance} />

      <section id="formules" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <SectionHeader tag="Formules" title="Quatre formules, un prix clair" subtitle="Mensuel, en DH HT, sans engagement." />
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
            <SectionHeader left tag="Vous créez votre société ?" tagClass="bg-red-50 text-red-700" title="La création est offerte avec la comptabilité" subtitle="Pack Lancement : création Standard et site vitrine inclus. Comptabilité facturée dès le registre de commerce." />
            <Link href="/packs" className="inline-flex items-center gap-1 font-semibold text-blue-700">Comparer tous les packs <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <PackCard pack={lancement} href={commandePack(lancement.id)} icon={Rocket} />
        </div>
      </section>

      <section id="prestations" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Ce que nous faisons" title="Tout ce que nous gérons pour vous" />
          <FeatureGrid items={prestations} onGray />
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <SectionHeader tag="Repères fiscaux" tagClass="bg-amber-100 text-amber-800" title="Vos principales obligations" subtitle="Taux indicatifs, selon la loi de finances en vigueur." />
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            {obligations.map(({ code, label, ar, freq, taux }) => (
              <div key={code} className="grid items-center gap-x-4 gap-y-1 border-b border-zinc-100 px-6 py-4 last:border-b-0 sm:grid-cols-[70px_1fr_auto]">
                <span className="justify-self-start rounded-full bg-amber-400 px-3 py-1 text-center text-sm font-extrabold text-zinc-900">{code}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-900">{label}{ar && <Ar className="text-sm">{ar}</Ar>}</span>
                  <span className="block text-sm text-zinc-500">{freq}</span>
                </span>
                <span className="text-sm font-semibold text-blue-700 sm:text-right">{taux}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Questions fréquentes" title="Avant de vous abonner" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Pas sûr de la formule ?" subtitle="Quelques questions, et nous vous indiquons la bonne formule." href="/onboarding?besoin=compta" label="Trouver ma formule" />
    </>
  );
}
