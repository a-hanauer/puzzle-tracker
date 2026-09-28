# 🧩 Jogos do Dia

Um painel simples, pensado para o celular, para acompanhar os word games diários sem precisar manter um monte de abas abertas.

Tudo roda em arquivos estáticos, sem dependências, build ou servidor.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O painel |
| `manifest.json` | Nome, cores e ícones do app instalado |
| `sw.js` | Deixa o painel instalável e funcionando offline |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Ícones do app (Android e computador) |
| `apple-touch-icon.png` | Ícone da tela inicial do iPhone |
| `sando/` | O jogo Sando — antes Sanduba e depois Misto (`index.html`, `icon-claro.png` e `icon-escuro.png`); `sanduba/` e `misto/` só redirecionam para lá. Visual igual ao dos outros jogos da casa: superfícies lisas com sombra suave, sem contornos escuros, e o teclado do 5PILA |
| `5pila/` | O jogo 5PILA (antigo Quinhentos; `quinhentos/` só redireciona) (`index.html` + `icon.png`) |
| `eclipse/` | O jogo Eclipse: `index.html`, `icon.png`, `desafios.json` (2 anos de desafios), `livre.json` (jogo livre) e `gerador.mjs` |
| `novelo/` | O jogo Novelo: `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `azulejo/` | O jogo Azulejo (antigo Retalhos; `retalhos/` só redireciona): `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `cortado/` | O jogo Cortado (antigo Pingado; `pingado/` só redireciona): `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `comum/` | Partes comuns: cabeçalho e janelas dos jogos (`cabecalho.css`, `cabecalho.js`) e tema geral (`tema.js`) |

## Jogos incluídos

| Jogo | Link |
|---|---|
| 🟩 Termo | https://term.ooo/ |
| 🎵 Spotle | https://spotle.io/ |
| ↕️ Betweenle | https://betweenle.com/ |
| 🥪 Sando | [`sando/`](sando/) (neste repositório) |
| 🔢 Word500 | https://word500.com/ |
| 💵 5PILA | [`5pila/`](5pila/) (neste repositório) |
| 🦊 Foximax | https://foximax.com/ |
| 💼 LinkedIn (app) | https://www.linkedin.com/games/ |
| 🌗 Eclipse | [`eclipse/`](eclipse/) (jogo próprio, neste repositório) |
| 🧶 Novelo | [`novelo/`](novelo/) (Zip em português, neste repositório) |
| 🟦 Azulejo | [`azulejo/`](azulejo/) (Patches em português, neste repositório) |
| ☕ Cortado | [`cortado/`](cortado/) (Tango em português, neste repositório) |

## Como funciona

- **Destaque para o que falta:** jogos pendentes aparecem em cartões cheios; os concluídos ficam esmaecidos (sem cartão, ícone acinzentado, check neutro). Na lista dos outros jogos, os pendentes ficam sempre no topo.
- O **topo** mostra o nome do produto ("Jogos do Dia") em destaque, os botões de **estatísticas** e **configurações** e, logo abaixo, a **barra de progresso do dia**: um trecho por jogo, que fica verde conforme os jogos são feitos, com o contador ("3/9") à direita, no mesmo estilo dos contadores das seções. Quando todos estão feitos, os trechos se fundem numa barra verde contínua, um brilho passa por ela uma vez e o contador vira o selo "✓ Tudo feito" (não há mais mensagem no pé da página). A sequência de dias fica na página de estatísticas.
- **Jogos da casa** (Sando, 5PILA, Eclipse, Novelo, Azulejo e Cortado) aparecem numa grade de cartões pintados com a cor de fundo do próprio ícone (o ícone se funde ao cartão). Todos os ícones têm fundo liso, sem degradê. Cada jogo tem o seu matiz (Sando amarelo-manteiga, 5PILA verde, Eclipse índigo, Novelo rosado, Retalhos azul-claro, Cortado pêssego), todos com a mesma saturação e luminosidade — no claro, 60% e 86% (o Cortado um pouco mais fundo, para a xícara branca aparecer); no escuro, 30% e 18%. Cada jogo tem ícone claro e escuro (`icon-claro.png` / `icon-escuro.png`, campo `iconDark` no catálogo), para os cartões ficarem todos claros no tema claro e todos escuros no tema escuro, sem contraste gritante; **outros jogos** (sites externos) aparecem numa lista com ícone, nome, descrição e um check. A ordem é sempre a mesma, e cada seção mostra quantos já foram feitos hoje.
- **Status de cada jogo:**
  - **Outros jogos:** o check à direita marca ou desmarca; abrir o jogo pelo painel já marca como feito.
  - **Jogos da casa:** um anel no canto enche a cada tentativa e vira um ✔ verde quando a partida termina, com vitória ou derrota. Embaixo do nome aparece o andamento ("3/14") ou o resultado (✓ 5/8, ✕ 8/8, ou o tempo com cronômetro no Eclipse, no Novelo, no Retalhos e no Cortado).
- Jogos feitos ficam com fundo verde claro.
- A lista **zera sozinha à meia-noite**, no horário do aparelho.
- As **Configurações** são uma página própria (`#configuracoes`), com título e voltar: **tema** (Automático, Claro ou Escuro; vale também para os jogos da casa), como abrir os jogos externos, gerenciar jogos e desmarcar os externos do dia.
- O link do LinkedIn sempre abre na mesma aba, o que faz o celular abrir o app do LinkedIn quando ele está instalado.
- Em **configurações**: abrir jogos externos na mesma aba (padrão) ou em nova aba, desmarcar os jogos externos do dia (pede um segundo toque para confirmar) e, no app do iPhone, ativar o número de pendentes no ícone.

