import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../../types/pipeline";

interface VideoSceneProps {
  scene: Scene;
}

export function VideoScene({ scene }: VideoSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = scene.durationInSeconds * fps;

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [totalFrames - 15, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const finalOpacity = Math.min(opacity, fadeOut);

  const textY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0D0D0D", opacity: finalOpacity }}>
      {/* Gradiente de fundo (placeholder enquanto não há imagem real) */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #0D0D0D 100%)",
        }}
      />

      {/* Overlay gradiente */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.2) 60%, transparent 100%)",
        }}
      />

      {/* Texto da cena */}
      {(scene.type === "text" || scene.type === "image+text") && scene.text && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 80,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 48,
              fontWeight: 700,
              color: "#F0F0F0",
              textAlign: "center",
              lineHeight: 1.2,
              transform: `translateY(${textY}px)`,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            {scene.text}
          </p>
        </AbsoluteFill>
      )}

      {/* Badge — ID da cena (debug) */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          fontFamily: '"Space Mono", monospace',
          fontSize: 12,
          color: "#BFF549",
          background: "rgba(191,245,73,0.15)",
          border: "1px solid rgba(191,245,73,0.3)",
          padding: "4px 10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {scene.id}
      </div>
    </AbsoluteFill>
  );
}
