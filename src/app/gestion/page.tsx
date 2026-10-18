import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FilePen, MapPin, User, ArrowLeftRight, Landmark, Stamp, Building2, CircleOff, Moon } from "lucide-react";
import { PageHero, HeroButton, SectionHeader, CheckList, CtaBand } from "@/components/site";

export const metadata: Metadata = {
  title: "Modifier ou fermer sa société au Maroc | Mziane",
  description:
    "Transfert de siège, changement de gérant, cession de parts, capital, dépôt de marque OMPIC, domiciliation, dissolution et liquidation : Mziane gère vos formalités.",
};

const services = [
  { id: "siege", icon: MapPin, title: "Transfert de siège social", desc: "Décision des associés, mise à jour des statuts, dépôt au greffe et publication." },
  { id: "gerant", icon: User, title: "Changement de gérant", desc: "Nomination ou démission, procès-verbal, mise à jour du registre de commerce." },
  { id: "parts", icon: ArrowLeftRight, title: "Cession de parts et nouvel associé", desc: "Acte de cession, agrément, enregistrement et mise à jour des statuts." },
  { id: "capital", icon: Landmark, title: "Modification du capital", desc: "Augmentation ou réduction, dépôt des fonds, formalités au greffe." },
  { id: "denomination", icon: FilePen, title: "Changement de nom ou d'activité", desc: "Nouveau certificat négatif OMPIC, statuts modifiés, publications légales." },
  { id: "marque", icon: Stamp, title: "Dépôt de marque", desc: "Recherche d'antériorité et dépôt de votre marque à l'OMPIC pour la protéger." },
  { id: "domiciliation", icon: Building2, title: "Domiciliation", desc: "Une adresse professionnelle pour votre siège, avec réception du courrier." },
  { id: "sommeil", icon: Moon, title: "Mise en sommeil", desc: "Suspendre temporairement l'activité sans fermer la société." },
  { id: "fermer", icon: CircleOff, title: "Dissolution et liquidation", desc: "Fermeture complète de la société : dissolution, liquidation et radiation." },
];

const inclus = [
  "Rédaction des procès-verbaux et des actes",
  "Mise à jour des statuts",
  "Enregistrement et dépôt au tribunal de commerce",
  "Publications légales",
  "Mise à jour du registre de commerce",
  "Un juriste qui suit votre dossier",
];

export default function GestionPage() {
  return (
    <>
      <PageHero
        icon={FilePen}
        tag="Vie de la société"
        title="Modifiez ou fermez votre société sans vous déplacer"
        subtitle="Siège, gérant, associés, capital, marque ou fermeture : on rédige les actes et on s'occupe des formalités au greffe pour vous."
        note="Devis gratuit sous 24 h · Frais de greffe et publications au prix fixé par l'administration"
      >
        <HeroButton href="/onboarding?besoin=gerer">Obtenir mon devis <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="/tarifs" variant="ghost">Voir les tarifs</HeroButton>
      </PageHero>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeader left tag="Nos formalités" title="Tout ce que l'on gère pour vous" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ id, icon: Icon, title, desc }) => (
              <Link
                key={id}
                id={id}
                href="/onboarding?besoin=gerer"
                className="group scroll-mt-28 rounded-3xl bg-zinc-50 p-6 transition target:ring-2 target:ring-blue-500 duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
                <div className="mb-1.5 text-lg font-bold text-zinc-900 group-hover:text-blue-700">{title}</div>
                <p className="text-[15px] leading-relaxed text-zinc-600">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Ce qui est inclus</h2>
            <p className="text-[17px] leading-relaxed text-zinc-600">
              Chaque formalité est prise en charge du début à la fin. Vous recevez les documents à signer, on s&apos;occupe du reste.
            </p>
          </div>
          <CheckList items={inclus} className="rounded-3xl border border-zinc-200 bg-white p-6" />
        </div>
      </section>

      <CtaBand title="Une formalité à faire ?" subtitle="Dites-nous ce que vous voulez modifier, on vous envoie un devis sous 24 h." href="/onboarding?besoin=gerer" label="Obtenir mon devis" />
    </>
  );
}
