// Service worker do Jogos do Dia.
// Deixa o painel e os jogos da casa instaláveis e funcionando offline (sempre tenta a versão mais nova primeiro).
const CACHE = "jogos-do-dia-v162";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
// Tudo o que os jogos da casa precisam para funcionar sem internet: páginas, scripts comuns,
// ícones e os desafios (do dia e do jogo livre). Guardado já na instalação, sem esperar o
// jogo ser aberto; se algum arquivo falhar, os outros continuam.
const COMUM = ["cabecalho.css", "cabecalho.js", "catalogo.js", "celebra.js", "dica.js", "proximo.js", "recorde.js", "tema.js"].map(f => "./comum/" + f);
const LOGICA = ["eclipse", "novelo", "azulejo", "cortado"];
const JOGOS = [
  ...LOGICA.flatMap(j => [`./${j}/`, `./${j}/index.html`, `./${j}/desafios.json`, `./${j}/livre.json`]),
  "./novelo/motor.mjs", "./azulejo/motor.mjs", "./cortado/motor.mjs",
  "./5pila/", "./5pila/index.html", "./sando/", "./sando/index.html",
  "./eclipse/icon-claro.png", "./eclipse/icon-escuro.png", "./5pila/icon-claro.png", "./5pila/icon-escuro.png",
  "./sando/icon-claro.png", "./sando/icon-escuro.png", "./novelo/icon.png", "./novelo/icon-escuro.png",
  "./azulejo/icon.png", "./azulejo/icon-escuro.png", "./cortado/icon.png", "./cortado/icon-escuro.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(FILES);
    await Promise.all([...COMUM, ...JOGOS].map(u => c.add(new Request(u, { cache: "no-cache" })).catch(() => {})));
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    // "no-cache": sempre confere com o servidor se há versão nova (ignora o cache de 10 min do GitHub Pages)
    fetch(e.request, { cache: "no-cache" })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
