"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadProject, saveProject } from "@/src/lib/projectStore";
import type { VideoScript } from "@/src/types/pipeline";

export default function RoteiroPage() {
  const router = useRouter();
  const [script, setScript] = useState<VideoScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonEdit, setJsonEdit] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const project = loadProject();
    if (!project.prompt) { router.push("/steps/prompt"); return; }
    if (project.script) {
      setScript(project.script);
      setJsonEdit(JSON.stringify(project.script, null, 2));
    } else if (!started.current) {
      started.current = true;
      generate(project.prompt);
    }
  }, []);

  async function generate(prompt: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json() as { script?: VideoScript; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar");
      const s = data.script!;
      setScript(s);
      setJsonEdit(JSON.stringify(s, null, 2));
      saveProject({ script: s });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  function handleJsonChange(value: string) {
    setJsonEdit(value);
    try {
      const parsed = JSON.parse(value) as VideoScript;
      setScript(parsed);
      setJsonError(null);
      saveProject({ script: parsed });
    } catch {
      setJsonError("JSON inválido — corrija antes de continuar");
    }
  }

  function handleRegenerate() {
    const project = loadProject();
    if (project.prompt) generate(project.prompt);
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "var(--sp-16) 0" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--color-primary)",
            marginBottom: "var(--sp-4)",
          }}
        >
          Gerando roteiro...
        </p>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          Claude está criando seu roteiro. Isso leva alguns segundos.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="token" style={{ marginBottom: "var(--sp-3)" }}>Etapa 2 de 5</p>
        <div className="card" style={{ borderColor: "var(--color-danger)", marginBottom: "var(--sp-4)" }}>
          <p style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
            Erro: {error}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleRegenerate}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!script) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <p className="token">Etapa 2 de 5</p>
        <button className="btn btn-ghost" onClick={handleRegenerate} style={{ fontSize: "var(--text-xs)" }}>
          ↺ Regenerar
        </button>
      </div>

      <h1
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          lineHeight: "var(--line-tight)",
          marginBottom: "var(--sp-2)",
        }}
      >
        {script.title}
      </h1>

      {/* Resumo */}
      <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
        <span className="token token-primary">{script.totalDurationInSeconds}s</span>
        <span className="token">{script.style}</span>
        <span className="token">{script.scenes.length} cenas</span>
        <span className="token">{script.audioMetadata.genre}</span>
        <span className="token">{script.audioMetadata.bpm} bpm</span>
      </div>

      {/* Editor JSON */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--sp-2)",
        }}
      >
        Editar roteiro (JSON)
      </p>
      <div className="card" style={{ marginBottom: "var(--sp-2)", borderColor: jsonError ? "var(--color-danger)" : "var(--color-border)" }}>
        <textarea
          value={jsonEdit}
          onChange={(e) => handleJsonChange(e.target.value)}
          rows={20}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: "var(--color-text)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
          }}
          spellCheck={false}
        />
      </div>
      {jsonError && (
        <p style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", marginBottom: "var(--sp-4)" }}>
          {jsonError}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/steps/cenas")}
          disabled={!!jsonError}
          style={{ opacity: jsonError ? 0.4 : 1 }}
        >
          Ver Cenas →
        </button>
      </div>
    </div>
  );
}
