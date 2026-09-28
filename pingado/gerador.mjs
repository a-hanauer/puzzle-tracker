// Gerador de desafios do Pingado.
//
// Cada desafio sai de um tabuleiro completo sorteado (café e leite, seguindo
// as regras). As pistas possíveis são as casas já preenchidas e os sinais
// "=" / "×" entre casas vizinhas. O gerador começa com muitas pistas e vai
// tirando uma a uma enquanto o desafio continuar com solução única e
// resolvível só com dedução, no nível do dia. Nos dias mais fáceis, algumas
// pistas voltam no fim.
//
// Estilos (o que sobra no tabuleiro):
//   "misto"  — casas e sinais, meio a meio
//   "sinais" — poucas casas preenchidas, muitos sinais
//   "casas"  — muitas casas preenchidas, poucos sinais
//
// Uso:  node pingado/gerador.mjs [dias] [semente]

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validLines, logicSolve, countSolutions } from "./motor.mjs";

let seed = 20260928;
export function setSeed(s) { seed = s; }
function rand() {           // mulberry32
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rint = n => Math.floor(rand() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- tabuleiro completo sorteado ----------
// Linha por linha, escolhendo entre as linhas válidas as que não quebram as colunas.
function randomSolution(N) {
  const V = validLines(N), rows = [];
  const col = [...Array(N)].map(() => [0, 0]);
  let nodes = 0;
  function ok(line, r) {
    for (let c = 0; c < N; c++) {
      const v = line[c];
      if (col[c][v - 1] + 1 > N / 2) return false;
      if (r >= 2 && rows[r - 1][c] === v && rows[r - 2][c] === v) return false;
    }
    return true;
  }
  function rec(r) {
    if (r === N) return true;
    if (++nodes > 20000) return false;
    for (const line of shuffle(V.slice())) {
      if (!ok(line, r)) continue;
      rows.push(line); line.forEach((v, c) => col[c][v - 1]++);
      if (rec(r + 1)) return true;
      rows.pop(); line.forEach((v, c) => col[c][v - 1]--);
    }
    return false;
  }
  for (let t = 0; t < 50; t++) { rows.length = 0; col.forEach(x => (x[0] = x[1] = 0)); nodes = 0; if (rec(0)) return rows.flat(); }
  throw new Error("não consegui sortear um tabuleiro");
}

export const WEEK = [
  { n: 6, maxLevel: 1, extra: 3, styles: ["misto", "casas"] },                     // segunda (nível 1)
  { n: 6, maxLevel: 2, extra: 0, styles: ["misto", "sinais", "casas"] },           // terça (nível 2)
  { n: 6, maxLevel: 2, extra: 0, lean: 1, styles: ["misto", "sinais"] },           // quarta (nível 3)
  { n: 6, maxLevel: 2, extra: 0, lean: 2, styles: ["misto", "sinais"] },           // quinta (nível 4)
  { n: 8, maxLevel: 2, extra: 0, styles: ["misto", "sinais"] },                    // sexta (nível 5)
  { n: 8, maxLevel: 2, extra: 0, lean: 1, styles: ["misto", "sinais"] },           // sábado (nível 6)
  { n: 8, maxLevel: 2, extra: 0, lean: 2, styles: ["sinais", "misto"] },           // domingo (nível 7)
];
// Nenhum dia passa do nível 2 do resolvedor: o nível 3 (testar um valor e seguir a
// propagação até ver contradição) é chute para uma pessoa.
// 6×6 nos níveis 1 a 4 e 8×8 nos níveis 5 a 7 (10×10 ficava cansativo).
// Dentro de cada tamanho, a dificuldade vem de outro jeito: "lean" deixa o
// gerador tirar mais pistas (quase nenhuma casa preenchida, menos sinais), e
// o dia fica com os candidatos de maior esforço entre muitos sorteados.

export function makePuzzle(cfg, style) {
  const N = cfg.n, C = N * N;
  for (let attempt = 0; attempt < 50; attempt++) {
    const sol = randomSolution(N);
    // pistas possíveis: casas e sinais (entre vizinhas, à direita e embaixo)
    const cells = [...Array(C).keys()].map(i => ({ k: "c", i }));
    const edges = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const i = r * N + c;
      if (c < N - 1) edges.push({ k: "s", a: i, b: i + 1, d: "r" });
      if (r < N - 1) edges.push({ k: "s", a: i, b: i + N, d: "d" });
    }
    edges.forEach(e => (e.t = sol[e.a] === sol[e.b] ? "=" : "x"));
    const signFrac = { misto: 0.35, sinais: 0.6, casas: 0.2 }[style];
    const pool = [...cells, ...shuffle(edges.slice()).slice(0, Math.round(signFrac * edges.length))];
    const on = new Set(pool);
    const build = () => {
      const g = new Uint8Array(C), s = [];
      for (const x of on) if (x.k === "c") g[x.i] = sol[x.i]; else s.push(x);
      return [g, s];
    };
    // ordem de retirada: o que o estilo quer que suma sai primeiro
    const cs = shuffle(pool.filter(x => x.k === "c")), es = shuffle(pool.filter(x => x.k === "s"));
    const order = style === "sinais" ? [...cs, ...es] : style === "casas" ? [...es, ...cs] : shuffle(pool.slice());
    const removed = [];
    // sempre ficam alguns sinais e algumas casas (é o que dá a cara do jogo)
    const lean = cfg.lean || 0;
    const minSigns = [{ misto: N / 2, sinais: N, casas: N / 2 - 1 }, { misto: 3, sinais: N - 2, casas: 2 }, { misto: 2, sinais: N / 2, casas: 2 }][lean][style];
    const minCells = [{ misto: N / 2, sinais: N / 2 - 1, casas: N }, { misto: 2, sinais: 1, casas: N - 2 }, { misto: 1, sinais: 0, casas: N / 2 }][lean][style];
    let nSigns = es.length, nCells = cs.length;
    for (const x of order) {
      if (x.k === "s" && nSigns <= minSigns) continue;
      if (x.k === "c" && nCells <= minCells) continue;
      on.delete(x);
      const [g, s] = build();
      const l = logicSolve(N, g, s, cfg.maxLevel);
      if (l && !l.stuck) { removed.push(x); if (x.k === "s") nSigns--; else nCells--; } else on.add(x);
    }
    // nos dias mais fáceis, algumas pistas voltam
    shuffle(removed);
    for (let k = 0; k < cfg.extra && k < removed.length; k++) on.add(removed[k]);
    const [g, s] = build();
    const logic = logicSolve(N, g, s, 3);
    if (!logic || logic.stuck) continue;
    if (countSolutions(N, g, s, 2).length !== 1) continue;
    return {
      n: N, s: style,
      // casas: 0 vazia, 1 café, 2 leite; sinais: casa + direção (r direita, d embaixo) + tipo
      g: [...g].join(""),
      z: s.sort((a, b) => a.a - b.a || (a.d < b.d ? -1 : 1)).map(e => `${e.a}${e.d}${e.t}`).join(","),
      d: logic.score, lv: logic.level,
    };
  }
  throw new Error("não consegui gerar um desafio");
}

// ---------- execução ----------
export const EPOCH = [2026, 8, 28];            // #1 = segunda, 28/09/2026
const dayIdx = date => (date.getDay() + 6) % 7;
const FREE_PER_DAY = 20;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DAYS = +(process.argv[2] || 364);
  if (process.argv[3]) seed = +process.argv[3];
  const t0 = Date.now();
  const need = new Array(7).fill(0);
  for (let k = 0; k < DAYS; k++) need[dayIdx(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k))]++;
  // Cada dia gera mais candidatos do que precisa e fica com uma faixa de
  // esforço, para a dificuldade subir de segunda a domingo.
  const BAND = [[0, 0.4], [0.3, 0.7], [0.5, 0.9], [0.75, 1], [0.4, 0.8], [0.65, 0.95], [0.85, 1]];
  const MULT = [3, 3, 4, 6, 4, 6, 10];                      // candidatos por desafio
  const pools = [];
  for (let w = 0; w < 7; w++) {
    const cfg = WEEK[w], cand = [];
    const total = MULT[w] * need[w] + FREE_PER_DAY;
    for (let k = 0; k < total; k++) cand.push(makePuzzle(cfg, cfg.styles[k % cfg.styles.length]));
    cand.forEach(p => (p.q = rand()));
    const [b0, b1] = BAND[w];
    let chosen = [], rest = [];
    for (const style of new Set(cfg.styles)) {
      const g = cand.filter(p => p.s === style).sort((a, b) => a.d - b.d || a.q - b.q);
      const i0 = Math.floor(g.length * b0), i1 = Math.floor(g.length * b1);
      chosen.push(...g.slice(i0, i1));
      rest.push(...g.slice(0, i0), ...g.slice(i1));
    }
    shuffle(chosen);
    rest.push(...chosen.splice(need[w]));
    pools.push({ chosen, extra: shuffle(rest).slice(0, FREE_PER_DAY) });
    const ds = chosen.map(p => p.d).sort((a, b) => a - b);
    const st = {}; chosen.forEach(p => (st[p.s] = (st[p.s] || 0) + 1));
    const lv = {}; chosen.forEach(p => (lv[p.lv] = (lv[p.lv] || 0) + 1));
    const giv = chosen.map(p => p.g.replace(/0/g, "").length), sg = chosen.map(p => p.z.split(",").length);
    const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
    console.log(`dia ${w + 1} (${cfg.n}×${cfg.n}): esforço ${ds[0]}–${ds.at(-1)} (mediana ${ds[ds.length >> 1]}) · casas ${avg(giv)} · sinais ${avg(sg)} · técnica ${JSON.stringify(lv)} · ${JSON.stringify(st)} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const out = [];
  for (let k = 0; k < DAYS; k++) {
    const w = dayIdx(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k));
    const { q, ...p } = pools[w].chosen.shift(); out.push({ ...p, l: w + 1 });
  }
  const free = [];
  for (let w = 0; w < 7; w++) for (const { q, ...p } of pools[w].extra) free.push({ ...p, l: w + 1 });
  const dir = dirname(fileURLToPath(import.meta.url));
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  writeFileSync(join(dir, "livre.json"), JSON.stringify({ puzzles: free }));
  console.log(`pronto: ${out.length} dias + ${free.length} livres em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
