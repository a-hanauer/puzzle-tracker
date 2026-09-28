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
| `sanduba/` | O jogo Sanduba (`index.html`, `icon-claro.png` e `icon-escuro.png`) |
| `quinhentos/` | O jogo Quinhentos (`index.html` + `icon.png`) |
| `eclipse/` | O jogo Eclipse: `index.html`, `icon.png`, `desafios.json` (2 anos de desafios), `livre.json` (jogo livre) e `gerador.mjs` |
| `novelo/` | O jogo Novelo: `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `retalhos/` | O jogo Retalhos: `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `pingado/` | O jogo Pingado: `index.html`, `icon.png`, `desafios.json` (1 ano), `livre.json`, `gerador.mjs` e `motor.mjs` (regras e resolvedor) |
| `comum/` | Partes comuns: cabeçalho e janelas dos jogos (`cabecalho.css`, `cabecalho.js`) e tema geral (`tema.js`) |

## Jogos incluídos

| Jogo | Link |
|---|---|
| 🟩 Termo | https://term.ooo/ |
| 🎵 Spotle | https://spotle.io/ |
| ↕️ Betweenle | https://betweenle.com/ |
| 🥪 Sanduba | [`sanduba/`](sanduba/) (neste repositório) |
| 🔢 Word500 | https://word500.com/ |
| 5️⃣ Quinhentos | [`quinhentos/`](quinhentos/) (neste repositório) |
| 🦊 Foximax | https://foximax.com/ |
| 💼 LinkedIn (app) | https://www.linkedin.com/games/ |
| 🌗 Eclipse | [`eclipse/`](eclipse/) (jogo próprio, neste repositório) |
| 🧶 Novelo | [`novelo/`](novelo/) (Zip em português, neste repositório) |
| 🧵 Retalhos | [`retalhos/`](retalhos/) (Patches em português, neste repositório) |
| ☕ Pingado | [`pingado/`](pingado/) (Tango em português, neste repositório) |

## Como funciona

- **Destaque para o que falta:** jogos pendentes aparecem em cartões cheios; os concluídos ficam esmaecidos (sem cartão, ícone acinzentado, check neutro). Na lista dos outros jogos, os pendentes ficam sempre no topo.
- O **topo** mostra o nome do produto ("Jogos do Dia") em destaque, os botões de **estatísticas** e **configurações** e, logo abaixo, a **barra de progresso do dia**: um trecho por jogo, que fica verde conforme os jogos são feitos, com o contador ("3/9") à direita, no mesmo estilo dos contadores das seções. Quando todos estão feitos, os trechos se fundem numa barra verde contínua, um brilho passa por ela uma vez e o contador vira o selo "✓ Tudo feito" (não há mais mensagem no pé da página). A sequência de dias fica na página de estatísticas.
- **Jogos da casa** (Sanduba, Quinhentos, Eclipse, Novelo, Retalhos e Pingado) aparecem numa grade de cartões pintados com a cor de fundo do próprio ícone (o ícone se funde ao cartão). Todos os ícones têm fundo liso, sem degradê. Cada jogo tem ícone claro e escuro (`icon-claro.png` / `icon-escuro.png`, campo `iconDark` no catálogo), para os cartões ficarem todos claros no tema claro e todos escuros no tema escuro, sem contraste gritante; **outros jogos** (sites externos) aparecem numa lista com ícone, nome, descrição e um check. A ordem é sempre a mesma, e cada seção mostra quantos já foram feitos hoje.
- **Status de cada jogo:**
  - **Outros jogos:** o check à direita marca ou desmarca; abrir o jogo pelo painel já marca como feito.
  - **Jogos da casa:** um anel no canto enche a cada tentativa e vira um ✔ verde quando a partida termina, com vitória ou derrota. Embaixo do nome aparece o andamento ("3/14") ou o resultado (✓ 5/8, ✕ 8/8, ou o tempo com cronômetro no Eclipse, no Novelo, no Retalhos e no Pingado).
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
- **Jogos da casa:** um só quadro, com um controle para trocar entre os jogos da casa (só o selecionado mostra o nome; os outros, só o ícone): estatísticas do próprio jogo, tentativas (ou tempo) por dia e, no Quinhentos, vitórias por número de tentativas.

