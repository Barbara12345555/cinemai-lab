"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { label: "Prompt",   href: "/steps/prompt"  },
  { label: "Roteiro",  href: "/steps/roteiro" },
  { label: "Cenas",    href: "/steps/cenas"   },
  { label: "Preview",  href: "/steps/preview" },
  { label: "Gerando",  href: "/steps/gerando" },
];

export function StepNavigation() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => pathname.startsWith(s.href));

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        overflowX: "auto",
      }}
    >
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.href} style={{ display: "flex", alignItems: "center" }}>
            <Link
              href={step.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textDecoration: "none",
                color: isActive
                  ? "var(--color-primary)"
                  : isDone
                  ? "var(--color-success)"
                  : "var(--color-text-muted)",
                borderBottom: isActive
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  background: isActive
                    ? "var(--color-primary)"
                    : isDone
                    ? "var(--color-success)"
                    : "var(--color-bg-raised)",
                  color: isActive || isDone ? "#111" : "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {isDone ? "✓" : i + 1}
              </span>
              {step.label}
            </Link>

            {i < STEPS.length - 1 && (
              <span
                style={{
                  color: "var(--color-border)",
                  fontSize: "var(--text-xs)",
                  padding: "0 2px",
                  userSelect: "none",
                }}
              >
                /
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
