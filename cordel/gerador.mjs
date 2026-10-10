// Gerador de tabuleiros do Cordel.
//
// Tabuleiro: 8 linhas × 6 colunas, 48 letras. Cada letra pertence a exatamente uma
// palavra; as palavras são caminhos de casas vizinhas (inclusive na diagonal), sem
// repetir casa e sem dois traços diagonais se cruzando. A palavra-chave toca dois
// lados opostos (esquerda e direita, ou cima e embaixo).
//
// Para cada tema (temas.mjs), escolhe palavras que somam 48 letras com a chave,
// encaixa a chave primeiro e depois as outras, sempre começando pela casa vazia
// mais "apertada", e conferindo que cada pedaço de tabuleiro que sobra ainda pode
// ser preenchido com as palavras que faltam.
//
// Uso:  node cordel/gerador.mjs [semente]
// Os desafios que já saíram (até hoje) não mudam.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TEMAS } from "./temas.mjs";
import { BANCO } from "../comum/banco.mjs";   // categorias com pista e palavra-chave também viram temas
const DO_BANCO = BANCO.filter(c => c[4]).map(([, , , ws, [pista, chave]]) => [pista, chave, ws]);
import { mantidos } from "../comum/selecao.mjs";

export const H = 8, W = 6, C = H * W;
export const EPOCH = [2026, 9, 4];            // #1 = domingo, 04/10/2026

let seed = 20261004;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const norm = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toUpperCase();

const rc = i => [(i / W) | 0, i % W];
const NB = [...Array(C)].map((_, i) => { const [r, c] = rc(i), o = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = r + dr, cc = c + dc; if ((dr || dc) && rr >= 0 && cc >= 0 && rr < H && cc < W) o.push(rr * W + cc); } return o; });
// traço diagonal a→b: guarda o "x" que ele ocupa, para outro traço não cruzar
const xKey = (a, b) => { const [r1, c1] = rc(a), [r2, c2] = rc(b); if (r1 === r2 || c1 === c2) return null; return `${Math.min(r1, r2)},${Math.min(c1, c2)}`; };

function componentes(livre) {
  const vis = new Uint8Array(C), out = [];
  for (let i = 0; i < C; i++) if (livre[i] && !vis[i]) {
    let n = 0; const st = [i]; vis[i] = 1;
    while (st.length) { const x = st.pop(); n++; for (const y of NB[x]) if (livre[y] && !vis[y]) { vis[y] = 1; st.push(y); } }
    out.push(n);
  }
  return out;
}
// os pedaços livres podem ser cobertos por grupos das palavras restantes? (soma de subconjuntos)
function cabe(comps, lens) {
  const total = lens.reduce((a, b) => a + b, 0);
  if (comps.reduce((a, b) => a + b, 0) !== total) return false;
  if (comps.some(c => c < 4)) return false;
  const sums = new Set([0]);
  for (const l of lens) for (const s of [...sums]) sums.add(s + l);
  return comps.every(c => sums.has(c));
}

// um caminho de len casas a partir de start, com as letras de word, sem cruzar diagonais
function* caminhos(start, len, livre, xs) {
  const path = [start]; livre[start] = 0;
  const usados = [];
  function* rec() {
    if (path.length === len) { yield path.slice(); return; }
    const last = path[path.length - 1];
    for (const n of shuffle(NB[last].filter(n => livre[n]))) {
      const k = xKey(last, n);
      if (k && xs.has(k)) continue;
      livre[n] = 0; path.push(n); if (k) xs.add(k);
      yield* rec();
      livre[n] = 1; path.pop(); if (k) xs.delete(k);
    }
  }
  yield* rec();
  livre[start] = 1;
}

