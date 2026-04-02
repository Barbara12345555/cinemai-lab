# Cinemai Lab

Ferramenta de automação de vídeos com IA. Fluxo: **prompt → roteiro → imagens → áudio → vídeo**.

## Configuração

```bash
cp .env.example .env
npm install
npm run dev
```

## Variáveis de ambiente

### LLM — OpenRouter

| Variável | Obrigatória | Descrição |
|---|---|---|
| `OPENROUTER_API_KEY` | **sim** | Chave da API do OpenRouter. Crie em [openrouter.ai/keys](https://openrouter.ai/keys) |
| `OPENROUTER_APP_NAME` | não | Nome do app exibido no dashboard do OpenRouter (padrão: `Cinemai Lab`) |
| `OPENROUTER_REFERRER` | não | URL de referência para ranking no OpenRouter (padrão: `http://localhost:3000`) |

O modelo padrão utilizado é `minimax/minimax-m2.5:free` (gratuito). Para trocar, edite `DEFAULT_MODEL` em `src/lib/llmClient.ts`.

### Outros serviços

| Variável | Descrição |
|---|---|
| `SUNO_API_KEY` | API de geração de música (stub até integração) |
| `IMAGE_API_KEY` | API de imagens — Replicate, fal.ai etc. |
| `IMAGE_API_URL` | Endpoint do gerador de imagens |

## Scripts

```bash
npm run dev              # Servidor Next.js
npm run build            # Build de produção
npm run typecheck        # Verificação TypeScript
npm run remotion:studio  # Preview de vídeo no Remotion Studio
npm run remotion:render  # Renderizar vídeo final
```
