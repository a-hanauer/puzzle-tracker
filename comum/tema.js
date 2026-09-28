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
  window.jogosTema = {
    get: get,
    set: function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); },
  };
  apply(get());
  // App instalado na tela inicial do iPhone: a área "visível" da página
  // termina antes da borda de baixo da tela (sobra a altura da barra de
  // status), então o que é preso embaixo fica com um vão. Medimos a sobra
  // (altura da tela − altura da janela) e as bandejas descem essa medida
  // (--vfix). Se o iPhone um dia corrigir isso, a sobra vira 0 sozinha.
  try {
    if (navigator.standalone === true) {          // só o iPhone/iPad tem essa propriedade
      document.documentElement.classList.add("standalone");
      var fix = function () {
        var portrait = matchMedia("(orientation: portrait)").matches;
        var tela = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
        var sobra = Math.max(0, Math.min(80, Math.round(tela - window.innerHeight)));
        document.documentElement.style.setProperty("--vfix", sobra + "px");
      };
      fix();
      window.addEventListener("resize", fix);
      window.addEventListener("orientationchange", function () { setTimeout(fix, 300); });
      window.addEventListener("pageshow", fix);
    }
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () { apply(get()); });   // metas que vêm depois do script
  // se o tema mudar em outra aba (ou ao voltar do painel), acompanha
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(get()); });
  window.addEventListener("pageshow", function () { apply(get()); });
})();
