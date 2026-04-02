import { Composition, Series, Audio, staticFile } from "remotion";
import { VideoScene } from "./compositions/VideoScene";
import type { VideoScript } from "../types/pipeline";

// Composição de exemplo para preview no Remotion Studio
const EXAMPLE_SCRIPT: VideoScript = {
  title: "Exemplo Cinemai Lab",
  totalDurationInSeconds: 20,
  style: "dark brutalista",
  scenes: [
    {
      id: "scene-1",
      durationInSeconds: 7,
      text: "Bem-vindo ao Cinemai Lab",
      imagePrompt: "dark mystical forest with glowing green particles",
      type: "text",
    },
    {
      id: "scene-2",
      durationInSeconds: 7,
      text: "Prompt → Vídeo com IA",
      imagePrompt: "futuristic dark studio with neon green lights",
      type: "text",
    },
    {
      id: "scene-3",
      durationInSeconds: 6,
      text: "Crie. Automatize. Publique.",
      imagePrompt: "abstract dark waves with acid green energy",
      type: "text",
    },
  ],
  audioMetadata: {
    genre: "ambient electronic",
    bpm: 80,
    mood: "mysterious",
    durationInSeconds: 20,
    prompt: "ambient dark electronic mysterious 80bpm",
  },
};

interface VideoCompositionProps {
  script: VideoScript;
}

function VideoComposition({ script }: VideoCompositionProps) {
  const fps = 30;

  return (
    <>
      {script.audioMetadata.filePath && (
        <Audio src={staticFile(script.audioMetadata.filePath)} />
      )}
      <Series>
        {script.scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.durationInSeconds * fps)}
          >
            <VideoScene scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
}

export function RemotionRoot() {
  const fps = 30;
  const totalFrames = EXAMPLE_SCRIPT.scenes.reduce(
    (acc, s) => acc + Math.round(s.durationInSeconds * fps),
    0
  );

  return (
    <Composition
      id="VideoScene"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={VideoComposition as any}
      durationInFrames={totalFrames}
      fps={fps}
      width={1080}
      height={1920}
      defaultProps={{ script: EXAMPLE_SCRIPT }}
    />
  );
}
