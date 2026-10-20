"use client";

// Un champ du questionnaire guidé : texte, nombre, date, choix, oui/non, trois noms, liste de personnes.
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Field, Person, QValue } from "@/lib/intake";

const input = "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";

export function FieldInput({ field: f, value, onChange, invalid }: { field: Field; value: QValue | undefined; onChange: (v: QValue) => void; invalid?: boolean }) {
  const id = `q-${f.id}`;
  const v = typeof value === "string" ? value : "";
  return (
    <div className="grid gap-2">
      <label htmlFor={f.type === "yesno" || f.type === "select" ? undefined : id} id={`${id}-label`} className="font-semibold text-zinc-900">
        {f.label}{f.optional && <span className="font-normal text-zinc-500"> (facultatif)</span>}
      </label>
      {f.hint && <p className="-mt-1 text-[13px] leading-snug text-zinc-500">{f.hint}</p>}

      {f.type === "text" && <input id={id} className={cn(input, invalid && "border-red-400")} value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />}
      {f.type === "number" && <input id={id} inputMode="numeric" className={cn(input, invalid && "border-red-400")} value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, ""))} />}
      {f.type === "date" && <input id={id} type="date" className={cn(input, invalid && "border-red-400")} value={v} onChange={(e) => onChange(e.target.value)} />}
      {f.type === "textarea" && <textarea id={id} rows={3} maxLength={1500} className={cn(input, invalid && "border-red-400")} value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />}

      {(f.type === "yesno" || f.type === "select") && (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className={cn("grid gap-2", f.type === "yesno" ? "grid-cols-2 sm:max-w-sm" : (f.options?.length ?? 0) > 2 && "sm:grid-cols-2")}>
          {(f.type === "yesno" ? [{ v: "oui", l: "Oui" }, { v: "non", l: "Non" }] : f.options ?? []).map((o) => (
            <button key={o.v} type="button" role="radio" aria-checked={v === o.v} onClick={() => onChange(o.v)}
              className={cn("rounded-xl border-2 px-4 py-3 text-left text-[15px] font-semibold transition", v === o.v ? "border-blue-700 bg-blue-50 text-blue-900" : cn("bg-white text-zinc-800 hover:border-blue-500", invalid ? "border-red-300" : "border-zinc-200"))}>
              {o.l}
            </button>
          ))}
        </div>
      )}

      {f.type === "names3" && <Names3 id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} invalid={invalid} />}
      {f.type === "persons" && <Persons field={f} value={Array.isArray(value) ? (value as Person[]) : []} onChange={onChange} invalid={invalid} />}
    </div>
  );
}

function Names3({ id, value, onChange, invalid }: { id: string; value: string[]; onChange: (v: string[]) => void; invalid?: boolean }) {
  const names = [0, 1, 2].map((i) => value[i] ?? "");
  return (
    <div className="grid gap-2">
      {names.map((n, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">{i + 1}</span>
          <input id={i === 0 ? id : undefined} aria-label={`Nom ${i + 1}`} className={cn(input, invalid && i === 0 && "border-red-400")} value={n} placeholder={i === 0 ? "Votre premier choix" : "Autre choix (facultatif)"}
            onChange={(e) => { const next = [...names]; next[i] = e.target.value; onChange(next); }} />
        </div>
      ))}
    </div>
  );
}

function Persons({ field: f, value, onChange, invalid }: { field: Field; value: Person[]; onChange: (v: Person[]) => void; invalid?: boolean }) {
  const rows: Person[] = value.length ? value : [{ nom: "", piece: "", nationalite: "marocaine", parts: "" }];
  const set = (i: number, patch: Partial<Person>) => onChange(rows.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const word = f.person ?? "personne";
  return (
    <div className="grid gap-3">
      {rows.map((p, i) => (
        <fieldset key={i} className={cn("grid gap-2 rounded-2xl border bg-zinc-50/60 p-3.5", invalid && !p.nom.trim() ? "border-red-300" : "border-zinc-200")}>
          <legend className="sr-only">{word} {i + 1}</legend>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold capitalize text-zinc-700">{word} {i + 1}</span>
            {rows.length > 1 && (
              <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label={`Retirer ${word} ${i + 1}`} className="rounded-lg p-1.5 text-zinc-400 hover:bg-white hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <input aria-label="Nom et prénom ou raison sociale" className={input} placeholder="Nom et prénom (ou nom de la société)" value={p.nom} onChange={(e) => set(i, { nom: e.target.value })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input aria-label="Numéro de CIN ou de passeport" className={input} placeholder="N° CIN ou passeport" value={p.piece} onChange={(e) => set(i, { piece: e.target.value })} />
            <input aria-label="Part" className={input} placeholder="Part (ex. 50 % ou 5 000 DH)" value={p.parts ?? ""} onChange={(e) => set(i, { parts: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-zinc-700">
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-blue-700" checked={p.nationalite === "etrangere"} onChange={(e) => set(i, { nationalite: e.target.checked ? "etrangere" : "marocaine" })} /> Nationalité étrangère</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-blue-700" checked={!!p.societe} onChange={(e) => set(i, { societe: e.target.checked })} /> C&apos;est une société</label>
          </div>
        </fieldset>
      ))}
      <button type="button" onClick={() => onChange([...rows, { nom: "", piece: "", nationalite: "marocaine", parts: "" }])}
        className="inline-flex items-center gap-2 self-start rounded-xl border border-dashed border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:border-blue-500 hover:text-blue-700">
        <Plus className="h-4 w-4" aria-hidden /> Ajouter un {word}
      </button>
      {f.min && f.min > 1 && <p className="text-[13px] text-zinc-500">Au moins {f.min} {word}s.</p>}
    </div>
  );
}
