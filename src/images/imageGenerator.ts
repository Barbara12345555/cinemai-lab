import type { Scene } from "@/src/types/pipeline";

/**
 * Gera imagens para cada cena via API de imagem configurada.
 * Suporta: Replicate, fal.ai ou qualquer endpoint compatível.
 * Retorna paths locais das imagens salvas.
 */
export async function generateImages(scenes: Scene[]): Promise<string[]> {
  const apiKey = process.env.IMAGE_API_KEY;
  const apiUrl = process.env.IMAGE_API_URL;

  if (!apiKey || !apiUrl) {
    console.warn("[imageGenerator] IMAGE_API_KEY/URL não configuradas. Retornando stubs.");
    return scenes.map((scene) => stub(scene));
  }

  const results = await Promise.all(scenes.map((scene) => generateOne(scene, apiKey, apiUrl)));
  return results;
}

async function generateOne(scene: Scene, apiKey: string, apiUrl: string): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: scene.imagePrompt, width: 1080, height: 1920 }),
  });

  if (!response.ok) {
    console.error(`[imageGenerator] Erro na cena ${scene.id}:`, response.statusText);
    return stub(scene);
  }

  const data = await response.json() as { url?: string };
  const imageUrl = data.url ?? "";

  // Baixa a imagem e salva localmente
  const imgResponse = await fetch(imageUrl);
  const buffer = Buffer.from(await imgResponse.arrayBuffer());
  const fileName = `src/images/generated/${scene.id}-${Date.now()}.jpg`;

  const { writeFile } = await import("fs/promises");
  await writeFile(fileName, buffer);
  return fileName;
}

function stub(scene: Scene): string {
  const fileName = `src/images/generated/${scene.id}-stub.jpg`;
  console.log(`[imageGenerator] Stub → ${fileName} | prompt: ${scene.imagePrompt.slice(0, 60)}`);
  return fileName;
}
