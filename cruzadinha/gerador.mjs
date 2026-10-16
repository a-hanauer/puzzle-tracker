// Gerador do Ponto Cruz (pasta "cruzadinha", o nome antigo): sudoku 6×6 de dados bordados (desde 16/10/2026).
// Tabuleiro 6×6 com blocos de 2 linhas × 3 colunas; cada linha, coluna e bloco tem os seis dados (1 a 6).
//
// Todo desafio tem solução única e sai só com lógica (sem chute): o gerador só tira uma casa se o
// desafio continuar resolvível do jeito do dia (veja o resolvedor "de gente" abaixo).
// Dificuldade pela semana (segunda = 1 … domingo = 7): menos casas reveladas, casas mais escondidas
// (poucas à vista por vez) e, no fim de semana, um (sábado) ou dois (domingo) lances à frente.
// Até sexta quase tudo sai só olhando, sem anotação.
//
// Uso:  node cruzadinha/gerador.mjs [dias] [semente]
// Os desafios que já saíram (até hoje) não mudam.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mantidos, escolher } from "../comum/selecao.mjs";

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

// ---------- resolvedor "de gente" ----------
// Joga como uma pessoa: a cada passo procura as casas que já dá para bordar sem anotar nada.
//   tipo 1 — o dado só cabe num lugar do bloco
//   tipo 2 — o dado só cabe num lugar da linha ou da coluna
//   tipo 3 — a casa só aceita um dado (olhando linha, coluna e bloco juntos)
// "largura" = quantas casas dá para bordar naquele momento: muitas = fácil de achar; uma só = é preciso caçar.
// Quando nenhuma casa sai direto, é preciso ver um lance à frente:
//   1 lance — "apontar": num bloco, o dado só cabe numa linha (ou coluna); então sai do resto dela
//             (ou o contrário: na linha, só cabe num bloco). Uma dessas destrava uma casa; dá para fazer de cabeça.
//   2 lances — duas dessas em seguida, ou um par (duas casas da unidade com os mesmos dois dados) — aqui
//             as anotações ajudam. Só no fim de semana.
// Mais que isso, ou qualquer chute, não entra.
const bits = m => { const o = []; for (let d = 1; d <= N; d++) if (m & (1 << d)) o.push(d); return o; };
const pop = m => bits(m).length;

function inicio(grade) {
  const v = grade.slice(), cand = v.map(x => (x ? 0 : 0b1111110));
  for (let i = 0; i < N * N; i++) if (v[i]) for (const j of VIZ[i]) cand[j] &= ~(1 << v[i]);
  return { v, cand };
}
function poe(st, i, d) { st.v[i] = d; st.cand[i] = 0; for (const j of VIZ[i]) st.cand[j] &= ~(1 << d); }
const copia = st => ({ v: st.v.slice(), cand: st.cand.slice() });

// casas que dá para bordar agora: Map casa → { d, tipo } (o tipo mais fácil que a encontra)
function diretas(st) {
  const m = new Map(), marca = (i, d, t) => { const o = m.get(i); if (!o || t < o.tipo) m.set(i, { d, tipo: t }); };
  for (let k = 0; k < 18; k++) {
    const u = UNIDADES[k], t = k >= 12 ? 1 : 2;
    for (let d = 1; d <= N; d++) {
      if (u.some(i => st.v[i] === d)) continue;
      const l = u.filter(i => st.cand[i] & (1 << d));
      if (l.length === 1) marca(l[0], d, t);
    }
  }
  for (let i = 0; i < N * N; i++) if (!st.v[i] && pop(st.cand[i]) === 1) marca(i, bits(st.cand[i])[0], 3);
  return m;
}

