/* =========================================================================
   "Próximo jogo" — navegação entre os jogos do dia, sem voltar ao painel.

   Depois que o jogo do dia termina, aparece:
     · no cabeçalho, um botão discreto com o ícone do próximo jogo pendente;
     · na janela de resultado (onde houver um elemento [data-proximo]),
       uma linha "Próximo jogo · Nome ›".
   O próximo é o primeiro jogo ainda não feito hoje, na ordem do painel
   (jogos da casa, depois os outros).
   Abrir um jogo externo por aqui já o marca como feito, como no painel.

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

  const CHEV = '<svg class="px-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  let ultimo = "";

  function atualizar(forcar) {
    const atual = BASE_GAMES.find(g => g.id === ATUAL);
    const acabou = atual ? terminado(atual) : false;
    const { g, s } = acabou ? proximo() : { g: null, s: null };
    const chave = acabou ? (g ? g.id : "fim") : "";
    if (chave === ultimo && !forcar) return;
    ultimo = chave;

    // cabeçalho
    const head = document.querySelector("header.gh");
    let pill = head && head.querySelector(".gh-next");
    if (head && g) {
      if (!pill) {
        pill = document.createElement("a");
        pill.className = "gh-next";
        const ajuda = head.querySelector('[aria-label="Como jogar"]');
        head.insertBefore(pill, ajuda || null);
      }
      pill.href = new URL(g.url, CATALOGO_RAIZ).href;
      pill.title = `Próximo jogo: ${g.name}`;
      pill.setAttribute("aria-label", `Próximo jogo: ${g.name}`);
      pill.innerHTML = "";
      pill.append(icone(g));
      pill.insertAdjacentHTML("beforeend", CHEV);
      pill.onclick = e => abrir(e, g, s);
    } else if (pill) pill.remove();

    // janela de resultado
    document.querySelectorAll("[data-proximo]").forEach(el => {
      el.innerHTML = "";
      el.hidden = !acabou;
      if (!acabou) return;
      const a = document.createElement("a");
      a.className = "px-row";
      if (g) {
        a.href = new URL(g.url, CATALOGO_RAIZ).href;
        a.innerHTML = `<span class="px-l">Próximo jogo</span>`;
        a.append(icone(g));
        a.insertAdjacentHTML("beforeend", `<span class="px-n">${esc(g.name)}</span>${CHEV}`);
        a.onclick = e => abrir(e, g, s);
      } else {
        a.href = CATALOGO_RAIZ;
        a.innerHTML = `<span class="px-l">Tudo feito por hoje</span><span class="px-n">Ver painel</span>${CHEV}`;
      }
      el.append(a);
    });
  }

  // os jogos gravam o progresso no navegador; basta conferir de tempos em tempos
  const tick = () => atualizar(false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick); else tick();
  setInterval(tick, 1200);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) atualizar(true); });
  window.addEventListener("pageshow", () => atualizar(true));
})();
