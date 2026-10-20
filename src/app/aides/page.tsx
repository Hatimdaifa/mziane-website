import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, HandCoins, FileCheck, BadgeCheck, Tractor, Building2, User, UsersRound, Mic, Droplets, Banknote, Sprout } from "lucide-react";
import { PACK_ICONS } from "@/components/packs/meta";
import AidesCatalogue, { AidesCatalogueFromUrl } from "@/components/AidesCatalogue";
import { Ar } from "@/components/Ar";
import { PageHero, HeroButton, SectionHeader, PriceCard, CtaBand } from "@/components/site";
import { PackCard, offerToTier } from "@/components/offer-ui";
import { PromessesAides, WaButton, commandeOffre, commandePack } from "@/components/services/blocks";
import AidesBareme from "@/components/services/AidesBareme";
import { aidesOffers, feeAide, fmt, fmtDH, packById, packTerre, particuliers, waLink } from "@/lib/offers";

const envol = packById("envol")!;
const exempleAgri = 100_000;

export const metadata: Metadata = {
  title: "Aides et subventions au Maroc, 0 DH si refus | Mziane",
  description:
    "Subventions agricoles, primes à l'investissement, prêts d'honneur à 0 %, exonérations et aides sociales. Diagnostic gratuit, honoraires seulement si l'aide est versée. Uniquement des aides sans intérêt.",
};


const publics = [
  { icon: Tractor, title: "Agriculteurs", desc: "Goutte-à-goutte jusqu'à 100 %, matériel, élevage.", href: "#agriculteurs" },
  { icon: Building2, title: "Créateurs et entreprises", desc: "Primes, prêts d'honneur à 0 %, embauche.", href: "/aides?cat=entreprise#catalogue" },
  { icon: UsersRound, title: "Femmes entrepreneures", desc: "Programmes dédiés, coopératives féminines.", href: "/aides?cat=femmes#catalogue" },
  { icon: User, title: "Particuliers", desc: "Logement, aide sociale directe, AMO.", href: "#particuliers" },
];

const agriEtapes: { icon: typeof Mic; title: string; desc: string; ar?: string }[] = [
  { icon: Mic, title: "Vous nous parlez", desc: "Un message vocal suffit." },
  { icon: FileCheck, title: "Nous faisons le dossier", desc: "Avec votre installateur." },
  { icon: Droplets, title: "L'État paie", desc: "Subvention du FDA.", ar: "صندوق التنمية الفلاحية" },
  { icon: Banknote, title: `Vous payez ${fmt(packTerre.taux * 100)} %`, desc: "Seulement après le paiement." },
];

const particulierHref: Record<string, string> = {
  "part-guide": "/aides?cat=particuliers#catalogue",
  "part-asd": waLink("Bonjour, je voudrais faire vérifier mon dossier RSU pour l'aide sociale directe."),
};

