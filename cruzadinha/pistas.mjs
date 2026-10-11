// Banco de pistas do Ponto Cruz (pasta "cruzadinha", o nome antigo), lido de pistas.txt.
// Cada palavra tem até três pistas: [fácil, média, difícil] (null onde não há).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const norm = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toUpperCase();
const TXT = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "pistas.txt"), "utf8");

export const PISTAS = new Map();      // PALAVRA → [fácil, média, difícil]
for (const l of TXT.split("\n")) {
  if (!l.trim() || l.startsWith("#")) continue;
  const [w, ...ps] = l.split("|");
  const k = norm(w);
  if (k.length < 3 || k.length > 5 || PISTAS.has(k)) continue;   // a primeira linha da palavra vale
  const p = [0, 1, 2].map(i => (ps[i] || "").trim() || null);
  if (p.some(Boolean)) PISTAS.set(k, p);
}
