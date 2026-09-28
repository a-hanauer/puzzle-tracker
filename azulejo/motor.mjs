// Motor do Azulejo (antigo Retalhos): regras, dedução "humana" e contagem de soluções.
//
// Regras (iguais às do Patches, do LinkedIn): dividir o tabuleiro em
// retângulos, sem sobrar casa e sem sobrepor. Cada retângulo contém
// exatamente uma etiqueta, e a etiqueta diz:
//   · o formato: quadrado (q), largo (l = mais largo que alto), alto (a),
//     ou qualquer (*);
//   · e/ou o número de casas do retângulo.
//
// Uma etiqueta: { i: casa, f: "q" | "l" | "a" | "*", n: número ou 0 (sem número) }

export const shapeOf = (h, w) => (h === w ? "q" : w > h ? "l" : "a");

export function fits(clue, h, w) {
  if (clue.n && h * w !== clue.n) return false;
  if (clue.f !== "*" && shapeOf(h, w) !== clue.f) return false;
  return true;
}

// todos os retângulos possíveis para cada etiqueta
export function candidates(N, clues) {
  const at = new Int16Array(N * N).fill(-1);
  clues.forEach((c, k) => (at[c.i] = k));
  // soma de prefixos para contar etiquetas dentro de um retângulo
  const P = new Int32Array((N + 1) * (N + 1));
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++)
    P[(r + 1) * (N + 1) + c + 1] = P[r * (N + 1) + c + 1] + P[(r + 1) * (N + 1) + c] - P[r * (N + 1) + c] + (at[r * N + c] >= 0 ? 1 : 0);
  const inside = (r0, c0, r1, c1) => P[(r1 + 1) * (N + 1) + c1 + 1] - P[r0 * (N + 1) + c1 + 1] - P[(r1 + 1) * (N + 1) + c0] + P[r0 * (N + 1) + c0];
  return clues.map(cl => {
    const R = (cl.i / N) | 0, Cc = cl.i % N, out = [];
    for (let r0 = 0; r0 <= R; r0++) for (let r1 = R; r1 < N; r1++)
      for (let c0 = 0; c0 <= Cc; c0++) for (let c1 = Cc; c1 < N; c1++) {
        const h = r1 - r0 + 1, w = c1 - c0 + 1;
        if (!fits(cl, h, w)) continue;
        if (inside(r0, c0, r1, c1) !== 1) continue;
        const cells = [];
        for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) cells.push(r * N + c);
        out.push({ r0, c0, h, w, cells });
      }
    return out;
  });
}

// conta soluções (até limit) — cobertura exata com uma peça por etiqueta
export function countSolutions(N, clues, limit = 2, budget = 3e5) {
  const cand = candidates(N, clues);
  const K = clues.length, C = N * N;
  const used = new Uint8Array(C), chosen = new Int32Array(K).fill(-1);
  const sols = [];
  let nodes = 0, aborted = false;
  const free = rc => rc.cells.every(i => !used[i]);
  function rec(left) {
    if (sols.length >= limit || aborted) return;
    if (++nodes > budget) { aborted = true; return; }
    if (!left) { if (used.every(Boolean)) sols.push([...chosen]); return; }
    // etiqueta com menos opções
    let best = -1, bestList = null;
    for (let k = 0; k < K; k++) if (chosen[k] < 0) {
      const list = [];
      for (let j = 0; j < cand[k].length; j++) if (free(cand[k][j])) list.push(j);
      if (!list.length) return;
      if (!bestList || list.length < bestList.length) { best = k; bestList = list; }
    }
    // toda casa vazia precisa caber em alguma opção restante
    const cover = new Uint8Array(C);
    for (let k = 0; k < K; k++) if (chosen[k] < 0) for (const rc of cand[k]) if (free(rc)) for (const i of rc.cells) cover[i] = 1;
    for (let i = 0; i < C; i++) if (!used[i] && !cover[i]) return;
    for (const j of bestList) {
      const rc = cand[best][j];
      for (const i of rc.cells) used[i] = 1;
      chosen[best] = j;
      rec(left - 1);
      chosen[best] = -1;
      for (const i of rc.cells) used[i] = 0;
      if (sols.length >= limit || aborted) return;
    }
  }
  rec(K);
  return { sols: sols.map(s => s.map((j, k) => cand[k][j])), nodes, aborted };
}

