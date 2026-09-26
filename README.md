# 🧩 Jogos do Dia

Um painel simples, pensado para o celular, para acompanhar os word games diários sem precisar manter um monte de abas abertas.

Tudo roda em um único `index.html`, sem dependências, build ou servidor.

## Jogos incluídos

| Jogo | Link |
|---|---|
| 🟩 Termo | https://term.ooo/ |
| 🎵 Spotle | https://spotle.io/ |
| ↕️ Betweenle | https://betweenle.com/ |
| 🥪 Sanduba | https://a-hanauer.github.io/sanduba-jogo/ |
| 🔢 Word500 | https://word500.com/ |
| 5️⃣ Quinhentos | https://a-hanauer.github.io/500/ |
| 🦊 Foximax | https://foximax.com/ |
| 💼 LinkedIn (app) | https://www.linkedin.com/games/ |

## Como funciona

- **Tocar em um jogo** abre o jogo e já o marca como jogado.
- **O círculo à direita** marca ou desmarca o jogo manualmente.
- Os pendentes ficam no topo e os concluídos descem para o fim da lista.
- A **barra de progresso** mostra quantos jogos do dia já foram feitos.
- A **sequência 🔥** conta os dias seguidos em que todos os jogos foram concluídos.
- A lista **zera sozinha à meia-noite**, no horário do aparelho.
- Por padrão os jogos abrem **na mesma aba**: jogue e use "voltar" para retornar ao painel. O botão no rodapé troca para abrir em nova aba.
- O link do LinkedIn sempre abre na mesma aba, o que faz o celular abrir o app do LinkedIn quando ele está instalado.
- "Desmarcar tudo" limpa o progresso do dia.

O progresso fica salvo no `localStorage` do navegador, então é separado em cada aparelho e navegador. Limpar os dados do site apaga o histórico.

## Adicionar ou remover jogos

Edite o array `GAMES` no início do `<script>` em `index.html`:

```js
{ id: "novojogo", name: "Novo Jogo", emoji: "🎯", desc: "Descrição curta", url: "https://exemplo.com/" },
```

- `id`: identificador único. Não mude depois de criado, porque o progresso é salvo por ele.
- `name`, `emoji`, `desc`: o que aparece no cartão.
- `url`: endereço do jogo.
- `app: true` (opcional): mostra a etiqueta "APP" e sempre abre na mesma aba, para o celular repassar o link ao aplicativo.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `jogos`).
2. Envie `index.html` e este `README.md` para a raiz.
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o painel estará em `https://<seu-usuario>.github.io/jogos/`.

## Dica

No celular, abra o painel e use **"Adicionar à tela inicial"** no menu do navegador. Ele vira um ícone de app e abre em tela cheia.
