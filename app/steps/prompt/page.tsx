"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProject, saveProject } from "@/src/lib/projectStore";

const EXAMPLES = [
  "Vídeo meditativo com mantra de Ganesha, 40s, estilo psicodélico suave",
  "Motivacional para empreendedores, 30s, dark e poderoso com frases de impacto",
  "Canal espiritual: lei da atração, 60s, cinematográfico com partículas de luz",
  "Shorts educativo sobre IA, 20s, estilo futurista com glitch art",
  "Vídeo de afirmações positivas, 30s, minimalista com tipografia animada",
];

const TIPS = [
  "Inclua o tema principal e o clima desejado",
  "Especifique a duração (ex: 30s, 1min)",
  "Mencione o estilo visual (dark, neon, minimalista...)",
  "Indique o público-alvo ou plataforma (Shorts, Reels...)",
];

export default function PromptPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const saved = loadProject();
    if (saved.prompt) setPrompt(saved.prompt);
  }, []);

  function handleNext() {
    if (prompt.trim().length < 10) return;
    saveProject({ prompt: prompt.trim(), script: null, imagePaths: [], audioPath: null });
    router.push("/steps/roteiro");
  }

  return (
    <div>
      <p className="token" style={{ marginBottom: "var(--sp-3)" }}>Etapa 1 de 5</p>
      <h1
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          lineHeight: "var(--line-tight)",
          marginBottom: "var(--sp-2)",
        }}
      >
        Qual é a ideia do vídeo?
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--sp-8)" }}>
        Descreva o vídeo que você quer criar. Quanto mais detalhes, melhor o roteiro.
      </p>

      {/* Textarea principal */}
      <div className="card" style={{ marginBottom: "var(--sp-4)" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: vídeo meditativo com mantra de Ganesha, 40 segundos, estilo psicodélico suave, para YouTube Shorts..."
          rows={6}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-md)",
            lineHeight: "var(--line-relaxed)",
            resize: "vertical",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleNext();
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "var(--sp-3)",
            paddingTop: "var(--sp-3)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: prompt.length < 10 ? "var(--color-danger)" : "var(--color-text-muted)",
            }}
          >
            {prompt.length} caracteres {prompt.length < 10 ? "(mínimo 10)" : ""}
          </span>
          <button
            className="btn-primary btn"
            onClick={handleNext}
            disabled={prompt.trim().length < 10}
            style={{ opacity: prompt.trim().length < 10 ? 0.4 : 1 }}
          >
            Gerar Roteiro →
          </button>
        </div>
      </div>

      {/* Dicas */}
      <div style={{ display: "flex", gap: "var(--sp-8)", marginBottom: "var(--sp-6)" }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "var(--sp-3)",
            }}
          >
            Dicas
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            {TIPS.map((tip) => (
              <li
                key={tip}
                style={{
                  display: "flex",
                  gap: "var(--sp-2)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                }}
              >
                <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Exemplos */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--sp-3)",
        }}
      >
        Exemplos
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="btn btn-ghost"
            onClick={() => setPrompt(ex)}
            style={{
              textAlign: "left",
              justifyContent: "flex-start",
              fontSize: "var(--text-sm)",
              padding: "var(--sp-3) var(--sp-4)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-surface)",
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
