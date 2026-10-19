"use client";

// Onglets accessibles (motif WAI-ARIA Tabs, activation automatique) :
// flèches gauche/droite, Début/Fin, tabindex itinérant, focus visible.
import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> { id: T; label: string; icon?: LucideIcon }

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string) => `${prefix}-panel`;

export function Tablist<T extends string>({ items, active, onChange, label, idPrefix, className }: {
  items: TabItem<T>[]; active: T; onChange: (id: T) => void; label: string; idPrefix: string; className?: string;
}) {
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, n: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (n + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (n - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = items[next].id;
    onChange(id);
    document.getElementById(tabId(idPrefix, id))?.focus();
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="flex max-w-full gap-1 rounded-3xl bg-zinc-100 p-1.5 max-md:overflow-x-auto max-md:[scrollbar-width:none] md:flex-wrap md:justify-center"
      >
        {items.map(({ id, label: l, icon: Icon }, n) => {
          const on = active === id;
          return (
            <button
              key={id}
              id={tabId(idPrefix, id)}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={panelId(idPrefix)}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(id)}
              onKeyDown={(e) => onKeyDown(e, n)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100",
                on ? "bg-blue-700 text-white shadow-sm" : "text-zinc-700 hover:bg-white hover:text-zinc-900",
              )}
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden />} {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Bascule à deux positions (boutons à état). */
export function Toggle<T extends string>({ options, value, onChange, label }: {
  options: { id: T; label: string; hint?: string }[]; value: T; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full bg-zinc-100 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
            value === o.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
          )}
        >
          {o.label}
          {o.hint && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}
