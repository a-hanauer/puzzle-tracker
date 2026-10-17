// Motor do Brigadeiro (inclinar a assadeira), usado pelo gerador e pela página (dica).
//
// Tabuleiro W × H, casas numeradas por linha (i = y * W + x). Desafio em texto, uma letra por casa:
//   #  barra de chocolate (parede)    .  papel vazio
//   a b c d  brigadeiro com granulado da cor 0, 1, 2, 3 (rosa, azul, amarelo, verde)
//   A B C D  forminha da cor 0, 1, 2, 3
// Inclinar a assadeira para um lado faz TODOS os brigadeiros rolarem juntos até baterem em alguma coisa
// (chocolate, borda, outro brigadeiro, forminha já cheia). Quem passa por cima da forminha da sua cor cai
// nela e fica; forminha de outra cor não segura (o doce passa por cima). Termina com todos nas forminhas.

export const W = 7, H = 8, N = W * H;
export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];        // cima, direita, baixo, esquerda
export const NOME_DIR = ["para cima", "para a direita", "para baixo", "para a esquerda"];
export const passo = (i, d) => {
  const x = i % W + DIRS[d][0], y = (i / W | 0) + DIRS[d][1];
  return x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x;
};

export function ler(g) {
  const parede = [], forminhas = [], doces = [];
  [...g].forEach((ch, i) => {
    parede[i] = ch === "#";
    if (ch >= "A" && ch <= "D") forminhas.push({ i, cor: ch.charCodeAt(0) - 65 });
    if (ch >= "a" && ch <= "d") doces.push({ i, cor: ch.charCodeAt(0) - 97 });
  });
  return { parede, forminhas, doces };
}

// estado: { doces: [{ i, cor }] que ainda rolam, cheias: bits das forminhas já com doce }
// devolve { doces, cheias, mexeu, caiu: [índices dos doces que caíram], rotas: [[casas por onde cada doce passou]] }
export function inclina(T, st, d) {
  const formAt = new Int8Array(N).fill(-1);
  T.forminhas.forEach((f, k) => (formAt[f.i] = k));
  const ord = st.doces.map((x, k) => k).sort((a, b) => {
    const pa = st.doces[a].i, pb = st.doces[b].i;
    const va = d === 0 ? (pa / W | 0) : d === 2 ? -(pa / W | 0) : d === 1 ? -(pa % W) : pa % W;
    const vb = d === 0 ? (pb / W | 0) : d === 2 ? -(pb / W | 0) : d === 1 ? -(pb % W) : pb % W;
    return va - vb;                                                // quem está na frente rola primeiro
  });
  const ocup = new Uint8Array(N); st.doces.forEach(x => (ocup[x.i] = 1));
  let cheias = st.cheias, mexeu = false;
  const novos = st.doces.map(x => ({ ...x })), caiu = [], rotas = st.doces.map(() => []);
  for (const k of ord) {
    const x = novos[k];
    ocup[x.i] = 0;
    let pos = x.i, dentro = false;
    for (;;) {
      const nx = passo(pos, d);
      if (nx < 0 || T.parede[nx] || ocup[nx]) break;
      const f = formAt[nx];
      if (f >= 0 && (cheias >> f) & 1) break;                       // forminha cheia é obstáculo
      pos = nx; rotas[k].push(pos); mexeu = true;
      if (f >= 0 && T.forminhas[f].cor === x.cor) { cheias |= 1 << f; dentro = true; break; }
    }
    x.i = pos;
    if (dentro) caiu.push(k); else ocup[pos] = 1;
  }
  return { doces: novos.filter((_, k) => !caiu.includes(k)), cheias, mexeu, caiu, rotas, todos: novos };
}

const chave = st => st.doces.map(x => x.cor + "@" + x.i).sort().join(",") + "|" + st.cheias;

// menor número de inclinações até todos os doces caírem; devolve { n, lances: [d], estados } ou null
export function resolve(g, limite = 400000, ini = null) {
  const T = typeof g === "string" ? ler(g) : g;
  const st0 = ini || { doces: T.doces.map(x => ({ ...x })), cheias: 0 };
  if (!st0.doces.length) return { n: 0, lances: [], estados: 1 };
  const vistos = new Map([[chave(st0), null]]);
  let nivel = [{ st: st0, pai: null, d: -1 }];
  for (let n = 1; nivel.length && vistos.size < limite; n++) {
    const prox = [];
    for (const no of nivel) for (let d = 0; d < 4; d++) {
      const r = inclina(T, no.st, d);
      if (!r.mexeu) continue;
      const st = { doces: r.doces, cheias: r.cheias }, k = chave(st);
      if (vistos.has(k)) continue;
      vistos.set(k, 1);
      const novo = { st, pai: no, d };
      if (!st.doces.length) { const lances = []; for (let s = novo; s.pai; s = s.pai) lances.unshift(s.d); return { n, lances, estados: vistos.size }; }
      prox.push(novo);
    }
    nivel = prox;
  }
  return null;
}
