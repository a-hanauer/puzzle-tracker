# Jogos do Dia — notas para quem mexe no código

## Alvo principal: app instalado na tela inicial do iPhone

O dono usa **sempre** o painel instalado na tela inicial do iPhone (PWA em modo standalone).
Otimize, teste e decida pensando nesse modo primeiro; navegador comum é secundário.

O que muda nesse modo (já tratado no código, manter ao mexer):

- **Links externos** abrem numa janela por cima do app, e a página de baixo **não** recebe
  `visibilitychange`. Para perceber a volta: relógio que "pula", `focus` e o primeiro toque
  (`index.html`, bloco "Tempo nos jogos externos").
- **Bandejas e janelas fixas**: o iPhone recorta o que é `position: fixed` perto da borda de baixo;
  `comum/tema.js` solta as bandejas (`.overlay`, `.sheet-bg`) e trava a rolagem enquanto estão abertas.
- **Vibração** (`comum/tema.js`, `<label data-haptic-trigger>`): não recriar o botão durante o próprio
  toque; rodar a ação em `setTimeout(…, 0)`.
- **Telas dos jogos** (`<html data-fixa>`): sem zoom e sem rolar a página.
- **Painel**: nunca rola para o lado. Grades com `minmax(0, 1fr)` (nunca `1fr` puro) e `html, body { overflow-x: clip }`;
  conferir em 320–430 px que `document.documentElement.scrollWidth === innerWidth`.
- **Área segura**: respeitar `env(safe-area-inset-*)` em cima (notch) e embaixo (barra de gestos).

## Consistência visual (muito importante)

- Reaproveitar sempre os componentes comuns em vez de desenhar de novo em cada jogo:
  cabeçalho (`comum/cabecalho.css/js`), dica (`comum/dica.js`), fim de jogo, e o **teclado**
  (`comum/teclado.js` → `ghTeclado`, estilo `.gh-kb` em `cabecalho.css`, o mesmo do 5PILA e do Sando).
  Cada jogo só troca as cores (`--kb-bg`, `--kb-ink`, `--kb-dim`).

## Publicar

1. Subir a versão do cache em `sw.js` (`const CACHE = "jogos-do-dia-vN"`).
2. Se mudar algo em `comum/`, subir o `?v=` dos scripts/estilos em todos os HTML.
3. Commit em português; `git push origin HEAD:main` (o GitHub Pages publica sozinho).

## Jeito de trabalhar

- Conversa em português.
- Mudança visual: mostrar prévia (390×844, claro e escuro) com opções e esperar a escolha.
- Desafios dos jogos de lógica: nunca exigir chute; os já publicados (até hoje) não mudam.

## Conteúdo dos jogos de palavras

- Público: gente com boa formação. Preferir conhecimentos gerais densos (história, artes, ciência,
  literatura, música, geografia, mitologia) a temas infantis; bichos, expressões e gramática só de vez em quando.
- `comum/acervo.mjs`: temas do Cordel (campo `c`; os campos da Panelinha, que saiu, ficaram). Área (`a`) para o rodízio;
  família (`f`) para não pôr dois temas parecidos no mesmo dia.
- Ponto Cruz (pasta `cruzadinha`): desde 16/10/2026 é um **sudoku 6×6 de dados** (blocos 2×3), faces do dado em
  ponto-cruz, uma cor de linha por dado, do frio ao quente (`--d1`…`--d6`: roxo, azul, turquesa, verde, laranja, vermelho); o erro não usa cor: tecido riscado e moldura tracejada na linha escura; as reveladas
  ganham um quadradinho de tecido tingido e ponto mais grosso; anotações em mini dados.
  `cruzadinha/gerador.mjs`: solução única e só lógica, com um resolvedor "de gente". Pouca anotação: de segunda a
  sexta quase tudo sai olhando (a dificuldade vem de menos casas e de casas mais escondidas, com poucas à vista por vez);
  sábado pede um lance à frente ("apontar"), domingo dois (no máximo). Nada mais longo que isso, e sem memória:
  o resolvedor refaz as possibilidades a cada casa (o lance vale só para achar a próxima casa, como quem não anota).
  As palavras cruzadas antigas foram descartadas.

## Brigadeiro (no lugar da Panelinha desde 17/10/2026)

- "Empurrar caixas": a colher de pau empurra brigadeiros até as forminhas numa assadeira 7 × 8; paredes são barras de chocolate.
  Visual: papel-manteiga, forminhas de festa (rosa, azul, amarelo, verde); ícone e fim = um brigadeiro caindo na forminha rosa.
- `brigadeiro/motor.mjs` (resolvedor por empurrões mínimos, casas mortas) é usado pelo gerador e pela dica da página.
- `brigadeiro/gerador.mjs`: sorteia o tabuleiro, põe os doces nas forminhas e "desfaz" o jogo puxando (busca em largura), então
  todo desafio tem solução e o mínimo de empurrões é exato. A semana sobe em doces (2 → 4) e empurrões mínimos (≈7 → 36).
- Jogar: tocar numa casa leva a colher; tocar no doce encostado (ou mais adiante na linha) empurra; deslizar anda/empurra.
  A dica faz o próximo empurrão ótimo e, se o jogo travou, volta até o último ponto com saída.
