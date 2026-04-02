import Link from "next/link";
import { StepNavigation } from "@/components/StepNavigation";

export default function StepsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-raised)",
          padding: "0 var(--sp-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
            color: "var(--color-primary)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          ← CINEMAI
        </Link>

        <StepNavigation />
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
          padding: "var(--sp-10) var(--sp-4)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
