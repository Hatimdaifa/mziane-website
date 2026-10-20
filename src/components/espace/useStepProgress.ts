"use client";

// Étapes cochées : en base (table dossier_steps) pour un dossier, sinon dans ce navigateur.
// Si la table n'existe pas encore (migration 20261020 non appliquée), on garde les coches dans ce navigateur.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const localKey = (scope: string) => `mziane-etapes:${scope}`;

function readLocal(scope: string): string[] {
  try { return JSON.parse(localStorage.getItem(localKey(scope)) ?? "[]"); } catch { return []; }
}
function writeLocal(scope: string, keys: Set<string>) {
  try { localStorage.setItem(localKey(scope), JSON.stringify([...keys])); } catch { /* stockage indisponible */ }
}

export function useStepProgress(dossierId: string | null, userId?: string) {
  const scope = dossierId ?? "bibliotheque";
  const [done, setDone] = useState<Set<string>>(new Set());
  const [local, setLocal] = useState(!dossierId);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let off = false;
    (async () => {
      if (!dossierId) { setDone(new Set(readLocal(scope))); return; }
      const { data, error } = await supabase().from("dossier_steps").select("step_key,done").eq("dossier_id", dossierId);
      if (off) return;
      if (error) {
        setLocal(true);
        setDone(new Set(readLocal(scope)));
        return;
      }
      setDone(new Set((data ?? []).filter((r) => r.done).map((r) => r.step_key as string)));
    })();
    return () => { off = true; };
  }, [dossierId, scope]);

  const toggle = useCallback(async (key: string, value: boolean) => {
    const next = new Set(done);
    if (value) next.add(key); else next.delete(key);
    setError("");
    if (local || !dossierId) {
      setDone(next);
      writeLocal(scope, next);
      return;
    }
    setBusy(key);
    const { error } = await supabase().from("dossier_steps").upsert({ dossier_id: dossierId, step_key: key, done: value, done_by: userId ?? null, updated_at: new Date().toISOString() });
    setBusy("");
    if (error) { setError("Enregistrement impossible, réessayez."); return; }
    setDone(next);
  }, [done, local, dossierId, scope, userId]);

  return { done, toggle, busy, error, local };
}
