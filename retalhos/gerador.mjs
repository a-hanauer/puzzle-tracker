// Gerador de desafios do Retalhos.
//
// Cada desafio sai de uma divisão aleatória do tabuleiro em retângulos (a
// "colcha"). Cada retângulo recebe uma etiqueta numa casa sorteada, com o
// formato e o número de casas. Depois, conforme o estilo do dia, o gerador
// esconde informações das etiquetas (o número, ou o formato) enquanto a
// solução continuar única e resolvível só com dedução, no nível do dia.
//
// Estilos:
//   "colcha"   — retalhos variados; esconde um pouco de tudo
//   "formas"   — quase todas as etiquetas mostram só o formato
//   "numeros"  — quase todas mostram só o número (formato livre)
//   "grandes"  — poucos retalhos, grandes
//   "miudos"   — muitos retalhos pequenos
//
// Uso:  node retalhos/gerador.mjs [dias] [semente]

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mantidos, escolher } from "../comum/selecao.mjs";
import { dirname, join } from "node:path";
import { shapeOf, countSolutions, logicSolve } from "./motor.mjs";

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

// ---------- divisão aleatória em retângulos ----------
// Sempre preenche a primeira casa livre (em ordem de leitura) com um
// retângulo sorteado que caiba no espaço livre.
function randomPartition(N, style) {
  const C = N * N, used = new Uint8Array(C), rects = [];
  const maxA = { grandes: N + 6, miudos: 5, colcha: N + 2, formas: N + 2, numeros: N + 2 }[style];
  const minA = style === "grandes" ? 3 : 1;
  for (let i = 0; i < C; i++) {
    if (used[i]) continue;
    const r0 = (i / N) | 0, c0 = i % N;
    const opts = [];
    for (let h = 1; r0 + h <= N; h++) for (let w = 1; c0 + w <= N; w++) {
      const a = h * w;
      if (a > maxA) continue;
      let ok = true;
      for (let r = r0; r < r0 + h && ok; r++) for (let c = c0; c < c0 + w; c++) if (used[r * N + c]) { ok = false; break; }
      if (!ok) continue;
      // peso: evita 1×1 e tiras muito finas e compridas
      let wt = a === 1 ? 0.15 : a < minA ? 0.2 : 1;
      if (Math.max(h, w) >= 5 && Math.min(h, w) === 1) wt *= 0.35;
      if (style === "miudos" && a > 3) wt *= 0.6;
      if (style === "grandes") wt *= Math.min(3, a / 3);
      opts.push({ h, w, wt });
    }
    let t = rand() * opts.reduce((s, o) => s + o.wt, 0), o = opts[0];
    for (const x of opts) { t -= x.wt; if (t <= 0) { o = x; break; } }
    for (let r = r0; r < r0 + o.h; r++) for (let c = c0; c < c0 + o.w; c++) used[r * N + c] = 1;
    rects.push({ r0, c0, h: o.h, w: o.w });
  }
  return rects;
}

// cores: vizinhos nunca com a mesma cor (6 tecidos)
function colorize(N, rects) {
  const owner = new Int16Array(N * N);
  rects.forEach((q, k) => { for (let r = q.r0; r < q.r0 + q.h; r++) for (let c = q.c0; c < q.c0 + q.w; c++) owner[r * N + c] = k; });
  const nb = rects.map(() => new Set());
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const a = owner[r * N + c];
    if (c < N - 1 && owner[r * N + c + 1] !== a) { nb[a].add(owner[r * N + c + 1]); nb[owner[r * N + c + 1]].add(a); }
    if (r < N - 1 && owner[(r + 1) * N + c] !== a) { nb[a].add(owner[(r + 1) * N + c]); nb[owner[(r + 1) * N + c]].add(a); }
  }
  for (let t = 0; t < 50; t++) {
    const col = new Int8Array(rects.length).fill(-1), use = new Int32Array(6);
    let ok = true;
    for (const k of shuffle([...rects.keys()])) {
      const bad = new Set([...nb[k]].map(o => col[o]));
      const free = [0, 1, 2, 3, 4, 5].filter(x => !bad.has(x));
      if (!free.length) { ok = false; break; }
      free.sort((a, b) => use[a] - use[b] || rand() - 0.5);   // espalha as cores
      col[k] = free[0]; use[free[0]]++;
    }
    if (ok) return col;
  }
  return rects.map((_, k) => k % 6);
}

