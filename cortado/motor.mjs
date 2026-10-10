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

// ---------- dedução "de gente" ----------
// Cada técnica olha uma linha (ou coluna) e devolve casas certas, com o motivo em palavras.
// Do mais simples para o mais trabalhoso:
//   par       — dois iguais seguidos: as pontas são o contrário (XX_ e _XX)
//   meio      — buraco entre dois iguais (X_X)
//   metade    — a linha já tem metade de um: o resto é do outro
//   sinal     — sinal com uma casa já preenchida
//   parIgual  — duas vazias ligadas por "=": encostadas num X (seriam três) ou quando só cabe mais um X
//   contaX    — pares ligados por "×" levam um de cada: às vezes isso fecha a conta do resto
//   poucas    — linha com poucas vazias (até K): todas as formas de completar concordam numa casa
// Só passa disso o desafio que precisaria de chute: o gerador descarta.
const NOME = v => (v === 1 ? "café" : "leite");
const nomeLinha = (N, li) => (li < N ? `linha ${li + 1}` : `coluna ${li - N + 1}`);

export function deducoes(N, g, signs, K = 0, so1 = false) {
  const L = linesOf(N), sm = signMap(N, signs), out = [];
  const add = (i, v, tec, motivo) => { if (!g[i]) out.push({ i, v, tec, motivo }); };
  const tecs = [
    // par e meio
    () => L.forEach((line, li) => {
      for (let k = 0; k + 2 < N; k++) {
        const [a, b, c] = [line[k], line[k + 1], line[k + 2]];
        if (g[a] && g[a] === g[b] && !g[c]) add(c, other(g[a]), "par", `Na ${nomeLinha(N, li)} já há dois de ${NOME(g[a])} seguidos: o próximo não pode ser ${NOME(g[a])} (seriam três).`);
        if (g[b] && g[b] === g[c] && !g[a]) add(a, other(g[b]), "par", `Na ${nomeLinha(N, li)} já há dois de ${NOME(g[b])} seguidos: o vizinho não pode ser ${NOME(g[b])} (seriam três).`);
        if (g[a] && g[a] === g[c] && !g[b]) add(b, other(g[a]), "meio", `Entre dois de ${NOME(g[a])} na ${nomeLinha(N, li)} só cabe ${NOME(other(g[a]))} (senão seriam três seguidos).`);
      }
    }),
    // metade
    () => L.forEach((line, li) => {
      for (const v of [1, 2]) if (line.filter(i => g[i] === v).length === N / 2)
        for (const i of line) add(i, other(v), "metade", `A ${nomeLinha(N, li)} já tem ${N / 2} de ${NOME(v)}, que é a metade: o resto é ${NOME(other(v))}.`);
    }),
    // sinal
    () => signs.forEach(s => {
      for (const [x, y] of [[s.a, s.b], [s.b, s.a]]) if (g[x] && !g[y])
        add(y, s.t === "=" ? g[x] : other(g[x]), "sinal", s.t === "=" ? `O sinal = liga esta casa a uma de ${NOME(g[x])}: ela também é ${NOME(g[x])}.` : `O sinal × liga esta casa a uma de ${NOME(g[x])}: ela é o contrário, ${NOME(other(g[x]))}.`);
    }),
    // parIgual
    () => L.forEach((line, li) => {
      const pos = new Map(line.map((i, k) => [i, k]));
      const falta = v => N / 2 - line.filter(i => g[i] === v).length;
      for (const s of signs) {
        if (s.t !== "=" || g[s.a] || g[s.b] || !pos.has(s.a) || !pos.has(s.b)) continue;
        const k0 = Math.min(pos.get(s.a), pos.get(s.b)), k1 = k0 + 1;
        for (const kk of [k0 - 1, k1 + 1]) {
          const n = line[kk];
          if (kk >= 0 && kk < N && g[n]) { const m = `As duas casas com = são iguais e encostam num ${NOME(g[n])} na ${nomeLinha(N, li)}: se fossem ${NOME(g[n])}, seriam três seguidos. Então são ${NOME(other(g[n]))}.`; add(s.a, other(g[n]), "parIgual", m); add(s.b, other(g[n]), "parIgual", m); }
        }
        for (const v of [1, 2]) if (falta(v) === 1) { const m = `Na ${nomeLinha(N, li)} só falta 1 ${NOME(v)}, e as duas casas com = são iguais: não dá para as duas serem ${NOME(v)}. São ${NOME(other(v))}.`; add(s.a, other(v), "parIgual", m); add(s.b, other(v), "parIgual", m); }
      }
    }),
    // contaX
    () => L.forEach((line, li) => {
      const pos = new Map(line.map((i, k) => [i, k]));
      const usados = new Set(); let p = 0;
      for (const s of signs) if (s.t === "x" && !g[s.a] && !g[s.b] && pos.has(s.a) && pos.has(s.b) && !usados.has(s.a) && !usados.has(s.b)) { usados.add(s.a); usados.add(s.b); p++; }
      if (!p) return;
      for (const v of [1, 2]) {
        const falta = N / 2 - line.filter(i => g[i] === v).length;
        if (falta === p) for (const i of line) if (!g[i] && !usados.has(i))
          add(i, other(v), "contaX", `Na ${nomeLinha(N, li)} ${p === 1 ? "falta 1" : `faltam ${p}`} de ${NOME(v)}, e ${p === 1 ? "o par com × já leva" : `os ${p} pares com × já levam`} um de cada: as outras casas vazias são ${NOME(other(v))}.`);
      }
    }),
    // poucas
    () => { if (!K) return; const V = validLines(N); L.forEach((line, li) => {
      const vazias = line.filter(i => !g[i]).length;
      if (!vazias || vazias > K) return;
      const pos = new Map(line.map((i, k) => [i, k]));
      const inner = [];
      for (let k = 0; k < N; k++) for (const [j, t] of sm[line[k]]) if (pos.has(j) && pos.get(j) > k) inner.push([k, pos.get(j), t]);
      let must = null, n = 0;
      for (const cand of V) {
        let ok = true;
        for (let k = 0; k < N && ok; k++) if (g[line[k]] && g[line[k]] !== cand[k]) ok = false;
        for (const [a, b, t] of inner) if (ok && (t === "=") !== (cand[a] === cand[b])) ok = false;
        // sinais para fora da linha, com a outra casa já preenchida
        for (let k = 0; k < N && ok; k++) for (const [j, t] of sm[line[k]]) if (!pos.has(j) && g[j] && (t === "=") !== (g[j] === cand[k])) ok = false;
        if (!ok) continue;
        n++;
        if (!must) must = cand.slice(); else for (let k = 0; k < N; k++) if (must[k] !== cand[k]) must[k] = 0;
      }
      if (!n) return;
      const f1 = N / 2 - line.filter(i => g[i] === 1).length, f2 = N / 2 - line.filter(i => g[i] === 2).length;
      const jeitos = n === 1 ? "só há um jeito de arrumá-las" : `só há ${n} jeitos de arrumá-las`;
      for (let k = 0; k < N; k++) if (must[k]) add(line[k], must[k], "poucas", `Na ${nomeLinha(N, li)} faltam ${vazias} casas (${f1} de café e ${f2} de leite), e ${jeitos} sem formar três iguais nem desrespeitar um sinal. Em ${n === 1 ? "ele" : "todos"}, esta casa é ${NOME(must[k])}.`);
    }); },
  ];
  for (const t of tecs) { t(); if (so1 && out.length) break; }
  return out;
}

