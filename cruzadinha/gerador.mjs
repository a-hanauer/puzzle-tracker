// Gerador da Cruzadinha: grades 5×5 com casas pretas simétricas, todas as casas brancas
// cruzadas (cada letra está numa palavra na horizontal e noutra na vertical), palavras de
// 3 a 5 letras tiradas do banco com pista (pistas.mjs). Nenhuma palavra se repete na grade,
// e uma palavra não volta na grade de outro dia por um bom tempo.
//
// Uso:  node cruzadinha/gerador.mjs [dias] [semente]
// Os desafios que já saíram (até hoje) não mudam.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PISTAS } from "./pistas.mjs";
import { PALAVRAS } from "./palavras.mjs";
// vocabulário: as palavras com pista; com --rascunho, também as comuns sem pista (para descobrir quais pistas escrever)
const RASCUNHO = process.argv.includes("--rascunho");
const VOC = new Set([...PISTAS.keys(), ...(RASCUNHO ? PALAVRAS : [])]);
import { mantidos } from "../comum/selecao.mjs";

export const EPOCH = [2026, 9, 10];            // #1 = sábado, 10/10/2026
const N = 5;
let seed = 20261011;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// casas pretas (índices 0–24), sempre simétricas pelo centro
export const PADROES = [
  [0, 4, 20, 24], [0, 1, 23, 24], [3, 4, 20, 21], [0, 5, 19, 24], [4, 9, 15, 20],
  [0, 1, 5, 19, 23, 24], [3, 4, 9, 15, 20, 21],
];

function slots(pretas) {
  const P = new Set(pretas), out = [];
  for (const dir of ["a", "d"]) for (let k = 0; k < N; k++) {
    let run = [];
    const fecha = () => { if (run.length >= 2) out.push({ dir, cs: run }); run = []; };
    for (let j = 0; j < N; j++) { const i = dir === "a" ? k * N + j : j * N + k; if (P.has(i)) fecha(); else run.push(i); }
    fecha();
  }
  return out;
}

export function preencher(pretas, evitar, limite = 200000) {
  const S = slots(pretas);
  if (S.some(s => s.cs.length < 3)) return null;               // nada de palavra de 2 letras
  const porTam = {};
  for (const w of VOC) if (!evitar.has(w)) (porTam[w.length] ??= []).push(w);
  // as que já têm pista vêm antes (no rascunho, assim sobram menos pistas para escrever)
  for (const k in porTam) { shuffle(porTam[k]); porTam[k].sort((a, b) => PISTAS.has(b) - PISTAS.has(a)); }
  const g = new Array(N * N).fill(""), usadas = new Set();
  let nos = 0;
  // candidatos por molde ("C_S_"): calculados uma vez e guardados
  const cache = new Map();
  const cand = s => {
    const molde = s.cs.map(c => g[c] || "_").join("");
    let l = cache.get(molde);
    if (!l) { l = (porTam[molde.length] || []).filter(w => [...molde].every((ch, j) => ch === "_" || ch === w[j])); cache.set(molde, l); }
    return l.filter(w => !usadas.has(w));
  };
  function rec() {
    if (++nos > limite) return false;
    let melhor = null, opc = null;
    for (const s of S) {
      if (s.cs.every(c => g[c])) continue;
      const l = cand(s);
      if (!l.length) return false;
      if (!opc || l.length < opc.length) { melhor = s; opc = l; }
    }
    if (!melhor) {                                              // tudo cheio: confere que as palavras formadas existem
      return S.every(s => VOC.has(s.cs.map(c => g[c]).join("")));
    }
    for (const w of opc.slice(0, 40)) {
      const antes = melhor.cs.map(c => g[c]);
      melhor.cs.forEach((c, j) => (g[c] = w[j])); usadas.add(w);
      if (rec()) return true;
      melhor.cs.forEach((c, j) => (g[c] = antes[j])); usadas.delete(w);
    }
    return false;
  }
  if (!rec()) return null;
  const palavras = S.map(s => s.cs.map(c => g[c]).join(""));
  if (new Set(palavras).size !== palavras.length) return null;
  return { g, S };
}

// números das pistas: como no jornal, em ordem de leitura
function montar(pretas, r) {
  const { g, S } = r, num = {}; let n = 0;
  for (let i = 0; i < N * N; i++) if (S.some(s => s.cs[0] === i)) num[i] = ++n;
  const pista = s => { const w = s.cs.map(c => g[c]).join(""); return { n: num[s.cs[0]], c: s.cs, w, p: (l => l && l[Math.floor(rand() * l.length)])(PISTAS.get(w)) }; };
  return {
    g: g.map((ch, i) => (pretas.includes(i) ? "#" : ch)).join(""),
    h: S.filter(s => s.dir === "a").map(pista),
    v: S.filter(s => s.dir === "d").map(pista).sort((a, b) => a.n - b.n),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
  const DIAS = +(args[0] || 120);
  if (args[1]) seed = +args[1];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const out = [...old];
  // quanto tempo uma palavra fica sem voltar, pelo tamanho (as de 3 letras são poucas)
  const PAUSA = { 3: 8, 4: 14, 5: 40 };
  // se não fecha, a pausa vai encurtando (f = 1, ½, ¼)
  const evitarAte = (k, f) => new Set(out.slice(Math.max(0, k - 40)).flatMap((p, i, a) => [...p.h, ...p.v].map(x => x.w).filter(w => a.length - i <= PAUSA[w.length] * f)));
  let falhas = 0;
  for (let k = old.length; k < DIAS; k++) {
    let feito = null;
    for (let t = 0; t < 240 && !feito; t++) {
      const f = t < 80 ? 1 : t < 160 ? 0.5 : 0.25;
      const pretas = PADROES[Math.floor(rand() * PADROES.length)];
      const evitar = evitarAte(k, f);
      const r = preencher(pretas, evitar, 30000);
      if (r) feito = montar(pretas, r); else falhas++;
    }
    if (!feito) throw new Error(`não consegui montar o dia ${k + 1}`);
    out.push(feito);
    if (process.env.LOG) console.log(k + 1, falhas);
  }
  if (RASCUNHO) {
    const falta = [...new Set(out.flatMap(p => [...p.h, ...p.v]).filter(x => !x.p).map(x => x.w))].sort();
    writeFileSync(join(dir, "faltam.txt"), falta.join("\n"));
    console.log(`rascunho: ${falta.length} palavras sem pista em cruzadinha/faltam.txt`);
    process.exit(0);
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) · palavras no banco: ${PISTAS.size} · tentativas falhas: ${falhas}`);
}
