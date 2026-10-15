// Banco de pistas do Ponto Cruz (pasta "cruzadinha", o nome antigo), lido de pistas.txt
// (palavras de 3 a 5 letras) e pistas6.txt (palavras de 6 letras, para a grade 6×6).
// Cada palavra tem até três pistas: [fácil, média, difícil] (null onde não há).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const norm = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toUpperCase();
const DIR = dirname(fileURLToPath(import.meta.url));
const TXT = ["pistas.txt", "pistas6.txt"].map(f => readFileSync(join(DIR, f), "utf8")).join("\n");

export const PISTAS = new Map();      // PALAVRA → [fácil, média, difícil]
for (const l of TXT.split("\n")) {
  if (!l.trim() || l.startsWith("#")) continue;
  const [w, ...ps] = l.split("|");
  const k = norm(w);
  if (k.length < 3 || k.length > 6 || PISTAS.has(k)) continue;   // a primeira linha da palavra vale
  const p = [0, 1, 2].map(i => (ps[i] || "").trim() || null);
  if (p.some(Boolean)) PISTAS.set(k, p);
}
