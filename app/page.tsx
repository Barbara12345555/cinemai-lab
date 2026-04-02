"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadProject, clearProject } from "@/src/lib/projectStore";

const STEPS = [
  { href: "/steps/prompt",  num: "01", label: "Prompt",   desc: "Descreva o vídeo que você quer criar" },
  { href: "/steps/roteiro", num: "02", label: "Roteiro",  desc: "IA gera roteiro estruturado em JSON"   },
  { href: "/steps/cenas",   num: "03", label: "Cenas",    desc: "Revise e edite cada cena do vídeo"     },
  { href: "/steps/preview", num: "04", label: "Preview",  desc: "Confirme tudo antes de gerar"          },
  { href: "/steps/gerando", num: "05", label: "Geração",  desc: "Pipeline gera imagens, áudio e vídeo"  },
];

export default function Home() {
  const router = useRouter();
  const [hasProject, setHasProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    const p = loadProject();
    if (p.script) {
      setHasProject(true);
      setProjectTitle(p.script.title);
    } else if (p.prompt) {
      setHasProject(true);
      setProjectTitle(p.prompt.slice(0, 60) + "...");
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh" }} suppressHydrationWarning>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-raised)",
          padding: "var(--sp-4) var(--sp-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "var(--text-lg)",
            color: "var(--color-primary)",
          }}
        >
          CINEMAI LAB
        </span>
        <span className="token">v0.1.0</span>
      </header>

      <main
        style={{
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
          padding: "var(--sp-16) var(--sp-4)",
        }}
      >
        {/* Hero */}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: "var(--line-tight)",
            marginBottom: "var(--sp-4)",
          }}
        >
          Prompt{" "}
          <span style={{ color: "var(--color-primary)" }}>→</span> Vídeo
          <br />
          com IA
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-lg)",
            maxWidth: 480,
            marginBottom: "var(--sp-10)",
          }}
        >
          Automatize 80% da criação de vídeos curtos. Um prompt é tudo que você precisa.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap", marginBottom: "var(--sp-16)" }}>
          <Link href="/steps/prompt" className="btn-primary btn" style={{ fontSize: "var(--text-md)", padding: "14px 28px" }}>
            + Novo Projeto
          </Link>
          {hasProject && (
            <button
              className="btn"
              onClick={() => {
                const p = loadProject();
                if (p.script) router.push("/steps/cenas");
                else router.push("/steps/roteiro");
              }}
              style={{ fontSize: "var(--text-md)", padding: "14px 28px" }}
            >
              Continuar projeto →
            </button>
          )}
        </div>

        {/* Projeto em andamento */}
        {hasProject && (
          <div className="card card-raised" style={{ marginBottom: "var(--sp-10)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Projeto em andamento
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => { clearProject(); setHasProject(false); }}
                style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}
              >
                Descartar
              </button>
            </div>
            <p style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{projectTitle}</p>
          </div>
        )}

        {/* Pipeline visual */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--sp-4)",
          }}
        >
          Pipeline
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          {STEPS.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-4)",
                padding: "var(--sp-4)",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                textDecoration: "none",
                color: "var(--color-text)",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.background = "var(--color-bg-raised)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.background = "var(--color-bg-surface)";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-primary)",
                  minWidth: 24,
                }}
              >
                {step.num}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{step.label}</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{step.desc}</p>
              </div>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
