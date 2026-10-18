"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Création", link: "/creation-entreprise" },
  { name: "Aides et subventions", link: "/aides" },
  { name: "Gestion de société", link: "/gestion" },
  { name: "Comptabilité", link: "/comptabilite" },
  { name: "Tarifs", link: "/tarifs" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
        <Building2 className="w-4.5 h-4.5 text-amber-400" />
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", dark ? "text-white" : "text-zinc-900")}>
        Mziane
      </span>
    </Link>
  );
}

// En-tête "pilule flottante" (même construction que Hoplion)
export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 px-4 transition-[padding] duration-300", scrolled ? "pt-2" : "pt-4")}>
      <nav
        className={cn(
          "mx-auto max-w-[1180px] bg-white rounded-full flex items-center justify-between gap-6 px-5 transition-all duration-300",
          scrolled
            ? "py-2 shadow-[0_12px_32px_rgba(15,23,42,.12),0_1px_3px_rgba(15,23,42,.06)]"
            : "py-2.5 shadow-[0_8px_24px_rgba(15,23,42,.08),0_1px_3px_rgba(15,23,42,.04)]"
        )}
      >
        <Logo />

        <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "relative text-[15px] whitespace-nowrap transition-colors hover:text-blue-700",
                  "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-0.5 after:rounded after:bg-blue-500 after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                  active ? "text-blue-700 font-semibold after:scale-x-100" : "text-zinc-900 font-medium"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="mailto:contact@mziane.com"
            className="hidden lg:inline-flex px-4 py-2 rounded-full text-sm font-bold text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            Contact
          </a>
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_10px_20px_-8px_rgba(0,132,153,.5)] transition-colors"
          >
            Démarrer mon projet
          </Link>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full text-zinc-900 hover:bg-zinc-50"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden mx-auto max-w-[1180px] mt-2 bg-white rounded-3xl p-5 shadow-[0_12px_32px_rgba(15,23,42,.12)] flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.link} href={item.link} onClick={() => setOpen(false)} className="py-2.5 font-semibold text-zinc-900 border-b border-zinc-100">
              {item.name}
            </Link>
          ))}
          <a href="mailto:contact@mziane.com" className="py-2.5 font-semibold text-zinc-900">Contact</a>
          <Link href="/onboarding" onClick={() => setOpen(false)} className="mt-2 text-center py-3 rounded-full font-bold text-white bg-blue-600">
            Démarrer mon projet
          </Link>
        </div>
      )}
    </header>
  );
}