export default function AidesPage() {
  return (
    <>
      <PageHero
        icon={HandCoins}
        tag="Aides et subventions de l'État"
        title="Les aides existent. Nous vous aidons à les demander."
        ar="دعم الدولة"
        subtitle="Nous trouvons vos aides et montons le dossier. Vous ne payez que si l'aide est versée."
        note="Diagnostic gratuit · 0 DH si l'aide est refusée · Uniquement des aides sans intérêt"
      >
        <HeroButton href="/onboarding?besoin=aides">Faire mon diagnostic gratuit <ArrowRight className="h-4 w-4" /></HeroButton>
        <HeroButton href="#catalogue" variant="ghost">Voir toutes les aides</HeroButton>
      </PageHero>

      <section className="border-b border-zinc-200 bg-zinc-50 py-10">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <PromessesAides />
        </div>
      </section>

      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Pour qui ?" title="Choisissez votre situation" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publics.map(({ icon: Icon, title, desc, href }) => (
              <a key={title} href={href} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-800"><Icon className="h-5 w-5" /></span>
                <span className="mb-1.5 flex items-center gap-1.5 text-lg font-bold text-zinc-900 group-hover:text-blue-700">{title} <ArrowRight className="h-4 w-4" /></span>
                <span className="block text-[15px] leading-relaxed text-zinc-600">{desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="offres" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Nos offres" title="Gratuit pour commencer, payé seulement au versement" subtitle="Prix HT pour les entreprises." />
          <div className="grid gap-6 md:grid-cols-3">
            {aidesOffers.map((o) => (
              <PriceCard
                key={o.id}
                icon={HandCoins}
                tier={offerToTier(o, o.price === 0 ? "/onboarding?besoin=aides" : commandeOffre(o.id), o.price === 0 ? "Faire mon diagnostic" : undefined)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="honoraires" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Dossier de A à Z" tagClass="bg-amber-100 text-amber-800" title="Combien vous payez, en clair" subtitle="Plus l'aide est grande, plus notre pourcentage baisse." />
          <AidesBareme />
        </div>
      </section>

      <section id="agriculteurs" className="scroll-mt-24 bg-amber-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[13px] font-semibold text-amber-800"><Sprout className="h-3.5 w-3.5" /> Pack {packTerre.name}</span>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Agriculteurs : l&apos;eau, le matériel, les plants</h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[17px] text-zinc-700">Pas de formulaire. Un message vocal sur WhatsApp suffit.</p>
          </div>

          <ol className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {agriEtapes.map(({ icon: Icon, title, desc, ar }, n) => (
              <li key={title} className="flex flex-col items-center rounded-3xl border border-zinc-200 bg-white p-5 text-center">
                <span className="relative mb-3 grid h-16 w-16 place-items-center rounded-full bg-blue-700 text-white">
                  <Icon className="h-8 w-8" aria-hidden />
                  <span className="absolute -top-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-sm font-black text-zinc-900">{n + 1}</span>
                </span>
                <span className="text-lg font-bold text-zinc-900">{title}</span>
                <span className="mt-0.5 text-[15px] text-zinc-600">{desc}</span>
                {ar && <Ar className="ml-0 mt-1.5 text-[13px] leading-normal">{ar}</Ar>}
              </li>
            ))}
          </ol>

          <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-semibold text-blue-700">Exemple</p>
              <p className="mt-1 text-lg font-bold text-zinc-900">Subvention de {fmtDH(exempleAgri)}</p>
              <p className="mt-2 text-[15px] text-zinc-700">
                Vous payez <span className="text-xl font-extrabold text-zinc-900 tabular-nums">{fmtDH(feeAide(exempleAgri, "agri"))} HT</span>, une seule fois, après le paiement du FDA.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{packTerre.conditions}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <ul className="mb-5 grid gap-2.5 text-[15px] text-zinc-700">
                {packTerre.items.map((i) => <li key={i} className="flex gap-2"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> {i}</li>)}
              </ul>
              <WaButton text="Bonjour, je suis agriculteur. Je vous envoie un message vocal." variant="amber" icon={Mic} className="w-full py-4 text-base">
                Envoyer un message vocal
              </WaButton>
            </div>
          </div>
        </div>
      </section>

      <section id="envol" className="scroll-mt-24 bg-white py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <SectionHeader left tag="Créer avec une aide" tagClass="bg-red-50 text-red-700" title="Pack Envol : la création et le business plan offerts" subtitle={`Pour créer avec une aide (prime TPME, prêt d'honneur à 0 %). ${envol.extra ?? ""}.`} />
          </div>
          <PackCard pack={envol} href={commandePack(envol.id)} icon={PACK_ICONS.envol} highlighted />
        </div>
      </section>

      <section id="particuliers" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <SectionHeader tag="Particuliers" title="Aides aux familles" subtitle={<>Prix TTC. L&apos;aide sociale directe<Ar>الدعم الاجتماعي المباشر</Ar> est vérifiée gratuitement.</>} />
          <div className="grid gap-6 md:grid-cols-3">
            {particuliers.map((o) => (
              <PriceCard
                key={o.id}
                icon={User}
                tier={offerToTier(o, particulierHref[o.id] ?? commandeOffre(o.id), o.id === "part-guide" ? "Lire les fiches" : o.id === "part-asd" ? "Vérifier mon dossier" : undefined)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 bg-zinc-50 py-20 max-md:py-14">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-zinc-900">Toutes les aides</h2>
          <p className="mt-3 mb-8 text-[17px] text-zinc-600">
            Montants indicatifs, vérifiés pour chaque dossier. L&apos;organisme public décide de l&apos;accord.
          </p>
          <Suspense fallback={<AidesCatalogue />}>
            <AidesCatalogueFromUrl />
          </Suspense>
        </div>
      </section>

      <CtaBand title="Quelles aides pour vous ?" subtitle="Quelques questions, et nous vous indiquons vos aides. Gratuit." href="/onboarding?besoin=aides" label="Faire mon diagnostic gratuit" />
    </>
  );
}