// deduções que só tiram possibilidades: { tira: [[casa, dado]], peso } (peso 1 = apontar; 2 = par)
function cortes(st) {
  const out = [];
  const add = (tira, peso) => { if (tira.length) out.push({ tira, peso }); };
  for (let k = 12; k < 18; k++) for (let d = 1; d <= N; d++) {
    const l = UNIDADES[k].filter(i => !st.v[i] && st.cand[i] & (1 << d)); if (l.length < 2) continue;
    for (let o = 0; o < 12; o++) if (l.every(i => UNIDADES[o].includes(i)))
      add(UNIDADES[o].filter(i => !l.includes(i) && !st.v[i] && st.cand[i] & (1 << d)).map(i => [i, d]), 1);
  }
  for (let o = 0; o < 12; o++) for (let d = 1; d <= N; d++) {
    const l = UNIDADES[o].filter(i => !st.v[i] && st.cand[i] & (1 << d)); if (l.length < 2) continue;
    for (let k = 12; k < 18; k++) if (l.every(i => UNIDADES[k].includes(i)))
      add(UNIDADES[k].filter(i => !l.includes(i) && !st.v[i] && st.cand[i] & (1 << d)).map(i => [i, d]), 1);
  }
  for (const u of UNIDADES) {
    const vaz = u.filter(i => !st.v[i]);
    for (let a = 0; a < vaz.length; a++) for (let b = a + 1; b < vaz.length; b++) {
      const m = st.cand[vaz[a]];
      if (m !== st.cand[vaz[b]] || pop(m) !== 2) continue;
      const tira = [];
      for (const i of vaz) if (i !== vaz[a] && i !== vaz[b]) for (const d of bits(st.cand[i] & m)) tira.push([i, d]);
      add(tira, 2);
    }
  }
  return out;
}
const corta = (st, c) => { const n = copia(st); for (const [i, d] of c.tira) n.cand[i] &= ~(1 << d); return n; };

// resolve até a profundidade pedida (0 = só casas diretas; 1 = um lance à frente; 2 = dois)
// devolve { ok, passos, tipos: [_, t1, t2, t3], larg: [...], l1, l2, e (esforço) }
export function resolve(grade, maxProf = 2) {
  let st = inicio(grade);
  const r = { ok: false, passos: 0, tipos: [0, 0, 0, 0], larg: [], l1: 0, l2: 0, e: 0 };
  for (;;) {
    if (st.v.every(Boolean)) { r.ok = true; return r; }
    if (st.v.some((x, i) => !x && !st.cand[i])) return r;
    const m = diretas(st);
    if (m.size) {
      let melhor = null;
      for (const [i, o] of m) if (!melhor || o.tipo < melhor[1].tipo) melhor = [i, o];
      r.passos++; r.tipos[melhor[1].tipo]++; r.larg.push(m.size);
      r.e += [0, 1, 1.6, 2.2][melhor[1].tipo] / Math.sqrt(m.size);   // esforço: casa difícil de achar pesa mais
      poe(st, melhor[0], melhor[1].d);
      continue;
    }
    if (maxProf < 1) return r;
    const cs = cortes(st);
    let prox = null;
    for (const c of cs) if (c.peso === 1) { const n = corta(st, c); if (diretas(n).size) { prox = n; break; } }
    if (prox) { r.l1++; r.e += 4; st = prox; continue; }
    if (maxProf < 2) return r;
    for (const c of cs) {
      if (c.peso === 2) { const n = corta(st, c); if (diretas(n).size) { prox = n; break; } continue; }
      const n1 = corta(st, c);
      for (const c2 of cortes(n1)) if (c2.peso === 1) { const n = corta(n1, c2); if (diretas(n).size) { prox = n; break; } }
      if (prox) break;
    }
    if (prox) { r.l2++; r.e += 9; st = prox; continue; }
    return r;
  }
}

// por nível do dia: casas reveladas; prof = lance à frente mais longo permitido; l1/l2 = quantos passos de
// 1 e de 2 lances (mínimo, máximo); alvo = cavar até onde der; faixa = parte do esforço que o dia pega
// entre os candidatos sorteados (comum/selecao.mjs). Até quinta, nada de anotação: tudo sai olhando.
// A semana fica mais difícil pelo número de casas, por casas mais escondidas (poucas à vista por vez,
// casas que só se acham olhando linha, coluna e bloco juntos) e, no fim de semana, pelos lances à frente.
export const NIVEL = {
  1: { dadas: [14, 16], prof: 0, l1: [0, 0], l2: [0, 0], faixa: [0, 0.6] },
  2: { dadas: [12, 14], prof: 0, l1: [0, 0], l2: [0, 0], faixa: [0.3, 0.9] },
  3: { dadas: [11, 12], prof: 0, l1: [0, 0], l2: [0, 0], faixa: [0.6, 1] },
  4: { dadas: [10, 11], prof: 0, l1: [0, 0], l2: [0, 0], faixa: [0.8, 1] },
  5: { dadas: [9, 11], prof: 1, l1: [0, 1], l2: [0, 0], alvo: 4, faixa: [0.9, 1] },
  6: { dadas: [9, 12], prof: 1, l1: [1, 2], l2: [0, 0], alvo: 4, faixa: [0.3, 1] },   // sábado: um lance à frente
  7: { dadas: [9, 12], prof: 2, l1: [0, 2], l2: [1, 1], alvo: 4, faixa: [0.3, 1] },   // domingo: dois lances
};

