import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinemai Lab · Vídeo com IA",
  description: "Automatize a criação de vídeos com IA. Prompt → Roteiro → Cena → Vídeo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
