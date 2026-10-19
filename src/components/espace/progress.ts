// Pièces attendues pour un dossier et état d'avancement.
import { docsForOrder, type DocRequirement, type ServiceDocs } from "@/lib/documents";
import type { Answer, DocFile, Dossier } from "@/lib/espace";

export const EXTRA_KEY = "conseiller";

export interface ReqState {
  req: DocRequirement;
  files: DocFile[];
  answer?: Answer;
  /** Pièce demandée sans condition */
  required: boolean;
  done: boolean;
  redo: boolean;
}

export interface GroupState { key: string; title: string; titleAr: string; items: ReqState[] }

export function requirementGroups(dossier: Dossier, docs: DocFile[], answers: Answer[]): GroupState[] {
  const base = docsForOrder({ ...dossier.spec });
  const extra: ServiceDocs[] = dossier.extra_docs.length
    ? [{ key: EXTRA_KEY, title: "Demandés par votre conseiller", titleAr: "وثائق إضافية", docs: dossier.extra_docs.map((d) => ({ id: d.id, label: d.label, labelAr: "", hint: d.hint })) }]
    : [];
  return [...extra, ...base].map((g) => ({
    key: g.key,
    title: g.title,
    titleAr: g.titleAr,
    items: g.docs.map((req) => {
      const files = docs.filter((d) => !d.from_mziane && d.requirement_id === req.id);
      const answer = answers.find((a) => a.requirement_id === req.id && a.value.trim());
      const redo = files.length > 0 && files.every((f) => f.status === "a_refaire");
      const done = req.kind === "rdv" || (!redo && (files.length > 0 || !!answer));
      return { req, files, answer, required: !req.condition && !req.optional && req.kind !== "rdv", done, redo };
    }),
  }));
}

export function progress(groups: GroupState[]) {
  const required = groups.flatMap((g) => g.items).filter((i) => i.required);
  const done = required.filter((i) => i.done).length;
  return { done, total: required.length, redo: groups.flatMap((g) => g.items).filter((i) => i.redo).length };
}
