// Gerador do Brigadeiro: empurrar brigadeiros até as forminhas (no jeito do "empurrar caixas").
//
// Para cada desafio:
//   1. sorteia as barras de chocolate (paredes) num tabuleiro 7 × 8, com o papel todo ligado;
//   2. sorteia as forminhas e põe um brigadeiro em cada;
//   3. "desfaz" o jogo: a partir de todos os doces nas forminhas, puxa doces de todas as maneiras
//      possíveis (busca em largura). Cada puxão é um empurrão ao contrário, então a distância de um
//      estado até o fim é exatamente o menor número de empurrões para resolvê-lo;
//   4. escolhe um começo com o número de empurrões do dia (nenhum doce começando na forminha).
// Todo desafio tem solução (saiu dela) e o mínimo de empurrões é exato. A página confere de novo
// com o resolvedor (motor.mjs) e usa o mesmo resolvedor para a dica.
//
// Dificuldade pela semana (segunda = 1 … domingo = 7): mais doces e mais empurrões mínimos; dentro de cada dia,
// fica a faixa de esforço (quanto a busca precisa olhar), e os desafios em que os doces mais dependem uns dos
// outros (a solução troca de doce mais vezes) vão primeiro.
// Uso:  node brigadeiro/gerador.mjs [dias] [semente]      (os desafios que já saíram não mudam)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mantidos, escolher } from "../comum/selecao.mjs";
import { W, H, N, passo, alcance, resolve, trocas } from "./motor.mjs";

