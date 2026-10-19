// Petits utilitaires côté navigateur : brouillons (localStorage) et détection du rendu client.
import { useSyncExternalStore } from "react";

export function readJSON<T>(key: string): T | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible (navigation privée, quota) : on continue sans brouillon */
  }
}

export function removeKey(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* rien */
  }
}

const noop = () => () => {};

/** false pendant le rendu serveur et l'hydratation, true ensuite : permet de lire localStorage sans écart d'hydratation. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
