// Motor do Pingado: regras, dedução "humana" e contagem de soluções.
//
// Regras (iguais às do Tango, do LinkedIn), com café (1) e leite (2):
//   · cada linha e cada coluna tem metade de café e metade de leite;
//   · nunca três iguais seguidos, na horizontal ou na vertical;
//   · "=" entre duas casas: as duas são iguais; "×": são diferentes.
//
// Tabuleiro: array de N·N com 0 (vazio), 1 (café) ou 2 (leite).
// Sinais: { a, b, t } com a < b casas vizinhas e t = "=" ou "x".

export const other = v => 3 - v;

// todas as linhas válidas de tamanho N (metade de cada, sem três seguidos)
const LINES = new Map();
export function validLines(N) {
  if (LINES.has(N)) return LINES.get(N);
  const out = [], cur = new Array(N);
  (function rec(i, c1, c2) {
    if (i === N) { out.push(cur.slice()); return; }
    for (const v of [1, 2]) {
      if ((v === 1 ? c1 : c2) >= N / 2) continue;
      if (i >= 2 && cur[i - 1] === v && cur[i - 2] === v) continue;
      cur[i] = v;
      rec(i + 1, c1 + (v === 1), c2 + (v === 2));
    }
  })(0, 0, 0);
  LINES.set(N, out);
  return out;
}

// casas de cada linha (0..N-1) e coluna (N..2N-1)
export function linesOf(N) {
  const L = [];
  for (let r = 0; r < N; r++) L.push([...Array(N)].map((_, c) => r * N + c));
  for (let c = 0; c < N; c++) L.push([...Array(N)].map((_, r) => r * N + c));
  return L;
}

// sinais por casa: lista de [vizinha, tipo]
export function signMap(N, signs) {
  const m = [...Array(N * N)].map(() => []);
  for (const s of signs) { m[s.a].push([s.b, s.t]); m[s.b].push([s.a, s.t]); }
  return m;
}

// conflitos de um tabuleiro (casas envolvidas), para o jogo e para testes
export function conflicts(N, g, signs) {
  const bad = new Set();
  for (const line of linesOf(N)) {
    for (let k = 0; k + 2 < N; k++) {
      const [a, b, c] = [line[k], line[k + 1], line[k + 2]];
      if (g[a] && g[a] === g[b] && g[b] === g[c]) { bad.add(a); bad.add(b); bad.add(c); }
    }
    for (const v of [1, 2]) {
      const cs = line.filter(i => g[i] === v);
      if (cs.length > N / 2) cs.forEach(i => bad.add(i));
    }
  }
  for (const s of signs) {
    if (!g[s.a] || !g[s.b]) continue;
    if ((s.t === "=") !== (g[s.a] === g[s.b])) { bad.add(s.a); bad.add(s.b); }
  }
  return bad;
}

// ---------- propagação ----------
// Técnicas, da mais simples para a mais difícil:
//   nível 1 — dois iguais seguidos: as pontas são o contrário (XX_ e _XX);
//             buraco no meio de dois iguais (X_X); sinal com uma casa já
//             preenchida; linha que já tem metade de um: o resto é o outro.
//   nível 2 — olhar a linha inteira: das completas válidas que sobram
//             (com sinais "=" e "×" dentro da própria linha), casas que são
//             iguais em todas são certas.
//   nível 3 — testar um valor numa casa e ver que ele leva a contradição.
// Cada função devolve false em contradição.
function level1(N, g, sm, L, st) {
  let changed = true, any = false;
  const set = (i, v) => {
    if (g[i] === v) return true;
    if (g[i]) return false;
    g[i] = v; changed = any = true;
    return true;
  };
  while (changed) {
    changed = false;
    if (st) st.rounds++;
    for (const line of L) {
      let c1 = 0, c2 = 0;
      for (let k = 0; k < N; k++) {
        const v = g[line[k]];
        if (v === 1) c1++; else if (v === 2) c2++;
        if (k + 2 < N) {
          const a = g[line[k]], b = g[line[k + 1]], c = g[line[k + 2]];
          if (a && a === b && b === c) return false;
          if (a && a === b && !set(line[k + 2], other(a))) return false;
          if (b && b === c && !set(line[k], other(b))) return false;
          if (a && a === c && !set(line[k + 1], other(a))) return false;
        }
      }
      if (c1 > N / 2 || c2 > N / 2) return false;
      if (c1 === N / 2 && c2 < N / 2) for (const i of line) if (!g[i] && !set(i, 2)) return false;
      if (c2 === N / 2 && c1 < N / 2) for (const i of line) if (!g[i] && !set(i, 1)) return false;
    }
    for (let i = 0; i < N * N; i++) {
      if (!g[i]) continue;
      for (const [j, t] of sm[i]) if (!set(j, t === "=" ? g[i] : other(g[i]))) return false;
    }
  }
  return any ? 1 : true;
}

