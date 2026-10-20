// Documents à signer dans l'espace client, pré-remplis avec les réponses du questionnaire.
// Signature électronique simple (loi 43-20) : dessin + acceptation + numéro de téléphone vérifié par SMS quand c'est possible.
// Elle vaut entre le client et Mziane (mandat, pouvoir). Un acte que l'administration veut légalisé
// (procuration d'un MRE, par exemple) reste à signer à la main : il est seulement pré-rempli ici.
import type { Dossier } from "@/lib/espace";
import { docsForOrder } from "@/lib/documents";
import { list, str, type Ctx, type QA } from "@/lib/intake";

export interface SignDoc {
  key: string;
  title: string;
  /** Pourquoi on le demande, en une phrase */
  why: string;
  paragraphs: string[];
  /** Signé en ligne, ou seulement pré-rempli pour une signature légalisée */
  mode: "online" | "legalise";
  /** Pièce de documents.ts que ce document remplace une fois signé */
  replaces?: string;
}

export interface Signature {
  id: string;
  dossier_id: string;
  user_id: string;
  doc_key: string;
  title: string;
  content: string;
  content_hash: string;
  signer_name: string;
  signer_phone: string;
  phone_verified: boolean;
  signature_png: string;
  user_agent: string;
  signed_at: string;
}

const blank = "________________";

function identity(a: QA, c: Ctx) {
  const nom = str(a, "id-nom") || c.fullName || blank;
  const naissance = str(a, "id-naissance") ? `né(e) le ${new Date(str(a, "id-naissance")).toLocaleDateString("fr-FR")}, ` : "";
  return `${nom}, ${naissance}titulaire de la pièce d'identité n° ${str(a, "id-piece") || blank}, demeurant ${[str(a, "id-adresse"), str(a, "id-ville")].filter(Boolean).join(", ") || blank}`;
}

const CREATION = ["sarlau", "sarl", "sas", "sa", "cooperative"];

export function signDocsFor(dossier: Dossier, a: QA, c: Ctx): SignDoc[] {
  const keys = docsForOrder(dossier.spec).map((g) => g.key);
  const who = identity(a, c);
  const out: SignDoc[] = [{
    key: "mandat",
    title: "Mandat de représentation",
    why: "Il nous autorise à faire les démarches à votre place auprès des administrations.",
    mode: "online",
    paragraphs: [
      `Je soussigné(e) ${who}, donne mandat à Mziane pour accomplir en mon nom et pour mon compte les démarches suivantes : ${dossier.title} (référence ${dossier.reference}).`,
      "À ce titre, Mziane peut : préparer et déposer les dossiers auprès des administrations et organismes concernés (OMPIC, Direction générale des impôts, tribunal de commerce, CNSS, centre régional d'investissement et tout autre organisme nécessaire) ; demander et retirer les documents délivrés ; payer pour mon compte les frais officiels annoncés, qui me sont refacturés au réel ; échanger avec ces organismes au sujet du dossier.",
      "Ce mandat ne permet pas à Mziane de signer à ma place un acte qui m'engage (statuts, contrat, procès-verbal) : ces actes me sont soumis pour signature.",
      "Je certifie que les informations et les documents fournis dans mon espace client sont exacts et à jour, et je m'engage à signaler tout changement.",
      "Ce mandat prend fin à la livraison des démarches commandées, ou plus tôt sur simple demande écrite de ma part.",
    ],
  }];

  const creation = keys.find((k) => CREATION.includes(k));
  const jeSuisGerant = a["soc-gerant-unique"] === "oui" || str(a, "soc-gerant") === "moi";
  if (creation && jeSuisGerant) {
    const nom = list(a, "soc-noms")[0] || list(a, "coop-noms")[0] || blank;
    const role = creation === "sas" ? "président" : creation === "cooperative" ? "président du conseil d'administration" : "gérant";
    out.push({
      key: "declaration-gerant",
      title: `Déclaration sur l'honneur du ${role}`,
      why: "Demandée pour immatriculer la société : elle confirme que vous pouvez la diriger.",
      mode: "online",
      paragraphs: [
        `Je soussigné(e) ${who}, futur ${role} de la société « ${nom} » en cours de constitution, déclare sur l'honneur :`,
        "ne faire l'objet d'aucune interdiction de gérer, d'aucune déchéance commerciale ni d'aucune condamnation m'interdisant de diriger une société ;",
        "ne pas exercer de fonction incompatible avec la direction d'une société commerciale ;",
        `accepter les fonctions de ${role}.`,
      ],
    });
  }

  if (keys.includes("marque")) {
    const societe = str(a, "m-deposant") === "societe";
    out.push({
      key: "pouvoir-marque",
      title: "Pouvoir pour le dépôt de marque",
      why: "L'OMPIC demande un pouvoir quand un mandataire dépose la marque pour vous.",
      mode: "online",
      replaces: "pouvoir-marque",
      paragraphs: [
        `Je soussigné(e) ${who}${societe ? `, agissant pour le compte de la société titulaire de l'ICE ${str(a, "m-ice") || blank}` : ""}, donne pouvoir à Mziane pour déposer en mon nom à l'OMPIC la demande d'enregistrement de la marque « ${str(a, "m-nom") || blank} ».`,
        "Ce pouvoir comprend : le choix des classes de produits et services validées avec moi, le paiement des taxes pour mon compte, le suivi de la procédure, la réponse aux notifications de l'OMPIC et la réception de sa correspondance.",
      ],
    });
  }

  if (keys.includes("mre")) {
    const nom = list(a, "soc-noms")[0] || blank;
    out.push({
      key: "procuration-mre",
      title: "Procuration pour créer la société (à légaliser)",
      why: "Elle doit être signée devant le consulat du Maroc (ou apostillée pour un étranger) : téléchargez-la, signez-la sur place, puis envoyez la photo dans vos documents.",
      mode: "legalise",
      paragraphs: [
        `Je soussigné(e) ${who}, résidant en ${str(a, "mre-pays") || blank}, donne procuration à ${blank} (mandataire désigné par Mziane), titulaire de la CIN n° ${blank},`,
        `pour constituer en mon nom la société « ${nom} », signer les statuts, déclarations, formulaires et procès-verbaux nécessaires, déposer le dossier auprès du centre régional d'investissement, de l'OMPIC, de la Direction générale des impôts, du tribunal de commerce et de la CNSS, accomplir les formalités de publicité légale, et faire ouvrir le compte bancaire de la société.`,
        "Fait à ________________, le ____ / ____ / ________",
        "Signature légalisée :",
      ],
    });
  }
  return out;
}

export const docText = (d: SignDoc) => [d.title, ...d.paragraphs].join("\n\n");

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Numéro au format international (+212...), pour l'envoi du code par SMS. */
export function toE164(raw: string) {
  const s = raw.replace(/[^\d+]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("00")) return `+${s.slice(2)}`;
  if (/^0[5-7]\d{8}$/.test(s)) return `+212${s.slice(1)}`;
  if (/^212\d{9}$/.test(s)) return `+${s}`;
  return s ? `+${s}` : "";
}
