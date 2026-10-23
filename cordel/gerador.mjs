// Gerador do Cordel (desde #21, 24/10/2026): palavras escondidas numa grade, no estilo do Wend.
//
// A grade (5×5 a 7×7) tem algumas casas bloqueadas (a florzinha); as outras letras se dividem em palavras,
// cada uma um caminho de casas vizinhas na horizontal ou na vertical, e cada letra é usada uma vez só.
// O jogador vê quantas palavras há e o tamanho de cada uma.
//
// Para cada candidato: sorteia as casas bloqueadas, divide o resto em caminhos e põe em cada caminho uma
// palavra comum (respostas.json: substantivos e adjetivos no masculino singular e verbos no infinitivo).
// Depois confere, com uma lista bem mais larga de palavras que alguém poderia tentar (alternativas.json,
// inclusive plurais e conjugações), que:
//   1. só existe um jeito de dividir a grade em palavras com aqueles tamanhos;
//   2. dá para chegar lá sem chute: sempre há uma casa que só cabe numa palavra possível (contando as que
//      ainda cabem no que sobrou), como quem acha a próxima palavra olhando.
// Dificuldade pela semana (segunda = 1 … domingo = 7): grade maior, menos casas bloqueadas, palavras mais
// longas; dentro do nível, o esforço é quantas palavras falsas cabem na grade.
// Uso:  node cordel/gerador.mjs [dias] [semente]      (os desafios que já saíram não mudam)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mantidos, escolher } from "../comum/selecao.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
export const EPOCH = [2026, 9, 4];              // #1 = domingo, 04/10/2026
export const INICIO = 20;                       // #20 (23/10/2026) é o primeiro no formato novo
const RESP = JSON.parse(readFileSync(join(DIR, "respostas.json"), "utf8"));      // tabuleiro -> escrita
const ALT = JSON.parse(readFileSync(join(DIR, "alternativas.json"), "utf8"));

