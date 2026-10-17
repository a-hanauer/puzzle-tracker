// Gerador do Brigadeiro: inclinar a assadeira para levar cada brigadeiro à forminha da sua cor.
//
// Para cada candidato: sorteia as barras de chocolate num tabuleiro 7 × 8 (papel todo ligado), as forminhas
// e os brigadeiros (um por forminha, mesma cor, nenhum começando em cima de forminha) e resolve por busca em
// largura (motor.mjs): o mínimo de inclinações é exato e todo desafio tem solução.
// Dificuldade pela semana (segunda = 1 … domingo = 7): mais doces e mais inclinações mínimas; dentro da faixa,
// o esforço é quanto a busca precisa olhar, e vão primeiro os que usam as quatro direções.
// Uso:  node brigadeiro/gerador.mjs [dias] [semente]      (os desafios que já saíram não mudam; NOVO=1 refaz tudo)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mantidos, escolher } from "../comum/selecao.mjs";
import { W, H, N, passo, resolve } from "./motor.mjs";

export const EPOCH = [2026, 9, 17];            // #1 = sábado, 17/10/2026 (entrou no lugar da Panelinha)
let seed = 20261018;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const rint = n => Math.floor(rand() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export const NIVEL = {
  1: { doces: 2, paredes: [7, 10], inc: [3, 4], faixa: [0, .7] },
  2: { doces: 2, paredes: [7, 11], inc: [4, 6], faixa: [.3, 1] },
  3: { doces: 3, paredes: [8, 12], inc: [4, 6], faixa: [0, .7] },
  4: { doces: 3, paredes: [8, 12], inc: [6, 8], faixa: [.2, .9] },
  5: { doces: 3, paredes: [9, 13], inc: [7, 9], faixa: [.3, 1] },
  6: { doces: 4, paredes: [9, 13], inc: [7, 10], faixa: [.2, .9] },
  7: { doces: 4, paredes: [9, 14], inc: [9, 13], faixa: [.4, 1] },
};

function ligado(parede) {
  const ini = parede.findIndex(x => !x); if (ini < 0) return false;
  const vis = new Uint8Array(N), fila = [ini]; vis[ini] = 1;
  for (let k = 0; k < fila.length; k++) for (let d = 0; d < 4; d++) { const j = passo(fila[k], d); if (j >= 0 && !vis[j] && !parede[j]) { vis[j] = 1; fila.push(j); } }
  return parede.every((p, i) => p || vis[i]);
}
function paredes(qtd) {
  for (;;) {
    const p = Array(N).fill(false); let n = 0, t = 0;
    while (n < qtd && t++ < 400) {
      const i = rint(N), j = rand() < .45 ? passo(i, rint(2) ? 1 : 2) : -1;
      const novas = [i, j].filter(x => x >= 0 && !p[x]);
      if (!novas.length || n + novas.length > qtd) continue;
      novas.forEach(x => (p[x] = true));
      if (!ligado(p)) { novas.forEach(x => (p[x] = false)); continue; }
      n += novas.length;
    }
    if (n === qtd) return p;
  }
}

export function desafio(nivel) {
  const cfg = NIVEL[nivel];
  for (let t = 0; t < 20000; t++) {
    const parede = paredes(cfg.paredes[0] + rint(cfg.paredes[1] - cfg.paredes[0] + 1));
    const livres = shuffle([...Array(N).keys()].filter(i => !parede[i]));
    const forms = livres.slice(0, cfg.doces), doces = livres.slice(cfg.doces, 2 * cfg.doces);
    const g = [...Array(N).keys()].map(i => {
      if (parede[i]) return "#";
      const f = forms.indexOf(i), b = doces.indexOf(i);
      return f >= 0 ? "ABCD"[f] : b >= 0 ? "abcd"[b] : ".";
    }).join("");
    const r = resolve(g);
    if (!r || r.n < cfg.inc[0] || r.n > cfg.inc[1]) continue;
    const dirs = new Set(r.lances).size;
    return { g, m: r.n, l: nivel, d: Math.log(r.estados) + r.n / 3, i: dirs * 10 + rand() };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const dir = dirname(fileURLToPath(import.meta.url));
  // NOVO=1: refaz tudo (em 17/10/2026 o jogo trocou de "empurrar" para "inclinar" e o ano todo foi refeito)
  const old = process.env.NOVO ? [] : mantidos(dir, EPOCH);
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const vistos = new Set(old.map(p => p.g)), fila = {}, t0 = Date.now();
  for (let l = 1; l <= 7; l++) {
    let need = 0; for (let k = old.length; k < DIAS; k++) if (nivelDe(k) === l) need++;
    const per = Math.ceil(need / (NIVEL[l].faixa[1] - NIVEL[l].faixa[0]) * 1.1), pool = [];
    while (pool.length < per) { const p = desafio(l); if (!p) throw new Error(`nível ${l}: não consegui montar`); if (!vistos.has(p.g)) { vistos.add(p.g); pool.push(p); } }
    fila[l] = escolher(pool, need, 0, NIVEL[l].faixa, rand).dia;
    console.log(`nível ${l}: ${pool.length} candidatos · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const out = [...old];
  for (let k = old.length; k < DIAS; k++) { const { d, i, ...p } = fila[nivelDe(k)].shift(); out.push(p); }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, w: W, h: H, puzzles: out }));
  for (let l = 1; l <= 7; l++) { const a = out.slice(old.length).filter(p => p.l === l).map(p => p.m); console.log(`nível ${l}: ${a.length} dias · inclinações ${Math.min(...a)}–${Math.max(...a)}`); }
}
