/* Recorde do dia: o tempo de hoje é o melhor de todos no mesmo nível?
   O nível é o dia da semana, então "mesmo nível" = dias com diferença múltipla de 7.
   Só vale a partir da segunda vez no nível (a primeira não tem com o que comparar).
   Jogos de palavras: menos tentativas que o melhor anterior (recordeTentativas). */
(function () {
  var RAIZ = new URL("../", document.currentScript.src).href;   // pasta do painel (onde fica nuvem.js)
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

  /* ---------- Últimos 7 dias, na bandeja de fim (só no desafio do dia) ----------
     Barras de hoje e dos 6 dias anteriores; barra mais baixa = mais rápido / menos tentativas.
     Dia sem partida fica só com um traço, sem aviso. */
  var INI = ["D", "S", "T", "Q", "Q", "S", "S"];
  var fmtT = function (s) { s = Math.round(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  var chave = function (d, zeros) { var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + "-" + (zeros ? String(m).padStart(2, "0") : m) + "-" + (zeros ? String(dd).padStart(2, "0") : dd); };
  function seteDias() { var out = [], d0 = new Date(); d0.setHours(12, 0, 0, 0); for (var k = 6; k >= 0; k--) { var d = new Date(d0); d.setDate(d0.getDate() - k); out.push(d); } return out; }
  // jogos com tempo: prefixo "eclipse:" etc. e o número do desafio de hoje
  window.semanaTempos = function (prefixo, dayNum) {
    var st = ler(prefixo + "stats"), t = (st && st.times) || {};
    return seteDias().map(function (d, i) { var v = t[dayNum - 6 + i]; return { d: d, v: v == null ? null : v }; });
  };
  // jogos de palavras: o painel guarda os resultados por dia; o Sando também guarda cada partida do dia
  window.semanaPalavras = function (id, hoje) {
    var st = ler("jogosDoDia.v1"), res = (st && st.results) || {};
    return seteDias().map(function (d, i) {
      if (i === 6 && hoje) return { d: d, v: hoje.tries, perdeu: !hoje.won };
      var r = res[chave(d, true)] && res[chave(d, true)][id];
      if (!r && id === "sanduba") {
        var p = ler("sanduba-daily-" + chave(d, false));
        if (p && Array.isArray(p.guesses) && p.guesses.length) {
          var won = p.guesses.some(function (g) { return g.word === p.secret; });
          if (won || p.guesses.length >= (p.max || 14)) r = { tries: p.guesses.length, won: won };
        }
      }
      return r && r.tries != null ? { d: d, v: r.tries, perdeu: !r.won } : { d: d, v: null };
    });
  };

  /* ---------- Ranking do grupo no fim de jogo (desde 09/11/2026) ----------
     O painel guarda em "jogosDoDia.grupo" os resultados de hoje do grupo de amigos (nuvem.js). Aqui, no fim da
     partida, junta o resultado de quem joga (lido do próprio jogo) com os dos amigos e mostra a posição no grupo.
     Sem grupo (ou sem conta), não aparece nada. */
  var PASTA = { eclipse: "eclipse", novelo: "novelo", azulejo: "retalhos", cortado: "pingado", cordel: "cordel", cruzadinha: "cruzadinha",
    geranio: "girassol", brigadeiro: "brigadeiro", sando: "sanduba", "5pila": "quinhentos" };
  var EPOCA = { eclipse: [2026, 8, 27], novelo: [2026, 8, 28], retalhos: [2026, 8, 28], pingado: [2026, 8, 28], cordel: [2026, 9, 4],
    cruzadinha: [2026, 9, 10], brigadeiro: [2026, 9, 17], girassol: [2026, 10, 4] };
  var MED = ["🥇", "🥈", "🥉"];
  function hojeK() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function meuResultado(id) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    if (id === "sanduba") {
      var s = ler("sanduba-daily-" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
      if (!s || !s.guesses || !s.guesses.length) return null;
      var won = s.guesses.some(function (g) { return g.word === s.secret; });
      return { tipo: "tries", valor: s.guesses.length, max: s.max || 14, won: won, dica: !!s.dica };
    }
    if (id === "quinhentos") {
      var q = ler("quinhentao:game:padrao"), d0 = new Date(); d0.setHours(0, 0, 0, 0);
      if (!q || !q.finished || q.dayNum !== Math.floor((d0 - new Date(2024, 0, 1)) / 86400000) + 1) return null;   // só a partida de hoje
      return { tipo: "tries", valor: q.guesses.length, max: q.max || 8, won: !!q.won, dica: !!q.dica };
    }
    var ep = EPOCA[id]; if (!ep) return null;
    var n = Math.round((d - new Date(ep[0], ep[1], ep[2])) / 86400000) + 1, p = ler(id + ":dia:" + n);
    if (!p || !p.done) return null;
    if (id === "girassol") return { tipo: "pts", valor: p.pts || 0, won: true, dica: !!p.dica };
    if (id === "brigadeiro") return { tipo: "inc", valor: p.inc, won: true, max: p.min || 0, dica: !!p.dica };
    return { tipo: "time", valor: p.time, won: true, dica: !!p.dica };
  }
  function ordem(a, b) {
    if (a.tipo === "tries" && a.won !== b.won) return a.won ? -1 : 1;
    return a.tipo === "pts" ? b.valor - a.valor : a.valor - b.valor;
  }
  function fmtR(r) {
    return r.tipo === "pts" ? r.valor + " pts" : r.tipo === "tries" ? (r.won ? "" : "✗ ") + r.valor + "/" + (r.max || "?") : r.tipo === "inc" ? String(r.valor) : fmtT(r.valor);
  }
  // posição de quem joga no grupo, hoje, neste jogo (para a pílula da faixa de resultado): { med, pos, total } ou null
  window.grupoPos = function () {
    var id = PASTA[(location.pathname.match(/\/([^/]+)\/(?:index\.html)?$/) || [])[1]];
    var g = ler("jogosDoDia.grupo"), eu = id && meuResultado(id);
    if (!g || g.dia !== hojeK() || !eu || typeof eu.valor !== "number" || (eu.tipo === "tries" && !eu.won)) return null;
    var lista = (g.res || []).filter(function (r) { return r.jogo === id && r.uid !== g.eu; });
    if (!lista.length) return null;
    eu.eu = true; lista.push(eu); lista.sort(ordem);
    var euPos = lista.findIndex(function (r) { return r.eu; }), minha = 0;
    for (var i = 0; i <= euPos; i++) if (i === 0 || ordem(lista[i - 1], lista[i]) !== 0) minha = i;
    return { med: MED[minha] || "", pos: minha + 1, total: lista.length };
  };
  var ultimoFim = null;   // o último bloco desenhado, para redesenhar quando chega resultado novo de amigo
  window.grupoFim = function (subEl, mostrar) {
    ultimoFim = [subEl, mostrar];
    var box = subEl.parentNode.querySelector(".fim-grupo");
    var id = PASTA[(location.pathname.match(/\/([^/]+)\/(?:index\.html)?$/) || [])[1]];
    var g = ler("jogosDoDia.grupo"), eu = id && meuResultado(id);
    if (!mostrar || !g || g.dia !== hojeK() || !eu || typeof eu.valor !== "number") { if (box) box.remove(); return; }
    var lista = (g.res || []).filter(function (r) { return r.jogo === id && r.uid !== g.eu; });
    eu.uid = g.eu; eu.eu = true; lista.push(eu); lista.sort(ordem);
    var pos = 0, linhas = lista.map(function (r, i) {
      if (i === 0 || ordem(lista[i - 1], r) !== 0) pos = i;
      var perdeu = r.tipo === "tries" && !r.won;
      return '<div class="fg-l' + (r.eu ? " eu" : "") + '"><span class="fg-p">' + (perdeu ? "·" : MED[pos] || (pos + 1) + "º") + '</span><span class="fg-n">' +
        (r.eu ? "Você" : esc((g.nomes || {})[r.uid] || r.apelido || "?")) + (r.dica ? '<span class="fg-dc">💡 dica</span>' : "") + '</span><b>' + fmtR(r) + "</b></div>";
    });
    var euPos = lista.findIndex(function (r) { return r.eu; }), minha = 0;
    for (var i = 0; i <= euPos; i++) if (i === 0 || ordem(lista[i - 1], lista[i]) !== 0) minha = i;
    var faltam = (g.membros || []).filter(function (u) { return u !== g.eu && !lista.some(function (r) { return r.uid === u; }); })
      .map(function (u) { return esc((g.nomes || {})[u] || "?"); });
    var so = lista.length === 1;
    var titulo = so ? "Primeiro do grupo hoje" : (eu.tipo === "tries" && !eu.won) ? "No grupo hoje" : (minha + 1) + "º de " + lista.length + " no grupo";
    if (!box) { box = document.createElement("div"); box.className = "fim-grupo"; }
    var ancora = subEl.parentNode.querySelector(".fim-rec") || subEl;
    ancora.after(box);
    box.innerHTML = '<a class="fg-top" href="../#ranking"><span class="fg-med">' + (so ? "🏁" : (eu.tipo === "tries" && !eu.won) ? "👥" : MED[minha] || "👥") + '</span><span class="fg-tit">' + titulo +
      '<small>' + esc(g.nome || "Seu grupo") + '</small></span><span class="fg-ver">Ranking<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></span></a>' +
      (so ? "" : '<div class="fg-lista">' + linhas.join("") + "</div>") +
      (faltam.length ? '<div class="fg-falta">' + (faltam.length === 1 ? faltam[0] + " ainda não jogou" : faltam.slice(0, -1).join(", ") + " e " + faltam[faltam.length - 1] + " ainda não jogaram") + "</div>" : "");
  };

  /* ---------- Amigos ao vivo nos jogos (22/11/2026) ----------
     Antes, o resultado só subia para o grupo quando a pessoa voltava ao painel, e o fim de jogo mostrava os amigos
     como estavam ao abrir o painel. Agora, para quem tem grupo: o jogo carrega a nuvem (nuvem.js, sem atrasar o
     tabuleiro), ouve ao vivo os resultados de hoje do grupo e manda o próprio resultado assim que a partida termina
     (e de novo se ele mudar: Gerânio continua somando pontos depois de feito). Sem conta, sem grupo ou sem internet,
     nada muda: o painel manda depois, como antes. */
  function idPagina() { return PASTA[(location.pathname.match(/\/([^/]+)\/(?:index\.html)?$/) || [])[1]]; }
  // o resultado no mesmo formato do painel (resultadosParaRanking), para a nuvem não reenviar o mesmo resultado
  function paraEnvio(id) {
    var r = meuResultado(id); if (!r || typeof r.valor !== "number" || !(r.valor >= 0)) return null;
    var base = { dia: hojeK(), jogo: id, tipo: r.tipo, valor: Math.round(r.valor) };
    if (id === "sanduba") {
      if (!r.won && r.valor < r.max) return null;   // ainda jogando
      base.max = r.max; base.won = r.won; base.dica = !!r.dica; return base;
    }
    if (r.tipo === "tries") { base.dica = !!r.dica; base.won = r.won; base.max = r.max || 0; return base; }
    base.won = true; base.max = r.max || 0; base.dica = !!r.dica; return base;
  }
  var nv = null, carregando = null, parar = null, tEnvio = 0;
  function conta() { var c = ler("jogosDoDia.nuvem"); return c && c.uid && c.grupos && c.grupos.length ? c : null; }
  function nuvem() {
    if (nv) return Promise.resolve(nv);
    if (!carregando) carregando = import(RAIZ + "nuvem.js?v=8").then(function () { return window.nuvem.pronto; })
      .then(function () { nv = window.nuvem.estado.conectado ? window.nuvem : null; return nv; })
      .catch(function (e) { console.warn("amigos ao vivo", e); carregando = null; return null; });
    return carregando;
  }
  function ouve() {
    var c = conta(); if (!c || parar) return;
    nuvem().then(function (n) {
      if (!n || parar) return;
      var cod = c.grupos[0].cod, dia = hojeK();
      parar = n.ouvirDia(cod, dia, function (dados) {
        n.cacheGrupo(cod, dia, dados);
        if (ultimoFim && ultimoFim[0].isConnected) window.grupoFim(ultimoFim[0], ultimoFim[1]);
        window.dispatchEvent(new Event("grupo-hoje"));   // comum/proximo.js redesenha a pílula da posição
      });
    });
  }
  // chamado quando a partida termina (comum/proximo.js) e quando o resultado pode ter mudado (Gerânio depois de feito)
  window.amigosEnvia = function () {
    clearTimeout(tEnvio);
    tEnvio = setTimeout(function () {
      var id = idPagina(), r = id && conta() && paraEnvio(id); if (!r) return;
      nuvem().then(function (n) { if (n) return n.enviaResultados([r]); }).catch(function (e) { console.warn("amigos ao vivo", e); });
    }, 600);
  };
  if (idPagina() && conta()) {
    var comeca = function () { setTimeout(ouve, 900); };
    if (document.readyState === "complete") comeca(); else window.addEventListener("load", comeca);
    document.addEventListener("visibilitychange", function () { if (document.hidden) { if (parar) { parar(); parar = null; } } else ouve(); });
    window.addEventListener("pagehide", function () { if (parar) { parar(); parar = null; } });
  }

  // desenha (ou tira, com dias = null) o bloco logo abaixo da linha pequena e do selo de recorde
  window.semanaFim = function (subEl, dias, tipo) {
    if (window.grupoFim) grupoFim(subEl, !!dias);   // posição no grupo de amigos, logo abaixo do resultado
    var box = subEl.parentNode.querySelector(".fim-semana");
    if (!dias) { if (box) box.remove(); return; }
    if (!box) { box = document.createElement("div"); box.className = "fim-semana"; }
    var ancora = subEl.parentNode.querySelector(".fim-grupo") || subEl.parentNode.querySelector(".fim-rec") || subEl;
    ancora.after(box);
    var tempo = tipo === "tempo", vals = dias.filter(function (x) { return x.v != null; }).map(function (x) { return x.v; });
    var topo = Math.max.apply(null, vals.concat([1]));
    var barras = dias.map(function (x, i) {
      var cls = "b" + (i === 6 ? " hoje" : "") + (x.v == null ? " vazio" : "") + (x.perdeu ? " perdeu" : "");
      var h = x.v == null ? 4 : Math.max(8, Math.round(52 * x.v / topo));
      var lab = x.v == null ? "" : tempo ? fmtT(x.v) : String(x.v);
      return '<div class="' + cls + '"><small>' + lab + '</small><i style="height:' + h + 'px"></i></div>';
    }).join("");
    var nomes = dias.map(function (x, i) { return '<span' + (i === 6 ? ' class="hoje"' : "") + ">" + INI[x.d.getDay()] + "</span>"; }).join("");
    var rodape;
    if (tempo) {
      var media = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
      rodape = vals.length > 1 ? "média <b>" + fmtT(media) + "</b> · melhor <b>" + fmtT(Math.min.apply(null, vals)) + "</b>" : "";
    } else {
      var vit = dias.filter(function (x) { return x.v != null && !x.perdeu; }).map(function (x) { return x.v; });
      var m = vit.length ? (vit.reduce(function (a, b) { return a + b; }, 0) / vit.length).toFixed(1).replace(".", ",").replace(",0", "") : null;
      rodape = vals.length > 1 ? vals.length + " de 7" + (m ? " · média <b>" + m + "</b> " + tipo : "") : "";
    }
    box.innerHTML = '<div class="sem-tit">Últimos 7 dias</div><div class="sem-barras">' + barras + '</div><div class="sem-dias">' + nomes + "</div>" + (rodape ? '<div class="sem-rodape">' + rodape + "</div>" : "");
    box.setAttribute("aria-label", "Últimos 7 dias: " + dias.map(function (x) { return x.v == null ? "sem partida" : (tempo ? fmtT(x.v) : x.v + " " + tipo) + (x.perdeu ? " (não foi)" : ""); }).join(", "));
  };
})();
