/* =========================================================================
   Dica (jogos de lógica): uma por desafio, igual em todos os jogos.

   Uma lâmpada no cabeçalho. O primeiro toque pergunta se quer mesmo usar
   (a dica fica marcada no resultado); o segundo usa. A dica em si é do jogo:
   corrige uma jogada errada ou, se estiver tudo certo, dá o próximo passo.
   Depois de usada, a lâmpada fica apagada até o próximo desafio.

   Uso:  <script src="../comum/dica.js"></script>
         const dica = ghDica({ usada: () => bool, bloqueada: () => bool, pedir: async () => "mensagem" });
         dica.atualiza();   // depois de trocar de desafio, terminar etc.
   ========================================================================= */
(function () {
  "use strict";
  const CSS = `
  .gh-dica svg { fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
  .gh-dica.usada { opacity: .35; }
  .gh-dica[disabled] { pointer-events: none; }
  .gh-dica.pronta { color: #d99a00; }
  .dica-balao { position: fixed; left: 50%; top: calc(env(safe-area-inset-top, 0px) + 64px); z-index: 40; transform: translateX(-50%);
    width: max-content; max-width: min(340px, calc(100vw - 32px)); padding: 12px 14px; border-radius: 14px;
    background: var(--gh-surface, #fff); color: var(--gh-ink, #222); box-shadow: 0 8px 30px rgba(0, 0, 0, .22);
    font: 600 .88rem/1.4 "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center;
    animation: dica-in .2s ease both; }
  .dica-balao[hidden] { display: none; }
  .dica-balao .acoes { display: flex; gap: 8px; margin-top: 10px; justify-content: center; }
  .dica-balao button { border: 0; border-radius: 10px; padding: 9px 14px; font: inherit; font-weight: 800; cursor: pointer;
    background: var(--gh-track, #eee); color: var(--gh-ink, #222); }
  .dica-balao button.sim { background: #f2b705; color: #2a1e00; }
  @keyframes dica-in { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translateX(-50%); } }`;
  const LAMPADA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';

  window.ghDica = function (opts) {
    const st = document.createElement("style"); st.textContent = CSS; document.head.append(st);
    const ajuda = document.getElementById("helpBtn");
    const b = document.createElement("button");
    b.type = "button"; b.className = "gh-btn gh-dica"; b.id = "dicaBtn";
    b.setAttribute("aria-label", "Dica"); b.title = "Dica";
    b.innerHTML = LAMPADA;
    if (ajuda) ajuda.before(b); else document.querySelector(".gh").append(b);
    const balao = document.createElement("div");
    balao.className = "dica-balao"; balao.hidden = true; balao.setAttribute("role", "status");
    document.body.append(balao);
    let timer = 0;
    const fecha = () => { balao.hidden = true; clearTimeout(timer); };
    const mostra = (html, ms) => { balao.innerHTML = html; balao.hidden = false; clearTimeout(timer); if (ms) timer = setTimeout(fecha, ms); };

    function atualiza() {
      const usada = !!opts.usada(), bloq = !!(opts.bloqueada && opts.bloqueada());
      b.classList.toggle("usada", usada);
      b.disabled = usada || bloq;
      b.setAttribute("aria-label", usada ? "Dica já usada neste desafio" : "Dica");
    }
    b.addEventListener("click", () => {
      if (b.disabled) return;
      mostra(`Usar a dica deste desafio? Ela fica marcada no resultado.<div class="acoes"><button type="button" class="nao">Agora não</button><button type="button" class="sim">Usar dica</button></div>`, 0);
      balao.querySelector(".nao").onclick = fecha;
      balao.querySelector(".sim").onclick = async () => {
        mostra("Pensando…", 0);
        let msg = "";
        try { msg = await opts.pedir(); } catch (e) { msg = "Não foi possível calcular a dica agora."; }
        atualiza();
        if (msg) mostra(msg, 3200); else fecha();
      };
    });
    document.addEventListener("pointerdown", e => { if (!balao.hidden && !balao.contains(e.target) && e.target !== b && !b.contains(e.target)) fecha(); }, true);
    atualiza();
    return { atualiza, aviso: m => mostra(m, 3200) };
  };
})();