const cabe = (r, cfg) => r.ok && r.l1 <= cfg.l1[1] && r.l2 <= cfg.l2[1];

// um candidato do nível: tira casas de uma solução aleatória enquanto o desafio continuar
// resolvível do jeito do dia; devolve { g, s, l, d (esforço), i (lances à frente) }
export function desafio(nivel) {
  const cfg = NIVEL[nivel];
  for (let t = 0; t < 300000; t++) {
    const sol = solucao(), g = sol.slice();
    const alvo = cfg.alvo ?? cfg.dadas[0] + Math.floor(rand() * (cfg.dadas[1] - cfg.dadas[0] + 1));
    for (const i of shuffle([...Array(N * N).keys()])) {
      if (g.filter(Boolean).length <= alvo) break;
      const d = g[i]; g[i] = 0;
      if (!cabe(resolve(g, cfg.prof), cfg)) g[i] = d;
    }
    const dadas = g.filter(Boolean).length;
    if (dadas < cfg.dadas[0] || dadas > cfg.dadas[1]) continue;
    const r = resolve(g, cfg.prof);
    if (!cabe(r, cfg) || r.l1 < cfg.l1[0] || r.l2 < cfg.l2[0]) continue;
    return { g: g.map(x => x || ".").join(""), s: sol.join(""), l: nivel, d: Math.round(r.e * 10) / 10, i: r.l1 + r.l2 };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const dir = dirname(fileURLToPath(import.meta.url));
  // NOVO=1: refaz tudo (em 16/10/2026 o jogo trocou de palavras cruzadas para dados e o ano todo foi refeito)
  const old = process.env.NOVO ? [] : mantidos(dir, EPOCH);
  // por nível: sorteia vários candidatos e fica com a faixa de esforço do dia (comum/selecao.mjs)
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const vistos = new Set(old.map(p => p.g)), fila = {};
  for (let l = 1; l <= 7; l++) {
    let need = 0; for (let k = old.length; k < DIAS; k++) if (nivelDe(k) === l) need++;
    const per = Math.ceil(need / (NIVEL[l].faixa[1] - NIVEL[l].faixa[0]) * 1.1), pool = [];
    while (pool.length < per) { const p = desafio(l); if (!p) throw new Error(`nível ${l}: não consegui montar`); if (!vistos.has(p.g)) { vistos.add(p.g); pool.push(p); } }
    // (escolher agrupa por estilo no campo s, que aqui é a solução: embrulha para não confundir)
    fila[l] = escolher(pool.map(p => ({ d: p.d, i: p.i, p })), need, 0, NIVEL[l].faixa, rand).dia.map(x => x.p);
  }
  const out = [...old];
  for (let k = old.length; k < DIAS; k++) out.push(fila[nivelDe(k)].shift());
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  const novos = out.slice(old.length);
  console.log(`pronto: ${out.length} dias (${old.length} mantidos)`);
  for (let l = 1; l <= 7; l++) {
    const a = novos.filter(p => p.l === l), rs = a.map(p => resolve([...p.g].map(c => (c === "." ? 0 : +c)), 2));
    const med = f => (rs.reduce((s, r) => s + f(r), 0) / rs.length).toFixed(1);
    const dadas = a.map(p => p.g.replace(/\./g, "").length);
    console.log(`nível ${l}: ${a.length} dias · reveladas ${Math.min(...dadas)}–${Math.max(...dadas)} · esforço ${med(r => r.e)} · casas à vista ${med(r => r.larg.reduce((x, y) => x + y, 0) / r.larg.length)} · 1 lance ${med(r => r.l1)} · 2 lances ${med(r => r.l2)}`);
  }
}
