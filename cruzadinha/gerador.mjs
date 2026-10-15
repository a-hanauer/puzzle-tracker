// Gerador do Ponto Cruz (pasta "cruzadinha", o nome antigo): grades 6×6 (até 14/10/2026 eram 5×5)
// com casas pretas simétricas, todas as casas brancas cruzadas, palavras de 3 a 6 letras do banco
// (pistas.txt e pistas6.txt).
//
// Dificuldade pela semana (segunda = 1 … domingo = 7), como nos outros jogos:
//   · as pistas: fáceis no começo da semana, médias no meio, difíceis no fim;
//   · as palavras: nos dias fáceis só entram as que têm pista fácil;
//   · a grade: no fim de semana, menos casas pretas (mais palavras longas se cruzando).
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
let N = 6;                                     // 5×5 até 14/10/2026; 6×6 daí em diante
let seed = 20261011;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// casas pretas (índices 0–35 da 6×6), simétricas pelo centro; quanto menos, mais palavras longas se cruzam
export const PADROES = {   // testadas com o banco de out/2026 (de 26 grades simétricas possíveis, as que fecham bem)
  dez: [[0, 1, 6, 7, 12, 23, 28, 29, 34, 35], [0, 1, 2, 6, 7, 28, 29, 33, 34, 35]],     // duas palavras de 6 letras
  oito: [[0, 1, 2, 6, 29, 33, 34, 35], [0, 1, 6, 12, 23, 29, 34, 35]],                    // quatro palavras de 6 letras
};
// por nível: grades possíveis e chance de cada nível de pista [fácil, média, difícil]
export const NIVEL = {   // out/2026: mais difícil desde a segunda (o público pede desafio)
  1: { grades: ["dez"], pista: [.6, .4, 0] },
  2: { grades: ["dez"], pista: [.4, .5, .1] },
  3: { grades: ["dez"], pista: [.2, .55, .25] },
  4: { grades: ["dez"], pista: [.1, .5, .4] },
  5: { grades: ["dez", "oito"], pista: [0, .4, .6] },
  6: { grades: ["oito"], pista: [0, .2, .8] },
  7: { grades: ["oito"], pista: [0, .1, .9] },
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

// índice por (tamanho, posição, letra) em bitsets: os candidatos de um molde saem de um AND rápido
const INDICE = new Map();
function indice(voc) {
  let ix = INDICE.get(voc);
  if (ix) return ix;
  ix = {};
  for (const w of voc) (ix[w.length] ??= { ws: [] }).ws.push(w);
  for (const L in ix) {
    const e = ix[L], n = e.ws.length, B = (n + 31) >>> 5;
    e.B = B; e.tudo = new Uint32Array(B).fill(0xffffffff);
    if (n & 31) e.tudo[B - 1] = (1 << (n & 31)) - 1;
    e.pos = Array.from({ length: +L }, () => ({}));
    e.ws.forEach((w, k) => { for (let j = 0; j < w.length; j++) (e.pos[j][w[j]] ??= new Uint32Array(B))[k >>> 5] |= 1 << (k & 31); });
  }
  INDICE.clear(); INDICE.set(voc, ix);
  return ix;
}
const conta = b => { let c = 0; for (let x of b) { x -= (x >>> 1) & 0x55555555; x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); c += (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; } return c; };

export function preencher(pretas, voc, limite = 30000, uso = new Map()) {
  const S = slots(pretas);
  if (S.some(s => s.cs.length < 3)) return null;               // nada de palavra de 2 letras
  const ix = indice(voc);
  if (S.some(s => !ix[s.cs.length])) return null;
  const g = new Array(N * N).fill(""), usadas = new Set();
  const cruza = S.map(s => S.filter(o => o !== s && o.cs.some(c => s.cs.includes(c))));
  // candidatos de um slot com as letras já postas (bitset) e quantos são, sem contar palavras já usadas
  const bits = s => {
    const e = ix[s.cs.length], b = e.tudo.slice();
    s.cs.forEach((c, j) => { if (g[c]) { const m = e.pos[j][g[c]]; if (!m) b.fill(0); else for (let k = 0; k < e.B; k++) b[k] &= m[k]; } });
    return b;
  };
  const lista = s => { const e = ix[s.cs.length], b = bits(s), out = []; for (let k = 0; k < e.B; k++) { let x = b[k]; while (x) { const t = 31 - Math.clz32(x & -x); out.push(e.ws[(k << 5) + t]); x &= x - 1; } } return out.filter(w => !usadas.has(w)); };
  const cheio = s => s.cs.every(c => g[c]);
  let nos = 0;
  function rec() {
    if (++nos > limite) return false;
    let melhor = -1, n = Infinity;
    for (let i = 0; i < S.length; i++) {
      if (cheio(S[i])) continue;
      const c = conta(bits(S[i]));
      if (!c) return false;
      if (c < n) { n = c; melhor = i; }
    }
    if (melhor < 0) return true;
    const s = S[melhor];
    // as menos usadas e as que deixam mais saídas nos cruzamentos vêm antes (com um pouco de sorteio)
    const opc = lista(s);
    if (!opc.length) return false;
    const amostra = opc.length > 250 ? shuffle(opc).slice(0, 250) : opc;
    const nota = [];
    for (const w of amostra) {
      const antes = s.cs.map(c => g[c]);
      s.cs.forEach((c, j) => (g[c] = w[j]));
      let sc = 0;
      for (const o of cruza[melhor]) { if (cheio(o)) { const ow = o.cs.map(c => g[c]).join(""); if (!voc.has(ow) || ow === w) { sc = -1; break; } continue; } const k = conta(bits(o)); if (!k) { sc = -1; break; } sc += Math.log(k); }
      s.cs.forEach((c, j) => (g[c] = antes[j]));
      if (sc >= 0) nota.push([w, sc + rand() * 1.5 - (uso.get(w) || 0) * 0.3]);
    }
    nota.sort((a, b) => b[1] - a[1]);
    for (const [w] of nota.slice(0, 12)) {
      const antes = s.cs.map(c => g[c]);
      s.cs.forEach((c, j) => (g[c] = w[j])); usadas.add(w);
      if (rec()) return true;
      s.cs.forEach((c, j) => (g[c] = antes[j])); usadas.delete(w);
    }
    return false;
  }
  if (!rec()) return null;
  const palavras = S.map(s => s.cs.map(c => g[c]).join(""));
  if (new Set(palavras).size !== palavras.length || palavras.some(w => !voc.has(w))) return null;
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
  const PAUSA = { 3: 4, 4: 7, 5: 14, 6: 30 };
  const recentes = (k, f) => new Set(out.slice(Math.max(0, k - 45)).flatMap((p, i, a) => [...p.h, ...p.v].map(x => x.w).filter(w => a.length - i <= PAUSA[w.length] * f)));
  let falhas = 0;
  const uso = new Map();
  for (const p of old) for (const x of [...p.h, ...p.v]) uso.set(x.w, (uso.get(x.w) || 0) + 1);
  for (let k = old.length; k < DIAS; k++) {
    const data = new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k);
    const nivel = (data.getDay() + 6) % 7 + 1;                 // segunda = 1 … domingo = 7
    const pistasRecentes = new Set(out.slice(-90).flatMap(p => [...p.h, ...p.v].map(x => x.p)));
    let feito = null;
    for (let t = 0; t < 900 && !feito; t++) {
      const f = t < 60 ? 1 : t < 140 ? 0.5 : t < 220 ? 0.25 : 0;            // se não fecha, a pausa encurta
      const tipos = NIVEL[nivel].grades;
      // as grades do nível; se não fecha (o banco de palavras é o limite), a de dez casas pretas
      const tipo = t < 300 ? tipos[Math.floor(rand() * tipos.length)] : "dez";
      const pretas = PADROES[tipo][Math.floor(rand() * PADROES[tipo].length)];
      const evitar = recentes(k, f);
      const voc = new Set([...(nivel <= 2 ? FACEIS : TODAS)].filter(w => !evitar.has(w)));
      const r = preencher(pretas, voc, tipo === "oito" ? 2500 : 800, t < 600 ? uso : undefined);
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