O progresso fica salvo no `localStorage` do navegador, então é separado em cada aparelho e navegador. Limpar os dados do site apaga o histórico.

## Estatísticas

O botão de gráfico no cabeçalho (ao lado das configurações) abre a página **Estatísticas** (`#estatisticas`), que ocupa a tela toda e tem seu próprio título e botão de voltar (o voltar do sistema também funciona). Ela mostra:

- **Resumo:** sequência atual, melhor sequência, dias completos e quanto foi feito no período escolhido.
- **Atividade:** um só quadro com o período escolhido no controle (**7 dias**, **30 dias** ou **12 semanas**). Em 7 e 30 dias, barras por dia; em 12 semanas, o calendário que fica mais verde conforme os jogos feitos. Tocar num dia mostra quais jogos você fez e os resultados. Embaixo, **Por jogo**: em quantos dias do período você fez cada jogo.
- **Jogos da casa:** um só quadro, com um controle para trocar entre os jogos da casa (só o selecionado mostra o nome; os outros, só o ícone): estatísticas do próprio jogo, tentativas (ou tempo) por dia e, no 5PILA, vitórias por número de tentativas.

O painel guarda até 2 anos de histórico no navegador. Partidas antigas do Sando são recuperadas automaticamente; os resultados diários do 5PILA passam a ser registrados a partir desta versão.

## Adicionar ou remover jogos

**Pelo próprio painel (cada pessoa, no seu aparelho):** toque em **Adicionar jogo**, no fim de "Outros jogos", ou em configurações → **Gerenciar jogos**.
- **Adicionar:** cole o link de qualquer jogo (pode ser só o endereço, como `wordle.com`); o nome é sugerido a partir do endereço e pode ser trocado. O ícone é buscado automaticamente no site.
- **Ocultar:** os jogos que vêm no painel (da casa e externos) podem ser ocultados e reexibidos pelo ícone de olho. Colar o link de um jogo oculto também o traz de volta.
- **Excluir:** os jogos adicionados podem ser excluídos pela lixeira (com um segundo toque para confirmar).
- Jogos ocultos saem do painel, da contagem do dia e da sequência. A lista fica salva no navegador de cada aparelho.

