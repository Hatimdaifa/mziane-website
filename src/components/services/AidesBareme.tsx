// Barème des honoraires sur les aides, expliqué par tranches avec des exemples calculés.
import { AIDES_BAREME, AIDES_PETITE_TXT, AIDES_PLAFOND, feeAide, fmt, fmtDH } from "@/lib/offers";

const pct = (r: number) => `${fmt(r * 100)} %`;

function tranches(amount: number) {
  const out: { from: number; to: number; rate: number; fee: number }[] = [];
  let prev = 0;
  for (const [top, rate] of AIDES_BAREME) {
    if (amount <= prev) break;
    const to = Math.min(amount, top);
    out.push({ from: prev, to, rate, fee: (to - prev) * rate });
    prev = top;
  }
  return out;
}

export default function AidesBareme({ exemples = [30_000, 300_000] }: { exemples?: number[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="mb-4 font-bold text-zinc-900">Un pourcentage par tranche, comme l&apos;impôt</p>
        <ul className="grid gap-2">
          {AIDES_BAREME.map(([top, rate], i) => {
            const from = i === 0 ? 0 : AIDES_BAREME[i - 1][0];
            const label = i === 0 ? `Jusqu'à ${fmtDH(top)}` : top === Infinity ? `Au-delà de ${fmtDH(from)}` : `De ${fmtDH(from)} à ${fmtDH(top)}`;
            return (
              <li key={top} className="flex items-baseline justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 text-[15px]">
                <span className="text-zinc-700">{label}</span>
                <span className="text-lg font-extrabold text-zinc-900 tabular-nums">{pct(rate)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          Calculé sur l&apos;aide réellement versée. {AIDES_PETITE_TXT}, plafond {`${fmtDH(AIDES_PLAFOND)} HT. Payé seulement après le versement. 0 DH si l'aide est refusée.`}
        </p>
      </div>

      <div className="grid gap-4">
        {exemples.map((amount) => {
          const t = tranches(amount);
          const total = feeAide(amount);
          return (
            <div key={amount} className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-semibold text-blue-700">Exemple</p>
              <p className="mt-1 text-lg font-bold text-zinc-900">Vous recevez une aide de {fmtDH(amount)}</p>
              <ul className="mt-3 grid gap-1 text-[15px] text-zinc-600 tabular-nums">
                {t.map((x) => (
                  <li key={x.from} className="flex justify-between gap-4">
                    <span>{pct(x.rate)} de {fmtDH(x.to - x.from)}</span>
                    <span>{fmtDH(x.fee)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-3">
                <span className="font-semibold text-zinc-900">Nos honoraires</span>
                <span className="text-xl font-extrabold text-zinc-900 tabular-nums">{fmtDH(total)} HT</span>
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Soit {`${(total / amount * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % de l'aide`}
                {total !== t.reduce((s, x) => s + x.fee, 0) ? ` (minimum ou plafond appliqué)` : ""}. TVA 20 % en sus.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
