import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/src/scripts/generateScript";
import { generateAudio } from "@/src/audio/sunoClient";
import { generateImages } from "@/src/images/imageGenerator";
import type { PipelineResult } from "@/src/types/pipeline";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json() as { prompt: string };

  if (!prompt || prompt.trim().length < 5) {
    return NextResponse.json({ error: "Prompt muito curto." }, { status: 400 });
  }

  try {
    // 1. Gera roteiro com Claude
    const script = await generateScript(prompt.trim());

    // 2. Gera áudio (Suno ou stub)
    const audioPath = await generateAudio(script.audioMetadata);
    script.audioMetadata.filePath = audioPath;

    // 3. Gera imagens para cada cena
    const imagePaths = await generateImages(script.scenes);
    script.scenes.forEach((scene, i) => {
      scene.imagePath = imagePaths[i];
    });

    const result: PipelineResult = {
      script,
      audioPath,
      imagePaths,
      status: "success",
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message, status: "error" }, { status: 500 });
  }
}
