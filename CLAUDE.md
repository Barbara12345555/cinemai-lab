# Cinemai Lab — Claude Code Configuration

Projeto de geração automatizada de vídeos com IA: prompt → texto → cena → vídeo.

## Stack

- **Runtime:** Node.js 18+ / TypeScript
- **Vídeo:** Remotion
- **Música:** Suno API
- **Imagens:** Midjourney / geração por prompt
- **Script & lógica:** Claude Code

## Estrutura do Projeto

```
src/
├── scripts/   # Scripts de geração de vídeo
├── audio/     # Integração com Suno
├── images/    # Prompts e imagens geradas
└── video/     # Remotion — composições e cenas
```

## Padrões de Código

- Linguagem: TypeScript (preferido) ou JavaScript
- Funções pequenas e focadas — cada arquivo é responsável por uma feature
- Módulos separados por domínio (audio, video, images, scripts)
- Nomes descritivos em camelCase para funções, PascalCase para componentes Remotion

## Regras Críticas

- **NUNCA** alterar `main.ts` ou arquivos de composição Remotion sem testar localmente antes
- Sempre rodar `npm run build` antes de marcar uma tarefa como concluída
- Não quebrar o pipeline: a ordem é `script → imagens → áudio → composição → render`

## Tarefas Comuns

| Comando | Descrição |
|---------|-----------|
| `/task criar-cena` | Gera layout de cena de vídeo (estrutura Remotion + assets) |
| `/task refatorar` | Melhora legibilidade sem alterar comportamento |
| `/task adicionar-testes` | Adiciona testes mínimos para a feature atual |

## Fluxo de Geração de Vídeo

```
1. Prompt do usuário
2. Claude gera roteiro/script  →  src/scripts/
3. Geração de imagens          →  src/images/
4. Geração de áudio (Suno)     →  src/audio/
5. Composição Remotion         →  src/video/
6. Render final
```

## Design System

Estilo: **Dark Brutal** — dark, minimalista, bordas retas, verde ácido (`#BFF549`) como cor primária.

- Referência completa: `docs/design-system.md`
- Fontes: **Inter** (corpo) + **Space Mono** (código/labels/botões)
- Bordas: sempre retas (`border-radius: 0`) — sem arredondamento
- Botão primário: fundo `#BFF549`, texto `#111`, sombra dura `4px 4px 0 #BFF549`
- Cards: fundo `#141414`, borda `#2A2A2A`, sem radius
- Nunca usar bordas arredondadas exceto `--radius-sm: 4px` em chips/pills

## Comandos do Projeto

```bash
npm run dev        # Remotion Studio (preview)
npm run build      # Build de verificação
npm run render     # Render do vídeo final
npm test           # Rodar testes
```
