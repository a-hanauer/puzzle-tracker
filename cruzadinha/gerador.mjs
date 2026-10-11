// Gerador do Ponto Cruz (pasta "cruzadinha", o nome antigo): grades 5×5 com casas pretas
// simétricas, todas as casas brancas cruzadas, palavras de 3 a 5 letras do banco (pistas.txt).
//
// Dificuldade pela semana (segunda = 1 … domingo = 7), como nos outros jogos:
//   · as pistas: fáceis no começo da semana, médias no meio, difíceis no fim;
//   · as palavras: nos dias fáceis só entram as que têm pista fácil;
//   · a grade: no fim de semana, menos casas pretas (mais palavras de 5 letras se cruzando).
// Uma palavra não volta logo (pausa por tamanho), e o mesmo vale para a pista.
//
// Uso:  node cruzadinha/gerador.mjs [dias] [semente]
// Os desafios que já saíram (até hoje) não mudam.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PISTAS } from "./pistas.mjs";
import { mantidos } from "../comum/selecao.mjs";

export const EPOCH = [2026, 9, 10];            // #1 = sábado, 10/10/2026
const N = 5;
let seed = 20261011;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// casas pretas (índices 0–24), simétricas pelo centro; quanto menos, mais difícil
export const PADROES = {
  seis: [[0, 1, 5, 19, 23, 24], [3, 4, 9, 15, 20, 21]],
  quatro: [[0, 4, 20, 24], [0, 1, 23, 24], [3, 4, 20, 21], [0, 5, 19, 24], [4, 9, 15, 20]],
  duas: [[0, 24]],
};
// por nível: grades possíveis e chance de cada nível de pista [fácil, média, difícil]
export const NIVEL = {
  1: { grades: ["seis", "quatro"], pista: [1, 0, 0] },
  2: { grades: ["seis", "quatro"], pista: [.85, .15, 0] },
  3: { grades: ["quatro"], pista: [.45, .55, 0] },
  4: { grades: ["quatro"], pista: [.2, .7, .1] },
  5: { grades: ["quatro"], pista: [0, .6, .4] },
  6: { grades: ["quatro", "duas"], pista: [0, .3, .7] },
  7: { grades: ["duas", "quatro"], pista: [0, .1, .9] },
};

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

export function preencher(pretas, voc, limite = 30000, uso = new Map()) {
  const S = slots(pretas);
  if (S.some(s => s.cs.length < 3)) return null;               // nada de palavra de 2 letras
  const porTam = {};
  for (const w of voc) (porTam[w.length] ??= []).push(w);
  // as menos usadas até aqui vêm antes (com um pouco de sorteio), para o repertório girar
  for (const k in porTam) { const peso = new Map(porTam[k].map(w => [w, (uso.get(w) || 0) + rand() * 8])); porTam[k].sort((a, b) => peso.get(a) - peso.get(b)); }
  const g = new Array(N * N).fill(""), usadas = new Set();
  let nos = 0;
  const cache = new Map();                                       // candidatos por molde ("C_S_")
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
    if (!melhor) return S.every(s => voc.has(s.cs.map(c => g[c]).join("")));
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

// sorteia o nível da pista pela tabela do dia; se a palavra não tem, usa o nível mais perto
function pistaDo(w, pesos, recentes) {
  const ps = PISTAS.get(w);
  let r = rand(), alvo = 0;
  for (; alvo < 2 && r >= pesos[alvo]; alvo++) r -= pesos[alvo];
  // perto do alvo (no máximo um nível de distância): primeiro uma pista não usada há pouco, senão repete
  const perto = [alvo, alvo - 1, alvo + 1].filter(i => i >= 0 && i <= 2 && ps[i]);
  const i = perto.find(i => !recentes.has(ps[i])) ?? perto[0] ?? [0, 1, 2].find(i => ps[i]);
  return { p: ps[i], d: i + 1 };
}

// números das pistas: como no jornal, em ordem de leitura
function montar(pretas, r, nivel, recentes) {
  const { g, S } = r, num = {}; let n = 0;
  for (let i = 0; i < N * N; i++) if (S.some(s => s.cs[0] === i)) num[i] = ++n;
  const pista = s => { const w = s.cs.map(c => g[c]).join(""); return { n: num[s.cs[0]], c: s.cs, w, ...pistaDo(w, NIVEL[nivel].pista, recentes) }; };
  return {
    l: nivel,
    g: g.map((ch, i) => (pretas.includes(i) ? "#" : ch)).join(""),
    h: S.filter(s => s.dir === "a").map(pista),
    v: S.filter(s => s.dir === "d").map(pista).sort((a, b) => a.n - b.n),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
  const DIAS = +(args[0] || 365);
  if (args[1]) seed = +args[1];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const out = [...old];
  const TODAS = new Set(PISTAS.keys());
  const FACEIS = new Set([...PISTAS].filter(([, p]) => p[0]).map(([w]) => w));
  // quanto tempo uma palavra fica sem voltar, pelo tamanho (as de 3 letras são poucas)
  const PAUSA = { 3: 6, 4: 12, 5: 28 };
  const recentes = (k, f) => new Set(out.slice(Math.max(0, k - 45)).flatMap((p, i, a) => [...p.h, ...p.v].map(x => x.w).filter(w => a.length - i <= PAUSA[w.length] * f)));
  let falhas = 0;
  const uso = new Map();
  for (const p of old) for (const x of [...p.h, ...p.v]) uso.set(x.w, (uso.get(x.w) || 0) + 1);
  for (let k = old.length; k < DIAS; k++) {
    const data = new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k);
    const nivel = (data.getDay() + 6) % 7 + 1;                 // segunda = 1 … domingo = 7
    const pistasRecentes = new Set(out.slice(-90).flatMap(p => [...p.h, ...p.v].map(x => x.p)));
    let feito = null;
    for (let t = 0; t < 300 && !feito; t++) {
      const f = t < 40 ? 1 : t < 120 ? 0.5 : t < 220 ? 0.25 : 0;            // se não fecha, a pausa encurta
      const tipos = NIVEL[nivel].grades;
      const tipo = t < 120 ? tipos[0] : tipos[Math.floor(rand() * tipos.length)];
      const pretas = PADROES[tipo][Math.floor(rand() * PADROES[tipo].length)];
      const evitar = recentes(k, f);
      const voc = new Set([...(nivel <= 2 ? FACEIS : TODAS)].filter(w => !evitar.has(w)));
      const r = preencher(pretas, voc, tipo === "duas" ? 60000 : 30000, t < 200 ? uso : undefined);
      if (r) feito = montar(pretas, r, nivel, pistasRecentes); else falhas++;
    }
    if (!feito) throw new Error(`não consegui montar o dia ${k + 1}`);
    out.push(feito);
    for (const x of [...feito.h, ...feito.v]) uso.set(x.w, (uso.get(x.w) || 0) + 1);
    if (process.env.LOG) console.log(k + 1, nivel, feito.g.split("#").length - 1, falhas);
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) · palavras no banco: ${PISTAS.size} · tentativas falhas: ${falhas}`);
}
