import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BadgeCheck, HandCoins, Receipt, UserCheck, MessageCircle, FileCheck2, Zap, Rocket } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, PriceCard, Faq, CtaBand } from "@/components/site";
import { PackCard, OfficialFeesNote, offerToTier } from "@/components/offer-ui";
import { TrustStrip, FeesBreakdown, commandeOffre, commandePack, WaButton } from "@/components/services/blocks";
import CreationPricing from "@/components/services/CreationPricing";
import { FRAIS_ETAT, PRIX_CREATION, creationAE, creationSociete, fmtDH, packById } from "@/lib/offers";
import FormesSelector, { FormesSelectorFromUrl } from "./FormesSelector";

const standard = creationSociete.find((o) => o.popular)!;
const lancement = packById("lancement")!;
const lancementEquipe = packById("lancement-equipe")!;

export const metadata: Metadata = {
  title: "Créer son entreprise au Maroc à prix fixe | Mziane",
  description: `SARLAU, SARL, SAS, coopérative ou auto-entrepreneur : statuts, OMPIC, greffe et registre de commerce. Création Standard à ${fmtDH(standard.price ?? 0)} HT, frais d'État affichés à part.`,
};

const confiance = [
  { icon: Receipt, title: "Prix fixe affiché", desc: "Nos honoraires sont connus avant de commencer." },
  { icon: FileCheck2, title: "Pièces vérifiées", desc: "Nous vérifions chaque pièce avant le dépôt." },
  { icon: UserCheck, title: "Un juriste dédié", desc: "Inclus dès la formule Standard." },
  { icon: MessageCircle, title: "Suivi sur WhatsApp", desc: "Vous savez où en est votre dossier." },
];

const etapes = [
  { title: "Vous choisissez votre forme", desc: "SARLAU, SARL, SAS ou auto-entrepreneur. En cas de doute, notre questionnaire vous oriente." },
  { title: "Nous réservons le nom", desc: "Demande du certificat négatif à l'OMPIC pour protéger le nom de votre société." },
  { title: "Nous rédigeons les statuts", desc: "Statuts conformes à la loi 5-96. Vous les relisez et vous signez." },
  { title: "Capital et dépôt au greffe", desc: "Attestation de dépôt du capital, puis dépôt du dossier au tribunal de commerce." },
  { title: "Immatriculation", desc: "Registre de commerce, identifiant fiscal, ICE et annonces légales. En quelques jours ouvrés une fois le dossier complet." },
  { title: "Vous démarrez", desc: "Dossier d'ouverture bancaire, CNSS et, si vous le souhaitez, comptabilité dès le premier mois." },
];

const faq = [
  { q: "Combien coûte la création d'une SARL au Maroc ?", a: `Nos honoraires vont de ${fmtDH(PRIX_CREATION.sarl![0])} à ${fmtDH(PRIX_CREATION.sarl![2])} HT selon la formule. Il faut ajouter les frais d'État, environ ${fmtDH(FRAIS_ETAT.societe.estimate)} (${FRAIS_ETAT.societe.range}), que nous reversons sans marge.` },
  { q: "Combien de temps faut-il ?", a: "Une fois le dossier complet et signé, le registre de commerce est obtenu en quelques jours ouvrés. Le délai dépend surtout du tribunal et de la rapidité à réunir les pièces. Nous vous tenons informé à chaque étape." },
  { q: "Faut-il se déplacer ?", a: "Non, sauf pour des signatures que la loi impose en personne. Vous pouvez aussi signer par procuration. Si vous vivez à l'étranger, voyez notre offre MRE." },
  { q: "Quel capital minimum pour une SARL ?", a: "Le capital d'une SARL ou SARLAU est fixé librement par les associés. Une SA demande au moins 300 000 DH." },
  { q: "Comment se passe le paiement ?", a: "Vous passez commande en ligne. Un conseiller vous confirme tout, puis vous envoie le lien de paiement : carte bancaire, virement ou espèces." },
];

