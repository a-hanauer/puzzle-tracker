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
| `sanduba/` | O jogo Sanduba (`index.html` + `icon.png`) |
| `quinhentos/` | O jogo Quinhentos (`index.html` + `icon.png`) |
| `eclipse/` | O jogo Eclipse: `index.html`, `icon.png`, `desafios.json` (2 anos de desafios), `livre.json` (jogo livre) e `gerador.mjs` |
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

## Como funciona

- O **topo** mostra uma saudação conforme a hora (bom dia, boa tarde, boa noite), quantos jogos faltam hoje, a **sequência** de dias seguidos com tudo feito e um anel pequeno com o progresso do dia.
- **Jogos da casa** (Sanduba, Quinhentos e Eclipse) aparecem numa grade de ícones; **outros jogos** (sites externos) aparecem numa lista com ícone, nome, descrição e um check. A ordem é sempre a mesma, e cada seção mostra quantos já foram feitos hoje.
- **Status de cada jogo:**
  - **Outros jogos:** o check à direita marca ou desmarca; abrir o jogo pelo painel já marca como feito.
  - **Jogos da casa:** um anel no canto enche a cada tentativa e vira um ✔ verde quando a partida termina, com vitória ou derrota. Embaixo do nome aparece o andamento ("3/14") ou o resultado ("Acertou 5/8", ou o tempo no Eclipse).
- Jogos feitos ficam com fundo verde claro.
- A lista **zera sozinha à meia-noite**, no horário do aparelho.
- No canto superior direito há dois botões: **tema** (cada toque alterna Automático → Claro → Escuro; vale também para os jogos da casa) e **configurações**.
- O link do LinkedIn sempre abre na mesma aba, o que faz o celular abrir o app do LinkedIn quando ele está instalado.
- Em **configurações**: abrir jogos externos na mesma aba (padrão) ou em nova aba, desmarcar os jogos externos do dia (pede um segundo toque para confirmar) e, no app do iPhone, ativar o número de pendentes no ícone.

O progresso fica salvo no `localStorage` do navegador, então é separado em cada aparelho e navegador. Limpar os dados do site apaga o histórico.

## Histórico

A aba **Histórico** mostra:

- **Resumo:** sequência atual e melhor sequência de dias com tudo feito, total de dias completos e aproveitamento dos últimos 30 dias.
- **Últimas 12 semanas:** calendário em que cada dia fica mais verde conforme os jogos feitos. Tocar num dia mostra quais jogos você fez e o resultado do Sanduba e do Quinhentos.
- **Jogos por dia:** barras dos últimos 30 dias.
- **Por jogo:** em quantos dias você fez cada jogo.
- **Sanduba e Quinhentos:** estatísticas do próprio jogo (jogadas, vitórias, sequência), tentativas por dia e, no Quinhentos, a distribuição de tentativas.

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

A interface dos jogos nativos (Sanduba, Quinhentos e Eclipse) segue o mesmo padrão, definido em `comum/cabecalho.css`: ‹ voltar, ícone e nome do jogo e **?** com as regras; embaixo, a data do dia e a chave **Jogo livre**. Não há configurações nem telas de estatísticas dentro dos jogos; o tema é o escolhido no painel. As janelas (Como jogar, fim de jogo, confirmações) também seguem o mesmo padrão: sobem de baixo como uma bandeja presa à borda da tela (inclusive no app instalado no iPhone), com o ✕ sempre visível no topo, e fecham ao tocar no fundo. A bandeja de fim de jogo tem a mesma estrutura nos três: ✕, arte do jogo, título ("… completo!" ou "Não foi dessa vez"), resultado, linha de detalhe, **Compartilhar** (desafio do dia) ou **Jogar outro** (jogo livre), contagem para o próximo desafio e **Próximo jogo**. As estatísticas continuam sendo gravadas pelos jogos e aparecem na aba **Histórico** do painel.

As estatísticas e sequências dos jogos continuam valendo: o navegador guarda o progresso por domínio, e todos os endereços ficam em `a-hanauer.github.io`.

Para atualizar um desses jogos, substitua o `index.html` da pasta dele.

Como o painel lê o que esses jogos salvam no navegador, o estado deles é sempre o da partida do dia, e "Desmarcar jogos externos de hoje" não mexe neles. A leitura depende das chaves que cada jogo usa para salvar (`sanduba-daily-AAAA-M-D` e `quinhentao:game:padrao`); se elas mudarem num jogo, ajuste `LOCAL_PROGRESS` em `comum/catalogo.js`.

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

**Dificuldade.** Sobe ao longo da semana, em 7 níveis: **segunda é nível 1** (o mais fácil) e **domingo é nível 7** (o mais difícil). Os níveis vêm do esforço de dedução que cada desafio exige, medido pelo gerador; os 3% mais extremos ficam de fora.

**Jogo livre.** A chave "Jogo livre" abre desafios extras (`eclipse/livre.json`, 40 por nível), sorteados, que não contam nas estatísticas. O botão "outro" sorteia um novo. A partida do dia fica guardada enquanto isso.

**Painel.** O painel acompanha o Eclipse sozinho: o selo mostra as peças colocadas e o tempo ao terminar. O Histórico mostra tempo por dia, melhor tempo e média.

Para gerar os desafios de novo, rode `node eclipse/gerador.mjs [dias]` (padrão: 730 dias a partir de 27/09/2026); ele refaz `desafios.json` e `livre.json`.

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