// Resolvedor "humano", sem chute. Técnicas:
//   nível 1 — etiqueta com uma opção só; casa que só uma opção alcança;
//             opções que batem numa peça já decidida saem.
//   nível 2 — casas que todas as opções de uma etiqueta ocupam são dela;
//             casa que só uma etiqueta alcança obriga essa etiqueta a cobri-la.
//   nível 3 — testar uma opção e ver que ela leva a contradição.
export function logicSolve(N, clues, maxLevel = 3) {
  const C = N * N, K = clues.length;
  const all = candidates(N, clues);
  let opts = all.map(l => l.map((_, j) => j));             // opções vivas por etiqueta
  const stats = { rounds: 0, l2: 0, probes: 0, elim: 0 };

  // propaga; devolve false em contradição
  function propagate(op, level, st) {
    for (let guard = 0; guard < 1000; guard++) {
      if (st) st.rounds++;
      let changed = false;
      // casas ocupadas por peças decididas
      const owner = new Int16Array(C).fill(-1);
      for (let k = 0; k < K; k++) if (op[k].length === 1) for (const i of all[k][op[k][0]].cells) {
        if (owner[i] >= 0) return false;
        owner[i] = k;
      }
      for (let k = 0; k < K; k++) {
        if (op[k].length <= 1) { if (!op[k].length) return false; continue; }
        const f = op[k].filter(j => all[k][j].cells.every(i => owner[i] < 0));
        if (f.length !== op[k].length) { op[k] = f; changed = true; if (!f.length) return false; }
      }
      if (changed) continue;
      // quem alcança cada casa
      const reach = [...Array(C)].map(() => []);
      for (let k = 0; k < K; k++) for (const j of op[k]) for (const i of all[k][j].cells) reach[i].push([k, j]);
      for (let i = 0; i < C; i++) {
        if (!reach[i].length) return false;
        if (owner[i] >= 0) continue;
        if (reach[i].length === 1) { const [k, j] = reach[i][0]; if (op[k].length > 1) { op[k] = [j]; changed = true; } }
      }
      if (changed) continue;
      if (level < 2) return true;
      let l2 = false;
      // casa que só uma etiqueta alcança
      for (let i = 0; i < C && !changed; i++) {
        if (owner[i] >= 0) continue;
        const ks = new Set(reach[i].map(x => x[0]));
        if (ks.size === 1) {
          const k = reach[i][0][0];
          const f = op[k].filter(j => all[k][j].cells.includes(i));
          if (f.length !== op[k].length) { op[k] = f; changed = l2 = true; }
        }
      }
      if (!changed) {
        // casas garantidas de uma etiqueta: tiram as opções das outras
        for (let k = 0; k < K && !changed; k++) {
          if (op[k].length < 2) continue;
          const cnt = new Map();
          for (const j of op[k]) for (const i of all[k][j].cells) cnt.set(i, (cnt.get(i) || 0) + 1);
          const sure = [...cnt].filter(([, n]) => n === op[k].length).map(([i]) => i);
          if (!sure.length) continue;
          const s = new Set(sure);
          for (let o = 0; o < K; o++) if (o !== k) {
            const f = op[o].filter(j => !all[o][j].cells.some(i => s.has(i)));
            if (f.length !== op[o].length) { op[o] = f; changed = l2 = true; if (!f.length) return false; }
          }
        }
      }
      if (l2 && st) st.l2++;
      if (!changed) return true;
    }
    return false;
  }
  const solved = op => op.every(l => l.length === 1);
  let level = 1;
  for (let guard = 0; guard < 300; guard++) {
    if (!propagate(opts, 1, stats)) return null;
    if (solved(opts)) return { level, stats, score: stats.rounds + 10 * stats.l2 + 60 * stats.probes + 3 * stats.elim, opts, all };
    if (maxLevel < 2) return { stuck: true, level, opts, all };
    const o2 = opts.map(l => [...l]), tmp = { rounds: 0, l2: 0 };
    if (!propagate(o2, 2, tmp)) return null;
    const size = op => op.reduce((s, l) => s + l.length, 0);
    if (size(o2) < size(opts)) { opts = o2; level = Math.max(level, 2); stats.l2 += Math.max(1, tmp.l2); continue; }
    if (maxLevel < 3) return { stuck: true, level, opts, all };
    let found = 0;
    for (let k = 0; k < K; k++) if (opts[k].length > 1) {
      for (const j of [...opts[k]]) {
        const t = opts.map(l => [...l]); t[k] = [j];
        if (!propagate(t, 2)) { opts[k] = opts[k].filter(x => x !== j); found++; }
      }
    }
    if (!found) return { stuck: true, level, opts, all };
    level = 3; stats.probes++; stats.elim += found;
  }
  return null;
}
