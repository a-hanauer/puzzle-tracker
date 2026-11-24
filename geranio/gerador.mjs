// Gerânio (id "girassol") — gerador dos desafios (node geranio/gerador.mjs [dias])
//
// Sete letras numa flor: a do miolo é obrigatória; valem palavras de 4 letras ou mais feitas só com as letras
// da flor (letra pode repetir). Acentos e ç não contam (AÇÃO = ACAO). Todo dia há ao menos um pangrama
// (palavra que usa as 7 letras).
//
// Vale qualquer palavra do dicionário largo (cordel/palavras.txt: com plurais, femininos e conjugações), menos as
// bloqueadas (palavrões). As "palavras do dia" (a régua, o pleno e as dicas contam só elas) são as comuns: as respostas
// curadas do Cordel e as flexões comuns delas — geranio/base.json, feito por geranio/comuns.mjs a partir do fserb/pt-br.
// Palavra válida fora das do dia é "rara" e vale o dobro (a página faz a conta).
//
// Nível = dia da semana (segunda = 1 … domingo = 7): o número de palavras do dia vai crescendo (faixas em NIVEL).
// Desde o #22 (25/11/2026): de novo 7 letras (6 pétalas + miolo), listas de ~50 (segunda) a ~80 (domingo), e a dificuldade
// vem também do vocabulário: cada flor tem a média de uso das suas palavras (geranio/uso.json, de uso.py); segunda pega
// as flores de palavras mais usadas e domingo as de palavras menos usadas (todas ainda de uso corrente). Marcadas com v: 3.
// Para variar: as mesmas 7 letras não voltam em 150 dias (nem com outro miolo) e o miolo não repete a
// letra do dia anterior. Dias já publicados mantêm as letras (a lista é refeita pelas regras de hoje).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mantidos } from "../comum/selecao.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
export const EPOCH = [2026, 10, 4];                 // #1 = quarta, 04/11/2026
// quantas palavras tem a lista do dia, por nível
// Desde o #3 (06/11/2026): flor de 6 letras (5 pétalas + miolo) e palavras do dia = só verbetes de uso (verbetes.json, de
// verbetes.py). Os #1 e #2 (7 letras, base.json) ficam como saíram. A versão anterior (7 letras) está no ramo geranio-6.1.
// #3 a #21: 6 letras e listas de 10–14 (segunda) a 33–50 (domingo); ficam como saíram
const LETRAS = 7;
const NIVEL = { 1: [46, 54], 2: [50, 58], 3: [54, 63], 4: [58, 67], 5: [62, 72], 6: [66, 77], 7: [72, 85] };
// vocabulário: fatia das flores (da mais usada à menos usada) que cada nível pega, com uma folga para não faltar flor
const VOCAB = l => [Math.max(0, (l - 1) / 7 - .03), Math.min(1, l / 7 + .03)];

export const norm = w => w.split(" · ")[0].normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();   // "país · pais" = uma jogada
export const pontos = (w, pangrama) => (w.length === 4 ? 1 : w.length) + (pangrama ? new Set(w).size : 0);   // pangrama: + nº de letras da flor

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function palavras() {
  const v = JSON.parse(readFileSync(join(DIR, "verbetes.json"), "utf8"));
  return new Map(Object.entries(v).map(([n, w]) => [n.toUpperCase(), w]));   // MAIUSCULA -> escrita com acento
}