O painel guarda até 2 anos de histórico no navegador. Partidas antigas do Sanduba são recuperadas automaticamente; os resultados diários do Quinhentos passam a ser registrados a partir desta versão.

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
- `url`: endereço do jogo, ou o nome da pasta para jogos que moram neste repositório (ex.: `"sanduba/"`).
- `icon` (opcional): URL de um ícone específico, no lugar da busca automática.
- `iconFull: true` (opcional): o ícone ocupa o quadrado inteiro (bom para ícones com fundo próprio).
- `app: true` (opcional): mostra a etiqueta "APP" e sempre abre na mesma aba, para o celular repassar o link ao aplicativo.

## Jogos dentro do repositório

O Sanduba e o Quinhentos rodam direto daqui, cada um na sua pasta:

- https://a-hanauer.github.io/puzzle-tracker/sanduba/
- https://a-hanauer.github.io/puzzle-tracker/quinhentos/

Cada jogo tem um botão **‹** à esquerda do logotipo que volta para o painel. Ele é essencial no app instalado no iPhone, que não mostra o botão "voltar" do navegador.

A interface dos jogos nativos (Sanduba, Quinhentos, Eclipse, Novelo, Retalhos e Pingado) segue o mesmo padrão, definido em `comum/cabecalho.css`: ‹ voltar, ícone e nome do jogo e **?** com as regras; embaixo, a data do dia e a chave **Jogo livre**. Não há configurações nem telas de estatísticas dentro dos jogos; o tema é o escolhido no painel. As janelas (Como jogar, fim de jogo, confirmações) também seguem o mesmo padrão: sobem de baixo como uma bandeja presa à borda da tela (inclusive no app instalado no iPhone), com o ✕ sempre visível no topo, e fecham ao tocar no fundo. A bandeja de fim de jogo tem a mesma estrutura em todos: ✕, arte do jogo, título ("… completo!" ou "Não foi dessa vez"), resultado (no desafio do dia, com um ícone discreto de compartilhar ao lado), linha de detalhe, **Jogar outro** (jogo livre), contagem para o próximo desafio e **Próximo jogo**. As estatísticas continuam sendo gravadas pelos jogos e aparecem nas **Estatísticas** do painel.

As estatísticas e sequências dos jogos continuam valendo: o navegador guarda o progresso por domínio, e todos os endereços ficam em `a-hanauer.github.io`.

Para atualizar um desses jogos, substitua o `index.html` da pasta dele.

Como o painel lê o que esses jogos salvam no navegador, o estado deles é sempre o da partida do dia, e "Desmarcar jogos externos de hoje" não mexe neles. A leitura depende das chaves que cada jogo usa para salvar (`sanduba-daily-AAAA-M-D` e `quinhentao:game:padrao`); se elas mudarem num jogo, ajuste `LOCAL_PROGRESS` em `comum/catalogo.js`.

**Teclado padrão:** os jogos com teclado usam as mesmas medidas (altura, espaçamentos, raio, tamanho da letra e do ENTER), definidas como variáveis `--kb-*` em `comum/cabecalho.css`; cada jogo mantém suas cores, bordas e sombras.

**Dificuldade no jogo livre (todos os jogos):** no jogo livre, a linha de cima mostra "Extra · [dificuldade ▾] [↻]" (componente `ghNivel` em `comum/cabecalho.js`). Nos jogos de lógica (Eclipse, Novelo, Retalhos, Pingado) a dificuldade é o nível de 1 a 7; nos de palavras, o número de tentativas — Sanduba: Fácil 20, Normal 14, Difícil 10; Quinhentos: Fácil 10, Normal 8, Difícil 6 (o desafio do dia continua com 14 e 8). A escolha fica guardada no aparelho; ↻ sorteia outro.

**Próximo jogo:** quando o jogo do dia termina, cada jogo da casa mostra no cabeçalho um botão discreto com o ícone do próximo jogo pendente (na ordem do painel: jogos da casa, depois os outros), e a janela de resultado ganha a linha "Próximo jogo". Abrir um jogo externo por ali já o marca como feito. Se tudo estiver feito, a linha leva de volta ao painel. O componente fica em `comum/proximo.js`.

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
- cada um pode ser resolvido **só com dedução**, sem chute.

