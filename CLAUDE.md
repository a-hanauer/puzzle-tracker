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
- **Painel**: jogos da casa em lista (desde 04/11/2026), não em grade; desde 05/11/2026 um cartão por jogo, igual aos outros jogos
  (ícone 46px e o mesmo círculo à direita nas duas listas). O nível do dia aparece uma vez só, sob o
  título (`#diaNivel`: "quinta, 5 nov · nível 4 de 7" + pontinhos); os cartões não têm pílula de nível antes de jogar. Nunca rola para o lado. Grades com `minmax(0, 1fr)` (nunca `1fr` puro) e `html, body { overflow-x: clip }`;
  conferir em 320–430 px que `document.documentElement.scrollWidth === innerWidth`.
- **Área segura**: respeitar `env(safe-area-inset-*)` em cima (notch) e embaixo (barra de gestos).

## Nuvem e ranking com amigos (Firebase, desde 09/11/2026)

- Projeto Firebase **Puzzle Tracker** (`puzzle-tracker-c683a`, Firestore em southamerica-east1; app web "Jogos do Dia").
  Login anônimo (sem cadastro, criado ao entrar no Ranking) + e-mail/senha opcional para outro aparelho.
  Regras em `firestore.rules` (cópia; publicar pela ferramenta do Firebase). **Cuidado**: a ferramenta do Firebase no Mac
  guarda o projeto ativo por pasta e o mesmo usuário tem o projeto **Nightrun** (`nightrun-3a57c`, pasta /tmp): publicar
  sempre a partir de /var/tmp com o projeto ativo conferido (`firebase_get_environment`) antes do deploy.
- `nuvem.js` (módulo, SDK 10.14.1 do gstatic; só o painel carrega): copia para `users/{uid}/prog/{chave}` as chaves dos
  jogos (os prefixos do backup, `BK_PREFIXOS`) e traz o que mudou em outro aparelho; se mudou dos dois lados, junta
  (partida terminada vale mais; Gerânio soma as achadas; o estado do painel soma histórico e resultados — `fundirPainel`).
- Ranking (página `#ranking`, botão de troféu no topo; opção "A": um cartão por jogo, Hoje | Semana, dias anteriores):
  grupos por código de 6 letras (`grupos/{cod}`, membros e apelidos); cada resultado vai para `grupos/{cod}/res/{dia_jogo_uid}`
  (`resultadosParaRanking`, retroativo até 2 anos: lê os dias que cada jogo da casa guardou — `eclipse:dia:N`, `sanduba-daily-…` — e
  completa com `state.results`; ao entrar ou entrar em outro grupo, manda o histórico todo). Critério: Gerânio pontos; Sando e 5PILA
  tentativas (quem não acertou vai para o fim); Brigadeiro inclinações; os da casa, tempo; os de fora, o tempo fora do app
  (aproximado, "~"). Sempre mostra quem usou dica (💡). Semana: mais 1º lugares, depois mais jogos.
- Configurações → Conta na nuvem: apelido, última sincronização, ligar e-mail e senha, entrar numa conta com e-mail.

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
- 5PILA: desde 29/10/2026 a palavra do dia sai de `COMUNS` (só uso comum; nada de regionalismo, conjugação, feminino de
  adjetivo, estrangeirismo ou palavra pesada).
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

## Gerânio (jogo de palavras no estilo Spelling Bee, desde 04/11/2026; chamou-se Girassol até 05/11/2026)

