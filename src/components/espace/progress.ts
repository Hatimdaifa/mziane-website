// Pièces attendues pour un dossier et état d'avancement.
// Les réponses au questionnaire guidé (intake.ts) retirent les pièces inutiles, rendent obligatoires
// celles qui deviennent nécessaires et remplissent les informations écrites.
import { docsForOrder, type DocRequirement, type ServiceDocs } from "@/lib/documents";
import { coverFor, parseAnswers, ruleFor, withDefaults, type Ctx } from "@/lib/intake";
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
  /** Signée en ligne dans l'espace (pouvoir, mandat...) */
  signed?: boolean;
}

export interface GroupState { key: string; title: string; titleAr: string; items: ReqState[] }

const ctxOf = (d: Dossier): Ctx => ({ email: d.summary.contact?.email ?? "", phone: d.summary.contact?.tel ?? "", fullName: d.summary.contact?.nom ?? "" });

/** @param signed ids des pièces remplacées par un document signé en ligne */
export function requirementGroups(dossier: Dossier, docs: DocFile[], answers: Answer[], signed: string[] = []): GroupState[] {
  const base = docsForOrder({ ...dossier.spec });
  const qa = withDefaults(base.map((g) => g.key), parseAnswers(answers));
  const ctx = ctxOf(dossier);
  const extra: ServiceDocs[] = dossier.extra_docs.length
    ? [{ key: EXTRA_KEY, title: "Demandés par votre conseiller", titleAr: "وثائق إضافية", docs: dossier.extra_docs.map((d) => ({ id: d.id, label: d.label, labelAr: "", hint: d.hint })) }]
    : [];
  return [...extra, ...base].map((g) => ({
    key: g.key,
    title: g.title,
    titleAr: g.titleAr,
    items: g.docs.flatMap((original) => {
      const rule = ruleFor(g.key, original.id, qa);
      if (rule === false) return [];
      // Demandée d'après les réponses : plus de condition à interpréter
      const req: DocRequirement = rule === true ? { ...original, condition: undefined, optional: false } : original;
      const files = docs.filter((d) => !d.from_mziane && d.requirement_id === req.id);
      const covered = req.kind === "info" ? coverFor(g.key, req.id, qa, ctx) : undefined;
      const written = answers.find((a) => a.requirement_id === req.id && a.value.trim());
      const answer = written ?? (covered ? { dossier_id: dossier.id, requirement_id: req.id, user_id: dossier.user_id, value: covered, updated_at: "" } : undefined);
      const isSigned = signed.includes(req.id);
      const redo = files.length > 0 && files.every((f) => f.status === "a_refaire");
      const done = req.kind === "rdv" || isSigned || (!redo && (files.length > 0 || !!answer));
      return [{ req, files, answer, required: !req.condition && !req.optional && req.kind !== "rdv", done, redo, signed: isSigned }];
    }),
  })).filter((g) => g.items.length);
}

export function progress(groups: GroupState[]) {
  const required = groups.flatMap((g) => g.items).filter((i) => i.required);
  const done = required.filter((i) => i.done).length;
  return { done, total: required.length, redo: groups.flatMap((g) => g.items).filter((i) => i.redo).length };
}