// todas as flores possíveis: 7 letras de algum pangrama × cada letra no miolo; dif = média de uso das palavras (maior = menos usadas)
export function flores(m, uso = {}) {
  const lista = [...m.keys()], porConj = new Map();
  for (const n of lista) { const s = [...new Set(n)]; if (s.length === LETRAS) porConj.set(s.sort().join(""), true); }
  const out = [];
  for (const k of porConj.keys()) {
    const L = new Set(k), cabem = lista.filter(n => [...n].every(c => L.has(c)));
    for (const c of k) {
      const ws = cabem.filter(n => n.includes(c));
      const pang = ws.filter(n => new Set(n).size === LETRAS);
      const max = ws.reduce((t, n) => t + pontos(n, new Set(n).size === LETRAS), 0);
      const dif = ws.reduce((t, n) => t + (uso[n.toLowerCase()] ?? 14), 0) / ws.length;
      out.push({ k, c, ws, pang, max, dif });
    }
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const DIAS = +(process.argv[2] || 400);
  const uso = JSON.parse(readFileSync(join(DIR, "uso.json"), "utf8"));
  const m = palavras(), todas = flores(m, uso), rand = rng(20261125);
  // posição de cada flor no vocabulário (0 = palavras mais usadas, 1 = menos usadas), entre as de tamanho de alguma faixa
  { const lim = [NIVEL[1][0], NIVEL[7][1]], ord = todas.filter(f => f.ws.length >= lim[0] && f.ws.length <= lim[1]).sort((a, b) => a.dif - b.dif);
    ord.forEach((f, i) => (f.pv = i / (ord.length - 1))); }
  const old = process.env.NOVO ? [] : mantidos(DIR, EPOCH);
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const monta = f => {
    const fora = [...f.k].filter(x => x !== f.c);
    for (let i = fora.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [fora[i], fora[j]] = [fora[j], fora[i]]; }
    const ws = f.ws.slice().sort((a, b) => a.localeCompare(b));
    return { v: 3, l: 0, c: f.c, f: fora.join(""), w: ws.map(n => m.get(n)), m: f.max };
  };
  const refaz = p => { const L = new Set(p.c + p.f), nL = L.size, ws = [...m.keys()].filter(n => n.includes(p.c) && [...n].every(c => L.has(c))).sort((x, y) => x.localeCompare(y));
    return { ...p, w: ws.map(n => m.get(n)), m: ws.reduce((t, n) => t + pontos(n, new Set(n).size === nL), 0) }; };
  // dias já publicados: as mesmas letras, a lista refeita com as palavras do dia atuais (os #1 e #2, da versão antiga, ficam como estão)
  for (let i = 2; i < old.length; i++) old[i] = refaz(old[i]);
  const out = old.slice(), usadaEm = new Map(), pangUsado = new Set();
  out.forEach((p, k) => { usadaEm.set([p.c, ...p.f].sort().join(""), k); p.w.forEach(w => { const n = norm(w); if (new Set(n).size === LETRAS) pangUsado.add(n); }); });
  for (let k = out.length; k < DIAS; k++) {
    const l = nivelDe(k), [a, b] = NIVEL[l], [v0, v1] = VOCAB(l), ontem = out[k - 1];
    const ok = todas.filter(f => f.ws.length >= a && f.ws.length <= b && f.pv >= v0 && f.pv <= v1 && f.c !== ontem?.c
      && !(usadaEm.has(f.k) && k - usadaEm.get(f.k) < 150));
    if (!ok.length) throw new Error(`faltou flor para o dia ${k + 1} (nível ${l})`);
    const f = ok[Math.floor(rand() * ok.length)];
    const p = monta(f); p.l = l; out.push(p);
    usadaEm.set(f.k, k); f.pang.forEach(n => pangUsado.add(n));
  }
  // jogo livre: por nível, flores fora das do dia
  const doDia = new Set(out.map(p => [p.c, ...p.f].sort().join("") + p.c));
  const livre = {};
  for (let l = 1; l <= 7; l++) {
    const [a, b] = NIVEL[l], [v0, v1] = VOCAB(l);
    const c = todas.filter(f => f.ws.length >= a && f.ws.length <= b && f.pv >= v0 && f.pv <= v1 && !doDia.has(f.k + f.c));
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    livre[l] = c.slice(0, 40).map(f => ({ ...monta(f), l }));
  }
  const { bloq } = JSON.parse(readFileSync(join(DIR, "base.json"), "utf8"));
  writeFileSync(join(DIR, "desafios.json"), JSON.stringify({ epoch: EPOCH, bloq, puzzles: out, livre }));
  const cont = {}; for (const p of out.slice(0, 7)) console.log(`#${out.indexOf(p) + 1} nível ${p.l}: ${p.c} + ${p.f} · ${p.w.length} palavras · ${p.m} pts · ${p.w.filter(w => new Set(norm(w)).size === p.f.length + 1).join(", ")}`);
  for (let l = 1; l <= 7; l++) cont[l] = todas.filter(f => f.ws.length >= NIVEL[l][0] && f.ws.length <= NIVEL[l][1]).length;
  console.log("flores por nível:", cont, "· livre:", Object.fromEntries(Object.entries(livre).map(([l, v]) => [l, v.length])));
}