// nível 2: para cada linha, as completas possíveis
function level2(N, g, sm, L, st) {
  const V = validLines(N);
  let found = false;
  for (const line of L) {
    if (line.every(i => g[i])) continue;
    const pos = new Map(line.map((i, k) => [i, k]));
    const inner = [];                       // sinais dentro da própria linha
    for (let k = 0; k < N; k++) for (const [j, t] of sm[line[k]]) if (pos.has(j) && pos.get(j) > k) inner.push([k, pos.get(j), t]);
    let must = null, n = 0;
    for (const cand of V) {
      let ok = true;
      for (let k = 0; k < N && ok; k++) if (g[line[k]] && g[line[k]] !== cand[k]) ok = false;
      for (const [a, b, t] of inner) if (ok && (t === "=") !== (cand[a] === cand[b])) ok = false;
      if (!ok) continue;
      n++;
      if (!must) must = cand.slice();
      else for (let k = 0; k < N; k++) if (must[k] !== cand[k]) must[k] = 0;
    }
    if (!n) return false;
    for (let k = 0; k < N; k++) if (must[k] && !g[line[k]]) { g[line[k]] = must[k]; found = true; }
    if (found) { if (st) st.l2++; return 1; }  // uma linha por vez: volta ao nível 1
  }
  return true;
}

function propagate(N, g, sm, L, level, st) {
  for (let guard = 0; guard < 10000; guard++) {
    if (!level1(N, g, sm, L, st)) return false;
    if (level < 2 || g.every(Boolean)) return true;
    const r = level2(N, g, sm, L, st);
    if (!r) return false;
    if (r !== 1) return true;
  }
  return false;
}

// Resolvedor sem chute. Devolve { level, score, g } ou { stuck } ou null (contradição).
export function logicSolve(N, givens, signs, maxLevel = 3) {
  const g = Uint8Array.from(givens);
  const sm = signMap(N, signs), L = linesOf(N);
  const stats = { rounds: 0, l2: 0, probes: 0, elim: 0 };
  let level = 1;
  for (let guard = 0; guard < 500; guard++) {
    if (!propagate(N, g, sm, L, 1, stats)) return null;
    if (g.every(Boolean)) break;
    if (maxLevel < 2) return { stuck: true, level, g };
    const before = g.filter(Boolean).length;
    if (!propagate(N, g, sm, L, 2, stats)) return null;
    if (g.filter(Boolean).length > before) { level = Math.max(level, 2); continue; }
    if (maxLevel < 3) return { stuck: true, level, g };
    // nível 3: testar cada valor em cada casa vazia
    let found = 0;
    for (let i = 0; i < N * N && !found; i++) {
      if (g[i]) continue;
      for (const v of [1, 2]) {
        const t = g.slice(); t[i] = v;
        if (!propagate(N, t, sm, L, 2)) { g[i] = other(v); found++; break; }
      }
    }
    if (!found) return { stuck: true, level, g };
    level = 3; stats.probes++; stats.elim += found;
  }
  if (!g.every(Boolean)) return null;
  return { level, stats, score: stats.rounds + 8 * stats.l2 + 50 * stats.probes, g };
}

// conta soluções (até limit), com propagação do nível 1
export function countSolutions(N, givens, signs, limit = 2) {
  const sm = signMap(N, signs), L = linesOf(N);
  const sols = [];
  (function rec(g) {
    if (sols.length >= limit) return;
    if (!propagate(N, g, sm, L, 1)) return;
    const i = g.indexOf(0);
    if (i < 0) { if (!conflicts(N, g, signs).size) sols.push(g.slice()); return; }
    for (const v of [1, 2]) { const t = g.slice(); t[i] = v; rec(t); if (sols.length >= limit) return; }
  })(Uint8Array.from(givens));
  return sols;
}
