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
  // bandejas) e, se num celular pequeno a página não couber na tela, ela rola normalmente.
  try {
    if (document.documentElement.hasAttribute("data-fixa")) {
      var st2 = document.createElement("style");
      st2.textContent = "html[data-fixa],html[data-fixa] body{overscroll-behavior:none}";
      document.head.appendChild(st2);
      var rolavel = function (el) {
        for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
          var oy = getComputedStyle(el).overflowY;
          if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
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
