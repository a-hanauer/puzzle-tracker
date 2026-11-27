// Engrenagem — gerador dos desafios (node engrenagem/gerador.mjs [dias])
//
// Cada anel tem números diferentes entre si (1 a 9); o alvo de cada raio é a soma da solução. O desafio só entra se
// tiver solução única e se sair só por dedução (motor.mjs): de segunda a sexta só com o "limite" (máximos e mínimos);
// sábado e domingo pedem também a "conta exata" ao menos uma vez — um lance à frente, nunca chute.
// Nível = dia da semana (segunda = 1). A dificuldade cresce com anéis, raios e o número de rodadas de dedução.
// Os desafios já publicados (até hoje) não mudam.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve, contaSolucoes, resolvido } from "./motor.mjs";
import { mantidos } from "../comum/selecao.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
export const EPOCH = [2026, 10, 27];               // #1 = sexta, 27/11/2026
// nível: [anéis, raios, rodadas mínimas, rodadas máximas, precisa da conta exata]
const NIVEL = { 1: [3, 6, 1, 2, false], 2: [3, 6, 3, 9, false], 3: [3, 8, 2, 9, false], 4: [4, 6, 2, 3, false],
  5: [4, 6, 4, 9, false], 6: [4, 8, 3, 9, false], 7: [4, 8, 1, 9, true] };

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function candidato(l, rand) {
  const [A, n, rMin, rMax, precisaExata] = NIVEL[l];
  for (let t = 0; t < 20000; t++) {
    const nums = [...Array(A)].map(() => { const v = [1, 2, 3, 4, 5, 6, 7, 8, 9]; for (let i = 8; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [v[i], v[j]] = [v[j], v[i]]; } return v.slice(0, n); });
    const P = { n, nums, alvo: [...Array(n)].map((_, j) => nums.reduce((s, a) => s + a[j], 0)) };
    if (contaSolucoes(P) !== 1) continue;
    const so = resolve(P, false);
    if (precisaExata) { if (so.ok) continue; const se = resolve(P, true); if (!se.ok) continue; P.r = se.rodadas; }
    else { if (!so.ok || so.rodadas < rMin || so.rodadas > rMax) continue; P.r = so.rodadas; }
    // posição de partida: nenhum anel já no lugar e nenhum raio já certo
    let ini;
    for (let k = 0; k < 50; k++) {
      ini = nums.map(() => 1 + Math.floor(rand() * (n - 1)));
      if (!P.alvo.some((tg, j) => nums.reduce((s, a, i) => s + a[(j + ini[i]) % n], 0) === tg)) break;
      ini = null;
    }
    if (!ini) continue;
    return { l, n, nums: nums.map(a => a.join("")), alvo: P.alvo, ini, r: P.r };
  }
  throw new Error("não saiu desafio para o nível " + l);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const DIAS = +(process.argv[2] || 400), rand = rng(20261127);
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  const out = process.env.NOVO ? [] : mantidos(DIR, EPOCH);
  const vistos = new Set(out.map(p => p.nums.join("|")));
  for (let k = out.length; k < DIAS; k++) {
    let p; do { p = candidato(nivelDe(k), rand); } while (vistos.has(p.nums.join("|")));
    vistos.add(p.nums.join("|")); out.push(p);
  }
  const livre = [];
  for (let l = 1; l <= 7; l++) for (let i = 0; i < 40; i++) livre.push(candidato(l, rand));
  writeFileSync(join(DIR, "desafios.json"), JSON.stringify({ epoch: EPOCH, puzzles: out }));
  writeFileSync(join(DIR, "livre.json"), JSON.stringify({ puzzles: livre }));
  const por = {}; out.forEach(p => { (por[p.l] ||= []).push(p.r); });
  console.log(out.slice(0, 7).map((p, i) => `#${i + 1} nível ${p.l}: ${p.nums.length} anéis × ${p.n} raios · ${p.r} rodadas · alvos ${p.alvo.join(" ")}`).join("\n"));
  console.log("rodadas por nível:", Object.fromEntries(Object.entries(por).map(([l, v]) => [l, `${Math.min(...v)}–${Math.max(...v)}`])));
}
