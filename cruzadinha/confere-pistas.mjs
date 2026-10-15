// Conferência do banco de pistas do Ponto Cruz (pistas.txt e pistas6.txt).
// O gerador roda isto antes de montar os desafios e para se houver erro.
//   node cruzadinha/confere-pistas.mjs
//
// Regras (português do Brasil, sempre):
//   1. A lacuna "___" vale a palavra inteira, exatamente como é: nada de "___s", "___es", "___ado"
//      (o plural do português não é só pôr um "s": limão/limões, mãe/mães, vital/vitais).
//   2. A resposta não aparece na própria pista.
//   3. Nada de pista que depende de traduzir do inglês ("em inglês", títulos e ditados que só
//      existem em inglês). Expressão, ditado ou título citado tem de ser o que se usa no Brasil.
//   4. As três pistas de uma palavra são diferentes entre si.
//   5. Palavra de 3 a 6 letras.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const norm = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const so = t => norm(t).replace(/[^A-Z]/g, "");

// pedaços que denunciam pista traduzida ao pé da letra ou rascunho que escapou
const PROIBIDO = [
  /em ingl[eê]s/i, /in english/i, /(^|[\s"])(the|of|and)(\s|$)/i,
  /\? ?N[aã]o\b/, /Melhor:/, /\bx\|/, /—/,
];

export function confere() {
  const erros = [];
  for (const f of ["pistas.txt", "pistas6.txt"]) {
    readFileSync(join(DIR, f), "utf8").split("\n").forEach((l, i) => {
      if (!l.trim() || l.startsWith("#")) return;
      const onde = `${f}:${i + 1} ${l.split("|")[0]}`;
      const [w, ...ps] = l.split("|");
      const W = so(w), pistas = ps.map(p => p.trim()).filter(Boolean);
      if (W.length < 3 || W.length > 6) erros.push(`${onde}: palavra com ${W.length} letras`);
      if (!pistas.length) erros.push(`${onde}: sem pista`);
      if (new Set(pistas).size !== pistas.length) erros.push(`${onde}: pistas repetidas`);
      for (const p of pistas) {
        if (/___[A-Za-zÀ-ú]|[A-Za-zÀ-ú]___/.test(p)) erros.push(`${onde}: lacuna colada em letras: ${p}`);
        if (new RegExp(`(^|[^A-Z])${W}`).test(norm(p))) erros.push(`${onde}: a resposta aparece na pista: ${p}`);
        for (const re of PROIBIDO) if (re.test(p)) erros.push(`${onde}: ${re} em: ${p}`);
      }
    });
  }
  return erros;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const e = confere();
  console.log(e.length ? e.join("\n") : "banco de pistas ok");
  process.exit(e.length ? 1 : 0);
}
