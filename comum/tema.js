// Tema geral (Automático / Claro / Escuro), escolhido no painel e aplicado em todas as páginas.
// Carregado no <head>, antes de desenhar a página, para não piscar a cor errada.
// "auto" segue o celular; "light"/"dark" forçam o tema com data-theme no <html>.
(function () {
  var KEY = "jogosDoDia.tema";
  function get() { try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; } }
  // Ícones com versão escura: <img data-escuro="…"> troca de arquivo conforme o tema.
  function escuro() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function trocaIcones() {
    var imgs = document.querySelectorAll("img[data-escuro]"), e = escuro();
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (!im.getAttribute("data-claro")) im.setAttribute("data-claro", im.getAttribute("src"));
      var want = e ? im.getAttribute("data-escuro") : im.getAttribute("data-claro");
      if (im.getAttribute("src") !== want) im.setAttribute("src", want);
    }
  }
  function apply(t) {
    var root = document.documentElement;
    if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    else root.removeAttribute("data-theme");
    // cor da barra do sistema: usa a <meta theme-color> do tema escolhido
    var metas = document.querySelectorAll('meta[name="theme-color"][media]');
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i], want = m.getAttribute("data-media") || m.getAttribute("media");
      m.setAttribute("data-media", want);
      if (t === "auto") m.setAttribute("media", want);
      else m.setAttribute("media", want.indexOf(t) >= 0 ? "all" : "not all");
    }
    trocaIcones();
  }
  // Sem zoom em nenhuma página: nem dois toques rápidos nem pinça.
  // (touch-action: manipulation em tudo desliga o zoom por dois toques sem
  // atrasar os toques; o gesto de pinça do Safari é cancelado aqui.)
  try {
    var st = document.createElement("style");
    st.textContent = "html,body,*{touch-action:manipulation}";
    document.head.appendChild(st);
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
    });
  } catch (e) {}
  // Vibração leve ao tocar nas teclas dos jogos (.key, .kb-key).
  // Android: navigator.vibrate. iPhone (iOS 18+): o Safari não tem API de
  // vibração, mas alternar um <input type="checkbox" switch> dá um toque
  // háptico. O iOS só aceita isso dentro de um gesto do usuário, que no toque
  // conta quando o dedo sai da tela (touchend/pointerup), não quando encosta.
  // ---------- vibração ----------
  // Android: navigator.vibrate, chamado pelos jogos a cada toque e a cada casa do arrasto.
  // iPhone: o Safari não tem API de vibração. O único jeito é o próprio dedo tocar num
  // interruptor (<input type="checkbox" switch>): desde o iOS 26.5, um clique feito pelo
  // código não vibra mais. Por isso, cada tecla, casa e tabuleiro ganha por cima um
  // <label> transparente com um interruptor escondido: o toque de verdade cai no label,
  // o iPhone vibra, e o clique segue normalmente para a tecla/casa (o label está dentro dela).
  // Limite do iPhone: só vibra em toques; no meio de um arrasto não há clique, então não vibra.
  try {
    var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var ultimoHap = 0;
    var haptico = function (forte) {
      var agora = Date.now();
      if (agora - ultimoHap < 35 && !forte) return;
      ultimoHap = agora;
      if (navigator.vibrate) { try { navigator.vibrate(forte ? [14, 40, 14] : 8); } catch (e) {} }
    };
    window.jogosHaptico = haptico;
    // Android: teclas e fim de cada toque nos tabuleiros
    var naTecla = function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      var k = t.closest(".key, .kb-key");
      if ((k && !k.disabled) || t.closest("[data-tabuleiro], #board")) haptico();
    };
    document.addEventListener("touchend", naTecla, true);
    if (IOS) {
      // teclas, casas, tabuleiros e qualquer botão ou link da interface (inclusive os cartões do painel)
      var ALVOS = ".key, .kb-key, .tile.paintable, .cell, [data-haptico], button, a[href], [role=button], [role=switch]";
      var FORA = "label, label *, svg *, [data-haptic-trigger], [data-haptic-trigger] *";
      var gatilho = function (el) {
        if (el.matches(FORA) || el.querySelector(":scope > [data-haptic-trigger]")) return;
        var lb = document.createElement("label");
        lb.setAttribute("data-haptic-trigger", ""); lb.setAttribute("aria-hidden", "true");
        lb.style.cssText = "position:absolute;inset:0;z-index:2;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:inherit";
        var sw = document.createElement("input");
        sw.type = "checkbox"; sw.setAttribute("switch", ""); sw.tabIndex = -1;
        sw.style.cssText = "position:absolute;width:1px;height:1px;margin:0;visibility:hidden";
        sw.addEventListener("click", function (e) { e.stopPropagation(); });   // o label repassa o clique ao interruptor: essa cópia não conta para a tecla
        lb.appendChild(sw);
        // link: o toque no label vibra mas não abriria o link (o label "ganha" o clique);
        // então o clique do label para aqui e o link é aberto logo em seguida
        if (el.tagName === "A") lb.addEventListener("click", function (e) { e.stopPropagation(); setTimeout(function () { el.click(); }, 0); });
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.appendChild(lb);
      };
      var pendente = false;
      var varre = function () { pendente = false; document.querySelectorAll(ALVOS).forEach(gatilho); };
      var agenda = function () { if (!pendente) { pendente = true; requestAnimationFrame(varre); } };
      document.addEventListener("DOMContentLoaded", function () {
        varre();
        new MutationObserver(agenda).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
      });
    }
  } catch (e) {}
  if (window.matchMedia) { try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", trocaIcones); } catch (e) {} }
  document.addEventListener("DOMContentLoaded", trocaIcones);
  window.jogosTema = {
    escuro: escuro,
    trocaIcones: trocaIcones,
    get: get,
    set: function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); },
  };
  apply(get());
  // App instalado na tela inicial do iPhone: o iPhone recorta tudo o que é
  // "fixo na tela" antes da borda de baixo (sobra a altura da barra de
  // status), então as bandejas ficavam com um vão. Nesse modo, ao abrir uma
  // bandeja (.overlay aberta ou .sheet-bg visível), ela deixa de ser fixa e
  // vira parte da página, posicionada onde a tela está e com a altura da
  // tela inteira; a rolagem da página trava enquanto ela está aberta.
  try {
    if (navigator.standalone === true) {          // só o iPhone/iPad tem essa propriedade
      var root = document.documentElement;
      root.classList.add("standalone");
      // sobra = altura da tela − altura da janela (a faixa que o iPhone deixa de fora)
      var medirSobra = function () {
        var portrait = matchMedia("(orientation: portrait)").matches;
        var t = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
        // a menor das medidas da janela: no app instalado, a altura da página
        // (clientHeight) pode ser menor que innerHeight
        var janela = Math.min(window.innerHeight, root.clientHeight || window.innerHeight,
          (window.visualViewport && window.visualViewport.height) || window.innerHeight);
        var sobra = Math.round(t - janela);
        root.style.setProperty("--sobra", (sobra > 0 && sobra <= 80 ? sobra : 0) + "px");
      };
      medirSobra();
      window.addEventListener("resize", medirSobra);
      window.addEventListener("orientationchange", function () { setTimeout(medirSobra, 300); });
      var alturaTela = function () {
        var portrait = matchMedia("(orientation: portrait)").matches;
        var t = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
        return Math.max(t, window.innerHeight);
      };
      var aberta = function (el) {
        return el.classList.contains("overlay") ? el.classList.contains("open") : !el.hidden;
      };
      var ajustar = function () {
        var algum = false;
        document.querySelectorAll(".overlay, .sheet-bg").forEach(function (el) {
          if (aberta(el)) {
            algum = true;
            if (!el.dataset.solta) {
              el.dataset.solta = "1";
              el.style.setProperty("position", "absolute", "important");
              el.style.setProperty("top", window.scrollY + "px", "important");
              el.style.setProperty("bottom", "auto", "important");
              el.style.setProperty("left", "0", "important");
              el.style.setProperty("right", "0", "important");
            }
            el.style.setProperty("height", alturaTela() + "px", "important");
          } else if (el.dataset.solta) {
            delete el.dataset.solta;
            ["position", "top", "bottom", "left", "right", "height"].forEach(function (k) { el.style.removeProperty(k); });
          }
        });
        root.classList.toggle("bandeja-aberta", algum);
      };
      new MutationObserver(ajustar).observe(root, { subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
      window.addEventListener("orientationchange", function () { setTimeout(ajustar, 300); });
    }
  } catch (e) {}
  // Telas dos jogos (<html data-fixa>): a página não rola nem "estica" com o dedo — o arrasto
  // é do jogo (Novelo, Azulejo...). Continua rolando o que precisa rolar (texto das
  // bandejas, fileiras que rolam para o lado) e, se num celular pequeno a página não couber na tela, ela rola normalmente.
  try {
    if (document.documentElement.hasAttribute("data-fixa")) {
      var st2 = document.createElement("style");
      st2.textContent = "html[data-fixa],html[data-fixa] body{overscroll-behavior:none}";
      document.head.appendChild(st2);
      var rolavel = function (el) {
        for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
          var cs = getComputedStyle(el), oy = cs.overflowY, ox = cs.overflowX;
          if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
          if ((ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth + 1) return true;   // fileiras que rolam para o lado (doca de jogos)
        }
        return false;
      };
      var cabe = function () {
        var se = document.scrollingElement || document.documentElement;
        var sobra = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sobra")) || 0;
        return se.scrollHeight <= window.innerHeight + sobra + 2;
      };
      document.addEventListener("touchmove", function (e) {
        if (e.touches && e.touches.length > 1) return;
        if (!cabe() || rolavel(e.target)) return;
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
    }
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () { apply(get()); });   // metas que vêm depois do script
  // se o tema mudar em outra aba (ou ao voltar do painel), acompanha
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(get()); });
  window.addEventListener("pageshow", function () { apply(get()); });
})();

