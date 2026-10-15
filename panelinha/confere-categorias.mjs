// Conferência das categorias da Panelinha (comum/acervo.mjs + comum/banco.mjs).
//   node panelinha/confere-categorias.mjs          → erros (e a lista de palavras em vários grupos com -v)
// Regras: português do Brasil (nada de grupo que só faz sentido traduzido do inglês); nome único;
// pelo menos 4 palavras que cabem numa peça (até 2 palavras e 12 letras; o ideal é 6 ou mais, com -v avisa);
// palavra repetida dentro do mesmo grupo não vale.
import { fileURLToPath } from "node:url";
import { ACERVO } from "../comum/acervo.mjs";
import { BANCO } from "../comum/banco.mjs";

const chave = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toLowerCase();
const cabe = t => t.split(/\s+/).length <= 2 && t.replace(/[\s-]/g, "").length <= 12 && t.length <= 13;
const PROIBIDO = [/em ingl[eê]s/i, /in english/i];

export function confere(verbose = false) {
  const cats = [...ACERVO.map(x => ({ n: x.n, w: x.w })), ...BANCO.map(([n, , , w]) => ({ n, w }))];
  const erros = [], nomes = new Set(), memb = new Map();
  for (const c of cats) {
    if (nomes.has(c.n)) erros.push(`nome repetido: ${c.n}`);
    nomes.add(c.n);
    for (const re of PROIBIDO) if (re.test(c.n)) erros.push(`${c.n}: nome com ${re}`);
    const ks = c.w.map(chave);
    const rep = ks.filter((k, i) => ks.indexOf(k) !== i);
    if (rep.length) erros.push(`${c.n}: palavra repetida (${rep.join(", ")})`);
    const ok = c.w.filter(cabe);
    if (ok.length < 4) erros.push(`${c.n}: só ${ok.length} palavras cabem numa peça`);
    else if (ok.length < 6 && verbose) console.log(`aviso — ${c.n}: só ${ok.length} palavras cabem numa peça`);
    for (const k of new Set(ks)) { if (!memb.has(k)) memb.set(k, []); memb.get(k).push(c.n); }
  }
  if (verbose) for (const [k, ns] of [...memb].filter(([, ns]) => ns.length > 2).sort((a, b) => b[1].length - a[1].length)) console.log(`${k}: ${ns.join(" · ")}`);
  return erros;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const e = confere(process.argv.includes("-v"));
  console.log(e.length ? e.join("\n") : "categorias ok");
  process.exit(e.length ? 1 : 0);
}
