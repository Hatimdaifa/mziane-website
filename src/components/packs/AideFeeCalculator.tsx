"use client";

// Petit calculateur des honoraires sur une aide versée (barème marginal, plafond, minimum).
import { useId, useState } from "react";
import { AIDES_BAREME, AIDES_PETITE_TXT, AIDES_PLAFOND, type AideMode, fmt, fmtDH, feeAide } from "@/lib/offers";
import { Toggle } from "./Tablist";

const PRESETS = [30_000, 100_000, 300_000, 1_000_000];

export function BaremeTable() {
  return (
    <table className="w-full border-collapse text-left text-[14px]">
      <caption className="sr-only">Barème des honoraires sur l&apos;aide versée</caption>
      <thead>
        <tr className="border-b border-zinc-200 text-zinc-500">
          <th scope="col" className="py-2 font-semibold">Part de l&apos;aide versée</th>
          <th scope="col" className="py-2 text-right font-semibold">Taux</th>
        </tr>
      </thead>
      <tbody>
        {AIDES_BAREME.map(([top, rate], n) => {
          const from = n === 0 ? 0 : AIDES_BAREME[n - 1][0];
          return (
            <tr key={top} className="border-b border-zinc-100">
              <td className="py-2 text-zinc-700">{top === Infinity ? `Au-delà de ${fmtDH(from)}` : from === 0 ? `Jusqu'à ${fmtDH(top)}` : `De ${fmt(from)} à ${fmtDH(top)}`}</td>
              <td className="py-2 text-right font-bold text-zinc-900 tabular-nums">{Math.round(rate * 100)} %</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function AideFeeCalculator() {
  const id = useId();
  const [amount, setAmount] = useState(100_000);
  const [mode, setMode] = useState<AideMode>("standard");
  const fee = amount > 0 ? feeAide(amount, mode) : 0;
  const pct = amount > 0 ? (fee / amount) * 100 : 0;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <h3 className="text-lg font-bold text-zinc-900">Calculez nos honoraires</h3>
      <p className="mt-1 text-[14px] text-zinc-600">Sur le montant réellement versé. Rien si l&apos;aide est refusée.</p>
      <div className="mt-4">
        <Toggle
          label="Type de dossier"
          value={mode}
          onChange={setMode}
          options={[{ id: "standard", label: "Entreprise" }, { id: "agri", label: "Agriculteur" }]}
        />
      </div>
      <label htmlFor={id} className="mt-5 block text-sm font-semibold text-zinc-800">Montant de l&apos;aide versée (DH)</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={1000}
        value={amount || ""}
        onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1.5 h-12 w-full rounded-xl border border-zinc-300 px-4 text-lg font-semibold tabular-nums text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p} type="button" onClick={() => setAmount(p)} className="rounded-full bg-zinc-100 px-3 py-1 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">
            {fmtDH(p)}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-5 rounded-2xl bg-amber-100 p-4">
        <p className="text-sm text-amber-900">Nos honoraires</p>
        <p className="text-3xl font-extrabold tabular-nums text-zinc-900">{fmtDH(fee)} HT</p>
        {amount > 0 && <p className="text-[13px] text-amber-900">soit {pct.toFixed(1).replace(".", ",")} % de l&apos;aide. Vous gardez {fmtDH(amount - fee)}.</p>}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">
        {AIDES_PETITE_TXT}, plafond {fmtDH(AIDES_PLAFOND)} par dossier.
      </p>
    </div>
  );
}