export const EPOCH = [2026, 9, 17];            // #1 = sábado, 17/10/2026 (entrou no lugar da Panelinha)
let seed = 20261017;
function rand() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const rint = n => Math.floor(rand() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// doces, paredes e faixa de empurrões mínimos por dia da semana; faixa = parte do esforço que o dia pega
export const NIVEL = {
  1: { doces: 2, paredes: [8, 11], emp: [5, 9], faixa: [0, .7] },
  2: { doces: 2, paredes: [8, 12], emp: [8, 13], faixa: [.3, 1] },
  3: { doces: 3, paredes: [9, 12], emp: [9, 14], faixa: [0, .7] },
  4: { doces: 3, paredes: [9, 13], emp: [13, 19], faixa: [.2, .9] },
  5: { doces: 3, paredes: [10, 14], emp: [17, 25], faixa: [.3, 1] },
  6: { doces: 4, paredes: [10, 14], emp: [18, 27], faixa: [.2, .9] },
  7: { doces: 4, paredes: [10, 15], emp: [24, 36], faixa: [.4, 1] },
};

function ligado(parede) {
  const ini = parede.findIndex(x => !x); if (ini < 0) return false;
  const { vis } = alcance(parede, new Uint8Array(N), ini);
  return parede.every((p, i) => p || vis[i]);
}
function paredes(qtd) {
  for (;;) {
    const p = Array(N).fill(false);
    let n = 0, t = 0;
    while (n < qtd && t++ < 400) {
      // blocos de 1 ou 2 casas (uma barra de chocolate inteira ou um tablete)
      const i = rint(N), d = rint(2) ? 1 : 2, j = rand() < .45 ? passo(i, d) : -1;
      const novas = [i, j].filter(x => x >= 0 && !p[x]);
      if (!novas.length || n + novas.length > qtd) continue;
      novas.forEach(x => (p[x] = true));
      if (!ligado(p)) { novas.forEach(x => (p[x] = false)); continue; }
      n += novas.length;
    }
    if (n === qtd) return p;
  }
}

// busca ao contrário: todos os estados de onde dá para terminar, com o menor número de empurrões
function desfaz(parede, forminhas, limite = 600000) {
  const ocup = new Uint8Array(N), dist = new Map(), lista = [];
  const add = (doces, p, d) => { const k = doces.join(",") + "|" + p; if (dist.has(k)) return; dist.set(k, d); lista.push({ doces, p, d }); };
  forminhas.forEach(i => (ocup[i] = 1));
  const feito = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (!parede[i] && !ocup[i] && !feito[i]) {
    const { vis, min } = alcance(parede, ocup, i);
    vis.forEach((v, j) => { if (v) feito[j] = 1; });
    add([...forminhas].sort((a, b) => a - b), min, 0);
  }
  forminhas.forEach(i => (ocup[i] = 0));
  for (let k = 0; k < lista.length && lista.length < limite; k++) {
    const st = lista[k];
    st.doces.forEach(i => (ocup[i] = 1));
    const { vis } = alcance(parede, ocup, st.p);
    for (const b of st.doces) for (let d = 0; d < 4; d++) {
      const a = passo(b, d), c = a >= 0 ? passo(a, d) : -1;               // colher em a, recua para c, o doce vem de b para a
      if (a < 0 || c < 0 || !vis[a] || parede[c] || ocup[c]) continue;
      const nd = st.doces.map(x => (x === b ? a : x)).sort((x, y) => x - y);
      ocup[b] = 0; ocup[a] = 1;
      const { min } = alcance(parede, ocup, c);
      ocup[a] = 0; ocup[b] = 1;
      add(nd, min, st.d + 1);
    }
    st.doces.forEach(i => (ocup[i] = 0));
  }
  return lista;
}

export function desafio(nivel) {
  const cfg = NIVEL[nivel];
  for (let t = 0; t < 400; t++) {
    const parede = paredes(cfg.paredes[0] + rint(cfg.paredes[1] - cfg.paredes[0] + 1));
    const livres = [...Array(N).keys()].filter(i => !parede[i]);
    const forminhas = shuffle(livres.slice()).slice(0, cfg.doces).sort((a, b) => a - b);
    const lista = desfaz(parede, forminhas);
    const eForm = new Set(forminhas);
    const bons = lista.filter(s => s.d >= cfg.emp[0] && s.d <= cfg.emp[1] && s.doces.every(i => !eForm.has(i)));
    if (!bons.length) continue;
    const maxD = Math.max(...bons.map(s => s.d));
    const top = bons.filter(s => s.d === maxD);
    const st = top[rint(top.length)];
    // colher: uma casa sorteada da região dela
    const ocup = new Uint8Array(N); st.doces.forEach(i => (ocup[i] = 1));
    const { vis } = alcance(parede, ocup, st.p);
    const reg = [...Array(N).keys()].filter(i => vis[i]);
    const colher = reg[rint(reg.length)];
    const g = [...Array(N).keys()].map(i => {
      if (parede[i]) return "#";
      const f = eForm.has(i), b = st.doces.includes(i);
      return i === colher ? (f ? "p" : "o") : b ? (f ? "c" : "b") : f ? "f" : ".";
    }).join("");
    // esforço: quanto o resolvedor precisou procurar; interesse: quantas vezes a solução troca de doce
    const r = resolve(g);
    if (!r || r.n !== st.d) continue;
    const tr = trocas(r.empurroes);
    if (tr < cfg.doces + (nivel >= 4 ? 1 : 0)) continue;             // a partir de quinta, pelo menos uma volta a um doce já mexido
    return { g, m: st.d, l: nivel, d: Math.log(r.estados) + st.d / 10, i: tr };
  }
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DIAS = +(process.argv[2] || 365);
  if (process.argv[3]) seed = +process.argv[3];
  const dir = dirname(fileURLToPath(import.meta.url));
  const old = mantidos(dir, EPOCH);
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
  // confere: o resolvedor acha exatamente o mínimo prometido
  for (const p of out.slice(old.length, old.length + 21)) { const r = resolve(p.g); if (!r || r.n !== p.m) throw new Error(`conferência falhou: ${p.g} (${r && r.n} ≠ ${p.m})`); }
  writeFileSync(join(dir, "desafios.json"), JSON.stringify({ epoch: EPOCH, w: W, h: H, puzzles: out }));
  for (let l = 1; l <= 7; l++) { const a = out.slice(old.length).filter(p => p.l === l).map(p => p.m); console.log(`nível ${l}: ${a.length} dias · empurrões ${Math.min(...a)}–${Math.max(...a)}`); }
}