- **Versão 6.2 (em teste, desde o #3 = 06/11/2026):** flor de **5 pétalas** (6 letras); palavras do dia = só **verbetes** de
  dicionário de uso corrente (`geranio/verbetes.json`, feito por `geranio/verbetes.py`: verbete minúsculo do VERO, verbo no
  infinitivo, sem plural/feminino flexionado/conjugação; grafia exata com icf ≤ 14 ou no Cordel; sem estrangeirismos,
  `nomes-proprios.txt` e lugares). Desde 07/11/2026 entram também as palavras do `lexico` do fserb com icf ≤ 14 (o VERO não
  traz como verbete muitas palavras de base que gera por regra: corda, faca, carne, dedo, roda, casa), sem plurais e sem
  conjugação pura (gerúndio, ou forma bem menos usada que o próprio verbo: fico, toma, anda saem; cedo, entre, casa, nada ficam);
  Desde 08/11/2026: do léxico só entra o que o VERO conhece com a mesma grafia (tira paper e outros estrangeirismos), e
  municípios só ficam fora se pouco usados como palavra (icf > 11,3: pedra, escada, recife voltam; piracicaba não); a
  conjugação sai se não for ao menos meio ponto de icf mais usada que o verbo (busca, venda, volta, troca entram);
  estrangeirismos e nomes achados cruzando com o hunspell de inglês em `nomes-proprios.txt`.
  Uso corrente (08/11/2026): icf ≤ 12, ou icf ≤ 14 e ≥ 30 ocorrências nas legendas pt-BR do OpenSubtitles
  (github.com/hermitdave/FrequencyWords, `pt_br_full.txt`, 5º argumento de verbetes.py); a faixa incerta (icf 12–14, até 6
  letras diferentes, ~3,9 mil) foi revista à mão: nomes, grafias de Portugal, termos técnicos, prefixos e conjugações que
  passavam ficam em `nomes-proprios.txt` (parra, deca, gajo, autocarro). ~9,8 mil palavras.
  Os dias já publicados guardam as letras e a lista é refeita (`refaz` no gerador).
  Todo o resto do vocabulário continua valendo como rara (+50%). Listas: seg 10–14 … dom 33–50.
  Pangrama: + 1 ponto por letra da flor. A página desenha quantas pétalas o desafio tiver (os #1 e #2 têm 6).
  **Meta** (05/11/2026, escolha "pontos de N palavras"): Gerânio = pontos de N palavras do dia médias (pontos possíveis ÷
  tamanho da lista), N pelo nível: 10, 11, 13, 15, 17, 19, 22 (seg → dom), no máximo os pontos possíveis; os outros níveis são
  frações da meta (as mesmas de antes). Rara vale +50% (arredondado para cima). Os #1 e #2 seguem 35% e raras em dobro.
  **Grafia** (`geranio/grafia.py`, 05/11/2026): a jogada é a sequência de letras sem acento (vale e conta uma vez). Para mostrar:
  a grafia mais usada (icf exato: vídeo, século, colônia — não a versão sem acento da internet); palavra do dia = a grafia do
  verbete (verbetes.py: icf exato ≤ 14 ou como o Cordel escreve: jogo, não jogó; sem grafias pré-Acordo como pára); se outra
  grafia da mesma chave é outra palavra corrente (icf ≤ 12,3, no `lexico` do fserb, não verbo nem nome próprio), as duas com
  " · ", a mais usada antes (país · pais, março · marco, metro · metrô). `palavras.txt` guarda a grafia (as raras aparecem
  acentuadas); duas grafias = duas linhas seguidas. Ordem: verbetes.py → grafia.py → gerador.mjs.
  **Versão 6.1** (7 letras, palavras do dia = comuns + flexões, base.json/comuns.mjs) guardada no ramo `geranio-6.1`.

- Pasta `geranio/` desde 05/11/2026 (`girassol/` só redireciona). O id (`girassol`) e as chaves salvas (`girassol:`) ficaram
  com o nome antigo, para não perder progresso.
  Cores (opção "A"): pétalas vermelhas (#e2433f / escuro #d93a37) com letras brancas, miolo amarelo (#f6d77a) com letra
  vinho; no painel, cartão rosado (#f7cdc6 / escuro #3c2220). Último nível da régua e "pleno" = "Gerânio". Celebração e
  ícone (opção "A"): duas folhas de gerânio (recortadas, com o anel escuro) e a flor com as pétalas do jogo em degradê, nervuras,
  brilho na borda e estames no miolo; sombra embaixo, no estilo dos outros ícones (comum/celebra.js, ARTE.girassol).

- 7 letras numa flor simples: 6 pétalas em gomo (escolha "mais redonda", 05/11/2026) em volta do miolo liso com um
  pontilhado (a letra obrigatória). Pétala: laterais paralelas (fresta de largura constante), borda de dentro no arco do miolo,
  ponta de fora numa curva contínua tangente às laterais; cantos de dentro arredondados de leve pelo traço. As pétalas são
  calculadas já giradas (sem `transform`). Régua = barra fina contínua; barra das achadas só em texto.
  Palavras de 4+ letras, letras podem repetir; acentos e ç não contam. Pontos: 4 letras = 1, mais longa = 1 por
  letra, pangrama (as 7 letras) +7. Sem cronômetro: o resultado são os pontos.
- **Vale toda palavra que existe** (não se julga se é comum — isso só muda os pontos): dicionário `geranio/palavras.txt` =
  hunspell pt-BR do LibreOffice (VERO) expandido em todas as flexões por `geranio/dicionario.py` (só palavras com até 7 letras
  diferentes; todas as flexões e conjugações), **sem estrangeirismos** (regra `ESTR`: k/w/y, consoantes dobradas, sh/th/ph/ck,
  "s"+consoante no começo, final em consoante estranha; mais a lista `ESTRANG`, achada cruzando com o hunspell de inglês) e
  **sem nomes próprios** (maiúsculas fora; os que o VERO traz em minúsculas — países, nomes de gente — na lista `NOMES`),
  menos palavrões (`bloq` em desafios.json). Tudo isso sai já no verbete, com plurais e flexões. As **palavras do dia** (comuns + flexões: `geranio/base.json`, feito por
  `geranio/comuns.mjs` — respostas do Cordel, palavras frequentes do fserb/pt-br sem nomes/estrangeirismos (`STOP`), qualquer forma
  do VERO com icf ≤ 12,5 (teia, dita, tina), verbetes minúsculos do VERO até icf 13,5 (a frequência da internet subestima substantivos: anta, nata, tear), conjugações frequentes e o
  plural/feminino de cada uma pelas regras do VERO; grafia pelo VERO) medem a régua, o "pleno" e as dicas. Palavra válida fora
  delas é **rara** e vale o **dobro** (escolha do dono: premiar vocabulário).
- Dois jeitos de jogar (casual = meta; completista = todas), régua em **duas fases** (opção "A", 05/11/2026): até Gerânio, régua
  de pontos com uma marca por nível e "faltam N pts para Gerânio · próximo: X em M"; depois de feito, a régua fica amarela e
  conta as palavras do dia ("Gerânio ✓ · 49/131 · rumo ao pleno · faltam 82 palavras · +N raras"). Tela de fim: "N de T palavras
  do dia (P%)"; pílula do painel "✓ pts · P%"; ao fechar um tamanho, "todas de N letras!".
- Níveis: Semente, Broto, Muda, Botão, Flor, Gerânio (2/5/12/22/35% dos pontos das palavras do dia). Chegar a Gerânio = dia
  feito (celebração + bandeja de fim, só essa vez); continua até achar todas as do dia ("pleno" = troféu no painel e um aviso, sem nova celebração). Depois de feito
  não aparece a faixa de fim embaixo (a flor não encolhe): a régua ganha uma setinha e reabre a bandeja de fim.
- Dicas na barra das achadas, com chave Resumo | Grade (a escolha fica guardada): Resumo = quadradinhos por tamanho
  (achadas/total, em vermelho; as raras entram como quadradinhos a mais, em amarelo (--rara), com "+N" — toda palavra achada aparece) e quantas faltam por letra inicial; Grade = tabela letra inicial × tamanho (faltam) e começos de duas letras; a lâmpada
  (uma por dia) dá começo (2 letras) e tamanho da mais curta que falta. Também mostra as palavras de ontem.
- No tabuleiro (opção "C", 07/11/2026): junto de cada letra, um número pequeno = palavras do dia que faltam começando por ela
  (✓ quando fecha; segue a letra ao embaralhar); embaixo da flor, pílulas com os começos de duas letras que faltam (só os que
  faltam; até 3 linhas, 2 em tela baixa, com rolagem).
- Botões (opção "A", 07/11/2026): só ícones redondos nos cantos da flor, na altura da base/topo da flor (`--folga`, calculada
  em `fit()`); 46px em tela baixa. Embaixo: apagar à esquerda (claro), enviar à direita (escuro). Em cima (08/11/2026):
  embaralhar à esquerda; à direita, o olho que liga/desliga as dicas do tabuleiro (números nas letras, ★, pílulas e começo
  vivo; `body.sem-dicas`, guardado em `girassol:dicas-tabuleiro`). A barra de espaço também embaralha.
- Começo vivo (07/11/2026): enquanto digita, com 1–2 letras, uma linha sob a palavra diz quantas do dia faltam com esse começo e
  os tamanhos ("DE… 3 faltam: 8, 9 (×2) letras"; nunca com 3+ letras); a pílula do começo acende e as outras apagam. ★N no alto
  do miolo = pangramas do dia que faltam (some quando acaba).
- `geranio/gerador.mjs`: flores a partir de pangramas das palavras do dia; nível = dia da semana pelo tamanho da lista (seg 30–45 …
  dom 105–150); as mesmas 7 letras não voltam em 150 dias; o miolo não repete o do dia anterior. Dias já publicados guardam as
  letras (a lista é refeita; o que o jogador achou passa para o lado certo — do dia ou rara — e nunca some). Jogo livre: `livre[nível]`.
