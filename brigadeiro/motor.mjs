// Motor do Brigadeiro (empurrar doces até as forminhas), usado pelo gerador e pela página (dica).
//
// Tabuleiro W × H, casas numeradas por linha (i = y * W + x). Desafio em texto, uma letra por casa:
//   #  barra de chocolate (parede)      .  papel vazio      f  forminha vazia
//   b  brigadeiro                        c  brigadeiro já na forminha
//   o  colher                            p  colher em cima de uma forminha
// A colher anda pelas casas livres e empurra um brigadeiro por vez (não puxa, não empurra dois).

export const W = 7, H = 8, N = W * H;
export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];        // cima, direita, baixo, esquerda
export const NOME_DIR = ["para cima", "para a direita", "para baixo", "para a esquerda"];
export const passo = (i, d) => {
  const x = i % W + DIRS[d][0], y = (i / W | 0) + DIRS[d][1];
  return x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x;
};

export function ler(g) {
  const parede = [], forminhas = [], doces = []; let colher = -1;
  [...g].forEach((ch, i) => {
    parede[i] = ch === "#";
    if ("fcp".includes(ch)) forminhas.push(i);
    if ("bc".includes(ch)) doces.push(i);
    if ("op".includes(ch)) colher = i;
  });
  return { parede, forminhas, doces: doces.sort((a, b) => a - b), colher };
}

// casas por onde a colher alcança (sem atravessar doces); devolve a lista e a menor casa (para normalizar)
export function alcance(parede, ocupado, de) {
  const vis = new Uint8Array(N), fila = [de]; vis[de] = 1; let min = de;
  for (let k = 0; k < fila.length; k++) for (let d = 0; d < 4; d++) {
    const j = passo(fila[k], d);
    if (j >= 0 && !vis[j] && !parede[j] && !ocupado[j]) { vis[j] = 1; fila.push(j); if (j < min) min = j; }
  }
  return { vis, min };
}

// casas mortas: um doce ali nunca mais chega a forminha nenhuma (puxando a partir das forminhas)
export function mortas(parede, forminhas) {
  const vivo = new Uint8Array(N), fila = [...forminhas];
  for (const f of forminhas) vivo[f] = 1;
  for (let k = 0; k < fila.length; k++) for (let d = 0; d < 4; d++) {
    const b = passo(fila[k], d), c = b >= 0 ? passo(b, d) : -1;          // o doce vem de b, a colher fica em c
    if (b >= 0 && c >= 0 && !parede[b] && !parede[c] && !vivo[b]) { vivo[b] = 1; fila.push(b); }
  }
  return vivo.map(v => !v);
}

const chave = (doces, p) => doces.join(",") + "|" + p;

// menor número de empurrões até pôr todos os doces nas forminhas, com a sequência de empurrões.
// devolve { n, empurroes: [{ de, dir }], estados (quanto a busca precisou olhar) } ou null (sem saída). limite: estados no máximo (segurança).
export function resolve(g, limite = 2e6) {
  const { parede, forminhas, doces, colher } = typeof g === "string" ? ler(g) : g;
  const morta = mortas(parede, forminhas), eForm = new Uint8Array(N); forminhas.forEach(f => (eForm[f] = 1));
  const ocup = new Uint8Array(N);
  const pronto = ds => ds.every(i => eForm[i]);
  const r0 = (() => { doces.forEach(i => (ocup[i] = 1)); const a = alcance(parede, ocup, colher); doces.forEach(i => (ocup[i] = 0)); return a; })();
  const ini = { doces, p: r0.min, pai: null, mov: null };
  if (pronto(doces)) return { n: 0, empurroes: [] };
  const vistos = new Set([chave(doces, r0.min)]);
  let nivel = [ini], n = 0;
  while (nivel.length && vistos.size < limite) {
    const prox = []; n++;
    for (const st of nivel) {
      st.doces.forEach(i => (ocup[i] = 1));
      const { vis } = alcance(parede, ocup, st.p);
      for (const b of st.doces) for (let d = 0; d < 4; d++) {
        const atras = passo(b, (d + 2) % 4), frente = passo(b, d);
        if (atras < 0 || frente < 0 || !vis[atras] || parede[frente] || ocup[frente] || morta[frente]) continue;
        const nd = st.doces.map(x => (x === b ? frente : x)).sort((x, y) => x - y);
        ocup[b] = 0; ocup[frente] = 1;
        const { min } = alcance(parede, ocup, b);
        ocup[frente] = 0; ocup[b] = 1;
        const k = chave(nd, min);
        if (vistos.has(k)) continue;
        vistos.add(k);
        const novo = { doces: nd, p: min, pai: st, mov: { de: b, dir: d } };
        if (pronto(nd)) {
          st.doces.forEach(i => (ocup[i] = 0));
          const empurroes = []; for (let s = novo; s.mov; s = s.pai) empurroes.unshift(s.mov);
          return { n, empurroes, estados: vistos.size };
        }
        prox.push(novo);
      }
      st.doces.forEach(i => (ocup[i] = 0));
    }
    nivel = prox;
  }
  return null;
}

// quantas vezes a solução troca de doce (mais trocas = doces que dependem uns dos outros)
export function trocas(empurroes) {
  let ultimo = -1, t = 0;
  for (const e of empurroes) { if (e.de !== ultimo) t++; ultimo = passo(e.de, e.dir); }
  return t;
}
