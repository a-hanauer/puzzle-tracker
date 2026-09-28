/* =========================================================================
   Catálogo comum do Jogos do Dia — usado pelo painel e pelos jogos da casa.
   Carregado como script comum (não módulo): as constantes abaixo ficam
   visíveis para os outros scripts da página.
   ========================================================================= */

// raiz do site (a pasta do painel), para resolver os endereços relativos
const CATALOGO_RAIZ = new URL("../", document.currentScript.src).href;

/* ============================================================
   LISTA DE JOGOS — para adicionar um jogo, copie uma linha.
   url:   endereço completo, ou o nome da pasta para jogos dentro deste repositório (ex.: "sanduba/")
   id:    identificador único (não mude depois, é usado no progresso)
   emoji: usado enquanto o ícone carrega ou se o site não tiver ícone
   icon:  (opcional) URL de um ícone específico, ignora a busca automática
   app:   (opcional) true = link que abre o app do celular
   iconFull: (opcional) true = o ícone ocupa o quadrado inteiro (para ícones com fundo próprio)
   ============================================================ */
const BASE_GAMES = [
  { id: "termo",      name: "Termo",      emoji: "🟩", desc: "Wordle em português",           url: "https://term.ooo/" },
  { id: "spotle",     name: "Spotle",     emoji: "🎵", desc: "Adivinhe o artista",            url: "https://spotle.io/" },
  { id: "betweenle",  name: "Betweenle",  emoji: "↕️", desc: "A palavra está entre…",         url: "https://betweenle.com/" },
  { id: "sanduba",    name: "Sanduba",    emoji: "🥪", desc: "Betweenle em português",        url: "sanduba/", icon: "sanduba/icon.png?v=2" },
  { id: "word500",    name: "Word500",    emoji: "🔢", desc: "Dedução por contagem",          url: "https://word500.com/" },
  { id: "quinhentos", name: "Quinhentos", emoji: "5️⃣", desc: "Word500 em português",          url: "quinhentos/", icon: "quinhentos/icon-claro.png?v=2", iconDark: "quinhentos/icon-escuro.png?v=1", iconFull: true },
  { id: "foximax",    name: "Foximax",    emoji: "🦊", desc: "foximax.com",                   url: "https://foximax.com/" },
  { id: "linkedin",   name: "LinkedIn",   emoji: "💼", desc: "Queens, Tango, Zip, Pinpoint…", url: "https://www.linkedin.com/games/", app: true },
  { id: "eclipse",    name: "Eclipse",    emoji: "🌗", desc: "Um sol e uma lua em cada linha", url: "eclipse/", icon: "eclipse/icon-claro.png?v=2", iconDark: "eclipse/icon-escuro.png?v=2", iconFull: true },
  { id: "novelo",     name: "Novelo",     emoji: "🧶", desc: "Um fio por todas as casas",     url: "novelo/", icon: "novelo/icon.png?v=2", iconDark: "novelo/icon-escuro.png?v=1", iconFull: true },
  { id: "retalhos",   name: "Retalhos",   emoji: "🧵", desc: "Uma colcha de retângulos",      url: "retalhos/", icon: "retalhos/icon.png?v=3", iconDark: "retalhos/icon-escuro.png?v=1", iconFull: true },
  { id: "pingado",    name: "Pingado",    emoji: "☕", desc: "Café e leite em equilíbrio",    url: "pingado/", icon: "pingado/icon.png?v=2", iconDark: "pingado/icon-escuro.png?v=2", iconFull: true },
];

/* ============================================================ */

/* ---------- Progresso dos jogos deste repositório ----------
   Sanduba e Quinhentos rodam no mesmo endereço do painel, então o painel
   consegue ler a partida do dia que eles salvam no navegador.
   Cada função devolve null (não começou) ou { tries, max, finished, won }. */
function readJSON(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }

