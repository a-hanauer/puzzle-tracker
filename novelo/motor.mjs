// Motor do Novelo: regras, dedução "humana" e contagem de soluções.
//
// Regras (iguais às do Zip, do LinkedIn): um único caminho passa por todas as
// casas do tabuleiro, uma vez cada, andando só na horizontal e na vertical.
// Ele começa no 1, passa pelos números em ordem e termina no último número.
// Paredes entre casas não podem ser atravessadas.
//
// Representação: cada ligação entre duas casas vizinhas é uma "aresta" com
// estado 0 = indefinida, 1 = o fio passa por ela, -1 = não passa (ou parede).

export function makeBoard(N, nums, walls) {
  // nums: Map(casa -> número), walls: Set(aresta)
  const C = N * N, eA = [], eB = [], cellEdges = [...Array(C)].map(() => []);
  const edgeId = new Map();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const i = r * N + c;
    if (c < N - 1) { edgeId.set(i + ":" + (i + 1), eA.length); cellEdges[i].push(eA.length); cellEdges[i + 1].push(eA.length); eA.push(i); eB.push(i + 1); }
    if (r < N - 1) { edgeId.set(i + ":" + (i + N), eA.length); cellEdges[i].push(eA.length); cellEdges[i + N].push(eA.length); eA.push(i); eB.push(i + N); }
  }
  const E = eA.length;
  const num = new Int16Array(C);
  let K = 0;
  for (const [i, n] of nums) { num[i] = n; K = Math.max(K, n); }
  const tgt = new Int8Array(C).fill(2);
  for (let i = 0; i < C; i++) if (num[i] === 1 || num[i] === K) tgt[i] = 1;
  const start = new Int8Array(E);
  for (const w of walls || []) start[w] = -1;
  return { N, C, E, eA, eB, cellEdges, edgeId, num, K, tgt, start };
}
export const edgeOf = (B, a, b) => B.edgeId.get(Math.min(a, b) + ":" + Math.max(a, b));

// monta os trechos já desenhados (cadeias de arestas ligadas).
// null = contradição (ciclo, grau demais, números fora de ordem, trecho 1…K fechado cedo)
export function rebuild(B, st) {
  const { C, E, eA, eB, num, tgt, K } = B;
  const adj = new Int32Array(C * 2).fill(-1), deg = new Int8Array(C);
  for (let e = 0; e < E; e++) if (st[e] === 1) {
    const a = eA[e], b = eB[e];
    if (deg[a] >= tgt[a] || deg[b] >= tgt[b]) return null;
    adj[a * 2 + deg[a]++] = b; adj[b * 2 + deg[b]++] = a;
  }
  const frag = new Int32Array(C).fill(-1), F = [];
  for (let i = 0; i < C; i++) {
    if (frag[i] !== -1 || deg[i] > 1) continue;
    const id = F.length;
    let prev = -1, cur = i, size = 0, first = 0, last = 0, dir = 0;
    for (;;) {
      frag[cur] = id; size++;
      const n = num[cur];
      if (n) {
        if (last) { const d = n - last; if (d !== 1 && d !== -1) return null; if (dir && d !== dir) return null; dir = d; }
        else first = n;
        last = n;
      }
      let nb = -1;
      for (let k = 0; k < deg[cur]; k++) if (adj[cur * 2 + k] !== prev) { nb = adj[cur * 2 + k]; break; }
      if (nb === -1) break;
      prev = cur; cur = nb;
    }
    const lo = first ? Math.min(first, last) : 0, hi = first ? Math.max(first, last) : 0;
    const loEnd = !first || first === last ? -1 : first < last ? i : cur;
    if (lo === 1 && hi === K && size < C) return null;
    F.push({ e1: i, e2: cur, lo, hi, loEnd, size });
  }
  for (let i = 0; i < C; i++) if (frag[i] === -1) return null;   // sobrou um ciclo
  return { frag, F, deg };
}

