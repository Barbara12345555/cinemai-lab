"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProject, saveProject } from "@/src/lib/projectStore";
import type { VideoScript, Scene } from "@/src/types/pipeline";

function SceneCard({
  scene,
  index,
  onChange,
}: {
  scene: Scene;
  index: number;
  onChange: (updated: Scene) => void;
}) {
  const [open, setOpen] = useState(index === 0);

  function update(field: keyof Scene, value: string | number) {
    onChange({ ...scene, [field]: value });
  }

  return (
    <div
      className="card"
      style={{ marginBottom: "var(--sp-3)", borderColor: open ? "var(--color-primary)" : "var(--color-border)" }}
    >
      {/* Header da cena */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          color: "var(--color-text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 0,
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-primary)",
              minWidth: 24,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
            {scene.text || `Cena ${index + 1}`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
          <span className="token">{scene.durationInSeconds}s</span>
          <span className="token">{scene.type}</span>
          <span
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
            }}
          >
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Campos editáveis */}
      {open && (
        <div style={{ marginTop: "var(--sp-4)", display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          <Field
            label="Texto na tela"
            value={scene.text}
            onChange={(v) => update("text", v)}
            multiline
          />
          <Field
            label="Prompt de imagem (Midjourney)"
            value={scene.imagePrompt}
            onChange={(v) => update("imagePrompt", v)}
            multiline
            mono
          />
          <div style={{ display: "flex", gap: "var(--sp-4)" }}>
            <div style={{ flex: 1 }}>
              <Field
                label="Duração (segundos)"
                value={String(scene.durationInSeconds)}
                onChange={(v) => update("durationInSeconds", Number(v) || scene.durationInSeconds)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "var(--sp-1)",
                }}
              >
                Tipo
              </label>
              <select
                value={scene.type}
                onChange={(e) => update("type", e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  padding: "8px var(--sp-2)",
                  borderRadius: "var(--radius-none)",
                  outline: "none",
                }}
              >
                <option value="image+text">image+text</option>
                <option value="text">text</option>
                <option value="image">image</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  mono?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
    fontSize: mono ? "var(--text-xs)" : "var(--text-sm)",
    padding: "8px var(--sp-2)",
    borderRadius: "var(--radius-none)",
    outline: "none",
    resize: "vertical" as const,
    lineHeight: "var(--line-relaxed)",
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--sp-1)",
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} style={sharedStyle} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={sharedStyle} />
      )}
    </div>
  );
}

export default function CenasPage() {
  const router = useRouter();
  const [script, setScript] = useState<VideoScript | null>(null);

  useEffect(() => {
    const project = loadProject();
    if (!project.script) { router.push("/steps/roteiro"); return; }
    setScript(project.script);
  }, []);

  function updateScene(index: number, updated: Scene) {
    if (!script) return;
    const scenes = [...script.scenes];
    scenes[index] = updated;
    const newScript = { ...script, scenes };
    setScript(newScript);
    saveProject({ script: newScript });
  }

  if (!script) return null;

  const totalDuration = script.scenes.reduce((a, s) => a + s.durationInSeconds, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <p className="token">Etapa 3 de 5</p>
        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <span className="token token-primary">{script.scenes.length} cenas</span>
          <span className="token">{totalDuration}s total</span>
        </div>
      </div>

      <h1
        style={{
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          lineHeight: "var(--line-tight)",
          marginBottom: "var(--sp-2)",
        }}
      >
        Editar Cenas
      </h1>

      {/* Música */}
      <div
        className="card"
        style={{
          marginBottom: "var(--sp-6)",
          borderColor: "rgba(191,245,73,0.2)",
          background: "var(--color-primary-soft)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--sp-2)",
          }}
        >
          Prompt de Música (Suno)
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
          {script.audioMetadata.prompt}
        </p>
        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-2)" }}>
          <span className="token">{script.audioMetadata.genre}</span>
          <span className="token">{script.audioMetadata.bpm} bpm</span>
          <span className="token">{script.audioMetadata.mood}</span>
          <span className="token">{script.audioMetadata.durationInSeconds}s</span>
        </div>
      </div>

      {/* Cenas */}
      {script.scenes.map((scene, i) => (
        <SceneCard key={scene.id} scene={scene} index={i} onChange={(updated) => updateScene(i, updated)} />
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--sp-4)" }}>
        <button className="btn" onClick={() => router.push("/steps/roteiro")}>
          ← Roteiro
        </button>
        <button className="btn btn-primary" onClick={() => router.push("/steps/preview")}>
          Preview →
        </button>
      </div>
    </div>
  );
}