// próxima casa que dá para deduzir, com o motivo (para a dica); null se nada sai sem chute
export function passo(N, g, signs, K = N / 2 + 1) {   // mesmas técnicas do gerador
  const d = deducoes(N, g, signs, K, true);
  return d[0] || null;
}

// Resolvedor sem chute: aplica as deduções até completar. maxLevel 1 = sem "poucas";
// 2 = "poucas" em linhas com até N/2 + 1 vazias. Devolve { level, score, g } ou { stuck } ou null.
export function logicSolve(N, givens, signs, maxLevel = 2) {
  const g = Uint8Array.from(givens);
  const K = maxLevel >= 2 ? N / 2 + 1 : 0;
  const stats = { rounds: 0, l2: 0, cx: 0, pi: 0 };
  let level = 1;
  for (let guard = 0; guard < 1000; guard++) {
    if (conflicts(N, g, signs).size) return null;
    if (g.every(Boolean)) break;
    let d = deducoes(N, g, signs, 0);
    if (!d.length && K) { d = deducoes(N, g, signs, K); if (d.length) { level = 2; stats.l2++; } }
    if (!d.length) return { stuck: true, level, g };
    stats.rounds++;
    for (const x of d) {
      if (g[x.i] && g[x.i] !== x.v) return null;
      g[x.i] = x.v;
      if (x.tec === "contaX") stats.cx++; if (x.tec === "parIgual") stats.pi++;
    }
  }
  if (!g.every(Boolean) || conflicts(N, g, signs).size) return null;
  return { level, stats, score: stats.rounds + 6 * stats.l2 + 2 * stats.cx + stats.pi, g };
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