**Para mudar os jogos que vêm no painel para todo mundo,** edite o array `BASE_GAMES` em `comum/catalogo.js` (compartilhado pelo painel e pelos jogos):

```js
{ id: "novojogo", name: "Novo Jogo", emoji: "🎯", desc: "Descrição curta", url: "https://exemplo.com/" },
```

- `id`: identificador único. Não mude depois de criado, porque o progresso é salvo por ele.
- `name`, `emoji`: o que aparece na grade. O emoji é a reserva caso o ícone do site não carregue.
- `desc`: descrição curta, mostrada ao passar o mouse.
- `url`: endereço do jogo, ou o nome da pasta para jogos que moram neste repositório (ex.: `"misto/"`).
- `icon` (opcional): URL de um ícone específico, no lugar da busca automática.
- `iconFull: true` (opcional): o ícone ocupa o quadrado inteiro (bom para ícones com fundo próprio).
- `app: true` (opcional): mostra a etiqueta "APP" e sempre abre na mesma aba, para o celular repassar o link ao aplicativo.

## Jogos dentro do repositório

O Sando e o 5PILA rodam direto daqui, cada um na sua pasta:

- https://a-hanauer.github.io/puzzle-tracker/misto/
- https://a-hanauer.github.io/puzzle-tracker/quinhentos/

Cada jogo tem um botão **‹** à esquerda do logotipo que volta para o painel. Ele é essencial no app instalado no iPhone, que não mostra o botão "voltar" do navegador.

A interface dos jogos nativos (Sando, 5PILA, Eclipse, Novelo, Azulejo e Cortado) segue o mesmo padrão, definido em `comum/cabecalho.css`: ‹ voltar, ícone e nome do jogo e **?** com as regras; embaixo, a data do dia (e, no jogo livre, o nível e "‹ Desafio do dia"). Não há configurações nem telas de estatísticas dentro dos jogos; o tema é o escolhido no painel. As janelas (Como jogar, fim de jogo, confirmações) também seguem o mesmo padrão: sobem de baixo como uma bandeja presa à borda da tela (inclusive no app instalado no iPhone), com o ✕ sempre visível no topo, e fecham ao tocar no fundo. A bandeja de fim de jogo tem a mesma estrutura em todos: ✕, arte do jogo, título ("… completo!" ou "Não foi dessa vez"), resultado (no desafio do dia, com um ícone discreto de compartilhar ao lado), linha de detalhe, **Jogar outro** (jogo livre), contagem para o próximo desafio e **Próximo jogo**. Quando a partida termina, o que era de jogar sai da parte de baixo e fica uma faixa com o ícone, o resultado e "ver resultado" (ou "jogar outro", no jogo livre), com a contagem para o próximo desafio embaixo: nos jogos de lógica, ela ocupa o lugar dos controles; no Sando e no 5PILA, o lugar do teclado (componente `ghFim` em `comum/cabecalho.js`). As estatísticas continuam sendo gravadas pelos jogos e aparecem nas **Estatísticas** do painel.

As estatísticas e sequências dos jogos continuam valendo: o navegador guarda o progresso por domínio, e todos os endereços ficam em `a-hanauer.github.io`.

Para atualizar um desses jogos, substitua o `index.html` da pasta dele.

Como o painel lê o que esses jogos salvam no navegador, o estado deles é sempre o da partida do dia, e "Desmarcar jogos externos de hoje" não mexe neles. A leitura depende das chaves que cada jogo usa para salvar (`sanduba-daily-AAAA-M-D` — o Sando guarda com o nome antigo, id `sanduba` e `quinhentao:game:padrao`); se elas mudarem num jogo, ajuste `LOCAL_PROGRESS` em `comum/catalogo.js`.

**Teclado padrão:** os jogos com teclado usam as mesmas medidas (altura, espaçamentos, raio, tamanho da letra e do ENTER), definidas como variáveis `--kb-*` em `comum/cabecalho.css`; cada jogo mantém suas cores, bordas e sombras.

