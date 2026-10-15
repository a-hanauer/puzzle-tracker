// Teclado padrão dos jogos de palavras (o mesmo desenho do 5PILA e do Sando): QWERTY, ⌫ no fim da
// 2ª fileira, ENTER (opcional) no fim da 3ª. Estilo em comum/cabecalho.css (.gh-kb…); cada jogo só
// troca as cores (--kb-bg, --kb-ink, --kb-dim).
//   ghTeclado(el, { enter: false, aoTocar: tecla => … })   tecla = "A"…"Z", "⌫" ou "ENTER"
(function () {
  const APAGAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.4 4.8h11.2a2.4 2.4 0 0 1 2.4 2.4v9.6a2.4 2.4 0 0 1-2.4 2.4H8.4L1.9 12z"/><path d="M12.6 9.4l5 5.2M17.6 9.4l-5 5.2"/></g></svg>';
  window.ghTeclado = function (el, { enter = false, aoTocar } = {}) {
    const linhas = [[..."QWERTYUIOP"], [..."ASDFGHJKL", "⌫"], [..."ZXCVBNM", ...(enter ? ["ENTER"] : [])]];
    el.classList.add("gh-kb");
    el.innerHTML = linhas.map(l => `<div class="gh-kb-row">${l.map(k =>
      k === "⌫" ? `<button class="gh-kb-key back" type="button" data-k="⌫" aria-label="Apagar">${APAGAR}</button>`
      : k === "ENTER" ? `<button class="gh-kb-key enter" type="button" data-k="ENTER">ENTER</button>`
      : `<button class="gh-kb-key" type="button" data-k="${k}">${k}</button>`).join("")}</div>`).join("");
    el.addEventListener("click", e => { const b = e.target.closest(".gh-kb-key"); if (b && aoTocar) aoTocar(b.dataset.k); });
    return el;
  };
})();
