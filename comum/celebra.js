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

  /* Brigadeiro: o doce cai na forminha e quica; o granulado salpica em volta */
  .celebra .bri-cai, .celebra .bri-conf { transform-box: fill-box; transform-origin: 50% 100%; }
  .celebra .bri-cai { animation: cel-bri-cai .5s cubic-bezier(.35, 0, .4, 1) var(--d, 0s) both; }
  @keyframes cel-bri-cai { 0% { transform: translateY(-120px) scale(.9); opacity: 0; } 25% { opacity: 1; } 62% { transform: translateY(0) scale(1.06, .9); } 80% { transform: translateY(-10px); } 100% { transform: none; opacity: 1; } }
  .celebra .bri-conf { animation: cel-bri-conf .45s ease-out var(--d, 0s) both; }
  @keyframes cel-bri-conf { from { transform: translateY(-30px) scale(.3); opacity: 0; } to { transform: none; opacity: 1; } }

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

    // Brigadeiro: a forminha rosa abre, o brigadeiro cai e quica, e um granulado colorido salpica em volta
    brigadeiro: () => {
      const forminha = (R, cor) => {
        let p = "", pr = ""; const n = 28;
        for (let k = 0; k <= n; k++) { const a = k / n * Math.PI * 2, r = k % 2 ? R * .91 : R; p += `${k ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)} ${(8 + Math.sin(a) * r).toFixed(1)}`; }
        for (let k = 0; k < n; k += 2) { const a = k / n * Math.PI * 2; pr += `M${(Math.cos(a) * R * .68).toFixed(1)} ${(8 + Math.sin(a) * R * .68).toFixed(1)}L${(Math.cos(a) * R * .95).toFixed(1)} ${(8 + Math.sin(a) * R * .95).toFixed(1)}`; }
        return `<path d="${p}Z" fill="${cor}"/><path d="${pr}" stroke="rgba(0,0,0,.12)" stroke-width="3.7"/><circle cy="8" r="${R * .66}" fill="${cor}"/><circle cy="8" r="${R * .66}" fill="rgba(0,0,0,.08)"/>`;
      };
      const r = 54, cs = ["#8a5a3a", "#a06c48", "#3e2414"];
      let gran = "", conf = "";
      for (let k = 0; k < 30; k++) {
        const a = (k * 137.5 + 93) * Math.PI / 180, rr = r * .12 + Math.sqrt(k / 30) * r * .75, x = Math.cos(a) * rr, y = 4 + Math.sin(a) * rr, t = (k * 53 + 51) % 180;
        gran += `<rect x="${(x - 8.1).toFixed(1)}" y="${(y - 2.7).toFixed(1)}" width="16.2" height="5.4" rx="2.7" fill="${cs[k % 3]}" transform="rotate(${t} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }
      const cc = ["#f19bbb", "#8ccbe9", "#f5cf62", "#a9dc8f", "#fff4e0"];
      for (let k = 0; k < 16; k++) {
        const a = k * 2.39996, rr = 70 + (k * 37) % 26, x = Math.cos(a) * rr, y = Math.sin(a) * rr * .9, t = (k * 61) % 180;
        conf += `<g class="bri-conf" style="--d:${(.95 + k * .03).toFixed(2)}s"><rect x="${(x - 6).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="12" height="4" rx="2" fill="${cc[k % 5]}" transform="rotate(${t} ${x.toFixed(1)} ${y.toFixed(1)})"/></g>`;
      }
      return `<defs><radialGradient id="cel-bri" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="#8a5636"/><stop offset=".5" stop-color="#4f2c18"/><stop offset="1" stop-color="#2b170b"/></radialGradient></defs>
      <g class="entra">${forminha(82, "#f19bbb")}</g>
      <g class="bri-cai" style="--d:.38s"><circle cy="${4 + r * .12}" r="${r}" fill="rgba(40,15,0,.25)"/><circle cy="4" r="${r}" fill="url(#cel-bri)"/>${gran}
        <ellipse cx="${-r * .35}" cy="${4 - r * .45}" rx="${r * .3}" ry="${r * .16}" fill="rgba(255,235,215,.22)" transform="rotate(-25 ${-r * .35} ${4 - r * .45})"/></g>
      ${conf}`;
    },

    // Ponto Cruz: um retalho de tela com um bloco 2 × 3 do tabuleiro; os seis dados são bordados em ordem,
    // cada um na cor do seu número (as mesmas --d1…--d6 do jogo, versão clara), e a agulha fecha.
    // O ícone é este quadro final sem a agulha (.cz-agulha), que fica pequena demais num ícone.
    cruzadinha: () => {
      const COR = ["", "#7d45a8", "#2c66b0", "#0e8a87", "#3d8b3a", "#e07b14", "#c8352b"];
      const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
        5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]] };
      const W = 168, H = 118, g = 52, top = -H / 2;
      const perna = (x1, y1, x2, y2, cor, d) => `<path class="traco cz-p" style="--l:16;--d:${d.toFixed(2)}s;--t:.16s" d="M${x1} ${y1}L${x2} ${y2}" stroke="${cor}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
      const X = (cx, cy, cor, d, r = 5.6) => perna(cx - r, cy - r, cx + r, cy + r, cor, d) + perna(cx + r, cy - r, cx - r, cy + r, cor, d + .11);
      let franja = "", furos = "", faces = "";
      for (let x = -W / 2 + 4; x <= W / 2 - 4; x += 6) franja += `M${x} ${top - 2}v-7M${x} ${-top + 2}v7`;
      for (let y = top + 7; y <= -top - 7; y += 8.7) for (let x = -W / 2 + 8; x <= W / 2 - 8; x += 8.7) furos += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.3"/>`;
      for (let n = 1; n <= 6; n++) {
        const cx = ((n - 1) % 3 - 1) * g, cy = (Math.floor((n - 1) / 3) - .5) * g;
        faces += PIPS[n].map(([a, b], k) => X(cx + a * 13.5, cy + b * 13.5, COR[n], .45 + (n - 1) * .14 + k * .05)).join("");
      }
      return `
      <g class="entra" transform="rotate(-6)">
        <path d="${franja}" stroke="#e6dcc4" stroke-width="2" stroke-linecap="round"/>
        <rect x="${-W / 2}" y="${top}" width="${W}" height="${H}" rx="4" fill="#fbf7ec" stroke="#e6dcc4" stroke-width="2"/>
        <g fill="#e4dbc6">${furos}</g>
        <path class="traco cz-p" style="--l:170;--d:.3s;--t:.3s" d="M${-W / 2 + 8} 0H${W / 2 - 8}" stroke="#7a6a58" stroke-width="2.6" stroke-dasharray="6 5" fill="none"/>
        <path class="traco cz-p" style="--l:110;--d:.32s;--t:.25s" d="M${-g / 2} ${top + 8}V${-top - 8}M${g / 2} ${top + 8}V${-top - 8}" stroke="#7a6a58" stroke-width="1.6" stroke-dasharray="4 5" fill="none" opacity=".6"/>
        ${faces}
      </g>
      <g class="cz-agulha">
        <path class="traco cz-p" d="M${g + 14} 30C90 54 92 70 84 86" fill="none" stroke="${COR[3]}" stroke-width="3" stroke-linecap="round" style="--l:80;--d:1.3s;--t:.3s"/>
        <g class="entra" style="--d:1.45s"><g transform="translate(80 82) rotate(20)"><rect x="-2.5" y="-4" width="5" height="40" rx="2.5" fill="#cfd3d6"/><path d="M-2.5 34L0 46L2.5 34Z" fill="#cfd3d6"/><rect x="-1" y="0" width="2" height="7" rx="1" fill="#fbf7ec"/></g></g>
      </g>`;
    },

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

    // Novelo: o novelo gira enquanto as voltas de lã vão se enrolando (grandes círculos inclinados), e o fio solto sai por último
    novelo: () => {
      const R = 62, esc = "#a8332c", cla = "#ee8a7d", meio = "#c24a40";
      let aneis = "";
      const anel = (ry, phi, cor, w, d) => { const per = Math.PI * (3 * (R + ry) - Math.sqrt((3 * R + ry) * (R + 3 * ry)));
        return `<ellipse class="traco" style="--l:${per.toFixed(0)};--d:${d.toFixed(2)}s;--t:.45s" rx="${R}" ry="${Math.max(1, ry).toFixed(1)}" transform="rotate(${phi})" fill="none" stroke="${cor}" stroke-width="${w}" opacity=".88"/>`; };
      for (let k = 0; k < 15; k++) aneis += anel(R * Math.abs(Math.cos(k * 12 * Math.PI / 180)), k * 23, k % 3 ? esc : cla, 3, .2 + k * .05);
      for (let k = 0; k < 9; k++) aneis += anel(R * (.15 + k * .1), 30 + k * 17, k % 2 ? meio : cla, 3.4, .6 + k * .06);
      return `
      <defs><radialGradient id="cel-nov-s" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a0d08" stop-opacity=".45"/></radialGradient></defs>
      <g transform="translate(-8 -8) scale(1.3)">
      <ellipse cx="6" cy="${R + 6}" rx="${R * .8}" ry="9" fill="rgba(60,15,10,.18)"/>
      <path class="traco" style="--l:140;--d:1.4s;--t:.4s" d="M44 44C62 62 70 78 92 74" fill="none" stroke="#c9443b" stroke-width="7" stroke-linecap="round"/>
      <g class="nov-bola">
        <circle r="${R}" fill="#d6564b"/>${aneis}<circle r="${R}" fill="url(#cel-nov-s)"/>
        <path d="M-30 -36Q-14 -50 6 -50" fill="none" stroke="#ffd2c8" stroke-width="4" stroke-linecap="round" opacity=".55"/>
      </g>
      </g>`;
    },

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
