// Gerador de desafios do Novelo.
//
// Cada desafio sai de um caminho aleatório que passa por todas as casas
// (sorteado por "mordidas" sucessivas, o que dá formas bem variadas). Depois:
//   1. escolhe o estilo do dia (só números, com paredes, ou labirinto);
//   2. põe números no caminho até a solução ser única;
//   3. tira os números que sobram, um a um, enquanto a solução continuar única;
//   4. confere com o resolvedor "humano" (sem chute) e, nos dias fáceis,
//      devolve números até o desafio caber no nível pedido.
//
// Uso:  node novelo/gerador.mjs [dias] [semente]
// Gera novelo/desafios.json (agenda diária) e novelo/livre.json (jogo livre).

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { makeBoard, edgeOf, countSolutions, logicSolve, pathFromEdges } from "./motor.mjs";

let seed = 20260928;
export function setSeed(s) { seed = s; }
function rand() {           // mulberry32
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rint = n => Math.floor(rand() * n);
const pick = a => a[rint(a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- caminho aleatório (backbite) ----------
function randomPath(N) {
  const C = N * N, path = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) path.push(r * N + (r % 2 ? N - 1 - c : c));
  const pos = new Int32Array(C);
  const sync = () => path.forEach((x, k) => (pos[x] = k));
  sync();
  const nb = i => { const r = (i / N) | 0, c = i % N, o = [];
    if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; };
  for (let t = 0; t < C * 80; t++) {
    if (rand() < 0.5) { path.reverse(); sync(); }
    const end = path[C - 1];
    const x = pick(nb(end).filter(y => y !== path[C - 2]));
    const k = pos[x];
    const tail = path.splice(k + 1).reverse();
    path.push(...tail);
    for (let j = k + 1; j < C; j++) pos[path[j]] = j;
  }
  return path;
}

// ---------- estilos e agenda ----------
// Dia da semana → tamanho, técnicas permitidas e estilos possíveis.
//   estilos: "fio" (só números) · "paredes" (algumas paredes) · "labirinto"
//   (muitas paredes e pouquíssimos números)
export const WEEK = [
  { n: 6, maxLevel: 1, styles: ["fio", "fio", "paredes"], extra: 2 },           // segunda
  { n: 6, maxLevel: 2, styles: ["fio", "paredes", "labirinto"], extra: 0 },     // terça
  { n: 7, maxLevel: 2, styles: ["fio", "paredes", "paredes"], extra: 1 },       // quarta
  // da quinta em diante, no máximo o nível 2: o nível 3 (testar uma ligação e seguir
  // a propagação até ver contradição) é chute para uma pessoa. A dificuldade vem de
  // tabuleiros maiores, menos números e deduções mais longas.
  { n: 7, maxLevel: 2, styles: ["fio", "paredes", "labirinto"], extra: 0 },     // quinta
  { n: 8, maxLevel: 2, styles: ["fio", "paredes", "labirinto"], extra: 0 },     // sexta
  { n: 8, maxLevel: 2, styles: ["fio", "paredes", "labirinto"], extra: 0 },     // sábado
  { n: 9, maxLevel: 2, styles: ["fio", "paredes", "labirinto"], extra: 0 },     // domingo
];

function wallsFor(style, N, pathEdges, B0) {
  if (style === "fio") return [];
  const free = [];
  for (let e = 0; e < B0.E; e++) if (!pathEdges.has(e)) free.push(e);
  shuffle(free);
  const count = style === "paredes" ? 2 + rint(N - 2) : Math.round(N * N * (0.28 + rand() * 0.12));
  return free.slice(0, count);
}

export function makePuzzle(dayCfg, style) {
  const N = dayCfg.n, C = N * N;
  for (let attempt = 0; attempt < 60; attempt++) {
    const path = randomPath(N);
    const B0 = makeBoard(N, new Map(), []);
    const pathEdges = new Set();
    for (let k = 0; k + 1 < C; k++) pathEdges.add(edgeOf(B0, path[k], path[k + 1]));
    let walls = wallsFor(style, N, pathEdges, B0);
    const board = S => {
      const nums = new Map([...S].sort((a, b) => a - b).map((p, k) => [path[p], k + 1]));
      return makeBoard(N, nums, walls);
    };
    const unique = S => { const r = countSolutions(board(S), 2); return r.aborted ? null : r; };

    // 1. números espalhados até a solução ser única
    const S = new Set([0, C - 1]);
    const step = style === "labirinto" ? 9 : 4;
    for (let p = 1 + rint(step); p < C - 1; p += 2 + rint(step)) S.add(p);
    let res = unique(S), guard = 0;
    while (res && res.sols.length > 1 && guard++ < C) {
      const alt = pathFromEdges(board(S), res.sols.find(s => pathFromEdges(board(S), s).some((x, k) => x !== path[k])));
      const diff = [];
      for (let k = 1; k < C - 1; k++) if (alt[k] !== path[k] && !S.has(k)) diff.push(k);
      if (!diff.length) break;
      S.add(pick(diff));
      res = unique(S);
    }
    if (!res || res.sols.length !== 1) continue;

    // 2. tira números (e, no labirinto, paredes) enquanto continuar único
    for (const p of shuffle([...S].filter(p => p !== 0 && p !== C - 1))) {
      S.delete(p);
      const r = unique(S);
      if (!r || r.sols.length !== 1) S.add(p);
    }
    if (style === "labirinto") {                          // no labirinto, tira também as paredes que sobram
      const keep = Math.round(walls.length * 0.6);
      for (const w of shuffle([...walls])) {
        if (walls.length <= keep) break;
        const before = walls;
        walls = walls.filter(x => x !== w);
        const r = unique(S);
        if (!r || r.sols.length !== 1) walls = before;
      }
    }

    // 3. resolvível só com dedução, dentro do nível do dia (devolve números se precisar)
    let logic = logicSolve(board(S), dayCfg.maxLevel), added = 0;
    const addBack = st => {
      // escolhe um ponto do caminho perto de onde o resolvedor travou
      const B = board(S), open = [];
      for (let k = 1; k < C - 1; k++) if (!S.has(k) && B.cellEdges[path[k]].some(e => st[e] === 0)) open.push(k);
      if (!open.length) return false;
      S.add(pick(open)); added++; return true;
    };
    while (logic && logic.stuck && addBack(logic.st)) logic = logicSolve(board(S), dayCfg.maxLevel);
    if (!logic || logic.stuck) continue;
    for (let k = 0; k < dayCfg.extra; k++) {             // dias mais leves ganham uns números a mais
      const open = [];
      for (let p = 2; p < C - 2; p++) if (!S.has(p) && !S.has(p - 1) && !S.has(p + 1)) open.push(p);
      if (open.length) S.add(pick(open));
    }
    logic = logicSolve(board(S), 3);
    const B = board(S);
    const nums = [...S].sort((a, b) => a - b).map(p => path[p]);
    return {
      n: N,
      s: style,
      k: nums.join(","),                                        // casas dos números, em ordem (1, 2, 3…)
      w: walls.map(e => B.eA[e] + (B.eB[e] === B.eA[e] + 1 ? "r" : "d")).join(","),   // parede à direita (r) ou abaixo (d) da casa
      d: logic.score,                                           // esforço de dedução
      lv: logic.level,
    };
  }
  throw new Error("não consegui gerar um desafio");
}

// ---------- execução ----------
export const EPOCH = [2026, 8, 28];            // #1 = segunda, 28/09/2026
const dayIdx = date => (date.getDay() + 6) % 7;  // segunda → 0 … domingo → 6
const FREE_PER_DAY = 20;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DAYS = +(process.argv[2] || 364);
  if (process.argv[3]) seed = +process.argv[3];
  const t0 = Date.now();
  // Para cada dia da semana, gera candidatos e escolhe pelo esforço:
  // o dia recebe um desafio da faixa certa, e os estilos se alternam.
  const need = new Array(7).fill(0);
  for (let k = 0; k < DAYS; k++) need[dayIdx(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k))]++;
  // Segunda, quinta e sexta ficam com a metade mais fácil dos candidatos do
  // seu tamanho/nível; os outros dias, com a mais difícil. Assim o esforço
  // sobe dia a dia: seg < ter < qua < qui < sex < sáb < dom.
  const pools = [];
  for (let w = 0; w < 7; w++) {
    const cfg = WEEK[w], cand = [];
    const total = 2 * need[w] + FREE_PER_DAY;
    for (let k = 0; k < total; k++) cand.push(makePuzzle(cfg, cfg.styles[k % cfg.styles.length]));
    cand.forEach(p => (p.q = rand()));
    // metade mais fácil (ou mais difícil) dentro de cada estilo, para os estilos variarem
    const easy = w === 0 || w === 3 || w === 4;
    let chosen = [], rest = [];
    for (const style of new Set(cfg.styles)) {
      const g = cand.filter(p => p.s === style).sort((a, b) => a.d - b.d || a.q - b.q);
      const h = Math.floor(g.length / 2);
      chosen.push(...(easy ? g.slice(0, h) : g.slice(g.length - h)));
      rest.push(...(easy ? g.slice(h) : g.slice(0, g.length - h)));
    }
    shuffle(chosen);
    rest.push(...chosen.splice(need[w]));
    const extra = shuffle(rest).slice(0, FREE_PER_DAY);
    pools.push({ chosen: shuffle(chosen), extra });
    const ds = chosen.map(p => p.d).sort((a, b) => a - b);
    const st = {}; chosen.forEach(p => (st[p.s] = (st[p.s] || 0) + 1));
    console.log(`dia ${w + 1} (${cfg.n}×${cfg.n}): esforço ${ds[0]}–${ds.at(-1)} (mediana ${ds[ds.length >> 1]}) · ${JSON.stringify(st)} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
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