// ---------- seletores (segmented control) no padrão do iOS 26 (opção "A", 10/11/2026) ----------
// Trilho em cápsula cinza e uma "pílula" clara que desliza até a opção escolhida. Vale para os seletores do
// painel (.segx, .seg2), a chave Resumo | Grade do Gerânio (.modo), o tema do 5PILA (#theme-seg) e quem tiver [data-seg].
// A opção escolhida é a que tiver aria-checked/aria-pressed="true" ou a classe .active/.on.
(function () {
  var SEL = ".segx,.seg2,.modo,#theme-seg,[data-seg]";
  var ATIVO = ['[aria-checked="true"]', '[aria-pressed="true"]', ".active", ".on"];
  var css = ":root{--sg-track:rgba(118,118,128,.12);--sg-thumb:#fff;--sg-sh:0 3px 8px rgba(0,0,0,.12),0 1px 1px rgba(0,0,0,.04)}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--sg-track:rgba(118,118,128,.24);--sg-thumb:#636366;--sg-sh:0 3px 8px rgba(0,0,0,.28)}}" +
    ":root[data-theme=dark]{--sg-track:rgba(118,118,128,.24);--sg-thumb:#636366;--sg-sh:0 3px 8px rgba(0,0,0,.28)}" +
    ".sg.sg{position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:0;padding:3px;border:0;border-radius:999px;background:var(--sg-track);isolation:isolate}" +
    ".sg.sg>button{position:relative;z-index:1;min-width:0;min-height:32px;padding-top:6px;padding-bottom:6px;border:0;border-radius:999px;background:transparent!important;box-shadow:none!important;color:inherit;font-weight:600;transition:opacity .15s}" +
    ".sg.sg>button:active{opacity:.6}" +
    ".sg.sg>.sg-pill{position:absolute;z-index:0;top:3px;bottom:3px;left:0;width:0;border-radius:999px;background:var(--sg-thumb);box-shadow:var(--sg-sh);pointer-events:none;" +
    "transition:transform .34s cubic-bezier(.3,1.15,.5,1),width .34s cubic-bezier(.3,1.15,.5,1),opacity .2s}" +
    "@media (prefers-reduced-motion:reduce){.sg.sg>.sg-pill{transition:none}}";
  var ult = {}, pend = 0;
  function ativo(c) {
    for (var i = 0; i < c.children.length; i++) {
      var b = c.children[i];
      if (b.tagName !== "BUTTON") continue;
      for (var j = 0; j < ATIVO.length; j++) if (b.matches(ATIVO[j])) return b;
    }
    return null;
  }
  function arruma(c) {
    if (!c.classList.contains("sg")) c.classList.add("sg");
    var p = c.querySelector(":scope > .sg-pill"), novo = !p;
    if (novo) { p = document.createElement("i"); p.className = "sg-pill"; p.setAttribute("aria-hidden", "true"); c.insertBefore(p, c.firstChild); }
    var b = ativo(c);
    if (!b || !b.offsetWidth) { p.style.opacity = "0"; return; }
    var k = c.id || c.getAttribute("aria-label") || c.className, x = b.offsetLeft, w = b.offsetWidth;
    if (novo && ult[k]) {   // o seletor foi desenhado de novo: a pílula sai de onde estava e desliza
      p.style.transition = "none"; p.style.width = ult[k].w + "px"; p.style.transform = "translateX(" + ult[k].x + "px)";
      void p.offsetWidth; p.style.transition = "";
    }
    if (novo && !ult[k]) { p.style.transition = "none"; }
    p.style.opacity = "1"; p.style.width = w + "px"; p.style.transform = "translateX(" + x + "px)";
    if (novo && !ult[k]) { void p.offsetWidth; p.style.transition = ""; }
    ult[k] = { x: x, w: w };
  }
  function tudo() { pend = 0; var l = document.querySelectorAll(SEL); for (var i = 0; i < l.length; i++) arruma(l[i]); }
  function agenda() { if (!pend) pend = requestAnimationFrame(tudo); }
  function liga() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    tudo();
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(t.classList && t.classList.contains("sg-pill"))) { agenda(); return; } }
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-checked", "aria-pressed", "class", "hidden"] });
    window.addEventListener("resize", agenda);
    window.addEventListener("pageshow", agenda);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", liga); else liga();
})();

