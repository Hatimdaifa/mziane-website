// Page d'accueil Mziane.
// Tous les prix, taux et promesses viennent de src/lib/offers.ts : ne jamais écrire un montant en dur ici.
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, Building2, Rocket, Globe, Clock, ShieldCheck, Check, Plus, Zap,
  HandCoins, FilePen, Tractor, User, Search, ShoppingCart, PhoneCall, FileCheck2, Landmark, Ban, Scale, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site";
import { PackCard, OfficialFeesNote } from "@/components/offer-ui";
import {
  AIDES_BAREME, AIDES_MIN, AIDES_PLAFOND, CONTACT, FRAIS_ETAT, PRIX_CREATION, PROMESSES,
  feeAide, fmt, fmtDH, mailLink, offerById, packById, packTerre, waLink, type Pack,
} from "@/lib/offers";

type IconType = LucideIcon | ((props: { className?: string }) => React.ReactNode);

// ── Données dérivées de offers.ts ───────────────────────────────────────────
const prix = (id: string) => offerById(id)?.price ?? 0;
const sarl = PRIX_CREATION.sarlau ?? [0, 0, 0];
const lancement = packById("lancement");
const MOIS = lancement?.months ?? 12;
const EXEMPLE_AIDE = 100_000;
const pct = (r: number) => `${fmt(r * 100)} %`;

const homePacks: { id: string; icon: LucideIcon }[] = [
  { id: "demarrage", icon: Zap },
  { id: "lancement", icon: Rocket },
  { id: "envol", icon: HandCoins },
];
const packHref = (p: Pack) => `/commande?pack=${p.id}${p.formes?.[0] ? `&forme=${p.formes[0]}` : ""}`;

const engagements: { icon: IconType; title: string; desc: string }[] = [
  { icon: Ban, title: "Sans prêt à intérêt", desc: "Subventions, primes, exonérations et prêts d'honneur à 0 % uniquement." },
  { icon: HandCoins, title: "Pas d'aide obtenue, pas de frais", desc: "Sur les dossiers d'aides, nos honoraires sont dus seulement si l'aide est versée." },
  { icon: Landmark, title: "Frais d'État au réel", desc: "Refacturés au montant exact payé à l'administration, sans aucune marge." },
  { icon: WhatsAppGlyph, title: "Suivi sur WhatsApp", desc: "Vos pièces et vos questions passent par WhatsApp, à chaque étape." },
];

const organismes = ["OMPIC", "Tribunal de commerce", "DGI", "CNSS", "CRI", "Dar Al Moukawil", "Bulletin officiel", "Banques marocaines"];

// Montants repris des fiches de src/lib/aides.ts (indicatifs, conditions sur chaque fiche).
const aidesTeaser = [
  { icon: Tractor, title: "Agriculteurs", value: "Jusqu'à 100 %", desc: "de l'irrigation goutte-à-goutte subventionnée pour les petites exploitations.", href: "/aides#A01" },
  { icon: Building2, title: "Investisseurs", value: "Jusqu'à 30 %", desc: "de l'investissement en primes de la Charte de l'investissement (TPME).", href: "/aides#B01" },
  { icon: Rocket, title: "Créateurs", value: "100 000 DH", desc: "au plus de prêt d'honneur à 0 % avec le programme Forsa.", href: "/aides#B03" },
  { icon: User, title: "Particuliers", value: "100 000 DH", desc: "au plus d'aide directe pour l'achat d'un premier logement.", href: "/aides#D01" },
];

const etapes: { icon: IconType; title: string; desc: string }[] = [
  { icon: ShoppingCart, title: "Vous commandez", desc: "Choisissez un pack ou un service, ou laissez le questionnaire vous orienter. Rien n'est payé à ce stade." },
  { icon: PhoneCall, title: "Un conseiller confirme", desc: PROMESSES.paiement },
  { icon: WhatsAppGlyph, title: "Vos pièces par WhatsApp", desc: "Vous recevez la liste exacte des pièces et vous nous les envoyez en photo, sans vous déplacer." },
  { icon: FileCheck2, title: "On dépose et on suit", desc: "Nous déposons le dossier auprès de l'organisme et vous prévenons à chaque étape, jusqu'au document final ou au versement de l'aide." },
];

