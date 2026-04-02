"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadProject, saveProject, clearProject } from "@/src/lib/projectStore";

type StepStatus = "pending" | "running" | "done" | "error";

interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  status: StepStatus;
}

const INITIAL_STEPS: PipelineStep[] = [
  { id: "roteiro",  label: "Roteiro",  detail: "Validando estrutura de cenas...", status: "pending" },
  { id: "imagens",  label: "Imagens",  detail: "Gerando imagens por cena...",     status: "pending" },
  { id: "audio",    label: "Áudio",    detail: "Gerando trilha sonora (Suno)...", status: "pending" },
  { id: "video",    label: "Vídeo",    detail: "Compondo vídeo no Remotion...",   status: "pending" },
];

const STATUS_COLOR: Record<StepStatus, string> = {
  pending: "var(--color-border)",
  running: "var(--color-primary)",
  done:    "var(--color-success)",
  error:   "var(--color-danger)",
};

export default function GerandoPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const project = loadProject();
    if (!project.script) { router.push("/steps/roteiro"); return; }
    if (!started.current) { started.current = true; runPipeline(); }
  }, []);

  async function handleDownload() {
    setRendering(true);
    setRenderError(null);
    try {
      const res = await fetch("/api/render", { method: "POST" });
      if (!res.ok) {
        const data = await res.json() as { error: string };
        throw new Error(data.error);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cinemai-video.mp4";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "Erro ao renderizar");
    } finally {
      setRendering(false);
    }
  }

  function setStepStatus(id: string, status: StepStatus) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  async function runPipeline() {
    const project = loadProject();
    if (!project.script) return;

    try {
      // 1. Roteiro — já existe, só valida
      setStepStatus("roteiro", "running");
      await delay(800);
      setStepStatus("roteiro", "done");

      // 2. Imagens + 3. Áudio — chamada à API (Node.js, não browser)
      setStepStatus("imagens", "running");
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: project.script }),
      });
      if (!res.ok) throw new Error(`Pipeline error ${res.status}`);
      const data = await res.json() as { imagePaths: string[]; audioPath: string };

      saveProject({ imagePaths: data.imagePaths });
      setStepStatus("imagens", "done");

      setStepStatus("audio", "running");
      await delay(400);
      saveProject({ audioPath: data.audioPath });
      setStepStatus("audio", "done");

      // 4. Vídeo (Remotion render é feito via CLI)
      setStepStatus("video", "running");
      await delay(1200);
      setStepStatus("video", "done");

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setSteps((prev) =>
        prev.map((s) => (s.status === "running" ? { ...s, status: "error" } : s))
      );
    }
  }

  const completedCount = steps.filter((s) => s.status === "done").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div>
      <p className="token" style={{ marginBottom: "var(--sp-3)" }}>Etapa 5 de 5</p>
      <h1
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          lineHeight: "var(--line-tight)",
          marginBottom: "var(--sp-2)",
        }}
      >
        {done ? "Vídeo Gerado!" : "Gerando Vídeo..."}
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--sp-8)" }}>
        {done
          ? "Todos os assets foram gerados com sucesso."
          : "Aguarde enquanto processamos cada etapa do pipeline."}
      </p>

      {/* Barra de progresso */}
      <div
        style={{
          height: 4,
          background: "var(--color-border)",
          marginBottom: "var(--sp-8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progress}%`,
            background: done ? "var(--color-success)" : "var(--color-primary)",
            transition: "width 0.5s ease, background 0.3s ease",
            boxShadow: done ? "none" : "var(--shadow-glow)",
          }}
        />
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", marginBottom: "var(--sp-8)" }}>
        {steps.map((step) => (
          <div
            key={step.id}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sp-4)",
              borderColor:
                step.status === "running"
                  ? "var(--color-primary)"
                  : step.status === "done"
                  ? "var(--color-success)"
                  : step.status === "error"
                  ? "var(--color-danger)"
                  : "var(--color-border)",
              transition: "border-color 0.3s",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: STATUS_COLOR[step.status],
                flexShrink: 0,
                animation: step.status === "running" ? "pulse 1s infinite" : "none",
                transition: "background 0.3s",
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{step.label}</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                {step.detail}
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: STATUS_COLOR[step.status],
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {step.status === "pending" ? "aguardando" : step.status === "running" ? "processando" : step.status}
            </span>
          </div>
        ))}
      </div>

      {/* Erro */}
      {error && (
        <div className="card" style={{ borderColor: "var(--color-danger)", marginBottom: "var(--sp-4)" }}>
          <p style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
            Erro: {error}
          </p>
        </div>
      )}

      {/* Concluído */}
      {done && (
        <div
          className="card card-raised"
          style={{ borderColor: "var(--color-success)", marginBottom: "var(--sp-4)" }}
        >
          <p style={{ fontWeight: 700, marginBottom: "var(--sp-2)" }}>Assets gerados com sucesso</p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--sp-6)" }}>
            Clique no botão para renderizar e baixar o vídeo final.
          </p>

          {renderError && (
            <p style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", marginBottom: "var(--sp-4)" }}>
              Erro: {renderError}
            </p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={rendering}
            style={{ width: "100%", justifyContent: "center", opacity: rendering ? 0.6 : 1 }}
          >
            {rendering ? "Renderizando... aguarde" : "⬇ Baixar Vídeo (.mp4)"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-ghost"
          onClick={() => { clearProject(); router.push("/"); }}
          style={{ fontSize: "var(--text-xs)" }}
        >
          Novo Projeto
        </button>
        {!done && !error && (
          <button className="btn" onClick={() => router.push("/steps/preview")}>
            ← Voltar
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