export const WEEK = [
  { n: 6, maxLevel: 1, hide: [0, 0.15], styles: ["colcha", "grandes"] },                 // segunda
  { n: 6, maxLevel: 2, hide: [0.3, 0.5], styles: ["colcha", "numeros", "miudos"] },      // terça
  { n: 7, maxLevel: 2, hide: [0.4, 0.6], styles: ["colcha", "formas", "numeros", "grandes"] }, // quarta
  // da quinta em diante, no máximo o nível 2: o nível 3 (testar uma opção e seguir a
  // propagação até ver contradição) é chute para uma pessoa. A dificuldade vem de
  // tabuleiros maiores, etiquetas com menos informação e deduções mais longas.
  { n: 7, maxLevel: 2, hide: [0.5, 0.8], styles: ["colcha", "formas", "miudos"] },       // quinta
  { n: 8, maxLevel: 2, hide: [0.5, 0.8], styles: ["colcha", "formas", "grandes"] },      // sexta
  { n: 8, maxLevel: 2, hide: [0.7, 1], styles: ["colcha", "formas", "miudos"] },         // sábado
  { n: 9, maxLevel: 2, hide: [0.8, 1], styles: ["colcha", "formas", "grandes"] },        // domingo
];

export function makePuzzle(cfg, style) {
  const N = cfg.n;
  for (let attempt = 0; attempt < 200; attempt++) {
    const rects = randomPartition(N, style);
    if (rects.length < N) continue;
    // colcha equilibrada: formatos variados e poucos retalhos 1×1
    const cnt = { q: 0, l: 0, a: 0 };
    rects.forEach(q => cnt[shapeOf(q.h, q.w)]++);
    if (Math.max(cnt.q, cnt.l, cnt.a) > 0.5 * rects.length || !cnt.l || !cnt.a) continue;
    if (rects.filter(q => q.h * q.w === 1).length > (N >= 8 ? 2 : 1)) continue;
    const clues = rects.map(q => ({
      i: (q.r0 + rint(q.h)) * N + q.c0 + rint(q.w),
      f: shapeOf(q.h, q.w),
      n: q.h * q.w,
    }));
    const uniq = cl => { const r = countSolutions(N, cl, 2); return !r.aborted && r.sols.length === 1; };
    if (!uniq(clues)) {
      // tenta mudar a etiqueta de lugar dentro do próprio retângulo
      let fixed = false;
      for (let t = 0; t < 30 && !fixed; t++) {
        const k = rint(clues.length), q = rects[k];
        clues[k].i = (q.r0 + rint(q.h)) * N + q.c0 + rint(q.w);
        fixed = uniq(clues);
      }
      if (!fixed) continue;
    }
    const lv0 = logicSolve(N, clues, cfg.maxLevel);
    if (!lv0 || lv0.stuck) continue;

    // esconde informações das etiquetas, no espírito do estilo
    const target = cfg.hide[0] + rand() * (cfg.hide[1] - cfg.hide[0]);
    const want = Math.round(target * clues.length);
    let hidden = 0;
    for (const k of shuffle([...clues.keys()])) {
      if (hidden >= want) break;
      const c = clues[k];
      const tries = style === "formas" ? ["n", "f"] : style === "numeros" ? ["f", "n"] : shuffle(["n", "f"]);
      for (const what of tries) {
        if (what === "n" && c.n === 1) continue;           // 1×1 sem número ficaria sem graça
        const old = { ...c };
        if (what === "n") c.n = 0; else c.f = "*";
        if (!c.n && c.f === "*") { Object.assign(c, old); continue; }
        const ok = uniq(clues) && (() => { const l = logicSolve(N, clues, cfg.maxLevel); return l && !l.stuck; })();
        if (ok) { hidden++; break; }
        Object.assign(c, old);
      }
    }
    const logic = logicSolve(N, clues, 3);
    const col = colorize(N, rects);
    return {
      n: N, s: style,
      // etiquetas: casa + formato + número (vazio = sem número). Ex.: "14q4", "3l", "20*6"
      e: clues.map(c => `${c.i}${c.f}${c.n || ""}`).join(","),
      c: [...col].join(""),                                  // cor de cada retalho
      d: logic.score, lv: logic.level,
      // interesse: etiquetas com informação escondida, formatos variados, poucos 1×1
      i: 2 * clues.filter(c => !c.n || c.f === "*").length + 3 * new Set(rects.map(q => shapeOf(q.h, q.w))).size
         - 3 * rects.filter(q => q.h * q.w === 1).length + logic.stats.l2,
    };
  }
  throw new Error("não consegui gerar um desafio");
}