**Dificuldade no jogo livre (todos os jogos):** no jogo livre, a linha de cima mostra "Extra · [dificuldade ▾] [↻]" (componente `ghNivel` em `comum/cabecalho.js`). Nos jogos de lógica (Eclipse, Novelo, Retalhos, Cortado) a dificuldade é o nível de 1 a 7; nos de palavras, o número de tentativas — Sando: Fácil 20, Normal 14, Difícil 10; 5PILA: Fácil 10, Normal 8, Difícil 6 (o desafio do dia continua com 14 e 8). A escolha fica guardada no aparelho; ↻ sorteia outro.

**Fim de jogo e próximo jogo** (`comum/proximo.js`): quando a partida termina, a parte de baixo mostra, um embaixo do outro, a faixa de resultado (tocar abre a bandeja), o atalho discreto "↻ Jogar um extra · nível N" ("Jogar outro", no jogo livre) com a contagem para o próximo desafio ao lado, e, à direita da faixa, o botão do próximo jogo pendente (ícone com "Próximo" embaixo e uma seta; nos jogos da casa, o botão inteiro tem a cor do cartão desse jogo no painel — campo `cor` em `comum/catalogo.js`; nos externos, painel neutro com o ícone num quadradinho) (na ordem do painel: jogos da casa, depois os outros; abrir um externo por ali já o marca como feito). Sem jogo pendente, essa faixa não aparece. A bandeja de resultado tem o mesmo atalho junto do resultado e, no pé, a contagem (esquerda) e o próximo jogo (direita). Ao abrir um jogo já terminado, a bandeja não abre sozinha: só pelo toque na faixa (ou ao terminar a partida). Não há mais chave "Jogo livre" nem botão de próximo jogo no cabeçalho: o jogo livre começa pelo atalho, e lá a linha de cima mostra "Extra · [nível ▾] [↻]" e "‹ Desafio do dia" para voltar.

## Eclipse

Jogo de lógica próprio, na linha do Queens, com dois símbolos:

- Cada **linha**, cada **coluna** e cada **região colorida** tem exatamente **um sol ☀️ e uma lua 🌙**.
- Nenhuma peça pode **encostar** em outra, nem na diagonal.
- De 1 a 3 peças já começam reveladas.

Joga-se **um símbolo de cada vez**, como dois Queens sobrepostos, com a chave **Sol / Lua** embaixo do tabuleiro:
- no **modo sol**, o toque alterna entre ponto ("sol não cabe"), sol e vazio, e arrastar o dedo marca várias casas; as luas aparecem apagadas, só de referência;
- no **modo lua**, o mesmo para as luas.

Os pontos pequenos são automáticos: vizinhas de qualquer peça e a linha, coluna e região de cada sol (no modo sol) ou de cada lua (no modo lua). Eles somem se a peça for retirada. Conflitos aparecem destacados com listras vermelhas. As regiões são desenhadas em SVG, com cantos arredondados e um vão entre elas, e as casas por cima têm tamanho idêntico, para que peças e pontos fiquem sempre centralizados. O cronômetro pausa quando você sai do jogo, e a partida fica salva. Ao completar, desfazer e limpar recolhem e a chave Sol / Lua vira um eclipse (sol e lua se encontram) com o tempo final; tocar nela abre o resultado, e embaixo aparece a contagem para o próximo desafio.

