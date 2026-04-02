# PRD: Cinemai Lab (vídeo com IA)

## 1. Visão geral

- **Nome do projeto:** Cinemai Lab (vídeo com IA)
- **Tipo de produto:** Ferramenta de automação de vídeo com IA para criadores de conteúdo.
- **Público-alvo:** Criadores de vídeos curtos/longos, canais espirituais, YouTube, Instagram Reels, TikTok.

**Resumo:**
Automatizar a criação de vídeos a partir de um prompt de texto. O fluxo básico é:
**prompt → roteiro/texto → cena → músicas → imagens → vídeo final em Remotion**, usando Suno (música), Midjourney ou outros geradores de imagem, Remotion (renderização de vídeo) e Claude Code para lógica de script e automação de pipelines.

---

## 2. Objetivo do produto

### Meta principal
- Automatizar pelo menos 80% do processo de criação de vídeos curtos/médios (15s–2min) com base em um prompt de texto.

### Objetivos secundários
- Reutilizar templates de vídeo (cenas, estilos, transições, fonts).
- Integrar fluxos de música (Suno) e imagem (Midjourney ou alternativas) diretamente com o pipeline de vídeo.
- Manter um código limpo, modular e testável para que novos vídeos ou canais possam ser adicionados rapidamente.

---

## 3. Funcionalidades principais

### 3.1. Fluxo de criação de vídeo

1. **Entrada de prompt**
   - O usuário insere um prompt de texto (ex.: "vídeo meditativo com mantra de Ganesha, 40s, estilo psicodélico suave").
   - O sistema pode sugerir exemplos de prompts salvos.

2. **Gerar roteiro e estrutura de cena**
   - O sistema gera um pequeno roteiro (headline, texto na tela, timing de falas).
   - Define a estrutura de cenas:
     - Quantas cenas.
     - Duração aproximada de cada cena.
     - Tipo de conteúdo por cena (texto, imagem, vídeo stock, animação 2D etc.).

3. **Geração de música com Suno**
   - A partir do prompt, o sistema gera metadados de música (gênero, BPM, clima, durações).
   - Chama a API do Suno (ou outro serviço similar) para gerar uma faixa de fundo.
   - Salva o áudio em `src/audio/`.

4. **Geração de imagens/cenas visuais**
   - Para cada cena, o sistema gera prompts de imagem para Midjourney ou outro gerador.
   - Baixa ou referencia as imagens e organiza em `src/images/`.

5. **Composição de vídeo em Remotion**
   - Usa os assets gerados (texto, imagens, áudio) para criar uma composição em Remotion.
   - Exporta o vídeo final em formato adequado (ex.: 1080p, 60fps, aspecto 9:16 para Shorts).

### 3.2. Estrutura de diretórios

```
cinemai-lab/
├── src/
│   ├── scripts/     # scripts de automação de pipeline
│   ├── audio/       # integração com Suno + arquivos gerados
│   ├── images/      # prompts e imagens geradas
│   └── video/       # composições Remotion
├── docs/            # PRD, guias, referências
├── CLAUDE.md        # configuração Claude Code
└── package.json
```
