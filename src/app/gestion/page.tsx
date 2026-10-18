import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FilePen, MapPin, User, ArrowLeftRight, Landmark, Stamp, Building2, CircleOff, Moon, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modifier ou fermer sa société au Maroc | Mziane",
  description:
    "Transfert de siège, changement de gérant, cession de parts, capital, dépôt de marque OMPIC, domiciliation, dissolution et liquidation : Mziane gère vos formalités.",
};

const services = [
  { icon: MapPin, title: "Transfert de siège social", desc: "Décision des associés, mise à jour des statuts, dépôt au greffe et publication." },
  { icon: User, title: "Changement de gérant", desc: "Nomination ou démission, procès-verbal, mise à jour du registre de commerce." },
  { icon: ArrowLeftRight, title: "Cession de parts et nouvel associé", desc: "Acte de cession, agrément, enregistrement et mise à jour des statuts." },
  { icon: Landmark, title: "Modification du capital", desc: "Augmentation ou réduction, dépôt des fonds, formalités au greffe." },
  { icon: FilePen, title: "Changement de nom ou d'activité", desc: "Nouveau certificat négatif OMPIC, statuts modifiés, publications légales." },
  { icon: Stamp, title: "Dépôt de marque", desc: "Recherche d'antériorité et dépôt de votre marque à l'OMPIC pour la protéger." },
  { icon: Building2, title: "Domiciliation", desc: "Une adresse professionnelle pour votre siège, avec réception du courrier." },
  { icon: Moon, title: "Mise en sommeil", desc: "Suspendre temporairement l'activité sans fermer la société." },
  { icon: CircleOff, title: "Dissolution et liquidation", desc: "Fermeture complète de la société : dissolution, liquidation et radiation." },
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
      <section className="relative -mt-[76px] overflow-hidden bg-gradient-to-b from-white to-zinc-50 pt-[calc(76px+72px)] pb-20 max-sm:pb-12">
        <div className="pointer-events-none absolute -top-48 -right-48 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,159,183,.08)_0%,transparent_65%)]" />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-blue-700">
            <FilePen className="h-3.5 w-3.5" /> Vie de la société
          </span>
          <h1 className="mb-6 max-w-[760px] text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-.03em] text-zinc-900 text-balance">
            Modifiez ou fermez votre société sans vous déplacer.
          </h1>
          <p className="mb-8 max-w-[580px] text-lg leading-relaxed text-zinc-600">
            Siège, gérant, associés, capital, marque ou fermeture : on rédige les actes et on s&apos;occupe des formalités au greffe pour vous.
          </p>
          <Link href="/onboarding?besoin=gerer" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_17px_20px_-8px_rgba(0,132,153,.35)] transition hover:-translate-y-0.5 hover:bg-blue-700">
            Obtenir mon devis <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[13px] text-zinc-500">Devis gratuit sous 24 h · Frais de greffe et publications au prix fixé par l&apos;administration</p>
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Nos formalités</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, desc }) => (
              <Link
                key={title}
                href="/onboarding?besoin=gerer"
                className="group rounded-3xl bg-zinc-50 p-6 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]"
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
          <ul className="grid gap-3 rounded-3xl border border-zinc-200 bg-white p-6">
            {inclus.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] text-zinc-800">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700"><Check className="h-3 w-3" strokeWidth={3} /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
