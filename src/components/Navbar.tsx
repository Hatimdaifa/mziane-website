"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2, Menu, X, ChevronDown, CircleUserRound, Rocket, User, Users, Lightbulb, Landmark, House, Zap,
  Store, HeartHandshake, CircleHelp, ShoppingBag, Briefcase, Laptop, Hotel, Sprout, HardHat, Plane,
  Tractor, Droplets, Search, UsersRound, HandCoins, MapPin, ArrowLeftRight, FilePen, Stamp, Moon, CircleOff,
  Calculator, FileText, TrendingUp, BarChart3, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT, waLink } from "@/lib/offers";
import { WhatsAppIcon } from "@/components/site";
import { Ar } from "@/components/Ar";

// ── Contenu des menus ────────────────────────────────────────────────────────
interface MenuLink { icon: LucideIcon; label: string; desc?: string; href: string }
interface MenuGroup { title: string; links: MenuLink[]; side?: boolean }
interface NavItem { name: string; ar?: string; link: string; groups?: MenuGroup[]; highlight?: boolean }

const navItems: NavItem[] = [
  {
    name: "Création d'entreprise", ar: "إحداث المقاولة", link: "/creation-entreprise",
    groups: [
      {
        title: "Par forme juridique",
        links: [
          { icon: Rocket, label: "Création de société", desc: "Toutes les formes et les étapes", href: "/creation-entreprise" },
          { icon: User, label: "SARLAU", desc: "Seul, responsabilité limitée", href: "/creation-entreprise?forme=sarlau#formes" },
          { icon: Users, label: "SARL", desc: "Entre associés, de 2 à 50", href: "/creation-entreprise?forme=sarl#formes" },
          { icon: Lightbulb, label: "SAS", desc: "Statuts libres, investisseurs", href: "/creation-entreprise?forme=sas#formes" },
          { icon: Landmark, label: "SA", desc: "Grands projets", href: "/creation-entreprise?forme=sa#formes" },
          { icon: House, label: "SCI", desc: "Patrimoine immobilier", href: "/creation-entreprise?forme=sci#formes" },
          { icon: Zap, label: "Auto-entrepreneur", desc: "Démarrer seul sans capital", href: "/creation-entreprise?forme=auto#formes" },
          { icon: HeartHandshake, label: "Coopérative", desc: "Agricole, artisanale, féminine", href: "/creation-entreprise?forme=cooperative#formes" },
          { icon: CircleHelp, label: "Choisir mon statut", desc: "Questionnaire personnalisé", href: "/onboarding?besoin=creer" },
          { icon: Plane, label: "Depuis l'étranger", desc: "MRE et non-résidents", href: "/expatriation" },
        ],
      },
      {
        title: "Par activité", side: true,
        links: [
          { icon: ShoppingBag, label: "Commerce", href: "/onboarding?besoin=creer" },
          { icon: Briefcase, label: "Services et conseil", href: "/onboarding?besoin=creer" },
          { icon: Laptop, label: "Digital et e-commerce", href: "/onboarding?besoin=creer" },
          { icon: Hotel, label: "Tourisme et restauration", href: "/onboarding?besoin=creer" },
          { icon: Sprout, label: "Agriculture", href: "/onboarding?besoin=creer" },
          { icon: HardHat, label: "BTP et immobilier", href: "/onboarding?besoin=creer" },
        ],
      },
    ],
  },
  {
    name: "Aides de l'État", ar: "دعم الدولة", link: "/aides",
    groups: [
      {
        title: "Par profil",
        links: [
          { icon: Tractor, label: "Agriculteurs", desc: "Irrigation, matériel, élevage", href: "/aides?cat=agriculture#catalogue" },
          { icon: Store, label: "Créer ou développer", desc: "Primes, prêts d'honneur à 0 %", href: "/aides?cat=entreprise#catalogue" },
          { icon: UsersRound, label: "Femmes entrepreneures", desc: "Programmes dédiés", href: "/aides?cat=femmes#catalogue" },
          { icon: User, label: "Particuliers", desc: "Logement, aide sociale, santé", href: "/aides?cat=particuliers#catalogue" },
          { icon: Search, label: "Trouver mes aides", desc: "Diagnostic gratuit en ligne", href: "/onboarding?besoin=aides" },
          { icon: HandCoins, label: "Toutes les aides", desc: "Conditions, montants, pièces", href: "/aides#catalogue" },
        ],
      },
      {
        title: "Les plus demandées", side: true,
        links: [
          { icon: Droplets, label: "Goutte-à-goutte", href: "/aides#A01" },
          { icon: Landmark, label: "Primes TPME", href: "/aides#B01" },
          { icon: Rocket, label: "Programme Forsa", href: "/aides#B03" },
          { icon: Users, label: "Aide à l'embauche", href: "/aides#B11" },
          { icon: House, label: "Aide au logement", href: "/aides#D01" },
        ],
      },
    ],
  },
  {
    name: "Autres services", link: "/gestion",
    groups: [
      {
        title: "Gestion de société",
        links: [
          { icon: MapPin, label: "Transfert de siège", desc: "Changer d'adresse", href: "/gestion#siege" },
          { icon: User, label: "Changement de gérant", desc: "Nomination, démission", href: "/gestion#gerant" },
          { icon: ArrowLeftRight, label: "Cession de parts", desc: "Entrée ou sortie d'associé", href: "/gestion#parts" },
          { icon: Landmark, label: "Modification du capital", desc: "Augmentation, réduction", href: "/gestion#capital" },
          { icon: FilePen, label: "Nom ou activité", desc: "Modifier les statuts", href: "/gestion#denomination" },
          { icon: Moon, label: "Mise en sommeil", desc: "Suspendre l'activité", href: "/gestion#sommeil" },
          { icon: CircleOff, label: "Fermeture", desc: "Dissolution et liquidation", href: "/gestion#fermer" },
        ],
      },
      {
        title: "Protéger et domicilier", side: true,
        links: [
          { icon: Stamp, label: "Dépôt de marque", href: "/gestion#marque" },
          { icon: Building2, label: "Domiciliation", href: "/gestion#domiciliation" },
          { icon: Plane, label: "MRE et étrangers", href: "/expatriation" },
        ],
      },
    ],
  },
  {
    name: "Comptabilité", ar: "المحاسبة", link: "/comptabilite",
    groups: [
      {
        title: "Nos prestations",
        links: [
          { icon: Calculator, label: "Expert-comptable", desc: "Tenue complète de vos comptes", href: "/comptabilite" },
          { icon: FileText, label: "Déclarations fiscales", desc: "TVA, IS, IR, taxe professionnelle", href: "/comptabilite#prestations" },
          { icon: Users, label: "Paie et CNSS", desc: "Bulletins et déclarations", href: "/comptabilite#prestations" },
          { icon: TrendingUp, label: "Bilan annuel", desc: "Bilan et liasse fiscale", href: "/comptabilite#prestations" },
        ],
      },
      {
        title: "Formules", side: true,
        links: [
          { icon: Zap, label: "Auto-entrepreneur", href: "/comptabilite#formules" },
          { icon: Building2, label: "SARLAU et SARL", href: "/comptabilite#formules" },
          { icon: BarChart3, label: "Sur mesure", href: "/comptabilite#formules" },
        ],
      },
    ],
  },
  { name: "Packs", link: "/packs", highlight: true },
  { name: "Tarifs", link: "/tarifs" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Mziane, accueil"
      className={cn("shrink-0 text-2xl font-extrabold tracking-tight", dark ? "text-white" : "text-zinc-900")}
    >
      Mziane<span className="text-blue-500">.</span>
    </Link>
  );
}