const tranches = AIDES_BAREME.map(([top, rate], n) => {
  const from = n === 0 ? 0 : AIDES_BAREME[n - 1][0];
  const label = n === 0 ? `Jusqu'à ${fmtDH(top)}` : top === Infinity ? `Au-delà de ${fmtDH(from)}` : `De ${fmtDH(from)} à ${fmtDH(top)}`;
  return { label, rate: pct(rate) };
});

const faq = [
  {
    q: "Combien coûte la création de ma société ?",
    a: `Nos honoraires commencent à ${fmtDH(sarl[0])} HT pour une SARLAU ou une SARL avec des statuts types, et ${fmtDH(sarl[1])} HT avec des statuts sur mesure et un juriste dédié. Les frais d'État s'ajoutent, au réel et sans marge : environ ${fmtDH(FRAIS_ETAT.societe.estimate)} (${FRAIS_ETAT.societe.range}). Dans les packs, la création est offerte.`,
  },
  {
    q: "Et pour un auto-entrepreneur ?",
    a: `L'inscription au registre national de l'auto-entrepreneur est gratuite. Vous pouvez la faire vous-même avec notre guide, sans frais, ou nous la confier pour ${fmtDH(prix("ae-accompagne"))} TTC. Le chiffre d'affaires annuel est plafonné à 500 000 DH pour le commerce et l'industrie, et à 200 000 DH pour les services.`,
  },
  {
    q: "Comment se passe le paiement ?",
    a: `Vous passez commande en ligne sans payer. ${PROMESSES.paiement}`,
  },
  {
    q: "Comment fonctionnent les packs ?",
    a: `Un pack réunit la création, la comptabilité et, selon le pack, un site web ou la domiciliation, pour une mensualité fixe pendant ${MOIS} mois. La création est offerte. La comptabilité n'est facturée qu'à partir de l'obtention du registre de commerce. En cas d'arrêt anticipé, la remise accordée est due au prorata des mois restants.`,
  },
  {
    q: "Combien coûte l'accompagnement pour une aide ?",
    a: `Le diagnostic est gratuit. Si nous montons votre dossier, nos honoraires sont un pourcentage de l'aide effectivement versée, de ${pct(AIDES_BAREME[0][1])} à ${pct(AIDES_BAREME[AIDES_BAREME.length - 1][1])} selon le montant, avec un minimum de ${fmtDH(AIDES_MIN)} et un plafond de ${fmtDH(AIDES_PLAFOND)}. ${PROMESSES.zeroRefus}`,
  },
  {
    q: "Pouvez-vous garantir que j'obtiendrai l'aide ?",
    a: `Non, et personne ne le peut : c'est l'organisme public qui décide. Nous vérifions chaque condition avant de déposer et vous ne payez nos honoraires que si l'aide est versée. ${PROMESSES.societePrivee}`,
  },
  {
    q: "Proposez-vous des crédits ?",
    a: `Non, aucun. ${PROMESSES.sansInteret}`,
  },
  {
    q: "Combien de temps faut-il pour créer ma société ?",
    a: "Le délai dépend surtout de l'administration : certificat négatif, greffe du tribunal de commerce et publications légales. Nous déposons votre dossier dès qu'il est complet et vous prévenons sur WhatsApp à chaque étape franchie.",
  },
  {
    q: "Je vis à l'étranger, puis-je créer ma société au Maroc ?",
    a: `Oui, sans vous déplacer : nous vous guidons pour la procuration et faisons les démarches sur place. L'offre MRE est à ${fmtDH(prix("intl-mre"))} HT, ou offerte dans le pack Diaspora.`,
  },
];

// ── Pictogramme WhatsApp au format des icônes lucide ────────────────────────
function WhatsAppGlyph({ className }: { className?: string }) {
  return <WhatsAppIcon className={className} />;
}

