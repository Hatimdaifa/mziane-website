"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Context ─────────────────────────────────────────────────────────────────
const NavbarContext = createContext<{ scrolled: boolean }>({ scrolled: false });

// ── Navbar (root) ────────────────────────────────────────────────────────────
export function Navbar({ children, className }: { children: React.ReactNode; className?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <NavbarContext.Provider value={{ scrolled }}>
      <div
        className={cn(
          "sticky top-0 z-50 flex justify-center transition-all duration-300",
          scrolled ? "pt-3 pb-1" : "pt-0 pb-0",
          className
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-300",
            scrolled
              ? "max-w-5xl mx-4 rounded-full border-2 border-zinc-900 bg-[#FAFAF7]/95 backdrop-blur-md shadow-[4px_4px_0px_0px] shadow-zinc-900 px-5"
              : "max-w-7xl mx-auto border-b-2 border-zinc-900 bg-[#FAFAF7]/90 backdrop-blur-sm px-6"
          )}
        >
          {children}
        </div>
      </div>
    </NavbarContext.Provider>
  );
}

// ── NavBody (desktop) ────────────────────────────────────────────────────────
export function NavBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("hidden md:flex items-center justify-between h-14", className)}>
      {children}
    </div>
  );
}

// ── NavItems ─────────────────────────────────────────────────────────────────
export function NavItems({
  items,
  className,
}: {
  items: { name: string; link: string }[];
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center gap-4", className)}>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.link}
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

// ── NavbarLogo ────────────────────────────────────────────────────────────────
export function NavbarLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
        <Building2 className="w-4 h-4 text-amber-400" />
      </div>
      <span className="text-xl font-black tracking-tight text-zinc-900">Mziane</span>
    </Link>
  );
}

// ── NavbarButton ──────────────────────────────────────────────────────────────
export function NavbarButton({
  children,
  variant = "primary",
  className,
  onClick,
  href,
  asChild,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  href?: string;
  asChild?: boolean;
}) {
  const base = cn(
    "inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 whitespace-nowrap",
    variant === "primary"
      ? "bg-zinc-900 text-white border-zinc-900 shadow-[3px_3px_0px_0px] shadow-amber-400 hover:shadow-[5px_5px_0px_0px] hover:translate-x-[-1px] hover:translate-y-[-1px]"
      : "bg-transparent text-zinc-700 border-zinc-300 hover:border-zinc-900 hover:text-zinc-900",
    className
  );

  if (href) {
    return <Link href={href} className={base} onClick={onClick}>{children}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}

// ── MobileNav ─────────────────────────────────────────────────────────────────
export function MobileNav({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative md:hidden", className)}>
      {children}
    </div>
  );
}

// ── MobileNavHeader ───────────────────────────────────────────────────────────
export function MobileNavHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between h-14", className)}>
      {children}
    </div>
  );
}

// ── MobileNavToggle ───────────────────────────────────────────────────────────
export function MobileNavToggle({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      className={cn(
        "w-9 h-9 flex items-center justify-center border-2 border-zinc-900 rounded-full bg-white hover:bg-amber-50 transition-colors",
        className
      )}
    >
      {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
    </button>
  );
}

// ── MobileNavMenu ─────────────────────────────────────────────────────────────
export function MobileNavMenu({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full left-0 right-0 mt-1 overflow-hidden transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        className
      )}
    >
      <div className="bg-[#FAFAF7] border-2 border-zinc-900 rounded-2xl shadow-[4px_4px_0px_0px] shadow-zinc-900 p-5 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