**Dificuldade.** Sobe ao longo da semana, em 7 níveis: **segunda é nível 1** (o mais fácil) e **domingo é nível 7** (o mais difícil), e o tabuleiro cresce junto: **8×8** na segunda e na terça, **9×9** de quarta a sexta e **10×10** no fim de semana (7×7 não tem solução com essas regras). Cada dia gera vários candidatos do seu tamanho e fica com uma faixa do esforço de dedução medido pelo gerador. Os desafios que já tinham saído (#1 e #2) continuam iguais.

**Jogo livre.** A chave "Jogo livre" abre desafios extras (`eclipse/livre.json`, 40 por nível, nos mesmos tamanhos), que não contam nas estatísticas. Na linha de cima aparece "Extra · [Nível 4 ▾] [↻]": o botão do nível abre a escolha de 1 a 7, e ↻ sorteia outro desafio do mesmo nível. A partida do dia fica guardada enquanto isso.

**Painel.** O painel acompanha o Eclipse sozinho: o selo mostra as peças colocadas e o tempo ao terminar. O Histórico mostra tempo por dia, melhor tempo e média.

Para gerar os desafios de novo, rode `node eclipse/gerador.mjs [dias]` (padrão: 730 dias a partir de 27/09/2026); ele refaz `desafios.json` e `livre.json`.

## Novelo

O Zip (LinkedIn) em português, com cara de costura: um **fio de lã** que se desenrola pelo tabuleiro.

- Um único fio passa por **todas as casas**, uma vez cada, só na horizontal e na vertical.
- Ele começa no **1**, passa pelos números **em ordem** e termina no último número.
- O fio não atravessa as **paredes** (traços escuros costurados entre as casas).

Desenha-se arrastando o dedo a partir do 1 (ou da ponta do fio). A ponta do fio acompanha o dedo o tempo todo — estica na direção do dedo antes mesmo de entrar na próxima casa, recolhe quando o dedo volta e só dá um puxãozinho onde não dá para seguir (parede, borda, número fora de ordem). O fio avança casa a casa, na direção em que o dedo mais se afastou da ponta, e só avança quando o dedo entra bem na casa vizinha — tremidas na borda entre casas não desviam o caminho, e arrastos rápidos não pulam casas. Arrastar de volta recolhe o fio uma casa por vez; tocar numa casa do fio corta ali e continua dali. O fio não entra num número fora de ordem nem continua depois do último. O próximo número pulsa com um anel, e a linha de baixo diz qual é e quantas casas faltam. Controles embaixo: desfazer, barra de progresso (casas cobertas) e recomeçar. Ao completar, a barra vira "Novelo completo" com o tempo, e o fio ganha um brilho que corre de ponta a ponta.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `novelo/desafios.json`, todos conferidos pelo `novelo/gerador.mjs` (com `novelo/motor.mjs`): **solução única** e resolvíveis **só com dedução**. O gerador sorteia um caminho que cobre o tabuleiro (por "mordidas" sucessivas, o que dá formas bem variadas), põe números até a solução ser única e depois tira os que sobram. O resolvedor "humano" usa três níveis de técnica: (1) cada casa tem duas ligações, sem ciclos e sem juntar números fora de ordem; (2) passagens obrigatórias entre partes do tabuleiro; (3) testar uma ligação e ver que ela leva a contradição.

**Semana.** Segunda 6×6 (só técnicas simples e uns números a mais), terça 6×6, quarta 7×7, quinta 7×7, sexta 8×8, sábado 8×8 e domingo 9×9, com o esforço de dedução subindo dia a dia. Três estilos se alternam: **fio** (só números), **paredes** (algumas paredes) e **labirinto** (muitas paredes e pouquíssimos números).

## Retalhos

O Patches (LinkedIn) em português, como uma **colcha de retalhos**.

- Divida o tabuleiro em **retângulos**, sem sobrar casa e sem sobrepor.
- Cada retalho tem **exatamente uma etiqueta**. A etiqueta é o **formato** do retalho em sólido escuro — horizontal, vertical ou quadrado; uma cruz (horizontal + vertical juntos, como no Patches) = formato livre — com o **número de casas** em branco dentro. Sem cores nem costura: a cor do tecido só aparece depois do retalho desenhado. Algumas etiquetas não têm número.

Arraste de um canto ao outro para desenhar um retalho: o contorno e o selo mostram o tamanho e se ele bate com a etiqueta de dentro (verde "3×2 · 6 ✓"; vermelho "4 de 6", "não é alto" ou "2 etiquetas"); um retalho novo não pode passar por cima de outro (o contorno fica vermelho com "sobrepõe" e, ao soltar, nada muda); arrastar a partir de um retalho já feito o redesenha — o canto oposto ao dedo fica parado e ele cresce ou encolhe; tocar num retalho o desfaz, e tocar numa casa livre cria um 1×1. Retalhos certos ganham o tecido da cor da etiqueta (poá, listras ou xadrez, com pesponto); retalho sem etiqueta fica neutro e retalho que não bate fica com listras vermelhas. A barra de baixo conta os retalhos certos.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `retalhos/desafios.json`, conferidos pelo `retalhos/gerador.mjs` (com `retalhos/motor.mjs`): **solução única** e **só dedução**. O gerador sorteia uma colcha equilibrada (formatos variados, poucos 1×1), põe uma etiqueta em cada retalho e esconde informações (número ou formato) enquanto a solução continuar única e dentro do nível do dia. As cores são escolhidas para retalhos vizinhos nunca ficarem iguais.

**Semana.** Segunda 6×6 com etiquetas completas, terça 6×6, quarta e quinta 7×7, sexta e sábado 8×8, domingo 9×9, escondendo cada vez mais informação. Estilos: **colcha**, **formas** (quase só formatos), **números** (quase só números), **grandes** e **miúdos**.

## Pingado

O Tango (LinkedIn) em português, com **café e leite**: grãos de café e gotas de leite no lugar de sol e lua (formas diferentes, para não confundir).

- Cada **linha** e cada **coluna** tem o mesmo número de café e de leite.
- Nunca **três iguais seguidos**, na horizontal ou na vertical.
- **=** entre duas casas: iguais; **×**: diferentes.

Toque numa casa para trocar: vazia → café → leite → vazia. Arrastar o dedo aplica a mesma troca em cada casa por onde ele passa. As casas que já vêm preenchidas têm fundo mais escuro e não mudam. O que quebra uma regra fica com listras vermelhas (e o sinal desrespeitado fica vermelho), e a linha de baixo diz qual regra — mas só a partir da jogada seguinte, para não acusar o erro enquanto você ainda está mexendo na casa. Controles embaixo: desfazer, barra de progresso (casas preenchidas) e recomeçar. Ao completar, os grãos e as gotas dão um pulinho e a barra vira "Pingado pronto" com o tempo.

**Desafios.** Um por dia a partir de 28/09/2026 (#1), em `pingado/desafios.json`, conferidos pelo `pingado/gerador.mjs` (com `pingado/motor.mjs`): **solução única** e **só dedução**. O gerador sorteia um tabuleiro completo, começa com todas as casas e parte dos sinais como pistas e vai tirando pistas enquanto o resolvedor "humano" continuar chegando ao fim no nível do dia. Técnicas do resolvedor: (1) pares e buracos (XX_, X_X), sinais e linha que já tem metade de um tipo; (2) olhar a linha inteira: das combinações válidas que sobram, as casas iguais em todas são certas; (3) testar um valor e ver que ele leva a contradição.

**Semana.** Segunda e terça 6×6, de quarta a domingo 8×8 (o máximo: 10×10 ficava cansativo). A técnica exigida e o esforço sobem dia a dia: segunda só técnica 1 e umas pistas a mais; de sexta em diante o gerador tira mais pistas (quase nenhuma casa preenchida, só sinais) e cada dia fica com os candidatos de maior esforço entre muitos sorteados (esforço mediano por dia: 4, 45, 58, 159, 252, 317, 419). Três estilos se alternam: **misto**, **sinais** (poucas casas, muitos sinais) e **casas** (muitas casas, poucos sinais; só até quarta).

**Nos três (Novelo, Retalhos e Pingado):** ícone com versão escura (`icon-escuro.png`), que o painel, o cabeçalho, a tela de fim e o "Próximo jogo" usam no tema escuro — no catálogo é o campo `iconDark`, e o `comum/tema.js` troca a imagem sozinho quando o tema muda; jogo livre (`livre.json`, 20 por dia da semana), cronômetro que pausa, partida salva, estatísticas por tempo no painel. Para gerar de novo: `node novelo/gerador.mjs [dias]`, `node retalhos/gerador.mjs [dias]` e `node pingado/gerador.mjs [dias]` (padrão: 364 dias a partir de 28/09/2026).

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
