// Génère les fiches procédures en PDF (checklists à imprimer), à partir de src/lib/procedures/data/*.json.
// Usage : node scripts/procedures-pdf.mjs <dossier de sortie> [chemin de Chrome]
// Chrome : variable CHROME, 2e argument, ou Google Chrome installé.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src/lib/procedures/data");
const OUT = resolve(process.argv[2] ?? join(ROOT, "procedures-pdf"));
const CHROME = process.env.CHROME ?? process.argv[3] ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Même ordre que GROUPS dans src/lib/procedures/index.ts
const ORDER = [
  "creation-ae", "creation-sarlau", "creation-sas", "creation-cooperative", "creation-sa-sci",
  "intl-mre", "intl-etranger", "intl-zai",
  "compta-ae", "compta-societe", "domiciliation",
  "formalite-gerant", "formalite-siege", "formalite-denomination-objet", "formalite-parts", "formalite-capital", "formalite-sommeil", "formalite-fermer",
  "marque", "web",
  "aides-entreprise", "aides-agri", "aides-particuliers",
];
const WHO = { moi: ["Moi", "#E6F7FA", "#004F5C"], cabinet: ["Cabinet comptable", "#FFF2C9", "#7A5A0E"], client: ["Client", "#FFF0F0", "#BF2120"], administration: ["Administration", "#EDEDF1", "#3F3F46"] };

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (s = "") => esc(s).replace(/(https?:\/\/[^\s),;<]+)/g, '<a href="$1">$1</a>');
const list = (items, cls = "") => (items?.length ? `<ul class="${cls}">${items.map((x) => `<li>${link(x)}</li>`).join("")}</ul>` : "");

