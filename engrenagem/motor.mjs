// Engrenagem — regras e resolvedor "de gente" (o gerador e a dica da página usam este arquivo).
//
// Desde 27/11/2026 (v: 2): símbolos, como um sudoku em roda. Há A anéis concêntricos e A símbolos (cor + forma); cada anel
// tem n casas, uma por raio. O anel de dentro é FIXO (o eixo); os outros giram. Com o anel a na rotação r, o raio j recebe
// nums[a][(j + r) % n]. Resolvido = em todo raio, um símbolo de cada (nenhum repetido). Os desafios são guardados já na
// rotação da solução: a solução é r = 0 em todos os anéis.
//
// Dedução 1 ("conflito", a de todo dia): o anel a não pode ficar na rotação r se, nela, algum raio receberia um símbolo
// que outro anel já põe ali com certeza (em todas as rotações que ainda lhe restam). Começa pelo eixo, que está parado.
// Dedução 2 ("falta", reserva da dica; o gerador não pede): a mesma ideia, um lance à frente — na rotação r, algum raio ficaria sem como
// receber os símbolos que faltam (os outros anéis não conseguem pôr, juntos, um de cada dos que sobram).
// Nada de tentativa e erro: um desafio vale se as deduções, repetidas, deixam uma só rotação em cada anel.

export const valor = (P, a, r, j) => P.nums[a][(j + r) % P.n];
export const raioOk = (P, rot, j) => new Set(P.nums.map((_, a) => valor(P, a, rot[a], j))).size === P.nums.length;
export const certos = (P, rot) => { let k = 0; for (let j = 0; j < P.n; j++) if (raioOk(P, rot, j)) k++; return k; };
export const resolvido = (P, rot) => certos(P, rot) === P.n;

// os anéis em `outros` conseguem pôr, no raio j, um símbolo diferente cada um, todos dentro de `livres`? (emparelhamento)
function cobre(P, cand, outros, j, livres) {
  const opc = outros.map(b => [...new Set([...cand[b]].map(r => valor(P, b, r, j)))].filter(s => livres.has(s)));
  const dono = new Map();
  const tenta = (i, visto) => {
    for (const s of opc[i]) {
      if (visto.has(s)) continue; visto.add(s);
      if (!dono.has(s) || tenta(dono.get(s), visto)) { dono.set(s, i); return true; }
    }
    return false;
  };
  return opc.every((_, i) => tenta(i, new Set()));
}

// resolve a partir dos candidatos dados (um conjunto de rotações por anel). Devolve { cand, passos, rodadas, falta, ok }:
// passos = [{ a, r, j, b, tipo }] na ordem em que cada rotação caiu (j = o raio que a derrubou; b = o anel do conflito)
export function resolve(P, permitirFalta = false, cand0 = null) {
  const { n } = P, A = P.nums.length;
  const cand = cand0 ? cand0.map(c => new Set(c)) : P.nums.map((_, a) => new Set(a === 0 ? [0] : [...Array(n).keys()]));
  const passos = []; let rodadas = 0, falta = false;
  const conflito = () => {
    let mudou = false;
    for (let a = 1; a < A; a++) {
      if (cand[a].size === 1) continue;
      for (const r of [...cand[a]]) {
        achou: for (let j = 0; j < n; j++) {
          const s = valor(P, a, r, j);
          for (let b = 0; b < A; b++) {
            if (b === a) continue;
            if ([...cand[b]].every(rb => valor(P, b, rb, j) === s)) { cand[a].delete(r); passos.push({ a, r, j, b, tipo: "conflito" }); mudou = true; break achou; }
          }
        }
      }
    }
    return mudou;
  };
  const faltaPasso = () => {
    const todos = [...Array(A).keys()];
    for (let a = 1; a < A; a++) {
      if (cand[a].size === 1) continue;
      for (const r of [...cand[a]]) for (let j = 0; j < n; j++) {
        const s = valor(P, a, r, j), livres = new Set(todos.filter(x => x !== s));
        if (!cobre(P, cand, todos.filter(b => b !== a), j, livres)) { cand[a].delete(r); passos.push({ a, r, j, tipo: "falta" }); return true; }
      }
    }
    return false;
  };
  for (let k = 0; k < 300; k++) {
    if (cand.every(c => c.size === 1)) break;
    rodadas++;
    if (conflito()) continue;
    if (permitirFalta && faltaPasso()) { falta = true; continue; }
    break;
  }
  return { cand, passos, rodadas, falta, ok: cand.every(c => c.size === 1) && cand.every(c => c.has(0)) };
}

// O jeito de gente (desde 27/11/2026, o que o gerador exige): "cadeia". Começa só com o eixo travado; a cada passo, algum
// anel solto tem UMA posição só em que não repete símbolo, em nenhum raio, com os anéis já travados — trava esse e segue.
// Devolve a ordem [{ a, sobra: quantas posições ele tinha antes de travar }] ou null se em algum momento nenhum anel é único.
export function cadeia(P) {
  const A = P.nums.length, n = P.n, travado = [0], rot = Array(A).fill(null), ordem = [];
  rot[0] = 0;
  while (travado.length < A) {
    let achou = null;
    for (let a = 1; a < A && !achou; a++) {
      if (rot[a] !== null) continue;
      const cabem = [];
      for (let r = 0; r < n; r++) {
        let bom = true;
        for (let j = 0; j < n && bom; j++) { const s = valor(P, a, r, j); for (const b of travado) if (valor(P, b, rot[b], j) === s) { bom = false; break; } }
        if (bom) cabem.push(r);
      }
      if (cabem.length === 1) achou = { a, r: cabem[0] };
    }
    if (!achou) return null;
    rot[achou.a] = achou.r; travado.push(achou.a); ordem.push(achou);
  }
  return ordem.every(o => o.r === 0) ? ordem : null;
}

// quantas posições fecham todos os raios (com o eixo parado) — força bruta, só no gerador
export function contaSolucoes(P, limite = 2) {
  const A = P.nums.length, rot = Array(A).fill(0); let sol = 0;
  const vai = a => {
    if (sol >= limite) return;
    if (a === A) { if (resolvido(P, rot)) sol++; return; }
    for (let r = 0; r < P.n; r++) {
      rot[a] = r;
      // poda: os anéis já postos não podem repetir símbolo em nenhum raio
      let bom = true;
      for (let j = 0; j < P.n && bom; j++) { const s = valor(P, a, r, j); for (let b = 0; b < a; b++) if (valor(P, b, rot[b], j) === s) { bom = false; break; } }
      if (bom) vai(a + 1);
    }
  };
  rot[0] = 0; vai(1);
  return sol;
}