let seed = 20261024;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const rint = n => Math.floor(rand() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Formas do tabuleiro: em pé (o celular é vertical) e variadas, para o jogo não ficar repetitivo.
// Cada forma diz, numa tela de W colunas × H linhas, que casas existem; dentro dela entram as florzinhas.
const FORMAS = {
  retangulo: () => true,
  cruz: (r, c, W, H) => Math.abs(c - (W - 1) / 2) <= W / 4 + .3 || Math.abs(r - (H - 1) / 2) <= H / 5 + .3,
  losango: (r, c, W, H) => Math.abs(c - (W - 1) / 2) / (W / 2) + Math.abs(r - (H - 1) / 2) / (H / 2) <= 1.25,
  ampulheta: (r, c, W, H) => Math.abs(c - (W - 1) / 2) <= .9 + Math.abs(r - (H - 1) / 2) / ((H - 1) / 2) * (W / 2 - .9),
  vaso: (r, c, W, H) => Math.abs(c - (W - 1) / 2) <= (r < H * .3 ? W / 4 + .3 : W / 2),
  escada: (r, c, W, H) => { const d = c - r * (W - 2) / (H - 1); return d >= -1.4 && d <= 2.6; },
  ferradura: (r, c, W, H) => !(r < H * .45 && Math.abs(c - (W - 1) / 2) < W / 4),
  anel: (r, c, W, H) => !(Math.abs(r - (H - 1) / 2) < H / 6 && Math.abs(c - (W - 1) / 2) < W / 4),
  halteres: (r, c, W, H) => Math.abs(r - (H - 1) / 2) > H / 6 || Math.abs(c - (W - 1) / 2) <= W / 4,
  zigue: (r, c, W, H) => (r < H / 3 ? c >= W * .3 : r < 2 * H / 3 ? true : c < W * .7),
  degraus: (r, c, W, H) => c <= Math.floor(r * W / H) + 2,
};
export const NOMES_FORMA = Object.keys(FORMAS);

// tela (colunas × linhas), letras (casas usadas) e tamanho das palavras por nível
export const NIVEL = {
  1: { telas: [[5, 6], [5, 7], [4, 7]], letras: [19, 23], tam: [4, 6], faixa: [0, .7] },
  2: { telas: [[5, 7], [6, 7], [5, 8]], letras: [23, 27], tam: [4, 7], faixa: [.2, .9] },
  3: { telas: [[6, 7], [5, 8], [6, 8]], letras: [27, 31], tam: [4, 7], faixa: [0, .7] },
  4: { telas: [[6, 8], [6, 7], [5, 9]], letras: [30, 34], tam: [5, 8], faixa: [.2, .9] },
  5: { telas: [[6, 8], [6, 9], [7, 8]], letras: [33, 38], tam: [5, 8], faixa: [.3, 1] },
  6: { telas: [[7, 8], [6, 9], [7, 9]], letras: [38, 43], tam: [5, 8], faixa: [.2, .9] },
  7: { telas: [[7, 9], [7, 8], [6, 10]], letras: [42, 48], tam: [6, 8], faixa: [.4, 1] },
};

// trie das palavras que valem para conferir
const TRIE = { f: {} };
for (const w of new Set([...ALT, ...Object.keys(RESP)])) { let t = TRIE; for (const ch of w) t = t.f[ch] ??= { f: {} }; t.w = w; }
const PORTAM = {}; for (const w of Object.keys(RESP)) (PORTAM[w.length] ??= []).push(w);

let W = 6, H = 6;
const viz = i => { const r = (i / W) | 0, c = i % W, o = []; if (r) o.push(i - W); if (r < H - 1) o.push(i + W); if (c) o.push(i - 1); if (c < W - 1) o.push(i + 1); return o; };
const vazia = ch => ch === "#" || ch === ".";

// todas as palavras (de 4 a 8 letras) que cabem em caminhos da grade: [{ w, cells (bits), p }]
function colocacoes(g) {
  const N = W * H, out = [], vistos = new Set(), usado = new Uint8Array(N), path = [];
  const rec = (i, t) => {
    const nt = t.f[g[i]]; if (!nt) return;
    usado[i] = 1; path.push(i);
    if (nt.w && path.length >= 4) {
      const k = nt.w + ":" + [...path].sort((a, b) => a - b).join(",");
      if (!vistos.has(k)) { vistos.add(k); let m = 0n; for (const c of path) m |= 1n << BigInt(c); out.push({ w: nt.w, m, p: path.slice() }); }
    }
    if (path.length < 8) for (const j of viz(i)) if (!usado[j] && !vazia(g[j])) rec(j, nt);
    usado[i] = 0; path.pop();
  };
  for (let i = 0; i < N; i++) if (!vazia(g[i])) rec(i, TRIE);
  return out;
}

// quantas divisões da grade em palavras com estes tamanhos (para em 2)
function divisoes(cols, livres, tams) {
  const porCasa = Array.from({ length: W * H }, () => []);
  for (const c of cols) if (tams.has(c.w.length)) for (const i of c.p) porCasa[i].push(c);
  let achadas = 0;
  const faltam = new Map(); for (const [t, q] of tams) faltam.set(t, q);
  const rec = coberto => {
    if (achadas > 1) return;
    let melhor = -1, opc = null;
    for (const i of livres) if (!(coberto >> BigInt(i) & 1n)) {
      const o = porCasa[i].filter(c => !(c.m & coberto) && faltam.get(c.w.length) > 0);
      if (!o.length) return;
      if (!opc || o.length < opc.length) { melhor = i; opc = o; if (o.length === 1) break; }
    }
    if (melhor < 0) { achadas++; return; }
    for (const c of opc) { faltam.set(c.w.length, faltam.get(c.w.length) - 1); rec(coberto | c.m); faltam.set(c.w.length, faltam.get(c.w.length) + 1); if (achadas > 1) return; }
  };
  rec(0n);
  return achadas;
}

// resolvedor "de gente": a cada passo, uma casa livre que só cabe numa palavra possível
// (palavras que não esbarram no que já foi achado e cujo tamanho ainda falta); devolve a ordem ou null
function semChute(cols, livres, tams, sol) {
  let coberto = 0n; const faltam = new Map(tams), ordem = [];
  const sobra = new Set(sol.map((_, k) => k));
  while (sobra.size) {
    const vivas = cols.filter(c => !(c.m & coberto) && faltam.get(c.w.length) > 0);
    let k = -1;
    for (const i of livres) if (!(coberto >> BigInt(i) & 1n)) {
      const o = vivas.filter(c => c.p.includes(i));
      if (o.length === 1) { k = sol.findIndex(s => s.w === o[0].w && s.m === o[0].m); if (k >= 0) break; }
    }
    if (k < 0) return null;
    coberto |= sol[k].m; faltam.set(sol[k].w.length, faltam.get(sol[k].w.length) - 1); sobra.delete(k); ordem.push(k);
  }
  return ordem;
}

// divide as casas livres em caminhos com tamanhos dentro da faixa
function caminhos(livre, tam) {
  const N = W * H, dono = new Int8Array(N).fill(-1), paths = [];
  const livresDe = i => viz(i).filter(j => livre[j] && dono[j] < 0);
  for (let guarda = 0; guarda < 40; guarda++) {
    const resto = [...Array(N).keys()].filter(i => livre[i] && dono[i] < 0);
    if (!resto.length) return paths;
    // começa pela casa mais apertada
    resto.sort((a, b) => livresDe(a).length - livresDe(b).length || rand() - .5);
    const ini = resto[0];
    const alvo = tam[0] + rint(tam[1] - tam[0] + 1);
    const p = [ini]; dono[ini] = paths.length;
    while (p.length < Math.min(alvo, resto.length)) {
      const c = livresDe(p.at(-1)); if (!c.length) break;
      c.sort((a, b) => livresDe(a).length - livresDe(b).length + (rand() - .5) * 1.5);
      dono[c[0]] = paths.length; p.push(c[0]);
    }
    if (p.length < tam[0]) return null;
    paths.push(p);
  }
  return null;
}

// casas da forma que ficam ligadas entre si (a forma não pode ter pedaços soltos)
function ligada(dentro) {
  const ini = dentro.indexOf(true); if (ini < 0) return false;
  const vis = new Uint8Array(W * H), f = [ini]; vis[ini] = 1;
  for (let k = 0; k < f.length; k++) for (const j of viz(f[k])) if (dentro[j] && !vis[j]) { vis[j] = 1; f.push(j); }
  return dentro.every((d, i) => !d || vis[i]);
}

export function desafio(nivel, forma = null) {
  const cfg = NIVEL[nivel];
  for (let t = 0; t < 4000; t++) {
    [W, H] = cfg.telas[rint(cfg.telas.length)];
    const N = W * H, nome = forma || NOMES_FORMA[rint(NOMES_FORMA.length)];
    const dentro = [...Array(N).keys()].map(i => !!FORMAS[nome]((i / W) | 0, i % W, W, H));
    const casas = dentro.filter(Boolean).length;
    const alvoL = cfg.letras[0] + rint(cfg.letras[1] - cfg.letras[0] + 1);
    if (casas < alvoL || casas - alvoL > Math.max(3, casas * .22) || !ligada(dentro)) continue;
    // florzinhas: as casas da forma que sobram, espalhadas por dentro
    const livre = dentro.slice();
    for (const i of shuffle([...Array(N).keys()].filter(i => dentro[i])).slice(0, casas - alvoL)) livre[i] = false;
    if (!ligada(livre)) continue;
    const ps = caminhos(livre, cfg.tam);
    if (!ps) continue;
    for (let f = 0; f < 12; f++) {
      const g = dentro.map(d => (d ? "#" : ".")), sol = [];
      const usadas = new Set();
      let ok = true;
      for (const p of ps) {
        const op = (PORTAM[p.length] || []).filter(w => !usadas.has(w));
        if (!op.length) { ok = false; break; }
        const w = op[rint(op.length)]; usadas.add(w);
        p.forEach((c, k) => (g[c] = w[k]));
        let m = 0n; for (const c of p) m |= 1n << BigInt(c);
        sol.push({ w, m, p });
      }
      if (!ok) break;
      const cols = colocacoes(g);
      const livres = [...Array(N).keys()].filter(i => livre[i]);
      const tams = new Map(); for (const s of sol) tams.set(s.w.length, (tams.get(s.w.length) || 0) + 1);
      if (divisoes(cols, livres, tams) !== 1) continue;
      const ordem = semChute(cols, livres, tams, sol);
      if (!ordem) continue;
      const falsas = cols.filter(c => tams.has(c.w.length)).length - sol.length;
      return {
        c: W, r: H, f: nome, g: g.join(""), l: nivel,   // colunas, linhas, forma; "#" florzinha, "." fora da forma
        // palavras: forma do tabuleiro, forma escrita e caminho; o: ordem em que saem sem chute (para a dica)
        w: sol.map(s => ({ w: s.w, o: RESP[s.w], p: s.p })), o: ordem,
        d: falsas + ordem.length, i: rand(),
      };
    }
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const old = mantidos(DIR, EPOCH, !!process.env.HOJE);   // até hoje (HOJE=1: até ontem, refaz o de hoje); antes de #20, formato de temas
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const vistos = new Set(old.map(p => p.g)), fila = {}, t0 = Date.now();
  for (let l = 1; l <= 7; l++) {
    let need = 0; for (let k = old.length; k < DIAS; k++) if (nivelDe(k) === l) need++;
    const per = Math.ceil(need / (NIVEL[l].faixa[1] - NIVEL[l].faixa[0]) * 1.1) + 20, pool = [];
    while (pool.length < per) { const p = desafio(l); if (!p) throw new Error(`nível ${l}: não consegui montar`); if (!vistos.has(p.g)) { vistos.add(p.g); pool.push(p); } }
    const r = escolher(pool, need, 20, NIVEL[l].faixa, rand);
    fila[l] = r.dia; fila["livre" + l] = r.livre;
    console.log(`nível ${l}: ${pool.length} candidatos · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const out = [...old];
  // a forma não se repete de um dia para o outro
  for (let k = old.length; k < DIAS; k++) {
    const q = fila[nivelDe(k)], ant = out.at(-1)?.f;
    const j = Math.max(0, q.findIndex(p => p.f !== ant));
    const { d, ...p } = q.splice(j, 1)[0]; out.push(p);
  }
  // jogo livre: 20 por nível, fora dos do dia
  const livre = {}; for (let l = 1; l <= 7; l++) livre[l] = fila["livre" + l].map(({ d, ...p }) => p);
  writeFileSync(join(DIR, "desafios.json"), JSON.stringify({ epoch: EPOCH, inicio: INICIO, puzzles: out, livre }));
  for (let l = 1; l <= 7; l++) { const a = out.slice(old.length).filter(p => p.l === l); console.log(`nível ${l}: ${a.length} dias · ${[...new Set(a.map(p => p.f))].length} formas · ${Math.min(...a.map(p => p.w.length))}–${Math.max(...a.map(p => p.w.length))} palavras`); }
}
