// Tema geral (Automático / Claro / Escuro), escolhido no painel e aplicado em todas as páginas.
// Carregado no <head>, antes de desenhar a página, para não piscar a cor errada.
// "auto" segue o celular; "light"/"dark" forçam o tema com data-theme no <html>.
(function () {
  var KEY = "jogosDoDia.tema";
  function get() { try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; } }
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
  window.jogosTema = {
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
  document.addEventListener("DOMContentLoaded", function () { apply(get()); });   // metas que vêm depois do script
  // se o tema mudar em outra aba (ou ao voltar do painel), acompanha
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(get()); });
  window.addEventListener("pageshow", function () { apply(get()); });
})();
