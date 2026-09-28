// Linha de informação do cabeçalho comum: "domingo, 27 set" ou, no jogo livre, "Partida extra".
// Uso: ghInfo(elementoDaInfo, () => estaNoJogoLivre, assinar)
// onde assinar(fn) chama fn sempre que o modo muda.
// livre (opcional): { niveis, atual(), aoMudar(v), aoSortear() } — no jogo livre, mostra o seletor de dificuldade.
window.ghInfo = function (el, isFree, subscribe, livre) {
  const W = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const M = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const update = () => {
    const d = new Date();
    if (isFree() && livre) { ghNivel(el, { ...livre, atual: livre.atual() }); return; }
    el.classList.remove("gh-nivel");
    el.textContent = isFree() ? "Partida extra" : `${W[d.getDay()]}, ${d.getDate()} ${M[d.getMonth()]}`;
  };
  subscribe(update);
  document.addEventListener("visibilitychange", update);
  update();
};

// Jogo livre: escolha da dificuldade + sortear outro desafio, na linha de informação.
//   ghNivel(el, { niveis: [{ v, rotulo, curto?, opcao? }], atual, aoMudar(v), aoSortear() })
//   rotulo = texto no botão; opcao (ou curto) = texto na bandeja de escolha
// Mostra "Extra · [NÍVEL 4 ▾] [↻]". O botão do nível abre uma bandeja pequena
// com todas as opções; escolher uma já começa um desafio novo nesse nível.
const REFRESH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/></svg>';
const CHEV_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
window.ghNivel = function (el, { niveis, atual, aoMudar, aoSortear }) {
  const meta = el.closest(".gh-meta") || el.parentNode;
  const cur = niveis.find(n => String(n.v) === String(atual)) || niveis[0];
  el.classList.add("gh-nivel");
  el.innerHTML = `<span>Extra</span><button type="button" class="gh-lv" aria-haspopup="true" aria-expanded="false">${cur.rotulo}${CHEV_SVG}</button>` +
    `<button type="button" class="gh-re" aria-label="Sortear outro" title="Sortear outro">${REFRESH_SVG}</button>`;
  const btn = el.querySelector(".gh-lv");
  let pop = meta.querySelector(".gh-lv-pop");
  const fechar = () => { if (pop) pop.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (pop && !pop.hidden) { fechar(); return; }
    if (!pop) { pop = document.createElement("div"); pop.className = "gh-lv-pop"; meta.appendChild(pop); }
    const redondo = niveis.every(n => String(n.curto || n.rotulo).length <= 2);
    pop.innerHTML = `<div class="gh-lv-t">Dificuldade</div><div class="gh-lv-ops${redondo ? " num" : ""}">` +
      niveis.map(n => `<button type="button" data-v="${n.v}" aria-pressed="${String(n.v) === String(cur.v)}">${n.opcao || n.curto || n.rotulo}</button>`).join("") +
      `</div>${redondo ? '<div class="gh-lv-esc"><span>mais fácil</span><span>mais difícil</span></div>' : ""}`;
    pop.querySelectorAll("button[data-v]").forEach(b => b.addEventListener("click", ev => {
      ev.stopPropagation(); fechar();
      const n = niveis.find(x => String(x.v) === b.dataset.v);
      aoMudar(n.v);
    }));
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  });
  el.querySelector(".gh-re").addEventListener("click", e => { e.stopPropagation(); fechar(); aoSortear(); });
  if (!window.__ghLvFecha) {
    window.__ghLvFecha = true;
    document.addEventListener("click", e => { document.querySelectorAll(".gh-lv-pop").forEach(p => { if (!p.contains(e.target)) p.hidden = true; }); });
  }
  fechar();
};
