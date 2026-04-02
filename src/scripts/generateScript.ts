import { generateText } from "@/src/lib/llmClient";
import type { VideoScript } from "@/src/types/pipeline";

const SYSTEM_PROMPT = `Você é um roteirista especializado em vídeos curtos para YouTube Shorts, Instagram Reels e TikTok.
Dado um prompt do usuário, gere um roteiro estruturado de vídeo em JSON válido, sem markdown, sem explicações.

O JSON deve seguir exatamente este formato:
{
  "title": "string",
  "totalDurationInSeconds": number,
  "style": "string",
  "scenes": [
    {
      "id": "scene-1",
      "durationInSeconds": number,
      "text": "texto que aparece na tela",
      "imagePrompt": "prompt em inglês para gerador de imagem",
      "type": "image+text" | "text" | "image"
    }
  ],
  "audioMetadata": {
    "genre": "string",
    "bpm": number,
    "mood": "string",
    "durationInSeconds": number,
    "prompt": "prompt para geração de música"
  }
}`;

export async function generateScript(userPrompt: string): Promise<VideoScript> {
  const text = await generateText(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Crie um roteiro de vídeo para: "${userPrompt}"` },
    ],
    { max_tokens: 2048 }
  );

  try {
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(clean) as VideoScript;
  } catch {
    throw new Error(`Falha ao parsear roteiro: ${text.slice(0, 200)}`);
  }
}
