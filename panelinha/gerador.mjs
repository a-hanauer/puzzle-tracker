// Gerador de desafios da Panelinha.
//
// Cada dia: 4 grupos de 4 palavras, um de cada cor (amarelo = mais óbvio … roxo = mais
// traiçoeiro). As categorias vêm do banco compartilhado (comum/banco.mjs) e dos temas do
// Cordel. A graça são as armadilhas: palavras que também caberiam em outro grupo do dia.
// O gerador só aceita o dia se existir UMA única divisão das 16 palavras em 4 grupos.
// A dificuldade sobe na semana: segunda com poucas armadilhas e roxo mais leve; domingo
// com mais armadilhas e o roxo mais esperto.
//
// Uso:  node panelinha/gerador.mjs [dias] [semente]
// Os desafios que já saíram (até hoje) não mudam.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { BANCO } from "../comum/banco.mjs";
import { TEMAS } from "../cordel/temas.mjs";
import { mantidos } from "../comum/selecao.mjs";

export const EPOCH = [2026, 9, 10];            // #1 = sábado, 10/10/2026
let seed = 20261010;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(rand() * a.length)];
export const chave = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toLowerCase();
// cabe numa peça: até 2 palavras e 12 letras
const cabeNaPeca = t => t.split(/\s+/).length <= 2 && t.replace(/[\s-]/g, "").length <= 12 && t.length <= 13;

// todas as categorias: banco + temas do Cordel (estes como grupos diretos)
const CATS = [
  ...BANCO.map(([nome, tipo, nivel, ws]) => ({ nome, tipo, nivel, ws })),
  ...TEMAS.map(([pista, , ws]) => ({ nome: pista, tipo: "direto", nivel: 1, ws, cordel: true })),
].map((c, id) => {
  const vistos = new Map();
  for (const w of c.ws) { const k = chave(w); if (k.length >= 2 && !vistos.has(k)) vistos.set(k, w); }
  return { ...c, id, mapa: vistos, ok: [...vistos].filter(([, w]) => cabeNaPeca(w)).map(([k]) => k) };
}).filter(c => c.ok.length >= 4);

// a que categorias cada palavra pertence
const MEMB = new Map();
for (const c of CATS) for (const k of c.mapa.keys()) { if (!MEMB.has(k)) MEMB.set(k, new Set()); MEMB.get(k).add(c.id); }
const comum = (a, b) => [...a.mapa.keys()].filter(k => b.mapa.has(k)).length;
// duas categorias do mesmo jeito de agrupar com muitas palavras em comum (frutas × frutas) confundem
// além do que o banco sabe: não vão juntas. Expressão e trocadilho dividem palavras de propósito.
const brigam = (a, b) => {
  if (a.nome === b.nome) return true;
  const n = comum(a, b);
  const jogo = t => t === "expressao" || t === "trocadilho";
  if (jogo(a.tipo) || jogo(b.tipo)) return false;
  return a.tipo === "direto" && b.tipo === "direto" ? n >= 1 : n >= 2;   // dois grupos diretos com algo em comum: assunto parecido demais
};

// quantas divisões das 16 palavras em 4 grupos existem (até 2)
function divisoes(cats, palavras) {
  const opcoes = palavras.map(k => cats.map((c, j) => (c.mapa.has(k) ? j : -1)).filter(j => j >= 0));
  const cont = [0, 0, 0, 0];
  let n = 0;
  (function rec(i) {
    if (n > 1) return;
    if (i === palavras.length) { n++; return; }
    for (const j of opcoes[i]) if (cont[j] < 4) { cont[j]++; rec(i + 1); cont[j]--; }
  })(0);
  return n;
}