/* Quem já terminou o jogo algumas vezes não precisa da instrução fixa embaixo do tabuleiro (o "?" do topo continua lá).
   jogoVeterano("novelo:") = true com 5 ou mais dias terminados guardados neste aparelho. */
window.jogoVeterano = function (prefixo) {
  try {
    var n = 0;
    for (var i = 0; i < localStorage.length && n < 5; i++) {
      var k = localStorage.key(i);
      if (k.indexOf(prefixo + "dia:") === 0 && /"done":true/.test(localStorage.getItem(k) || "")) n++;
    }
    return n >= 5;
  } catch (e) { return false; }
};

/* Modo minimalista (27/11/2026, chave em Ajustes → Aparência; referência: a interface do Nothing Phone).
   jogosDoDia.minimal = "1" → <html data-minimal>: tela de pontos, só traço, preto e branco e um vermelho para "certo / feito / agora";
   títulos e números em Doto (matriz de pontos), o resto em Space Mono. comum/minimal.css cuida do que é comum; cada jogo troca o
   próprio desenho quando vê html[data-minimal] (window.jogosMinimal.on). Os ícones dos jogos viram glifos de traço (GLIFOS, abaixo),
   usados também no painel, na doca e na celebração. <html data-jogo="pasta"> diz em que jogo está (ou "painel"). */
