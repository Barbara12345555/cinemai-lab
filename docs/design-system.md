# Design System – Cinemai Lab (Dark Brutal)

## 1. Visão geral

Sistema visual dark, minimalista e levemente brutalista, com verde ácido como cor primária, superfícies bem escuras, bordas retas e tipografia sem serifa + mono.

---

## 2. Tokens de cor

```ts
// Cores base
--color-bg:         #0D0D0D;  // fundo principal
--color-bg-surface: #141414;  // cards, painéis
--color-bg-raised:  #1A1A1A;  // dropdowns, tooltips, header

--color-primary:    #BFF549;  // CTA, highlights
--color-primary-soft: rgba(191,245,73,0.15); // fundos sutis

--color-text:       #F0F0F0;  // texto principal
--color-text-muted: #666666;  // labels, hints
--color-border:     #2A2A2A;  // bordas, divisores

--color-danger:     #FF3B3B;  // erro
--color-warning:    #FFB800;  // aviso
--color-success:    #56F27F;  // sucesso leve
```

---

## 3. Tipografia

```ts
--font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: "Space Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

--text-xs:  12px;
--text-sm:  14px;
--text-md:  16px; // base
--text-lg:  20px;
--text-xl:  24px;
--text-2xl: 32px;

--line-tight:   1.1;
--line-normal:  1.4;
--line-relaxed: 1.6;
```

**Uso recomendado:**

- Títulos: `--font-body`, `--text-xl` ou `--text-2xl`, `--line-tight`, peso 600–700.
- Corpo: `--font-body`, `--text-md`, `--line-normal`, peso 400.
- Código/labels/tokens: `--font-mono`, `--text-sm`.

---

## 4. Espaçamento e raio

```ts
--sp-1:  4px;
--sp-2:  8px;
--sp-3: 12px;
--sp-4: 16px;
--sp-6: 24px;
--sp-8: 32px;
--sp-10: 40px;
--sp-12: 48px;
--sp-16: 64px;

--radius-none: 0px;  // estilo reto/brutalista
--radius-sm:   4px;  // uso raro (chips/pills)
```

---

## 5. Sombras e efeitos

```ts
--shadow-glow: 0 0 20px rgba(191,245,73,0.25); // glow em elementos primários
--shadow-hard: 4px 4px 0 #BFF549;              // sombra dura decorativa
```

**Uso:**

- Botão primário → `--shadow-glow` no foco/hover.
- Cards "hero" / destaque → `--shadow-hard`.

---

## 6. Componentes base

### 6.1. Botões

```css
.button {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 10px 18px;
  border-radius: var(--radius-none);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    transform 0.08s ease,
    box-shadow 0.12s ease;
}

.button--primary {
  background: var(--color-primary);
  color: #111111;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hard);
}

.button--primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-primary);
}

.button--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
```

---

### 6.2. Cards / superfícies

```css
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  padding: var(--sp-4);
  border-radius: var(--radius-none);
}

.card--raised {
  background: var(--color-bg-raised);
  box-shadow: var(--shadow-hard);
}
```

---

### 6.3. Tokens / pills

```css
.token {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border-radius: var(--radius-none);
  border: 1px solid var(--color-border);
  background: rgba(255,255,255,0.02);
  color: var(--color-text-muted);
}
```

---

## 7. Layout

- Background global: `var(--color-bg)`.
- Conteúdo em colunas com `gap` generoso (`var(--sp-8)` ou `var(--sp-12)`).
- Divisores finos usando `var(--color-border)` entre seções.
- Largura máxima de conteúdo: 960–1200px, centralizado, com padding lateral `var(--sp-4)`.

---

## 8. Implementação rápida

No entry global de estilo (ex.: `globals.css` ou `styles.css`):

```css
:root {
  --color-bg:         #0D0D0D;
  --color-bg-surface: #141414;
  --color-bg-raised:  #1A1A1A;
  --color-primary:    #BFF549;
  --color-primary-soft: rgba(191,245,73,0.15);
  --color-text:       #F0F0F0;
  --color-text-muted: #666666;
  --color-border:     #2A2A2A;
  --color-danger:     #FF3B3B;
  --color-warning:    #FFB800;
  --color-success:    #56F27F;

  --font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-xs:  12px;
  --text-sm:  14px;
  --text-md:  16px;
  --text-lg:  20px;
  --text-xl:  24px;
  --text-2xl: 32px;

  --line-tight:   1.1;
  --line-normal:  1.4;
  --line-relaxed: 1.6;

  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-6: 24px;
  --sp-8: 32px;
  --sp-10: 40px;
  --sp-12: 48px;
  --sp-16: 64px;

  --radius-none: 0px;
  --radius-sm:   4px;

  --shadow-glow: 0 0 20px rgba(191,245,73,0.25);
  --shadow-hard: 4px 4px 0 #BFF549;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: var(--line-normal);
}
```