// dificuldade pelo dia da semana (segunda = 0 … domingo = 6)
const SEMANA = [
  { cores: [[1], [1, 2], [2, 3], [3]], armadilhas: [0, 1], liga: .3 },
  { cores: [[1], [1, 2], [2, 3], [3, 4]], armadilhas: [1, 2], liga: .5 },
  { cores: [[1], [2], [3], [3, 4]], armadilhas: [1, 2], liga: .6 },
  { cores: [[1], [2], [3], [4, 3]], armadilhas: [1, 3], liga: .7 },
  { cores: [[1, 2], [2], [3], [4]], armadilhas: [2, 3], liga: .8 },
  { cores: [[1, 2], [2, 3], [3], [4]], armadilhas: [2, 4], liga: .85 },
  { cores: [[2, 1], [2, 3], [3], [4]], armadilhas: [3, 5], liga: .9 },
];

export function montarDia(w, recentes) {
  // se não sair com as armadilhas pedidas, aceita uma a menos (e depois outra)
  for (let folga = 0; folga <= 2; folga++) {
    const base = SEMANA[w], cfg = { ...base, armadilhas: [Math.max(0, base.armadilhas[0] - folga), base.armadilhas[1]] };
    const p = tentar(cfg, recentes);
    if (p) return p;
  }
  return null;
}
function tentar(cfg, recentes) {
  for (let tent = 0; tent < 30000; tent++) {
    const cats = [];
    for (const niveis of cfg.cores) {
      const cand = CATS.filter(c => niveis.includes(c.nivel) && !(c.nivel === 4 ? recentes.roxo : recentes.todas).has(c.nome) && !cats.some(x => brigam(x, c)));
      if (!cand.length) break;
      // para ter armadilhas, prefere categorias que dividem palavras com as já escolhidas
      const liga = cand.filter(c => cats.some(x => comum(x, c) > 0));
      cats.push(liga.length && rand() < cfg.liga ? pick(liga) : pick(cand));
    }
    if (cats.length < 4) continue;
    // palavras: 4 de cada; prefere as que também cabem em outro grupo do dia (armadilhas)
    const usadas = new Set(), grupos = [];
    let ok = true;
    for (const c of cats) {
      const outras = k => cats.some(x => x !== c && x.mapa.has(k));
      const lista = shuffle(c.ok.filter(k => !usadas.has(k)));
      const arm = lista.filter(outras), lim = lista.filter(k => !outras(k));
      const quer = Math.floor(rand() * 3);              // 0 a 2 armadilhas por grupo
      const g = [...arm.slice(0, quer), ...lim].slice(0, 4);
      if (g.length < 4) { ok = false; break; }
      g.forEach(k => usadas.add(k));
      grupos.push(g);
    }
    if (!ok) continue;
    const todas = grupos.flat();
    const nArm = todas.filter(k => cats.filter(c => c.mapa.has(k)).length > 1).length;
    if (nArm < cfg.armadilhas[0] || nArm > cfg.armadilhas[1]) continue;
    if (divisoes(cats, todas) !== 1) continue;
    return {
      g: cats.map((c, i) => ({ n: c.nome, c: i, w: grupos[i].map(k => c.mapa.get(k).toUpperCase()) })),
      a: nArm,
    };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
  const out = [...old];
  const hist = old.flatMap(p => p.g.map(x => x.n));
  for (let k = old.length; k < DIAS; k++) {
    const w = (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7;
    // uma categoria não volta em ~14 dias; as roxas (poucas) podem voltar depois de ~9, com outras palavras
    const recentes = { todas: new Set(hist.slice(-4 * 14)), roxo: new Set(hist.slice(-4 * 9)) };
    const p = montarDia(w, recentes);
    if (!p) throw new Error(`não consegui montar o dia ${k + 1}`);
    hist.push(...p.g.map(x => x.n));
    out.push({ ...p, l: w + 1 });
  }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  const arm = out.slice(old.length).map(p => p.a);
  console.log(`pronto: ${out.length} dias (${old.length} mantidos) · categorias no banco: ${CATS.length} · armadilhas por dia: ${Math.min(...arm)}–${Math.max(...arm)}`);
}
