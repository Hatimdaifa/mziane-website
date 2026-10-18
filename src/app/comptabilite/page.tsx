import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Clock, Shield, Users, FolderOpen, FileText, TrendingUp, Briefcase, Search } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, FeatureGrid, PriceCard, CtaBand, type Tier } from "@/components/site";

export const metadata: Metadata = {
  title: "Comptabilité au Maroc | Mziane",
  description: "Tenue comptable, TVA, IS, IR, paie CNSS et bilan annuel par des experts-comptables au Maroc, dès 490 DH par mois.",
};

const prestations = [
  { icon: FolderOpen, title: "Tenue de comptabilité", desc: "Saisie des pièces, lettrage, rapprochements bancaires et grand livre mensuel, conformes au CGNC." },
  { icon: FileText, title: "Déclarations fiscales", desc: "TVA, IS, IR et taxe professionnelle : déclarations et télépaiement sur le portail de la DGI." },
  { icon: TrendingUp, title: "Bilan et liasse fiscale", desc: "Bilan annuel, CPC, tableau de financement et liasse fiscale dans les délais légaux." },
  { icon: Briefcase, title: "Paie et CNSS", desc: "Bulletins de paie, déclarations CNSS, AMO et CIMR, bordereaux de versement mensuels." },
  { icon: Search, title: "Conseil fiscal", desc: "Analyse de votre résultat, choix du régime d'imposition et avantages fiscaux disponibles." },
  { icon: BarChart3, title: "Tableaux de bord", desc: "Suivi mensuel de votre trésorerie, de votre chiffre d'affaires et de votre résultat." },
];

const obligations = [
  { code: "TVA", label: "Taxe sur la valeur ajoutée", freq: "Mensuelle ou trimestrielle", taux: "7 %, 10 % ou 20 % selon l'activité" },
  { code: "IS", label: "Impôt sur les sociétés", freq: "Acomptes trimestriels et solde annuel", taux: "20 %, 35 % pour les très gros bénéfices" },
  { code: "IR", label: "Impôt de l'auto-entrepreneur", freq: "Trimestrielle", taux: "0,5 % (commerce) ou 1 % (services) du CA" },
  { code: "CNSS", label: "Cotisations sociales des salariés", freq: "Mensuelle", taux: "Parts patronale et salariale selon le barème CNSS" },
  { code: "TP", label: "Taxe professionnelle", freq: "Annuelle", taux: "Exonérée les 5 premières années" },
];

const engagements = [
  { icon: Clock, title: "Réponse sous 24 h", desc: "Votre comptable dédié répond à vos questions dans la journée, par téléphone, e-mail ou WhatsApp." },
  { icon: Shield, title: "Zéro pénalité DGI", desc: "Vos déclarations sont déposées avant les échéances. En cas d'erreur de notre fait, nous prenons en charge les pénalités." },
  { icon: Users, title: "Un expert dédié", desc: "Un seul interlocuteur, expert-comptable ou comptable agréé, qui connaît votre dossier." },
];

const tiers: Tier[] = [
  { name: "Starter", price: "490 DH", unit: "/ mois", pill: "Abonnement mensuel", desc: "Auto-entrepreneurs et entreprises individuelles.", features: ["Tenue comptable", "Déclarations TVA", "Bilan simplifié", "Une consultation par mois"], cta: "Choisir Starter", href: "/onboarding?besoin=compta" },
  { name: "Business", price: "990 DH", unit: "/ mois", pill: "Abonnement mensuel", desc: "SARLAU et SARL en activité.", features: ["Tenue complète", "IS, TVA, IR et taxe professionnelle", "Bilan et liasse fiscale", "Paie jusqu'à 5 salariés", "Consultations illimitées"], cta: "Choisir Business", href: "/onboarding?besoin=compta", popular: true },
  { name: "Sur mesure", price: "Sur devis", pill: "Structures complexes", desc: "Plusieurs sociétés ou besoins spécifiques.", features: ["Audit comptable", "Restructuration fiscale", "Multi-sociétés", "Conseil patrimonial"], cta: "Demander un devis", href: "/onboarding?besoin=compta" },
];

export default function ComptabilitePage() {
  return (
    <>
      <PageHero
        icon={BarChart3}
        tag="Experts-comptables et comptables agréés au Maroc"
        title="Votre comptabilité, entre de bonnes mains"
        subtitle="TVA, IS, IR, CNSS et taxe professionnelle : confiez vos obligations fiscales et sociales à nos experts et concentrez-vous sur votre activité."
        note="Sans engagement de durée · Premier mois offert pour tout nouveau client"
      >
        <HeroButton href="/onboarding?besoin=compta">Obtenir un devis <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/tarifs" variant="ghost">Voir les tarifs</HeroButton>
      </PageHero>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader tag="Nos prestations" title="Tout ce que nous gérons pour vous" subtitle="Conforme au CGNC, au Code général des impôts et aux obligations DGI et CNSS." />
          <FeatureGrid items={prestations} />
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[860px] px-6">
          <SectionHeader tag="Repères fiscaux" tagClass="bg-amber-100 text-amber-800" title="Vos principales obligations" subtitle="On dépose chaque déclaration dans les délais. Taux indicatifs, selon la loi de finances en vigueur." />
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

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader tag="Formules" title="Un abonnement simple" subtitle="Mensuel, sans engagement, en dirhams HT." />
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => <PriceCard key={t.name} tier={t} icon={BarChart3} />)}
          </div>
          <p className="mt-8 text-center text-sm text-zinc-600">
            <Link href="/tarifs" className="inline-flex items-center gap-1 font-semibold text-blue-700">Voir tous les tarifs <ArrowRight className="h-3.5 w-3.5" /></Link>
          </p>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader left tag="Nos engagements" title="Réactif. Conforme. Transparent." />
          <FeatureGrid items={engagements} onGray />
        </div>
      </section>

      <CtaBand title="Externalisez votre comptabilité" subtitle="Premier mois offert pour tout nouveau client." href="/onboarding?besoin=compta" label="Obtenir un devis gratuit" />
    </>
  );
}
