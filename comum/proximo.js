/* =========================================================================
   Fim de jogo e navegação entre os jogos do dia (todos os jogos da casa).

   Quando a partida termina (desafio do dia ou jogo livre):
     · na parte de baixo da tela, a faixa de resultado do jogo fica à esquerda
       e, à direita, o botão do próximo jogo pendente; embaixo, à esquerda, o
       atalho discreto "Jogar um extra · nível N" (ou "Jogar outro", no jogo
       livre) e, à direita, a contagem para o próximo desafio;
     · na bandeja de resultado, o mesmo atalho junto do resultado e, no pé,
       a contagem (esquerda) e o próximo jogo (direita).
   Sem jogo pendente, o botão do próximo jogo não aparece.
   A chave "Jogo livre" de cada jogo continua na página, escondida: é ela que
   este arquivo aciona. No jogo livre, o botão "‹ Desafio do dia" volta.
   O próximo é o primeiro jogo ainda não feito hoje, na ordem do painel
   (jogos da casa, depois os outros). Abrir um jogo externo por aqui já o
   marca como feito, como no painel.

   Uso:  <script src="../comum/catalogo.js"></script>
         <script src="../comum/proximo.js" data-jogo="eclipse"></script>
   ========================================================================= */
(function () {
  "use strict";
  const ATUAL = document.currentScript.dataset.jogo;
  const KEY = "jogosDoDia.v1";
  const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function painel() {
    let s; try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { s = {}; }
    s.history ??= {}; s.custom ??= []; s.hidden ??= [];
    return s;
  }
  const nativo = g => !!LOCAL_PROGRESS[g.id];
  const terminado = g => { try { return !!LOCAL_PROGRESS[g.id]()?.finished; } catch { return false; } };

  // jogos em uso, na ordem em que aparecem no painel
  function jogos(s) {
    const hid = new Set(s.hidden);
    const todos = [...BASE_GAMES.filter(g => !hid.has(g.id)), ...s.custom.map(c => ({ ...c, custom: true }))];
    return [...todos.filter(nativo), ...todos.filter(g => !nativo(g))];
  }
  function feito(g, s) {
    return nativo(g) ? terminado(g) : (s.history[dayKey(new Date())] || []).includes(g.id);
  }
  function proximo() {
    const s = painel(), lista = jogos(s);
    const g = lista.find(g => g.id !== ATUAL && !feito(g, s));
    return { g: g || null, s };
  }

  // ícone: o mesmo do painel; enquanto carrega (ou se falhar), emoji ou inicial
  function icone(g) {
    const box = document.createElement("span");
    box.className = "px-ic";
    if (g.custom) box.innerHTML = `<b>${esc((g.name || "?").trim().charAt(0).toUpperCase())}</b>`;
    else box.textContent = g.emoji || "";
    const tries = iconCandidates(g);
    const next = () => {
      const src = tries.shift(); if (!src) return;
      const img = new Image(); img.alt = ""; img.referrerPolicy = "no-referrer";
      img.onload = () => {
        if (src.includes("google.com/s2") && img.naturalWidth <= 16) return next();
        if (g.iconFull) img.className = "full";
        box.textContent = ""; box.appendChild(img);
        marcaIconeEscuro(g, img);
      };
      img.onerror = next; img.src = src;
    };
    next();
    return box;
  }

  function abrir(e, g, s) {
    const url = new URL(g.url, CATALOGO_RAIZ).href;
    if (!nativo(g)) {                                  // externo: abrir já marca como feito
      const k = dayKey(new Date()), set = new Set(s.history[k] || []);
      set.add(g.id); s.history[k] = [...set];
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
      if (s.newTab && !g.app) { e.preventDefault(); window.open(url, "_blank", "noopener"); atualizar(true); }
    }
  }

  const CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const REFRESH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/></svg>';
  const VOLTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const NOME = (BASE_GAMES.find(g => g.id === ATUAL) || {}).name || "";

  // a chave "Jogo livre" do jogo (checkbox nos jogos de lógica e no Misto; botão no Quinhentos)
  const chave = (() => {
    const cb = document.querySelector(".gh-free input");
    if (cb) return { on: () => cb.checked, set: v => { if (cb.checked !== v) { cb.checked = v; cb.dispatchEvent(new Event("change", { bubbles: true })); } } };
    const sw = document.getElementById("mode-switch");
    if (sw) return { on: () => sw.classList.contains("on"), set: v => { if (sw.classList.contains("on") !== v) sw.click(); } };
    return { on: () => false, set: () => {} };
  })();
  const fechaJanelas = () => document.querySelectorAll(".overlay.open").forEach(o => o.classList.remove("open"));
  function jogarExtra() {
    if (chave.on()) { const b = document.querySelector("#againBtn, #end-next, #btn-again"); if (b) b.click(); return; }
    fechaJanelas(); chave.set(true);
  }
  // dificuldade do jogo livre, como cada jogo guarda
  function nivel() {
    const ler = k => { const v = localStorage.getItem(k); if (v == null) return null; try { return JSON.parse(v); } catch { return v; } };
    let v = null;
    try { v = ler(`${ATUAL}:nivel-livre`) ?? ler(`${ATUAL}-nivel-livre`) ?? (ATUAL === "quinhentos" ? ler("quinhentao:nivel-livre") : null); } catch {}
    if (typeof v === "number") return `nível ${v}`;
    const NOMES = { facil: "fácil", normal: "normal", dificil: "difícil" };
    if (NOMES[v]) return NOMES[v];
    return ATUAL === "sanduba" || ATUAL === "quinhentos" ? "normal" : "nível 4";
  }

  // estrutura fixa, montada uma vez: a chave some; "‹ Desafio do dia" no jogo livre;
  // a faixa de fim (jogos de lógica) ganha a vaga do próximo jogo e a linha de baixo
  function montar() {
    document.querySelectorAll(".gh-free").forEach(el => (el.style.display = "none"));
    document.querySelectorAll(".gh .gh-next").forEach(el => el.remove());
    const meta = document.querySelector(".gh-meta");
    if (meta && !meta.querySelector(".gh-dia")) {
      meta.insertAdjacentHTML("beforeend", `<button type="button" class="gh-dia" hidden>${VOLTA}Desafio do dia</button>`);
      meta.querySelector(".gh-dia").addEventListener("click", () => { fechaJanelas(); chave.set(false); });
    }
    const c = document.getElementById("controls");
    if (c && !c.parentNode.classList.contains("fim-row")) {
      const row = document.createElement("div");
      row.className = "fim-row";
      c.before(row); row.append(c);
      row.insertAdjacentHTML("beforeend", '<span class="fim-nx"></span>');
      row.insertAdjacentHTML("afterend", '<div class="fim-subrow" hidden></div>');
    }
    // bandeja de resultado: o atalho do jogo livre junto do resultado; o pé no lugar da antiga linha
    document.querySelectorAll(".modal.fim").forEach(m => {
      if (m.querySelector(".fim-free")) return;
      const sub = m.querySelector(".fim-sub");
      if (sub) sub.insertAdjacentHTML("afterend", '<div class="fim-free"></div>');
      const pe = m.querySelector("[data-proximo]");
      if (pe) { pe.className = "fim-foot"; pe.removeAttribute("data-proximo"); pe.hidden = false; }
    });
  }

  function botaoProximo(g, s, cls) {
    const a = document.createElement("a");
    a.className = cls;
    a.href = new URL(g.url, CATALOGO_RAIZ).href;
    a.setAttribute("aria-label", `Próximo jogo: ${g.name}`);
    if (cls !== "nx") a.append(icone(g));
    if (cls === "nx") {                                // ao lado da faixa: ícone com "Próximo" embaixo e a seta
      a.title = `Próximo jogo: ${g.name}`;
      if (g.cor) {                                     // jogo da casa: o botão inteiro tem a cor do cartão dele no painel
        a.classList.add("tinta");
        ["--nx-cb", "--nx-ci", "--nx-eb", "--nx-ei"].forEach((v, k) => a.style.setProperty(v, g.cor[k]));
      }
      const col = document.createElement("span");
      col.className = "nx-col";
      col.append(icone(g));
      col.insertAdjacentHTML("beforeend", `<small>Próximo</small>`);
      a.append(col);
      a.insertAdjacentHTML("beforeend", CHEV);
      a.onclick = e => abrir(e, g, s);
      return a;
    }
    a.insertAdjacentHTML("beforeend", `<span class="t"><small>Próximo jogo</small><b>${esc(g.name)}</b></span>${CHEV}`);
    a.onclick = e => abrir(e, g, s);
    return a;
  }
  function atalhoExtra() {
    const b = document.createElement("button");
    b.type = "button"; b.className = "fx";
    b.innerHTML = `${REFRESH}<span><u>${chave.on() ? "Jogar outro" : "Jogar um extra"}</u> · ${esc(nivel())}</span>`;
    b.addEventListener("click", jogarExtra);
    return b;
  }

  let ultimo = "";
  function atualizar(forcar) {
    montar();
    // partida na tela terminou? (faixa de fim à mostra)
    const acabou = !!document.querySelector("#controls.done, .gh-fim.on");
    const livre = chave.on();
    const { g, s } = proximo();
    const k = [acabou, livre, g ? g.id : "", nivel()].join("|");
    if (k === ultimo && !forcar) return;
    ultimo = k;

    const dia = document.querySelector(".gh-dia");
    if (dia) dia.hidden = !livre;

    const contagem = `<span class="cd">Próximo ${esc(NOME)} em <b data-contagem>--:--:--</b></span>`;
    // faixa de fim: próximo jogo à direita (se houver) e a linha de baixo
    document.querySelectorAll(".fim-nx").forEach(el => {
      el.innerHTML = "";
      if (acabou && g) el.append(botaoProximo(g, s, "nx"));
    });
    document.querySelectorAll(".fim-subrow").forEach(el => {
      el.hidden = !acabou;
      el.innerHTML = "";
      if (!acabou) return;
      el.append(atalhoExtra());
      if (!livre) el.insertAdjacentHTML("beforeend", `<span class="cd">Próximo em <b data-contagem>--:--:--</b></span>`);
    });
    const tip = document.getElementById("tip");
    if (tip && document.getElementById("controls")) tip.hidden = acabou;
    // bandeja de resultado
    document.querySelectorAll(".modal.fim .fim-free").forEach(el => { el.innerHTML = ""; el.append(atalhoExtra()); });
    document.querySelectorAll(".modal.fim .fim-foot").forEach(el => {
      el.innerHTML = "";
      if (!livre) el.insertAdjacentHTML("beforeend", contagem.replace('class="cd"', 'class="cd grande"'));
      if (g) el.append(botaoProximo(g, s, "fim-btn fim-nxbtn"));
      el.hidden = !el.childNodes.length;
    });
    document.dispatchEvent(new Event("gh-contagem"));
  }

  // contagem para o próximo desafio (meia-noite), em qualquer [data-contagem]
  function contagem() {
    const now = new Date(), next = new Date(now); next.setHours(24, 0, 0, 0);
    const t = Math.max(0, Math.floor((next - now) / 1000));
    const txt = [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60].map(n => String(n).padStart(2, "0")).join(":");
    document.querySelectorAll("[data-contagem]").forEach(el => { el.textContent = txt; });
  }
  setInterval(contagem, 1000); contagem();
  document.addEventListener("gh-contagem", contagem);        // peças recém-criadas
  document.addEventListener("gh-fim", () => atualizar(true));  // faixa de fim dos jogos de palavras (comum/cabecalho.js)
  document.addEventListener("DOMContentLoaded", contagem);

  // os jogos gravam o progresso no navegador; basta conferir de tempos em tempos
  const tick = () => atualizar(false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick); else tick();
  setInterval(tick, 1200);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) atualizar(true); });
  window.addEventListener("pageshow", () => atualizar(true));
})();