// ligar a aresta e juntaria dois trechos de forma válida?
export function mergeOK(B, R, e) {
  const a = B.eA[e], b = B.eB[e];
  const fa = R.frag[a], fb = R.frag[b];
  if (fa === fb) return false;                                  // fecharia um ciclo
  if (R.deg[a] >= B.tgt[a] || R.deg[b] >= B.tgt[b]) return false;
  const A = R.F[fa], Bf = R.F[fb];
  let lo, hi;
  if (A.lo && Bf.lo) {
    const c1 = A.hi + 1 === Bf.lo && (A.lo === A.hi || a !== A.loEnd) && (Bf.lo === Bf.hi || b === Bf.loEnd);
    const c2 = Bf.hi + 1 === A.lo && (Bf.lo === Bf.hi || b !== Bf.loEnd) && (A.lo === A.hi || a === A.loEnd);
    if (!c1 && !c2) return false;
    lo = Math.min(A.lo, Bf.lo); hi = Math.max(A.hi, Bf.hi);
  } else { lo = A.lo || Bf.lo; hi = A.hi || Bf.hi; }
  if (lo === 1 && hi === B.K && A.size + Bf.size < B.C) return false;
  return true;
}

// arestas-ponte (entre as que ainda podem ser usadas): se ficarem de fora, o
// tabuleiro se parte em dois, então o fio tem de passar por elas.
export function bridges(B, st) {
  const { C, cellEdges, eA, eB } = B;
  const disc = new Int32Array(C).fill(-1), low = new Int32Array(C);
  const out = [];
  let t = 0;
  // DFS iterativo
  const stack = [];
  disc[0] = low[0] = t++;
  stack.push([0, -1, 0]);
  let seen = 1;
  while (stack.length) {
    const top = stack[stack.length - 1];
    const [u, pe] = top;
    const list = cellEdges[u];
    if (top[2] < list.length) {
      const e = list[top[2]++];
      if (e === pe || st[e] === -1) continue;
      const v = eA[e] === u ? eB[e] : eA[e];
      if (disc[v] === -1) { disc[v] = low[v] = t++; seen++; stack.push([v, e, 0]); }
      else low[u] = Math.min(low[u], disc[v]);
    } else {
      stack.pop();
      if (stack.length) {
        const p = stack[stack.length - 1][0];
        low[p] = Math.min(low[p], low[u]);
        if (low[u] > disc[p] && st[pe] === 0) out.push(pe);
      }
    }
  }
  if (seen < C) return null;                                    // já está desconectado
  return out;
}

// propaga as deduções até estabilizar. level 1: grau + junções válidas;
// level 2: + pontes (conectividade). Devolve false se achar contradição.
export function propagate(B, st, level = 2, stats = null) {
  const { C, cellEdges, tgt, E } = B;
  for (let guard = 0; guard < 10000; guard++) {
    const R = rebuild(B, st);
    if (!R) return false;
    if (stats) stats.rounds = (stats.rounds || 0) + 1;
    let changed = false;
    for (let i = 0; i < C; i++) {
      let unk = 0, on = 0;                                      // conta direto do estado (muda durante a passada)
      for (const e of cellEdges[i]) { if (st[e] === 0) unk++; else if (st[e] === 1) on++; }
      if (on > tgt[i]) return false;
      if (on + unk < tgt[i]) return false;
      if (!unk) continue;
      if (on === tgt[i]) { for (const e of cellEdges[i]) if (st[e] === 0) st[e] = -1; changed = true; }
      else if (on + unk === tgt[i]) { for (const e of cellEdges[i]) if (st[e] === 0) st[e] = 1; changed = true; }
    }
    if (changed) continue;
    for (let e = 0; e < E; e++) if (st[e] === 0 && !mergeOK(B, R, e)) { st[e] = -1; changed = true; }
    if (changed) continue;
    if (level >= 2) {
      const br = bridges(B, st);
      if (!br) return false;
      if (br.length) { for (const e of br) st[e] = 1; if (stats) stats.l2++; continue; }
    }
    return true;
  }
  return false;
}

