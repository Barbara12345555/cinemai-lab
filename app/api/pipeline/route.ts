import { NextRequest, NextResponse } from "next/server";
import { generateImages } from "@/src/images/imageGenerator";
import { generateAudio } from "@/src/audio/sunoClient";
import type { VideoScript } from "@/src/types/pipeline";

export async function POST(req: NextRequest) {
  const { script } = await req.json() as { script: VideoScript };

  if (!script) {
    return NextResponse.json({ error: "Script ausente." }, { status: 400 });
  }

  const imagePaths = await generateImages(script.scenes);
  const audioPath = await generateAudio(script.audioMetadata);

  return NextResponse.json({ imagePaths, audioPath });
}