export default function CreationEntreprisePage() {
  return (
    <>
      <PageHero
        icon={BadgeCheck}
        tag="Création d'entreprise au Maroc"
        title="Créez votre société à prix fixe, sans mauvaise surprise"
        subtitle="Statuts, OMPIC, greffe et registre de commerce : nos juristes s'occupent de tout. Nos honoraires et les frais d'État sont affichés séparément."
        note={`Création Standard : ${fmtDH(standard.price ?? 0)} HT · Frais d'État au réel, sans marge`}
      >
        <HeroButton href="#tarifs">Voir les prix <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/onboarding?besoin=creer" variant="ghost">M&apos;aider à choisir</HeroButton>
      </PageHero>

      <TrustStrip items={confiance} />

      <section id="formes" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Étape 1" tagClass="bg-amber-100 text-amber-800" title="Quelle forme pour votre projet ?" subtitle="Touchez une forme pour voir ce qu'elle change pour vous et son prix." />
          <Suspense fallback={<FormesSelector />}>
            <FormesSelectorFromUrl />
          </Suspense>
        </div>
      </section>

      <section id="tarifs" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Nos prix" title="Trois formules pour créer votre société" subtitle="Paiement unique, en dirhams HT. Choisissez la forme pour voir le prix exact." />
          <CreationPricing />

          <div className="mt-16">
            <h3 className="mb-2 text-center text-xl font-bold text-zinc-900"><Zap className="mr-1.5 inline h-5 w-5 text-blue-700" />Auto-entrepreneur</h3>
            <p className="mb-8 text-center text-[15px] text-zinc-600">Prix TTC. {FRAIS_ETAT.autoEntrepreneur.note}</p>
            <div className="grid gap-6 md:grid-cols-3">
              {creationAE.map((o) => <PriceCard key={o.id} icon={Zap} tier={offerToTier(o, commandeOffre(o.id, "auto"))} />)}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center sm:flex-row sm:text-left">
            <p className="flex-1 text-[15px] text-zinc-700"><span className="font-bold text-zinc-900">SA ou SCI ?</span> Le prix dépend du projet. Nous vous envoyons un devis écrit et gratuit.</p>
            <WaButton text="Bonjour, je souhaite un devis pour créer une SA ou une SCI.">Demander un devis</WaButton>
          </div>
        </div>
      </section>

      <section id="frais" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-start gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <SectionHeader left tag="Transparence" tagClass="bg-amber-100 text-amber-800" title="Les frais d'État, ligne par ligne" subtitle="Ces frais sont fixés par l'administration et les journaux. Ils existent quel que soit le prestataire. Nous les payons pour vous et vous les refacturons au centime près." />
            <OfficialFeesNote />
          </div>
          <FeesBreakdown />
        </div>
      </section>

      <section id="pack" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Le plus avantageux" tagClass="bg-red-50 text-red-700" title="Création offerte avec la comptabilité" subtitle="Prenez la comptabilité pour 12 mois : la création Standard est offerte, avec un site vitrine en plus." />
          <div className="mx-auto grid max-w-[860px] gap-6 md:grid-cols-2">
            <PackCard pack={lancement} href={commandePack(lancement.id)} icon={Rocket} />
            <PackCard pack={lancementEquipe} href={commandePack(lancementEquipe.id)} icon={Rocket} />
          </div>
          <p className="mt-8 text-center text-sm">
            <Link href="/packs" className="inline-flex items-center gap-1 font-semibold text-blue-700">Voir tous les packs <ArrowRight className="h-3.5 w-3.5" /></Link>
          </p>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Comment ça se passe" title="Six étapes, nous faisons le travail" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {etapes.map(({ title, desc }, n) => (
              <li key={title} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-lg font-black text-zinc-900 tabular-nums">{n + 1}</span>
                <span className="mb-2 block text-lg font-bold text-zinc-900">{title}</span>
                <span className="block text-[15px] leading-relaxed text-zinc-600">{desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <Link href="/aides" className="group flex items-center gap-6 rounded-3xl bg-amber-400 p-7 text-zinc-900 transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)] max-sm:p-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-zinc-900 text-amber-400 max-sm:hidden"><HandCoins className="h-6 w-6" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-xl font-extrabold tracking-tight">Créer avec une aide de l&apos;État</span>
              <span className="mt-1 block text-[15px] text-zinc-900/80">Prêt d&apos;honneur à 0 %, primes et exonérations. Uniquement des aides sans intérêt. Rien à payer si l&apos;aide est refusée.</span>
            </span>
            <ArrowRight className="h-6 w-6 shrink-0 transition group-hover:translate-x-1 max-sm:hidden" />
          </Link>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Questions fréquentes" title="Vos questions avant de créer" />
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand title="Pas sûr de la forme à choisir ?" subtitle="Répondez à quelques questions : nous vous indiquons la forme et la formule adaptées." href="/onboarding?besoin=creer" label="Faire le questionnaire" />
    </>
  );
}
