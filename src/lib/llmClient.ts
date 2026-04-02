const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Modelos em ordem de preferência — provedores variados para evitar rate limit
const FALLBACK_MODELS = [
  "openai/gpt-oss-20b:free",          // OpenAI
  "openai/gpt-oss-120b:free",         // OpenAI
  "nvidia/nemotron-nano-9b-v2:free",  // NVIDIA
  "google/gemma-3-12b-it:free",       // Google AI Studio
  "google/gemma-3-27b-it:free",       // Google AI Studio
  "arcee-ai/trinity-large-preview:free", // Arcee
];

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

function adaptMessages(model: string, messages: Message[]): Message[] {
  if (!model.includes("gemma")) return messages;
  // Gemma não suporta role "system" — converte para "user"
  return messages.map((m) => m.role === "system" ? { ...m, role: "user" } : m);
}

async function callModel(
  model: string,
  messages: Message[],
  options: GenerateOptions,
  apiKey: string
): Promise<{ ok: boolean; status: number; body: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  const response = await fetch(OPENROUTER_ENDPOINT, {
    signal: controller.signal,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_REFERRER ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Cinemai Lab",
    },
    body: JSON.stringify({
      model,
      messages: adaptMessages(model, messages),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
    }),
  });
  const body = await response.text();
  clearTimeout(timer);
  return { ok: response.ok, status: response.status, body };
}

export async function generateText(
  messages: Message[],
  options: GenerateOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurada.");

  const models = options.model ? [options.model] : FALLBACK_MODELS;
  let lastError = "";

  for (const model of models) {
    let ok: boolean, status: number, body: string;
    try {
      ({ ok, status, body } = await callModel(model, messages, options, apiKey));
    } catch {
      console.warn(`[llmClient] ${model} timeout/erro de rede, tentando próximo...`);
      continue;
    }

    if (ok) {
      const data = JSON.parse(body) as { choices: { message: { content: string } }[] };
      return data.choices[0].message.content;
    }

    lastError = `OpenRouter error ${status} (${model}): ${body}`;
    console.warn(`[llmClient] ${model} falhou (${status}), tentando próximo...`);

    // Tenta o próximo modelo em caso de rate limit, indisponibilidade ou limite de gasto
    if (status !== 429 && status !== 503 && status !== 404 && status !== 402) break;

    // Aguarda antes de tentar o próximo para evitar rate limit encadeado
    if (status === 429) await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error(lastError);
}
