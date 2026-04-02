import type { AudioMetadata } from "@/src/types/pipeline";

/**
 * Gera uma faixa de áudio via Suno API.
 * Por enquanto retorna um stub — substitua pela integração real quando a API estiver disponível.
 */
export async function generateAudio(metadata: AudioMetadata): Promise<string> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    console.warn("[sunoClient] SUNO_API_KEY não configurada. Retornando stub.");
    return stub(metadata);
  }

  // TODO: integração real com Suno quando a API pública estiver disponível
  // const response = await fetch("https://api.suno.ai/v1/generate", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ prompt: metadata.prompt, duration: metadata.durationInSeconds }),
  // });
  // const data = await response.json();
  // return data.audioUrl;

  return stub(metadata);
}

function stub(metadata: AudioMetadata): string {
  const fileName = `audio-${Date.now()}.mp3`;
  console.log(`[sunoClient] Stub → ${fileName}`, {
    genre: metadata.genre,
    bpm: metadata.bpm,
    mood: metadata.mood,
    duration: metadata.durationInSeconds,
  });
  return `src/audio/generated/${fileName}`;
}
