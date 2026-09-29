/* Recorde do dia: o tempo de hoje é o melhor de todos no mesmo nível?
   O nível é o dia da semana, então "mesmo nível" = dias com diferença múltipla de 7.
   Só vale a partir da segunda vez no nível (a primeira não tem com o que comparar).
   Jogos de palavras: menos tentativas que o melhor anterior (recordeTentativas). */
(function () {
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var TROFEU = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3zm0 4H6v1a2 2 0 0 0 1 1.7V7zm10 0v2.7A2 2 0 0 0 18 8V7h-1z"/></svg>';
  function ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  // prefixo: "eclipse:", "novelo:", "retalhos:", "pingado:" → { dia: "quarta", antes: segundos } ou null
  window.recordeDoDia = function (prefixo, dayNum) {
    var st = ler(prefixo + "stats"), times = st && st.times;
    if (!times || times[dayNum] == null) return null;
    var antes = null;
    Object.keys(times).forEach(function (k) {
      var d = +k;
      if (d < dayNum && (dayNum - d) % 7 === 0 && (antes == null || times[k] < antes)) antes = times[k];
    });
    return antes != null && times[dayNum] < antes ? { dia: DIAS[new Date().getDay()], antes: antes } : null;
  };
  // tentativas de hoje × todas as vitórias anteriores → { antes: n } ou null
  window.recordeTentativas = function (hoje, anteriores) {
    if (!anteriores.length) return null;
    var antes = Math.min.apply(null, anteriores);
    return hoje < antes ? { antes: antes } : null;
  };
  // jogos de palavras ("sanduba", "quinhentos"): compara com as vitórias dos dias anteriores guardadas pelo painel
  window.recordePalavras = function (id, tries) {
    var st = ler("jogosDoDia.v1"), res = (st && st.results) || {}, d = new Date();
    var hoje = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var ant = Object.keys(res).filter(function (k) { return k < hoje && res[k][id] && res[k][id].won; }).map(function (k) { return res[k][id].tries; });
    return window.recordeTentativas(tries, ant);
  };
  // selo na bandeja de fim, logo abaixo da linha pequena (el); sem recorde, remove
  window.seloRecorde = function (el, texto) {
    var s = el.parentNode.querySelector(".fim-rec");
    if (!texto) { if (s) s.remove(); return; }
    if (!s) { s = document.createElement("div"); s.className = "fim-rec"; el.after(s); }
    s.innerHTML = '<span class="rec-pill">' + TROFEU + '<span></span></span>';
    s.querySelector(".rec-pill > span").textContent = texto;
  };
})();
