// Gerador do Ponto Cruz (pasta "cruzadinha", o nome antigo): desde 17/10/2026 um sudoku 6×6 de dados.
// Tabuleiro 6×6 com blocos de 2 linhas × 3 colunas; cada linha, coluna e bloco tem os seis dados (1 a 6).
//
// Todo desafio tem solução única e sai só com lógica (sem chute): o gerador só tira uma casa se o
// desafio continuar resolvível pelas técnicas permitidas para o dia.
// Técnicas, da mais simples à mais difícil:
//   1 — casa com um só dado possível (candidato único) e dado com um só lugar no bloco
//   2 — dado com um só lugar na linha ou na coluna
//   3 — pares nus e "apontar" (um dado preso a uma linha/coluna dentro do bloco tira o dado do resto)
// Dificuldade pela semana (segunda = 1 … domingo = 7): menos casas reveladas e técnicas mais longas.
//
// Uso:  node cruzadinha/gerador.mjs [dias] [semente]
// Os desafios que já saíram (até hoje) não mudam — inclusive os de palavras cruzadas (até 16/10/2026).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mantidos } from "../comum/selecao.mjs";

export const EPOCH = [2026, 9, 10];            // #1 = sábado, 10/10/2026 (a numeração continua a das palavras cruzadas)
let seed = 20261017;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const N = 6, BR = 2, BC = 3;                   // blocos de 2 linhas × 3 colunas
export const UNIDADES = (() => {
  const u = [];
  for (let r = 0; r < N; r++) u.push([...Array(N).keys()].map(c => r * N + c));
  for (let c = 0; c < N; c++) u.push([...Array(N).keys()].map(r => r * N + c));
  for (let br = 0; br < N / BR; br++) for (let bc = 0; bc < N / BC; bc++) {
    const b = []; for (let r = 0; r < BR; r++) for (let c = 0; c < BC; c++) b.push((br * BR + r) * N + bc * BC + c); u.push(b);
  }
  return u;                                     // 0–5 linhas, 6–11 colunas, 12–17 blocos
})();
const DA = [...Array(N * N).keys()].map(i => UNIDADES.map((u, k) => (u.includes(i) ? k : -1)).filter(k => k >= 0));
const VIZ = [...Array(N * N).keys()].map(i => [...new Set(DA[i].flatMap(k => UNIDADES[k]))].filter(j => j !== i));

// solução aleatória: padrão base embaralhado (dados, linhas dentro da faixa, faixas, colunas dentro da pilha, pilhas)
function solucao() {
  const base = (r, c) => ((r % BR) * BC + Math.floor(r / BR) + c) % N;
  const dig = shuffle([1, 2, 3, 4, 5, 6]);
  const faixas = shuffle([0, 1, 2]).flatMap(b => shuffle([0, 1]).map(r => b * BR + r));
  const pilhas = shuffle([0, 1]).flatMap(s => shuffle([0, 1, 2]).map(c => s * BC + c));
  const g = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) g.push(dig[base(faixas[r], pilhas[c])]);
  return g;
}

