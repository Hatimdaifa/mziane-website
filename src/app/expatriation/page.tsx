import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Plane, Building2, Video, CreditCard, PenLine, KeyRound, Landmark } from "lucide-react";
import { Ar } from "@/components/Ar";
import { PageHero, HeroButton, SectionHeader, FeatureGrid, CheckList, PriceCard, Faq, CtaBand } from "@/components/site";
import { PackCard, OfficialFeesNote, offerToTier } from "@/components/offer-ui";
import { TrustStrip, commandeOffre, commandePack } from "@/components/services/blocks";
import { PROMESSES, fmtDH, international, packById, waLink } from "@/lib/offers";

const diaspora = packById("diaspora")!;
const mre = international.find((o) => o.id === "intl-mre")!;

export const metadata: Metadata = {
  title: "MRE et non-résidents : créer au Maroc à distance | Mziane",
  description: `Créer sa société au Maroc depuis l'étranger : procuration guidée, compte en dirhams convertibles, appel vidéo le soir ou le samedi. Offre MRE à ${fmtDH(mre.price ?? 0)} HT.`,
};

const confiance = [
  { icon: Plane, title: "Sans vous déplacer", desc: "Procuration guidée, nous agissons sur place." },
  { icon: Video, title: "Appel vidéo", desc: "Le soir ou le samedi." },
  { icon: CreditCard, title: "Paiement à distance", desc: "Carte ou virement depuis l'étranger." },
  { icon: Shield, title: "Règles de change respectées", desc: "Pour pouvoir rapatrier vos revenus." },
];

const distance = [
  { icon: Video, title: "Appel vidéo", desc: "Nous choisissons ensemble la forme." },
  { icon: PenLine, title: "Procuration", desc: "Vous signez notre modèle dans votre pays." },
  { icon: Landmark, title: "Nous agissons au Maroc", desc: "OMPIC, banque, greffe et registre de commerce." },
  { icon: KeyRound, title: "Votre société est prête", desc: "Une copie de chaque document." },
];

const profils: { icon: typeof Plane; titre: string; ar?: string; head: string; items: string[] }[] = [
  {
    icon: Plane, titre: "Marocains résidant à l'étranger", ar: "المغاربة المقيمون بالخارج", head: "from-blue-800 to-blue-700",
    items: ["SARLAU ou SARL depuis l'étranger", "Compte en dirhams convertibles", "Rapatriement des revenus", "Subvention MDM Invest possible"],
  },
  {
    icon: Globe, titre: "Étrangers non-résidents", head: "from-red-700 to-red-600",
    items: ["Choix de la structure", "Compte en devises", "Apostilles et légalisations", "Dépôt du capital coordonné"],
  },
  {
    icon: Building2, titre: "Zones d'accélération et CFC", head: "from-zinc-900 to-zinc-700",
    items: ["Zones d'accélération industrielle", "Statut Casablanca Finance City", "Étude d'éligibilité"],
  },
];


const faq = [
  { q: "Dois-je venir au Maroc ?", a: "En général, non : une procuration suffit. Certaines banques demandent une rencontre, nous vous le disons dès le départ." },
  { q: "Comment payer depuis l'étranger ?", a: PROMESSES.paiement },
  { q: "Puis-je rapatrier mes bénéfices ?", a: "Oui, si l'investissement est fait en devises et déclaré à l'Office des Changes. Nous préparons ce dossier avec votre banque." },
  { q: "Qui tient la comptabilité ensuite ?", a: "Avec le pack Diaspora, comptabilité et domiciliation sont incluses 12 mois." },
];

export default function ExpatriationPage() {
  return (
    <>
      <PageHero
        icon={Globe}
        tag="MRE, étrangers et investisseurs"
        title="Créez votre société au Maroc sans vous déplacer"
        subtitle="Avec une procuration, nous faisons banque, greffe et comptabilité sur place."
        note="Appel vidéo le soir ou le samedi · Paiement depuis l'étranger"
      >
        <HeroButton href="#diaspora">Voir le pack Diaspora <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/onboarding?besoin=etranger" variant="ghost">M&apos;aider à choisir</HeroButton>
      </PageHero>

      <TrustStrip items={confiance} />

      <section id="diaspora" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <SectionHeader left tag="Le plus simple à distance" tagClass="bg-red-50 text-red-700" title="Pack Diaspora : la création offerte" subtitle="Création à distance, siège et comptabilité 12 mois, un seul prix mensuel." />
            <CheckList items={["Pas besoin d'adresse au Maroc", "Courrier scanné, alerte WhatsApp", "Déclarations faites à l'heure"]} />
            <p className="mt-6 text-sm">
              <Link href="/packs" className="inline-flex items-center gap-1 font-semibold text-blue-700">Comparer tous les packs <ArrowRight className="h-3.5 w-3.5" /></Link>
            </p>
          </div>
          <PackCard pack={diaspora} href={commandePack(diaspora.id)} icon={Plane} highlighted />
        </div>
      </section>

      <section id="offres" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Création seule" title="Nos offres pour créer depuis l'étranger" subtitle="Paiement unique, en dirhams HT." />
          <div className="grid gap-6 md:grid-cols-3">
            {international.map((o) => (
              <PriceCard
                key={o.id}
                icon={Globe}
                tier={offerToTier(
                  o,
                  o.price === null ? waLink(`Bonjour, je souhaite une étude d'éligibilité : ${o.name}.`) : commandeOffre(o.id),
                  o.price === null ? "Demander un devis" : undefined,
                )}
              />
            ))}
          </div>
          <OfficialFeesNote className="mx-auto mt-6 max-w-[720px]" />
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="À distance" title="Comment ça se passe" />
          <FeatureGrid items={distance} cols={4} onGray />
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Votre situation" title="Un accompagnement pour chaque profil" />
          <div className="grid gap-6 md:grid-cols-3">
            {profils.map(({ icon: Icon, titre, ar, head, items }) => (
              <div key={titre} className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                <div className={`bg-gradient-to-br p-7 text-white ${head}`}>
                  <span className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Icon className="h-5 w-5" /></span>
                  <span className="block text-xl font-extrabold">{titre}</span>
                  {ar && <Ar tone="light" className="ml-0 mt-1.5 text-sm leading-normal">{ar}</Ar>}
                </div>
                <CheckList items={items} className="p-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Questions fréquentes" title="Créer depuis l'étranger" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Parlons de votre projet en vidéo" subtitle="Le soir ou le samedi. Gratuit et sans engagement." href={waLink("Bonjour, je vis à l'étranger et je souhaite un appel vidéo pour créer ma société au Maroc.")} label="Réserver un appel vidéo" />
    </>
  );
}
