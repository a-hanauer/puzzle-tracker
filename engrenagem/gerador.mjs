// Engrenagem — gerador dos desafios (node engrenagem/gerador.mjs [dias])
//
// Desde 27/11/2026 (v: 2): símbolos. A anéis, A símbolos, n raios; em cada raio da solução, um símbolo de cada (cada raio
// é uma permutação sorteada). O anel de dentro é fixo. O desafio só entra se tiver solução única e se sair só por dedução
// (motor.mjs) com o "conflito" — nunca chute. Nível = dia da semana (segunda = 1): mais anéis (3 → 5), mais raios (6 → 10)
// e mais rodadas de dedução (anéis que só se acham depois de outros).
// O #1 (27/11/2026) saiu de manhã no modo de contas e foi refeito no mesmo dia, a pedido do dono.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve, contaSolucoes, certos } from "./motor.mjs";
import { mantidos } from "../comum/selecao.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
export const EPOCH = [2026, 10, 27];               // #1 = sexta, 27/11/2026
// nível: [anéis (= símbolos), raios, rodadas mínimas, rodadas máximas, precisa da "falta"]
const NIVEL = { 1: [3, 6, 1, 1, false], 2: [3, 8, 2, 2, false], 3: [4, 6, 1, 2, false], 4: [4, 8, 2, 2, false],
  5: [4, 8, 3, 9, false], 6: [5, 8, 2, 9, false], 7: [5, 10, 2, 9, false] };

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function candidato(l, rand) {
  const [A, n, rMin, rMax, precisaFalta] = NIVEL[l];
  for (let t = 0; t < 50000; t++) {
    const nums = [...Array(A)].map(() => []);
    for (let j = 0; j < n; j++) {
      const p = [...Array(A).keys()];
      for (let i = A - 1; i > 0; i--) { const k = Math.floor(rand() * (i + 1)); [p[i], p[k]] = [p[k], p[i]]; }
      p.forEach((s, a) => nums[a].push(s));
    }
    // todo anel usa todos os símbolos (nada de anel monótono)
    if (nums.some(a => new Set(a).size < A)) continue;
    const P = { n, nums };
    if (contaSolucoes(P) !== 1) continue;
    const so = resolve(P, false);
    if (precisaFalta) { if (so.ok) continue; const sf = resolve(P, true); if (!sf.ok) continue; P.r = sf.rodadas; }
    else { if (!so.ok || so.rodadas < rMin || so.rodadas > rMax) continue; P.r = so.rodadas; }
    // posição de partida: eixo parado, nenhum outro anel no lugar e poucos raios já certos
    let ini = null;
    for (let k = 0; k < 80 && !ini; k++) {
      const c = nums.map((_, a) => a === 0 ? 0 : 1 + Math.floor(rand() * (n - 1)));
      if (certos(P, c) <= Math.floor(n / 4)) ini = c;
    }
    if (!ini) continue;
    return { v: 2, l, n, nums: nums.map(a => a.join("")), ini, r: P.r };
  }
  throw new Error("não saiu desafio para o nível " + l);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const DIAS = +(process.argv[2] || 400), rand = rng(20261127 + 2);
  const nivelDe = k => (new Date(EPOCH[0], EPOCH[1], EPOCH[2] + k).getDay() + 6) % 7 + 1;
  // os da versão de contas (sem v: 2) não ficam: o #1 foi refeito
  const out = process.env.NOVO ? [] : mantidos(DIR, EPOCH).filter(p => p.v === 2);
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
  console.log(out.slice(0, 7).map((p, i) => `#${i + 1} nível ${p.l}: ${p.nums.length} anéis × ${p.n} raios · ${p.r} rodadas`).join("\n"));
  console.log("rodadas por nível:", Object.fromEntries(Object.entries(por).map(([l, v]) => [l, `${Math.min(...v)}–${Math.max(...v)}`])));
}