// ---------- execução ----------
export const EPOCH = [2026, 8, 28];            // #1 = segunda, 28/09/2026
const dayIdx = date => (date.getDay() + 6) % 7;  // segunda → 0 … domingo → 6
const FREE_PER_DAY = 200;                      // jogo livre: desafios por nível (dia da semana)

// Cada dia da semana gera muitos candidatos e fica com uma faixa de esforço, para a
// dificuldade subir de segunda a domingo; dentro da faixa, os mais interessantes vão
// para o desafio do dia e o resto para o jogo livre (comum/selecao.mjs).
// Os desafios que já saíram continuam iguais.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DAYS = +(process.argv[2] || 730);
  if (process.argv[3]) seed = +process.argv[3];
  const t0 = Date.now();
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const need = new Array(7).fill(0);
  for (let k = old.length; k < DAYS; k++) need[dayIdx(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k))]++;
  const BAND = [[0, 0.3], [0.6, 1], [0.6, 1], [0.8, 1], [0.7, 1], [0.7, 1], [0.8, 1]];
  const MULT = [5, 5, 5, 5, 5, 5, 5];                        // candidatos por desafio do dia
  const pools = [];
  for (let w = 0; w < 7; w++) {
    const cfg = WEEK[w], cand = [], [b0, b1] = BAND[w];
    const total = Math.ceil(Math.max(MULT[w] * need[w], (need[w] + FREE_PER_DAY) / (b1 - b0) * 1.05));
    for (let k = 0; k < total; k++) cand.push(makePuzzle(cfg, cfg.styles[k % cfg.styles.length]));
    const sel = escolher(cand, need[w], FREE_PER_DAY, BAND[w], rand);
    pools.push(sel);
    const ds = sel.dia.map(p => p.d).sort((a, b) => a - b);
    const st = {}; sel.dia.forEach(p => (st[p.s] = (st[p.s] || 0) + 1));
    console.log(`dia ${w + 1} (${cfg.n}×${cfg.n}): ${total} candidatos · esforço do dia ${ds[0]}–${ds.at(-1)} (mediana ${ds[ds.length >> 1]}) · ${JSON.stringify(st)} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const out = [...old];
  for (let k = old.length; k < DAYS; k++) {
    const w = dayIdx(new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k));
    out.push({ ...pools[w].dia.shift(), l: w + 1 });
  }
  const free = [];
  for (let w = 0; w < 7; w++) for (const p of pools[w].livre) free.push({ ...p, l: w + 1 });
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  writeFileSync(join(dir, "livre.json"), JSON.stringify({ puzzles: free }));
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) + ${free.length} livres em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
