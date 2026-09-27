// Linha de informação do cabeçalho comum: "domingo, 27 set" ou, no jogo livre, "Partida extra".
// Uso: ghInfo(elementoDaInfo, () => estaNoJogoLivre, assinar)
// onde assinar(fn) chama fn sempre que o modo muda.
window.ghInfo = function (el, isFree, subscribe) {
  const W = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const M = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const update = () => {
    const d = new Date();
    el.textContent = isFree() ? "Partida extra" : `${W[d.getDay()]}, ${d.getDate()} ${M[d.getMonth()]}`;
  };
  subscribe(update);
  document.addEventListener("visibilitychange", update);
  update();
};