**Desafios.** Há um desafio por dia, o mesmo para todo mundo, a partir de 27/09/2026 (#1). Todos estão em `eclipse/desafios.json` e foram conferidos pelo `eclipse/gerador.mjs`:
- cada um tem **uma única solução**;
- cada um pode ser resolvido **só com dedução direta**, sem nunca supor uma peça para ver o que acontece: o gerador só aceita desafios que um resolvedor com as técnicas do Queens termina — nível 1: casas únicas e confinamento de 1 (os sóis de uma região só cabem numa linha → o resto da linha não tem sol); nível 2: confinamento de 2; nível 3: confinamento de 3. A dificuldade vem da quantidade de verificações, nunca de tentativa e erro. Os desafios a partir de 28/09/2026 (#2) seguem essa regra; o #1 ficou como saiu.

**Dificuldade.** Sobe ao longo da semana, em 7 níveis: **segunda é nível 1** (8×8, só casas únicas e confinamento de 1) e **domingo é nível 7** (10×10, exige confinamento de 3). O tabuleiro cresce junto: **8×8** na segunda e na terça, **9×9** de quarta a sexta e **10×10** no fim de semana (7×7 não tem solução com essas regras). Cada dia gera vários candidatos do seu tamanho e técnica e fica com uma faixa do esforço de dedução medido pelo gerador.

**Jogo livre.** O atalho "Jogar um extra" (no fim da partida) abre desafios extras (`eclipse/livre.json`, 200 por nível, nos mesmos tamanhos), que não contam nas estatísticas. Na linha de cima aparece "Extra · [Nível 4 ▾] [↻]": o botão do nível abre a escolha de 1 a 7, e ↻ sorteia outro desafio do mesmo nível. A partida do dia fica guardada enquanto isso.

**Painel.** O painel acompanha o Eclipse sozinho: o selo mostra as peças colocadas e o tempo ao terminar. O Histórico mostra tempo por dia, melhor tempo e média.

Para gerar os desafios de novo, rode `node eclipse/gerador.mjs [dias]` (padrão: 730 dias a partir de 27/09/2026); ele refaz `desafios.json` e `livre.json`, mantendo os desafios que já saíram.

## Novelo

O Zip (LinkedIn) em português, com cara de costura: um **fio de lã** que se desenrola pelo tabuleiro.

- Um único fio passa por **todas as casas**, uma vez cada, só na horizontal e na vertical.
- Ele começa no **1**, passa pelos números **em ordem** e termina no último número.
- O fio não atravessa as **paredes** (traços escuros costurados entre as casas).

Desenha-se arrastando o dedo a partir do 1 (ou da ponta do fio). O fio segue a casa que está debaixo do dedo, como no Zip: o dedo entra numa casa vizinha da ponta e o fio avança; passa por uma casa que já é do fio e ele recolhe até ali. Num arrasto rápido (ou cortando um canto), se o dedo cair a duas ou mais casas da ponta (até 4), o fio preenche o caminho mais curto até lá, o que passa mais perto do trajeto do dedo (no empate, segue na direção em que vinha). Uma margem pequena na borda de cada casa evita que tremidas façam o fio ir e voltar, e o trajeto entre dois pontos do dedo é amostrado a cada quarto de casa. A ponta do fio estica na direção do dedo antes mesmo de ele entrar na próxima casa. Tocar numa casa do fio corta ali e continua dali. O fio não entra num número fora de ordem nem continua depois do último.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `novelo/desafios.json`, todos conferidos pelo `novelo/gerador.mjs` (com `novelo/motor.mjs`): **solução única** e resolvíveis **só com dedução**. O gerador sorteia um caminho que cobre o tabuleiro (por "mordidas" sucessivas, o que dá formas bem variadas), põe números até a solução ser única e depois tira os que sobram. O resolvedor "humano" usa dois níveis de técnica: (1) cada casa tem duas ligações, sem ciclos e sem juntar números fora de ordem; (2) passagens obrigatórias entre partes do tabuleiro. Nenhum desafio exige testar uma ligação e seguir as consequências até dar contradição (isso, para gente, é chute).

**Semana.** Segunda 6×6 (só técnicas simples e uns números a mais), terça 6×6, quarta 7×7, quinta 7×7, sexta 8×8, sábado 8×8 e domingo 9×9, com o esforço de dedução subindo dia a dia. Três estilos se alternam: **fio** (só números), **paredes** (algumas paredes) e **labirinto** (muitas paredes e pouquíssimos números).

## Azulejo (antigo Retalhos)

O Patches (LinkedIn) em português, como uma **parede de azulejos portugueses**. Até 28/09/2026 se chamava Retalhos (tema de colcha); o id interno continua `retalhos` (progresso, estatísticas e desafios não mudam) e o endereço antigo redireciona para `azulejo/`.

Cada painel certo vira um painel de azulejos: o desenho da etiqueta (flor, losango, estrela, rosácea, leque ou cruz, em azul-cobalto com um detalhe em mostarda, verde ou azul-claro) se repete casa a casa, com rejunte fino e moldura cobalto. Painel sem etiqueta fica em reboco liso; errado, com listras vermelhas. A faixa de concluído é azul-cobalto.

- Divida o tabuleiro em **retângulos**, sem sobrar casa e sem sobrepor.
- Cada retalho tem **exatamente uma etiqueta**. A etiqueta é o **formato** do retalho em sólido escuro — horizontal, vertical ou quadrado; uma cruz (horizontal + vertical juntos, como no Patches) = formato livre — com o **número de casas** em branco dentro. Sem cores nem costura: a cor do tecido só aparece depois do retalho desenhado. Algumas etiquetas não têm número.

Arraste de um canto ao outro para montar um painel: o contorno e o selo mostram o tamanho e se ele bate com a etiqueta de dentro (verde "3×2 · 6 ✓"; vermelho "4 de 6", "não é alto" ou "2 etiquetas"); um painel novo não pode passar por cima de outro (o contorno fica vermelho com "sobrepõe" e, ao soltar, nada muda); arrastar a partir de um painel já feito o redesenha — o canto oposto ao dedo fica parado e ele cresce ou encolhe; tocar num painel o desfaz, e tocar numa casa livre cria um 1×1. Retalhos certos ganham o tecido da cor da etiqueta, em tom suave (poá, listras ou xadrez e pesponto bem discretos, para não brigar com as etiquetas, que continuam sólidas); retalho sem etiqueta fica neutro e retalho que não bate fica com listras vermelhas. A barra de baixo conta os retalhos certos.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `azulejo/desafios.json`, conferidos pelo `azulejo/gerador.mjs` (com `azulejo/motor.mjs`): **solução única** e **só dedução** (no máximo o nível 2 do resolvedor, sem testar uma opção e seguir até a contradição). O gerador sorteia uma colcha equilibrada (formatos variados, poucos 1×1), põe uma etiqueta em cada retalho e esconde informações (número ou formato) enquanto a solução continuar única e dentro do nível do dia. As cores são escolhidas para retalhos vizinhos nunca ficarem iguais.

**Semana.** Segunda 6×6 com etiquetas completas, terça 6×6, quarta e quinta 7×7, sexta e sábado 8×8, domingo 9×9, escondendo cada vez mais informação. Estilos: **colcha**, **formas** (quase só formatos), **números** (quase só números), **grandes** e **miúdos**.

## Cortado

O Tango (LinkedIn) em português, com **café e leite**: grãos de café e gotas de leite no lugar de sol e lua (formas diferentes, para não confundir).

- Cada **linha** e cada **coluna** tem o mesmo número de café e de leite.
- Nunca **três iguais seguidos**, na horizontal ou na vertical.
- **=** entre duas casas: iguais; **×**: diferentes.

Toque numa casa para trocar: vazia → café → leite → vazia. Arrastar o dedo aplica a mesma troca em cada casa por onde ele passa. As casas que já vêm preenchidas têm fundo mais escuro e não mudam. O que quebra uma regra fica com listras vermelhas (e o sinal desrespeitado fica vermelho), e a linha de baixo diz qual regra — mas só a partir da jogada seguinte, para não acusar o erro enquanto você ainda está mexendo na casa. Controles embaixo: desfazer, barra de progresso (casas preenchidas) e recomeçar. Ao completar, os grãos e as gotas dão um pulinho e a barra vira "Cortado pronto" com o tempo.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `cortado/desafios.json`, conferidos pelo `cortado/gerador.mjs` (com `cortado/motor.mjs`): **solução única** e **só dedução**. O gerador sorteia um tabuleiro completo, começa com todas as casas e parte dos sinais como pistas e vai tirando pistas enquanto o resolvedor "humano" continuar chegando ao fim no nível do dia. Técnicas do resolvedor: (1) pares e buracos (XX_, X_X), sinais e linha que já tem metade de um tipo; (2) olhar a linha inteira: das combinações válidas que sobram, as casas iguais em todas são certas. Nenhum desafio exige testar um valor e seguir as consequências até dar contradição (isso, para gente, é chute).

**Semana.** Níveis 1 a 4 (segunda a quinta) em 6×6 e níveis 5 a 7 (sexta a domingo) em 8×8 — 10×10 ficava cansativo. Dentro de cada tamanho, a dificuldade sobe tirando pistas (menos casas preenchidas, só sinais) e ficando com os candidatos de maior esforço entre muitos sorteados; a técnica exigida vai de 1 (segunda, com umas pistas a mais) a 2. Três estilos se alternam: **misto**, **sinais** (poucas casas, muitos sinais) e **casas** (muitas casas, poucos sinais; só segunda e terça).

**Nos três (Novelo, Azulejo e Cortado):** ícone com versão escura (`icon-escuro.png`), que o painel, o cabeçalho, a tela de fim e o "Próximo jogo" usam no tema escuro — no catálogo é o campo `iconDark`, e o `comum/tema.js` troca a imagem sozinho quando o tema muda; jogo livre (`livre.json`, 200 por dia da semana), cronômetro que pausa, partida salva, estatísticas por tempo no painel. Para gerar de novo: `node novelo/gerador.mjs [dias]`, `node azulejo/gerador.mjs [dias]` e `node cortado/gerador.mjs [dias]` (padrão: 730 dias a partir de 28/09/2026).

## Desafios do dia e jogo livre (jogos de lógica)

Cada jogo de lógica tem 2 anos de desafios do dia e 200 desafios de jogo livre por nível. Os geradores produzem muitos candidatos por dia da semana, ficam com a faixa de esforço daquele dia e, dentro dela, mandam os mais interessantes para o desafio do dia (quem joga todo dia pega os melhores) e o resto para o jogo livre (`comum/selecao.mjs`). O "interesse" é de cada jogo: poucas peças reveladas e variedade de técnicas (Eclipse), menos pistas e os dois sinais (Cortado), etiquetas com informação escondida e formatos variados (Retalhos), fio com mais curvas e menos números (Novelo). Rodar um gerador de novo nunca muda os desafios que já saíram.

## Ícone e pendências fora do painel

- **Ícone do app:** uma peça de quebra-cabeça preenchida por um mosaico colorido. O iPhone grava o ícone quando o atalho é criado; para trocar, é preciso apagar o atalho e adicionar de novo (o progresso não se perde).
- **Número no ícone:** o app instalado mostra quantos jogos faltam no dia e some quando está tudo feito. No iPhone (iOS 16.4+) é preciso abrir as configurações e tocar uma vez em "Mostrar pendentes no ícone do app", e permitir notificações. O Chrome do Android não suporta esse número.
- O painel não consegue saber o que foi jogado direto nos outros sites. Ele registra só o que é aberto por ele ou marcado no check.
- O número no ícone é atualizado sempre que o painel é aberto. Depois da meia-noite ele continua mostrando o dia anterior até você abrir o painel.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `jogos`).
2. Envie todos os arquivos listados acima para a raiz.
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o painel estará em `https://<seu-usuario>.github.io/jogos/`.

## Dica

No celular, abra o painel e use **"Adicionar à tela inicial"** no menu do navegador. Ele vira um ícone de app e abre em tela cheia.

## Créditos

A peça de quebra-cabeça do ícone do app é o ícone "puzzle" do [Lucide](https://lucide.dev), preenchido com um mosaico, usado sob a licença ISC.
