"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navbar, NavBody, NavItems, MobileNav,
  NavbarLogo, NavbarButton, MobileNavHeader,
  MobileNavToggle, MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Création d'entreprise", link: "/creation-entreprise" },
  { name: "Comptabilité", link: "/comptabilite" },
  { name: "Non-résidents & MRE", link: "/non-residents" },
  { name: "Tarifs", link: "/tarifs" },
];

export default function SiteNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-3">
          <NavbarButton variant="primary" href="/onboarding">
            Démarrer mon projet →
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-700 font-semibold hover:text-zinc-900 transition-colors py-1"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t-2 border-zinc-100">
            <NavbarButton variant="secondary" href="/tarifs" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
              Voir les tarifs
            </NavbarButton>
            <NavbarButton variant="primary" href="/onboarding" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
              Démarrer mon projet →
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