(function () {
  var KEY = "jogosDoDia.minimal", root = document.documentElement;
  var JOGOS = ["sando", "5pila", "eclipse", "novelo", "azulejo", "cordel", "geranio", "brigadeiro", "cruzadinha", "cortado", "cofre"];
  var on = function () { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
  var cs = document.currentScript, base = cs && cs.src ? cs.src.replace(/tema\.js.*$/, "") : "comum/";
  var m = location.pathname.match(/\/([^\/]+)\/(?:index\.html)?$/), pasta = m && JOGOS.indexOf(m[1]) >= 0 ? m[1] : "painel";
  root.setAttribute("data-jogo", pasta);
  // glifos de traço (viewBox 0 0 34 34), por pasta
  var G = {
    sando: '<rect x="5" y="8" width="24" height="5" rx="2.5"/><path d="M5 17h24"/><rect x="5" y="21" width="24" height="5" rx="2.5"/>',
    "5pila": '<rect x="5" y="9" width="24" height="16" rx="3"/><path d="M13 13h7M13 13v4h5a2.5 2.5 0 0 1 0 5h-5"/>',
    eclipse: '<circle cx="17" cy="17" r="10"/><path d="M17 7a10 10 0 0 1 0 20z" fill="currentColor"/>',
    novelo: '<circle cx="17" cy="17" r="11"/><path d="M8.5 12.5c5.5 2 11.5 2 17 0M7 18c6.5 2 13.5 2 20 0M9.5 23.5c5 1.5 10 1.5 15 0"/>',
    azulejo: '<rect x="6" y="6" width="10" height="10" rx="1.5"/><rect x="18" y="6" width="10" height="10" rx="1.5" fill="currentColor"/><rect x="6" y="18" width="10" height="10" rx="1.5" fill="currentColor"/><rect x="18" y="18" width="10" height="10" rx="1.5"/>',
    cordel: '<path d="M10 9l14 16M10 25l5-5.5"/><path d="M23 6v6M20 9h6" />',
    geranio: '<circle cx="17" cy="17" r="4" fill="currentColor"/><circle cx="17" cy="8" r="4"/><circle cx="24.8" cy="12.5" r="4"/><circle cx="24.8" cy="21.5" r="4"/><circle cx="17" cy="26" r="4"/><circle cx="9.2" cy="21.5" r="4"/><circle cx="9.2" cy="12.5" r="4"/>',
    brigadeiro: '<path d="M9 19l2.5 8h11l2.5-8z"/><circle cx="17" cy="13.5" r="6.5"/>',
    cruzadinha: '<rect x="6" y="6" width="22" height="22" rx="4"/><circle cx="11.5" cy="11.5" r="1.7" fill="currentColor"/><circle cx="17" cy="17" r="1.7" fill="currentColor"/><circle cx="22.5" cy="22.5" r="1.7" fill="currentColor"/>',
    cortado: '<path d="M7 11h17v8a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z"/><path d="M24 13.5h1.5a3 3 0 0 1 0 6H24M7 16.5h17"/>',
    cofre: '<circle cx="17" cy="17" r="11"/><circle cx="17" cy="17" r="6"/><circle cx="17" cy="17" r="2" fill="currentColor"/><path d="M17 4v3"/>',
    painel: '<rect x="5" y="5" width="10" height="10" rx="2.5"/><rect x="19" y="5" width="10" height="10" rx="2.5" fill="currentColor"/><rect x="5" y="19" width="10" height="10" rx="2.5"/><rect x="19" y="19" width="10" height="10" rx="2.5"/>',
  };
  // svg do glifo; cor = traço (para <img>, que não herda a cor do texto)
  function glifo(p, cor, tile) {
    var c = cor || "currentColor", g = (G[p] || G.painel).replace(/currentColor/g, c);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      (tile ? '<rect x="1" y="1" width="32" height="32" rx="8" stroke-width="1.3"/>' : "") + '<g transform="translate(17 17) scale(' + (tile ? .74 : 1) + ') translate(-17 -17)">' + g + "</g></svg>";
  }
  var url = function (svg) { return "data:image/svg+xml," + encodeURIComponent(svg); };
  // as figuras dos jogos (<img> com …/icon.png ou o ícone do próprio jogo) viram o glifo, nas duas cores do tema
  var RX = new RegExp("(?:^|/)(" + JOGOS.join("|") + ")/icon(?:-escuro|-claro)?\\.png");
  function trocaFiguras() {
    if (!root.hasAttribute("data-minimal")) return;
    var imgs = document.querySelectorAll("img"), mudou = false;
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i], s = im.getAttribute("src") || "";
      if (/^data:image\/svg/.test(im.getAttribute("data-claro") || "")) { if (!/^data:image\/svg/.test(s)) mudou = true; continue; }
      var mm = s.match(RX), p = mm ? mm[1] : (/^icon(?:-escuro|-claro)?\.png/.test(s) && pasta !== "painel" ? pasta : (/apple-touch-icon|icone-painel|(?:^|\/)icon-192\.png/.test(s) ? "painel" : null));
      if (!p) continue;
      im.setAttribute("data-min", p);
      im.setAttribute("data-claro", url(glifo(p, "#0d0d0d", false)));
      im.setAttribute("data-escuro", url(glifo(p, "#f2f2f2", false)));
      im.style.boxShadow = "none"; im.style.background = "none"; mudou = true;
    }
    if (mudou && window.jogosTema) jogosTema.trocaIcones();
  }
  function injeta() {
    if (document.getElementById("min-css")) return;
    var h = document.head || root;
    var f = document.createElement("link"); f.rel = "stylesheet"; f.id = "min-fontes";
    f.href = "https://fonts.googleapis.com/css2?family=Doto:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap"; h.appendChild(f);
    var l = document.createElement("link"); l.rel = "stylesheet"; l.id = "min-css"; l.href = base + "minimal.css?v=9"; h.appendChild(l);
  }
  if (on()) { root.setAttribute("data-minimal", ""); injeta(); }
  window.GLIFOS = G;
  window.jogosMinimal = {
    on: function () { return root.hasAttribute("data-minimal"); },
    get: on,
    glifo: glifo,
    // ligar/desligar recarrega a página: cada jogo desenha o tabuleiro de um jeito
    set: function (v) { try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {} location.reload(); },
  };
  var observa = function () {
    trocaFiguras();
    if (root.hasAttribute("data-minimal")) new MutationObserver(function () { trocaFiguras(); }).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observa); else observa();
  window.addEventListener("storage", function (e) { if (e.key === KEY) location.reload(); });
  window.addEventListener("pageshow", function (e) { if (e.persisted && on() !== root.hasAttribute("data-minimal")) location.reload(); });
})();
