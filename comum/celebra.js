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
        <defs><clipPath id="cel-xc"><circle r="39"/></clipPath>
          <radialGradient id="cel-pires" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#fbf6ee"/><stop offset=".7" stop-color="#efe4d4"/><stop offset="1" stop-color="#d9c8b0"/></radialGradient>
          <radialGradient id="cel-xic" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ece2d2"/></radialGradient>
          <radialGradient id="cel-crema" cx="45%" cy="42%" r="62%"><stop offset="0" stop-color="#b67a46"/><stop offset=".6" stop-color="#8a5530"/><stop offset=".92" stop-color="#5f361b"/><stop offset="1" stop-color="#4a2913"/></radialGradient>
          <radialGradient id="cel-leite" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#ead9bd"/></radialGradient>
          <filter id="cel-somb" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="rgba(70,40,15,.3)"/></filter></defs>
        <g transform="translate(-6 0) scale(1.25)">
          <g class="entra"><ellipse rx="66" ry="62" fill="url(#cel-pires)" filter="url(#cel-somb)"/><ellipse rx="52" ry="49" fill="none" stroke="rgba(150,120,90,.25)" stroke-width="2"/></g>
          <g class="entra" style="--d:.08s">
            <path d="M40 -11h18a11 11 0 0 1 0 22H40Z" fill="url(#cel-xic)" stroke="rgba(150,120,90,.3)" stroke-width="1.5" filter="url(#cel-somb)"/>
            <circle r="46" fill="url(#cel-xic)" filter="url(#cel-somb)"/><circle r="46" fill="none" stroke="rgba(150,120,90,.25)" stroke-width="1.5"/>
            <circle r="40.5" fill="#d9c9b2"/><circle r="39" fill="url(#cel-crema)"/>
            <g clip-path="url(#cel-xc)">
              <circle class="cafe-gota" cy="-2" r="4" fill="#f6ecdc"/>
              <path class="cafe-coracao" d="M0 25C-27 7 -30 -14 -15 -19C-7 -22 0 -16 0 -9C0 -16 7 -22 15 -19C30 -14 27 7 0 25Z" fill="url(#cel-leite)" stroke="#e8d3b2" stroke-width="1.5"/>
              <path d="M-26 -30A39 39 0 0 1 10 -37" fill="none" stroke="rgba(255,235,210,.28)" stroke-width="3" stroke-linecap="round"/>
            </g>
            <path d="M-38 -16A44 44 0 0 1 -8 -44" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
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
        <defs>
          <linearGradient id="cel-pino" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98a5c"/><stop offset=".5" stop-color="#d7a878"/><stop offset="1" stop-color="#9a6a43"/></linearGradient>
          <linearGradient id="cel-pap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8f0df"/><stop offset="1" stop-color="#ead9ba"/></linearGradient>
          <filter id="cel-fibra" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .2  0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
          <filter id="cel-tinta" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="2.5" xChannelSelector="R" yChannelSelector="G"/></filter>
          <pattern id="cel-hach" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="5" height="2.2" fill="#141210"/></pattern>
          <filter id="cel-somb2" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(40,30,20,.3)"/></filter>
        </defs>
        <path class="traco" d="M-96 -66Q0 -46 96 -66" fill="none" stroke="#6e5a44" stroke-width="4" stroke-linecap="round" style="--l:200;--t:.45s"/>
        <path d="M-96 -66Q0 -46 96 -66" fill="none" stroke="#a48a6c" stroke-width="1.6" stroke-dasharray="3 4" opacity=".7"/>
        <g class="cordel-folheto">
          <g filter="url(#cel-somb2)"><rect x="-50" y="-52" width="100" height="134" rx="4" fill="url(#cel-pap)"/></g>
          <rect x="-50" y="-52" width="100" height="134" rx="4" fill="#fff" filter="url(#cel-fibra)"/>
          <g filter="url(#cel-tinta)">
            <rect x="-38" y="-38" width="76" height="9" rx="1.5" fill="#141210"/>
            <rect x="-38" y="-24" width="76" height="70" rx="2" fill="#141210"/>
            <rect x="-38" y="-24" width="76" height="70" rx="2" fill="url(#cel-hach)" opacity=".0"/>
            <circle class="cordel-sol" cx="17" cy="-6" r="11" fill="#c8321e"/>
            <path d="M-38 46V20L-22 8L-8 18L8 2L24 16L38 6V46Z" fill="#f4ecdc"/>
            <path d="M-38 46V30L-22 22L-8 30L8 18L24 28L38 22V46Z" fill="url(#cel-hach)"/>
            <path d="M-30 46V30h12v16Z M-26 30l2-6 2 6Z" fill="#141210"/>
            <rect x="-38" y="54" width="54" height="6" rx="2" fill="#141210"/>
            <rect x="-38" y="66" width="40" height="6" rx="2" fill="#141210"/>
          </g>
          <rect x="-7.5" y="-67" width="15" height="27" rx="4" fill="url(#cel-pino)"/>
          <rect x="-1.5" y="-65" width="3" height="23" rx="1.5" fill="#6e4a2c"/>
          <circle cy="-56" r="3.2" fill="#c9ced3" stroke="#8d949b" stroke-width="1"/>
        </g>`,
    eclipse: () => `
        <defs>
          <radialGradient id="cel-sol" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#fff7d1"/><stop offset=".42" stop-color="#ffd23f"/><stop offset="1" stop-color="#f08c00"/></radialGradient>
          <radialGradient id="cel-coroa" r="50%"><stop offset=".5" stop-color="#fff4c2" stop-opacity=".95"/><stop offset=".68" stop-color="#ffc83d" stop-opacity=".6"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>
          <radialGradient id="cel-noite" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#1c2560"/><stop offset="1" stop-color="#070a22"/></radialGradient>
          <radialGradient id="cel-luaesc" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#1a2150"/><stop offset="1" stop-color="#080b24"/></radialGradient>
          <clipPath id="cel-ceu"><circle r="98"/></clipPath>
        </defs>
        <circle class="entra" r="98" fill="url(#cel-noite)"/>
        <g clip-path="url(#cel-ceu)">
          ${Array.from({ length: 22 }, (_, k) => { const a = k * 2.4, r = 30 + (k * 53) % 66; return `<circle cx="${(Math.cos(a) * r * 1.4).toFixed(1)}" cy="${(Math.sin(a) * r * 1.4).toFixed(1)}" r="${(k % 3 ? .9 : 1.5)}" fill="#fff" opacity="${(.35 + (k % 4) * .15).toFixed(2)}"/>`; }).join("")}
          <g class="ecl-coroa">
            <circle r="86" fill="url(#cel-coroa)"/>
            ${Array.from({ length: 16 }, (_, k) => `<path d="M0 -50L${k % 2 ? 2 : 3.5} ${k % 2 ? -68 : -80}L0 ${k % 2 ? -73 : -88}L${k % 2 ? -2 : -3.5} ${k % 2 ? -68 : -80}Z" transform="rotate(${k * 22.5 + 6})" fill="#fff1b8" opacity="${k % 2 ? .3 : .5}"/>`).join("")}
          </g>
          <circle class="entra" style="--d:.07s" r="48" fill="url(#cel-sol)"/>
          <g class="ecl-lua"><circle cx="3" cy="-3" r="46.5" fill="url(#cel-luaesc)"/><path d="M-30 -30A44 44 0 0 1 20 -42" fill="none" stroke="#3a4690" stroke-width="2.5" stroke-linecap="round" opacity=".7" transform="translate(3 -3)"/></g>
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
          <rect x="0" y="0" width="70" height="70" fill="#f4f1e8"/><rect x="0" y="0" width="70" height="70" fill="rgba(255,225,170,.14)"/>
          <g filter="url(#cel-mao)">
          <path d="M0 0H70V70A70 70 0 0 1 0 0Z" fill="#1f4fa3" opacity=".12"/>
          <path d="M0 0Q48 8 58 58Q8 48 0 0Z" fill="#1f4fa3"/><path d="M6 6Q40 14 50 50" fill="none" stroke="#3b72c9" stroke-width="3" opacity=".7"/>
          <circle cx="52" cy="18" r="7" fill="#3b72c9"/><circle cx="18" cy="52" r="7" fill="#3b72c9"/>
          <path d="M70 70m-20 0a20 20 0 0 1 20-20" fill="none" stroke="#1f4fa3" stroke-width="6"/></g>
          <path d="M8 30L20 34L30 26L44 30M20 34L18 50L28 62" fill="none" stroke="#3a3020" stroke-opacity=".28" stroke-width="1"/>
        </g></g>`;
      return `
        <defs><filter id="cel-mao"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
          <linearGradient id="cel-azb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
          <linearGradient id="cel-azm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a5bb0"/><stop offset="1" stop-color="#112f6b"/></linearGradient>
          <filter id="cel-azs" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="rgba(10,30,70,.35)"/></filter></defs>
        <g class="entra"><rect x="-86" y="-86" width="172" height="172" rx="14" fill="url(#cel-azm)" filter="url(#cel-azs)"/><rect x="-76" y="-76" width="152" height="152" rx="6" fill="#f4f1e8"/></g>
        <g transform="scale(1.086)">${q(180, .33)}${q(270, .53)}${q(0, .73)}${q(90, .93)}</g>
        <path d="M-76 0H76M0 -76V76" stroke="#e9ecef" stroke-width="3"/>
        <rect class="surge" style="--d:1.1s" x="-76" y="-76" width="152" height="152" rx="6" fill="url(#cel-azb)"/>
        <path class="surge" style="--d:1.1s" d="M-74 70V-74H70" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2.5"/>
        <circle class="entra" style="--d:1.2s" r="15" fill="#f4f1e8"/><circle class="entra" style="--d:1.27s" r="9" fill="#1f4fa3"/><circle class="entra" style="--d:1.3s" cx="-3" cy="-3" r="3" fill="#fff" opacity=".6"/>`;
    },
    quinhentos: () => {
      const nota = (y, r, d, r0, top) => `<g transform="translate(0 ${y}) rotate(${r})"><g class="pila-nota" style="--d:${d}s;--r0:${r0}deg">
          <rect x="-86" y="-48" width="172" height="96" rx="9" fill="url(#cel-nota${top ? "a" : "b"})" filter="url(#cel-ns)"/>
          <rect x="-86" y="-48" width="172" height="96" rx="9" fill="url(#cel-gui)"/>
          <rect x="-77" y="-39" width="154" height="78" rx="5" fill="none" stroke="#8d6cc0" stroke-width="2.4"/>
          <rect x="-77" y="-35" width="154" height="70" rx="3" fill="none" stroke="#c6b0e6" stroke-width="1" stroke-dasharray="2 2"/>
          ${top ? `<rect x="12" y="-48" width="7" height="96" fill="#d9c9ef" opacity=".7"/><path d="M-77 20c22-13 40 13 66 0s44 13 84-2" fill="none" stroke="#a384cf" stroke-width="6"/>
          <circle cx="-42" cy="-2" r="25" fill="#e6dbf4" stroke="#8d6cc0" stroke-width="2"/><circle cx="-42" cy="-2" r="20" fill="none" stroke="#b9a2df" stroke-width="1.2" stroke-dasharray="1.5 2"/>
          <text x="-42" y="7" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="22" fill="#6f4fa8">R$</text>
          <text x="38" y="24" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="62" fill="#3f2a6b" opacity=".25">5</text>
          <text x="36" y="22" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="62" fill="#5a3d8c">5</text>
          <path d="M-80 -42h40" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>` : ""}
        </g></g>`;
      return `<defs>
          <linearGradient id="cel-notaa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9b0e6"/><stop offset="1" stop-color="#a888cf"/></linearGradient>
          <linearGradient id="cel-notab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b294d8"/><stop offset="1" stop-color="#9273c0"/></linearGradient>
          <pattern id="cel-gui" width="40" height="16" patternUnits="userSpaceOnUse"><path d="M0 8Q10 0 20 8T40 8M0 12Q10 4 20 12T40 12" fill="none" stroke="#7b59b3" stroke-opacity=".18" stroke-width="1"/></pattern>
          <filter id="cel-ns" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(60,30,100,.3)"/></filter></defs>`
        + nota(28, 8, .1, -60, false) + nota(12, -6, .37, 40, false) + nota(-6, -2, .63, -30, true);
    },
    sanduba: () => {
      const poros = (y0, h) => Array.from({ length: 14 }, (_, k) => `<ellipse cx="${(-58 + (k * 37) % 116).toFixed(0)}" cy="${(y0 + 8 + (k * 13) % (h - 16)).toFixed(0)}" rx="${(1.6 + (k % 3) * .7).toFixed(1)}" ry="1.1" fill="#c9a160" opacity=".45"/>`).join("");
      const fatia = (y, topo) => `<g filter="url(#cel-ss)"><rect x="-72" y="${y}" width="144" height="46" rx="${topo ? "22" : "16"}" fill="url(#cel-casca)"/></g>
        <rect x="-66" y="${y + 5}" width="132" height="36" rx="${topo ? "18" : "12"}" fill="url(#cel-miolo)"/>${poros(y + 5, 36)}
        <path d="M-60 ${y + 4}H60" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/>`;
      const sand = `
          <g class="sando-cam" style="--d:.13s">${fatia(34, false)}</g>
          <g class="sando-cam" style="--d:.33s"><path d="M-74 31 q8 -9 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v10 H-74z" fill="#6aa646"/><path d="M-74 26 q8 -9 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v8 H-74z" fill="#9fce72"/>
            ${[-56, -24, 8, 40].map(x => `<path d="M${x} 24l6 6" stroke="#cfe8b0" stroke-width="1.6" stroke-linecap="round"/>`).join("")}</g>
          <g class="sando-cam" style="--d:.43s"><rect x="-70" y="16" width="140" height="10" rx="3" fill="#f5c84a"/><circle cx="-40" cy="21" r="2.4" fill="#e0ab26"/><circle cx="12" cy="20" r="2" fill="#e0ab26"/><circle cx="46" cy="22" r="2.4" fill="#e0ab26"/></g>
          <g class="sando-cam" style="--d:.53s"><rect x="-82" y="-12" width="164" height="42" rx="21" fill="#a8621e"/><rect x="-82" y="-12" width="164" height="32" rx="16" fill="url(#cel-file)"/>
            ${[-52, -22, 8, 38].map(x => `<path d="M${x} -6l14 22" stroke="#7a420f" stroke-width="4" stroke-linecap="round" opacity=".55"/>`).join("")}
            <path d="M-70 -6Q0 -14 70 -6" fill="none" stroke="rgba(255,220,160,.4)" stroke-width="3" stroke-linecap="round"/></g>
          <g class="sando-cam" style="--d:.73s">${fatia(-60, true)}</g>`;
      return `
        <defs><clipPath id="cel-esq"><rect x="-100" y="-100" width="100" height="200"/></clipPath><clipPath id="cel-dir"><rect x="0" y="-100" width="100" height="200"/></clipPath>
          <linearGradient id="cel-casca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ad62"/><stop offset="1" stop-color="#b97a36"/></linearGradient>
          <radialGradient id="cel-miolo" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#fff8e8"/><stop offset="1" stop-color="#f3e2bd"/></radialGradient>
          <linearGradient id="cel-file" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dd9a46"/><stop offset="1" stop-color="#bd7426"/></linearGradient>
          <filter id="cel-ss" x="-10%" y="-20%" width="120%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(90,50,10,.28)"/></filter></defs>
        <ellipse cx="0" cy="88" rx="78" ry="8" fill="rgba(80,50,20,.18)"/>
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
  // enquadramento de cada ícone: o ícone é o quadro final do desenho visto por esta viewBox [x, y, lado]
  const QUADRO = { novelo: [-106, -104, 212], cruzadinha: [-104, -104, 208], brigadeiro: [-108, -106, 216] };
  // congela o quadro final: as regras ".celebra …" deixam de valer quando o desenho sai do tabuleiro,
  // então cada peça leva consigo, em estilo próprio, a posição, o giro e a transparência em que parou
  function congela(svg) {
    const pecas = svg.querySelectorAll("*");
    const base = [...pecas].map(e => { const c = getComputedStyle(e); return [e, c.transformBox, c.transformOrigin]; });
    svg.getAnimations({ subtree: true }).forEach(a => { try { a.commitStyles(); } catch (e) {} a.cancel(); });
    base.forEach(([e, box, ori]) => { if (e.style) { e.style.transformBox = box; e.style.transformOrigin = ori; e.style.animation = "none"; } });
  }
  function passagem(ov) {
    const { el, svg, jogo } = espera, esm = espera.esm; espera = null;
    const modal = ov.querySelector(".modal"), slot = modal.querySelector(".fim-art > *");
    const de = svg.getBoundingClientRect();
    modal.style.animation = "none";                       // mede a posição final, sem a animação de abrir
    const para = slot ? slot.getBoundingClientRect() : null;
    modal.style.animation = "";
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches, T = reduz ? 1 : 520;
    if (!para || !para.width) {                           // sem lugar para pousar: o desenho só some
      el.style.animation = `cel-sai ${SAIDA}ms ease forwards`; setTimeout(() => el.remove(), SAIDA + 50);
      setTimeout(() => esm.forEach(e => e.classList.remove("cel-dim")), T); return;
    }
    congela(svg);
    // o voo tem o tamanho final da arte da janela: por baixo, uma cópia do ícone (que vai aparecendo);
    // por cima, o desenho, no lugar exato em que ele está dentro do ícone (mesmo enquadramento)
    const [qx, qy, ql] = QUADRO[jogo] || [-106, -106, 212];
    const S = para.width, H = para.height, u = S / ql;
    const voo = document.createElement("div");
    voo.className = "cel-voo";
    voo.style.cssText = `position:fixed;left:${para.left}px;top:${para.top}px;width:${S}px;height:${H}px;z-index:9999;pointer-events:none;transform-origin:0 0;`;
    const copia = slot.cloneNode(true);
    copia.style.cssText += `;position:absolute;left:0;top:0;width:${S}px;height:${H}px;margin:0;opacity:0;`;
    const caixa = document.createElement("div");
    caixa.style.cssText = `position:absolute;left:${(-100 - qx) * u}px;top:${(-100 - qy) * u + (H - S) / 2}px;width:${200 * u}px;height:${200 * u}px;`;
    svg.style.cssText = "display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 10px 24px rgba(30, 20, 10, .28));";
    caixa.append(svg); voo.append(copia, caixa); document.body.append(voo); el.remove();
    slot.style.visibility = "hidden";
    // começo: a caixa do desenho coincide com o desenho no tabuleiro
    const k0 = de.width / (200 * u);
    const cx = (-100 - qx) * u + 100 * u, cy = (-100 - qy) * u + (H - S) / 2 + 100 * u;
    const tx = de.left + de.width / 2 - para.left - k0 * cx, ty = de.top + de.height / 2 - para.top - k0 * cy;
    const curva = "cubic-bezier(.45, 0, .2, 1)";
    const va = voo.animate([{ transform: `translate(${tx}px, ${ty}px) scale(${k0})` }, { transform: "none" }], { duration: T, easing: curva, fill: "both" });
    // na segunda metade do voo o desenho vira o ícone: o ícone (com o fundo e a sombra) acende por baixo
    // e o desenho se apaga por cima, já do mesmo tamanho e no mesmo lugar
    copia.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T * .5, delay: T * .45, easing: "ease-out", fill: "both" });
    caixa.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T * .4, delay: T * .6, easing: "ease-in", fill: "both" });
    svg.animate([{ filter: "drop-shadow(0 10px 24px rgba(30, 20, 10, .28))" }, { filter: "drop-shadow(0 2px 4px rgba(30, 20, 10, 0))" }], { duration: T, easing: curva, fill: "both" });
    // a janela surge (escala + opacidade) em volta do desenho, que chega ao lugar da arte
    modal.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "none" }], { duration: T * .75, delay: T * .1, easing: "cubic-bezier(.2, .9, .3, 1)", fill: "backwards" });
    ov.animate([{ backgroundColor: "transparent", backdropFilter: "blur(0px)" }, {}], { duration: T * .7 });
    setTimeout(() => esm.forEach(e => e.classList.remove("cel-dim")), T);   // o tabuleiro só volta com o fundo da janela já por cima
    va.finished.then(() => { slot.style.visibility = ""; requestAnimationFrame(() => voo.remove()); });
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
          espera = { el, esm, svg: el.querySelector("svg"), jogo };
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
