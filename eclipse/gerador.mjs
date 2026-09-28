// Gerador de desafios do Eclipse.
//
// Regras do jogo: grade N×N dividida em N regiões. Cada linha, cada coluna e
// cada região tem exatamente um sol e uma lua, e nenhuma peça encosta em outra
// (nem na diagonal). Algumas peças começam reveladas para a solução ser única.
//
// Uso:  node eclipse/gerador.mjs [dias] [tamanho-padrão] [semente]
// Gera eclipse/desafios.json (um desafio por dia) e eclipse/livre.json (jogo livre). Cada desafio é conferido pelo solucionador abaixo:
// só entra se tiver exatamente uma solução.

import { writeFileSync, readFileSync } from "node:fs";
import { mantidos, escolher } from "../comum/selecao.mjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const COUNT = +(process.argv[2] || 730);
let N = +(process.argv[3] || 9);
export function setN(n) { N = n; }
export function setSeed(s) { seed = s; }
let seed = +(process.argv[4] || 20260927);

// ---------- aleatório com semente (reprodutível) ----------
function rand() {           // mulberry32
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rint = n => Math.floor(rand() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- 1. solução aleatória ----------
// sun[r], moon[r] = coluna do sol e da lua na linha r
function randomSolution() {
  const sun = [], moon = [];
  const full = (1 << N) - 1;
  function rec(r, colS, colM, prev) {
    if (r === N) return true;
    const blocked = prev | (prev << 1) | (prev >> 1);
    const cols = shuffle([...Array(N).keys()]);
    for (const s of cols) {
      if ((colS >> s) & 1 || (blocked >> s) & 1) continue;
      for (const m of shuffle([...Array(N).keys()])) {
        if (m === s || Math.abs(m - s) < 2 || (colM >> m) & 1 || (blocked >> m) & 1) continue;
        sun[r] = s; moon[r] = m;
        if (rec(r + 1, colS | (1 << s), colM | (1 << m), ((1 << s) | (1 << m)) & full)) return true;
      }
    }
    return false;
  }
  return rec(0, 0, 0, 0) ? { sun: [...sun], moon: [...moon] } : null;
}

// ---------- 2. regiões ----------
// Cada região recebe um par sol+lua ligado por um caminho, depois cresce aleatoriamente.
function makeRegions(sol) {
  const reg = new Array(N * N).fill(-1);
  const sym = new Array(N * N).fill(0);           // 1 = sol, 2 = lua
  const suns = [], moons = [];
  for (let r = 0; r < N; r++) {
    sym[r * N + sol.sun[r]] = 1; suns.push(r * N + sol.sun[r]);
    sym[r * N + sol.moon[r]] = 2; moons.push(r * N + sol.moon[r]);
  }
  const dist = (a, b) => Math.abs(((a / N) | 0) - ((b / N) | 0)) + Math.abs((a % N) - (b % N));
  const nb = i => { const r = (i / N) | 0, c = i % N, o = [];
    if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; };

  // pareamento guloso: cada sol pega a lua livre mais próxima (com um pouco de acaso)
  const freeMoons = new Set(moons);
  const order = shuffle([...suns]);
  const pairs = [];
  for (const s of order) {
    const cand = [...freeMoons].sort((a, b) => dist(s, a) - dist(s, b) + (rand() - .5) * 1.5);
    const m = cand[0]; freeMoons.delete(m); pairs.push([s, m]);
  }
  // liga cada par por um caminho que não passe por outras peças nem por outras regiões
  for (let k = 0; k < N; k++) {
    const [s, m] = pairs[k];
    const prev = new Map([[s, -1]]), q = [s];
    while (q.length) {
      const x = q.shift(); if (x === m) break;
      for (const y of shuffle(nb(x))) {
        if (prev.has(y)) continue;
        if (reg[y] !== -1) continue;
        if (sym[y] && y !== m) continue;
        prev.set(y, x); q.push(y);
      }
    }
    if (!prev.has(m)) return null;
    for (let x = m; x !== -1; x = prev.get(x)) reg[x] = k;
  }
  // crescimento: células livres entram na região vizinha, preferindo as menores
  const size = new Array(N).fill(0); reg.forEach(v => v >= 0 && size[v]++);
  let left = reg.filter(v => v < 0).length;
  while (left) {
    const cand = [];
    for (let i = 0; i < N * N; i++) if (reg[i] < 0) {
      const rs = [...new Set(nb(i).map(j => reg[j]).filter(v => v >= 0))];
      if (rs.length) cand.push([i, rs]);
    }
    const [i, rs] = cand[rint(cand.length)];
    rs.sort((a, b) => size[a] - size[b] + (rand() - .5) * 3);
    reg[i] = rs[0]; size[rs[0]]++; left--;
  }
  return reg;
}

// ---------- 3. solucionador: conta soluções (até `limit`) ----------
// givens: Map(celula -> 1 sol | 2 lua)
export function solve(reg, givens, limit = 2) {
  const sols = [];
  let nodes = 0;
  const gRow = Array.from({ length: N }, () => ({ s: -1, m: -1 }));
  for (const [i, v] of givens) { const r = (i / N) | 0, c = i % N; if (v === 1) gRow[r].s = c; else gRow[r].m = c; }
  const sun = [], moon = [];
  function rec(r, colS, colM, regS, regM, prev) {
    if (sols.length >= limit) return;
    nodes++;
    if (r === N) { sols.push({ sun: [...sun], moon: [...moon] }); return; }
    const blocked = prev | (prev << 1) | (prev >> 1);
    const g = gRow[r];
    for (let s = 0; s < N; s++) {
      if (g.s >= 0 && s !== g.s) continue;
      if (g.m === s) continue;
      if ((colS >> s) & 1 || (blocked >> s) & 1) continue;
      const rs = reg[r * N + s]; if ((regS >> rs) & 1) continue;
      for (let m = 0; m < N; m++) {
        if (g.m >= 0 && m !== g.m) continue;
        if (g.s === m) continue;
        if (Math.abs(m - s) < 2 || (colM >> m) & 1 || (blocked >> m) & 1) continue;
        const rm = reg[r * N + m]; if ((regM >> rm) & 1) continue;
        sun[r] = s; moon[r] = m;
        rec(r + 1, colS | (1 << s), colM | (1 << m), regS | (1 << rs), regM | (1 << rm), (1 << s) | (1 << m));
        if (sols.length >= limit) return;
      }
    }
  }
  rec(0, 0, 0, 0, 0, 0);
  return { sols, nodes };
}

// ---------- 3b. resolvedor "humano": só deduções, sem chute ----------
// Cada célula guarda candidatos: bit 1 = pode ser sol, bit 2 = pode ser lua.
// Só deduções diretas, que uma pessoa confere olhando o tabuleiro, sem nunca
// supor uma peça para ver o que acontece (nem por um passo): a dificuldade vem
// da quantidade de verificações, nunca de tentativa e erro.
//   nível 1: vizinhas de uma peça ficam vazias; a unidade (linha, coluna, região)
//            que já tem um sol não tem outro; se só sobra um lugar para o sol
//            numa unidade, ele vai ali; e confinamento de 1 (os sóis de uma
//            região só cabem numa linha → nenhum outro sol nessa linha).
//   nível 2: confinamento com 2 unidades (os sóis de 2 regiões só cabem em
//            2 linhas → nenhum outro sol nessas linhas).
//   nível 3: confinamento com 3 unidades.
export function logicSolve(reg, givens, maxLevel = 3) {
  const C = N * N;
  const cand = new Array(C).fill(3), val = new Array(C).fill(0);
  const rowOf = i => (i / N) | 0, colOf = i => i % N;
  const units = [];
  for (let r = 0; r < N; r++) units.push([...Array(N)].map((_, c) => r * N + c));
  for (let c = 0; c < N; c++) units.push([...Array(N)].map((_, r) => r * N + c));
  for (let k = 0; k < N; k++) units.push([...Array(C).keys()].filter(i => reg[i] === k));
  const unitsOf = i => [units[rowOf(i)], units[N + colOf(i)], units[2 * N + reg[i]]];
  const around = i => { const r = rowOf(i), c = colOf(i), o = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue; const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < N && cc >= 0 && cc < N) o.push(rr * N + cc); }
    return o; };

  function place(cd, vl, i, x) {           // coloca x (1|2) em i e propaga o básico
    if (!(cd[i] & x)) return false;
    vl[i] = x; cd[i] = x;
    for (const j of around(i)) { cd[j] = 0; if (vl[j]) return false; }
    for (const u of unitsOf(i)) for (const j of u) if (j !== i) cd[j] &= ~x;
    return true;
  }
  function basic(cd, vl) {                  // nível 1 até estabilizar; false = contradição
    let changed = true;
    while (changed) {
      changed = false;
      for (const u of units) for (const x of [1, 2]) {
        if (u.some(i => vl[i] === x)) continue;
        const spots = u.filter(i => cd[i] & x);
        if (!spots.length) return false;
        if (spots.length === 1) { if (!place(cd, vl, spots[0], x)) return false; changed = true; }
      }
    }
    return true;
  }
  const done = () => val.filter(Boolean).length === 2 * N;

  for (const [i, v] of givens) if (!place(cand, val, i, v)) return null;
  let level = 1;
  const uses = { c1: 0, c2: 0, c3: 0, probe: 0 }, elim = { c1: 0, c2: 0, c3: 0, probe: 0 };   // probe fica sempre 0 (não há mais teste)
  const combos = k => { const out = [], rec = (s, a) => { if (a.length === k) { out.push([...a]); return; } for (let i = s; i < N; i++) { a.push(i); rec(i + 1, a); a.pop(); } }; rec(0, []); return out; };
  const C1 = combos(1), C2 = combos(2), C3 = combos(3);

  function confinement(k) {                 // devolve quantas eliminações fez
    const sets = k === 1 ? C1 : k === 2 ? C2 : C3;
    let any = 0;
    // pares de famílias: regiões×linhas, regiões×colunas, linhas×regiões, colunas×regiões
    const fam = [[2, 0], [2, 1], [0, 2], [1, 2]];
    for (const [a, b] of fam) for (const x of [1, 2]) for (const set of sets) {
      const us = set.map(s => units[a * N + s]);
      if (us.some(u => u.some(i => val[i] === x))) continue;
      const cov = new Set();
      for (const u of us) for (const i of u) if (cand[i] & x)
        cov.add(b === 0 ? rowOf(i) : b === 1 ? colOf(i) : reg[i]);
      if (cov.size !== k) continue;
      const inside = new Set(us.flat());
      for (const t of cov) for (const i of units[b * N + t])
        if (!inside.has(i) && (cand[i] & x) && !val[i]) { cand[i] &= ~x; any++; }
    }
    return any;
  }
  for (let guard = 0; guard < 500; guard++) {
    if (!basic(cand, val)) return null;
    // esforço: rodadas de cada técnica (peso maior) + eliminações feitas por elas (dá uma escala mais fina)
    if (done()) return { level, uses, score: 3 * uses.c1 + 10 * uses.c2 + 8 * uses.probe + 25 * uses.c3 + elim.c1 + elim.c2 + elim.probe + 2 * elim.c3 };
    { const e = confinement(1); if (e) { uses.c1++; elim.c1 += e; continue; } }
    if (maxLevel >= 2) { const e = confinement(2); if (e) { level = Math.max(level, 2); uses.c2++; elim.c2 += e; continue; } }
    if (maxLevel >= 3) { const e = confinement(3); if (e) { level = 3; uses.c3++; elim.c3 += e; continue; } }
    return { stuck: true, cand, val };
  }
  return null;
}