const unknowns = st => { let n = 0; for (const v of st) if (!v) n++; return n; };

// Resolvedor "humano", sem chute. Técnicas:
//   nível 1 — cada casa tem 2 ligações (1 nas pontas); não fechar ciclos; não
//             juntar trechos com números fora de sequência.
//   nível 2 — conectividade: passagem obrigatória entre duas partes do tabuleiro.
//   nível 3 — testar uma ligação e ver que ela leva a contradição.
// maxLevel limita as técnicas permitidas (para medir se o desafio é fácil).
export function logicSolve(B, maxLevel = 3) {
  const st = Int8Array.from(B.start);
  const stats = { l2: 0, probes: 0, elim: 0, rounds: 0 };
  let level = 1;
  for (let guard = 0; guard < 400; guard++) {
    if (!propagate(B, st, 1, stats)) return null;
    if (!unknowns(st)) return { level, stats, score: stats.rounds + 10 * stats.l2 + 60 * stats.probes + 3 * stats.elim, st };
    if (maxLevel < 2) return { stuck: true, st, level };
    const before = unknowns(st);
    const s2 = st.slice();
    const tmp = { l2: 0 };
    if (!propagate(B, s2, 2, tmp)) return null;
    if (unknowns(s2) < before) { st.set(s2); level = Math.max(level, 2); stats.l2 += tmp.l2; continue; }
    if (maxLevel < 3) return { stuck: true, st, level };
    // sondagem: uma ligação que leva a contradição é descartada
    let found = 0;
    for (let e = 0; e < B.E; e++) {
      if (st[e]) continue;
      const a = st.slice(); a[e] = 1;
      if (!propagate(B, a, 2)) { st[e] = -1; found++; continue; }
      const b = st.slice(); b[e] = -1;
      if (!propagate(B, b, 2)) { st[e] = 1; found++; }
    }
    if (!found) return { stuck: true, st, level };
    level = 3; stats.probes++; stats.elim += found;
  }
  return null;
}

// conta soluções (até limit); guarda as soluções encontradas
export function countSolutions(B, limit = 2, budget = 2e5) {
  const sols = [];
  let nodes = 0, aborted = false;
  function rec(st) {
    if (sols.length >= limit || aborted) return;
    if (++nodes > budget) { aborted = true; return; }
    if (!propagate(B, st, 2)) return;
    // ramifica pela casa com menos opções
    const R = rebuild(B, st);
    let best = -1, bestU = 99;
    for (let i = 0; i < B.C; i++) {
      if (R.deg[i] >= B.tgt[i]) continue;
      let u = 0; for (const e of B.cellEdges[i]) if (st[e] === 0) u++;
      if (u && u < bestU) { bestU = u; best = i; }
    }
    if (best < 0) { sols.push(st.slice()); return; }
    const e = B.cellEdges[best].find(x => st[x] === 0);
    const a = st.slice(); a[e] = 1; rec(a);
    if (sols.length >= limit || aborted) return;
    const b = st.slice(); b[e] = -1; rec(b);
  }
  rec(Int8Array.from(B.start));
  return { sols, nodes, aborted };
}

// transforma um conjunto de arestas ligadas na sequência de casas, a partir do 1
export function pathFromEdges(B, st) {
  const adj = [...Array(B.C)].map(() => []);
  for (let e = 0; e < B.E; e++) if (st[e] === 1) { adj[B.eA[e]].push(B.eB[e]); adj[B.eB[e]].push(B.eA[e]); }
  let cur = B.num.indexOf(1), prev = -1;
  const out = [];
  while (cur !== -1) {
    out.push(cur);
    const nx = adj[cur].find(x => x !== prev);
    prev = cur; cur = nx === undefined ? -1 : nx;
  }
  return out;
}
