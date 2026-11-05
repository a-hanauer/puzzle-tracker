// Girassol — gerador dos desafios (node girassol/gerador.mjs [dias])
//
// Sete letras numa flor: a do miolo é obrigatória; valem palavras de 4 letras ou mais feitas só com as letras
// da flor (letra pode repetir). Acentos e ç não contam (AÇÃO = ACAO). Todo dia há ao menos um pangrama
// (palavra que usa as 7 letras).
//
// Respostas: só palavras de uso comum — a lista curada do Cordel (cordel/respostas.json: substantivos e adjetivos
// no masculino singular e verbos no infinitivo; sem nomes próprios, plurais nem conjugações).
//
// Nível = dia da semana (segunda = 1 … domingo = 7): a lista do dia vai crescendo (faixas em NIVEL).
// Para variar: as mesmas 7 letras não voltam em 150 dias (nem com outro miolo) e o miolo não repete a
// letra do dia anterior.
// Os desafios já publicados (até hoje) nunca mudam (comum/selecao.mjs).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mantidos } from "../comum/selecao.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
export const EPOCH = [2026, 10, 4];                 // #1 = quarta, 04/11/2026
// quantas palavras tem a lista do dia, por nível
const NIVEL = { 1: [13, 18], 2: [17, 22], 3: [21, 26], 4: [25, 30], 5: [28, 34], 6: [32, 39], 7: [37, 60] };
const FORA = new Set(["tour", "shampoo", "marte"]);   // estrangeirismos e nomes próprios que escaparam da lista

export const norm = w => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
export const pontos = (w, pangrama) => (w.length === 4 ? 1 : w.length) + (pangrama ? 7 : 0);

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function palavras() {
  const R = JSON.parse(readFileSync(join(DIR, "../cordel/respostas.json"), "utf8"));
  const m = new Map();
  for (const w of Object.values(R)) {
    if (FORA.has(w) || w.length < 4 || !/^[a-zà-üç]+$/.test(w)) continue;
    const n = norm(w);
    if (!/^[A-Z]+$/.test(n) || new Set(n).size > 7 || m.has(n)) continue;
    m.set(n, w);
  }
  return m;                                         // MAIUSCULA -> escrita com acento
}

// todas as flores possíveis: 7 letras de algum pangrama × cada letra no miolo
export function flores(m) {
  const lista = [...m.keys()], porConj = new Map();
  for (const n of lista) { const s = [...new Set(n)]; if (s.length === 7) porConj.set(s.sort().join(""), true); }
  const out = [];
  for (const k of porConj.keys()) {
    const L = new Set(k), cabem = lista.filter(n => [...n].every(c => L.has(c)));
    for (const c of k) {
      const ws = cabem.filter(n => n.includes(c));
      const pang = ws.filter(n => new Set(n).size === 7);
      const max = ws.reduce((t, n) => t + pontos(n, new Set(n).size === 7), 0);
      out.push({ k, c, ws, pang, max });
    }
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const DIAS = +(process.argv[2] || 400);
  const m = palavras(), todas = flores(m), rand = rng(20261104);
  const old = process.env.NOVO ? [] : mantidos(DIR, EPOCH);
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const monta = f => {
    const fora = [...f.k].filter(x => x !== f.c);
    for (let i = fora.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [fora[i], fora[j]] = [fora[j], fora[i]]; }
    const ws = f.ws.slice().sort((a, b) => a.localeCompare(b));
    return { l: 0, c: f.c, f: fora.join(""), w: ws.map(n => m.get(n)), m: f.max };
  };
  const out = old.slice(), usadaEm = new Map(), pangUsado = new Set();
  out.forEach((p, k) => { usadaEm.set([p.c, ...p.f].sort().join(""), k); p.w.forEach(w => { const n = norm(w); if (new Set(n).size === 7) pangUsado.add(n); }); });
  for (let k = out.length; k < DIAS; k++) {
    const l = nivelDe(k), [a, b] = NIVEL[l], ontem = out[k - 1];
    const ok = todas.filter(f => f.ws.length >= a && f.ws.length <= b && f.c !== ontem?.c
      && !(usadaEm.has(f.k) && k - usadaEm.get(f.k) < 150));
    if (!ok.length) throw new Error(`faltou flor para o dia ${k + 1} (nível ${l})`);
    // prefere flores com mais palavras longas (mais interessantes) e sorteia entre as melhores
    ok.sort((x, y) => y.max / y.ws.length - x.max / x.ws.length);
    const f = ok[Math.floor(rand() * Math.min(ok.length, 25))];
    const p = monta(f); p.l = l; out.push(p);
    usadaEm.set(f.k, k); f.pang.forEach(n => pangUsado.add(n));
  }
  // jogo livre: por nível, flores fora das do dia
  const doDia = new Set(out.map(p => [p.c, ...p.f].sort().join("") + p.c));
  const livre = {};
  for (let l = 1; l <= 7; l++) {
    const [a, b] = NIVEL[l];
    const c = todas.filter(f => f.ws.length >= a && f.ws.length <= b && !doDia.has(f.k + f.c));
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    livre[l] = c.slice(0, 60).map(f => ({ ...monta(f), l }));
  }
  writeFileSync(join(DIR, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out, livre }));
  const cont = {}; for (const p of out.slice(0, 7)) console.log(`#${out.indexOf(p) + 1} nível ${p.l}: ${p.c} + ${p.f} · ${p.w.length} palavras · ${p.m} pts · ${p.w.filter(w => new Set(norm(w)).size === 7).join(", ")}`);
  for (let l = 1; l <= 7; l++) cont[l] = todas.filter(f => f.ws.length >= NIVEL[l][0] && f.ws.length <= NIVEL[l][1]).length;
  console.log("flores por nível:", cont, "· livre:", Object.fromEntries(Object.entries(livre).map(([l, v]) => [l, v.length])));
}