function encaixar(chave, palavras, orcamento = 40000) {
  const livre = new Uint8Array(C).fill(1), xs = new Set(), grid = new Array(C).fill(""), sol = [];
  let nos = 0;
  // casas livres e diagonais ficam por conta de caminhos(); aqui só as letras
  const marcaCaminho = (p, w, on) => { for (let k = 0; k < p.length; k++) grid[p[k]] = on ? w[k] : ""; };
  function resto(ws) {
    if (++nos > orcamento) return false;
    if (!ws.length) return true;
    // casa livre mais apertada (menos vizinhas livres)
    let alvo = -1, menor = 9;
    for (let i = 0; i < C; i++) if (livre[i]) { const n = NB[i].filter(j => livre[j]).length; if (n < menor) { menor = n; alvo = i; } }
    for (const w of shuffle(ws.slice())) for (const pal of shuffle([w, [...w].reverse().join("")])) {
      for (const p of caminhos(alvo, pal.length, livre, xs)) {
        if (++nos > orcamento) return false;
        marcaCaminho(p, pal, true);
        const rest = ws.filter(x => x !== w);
        if (cabe(componentes(livre), rest.map(x => x.length)) && resto(rest)) { sol.push({ w, p: pal === w ? p : p.slice().reverse() }); return true; }
        marcaCaminho(p, pal, false);
      }
    }
    return false;
  }
  // a chave: começa num lado e precisa tocar o oposto
  const lados = shuffle([[W, i => i % W === 0, i => i % W === W - 1], [H, i => i < W, i => i >= C - W]]);
  for (const [minimo, ini, fim] of lados) {
    if (chave.length < minimo) continue;
    const starts = shuffle([...Array(C).keys()].filter(ini));
    for (const s of starts) for (const p of caminhos(s, chave.length, livre, xs)) {
      if (++nos > orcamento) return null;
      if (!p.some(fim)) continue;
      marcaCaminho(p, chave, true);
      const ws = palavras.slice();
      if (cabe(componentes(livre), ws.map(x => x.length)) && resto(ws)) { sol.push({ w: chave, p, chave: true }); return { grid, sol }; }
      marcaCaminho(p, chave, false);
      nos += 50;
    }
  }
  return null;
}

// grupos de palavras que somam alvo letras (4 a 8 palavras), em ordem sorteada
function* grupos(ws, alvo) {
  const lista = shuffle(ws.slice());
  const cur = [];
  function* rec(i, soma) {
    if (soma === alvo && cur.length >= 4) { yield cur.slice(); return; }
    if (soma >= alvo || i >= lista.length || cur.length >= 8) return;
    cur.push(lista[i]); yield* rec(i + 1, soma + lista[i].length); cur.pop();
    yield* rec(i + 1, soma);
  }
  yield* rec(0, 0);
}

export function montar(tema) {
  const [pista, chaveTxt, lista] = tema;
  const chave = norm(chaveTxt);
  const vistos = new Map();
  for (const t of lista) { const n = norm(t); if (n.length >= 4 && n.length <= 10 && n !== chave && !vistos.has(n)) vistos.set(n, t); }
  const ws = [...vistos.keys()];
  let tent = 0;
  for (const g of grupos(ws, C - chave.length)) {
    if (++tent > 60) break;
    const r = encaixar(chave, g);
    if (!r) continue;
    const ordem = r.sol.sort((a, b) => (b.chave ? 1 : 0) - (a.chave ? 1 : 0) || a.w.localeCompare(b.w));
    return {
      t: pista, c: chave,
      g: r.grid.join(""),
      // palavras: texto do tabuleiro, forma escrita e caminho (casas em ordem)
      w: ordem.map(x => ({ w: x.w, o: x.chave ? chaveTxt : vistos.get(x.w), p: x.p, ...(x.chave ? { k: 1 } : {}) })),
    };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv[2]) seed = +process.argv[2];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const usados = new Set(old.map(p => p.c));
  const fila = shuffle([...TEMAS, ...DO_BANCO].filter(t => !usados.has(norm(t[1]))));
  const out = [...old];
  const t0 = Date.now();
  for (const tema of fila) {
    const p = montar(tema);
    if (!p) { console.log("não encaixou:", tema[0]); continue; }
    out.push(p);
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