// resolve com lógica até o nível pedido; devolve { ok, nivel: técnica mais alta usada, passos }
export function resolve(grade, maxNivel) {
  const v = grade.slice(), cand = v.map(x => (x ? 0 : 0b1111110));
  for (let i = 0; i < N * N; i++) if (v[i]) for (const j of VIZ[i]) cand[j] &= ~(1 << v[i]);
  let nivel = 0, passos = 0;
  const poe = (i, d) => { v[i] = d; cand[i] = 0; for (const j of VIZ[i]) cand[j] &= ~(1 << d); passos++; };
  const bits = m => { const o = []; for (let d = 1; d <= N; d++) if (m & (1 << d)) o.push(d); return o; };
  for (;;) {
    if (v.every(Boolean)) return { ok: true, nivel, passos, v };
    if (v.some((x, i) => !x && !cand[i])) return { ok: false, nivel };
    let feito = false;
    // nível 1: candidato único; dado com um só lugar no bloco
    for (let i = 0; i < N * N && !feito; i++) if (!v[i] && bits(cand[i]).length === 1) { poe(i, bits(cand[i])[0]); feito = true; }
    for (let k = 12; k < 18 && !feito; k++) for (let d = 1; d <= N && !feito; d++) {
      const u = UNIDADES[k]; if (u.some(i => v[i] === d)) continue;
      const l = u.filter(i => cand[i] & (1 << d)); if (l.length === 1) { poe(l[0], d); feito = true; }
    }
    if (feito) { nivel = Math.max(nivel, 1); continue; }
    if (maxNivel < 2) return { ok: false, nivel };
    // nível 2: dado com um só lugar na linha ou na coluna
    for (let k = 0; k < 12 && !feito; k++) for (let d = 1; d <= N && !feito; d++) {
      const u = UNIDADES[k]; if (u.some(i => v[i] === d)) continue;
      const l = u.filter(i => cand[i] & (1 << d)); if (l.length === 1) { poe(l[0], d); feito = true; }
    }
    if (feito) { nivel = Math.max(nivel, 2); continue; }
    if (maxNivel < 3) return { ok: false, nivel };
    // nível 3: pares nus (em qualquer unidade) e apontar (bloco ↔ linha/coluna); só elimina candidatos
    for (const u of UNIDADES) {
      const vaz = u.filter(i => !v[i]);
      for (let a = 0; a < vaz.length; a++) for (let b = a + 1; b < vaz.length; b++) {
        const m = cand[vaz[a]];
        if (m === cand[vaz[b]] && bits(m).length === 2)
          for (const i of vaz) if (i !== vaz[a] && i !== vaz[b] && cand[i] & m) { cand[i] &= ~m; feito = true; }
      }
    }
    for (let k = 12; k < 18; k++) for (let d = 1; d <= N; d++) {
      const l = UNIDADES[k].filter(i => !v[i] && cand[i] & (1 << d)); if (l.length < 2) continue;
      for (let o = 0; o < 12; o++) if (l.every(i => UNIDADES[o].includes(i)))
        for (const i of UNIDADES[o]) if (!l.includes(i) && !v[i] && cand[i] & (1 << d)) { cand[i] &= ~(1 << d); feito = true; }
    }
    for (let o = 0; o < 12; o++) for (let d = 1; d <= N; d++) {
      const l = UNIDADES[o].filter(i => !v[i] && cand[i] & (1 << d)); if (l.length < 2) continue;
      for (let k = 12; k < 18; k++) if (l.every(i => UNIDADES[k].includes(i)))
        for (const i of UNIDADES[k]) if (!l.includes(i) && !v[i] && cand[i] & (1 << d)) { cand[i] &= ~(1 << d); feito = true; }
    }
    if (feito) { nivel = Math.max(nivel, 3); continue; }
    return { ok: false, nivel };
  }
}

// por nível do dia: quantas casas reveladas (faixa) e técnica exigida (mínima e máxima)
export const NIVEL = {
  1: { dadas: [16, 18], tec: [1, 1] },
  2: { dadas: [14, 16], tec: [1, 1] },
  3: { dadas: [12, 14], tec: [2, 2] },
  4: { dadas: [11, 13], tec: [2, 2] },
  5: { dadas: [10, 12], tec: [2, 3] },
  6: { dadas: [9, 11], tec: [3, 3] },
  7: { dadas: [8, 10], tec: [3, 3] },
};

export function desafio(nivel) {
  const cfg = NIVEL[nivel];
  for (let t = 0; t < 4000; t++) {
    const sol = solucao(), g = sol.slice();
    const alvo = cfg.dadas[0] + Math.floor(rand() * (cfg.dadas[1] - cfg.dadas[0] + 1));
    for (const i of shuffle([...Array(N * N).keys()])) {
      if (g.filter(Boolean).length <= alvo) break;
      const d = g[i]; g[i] = 0;
      if (!resolve(g, cfg.tec[1]).ok) g[i] = d;
    }
    const dadas = g.filter(Boolean).length;
    if (dadas < cfg.dadas[0] || dadas > cfg.dadas[1]) continue;
    const r = resolve(g, cfg.tec[1]);
    if (!r.ok || r.nivel < cfg.tec[0]) continue;
    return { g: g.map(x => x || ".").join(""), s: sol.join(""), t: r.nivel, l: nivel };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const out = [...old];
  const vistos = new Set(old.map(p => p.g));
  for (let k = old.length; k < DIAS; k++) {
    const nivel = (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
    let p = null;
    for (let t = 0; t < 50 && (!p || vistos.has(p.g)); t++) p = desafio(nivel);
    if (!p) throw new Error(`não consegui montar o dia ${k + 1}`);
    vistos.add(p.g); out.push(p);
    if (process.env.LOG) console.log(k + 1, nivel, p.g.replace(/\./g, "").length, "técnica", p.t);
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  const novos = out.slice(old.length), por = {};
  for (const p of novos) { por[p.l] ??= []; por[p.l].push(p.g.replace(/\./g, "").length); }
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) · reveladas por nível:`, Object.fromEntries(Object.entries(por).map(([l, a]) => [l, `${Math.min(...a)}–${Math.max(...a)}`])));
}