function fiche(p) {
  let n = 0;
  const phases = p.phases.map((ph) => `
    <h3>${esc(ph.title)}</h3>
    ${ph.steps.map((s) => {
      n += 1;
      const [label, bg, fg] = WHO[s.who] ?? WHO.moi;
      const meta = [s.delai && `Délai : ${esc(s.delai)}`, s.cout && `Coût : ${esc(s.cout)}`, s.offers?.length && `Seulement : ${esc(s.offers.join(", "))}`].filter(Boolean).join(" · ");
      return `<div class="step">
        <div class="head"><span class="box"></span><span class="num">${n}</span><div class="t"><b>${esc(s.title)}</b>
          <div class="meta"><span class="who" style="background:${bg};color:${fg}">${label}</span>${meta ? ` ${meta}` : ""}</div></div></div>
        <div class="body">
          ${s.where ? `<p><b>Où :</b> ${link(s.where)}</p>` : ""}
          ${s.how?.length ? `<p><b>Comment :</b></p><ol>${s.how.map((h) => `<li>${link(h)}</li>`).join("")}</ol>` : ""}
          ${s.pieces?.length ? `<p><b>Pièces :</b></p>${list(s.pieces)}` : ""}
          ${s.pieges?.length ? `<div class="warn"><b>Pièges à éviter</b>${list(s.pieges)}</div>` : ""}
          ${s.preuve ? `<p class="ok"><b>C'est fait quand :</b> ${esc(s.preuve)}</p>` : ""}
          <p class="note">Date : ____ / ____ / ________ &nbsp;&nbsp; Note : ______________________________________</p>
        </div></div>`;
    }).join("")}`).join("");
  const box = (title, items, cls) => (items?.length ? `<div class="block ${cls}"><b>${title}</b>${list(items)}</div>` : "");
  return `<section class="fiche">
    <div class="brand">Mziane<span>.</span> <small>Fiche procédure interne</small></div>
    <h1>${esc(p.title)}</h1>
    <p class="summary">${esc(p.summary)}</p>
    <p class="tags">${p.duree ? `<span>Durée : ${esc(p.duree)}</span>` : ""}<span>Formules : ${esc(p.offers.join(", "))}</span></p>
    <p class="fill">Client : ____________________________ &nbsp; Réf. dossier : ____________ &nbsp; Début : ____ / ____ / ________</p>
    ${p.frais_officiels?.length ? `<div class="block"><b>Frais officiels à prévoir</b><table>${p.frais_officiels.map((f) => `<tr><td>${esc(f.label)}${f.note ? `<br><small>${esc(f.note)}</small>` : ""}</td><td class="r">${esc(f.montant)}</td></tr>`).join("")}</table></div>` : ""}
    ${box("Avant de commencer", p.avant_de_commencer, "blue")}
    <h2>Étapes</h2>
    ${phases}
    ${box("Quand appeler le cabinet comptable", p.cabinet, "amber")}
    ${box("Ce que le client fait lui-même", p.client, "red")}
    ${box("Après la livraison", p.apres, "blue")}
    ${box("À vérifier avant de s'y fier", p.a_verifier, "grey")}
    ${p.sources?.length ? `<div class="sources"><b>Sources</b><ul>${p.sources.map((s) => `<li>${esc(s.title)} : <a href="${esc(s.url)}">${esc(s.url)}</a></li>`).join("")}</ul></div>` : ""}
  </section>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
@page { size: A4; margin: 14mm 13mm 16mm; }
* { box-sizing: border-box; }
body { font-family: Poppins, system-ui, sans-serif; color: #18181b; font-size: 9.6pt; line-height: 1.45; margin: 0; }
a { color: #00697A; word-break: break-all; }
.fiche { page-break-after: always; }
.brand { font-weight: 800; font-size: 13pt; } .brand span { color: #009FB7; } .brand small { font-weight: 400; font-size: 8.5pt; color: #71717a; margin-left: 6px; }
h1 { font-size: 19pt; line-height: 1.15; margin: 10px 0 6px; letter-spacing: -.02em; }
h2 { font-size: 13pt; margin: 18px 0 4px; border-bottom: 2px solid #009FB7; padding-bottom: 3px; break-after: avoid; }
h3 { font-size: 11pt; margin: 14px 0 6px; color: #00697A; break-after: avoid; }
.summary { font-size: 10.5pt; margin: 0 0 6px; }
.tags span { display: inline-block; background: #F4F4F8; border-radius: 99px; padding: 2px 10px; margin: 0 6px 4px 0; font-size: 8.5pt; font-weight: 600; }
.fill { font-size: 8.5pt; color: #52525b; margin: 6px 0 10px; }
.block { border-radius: 10px; padding: 8px 12px; margin: 8px 0; background: #F4F4F8; break-inside: avoid; }
.block.blue { background: #E6F7FA; } .block.amber { background: #FFF2C9; } .block.red { background: #FFF0F0; } .block.grey { background: #EDEDF1; }
.block ul { margin: 4px 0 0; padding-left: 18px; }
table { width: 100%; border-collapse: collapse; margin-top: 4px; } td { border-top: 1px solid #E6E6EA; padding: 3px 0; vertical-align: top; } td.r { text-align: right; font-weight: 700; white-space: nowrap; padding-left: 10px; }
.step { border: 1px solid #E6E6EA; border-radius: 10px; padding: 7px 10px; margin: 0 0 6px; break-inside: avoid; }
.head { display: flex; gap: 8px; align-items: flex-start; }
.box { flex: none; width: 13px; height: 13px; border: 1.6px solid #3f3f46; border-radius: 3px; margin-top: 2px; }
.num { flex: none; font-weight: 800; color: #009FB7; min-width: 16px; }
.t b { font-size: 10pt; }
.meta { font-size: 8pt; color: #52525b; margin-top: 2px; }
.who { display: inline-block; border-radius: 99px; padding: 0 7px; font-weight: 700; }
.body { padding-left: 37px; font-size: 8.8pt; color: #3f3f46; }
.body p { margin: 4px 0 0; } .body ol, .body ul { margin: 2px 0 0; padding-left: 16px; }
.warn { background: #FFF2C9; border-radius: 8px; padding: 4px 8px; margin-top: 5px; }
.ok { color: #065f46; }
.note { color: #a1a1aa; font-size: 8pt; margin-top: 6px !important; }
.sources { font-size: 8pt; color: #52525b; margin-top: 10px; } .sources ul { padding-left: 16px; margin: 2px 0; }
.cover { page-break-after: always; padding-top: 60mm; }
.cover h1 { font-size: 28pt; } .cover li { margin: 3px 0; font-size: 11pt; }
`;

const page = (body, title) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body>${body}</body></html>`;

function print(html, file) {
  const tmp = join(tmpdir(), `mziane-fiche-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(tmp, html);
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000", `--print-to-pdf=${file}`, `file://${tmp}`], { stdio: "ignore" });
  rmSync(tmp);
}

if (!existsSync(CHROME)) { console.error(`Chrome introuvable : ${CHROME}`); process.exit(1); }
mkdirSync(OUT, { recursive: true });
const files = new Set(readdirSync(DATA).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)));
const ids = [...ORDER.filter((id) => files.has(id)), ...[...files].filter((id) => !ORDER.includes(id))];
const all = ids.map((id) => JSON.parse(readFileSync(join(DATA, `${id}.json`), "utf8")));

all.forEach((p, i) => {
  const name = `${String(i + 1).padStart(2, "0")} - ${p.title.replace(/[/:]/g, "-")}.pdf`;
  print(page(fiche(p), p.title), join(OUT, name));
  console.log("PDF", name);
});
const cover = `<section class="cover"><div class="brand">Mziane<span>.</span></div><h1>Fiches procédures</h1><p>Comment réaliser chaque offre, étape par étape. Cochez chaque case quand la preuve est obtenue.</p><ol>${all.map((p) => `<li>${esc(p.title)}</li>`).join("")}</ol></section>`;
print(page(cover + all.map(fiche).join(""), "Fiches procédures Mziane"), join(OUT, "00 - Toutes les fiches.pdf"));
console.log("PDF 00 - Toutes les fiches.pdf");
