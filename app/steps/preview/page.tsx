"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProject } from "@/src/lib/projectStore";
import type { VideoScript } from "@/src/types/pipeline";

export default function PreviewPage() {
  const router = useRouter();
  const [script, setScript] = useState<VideoScript | null>(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const project = loadProject();
    if (!project.script) { router.push("/steps/roteiro"); return; }
    setScript(project.script);
    setPrompt(project.prompt);
  }, []);

  if (!script) return null;

  const totalDuration = script.scenes.reduce((a, s) => a + s.durationInSeconds, 0);

  return (
    <div>
      <p className="token" style={{ marginBottom: "var(--sp-3)" }}>Etapa 4 de 5</p>
      <h1
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          lineHeight: "var(--line-tight)",
          marginBottom: "var(--sp-2)",
        }}
      >
        Confirmar e Gerar
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--sp-8)" }}>
        Revise o resumo abaixo antes de iniciar a geração.
      </p>

      {/* Card principal */}
      <div className="card card-raised" style={{ marginBottom: "var(--sp-4)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--sp-3)" }}>
          {script.title}
        </h2>

        <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
          <span className="token token-primary">{totalDuration}s</span>
          <span className="token">{script.scenes.length} cenas</span>
          <span className="token">{script.style}</span>
        </div>

        {/* Prompt original */}
        <Section label="Prompt original">
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{prompt}</p>
        </Section>

        {/* Música */}
        <Section label="Música (Suno)">
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-2)" }}>
            <span className="token">{script.audioMetadata.genre}</span>
            <span className="token">{script.audioMetadata.bpm} bpm</span>
            <span className="token">{script.audioMetadata.mood}</span>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            {script.audioMetadata.prompt}
          </p>
        </Section>

        {/* Cenas resumidas */}
        <Section label={`${script.scenes.length} Cenas`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {script.scenes.map((scene, i) => (
              <div
                key={scene.id}
                style={{
                  display: "flex",
                  gap: "var(--sp-3)",
                  padding: "var(--sp-2) var(--sp-3)",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-primary)",
                    minWidth: 20,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "var(--text-sm)", flex: 1 }}>{scene.text}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {scene.durationInSeconds}s
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn" onClick={() => router.push("/steps/cenas")}>
          ← Editar Cenas
        </button>
        <button className="btn btn-primary" onClick={() => router.push("/steps/gerando")}>
          Confirmar e Gerar →
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--sp-4)" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--sp-2)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