// ── Illustration du suivi (décorative) ──────────────────────────────────────
function HeroMock() {
  const steps: [string, boolean][] = [
    ["Commande reçue", true],
    ["Confirmée par votre conseiller", true],
    ["Pièces reçues sur WhatsApp", true],
    ["Dépôt au greffe", false],
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[440px] max-lg:mt-4">
      <div className="absolute inset-0 rounded-3xl bg-amber-400 [transform:translate(-14px,-14px)_rotate(5deg)] max-sm:hidden" />
      <div className="relative overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_30px_60px_-20px_rgba(31,42,61,.35)]">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-[12px] text-zinc-600">
          <b className="text-zinc-900">Exemple de suivi · SARLAU</b>
          <span>Illustration</span>
        </div>
        <div className="grid gap-2 p-5">
          {steps.map(([k, ok]) => (
            <span key={k} className={cn("flex items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-[13px] font-semibold", ok ? "border-blue-200 bg-blue-50 text-blue-900" : "border-zinc-200 text-zinc-700")}>
              <i className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full not-italic", ok ? "bg-blue-700 text-white" : "bg-zinc-100 text-zinc-600")}>
                {ok ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              </i>
              {k}
            </span>
          ))}
          <div className="mt-2 grid gap-2 rounded-2xl bg-[#ECE5DD] p-3 text-[12.5px] leading-snug text-zinc-900">
            <span className="max-w-[85%] justify-self-start rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">Bonjour, voici la liste des pièces pour votre dossier.</span>
            <span className="max-w-[85%] justify-self-end rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3 py-2 shadow-sm">Merci, je vous envoie tout ce soir.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ tag, title, subtitle, tagClass = "bg-blue-50 text-blue-800", left = false, dark = false }: {
  tag: React.ReactNode; title: string; subtitle?: React.ReactNode; tagClass?: string; left?: boolean; dark?: boolean;
}) {
  return (
    <div className={cn("mb-12 max-md:mb-9", left ? "text-left" : "text-center")}>
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold", tagClass)}>{tag}</span>
      <h2 className={cn("mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-balance", dark ? "text-white" : "text-zinc-900")}>{title}</h2>
      {subtitle && (
        <p className={cn("mt-3 max-w-[620px] text-[17px]", dark ? "text-white/80" : "text-zinc-600", !left && "mx-auto")}>{subtitle}</p>
      )}
    </div>
  );
}

const card = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(31,42,61,.18)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

// ── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const shownPacks = homePacks.flatMap(({ id, icon }) => {
    const p = packById(id);
    return p ? [{ p, icon }] : [];
  });

  return (
    <>
      {/* ── HERO : la promesse en une phrase, deux actions ── */}
      <section className="relative -mt-[76px] overflow-hidden bg-gradient-to-b from-white to-zinc-50 pt-[calc(76px+64px)] pb-20 max-sm:pt-[calc(76px+36px)] max-sm:pb-12">
        <div className="pointer-events-none absolute -top-48 -right-48 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(0,159,183,.08)_0%,transparent_65%)]" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-14 px-6 max-sm:gap-8 max-sm:px-4 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-blue-800">
              <Building2 className="h-3.5 w-3.5" /> Création d&apos;entreprise et aides de l&apos;État au Maroc
            </span>
            <h1 className="mb-6 text-[clamp(2.1rem,5.2vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-.035em] text-zinc-900 text-balance">
              Créez votre entreprise et obtenez vos aides.{" "}
              <span className="text-blue-700">Sans prêt à intérêt.</span>
            </h1>
            <p className="mb-8 max-w-[540px] text-lg leading-relaxed text-zinc-600">
              Société, auto-entrepreneur, comptabilité, marque, domiciliation, site web : nous faisons les démarches pour vous, au Maroc ou depuis l&apos;étranger.
              Et pour les aides de l&apos;État, <strong className="text-zinc-900">pas d&apos;aide obtenue, pas de frais</strong>.
            </p>
            <div className="mb-6 flex flex-wrap gap-3 max-sm:grid">
              <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-8 py-4 font-semibold text-white shadow-[0_17px_20px_-8px_rgba(0,105,122,.4)] transition hover:-translate-y-0.5 hover:bg-blue-800">
                Trouver ma solution <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/packs" className="inline-flex items-center justify-center rounded-2xl border-2 border-blue-700 px-8 py-4 font-semibold text-blue-800 transition hover:bg-blue-700 hover:text-white">
                Voir les packs
              </Link>
            </div>
            <ul className="grid gap-2 text-[14px] text-zinc-700 sm:grid-cols-2">
              {["Prix affichés avant de commander", "Frais d'État reversés sans marge", "Rien à payer en ligne pour commander", "Diagnostic des aides gratuit"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-blue-700" strokeWidth={2.5} /> {t}</li>
              ))}
            </ul>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-900 hover:text-blue-800">
              <WhatsAppIcon className="h-5 w-5 text-[#128C4B]" /> Une question ? Écrivez-nous sur WhatsApp
            </a>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section aria-label="Nos engagements" className="border-y border-zinc-200 bg-white py-12 max-sm:py-9">
        <ul className="mx-auto grid max-w-[1200px] gap-6 px-6 max-sm:px-4 sm:grid-cols-2 lg:grid-cols-4">
          {engagements.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
              <span>
                <span className="block font-bold text-zinc-900">{title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-zinc-600">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── AIGUILLAGE PAR PROFIL (bento) ── */}
      <section className="bg-zinc-50 py-24 max-md:py-16">
        <div className="mx-auto max-w-[1200px] px-6 max-sm:px-4">
          <SectionHeader
            tag={<><Search className="h-3.5 w-3.5" /> Votre situation</>}
            title="Par où commencer ?"
            subtitle="Choisissez ce qui vous ressemble, nous vous montrons les démarches, les prix et les aides possibles."
          />
          <div className="mx-auto grid max-w-[1100px] auto-rows-[minmax(180px,auto)] gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/creation-entreprise" className={cn("group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 sm:col-span-2 lg:row-span-2 max-sm:p-6", card)}>
              <svg aria-hidden="true" viewBox="0 0 377 368" className="absolute -right-16 -bottom-16 h-[340px] w-[340px] fill-blue-50 transition-transform duration-[2s] group-hover:rotate-180 motion-reduce:transition-none"><path d="M179.692 5.79814C182.635 -1.93287 193.572 -1.93285 196.515 5.79816L229.505 92.466C231.206 96.9342 236.103 99.2928 240.657 97.8366L328.986 69.5929C336.865 67.0735 343.684 75.6242 339.474 82.7452L292.284 162.574C289.851 166.69 291.061 171.99 295.038 174.642L372.192 226.091C379.075 230.68 376.641 241.343 368.449 242.491L276.613 255.369C271.878 256.033 268.489 260.283 268.895 265.047L276.776 357.445C277.479 365.688 267.625 370.433 261.619 364.744L194.293 300.973C190.821 297.686 185.386 297.686 181.914 300.973L114.588 364.744C108.582 370.433 98.7281 365.688 99.4311 357.445L107.312 265.047C107.718 260.283 104.329 256.033 99.5941 255.369L7.7582 242.491C-0.433812 241.343 -2.86746 230.68 4.01488 226.091L81.1687 174.642C85.1465 171.99 86.3561 166.69 83.9231 162.574L36.7325 82.7452C32.523 75.6242 39.342 67.0735 47.2212 69.5929L135.55 97.8366C140.104 99.2928 145.001 96.9342 146.702 92.4659L179.692 5.79814Z" /></svg>
              <span className="relative self-start rounded-full bg-blue-700 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-white">À partir de {fmtDH(sarl[0])} HT</span>
              <span className="relative text-[clamp(2.2rem,5vw,3.4rem)] font-black leading-none tracking-[-.04em] text-zinc-900">Je crée une société</span>
              <span className="relative max-w-[400px] text-[17px] leading-relaxed text-zinc-600">
                SARLAU, SARL ou SAS : certificat négatif, statuts, greffe, registre de commerce, ICE et inscriptions fiscales. Frais d&apos;État en sus, au réel.
              </span>
              <span className="relative inline-flex items-center gap-2.5 self-start rounded-full bg-blue-700 px-6 py-3.5 font-bold text-white transition group-hover:-translate-y-0.5 group-hover:bg-blue-800 max-sm:self-stretch max-sm:justify-center">
                Créer ma société <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link href="/creation-entreprise?forme=auto#formes" className={cn("flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-red-700 p-7 text-white", card)}>
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-white/20"><Zap className="h-5 w-5" /></span>
              <span>
                <span className="block text-[1.75rem] font-black leading-[1.05] tracking-tight">Je suis auto-entrepreneur</span>
                <span className="mt-1.5 block text-[15px] font-semibold text-white/90">Freelance, commerce, e-commerce</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/90">Gratuit ou {fmtDH(prix("ae-accompagne"))} TTC accompagné <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>

            <Link href="/aides" className={cn("flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-amber-400 p-7 text-zinc-900", card)}>
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-zinc-900 text-white"><HandCoins className="h-5 w-5" /></span>
              <span>
                <span className="block text-[1.75rem] font-black leading-[1.05] tracking-tight">Je cherche une aide</span>
                <span className="mt-1.5 block text-[15px] font-semibold text-zinc-900/80">Primes, subventions, prêts d&apos;honneur à 0 %</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">Diagnostic gratuit <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>

            <Link href="/aides?cat=agriculture#catalogue" className={cn("flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 text-zinc-900", card)}>
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-amber-100 text-amber-900"><Tractor className="h-5 w-5" /></span>
              <span>
                <span className="block text-[1.75rem] font-black leading-[1.05] tracking-tight">Je suis agriculteur</span>
                <span className="mt-1.5 block text-[15px] text-zinc-600">Irrigation, matériel, élevage, coopérative</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">{pct(packTerre.taux)} de la subvention, au paiement <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>

            <Link href="/expatriation" className={cn("flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-zinc-900 p-7 text-white", card)}>
              <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-blue-700"><Globe className="h-5 w-5" /></span>
              <span>
                <span className="block text-[1.75rem] font-black leading-[1.05] tracking-tight">Je vis à l&apos;étranger</span>
                <span className="mt-1.5 block text-[15px] font-semibold text-white/80">MRE, non-résident, investisseur</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/80">Sans vous déplacer <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>

            <Link href="/gestion" className={cn("group flex items-center gap-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 text-zinc-900 sm:col-span-2 lg:col-span-4", card)}>
              <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-blue-700 text-white max-sm:h-14 max-sm:w-14">
                <FilePen className="h-8 w-8 max-sm:h-6 max-sm:w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.35rem] font-extrabold leading-tight tracking-tight">J&apos;ai déjà une société</span>
                <span className="mt-1 block text-sm text-zinc-600">Siège, gérant, associés, capital, marque, domiciliation, comptabilité ou fermeture.</span>
              </span>
              <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-900 transition-transform group-hover:translate-x-1 max-sm:hidden"><ArrowRight className="h-7 w-7" /></span>
            </Link>
          </div>
          <p className="mt-8 text-center text-[15px] text-zinc-600">
            Vous hésitez ?{" "}
            <Link href="/onboarding" className="inline-flex items-center gap-1 font-semibold text-blue-800 underline-offset-4 hover:underline">
              Le questionnaire vous oriente en quelques questions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </section>

      {/* ── PACKS ── */}
      <section className="bg-white py-24 max-md:py-16">
        <div className="mx-auto max-w-[1200px] px-6 max-sm:px-4">
          <SectionHeader
            tag={<><Rocket className="h-3.5 w-3.5" /> Packs</>}
            tagClass="bg-amber-100 text-amber-900"
            title="La création offerte, tout le reste réglé pendant un an"
            subtitle={`Une mensualité fixe pendant ${MOIS} mois. La comptabilité ne démarre qu'avec votre registre de commerce.`}
          />
          <div className="mx-auto grid max-w-[1120px] items-start gap-6 pt-3 md:grid-cols-3">
            {shownPacks.map(({ p, icon }) => (
              <PackCard key={p.id} pack={p} icon={icon} href={packHref(p)} highlighted={p.id === "lancement"} className={p.id === "lancement" ? "md:-mt-3" : undefined} />
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap items-center justify-between gap-4">
            <OfficialFeesNote className="flex-1" />
            <Link href="/packs" className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-900 px-6 py-3 font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-white">
              Comparer tous les packs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AIDES : PAS D'AIDE OBTENUE, PAS DE FRAIS ── */}
      <section className="bg-zinc-900 py-24 max-md:py-16">
        <div className="mx-auto grid max-w-[1150px] items-start gap-12 px-6 max-sm:px-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[13px] font-bold text-zinc-900">
              <HandCoins className="h-3.5 w-3.5" /> Aides de l&apos;État
            </span>
            <h2 className="mt-5 mb-4 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-white text-balance">
              Pas d&apos;aide obtenue, pas de frais.
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-white/80">
              On repère les aides auxquelles vous avez droit, on monte le dossier et on le suit jusqu&apos;au versement. {PROMESSES.sansInteret}
            </p>

            <div className="mb-6 overflow-hidden rounded-2xl border border-white/15">
              <table className="w-full text-left text-[15px]">
                <caption className="bg-white/[.06] px-4 py-3 text-left text-sm font-semibold text-white">
                  Nos honoraires, calculés sur l&apos;aide effectivement versée
                </caption>
                <tbody>
                  {tranches.map((t) => (
                    <tr key={t.label} className="border-t border-white/10">
                      <th scope="row" className="px-4 py-2.5 font-normal text-white/80">{t.label}</th>
                      <td className="px-4 py-2.5 text-right font-bold text-white tabular-nums">{t.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-white/10 px-4 py-3 text-[13px] leading-relaxed text-white/75">
                Par tranche, minimum {fmtDH(AIDES_MIN)}, plafond {fmtDH(AIDES_PLAFOND)}. Exemple : pour une aide de {fmtDH(EXEMPLE_AIDE)} versée, {`${fmtDH(feeAide(EXEMPLE_AIDE))} HT d'honoraires.`}
                Agriculteurs : {pct(packTerre.taux)} de la subvention, minimum {fmtDH(packTerre.min)}. Prêt d&apos;honneur : forfait de {`${fmtDH(prix("aides-honneur"))} HT, payé à l'accord.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 max-sm:grid">
              <Link href="/onboarding?besoin=aides" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-amber-300">
                Faire mon diagnostic gratuit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/aides" className="inline-flex items-center justify-center rounded-2xl border-2 border-white/60 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-zinc-900">
                Voir toutes les aides
              </Link>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-white/70">{PROMESSES.societePrivee} Aucune aide n&apos;est garantie : la décision appartient à l&apos;organisme.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {aidesTeaser.map(({ icon: Icon, title, value, desc, href }) => (
              <Link key={title} href={href} className="rounded-3xl bg-white/[.07] p-6 transition hover:bg-white/[.12] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-zinc-900"><Icon className="h-5 w-5" /></span>
                <span className="block text-[15px] font-semibold text-white/80">{title}</span>
                <span className="mt-1 block text-2xl font-extrabold tracking-tight text-white">{value}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-white/75">{desc}</span>
              </Link>
            ))}
            <p className="text-[13px] text-white/65 sm:col-span-2">Montants indicatifs, conditions et pièces détaillées sur chaque fiche.</p>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="bg-white py-24 max-md:py-16">
        <div className="mx-auto max-w-[1150px] px-6 max-sm:px-4">
          <SectionHeader
            tag={<><Clock className="h-3.5 w-3.5" /> Comment ça marche</>}
            title="Quatre étapes, sans vous déplacer"
            subtitle="Vous commandez, on vous rappelle, vous envoyez vos pièces, on s'occupe du reste."
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map(({ icon: Icon, title, desc }, n) => (
              <li key={title} className="relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-7 max-sm:p-6">
                <span className="mb-5 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white"><Icon className="h-5.5 w-5.5" /></span>
                  <span aria-hidden="true" className="text-4xl font-black tracking-tight text-zinc-200">{String(n + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="mb-2 text-lg font-extrabold tracking-tight text-zinc-900"><span className="sr-only">Étape {n + 1} : </span>{title}</h3>
                <p className="text-[15px] leading-relaxed text-zinc-600">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── TRANSPARENCE : HONORAIRES ET FRAIS D'ÉTAT ── */}
      <section className="bg-zinc-50 py-24 max-md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 max-sm:px-4">
          <SectionHeader
            tag={<><Scale className="h-3.5 w-3.5" /> Transparence</>}
            title="Ce que vous payez, et à qui"
            subtitle="Deux lignes bien séparées sur chaque devis : nos honoraires, et les frais d'État que nous reversons à l'administration."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 max-sm:p-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><ShieldCheck className="h-5 w-5" /></span>
              <h3 className="mb-3 text-xl font-extrabold tracking-tight text-zinc-900">Nos honoraires</h3>
              <ul className="grid gap-2.5 text-[15px] text-zinc-700">
                {[
                  "Affichés sur le site avant toute commande.",
                  "Hors taxes pour les entreprises (TVA de 20 % en sus), TTC pour les auto-entrepreneurs et les particuliers.",
                  "Payés après la confirmation de votre conseiller, jamais au moment de la commande.",
                  "Sur les aides : un pourcentage de l'aide versée, rien si elle est refusée.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-700" strokeWidth={2.5} /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 max-sm:p-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-900"><Landmark className="h-5 w-5" /></span>
              <h3 className="mb-1 text-xl font-extrabold tracking-tight text-zinc-900">Les frais d&apos;État, au réel</h3>
              <p className="mb-4 text-sm text-zinc-600">Exemple pour une SARL, reversés sans marge :</p>
              <table className="w-full text-[14px]">
                <tbody>
                  {FRAIS_ETAT.societe.lines.map((l) => (
                    <tr key={l.label} className="border-b border-zinc-100">
                      <th scope="row" className="py-2 pr-3 text-left font-normal text-zinc-700">{l.label}</th>
                      <td className="py-2 text-right whitespace-nowrap text-zinc-900 tabular-nums">{l.range ? `${l.range} DH` : fmtDH(l.amount)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="pt-3 text-left font-bold text-zinc-900">Total estimé</th>
                    <td className="pt-3 text-right font-bold whitespace-nowrap text-zinc-900 tabular-nums">{FRAIS_ETAT.societe.range}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-[13px] leading-relaxed text-zinc-600">{FRAIS_ETAT.societe.note} {FRAIS_ETAT.autoEntrepreneur.note}</p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-[760px] text-center text-[13px] leading-relaxed text-zinc-600">{PROMESSES.societePrivee}</p>
        </div>
      </section>

      {/* ── ORGANISMES ── */}
      <section className="bg-white pt-14 pb-6">
        <div className="mx-auto max-w-[1200px] px-6 max-sm:px-4">
          <h2 className="mb-6 text-center text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold tracking-tight text-zinc-900">Nous faisons vos démarches auprès de</h2>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-[mz-marquee_30s_linear_infinite] gap-4 motion-reduce:animate-none">
              {[...organismes, ...organismes].map((o, n) => (
                <span key={n} aria-hidden={n >= organismes.length} className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-6 py-3 text-[15px] font-semibold text-zinc-700">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-20 max-md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-start gap-14 px-6 max-md:gap-7 max-sm:px-4 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-28">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold tracking-[.12em] text-blue-800">FAQ</span>
            <h2 className="mt-3.5 mb-3 text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-zinc-900">Vos questions, nos réponses</h2>
            <p className="mb-6 leading-relaxed text-zinc-600">
              Une autre question ? Un conseiller vous répond sur WhatsApp ou par e-mail.
            </p>
            <div className="grid gap-2.5 rounded-[20px] border border-zinc-200 bg-zinc-50 p-4.5">
              <a href={waLink("Bonjour, j'ai une question avant de commander.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E7A40] py-3 text-sm font-bold text-white transition hover:bg-[#0B6634]">
                <WhatsAppIcon className="h-4.5 w-4.5" /> WhatsApp {CONTACT.whatsappDisplay}
              </a>
              <a href={mailLink("Question avant de commander")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300">
                <Mail className="h-4.5 w-4.5" aria-hidden="true" /> {CONTACT.email}
              </a>
            </div>
          </div>
          <div className="grid gap-3">
            {faq.map(({ q, a }) => (
              <details key={q} className="group rounded-[18px] border border-zinc-200 bg-white px-5.5 transition open:border-blue-500/30 open:shadow-[0_12px_30px_-2px_rgba(58,75,116,.14)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-600 transition-transform group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-zinc-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
