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

## Como funciona

- Os jogos aparecem numa **grade de ícones**, como a tela inicial do celular, sempre na mesma ordem, para você jogar na sequência que quiser.
- **Tocar num jogo** abre o jogo. Nos jogos externos, isso já marca o jogo como feito.
- **O selo no canto** mostra o status:
  - **Jogos externos:** é um botão; tocar nele marca ou desmarca o jogo sem abrir.
  - **Sanduba e Quinhentos:** é automático. O anel enche a cada tentativa e vira um ✔ verde quando a partida termina, com vitória ou derrota. Embaixo do nome aparece o andamento ("3/14") ou o resultado ("Acertou 5/8").
- Jogos feitos ficam com fundo verde claro.
- O **anel de progresso** no topo mostra quantos jogos do dia já foram feitos, e a **sequência 🔥** conta os dias seguidos com tudo feito.
- A lista **zera sozinha à meia-noite**, no horário do aparelho.
- Por padrão os jogos abrem **na mesma aba**. O botão no rodapé troca para abrir em nova aba.
- O link do LinkedIn sempre abre na mesma aba, o que faz o celular abrir o app do LinkedIn quando ele está instalado.
- "Desmarcar tudo" limpa os jogos externos do dia.

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

Edite o array `GAMES` no início do `<script>` em `index.html`:

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

As estatísticas e sequências dos jogos continuam valendo: o navegador guarda o progresso por domínio, e todos os endereços ficam em `a-hanauer.github.io`.

Para atualizar um desses jogos, substitua o `index.html` da pasta dele.

Como o painel lê o que esses jogos salvam no navegador, o estado deles é sempre o da partida do dia, e "Desmarcar tudo" só afeta os jogos externos. A leitura depende das chaves que cada jogo usa para salvar (`sanduba-daily-AAAA-M-D` e `quinhentao:game:padrao`); se elas mudarem num jogo, ajuste `LOCAL_PROGRESS` no `index.html` do painel.

## Ícone e progresso fora do painel

- **Ícone da tela inicial:** fixo, com o anel como logotipo. Celulares não deixam um site redesenhar esse ícone depois de instalado.
- **Número no ícone:** o app instalado mostra quantos jogos faltam no dia e some quando está tudo feito. No iPhone (iOS 16.4+) é preciso tocar uma vez em "🔔 Mostrar pendentes no ícone", no rodapé, e permitir notificações. O Chrome do Android não suporta esse número.
- **Ícone da aba:** no navegador, o ícone da aba é redesenhado ao vivo com o anel de progresso e fica verde quando tudo está feito.
- O painel não consegue saber o que foi jogado direto nos outros sites. Ele registra só o que é aberto por ele ou marcado no switch.
- O número no ícone é atualizado sempre que o painel é aberto. Depois da meia-noite ele continua mostrando o dia anterior até você abrir o painel.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `jogos`).
2. Envie todos os arquivos listados acima para a raiz.
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o painel estará em `https://<seu-usuario>.github.io/jogos/`.

## Dica

No celular, abra o painel e use **"Adicionar à tela inicial"** no menu do navegador. Ele vira um ícone de app e abre em tela cheia.

## Créditos

A peça de quebra-cabeça do ícone é o ícone "puzzle" do [Lucide](https://lucide.dev), preenchido, usado sob a licença ISC.
