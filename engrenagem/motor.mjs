// Engrenagem — regras e resolvedor "de gente" (o gerador e a dica da página usam este arquivo).
//
// Anéis concêntricos, cada um com n números (um por fatia). Os raios ficam parados; girar um anel muda o número de
// todos os raios ao mesmo tempo. Com o anel a na rotação r, o raio j recebe nums[a][(j + r) % n]. Os desafios são
// guardados já na rotação da solução: a solução é r = 0 em todos os anéis.
//
// Dedução 1 ("limite", a de todo dia): o anel a não pode ficar na rotação r se, nela, algum raio j ficaria impossível —
// o número que o anel põe ali mais o mínimo (ou o máximo) que os outros anéis ainda conseguem pôr no raio passa (ou não
// chega) do alvo. Ex.: "o raio de 25 precisa de 9 neste anel, porque os outros dois somam no máximo 16 ali".
// Dedução 2 ("conta exata", só no fim de semana): a mesma ideia, mas conferindo as combinações exatas dos outros anéis.
// Nada de tentativa e erro: um desafio vale se uma das deduções, repetida, deixa uma só rotação em cada anel.

export const valor = (P, a, r, j) => P.nums[a][(j + r) % P.n];
export const somaRaio = (P, rot, j) => P.nums.reduce((s, _, a) => s + valor(P, a, rot[a], j), 0);
export const resolvido = (P, rot) => P.alvo.every((t, j) => somaRaio(P, rot, j) === t);

// resolve a partir dos candidatos dados (um conjunto de rotações por anel). Devolve { cand, passos, rodadas, exata }:
// passos = [{ a, r, j, tipo }] na ordem em que cada rotação caiu (j = o raio que a derrubou)
export function resolve(P, permitirExata = false, cand0 = null) {
  const { n } = P, A = P.nums.length;
  const cand = cand0 ? cand0.map(c => new Set(c)) : P.nums.map(() => new Set([...Array(n).keys()]));
  const passos = []; let rodadas = 0, exata = false;
  const ext = (b, j) => { let mn = 99, mx = -1; for (const r of cand[b]) { const v = valor(P, b, r, j); if (v < mn) mn = v; if (v > mx) mx = v; } return [mn, mx]; };
  const limite = () => {
    let mudou = false;
    for (let j = 0; j < n; j++) {
      const e = P.nums.map((_, b) => ext(b, j));
      for (let a = 0; a < A; a++) {
        if (cand[a].size === 1) continue;
        let mn = 0, mx = 0; for (let b = 0; b < A; b++) if (b !== a) { mn += e[b][0]; mx += e[b][1]; }
        for (const r of [...cand[a]]) {
          const v = valor(P, a, r, j);
          if (v + mn > P.alvo[j] || v + mx < P.alvo[j]) { cand[a].delete(r); passos.push({ a, r, j, tipo: "limite" }); mudou = true; }
        }
      }
    }
    return mudou;
  };
  const exataPasso = () => {
    for (let j = 0; j < n; j++) for (let a = 0; a < A; a++) {
      if (cand[a].size === 1) continue;
      for (const r of [...cand[a]]) {
        const resto = P.alvo[j] - valor(P, a, r, j);
        // as somas possíveis dos outros anéis neste raio
        let somas = new Set([0]);
        for (let b = 0; b < A; b++) if (b !== a) { const nv = new Set(); for (const s of somas) for (const rb of cand[b]) nv.add(s + valor(P, b, rb, j)); somas = nv; }
        if (!somas.has(resto)) { cand[a].delete(r); passos.push({ a, r, j, tipo: "exata" }); return true; }
      }
    }
    return false;
  };
  for (let k = 0; k < 200; k++) {
    if (cand.every(c => c.size === 1)) break;
    rodadas++;
    if (limite()) continue;
    if (permitirExata && exataPasso()) { exata = true; continue; }
    break;
  }
  return { cand, passos, rodadas, exata, ok: cand.every(c => c.size === 1) && cand.every(c => c.has(0)) };
}

// quantas rotações fecham todos os raios (para garantir solução única) — força bruta, só no gerador
export function contaSolucoes(P, limite = 2) {
  const A = P.nums.length, rot = Array(A).fill(0); let sol = 0;
  const vai = a => {
    if (sol >= limite) return;
    if (a === A) { if (resolvido(P, rot)) sol++; return; }
    for (let r = 0; r < P.n; r++) { rot[a] = r; vai(a + 1); }
  };
  vai(0);
  return sol;
}