function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const main = item.groups!.find((g) => !g.side)!;
  const side = item.groups!.find((g) => g.side);
  return (
    <div className="grid gap-8 p-8 lg:grid-cols-[1fr_290px]">
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-[.1em] text-zinc-500">{main.title}</span>
          {item.ar && <Ar className="text-sm">{item.ar}</Ar>}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {main.links.map(({ icon: Icon, label, desc, href }) => (
            <Link key={label} href={href} onClick={onNavigate} className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-zinc-50">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-zinc-900">{label}</span>
                {desc && <span className="block text-sm text-zinc-500">{desc}</span>}
              </span>
            </Link>
          ))}
        </div>
      </div>
      {side && (
        <div className="border-l border-zinc-200 pl-8">
          <div className="mb-4 text-xs font-bold uppercase tracking-[.1em] text-zinc-500">{side.title}</div>
          <div className="grid gap-1">
            {side.links.map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href} onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-zinc-900 transition hover:bg-zinc-50 hover:text-blue-700">
                <Icon className="h-4.5 w-4.5 text-blue-700" /> {label}
              </Link>
            ))}
          </div>
          <Link href={item.link} onClick={onNavigate} className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-bold text-blue-700">
            Tout voir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// En-tête "pilule flottante" avec menus déroulants
export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const clearTimers = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
  };
  const open = (name: string) => {
    clearTimers();
    setOpenMenu(name);
  };
  // Au survol, petit délai avant d'ouvrir un panneau (aucun délai si un panneau est déjà ouvert) :
  // évite les ouvertures accidentelles quand la souris traverse la barre (recommandation NN/g).
  const hoverOpen = (name: string) => {
    clearTimers();
    if (openMenu) setOpenMenu(name);
    else openTimer.current = setTimeout(() => setOpenMenu(name), 200);
  };
  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  };
  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const current = navItems.find((i) => i.name === openMenu && i.groups);

  return (
    <header className={cn("sticky top-0 z-50 px-4 transition-[padding] duration-300", scrolled ? "pt-2" : "pt-4")}>
      <nav
        onMouseLeave={scheduleClose}
        className={cn(
          "relative mx-auto max-w-[1240px] bg-white rounded-full flex items-center justify-between gap-3 px-5 transition-all duration-300",
          scrolled
            ? "py-2 shadow-[0_12px_32px_rgba(15,23,42,.12),0_1px_3px_rgba(15,23,42,.06)]"
            : "py-2.5 shadow-[0_8px_24px_rgba(15,23,42,.08),0_1px_3px_rgba(15,23,42,.04)]"
        )}
      >
        <Logo />

        <div className="hidden xl:flex flex-1 items-center justify-center gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.link;
            const isOpen = openMenu === item.name;
            return item.groups ? (
              <button
                key={item.name}
                type="button"
                aria-expanded={isOpen}
                onMouseEnter={() => hoverOpen(item.name)}
                onClick={() => (isOpen ? setOpenMenu(null) : open(item.name))}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[15px] whitespace-nowrap transition-colors",
                  isOpen ? "bg-zinc-50 text-blue-700" : "hover:text-blue-700",
                  active ? "font-semibold text-blue-700" : "font-medium text-zinc-900"
                )}
              >
                {item.name}
                <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", isOpen && "rotate-180 text-blue-700")} />
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.link}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => { clearTimers(); setOpenMenu(null); }}
                className={cn(
                  "rounded-full px-2.5 py-2 text-[15px] whitespace-nowrap transition-colors",
                  item.highlight
                    ? cn("mx-1 bg-amber-100 px-3.5 font-bold text-zinc-900 ring-1 ring-amber-300 hover:bg-amber-200", active && "bg-amber-200")
                    : cn("hover:text-blue-700", active ? "font-semibold text-blue-700" : "font-medium text-zinc-900"),
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/connexion"
            className={cn("hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors hover:bg-zinc-50", pathname === "/connexion" ? "text-blue-700" : "text-zinc-900")}
          >
            <CircleUserRound className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="xl:sr-only 2xl:not-sr-only">Espace client</span>
          </Link>
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-bold text-white whitespace-nowrap bg-blue-700 hover:bg-blue-800 shadow-[0_10px_20px_-8px_rgba(0,105,122,.5)] transition-colors"
          >
            Commencer
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-full text-zinc-900 hover:bg-zinc-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {current && (
          <div
            onMouseEnter={() => open(current.name)}
            className="absolute inset-x-0 top-full hidden pt-3 xl:block"
          >
            <div className="animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_60px_-20px_rgba(31,42,61,.3)] duration-200">
              <MegaPanel item={current} onNavigate={closeAll} />
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="xl:hidden mx-auto mt-2 max-h-[calc(100vh-110px)] max-w-[1240px] overflow-y-auto rounded-3xl bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,.12)]">
          {navItems.map((item) =>
            item.groups ? (
              <div key={item.name} className="border-b border-zinc-100">
                <button
                  type="button"
                  aria-expanded={mobileSection === item.name}
                  onClick={() => setMobileSection(mobileSection === item.name ? null : item.name)}
                  className="flex w-full items-center justify-between py-3 font-semibold text-zinc-900"
                >
                  <span>{item.name}{item.ar && <Ar className="text-sm">{item.ar}</Ar>}</span>
                  <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", mobileSection === item.name && "rotate-180")} />
                </button>
                {mobileSection === item.name && (
                  <div className="grid gap-1 pb-3">
                    {item.groups.flatMap((g) => g.links).map(({ icon: Icon, label, href }) => (
                      <Link key={label + href} href={href} onClick={closeAll} className="flex items-center gap-3 rounded-xl px-2 py-2 text-[15px] text-zinc-700 hover:bg-zinc-50">
                        <Icon className="h-4 w-4 text-blue-700" /> {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.name} href={item.link} onClick={closeAll} className="flex items-center justify-between border-b border-zinc-100 py-3 font-semibold text-zinc-900">
                {item.name}
                {item.highlight && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">Création offerte</span>}
              </Link>
            )
          )}
          <Link href="/connexion" onClick={closeAll} className="flex items-center gap-2 py-3 font-semibold text-zinc-900">
            <CircleUserRound className="h-4.5 w-4.5" /> Espace client
          </Link>
          <a
            href={waLink("Bonjour, je souhaite créer mon entreprise et connaître les aides auxquelles j'ai droit.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-3 font-semibold text-zinc-900"
          >
            <WhatsAppIcon className="h-4.5 w-4.5 text-[#128C4B]" /> WhatsApp {CONTACT.whatsappDisplay}
          </a>
          <Link href="/onboarding" onClick={closeAll} className="mt-2 block rounded-full bg-blue-700 py-3 text-center font-bold text-white hover:bg-blue-800">
            Trouver ma solution
          </Link>
        </div>
      )}
    </header>
  );
}
