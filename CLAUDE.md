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
- **Área segura**: respeitar `env(safe-area-inset-*)` em cima (notch) e embaixo (barra de gestos).

## Publicar

1. Subir a versão do cache em `sw.js` (`const CACHE = "jogos-do-dia-vN"`).
2. Se mudar algo em `comum/`, subir o `?v=` dos scripts/estilos em todos os HTML.
3. Commit em português; `git push origin HEAD:main` (o GitHub Pages publica sozinho).

## Jeito de trabalhar

- Conversa em português.
- Mudança visual: mostrar prévia (390×844, claro e escuro) com opções e esperar a escolha.
- Desafios dos jogos de lógica: nunca exigir chute; os já publicados (até hoje) não mudam.