// ---------- 4. monta um desafio com solução única ----------
export function makePuzzle(maxLevel = 3, maxGivens = N <= 8 ? 7 : 6) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const sol = randomSolution(); if (!sol) continue;
    const reg = makeRegions(sol); if (!reg) continue;
    const truth = new Map();
    for (let r = 0; r < N; r++) { truth.set(r * N + sol.sun[r], 1); truth.set(r * N + sol.moon[r], 2); }
    // começa revelando uma peça (quebra a troca geral sol↔lua) e adiciona pistas só se precisar
    const givens = new Map();
    const cells = shuffle([...truth.keys()]);
    givens.set(cells[0], truth.get(cells[0]));
    let res = solve(reg, givens, 2);
    while (res.sols.length > 1 && givens.size < (N <= 8 ? 6 : 3)) {   // tabuleiros menores precisam de mais peças reveladas
      const alt = res.sols.find(s => s.sun.some((c, r) => c !== sol.sun[r]) || s.moon.some((c, r) => c !== sol.moon[r]));
      const altMap = new Map(); for (let r = 0; r < N; r++) { altMap.set(r * N + alt.sun[r], 1); altMap.set(r * N + alt.moon[r], 2); }
      const diff = shuffle([...truth.keys()].filter(i => !givens.has(i) && altMap.get(i) !== truth.get(i)));
      givens.set(diff[0], truth.get(diff[0]));
      res = solve(reg, givens, 2);
    }
    if (res.sols.length !== 1) continue;
    // precisa ser resolvível só com dedução; se travar, revela mais uma peça (até 4)
    let logic = logicSolve(reg, givens, maxLevel);
    while (logic && logic.stuck && givens.size < maxGivens) {
      const open = shuffle([...truth.keys()].filter(i => !logic.val[i]));
      givens.set(open[0], truth.get(open[0]));
      logic = logicSolve(reg, givens, maxLevel);
    }
    if (!logic || logic.stuck) continue;
    return {
      r: reg.map(v => v.toString(36)).join(""),                              // regiões, uma letra por célula
      g: [...givens].map(([i, v]) => (v === 1 ? "S" : "M") + i).join(","),  // pistas: S40 = sol na célula 40
      d: logic.score,                                                        // esforço de dedução (maior = mais difícil)
      lv: logic.level,                                                       // técnica mais difícil exigida (1 a 3)
      // interesse: poucas peças reveladas e variedade de técnicas (não só casas únicas)
      i: -3 * givens.size + (logic.uses.c1 > 0) + 2 * (logic.uses.c2 > 0) + 2 * (logic.uses.probe > 0) + 3 * (logic.uses.c3 > 0)
         + 0.5 * Math.min(logic.uses.c1 + logic.uses.c2 + logic.uses.probe + logic.uses.c3, 8),
      n: N,                                                                  // tamanho do tabuleiro
    };
  }
  throw new Error("não consegui gerar um desafio");
}