const LOCAL_PROGRESS = {
  sanduba() {
    const d = new Date();                    // o Sanduba usa a data sem zeros: 2026-9-27
    const p = readJSON(`sanduba-daily-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
    if (!p || !Array.isArray(p.guesses) || !p.guesses.length) return null;
    const max = 14, tries = p.guesses.length;
    const won = p.guesses.some(g => g.word === p.secret);
    return { tries, max, won, finished: won || tries >= max };
  },
  quinhentos() {
    const p = readJSON("quinhentao:game:padrao");
    // mesmo cálculo do jogo: dias desde 1º/jan/2024, contando a partir de 1
    const today0 = new Date(); today0.setHours(0, 0, 0, 0);
    const dayNum = Math.floor((today0 - new Date(2024, 0, 1)) / 86400000) + 1;
    if (!p || p.dayNum !== dayNum || !Array.isArray(p.guesses) || !p.guesses.length) return null;
    return { tries: p.guesses.length, max: 8, won: !!p.won, finished: !!p.finished };
  },
  eclipse() {
    // desafio #1 = 27/09/2026 (mesma conta do jogo)
    const today0 = new Date(); today0.setHours(0, 0, 0, 0);
    const dayNum = Math.round((today0 - new Date(2026, 8, 27)) / 86400000) + 1;
    const p = readJSON(`eclipse:dia:${dayNum}`);
    if (!p || typeof p.cells !== "string") return null;
    const placed = (p.cells.match(/[SM]/g) || []).length;
    if (!p.done && !p.started) return null;             // aberto, mas nenhuma jogada ainda
    const max = 2 * Math.round(Math.sqrt(p.cells.length));   // o tabuleiro vai de 8×8 a 10×10
    return { tries: placed, max, won: !!p.done, finished: !!p.done, time: p.done ? p.time : null };
  },
  // Novelo, Retalhos e Pingado: desafio #1 = 28/09/2026; prog = [feito, total]
  novelo() { return progressoPorTempo("novelo"); },
  retalhos() { return progressoPorTempo("retalhos"); },
  pingado() { return progressoPorTempo("pingado"); },
};
function progressoPorTempo(jogo) {
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const dayNum = Math.round((today0 - new Date(2026, 8, 28)) / 86400000) + 1;
  const p = readJSON(`${jogo}:dia:${dayNum}`);
  if (!p || (!p.done && !p.started)) return null;
  const [tries, max] = Array.isArray(p.prog) ? p.prog : [0, 0];
  return { tries, max, won: !!p.done, finished: !!p.done, time: p.done ? p.time : null };
}

const fmtTime = s => { s = Math.round(s || 0); const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`; };

function progressOf(g) {
  const fn = LOCAL_PROGRESS[g.id];
  if (!fn) return null;
  try { return fn(); } catch { return null; }
}

/* ---------- Ícones ----------
   Tenta, em ordem: ícone definido → favicon do próprio caminho do site
   → serviço de favicons do Google. Se nada servir, fica o emoji. */
function iconCandidates(g) {
  if (g.icon) {                                  // versão escura: veja marcaIconeEscuro
    const escuro = g.iconDark && window.jogosTema && jogosTema.escuro();
    return [new URL(escuro ? g.iconDark : g.icon, CATALOGO_RAIZ).href];
  }
  const u = new URL(g.url, CATALOGO_RAIZ);   // aceita endereços relativos (jogos dentro deste repositório)
  const base = u.origin + u.pathname.replace(/[^/]*$/, "");
  const list = [];
  // sites em github.io compartilham domínio: procura o ícone dentro da pasta do jogo
  if (u.origin === location.origin || u.hostname.endsWith("github.io")) {
    list.push(base + "favicon.svg", base + "favicon.png", base + "favicon.ico", base + "apple-touch-icon.png");
  } else {
    list.push(`https://www.google.com/s2/favicons?domain=${u.hostname}&sz=128`);
    list.push(u.origin + "/apple-touch-icon.png", u.origin + "/favicon.ico");
  }
  return list;
}

/* Ícone com versão para o tema escuro (iconDark): a imagem guarda as duas e o
   comum/tema.js troca conforme o tema, inclusive quando ele muda. */
function marcaIconeEscuro(g, img) {
  if (!g.iconDark) return;
  img.setAttribute("data-claro", new URL(g.icon, CATALOGO_RAIZ).href);
  img.setAttribute("data-escuro", new URL(g.iconDark, CATALOGO_RAIZ).href);
  const want = window.jogosTema && jogosTema.escuro() ? img.getAttribute("data-escuro") : img.getAttribute("data-claro");
  if (img.src !== want) img.src = want;          // só troca se precisar (trocar dispara outro onload)
}
