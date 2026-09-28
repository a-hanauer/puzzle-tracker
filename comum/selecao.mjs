// Seleção dos desafios, comum aos geradores (Eclipse, Pingado, Retalhos, Novelo).
//
// Cada dia da semana gera muitos candidatos do seu tamanho e técnica. Deles:
//   1. fica a faixa de esforço do dia (em cada estilo, para os estilos variarem);
//   2. dentro da faixa, os mais interessantes (campo `i`, calculado por cada jogo)
//      vão para o desafio do dia — quem joga todo dia pega os melhores;
//   3. o que sobra da faixa vai para o jogo livre (mesma dificuldade); se faltar,
//      completa com candidatos de fora da faixa.
// Os desafios que já saíram (até hoje) nunca mudam: `mantidos` os lê do arquivo atual.

import { readFileSync } from "node:fs";
import { join } from "node:path";

// desafios já publicados: do #1 até o de hoje (pelo relógio de quem gera)
export function mantidos(dir, epoch) {
  let old = [];
  try { old = JSON.parse(readFileSync(join(dir, "desafios.json"), "utf8")).puzzles; } catch { return []; }
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const k = Math.round((hoje - new Date(epoch[0], epoch[1], epoch[2])) / 86400000) + 1;
  return old.slice(0, Math.max(0, Math.min(k, old.length)));
}

// cand: candidatos de um dia da semana, cada um com d (esforço), i (interesse) e,
// se houver, s (estilo). band: [início, fim] da faixa de esforço, em fração (0 a 1).
// Devolve { dia: [...], livre: [...] }.
export function escolher(cand, need, nLivre, band, rand) {
  const shuffle = a => { for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(rand() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
  cand.forEach(p => (p.q = rand()));
  const estilos = [...new Set(cand.map(p => p.s ?? "_"))];
  const faixa = {}, fora = [];
  for (const st of estilos) {
    const g = cand.filter(p => (p.s ?? "_") === st).sort((a, b) => a.d - b.d || a.q - b.q);
    const i0 = Math.floor(g.length * band[0]), i1 = Math.ceil(g.length * band[1]);
    faixa[st] = g.slice(i0, i1).sort((a, b) => b.i - a.i || a.q - b.q);   // mais interessantes primeiro
    fora.push(...g.slice(0, i0), ...g.slice(i1));
  }
  // desafio do dia: vai pegando o melhor de cada estilo, em rodízio
  const dia = [];
  for (let r = 0; dia.length < need; r++) {
    let pegou = false;
    for (const st of estilos) if (dia.length < need && faixa[st].length) { dia.push(faixa[st].shift()); pegou = true; }
    if (!pegou) break;
  }
  if (dia.length < need) throw new Error(`faltaram desafios na faixa (${dia.length} de ${need})`);
  const sobra = shuffle(estilos.flatMap(st => faixa[st]));
  const livre = [...sobra, ...shuffle(fora)].slice(0, nLivre);
  const limpa = ({ q, i, ...p }) => p;
  return { dia: shuffle(dia).map(limpa), livre: livre.map(limpa) };
}