// ---------- execução ----------
// Monta a agenda: um desafio por dia a partir de 27/09/2026 (desafio #1).
// A dificuldade sobe ao longo da semana — segunda = nível 1 … domingo = nível 7 —
// e o tabuleiro cresce junto: 8×8 no começo da semana, 9×9 no meio, 10×10 no fim.
// Cada dia gera vários candidatos do seu tamanho e fica com uma faixa de esforço.
// Os dias que já foram publicados (até hoje) continuam iguais.
// Também gera eclipse/livre.json: desafios extras para o "jogo livre", fora da agenda.
// (7×7 não tem solução com um sol e uma lua por linha sem encostar.)
export const EPOCH = [2026, 8, 27];            // ano, mês (0 = jan), dia
// maxLevel: técnica mais difícil permitida (veja logicSolve); min: técnica mínima exigida
const WEEK = [                                 // segunda … domingo
  { n: 8, maxLevel: 1, min: 1, band: [0, 0.6] },
  { n: 8, maxLevel: 2, min: 1, band: [0.5, 1] },
  { n: 9, maxLevel: 2, min: 2, band: [0, 0.6] },
  { n: 9, maxLevel: 2, min: 2, band: [0.5, 1] },
  { n: 9, maxLevel: 3, min: 2, band: [0.5, 1] },
  { n: 10, maxLevel: 3, min: 2, band: [0.4, 0.9] },
  { n: 10, maxLevel: 3, min: 2, band: [0.75, 1] },       // domingo: o quarto mais trabalhoso (inclui os de confinamento de 3)
];
const levelOfDay = date => (date.getDay() + 6) % 7;   // segunda → 0 … domingo → 6
const FREE_PER_LEVEL = 200;                            // jogo livre: desafios por nível

