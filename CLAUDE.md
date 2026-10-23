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
- Sando e 5PILA: o desafio do dia segue a semana pelas tentativas: seg–ter Fácil (20 / 10), qua–sex Normal (14 / 8),
  sáb–dom Difícil (10 / 6). Partida já começada guarda o seu `max`.
- Cordel: desde #20 (23/10/2026) é no estilo do Wend (LinkedIn): tabuleiro em pé, com forma sorteada (retângulo, cruz, losango,
  ampulheta, vaso, escada, ferradura, anel, halteres, zigue-zague, degraus; não repete de um dia para o outro; desde #21
  — o #20 é 6×6) e estrelas de cordel desenhadas à mão, cada uma diferente (casas bloqueadas); fora da forma não se desenha nada (só as letras mostram o contorno);
  a semana sobe de 27–31 letras (seg) a 45–50 (dom) (desde 24/10/2026; antes 19–23 a 42–48); as letras se dividem em palavras ligadas na horizontal, vertical ou diagonal (dois traços diagonais não se cruzam), todas
  usadas uma vez; palavra achada = bloco entalhado cheio, numa curva suave pelo rastro (sem contorno), borda de goiva, pontinhos de
  falha e lascas de goiva (pontudas nas duas pontas) na direção do traço; blocos e estrelas são pintados direto num canvas 2D,
  na hora e sem filtros SVG (filtros pesavam e piscavam no iPhone), com semente fixa por palavra; letras por cima em SVG vivo, em Caesar Dressing (`cordel/fontes`, OFL); embaixo, uma
  etiqueta com o tamanho de cada palavra. Palavras de resposta em `cordel/respostas.json` (comuns: substantivos e
  adjetivos no masculino singular e verbos no infinitivo; sem nomes próprios, plurais, conjugações). `cordel/gerador.mjs`
  confere com `alternativas.json` (lista larga, com plurais e conjugações) que a divisão é única e sai sem chute (sempre
  há uma casa que só cabe numa palavra). Dica comum (uma por dia): começo e fim da próxima palavra. O formato de temas
  ficou em `gerador-temas.mjs`/`temas-novos.mjs` (até o #19).
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

- Inclinar a assadeira (7 × 8): cada seta faz TODOS os brigadeiros rolarem juntos até bater (chocolate, borda, outro doce,
  forminha cheia). O doce cai na forminha da cor do seu granulado ao passar por ela; forminha de outra cor não segura.
  (Começou como "empurrar caixas" com colher de pau; trocado no mesmo dia, ano todo refeito.)
- Visual: assadeira de alumínio, papel-manteiga, paredes de barra de chocolate, forminhas rosa/azul/amarelo/verde;
  ícone e fim = um brigadeiro caindo na forminha rosa. Setas no formato do teclado físico (Desfazer ↑ Recomeçar / ← ↓ →);
  seta apagada = não mexe nada.
- `brigadeiro/motor.mjs` (inclinar + busca em largura do mínimo de inclinações) serve o gerador e a dica da página.
- `brigadeiro/gerador.mjs`: sorteia paredes, forminhas e doces e resolve. Desde 22/10/2026 a semana vai de 3 doces e 4–6
  inclinações mínimas na segunda (o antigo nível 3) a 4 doces e 10–13 no domingo; sábado e domingo como antes.
  A dica faz a próxima inclinação ótima; se travou, volta até ter saída.
