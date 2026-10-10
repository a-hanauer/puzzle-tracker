/* =========================================================================
   Animação de conclusão, igual em todos os jogos da casa.

   Na hora da vitória (nunca ao reabrir um jogo já resolvido):
     · o tabuleiro esmaece;
     · o objeto do tema do jogo aparece no centro e se completa (~1 s);
     · a promessa resolve e o jogo abre o resultado: o desenho voa até a arte da janela de fim,
       que surge no centro da tela (sem janela de fim, o desenho some e o tabuleiro volta).
   Tocar pula a animação. Com "reduzir movimento" ligado, o desenho aparece
   pronto e some logo.

   Uso:  <script src="../comum/celebra.js"></script>
         celebrar("pingado", { alvo: palco, esmaecer: tabuleiro }).then(abreResultado);
         · alvo      elemento sobre o qual o desenho aparece (vira position: relative)
         · esmaecer  elemento (ou lista) que fica apagado durante a animação (padrão: o alvo)
   ========================================================================= */
(function () {
  "use strict";
  // Os desenhos abaixo foram marcados para ~2 s e são tocados RITMO vezes mais rápido (~1 s):
  // tempos e atrasos (inclusive os --d de cada peça) valem em "tempo de desenho".
  const RITMO = 2;
  const DUR = Math.round(2050 / RITMO);   // quando o desenho está completo (ms, tempo real)
  const SAIDA = 320;         // duração do sumiço (ms)

  const CSS = `
  .cel-host { position: relative; }
  .cel-dim { transition: opacity .23s ease, filter .23s ease; opacity: .26 !important; filter: blur(1.5px); }
  .celebra { position: absolute; inset: 0; z-index: 6; display: flex; align-items: center; justify-content: center;
    cursor: pointer; -webkit-tap-highlight-color: transparent; animation: cel-sai ${SAIDA}ms ease ${DUR}ms forwards; }
  .celebra > svg { width: min(64%, 300px); height: auto; overflow: visible; filter: drop-shadow(0 10px 24px rgba(30, 20, 10, .28)); }
  .celebra .entra, .celebra .surge, .celebra .brilha, .celebra [class^="cafe-"], .celebra [class^="ecl-"], .celebra .nov-bola,
  .celebra .pila-nota, .celebra [class^="sando-"] { transform-box: fill-box; transform-origin: center; }
  .celebra .azu-q { transform-box: fill-box; transform-origin: 0 0; }
  .celebra .entra { animation: cel-entra .37s cubic-bezier(.3, 1.4, .45, 1) var(--d, 0s) both; }
  .celebra .surge { animation: cel-surge .33s ease var(--d, 0s) both; }
  .celebra .traco { stroke-dasharray: var(--l, 400); stroke-dashoffset: var(--l, 400); animation: cel-traco var(--t, .53s) ease-in-out var(--d, 0s) forwards; }
  .celebra .brilha { animation: cel-brilha 1.07s ease-in-out var(--d, 0s) infinite both; }
  @keyframes cel-entra { from { transform: scale(.35); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes cel-surge { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cel-traco { to { stroke-dashoffset: 0; } }
  @keyframes cel-brilha { 0%, 100% { opacity: .15; transform: scale(.5); } 50% { opacity: 1; transform: scale(1); } }
  @keyframes cel-sai { to { opacity: 0; transform: scale(.92); visibility: hidden; } }
  .celebra.segura { animation: none; }

  /* Cortado: xícara com latte art */
  .celebra .cafe-gota { animation: cel-cai .33s ease-in .3s both; }
  .celebra .cafe-coracao { transform-origin: 50% 30%; animation: cel-leite .67s cubic-bezier(.25, .8, .3, 1) .5s both; }
  @keyframes cel-cai { 0% { transform: translateY(-70px); opacity: 0; } 30%, 90% { opacity: 1; } 100% { transform: none; opacity: 0; } }
  @keyframes cel-leite { 0% { transform: scale(.1); opacity: 0; } 30% { opacity: 1; } 100% { transform: none; opacity: 1; } }

  /* Eclipse: a lua desliza sobre o sol e acende a coroa */
  .celebra .ecl-lua { animation: cel-lua .8s cubic-bezier(.3, .7, .2, 1) .37s both; }
  .celebra .ecl-coroa { animation: cel-coroa .6s ease 1.03s both; }
  @keyframes cel-lua { from { transform: translateX(150px); } to { transform: none; } }
  @keyframes cel-coroa { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: none; } }

  /* Novelo: o novelo gira enquanto o fio se enrola */
  .celebra .nov-bola { animation: cel-entra .37s cubic-bezier(.3, 1.4, .45, 1) both, cel-gira 1.73s cubic-bezier(.2, .6, .3, 1) .07s both; }
  @keyframes cel-gira { from { transform: rotate(-200deg); } to { transform: none; } }

  /* Azulejo: os quartos do desenho giram e se encaixam */
  .celebra .azu-q { animation: cel-encaixa .33s cubic-bezier(.3, 1.4, .45, 1) var(--d) both; }
  @keyframes cel-encaixa { from { transform: rotate(-90deg) scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }

  /* 5PILA: notas caem girando e se empilham */
  .celebra .pila-nota { animation: cel-nota .47s cubic-bezier(.3, 1.2, .5, 1) var(--d) both; }
  @keyframes cel-nota { from { transform: translateY(-160px) rotate(var(--r0, -40deg)); opacity: 0; } 40% { opacity: 1; } to { transform: none; opacity: 1; } }

  /* Sando: as camadas caem uma a uma e o sanduíche é cortado ao meio */
  .celebra .sando-cam { animation: cel-cam .3s cubic-bezier(.3, 1.3, .5, 1) var(--d) both; }
  .celebra .sando-esq { animation: cel-esq .33s ease 1.37s both; }
  .celebra .sando-dir { animation: cel-dir .33s ease 1.37s both; }
  .celebra .sando-faca { animation: cel-faca .37s ease-in-out 1.07s both; }
  @keyframes cel-cam { from { transform: translateY(-120px); opacity: 0; } 50% { opacity: 1; } to { transform: none; opacity: 1; } }
  @keyframes cel-esq { to { transform: translateX(-9px) rotate(-3deg); } }
  @keyframes cel-dir { to { transform: translateX(9px) rotate(3deg); } }
  @keyframes cel-faca { 0% { transform: translateY(-40px); opacity: 0; } 30% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(95px); opacity: 0; } }

  /* Panelinha: a panela aparece, a tampa pula e o vapor sobe */
  .celebra .panela-tampa { transform-box: fill-box; transform-origin: 50% 100%; animation: cel-tampa .7s cubic-bezier(.3, 1.4, .5, 1) .55s both; }
  @keyframes cel-tampa { 0% { transform: translateY(-60px) rotate(-12deg); opacity: 0; } 40% { opacity: 1; } 65% { transform: translateY(-12px) rotate(4deg); } 100% { transform: none; opacity: 1; } }

  /* Cordel: o barbante se estende e o folheto cai pendurado, balançando */
  .celebra .cordel-folheto { transform-box: fill-box; transform-origin: 50% 0; animation: cel-pendura .9s cubic-bezier(.3, 1.3, .5, 1) .35s both; }
  .celebra .cordel-sol { transform-box: fill-box; transform-origin: center; animation: cel-entra .37s cubic-bezier(.3, 1.4, .45, 1) 1.1s both; }
  @keyframes cel-pendura { 0% { transform: translateY(-140px) rotate(-14deg); opacity: 0; } 35% { opacity: 1; } 60% { transform: rotate(7deg); } 80% { transform: rotate(-3deg); } 100% { transform: none; opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .celebra, .celebra * { animation-duration: .01s !important; animation-delay: 0s !important; }
    .celebra { animation: cel-sai .2s ease .8s forwards !important; }
  }`;

  // desenhos: viewBox -100 -100 200 200, centrados em 0,0
  const ARTE = {
    pingado: () => `
      <defs><clipPath id="cel-xc"><circle r="39"/></clipPath></defs>
      <g transform="translate(-6 0) scale(1.25)">
        <g class="entra"><ellipse rx="66" ry="62" fill="#efe4d4"/><ellipse rx="52" ry="49" fill="#e4d6c1"/></g>
        <g class="entra" style="--d:.08s">
          <rect x="38" y="-10" width="34" height="20" rx="10" fill="#fbf5ec"/>
          <circle r="46" fill="#fbf5ec"/><circle r="39" fill="#9c6a3f"/><circle r="35" fill="#7a4a2a"/>
          <g clip-path="url(#cel-xc)">
            <circle class="cafe-gota" cy="-2" r="4" fill="#f6ecdc"/>
            <path class="cafe-coracao" d="M0 25C-27 7 -30 -14 -15 -19C-7 -22 0 -16 0 -9C0 -16 7 -22 15 -19C30 -14 27 7 0 25Z" fill="#f6ecdc"/>
          </g>
        </g>
      </g>`,

    panelinha: () => `
      <g class="entra">
        <rect x="-82" y="-4" width="22" height="12" rx="6" fill="#7a5446"/><rect x="60" y="-4" width="22" height="12" rx="6" fill="#7a5446"/>
        <path d="M-64 -16H64V36A26 26 0 0 1 38 62H-38A26 26 0 0 1 -64 36Z" fill="#c8463a"/>
        <rect x="-68" y="-22" width="136" height="12" rx="6" fill="#f6ede3"/>
        <circle cx="-34" cy="14" r="6" fill="#f6ede3"/><circle cx="-6" cy="32" r="6" fill="#f6ede3"/><circle cx="24" cy="10" r="6" fill="#f6ede3"/><circle cx="42" cy="38" r="6" fill="#f6ede3"/><circle cx="-44" cy="44" r="5" fill="#f6ede3"/>
      </g>
      <g class="panela-tampa">
        <path d="M-60 -24C-56 -50 56 -50 60 -24Z" fill="#b23b30"/>
        <rect x="-12" y="-58" width="24" height="12" rx="6" fill="#7a5446"/>
      </g>
      <path class="traco" d="M-26 -66C-36 -78 -16 -86 -26 -98" fill="none" stroke="#c9bdb0" stroke-width="5" stroke-linecap="round" style="--l:40;--d:1.15s;--t:.4s"/>
      <path class="traco" d="M0 -70C-10 -82 10 -90 0 -102" fill="none" stroke="#c9bdb0" stroke-width="5" stroke-linecap="round" style="--l:40;--d:1.25s;--t:.4s"/>
      <path class="traco" d="M26 -66C16 -78 36 -86 26 -98" fill="none" stroke="#c9bdb0" stroke-width="5" stroke-linecap="round" style="--l:40;--d:1.35s;--t:.4s"/>`,

    cruzadinha: () => `
      <g class="entra"><rect x="-74" y="-74" width="148" height="148" rx="14" fill="#fbfaf3"/>
        <rect x="-64" y="-64" width="128" height="128" rx="6" fill="#23241c"/></g>
      <rect class="entra" x="-36" y="-61" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.20s"/>
      <rect class="entra" x="-11" y="-61" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.25s"/>
      <rect class="entra" x="14" y="-61" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.30s"/>
      <rect class="entra" x="-61" y="-36" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.20s"/>
      <rect class="entra" x="-36" y="-36" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.25s"/>
      <rect class="entra" x="-11" y="-36" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.30s"/>
      <rect class="entra" x="14" y="-36" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.35s"/>
      <rect class="entra" x="39" y="-36" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.40s"/>
      <rect class="entra" x="-61" y="-11" width="22" height="22" rx="2.5" fill="#b9d066" style="--d:0.25s"/>
      <rect class="entra" x="-36" y="-11" width="22" height="22" rx="2.5" fill="#b9d066" style="--d:0.30s"/>
      <rect class="entra" x="-11" y="-11" width="22" height="22" rx="2.5" fill="#b9d066" style="--d:0.35s"/>
      <rect class="entra" x="14" y="-11" width="22" height="22" rx="2.5" fill="#b9d066" style="--d:0.40s"/>
      <rect class="entra" x="39" y="-11" width="22" height="22" rx="2.5" fill="#b9d066" style="--d:0.45s"/>
      <rect class="entra" x="-61" y="14" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.30s"/>
      <rect class="entra" x="-36" y="14" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.35s"/>
      <rect class="entra" x="-11" y="14" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.40s"/>
      <rect class="entra" x="14" y="14" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.45s"/>
      <rect class="entra" x="39" y="14" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.50s"/>
      <rect class="entra" x="-36" y="39" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.40s"/>
      <rect class="entra" x="-11" y="39" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.45s"/>
      <rect class="entra" x="14" y="39" width="22" height="22" rx="2.5" fill="#fffefa" style="--d:0.50s"/>
      <g class="entra" style="--d:1.05s"><g transform="translate(58 58) rotate(-45)">
        <rect x="-9" y="-58" width="18" height="70" rx="3" fill="#f2c230"/><rect x="-9" y="-66" width="18" height="12" rx="3" fill="#e58b8b"/>
        <rect x="-9" y="-56" width="18" height="5" fill="#b9b9b0"/>
        <path d="M-9 12L0 32L9 12Z" fill="#f2dcb0"/><path d="M-3.2 25L0 32L3.2 25Z" fill="#23241c"/></g></g>`,

    cordel: () => `
      <path class="traco" d="M-96 -66Q0 -46 96 -66" fill="none" stroke="#6e5a44" stroke-width="3.5" stroke-linecap="round" style="--l:200;--t:.45s"/>
      <g class="cordel-folheto">
        <rect x="-50" y="-52" width="100" height="134" rx="5" fill="#f4ecdc"/>
        <rect x="-38" y="-38" width="76" height="9" rx="2" fill="#141210"/>
        <rect x="-38" y="-24" width="76" height="70" rx="3" fill="#141210"/>
        <circle class="cordel-sol" cx="17" cy="-6" r="11" fill="#c8321e"/>
        <path d="M-38 46V20L-22 8L-8 18L8 2L24 16L38 6V46Z" fill="#f4ecdc"/>
        <path d="M-30 46V30h12v16Z M-26 30l2-6 2 6Z" fill="#141210"/>
        <rect x="-38" y="54" width="54" height="6" rx="2" fill="#141210"/>
        <rect x="-38" y="66" width="40" height="6" rx="2" fill="#141210"/>
        <rect x="-7" y="-66" width="14" height="26" rx="4" fill="#9a6a43"/>
        <rect x="-1.5" y="-64" width="3" height="22" rx="1.5" fill="#6e4a2c"/>
      </g>`,

    eclipse: () => `
      <defs>
        <radialGradient id="cel-sol" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#fff7d1"/><stop offset=".42" stop-color="#ffd23f"/><stop offset="1" stop-color="#f08c00"/></radialGradient>
        <radialGradient id="cel-coroa" r="50%"><stop offset=".5" stop-color="#fff4c2" stop-opacity=".95"/><stop offset=".68" stop-color="#ffc83d" stop-opacity=".6"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>
        <clipPath id="cel-ceu"><circle r="98"/></clipPath>
      </defs>
      <circle class="entra" r="98" fill="#0d1233"/>
      <g clip-path="url(#cel-ceu)">
        <circle class="ecl-coroa" r="86" fill="url(#cel-coroa)"/>
        <circle class="entra" style="--d:.07s" r="48" fill="url(#cel-sol)"/>
        <circle class="ecl-lua" cx="3" cy="-3" r="46.5" fill="#0d1233"/>
        ${[[-66, -48, .6], [58, -62, .87], [70, 44, 1.13], [-58, 60, 1.4], [-80, 6, 1], [28, 76, .73]].map(([x, y, d]) =>
          `<g transform="translate(${x} ${y}) scale(5)"><path class="brilha" style="--d:${d}s" d="M0-1L.22-.22 1 0 .22.22 0 1-.22.22-1 0-.22-.22Z" fill="#fff4cf"/></g>`).join("")}
      </g>`,

    novelo: () => `
      <defs><clipPath id="cel-nov"><circle r="62"/></clipPath></defs>
      <g transform="translate(-8 -8) scale(1.3)">
      <path class="traco" style="--l:140;--d:1.4s;--t:.4s" d="M44 44C62 62 70 78 92 74" fill="none" stroke="#c9443b" stroke-width="9" stroke-linecap="round"/>
      <g class="nov-bola">
        <circle r="62" fill="#d6564b"/>
        <g clip-path="url(#cel-nov)" fill="none" stroke="#a8332c" stroke-width="7" stroke-linecap="round">
          <path class="traco" style="--l:220;--d:.3s" d="M-70 -20C-30 -60 30 -60 70 -20"/>
          <path class="traco" style="--l:220;--d:.47s" d="M-70 0C-30 -40 30 -40 70 0"/>
          <path class="traco" style="--l:220;--d:.63s" d="M-70 22C-30 -18 30 -18 70 22"/>
          <path class="traco" style="--l:220;--d:.8s" d="M-20 -70C-60 -30 -60 30 -20 70"/>
          <path class="traco" style="--l:220;--d:.97s" d="M8 -70C-32 -30 -32 30 8 70"/>
          <path class="traco" style="--l:220;--d:1.13s" d="M36 -70C-4 -30 -4 30 36 70"/>
        </g>
      </g>
      </g>`,

    retalhos: () => {
      const q = (rot, d) => `<g transform="rotate(${rot})"><g class="azu-q" style="--d:${d}s">
        <rect x="0" y="0" width="70" height="70" fill="#f4f1e8"/>
        <path d="M0 0H70V70A70 70 0 0 1 0 0Z" fill="#1f4fa3" opacity=".12"/>
        <path d="M0 0Q48 8 58 58Q8 48 0 0Z" fill="#1f4fa3"/>
        <circle cx="52" cy="18" r="7" fill="#3b72c9"/><circle cx="18" cy="52" r="7" fill="#3b72c9"/>
        <path d="M70 70m-20 0a20 20 0 0 1 20-20" fill="none" stroke="#1f4fa3" stroke-width="6"/>
      </g></g>`;
      return `
      <g class="entra"><rect x="-86" y="-86" width="172" height="172" rx="14" fill="#173d80"/><rect x="-76" y="-76" width="152" height="152" rx="6" fill="#f4f1e8"/></g>
      <g transform="scale(1.086)">${q(180, .33)}${q(270, .53)}${q(0, .73)}${q(90, .93)}</g>
      <circle class="entra" style="--d:1.2s" r="15" fill="#f4f1e8"/><circle class="entra" style="--d:1.27s" r="9" fill="#1f4fa3"/>`;
    },

    quinhentos: () => {
      const nota = (y, r, d, r0, top) => `<g transform="translate(0 ${y}) rotate(${r})"><g class="pila-nota" style="--d:${d}s;--r0:${r0}deg">
        <rect x="-86" y="-48" width="172" height="96" rx="9" fill="${top ? "#b89bd9" : "#a888cf"}"/>
        <rect x="-77" y="-39" width="154" height="78" rx="5" fill="none" stroke="#8d6cc0" stroke-width="2.6"/>
        ${top ? `<path d="M-77 20c22-13 40 13 66 0s44 13 84-2" fill="none" stroke="#a384cf" stroke-width="6"/>
        <circle cx="-42" cy="-2" r="24" fill="#d8c8ee"/>
        <text x="-42" y="7" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="22" fill="#6f4fa8">R$</text>
        <text x="36" y="22" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="62" fill="#5a3d8c">5</text>` : ""}
      </g></g>`;
      return nota(28, 8, .1, -60, false) + nota(12, -6, .37, 40, false) + nota(-6, -2, .63, -30, true);
    },

    sanduba: () => {
      const fatia = (y) => `<rect x="-72" y="${y}" width="144" height="46" rx="16" fill="#e9c98a"/><rect x="-66" y="${y + 5}" width="132" height="36" rx="12" fill="#fdf6e6"/>`;
      const sand = `
        <g class="sando-cam" style="--d:.13s">${fatia(34)}</g>
        <g class="sando-cam" style="--d:.33s"><path d="M-72 30 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v10 H-72z" fill="#7fb556"/><path d="M-72 26 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v8 H-72z" fill="#9fce72"/></g>
        <g class="sando-cam" style="--d:.53s"><rect x="-82" y="-12" width="164" height="42" rx="21" fill="#bd7426"/><rect x="-82" y="-12" width="164" height="32" rx="16" fill="#d68f34"/>
          ${[[-60, -2], [-34, 6], [-8, -4], [18, 5], [44, -1], [62, 8], [-48, 12], [30, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#bd7426"/>`).join("")}</g>
        <g class="sando-cam" style="--d:.73s">${fatia(-60)}</g>`;
      return `
      <defs><clipPath id="cel-esq"><rect x="-100" y="-100" width="100" height="200"/></clipPath><clipPath id="cel-dir"><rect x="0" y="-100" width="100" height="200"/></clipPath></defs>
      <g class="sando-esq"><g clip-path="url(#cel-esq)">${sand}</g></g>
      <g class="sando-dir"><g clip-path="url(#cel-dir)">${sand}</g></g>
      <g class="sando-faca"><rect x="-3" y="-96" width="6" height="70" rx="3" fill="#dfe3ea"/><rect x="-6" y="-120" width="12" height="28" rx="5" fill="#6b4a2f"/></g>`;
    },
  };

  let estilo = false;
  window.CELEBRA = { ARTE, CSS };   // também usados para gerar os ícones (o ícone é o quadro final da animação)
  // Passagem para o resultado: se a página tem a janela de fim (.modal.fim), o desenho não some no fim da
  // animação — fica no lugar e, quando o jogo abre a janela, voa até a arte dela enquanto a janela
  // surge no centro, como se saísse do próprio desenho. Sem janela aberta em 1,5 s, some como antes.
  let espera = null;            // { el, esm, svg } do desenho que aguarda a janela
  function solta(fade) {
    if (!espera) return;
    const { el, esm } = espera; espera = null;
    esm.forEach(e => e.classList.remove("cel-dim"));
    if (!fade) return el.remove();
    el.style.animation = `cel-sai ${SAIDA}ms ease forwards`;
    setTimeout(() => el.remove(), SAIDA + 50);
  }
  function passagem(ov) {
    const { el, svg } = espera, esm = espera.esm; espera = null;
    const modal = ov.querySelector(".modal"), slot = modal.querySelector(".fim-art > *");
    const de = svg.getBoundingClientRect();
    modal.style.animation = "none";                       // mede a posição final, sem a animação de abrir
    const para = slot ? slot.getBoundingClientRect() : null;
    modal.style.animation = "";
    // o desenho sai do tabuleiro e passa a voar por cima de tudo
    const voo = document.createElement("div");
    voo.className = "cel-voo";
    voo.style.cssText = `position:fixed;left:${de.left}px;top:${de.top}px;width:${de.width}px;height:${de.height}px;z-index:9999;pointer-events:none;`;
    voo.append(svg); document.body.append(voo); el.remove();
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches, T = reduz ? 1 : 460;
    if (slot) slot.style.visibility = "hidden";
    // tamanho final: o desenho ocupa a arte da janela (o ícone é o quadro final dele)
    const lado = para ? Math.min(para.width, para.height) * .82 : 0;
    const dx = para ? para.left + para.width / 2 - (de.left + de.width / 2) : 0, dy = para ? para.top + para.height / 2 - (de.top + de.height / 2) : 0;
    const k = para ? lado / de.width : .3;
    const va = voo.animate([{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }], { duration: T, easing: "cubic-bezier(.45, 0, .2, 1)", fill: "forwards" });
    // a janela surge (escala + opacidade) em volta do desenho, que chega ao lugar da arte
    modal.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], { duration: T * .8, delay: T * .15, easing: "cubic-bezier(.2, .9, .3, 1.1)", fill: "backwards" });
    ov.animate([{ backgroundColor: "transparent", backdropFilter: "blur(0px)" }, {}], { duration: T * .7 });
    setTimeout(() => esm.forEach(e => e.classList.remove("cel-dim")), T);   // o tabuleiro só volta com o fundo da janela já por cima
    va.finished.then(() => {
      if (slot) slot.style.visibility = "";
      const f = voo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduz ? 1 : 160, fill: "forwards" });
      f.finished.then(() => voo.remove());
    });
  }
  new MutationObserver(ms => {
    if (!espera) return;
    for (const m of ms) {
      const ov = m.target;
      if (ov.classList && ov.classList.contains("open") && ov.querySelector(":scope > .modal.fim")) { passagem(ov); return; }
    }
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["class"] });

  window.celebrar = function (jogo, opts = {}) {
    const alvo = opts.alvo, arte = ARTE[jogo];
    if (!alvo || !arte) return Promise.resolve();
    if (!estilo) { const s = document.createElement("style"); s.textContent = CSS; document.head.append(s); estilo = true; }
    const esm = [].concat(opts.esmaecer || alvo).filter(Boolean);
    const segura = !!document.querySelector(".overlay > .modal.fim");   // haverá janela de fim: o desenho espera por ela
    alvo.classList.add("cel-host");
    const el = document.createElement("div");
    el.className = "celebra" + (segura ? " segura" : ""); el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg viewBox="-100 -100 200 200">${arte()}</svg>`;
    alvo.append(el);
    el.getAnimations({ subtree: true }).forEach(a => { if (a.effect && a.effect.target !== el) a.playbackRate = RITMO; });
    esm.forEach(e => e.classList.add("cel-dim"));
    return new Promise(res => {
      let feito = false;
      if (segura) {
        const pronto = () => {
          if (feito) return; feito = true;
          // tocar pula: o desenho aparece completo e a janela já vem
          el.getAnimations({ subtree: true }).forEach(a => { if (a.effect && a.effect.target !== el && isFinite(a.effect.getComputedTiming().endTime)) a.finish(); });   // as estrelas piscam sem fim
          espera = { el, esm, svg: el.querySelector("svg") };
          setTimeout(() => { if (espera && espera.el === el) solta(true); }, 1500);   // a janela não veio
          res();
        };
        el.addEventListener("click", pronto);
        setTimeout(pronto, DUR);
        return;
      }
      const fim = () => { if (feito) return; feito = true; el.remove(); esm.forEach(e => e.classList.remove("cel-dim")); res(); };
      el.addEventListener("click", fim);
      el.addEventListener("animationend", e => { if (e.target === el) fim(); });
      setTimeout(fim, DUR + SAIDA + 200);                     // garantia
      setTimeout(() => esm.forEach(e => e.classList.remove("cel-dim")), DUR);  // o tabuleiro volta enquanto o desenho some
    });
  };
})();