// Os desafios que já saíram continuam iguais (comum/selecao.mjs); dentro da faixa de
// esforço de cada dia, os mais interessantes vão para o desafio do dia e o resto
// para o jogo livre.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DAYS = COUNT, t0 = Date.now();
  const dir = dirname(fileURLToPath(import.meta.url));
  // o de hoje (#2, 28/09) também é refeito: saiu com a regra antiga, que às vezes exigia tentativa e erro
  const old = mantidos(dir, EPOCH, process.argv.includes("--refaz-hoje")).map(p => ({ n: 9, ...p }));
  const need = new Array(7).fill(0);
  for (let k = old.length; k < DAYS; k++) need[levelOfDay(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k))]++;
  const bins = [], free = [];
  for (let l = 0; l < 7; l++) {
    const { n, band, maxLevel, min } = WEEK[l];
    N = n;
    const per = Math.ceil((need[l] + FREE_PER_LEVEL) / (band[1] - band[0]) * 1.05);
    const pool = [];
    while (pool.length < per) { const p = makePuzzle(maxLevel); if (p.lv >= min) pool.push(p); }
    const sel = escolher(pool, need[l], FREE_PER_LEVEL, band, rand);
    bins.push(sel.dia.map(({ lv, ...p }) => p));
    for (const { lv, ...p } of sel.livre) free.push({ ...p, l: l + 1 });
    console.log(`nível ${l + 1} (${n}×${n}): ${per} candidatos · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const out = [...old];
  for (let k = old.length; k < DAYS; k++) {
    const l = levelOfDay(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k));
    out.push({ ...bins[l].shift(), l: l + 1 });
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ n: 9, epoch: EPOCH, puzzles: out }));
  writeFileSync(join(dir, "livre.json"), JSON.stringify({ n: 9, puzzles: free }));
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) + ${free.length} livres, em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  for (let l = 0; l < 7; l++) {
    const ds = out.slice(old.length).filter(p => p.l === l + 1).map(p => p.d).sort((a, b) => a - b);
    console.log(`nível ${l + 1} (${WEEK[l].n}×${WEEK[l].n}): ${ds.length} dias · esforço ${ds[0]}–${ds.at(-1)} (mediana ${ds[ds.length >> 1]})`);
  }
}
